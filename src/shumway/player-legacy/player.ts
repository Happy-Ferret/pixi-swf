/**
 * Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module Shumway.Player {
	import assert = Shumway.Debug.assert;
	import somewhatImplemented = Shumway.Debug.somewhatImplemented;
	import flash = Shumway.flash;
	import DataBuffer = Shumway.ArrayUtilities.DataBuffer;

	import Event = flash.events.Event;
	import BitmapData = flash.display.BitmapData;
	import ISecurityDomain = flash.system.ISecurityDomain;

	import MouseEventAndPointData = Shumway.flash.ui.MouseEventAndPointData;
	import MouseEventDispatcher = flash.ui.MouseEventDispatcher;
	import KeyboardEventData = Shumway.flash.ui.KeyboardEventData;
	import KeyboardEventDispatcher = flash.ui.KeyboardEventDispatcher;
	import FocusEventData = Shumway.Remoting.Player.FocusEventData;

	import IBitmapDataSerializer = flash.display.IBitmapDataSerializer;
	import IAssetResolver = Timeline.IAssetResolver;
	import IFSCommandListener = flash.system.IFSCommandListener;
	import IVideoElementService = flash.net.IVideoElementService;
	import IRootElementService = flash.display.IRootElementService;
	import ICrossDomainSWFLoadingWhitelist = flash.system.ICrossDomainSWFLoadingWhitelist;
	import CrossDomainSWFLoadingWhitelistResult = flash.system.CrossDomainSWFLoadingWhitelistResult;
	import MessageTag = Shumway.Remoting.MessageTag;
	import VideoControlEvent = Shumway.Remoting.VideoControlEvent;
	import VideoPlaybackEvent = Shumway.Remoting.VideoPlaybackEvent;

	import DisplayParameters = Shumway.Remoting.DisplayParameters;

	import FocusEventType = Remoting.FocusEventType;
	import IGFXService = Shumway.Remoting.IGFXService;
	import IGFXServiceObserver = Shumway.Remoting.IGFXServiceObserver;

	/**
	 * Base class implementation of the IGFXServer. The different transports shall
	 * inherit this class
	 */
	export class GFXServiceBase implements IGFXService {
		_observers: IGFXServiceObserver[] = [];

		public sec: ISecurityDomain;

		constructor(sec: ISecurityDomain) {
			this.sec = sec;
		}

		addObserver(observer: IGFXServiceObserver) {
			this._observers.push(observer);
		}

		removeObserver(observer: IGFXServiceObserver) {
			let i = this._observers.indexOf(observer);
			if (i >= 0) {
				this._observers.splice(i, 1);
			}
		}

		update(updates: DataBuffer, assets: any[]): void {
			throw new Error('This method is abstract');
		}

		updateAndGet(updates: DataBuffer, assets: any[]): any {
			throw new Error('This method is abstract');
		}

		frame(): void {
			throw new Error('This method is abstract');
		}

		videoControl(id: number, eventType: VideoControlEvent, data: any): any {
			throw new Error('This method is abstract');
		}

		registerFont(syncId: number, data: Uint8Array): Promise<any> {
			throw new Error('This method is abstract');
		}

		registerImage(syncId: number, symbolId: number, imageType: ImageType,
		              data: Uint8Array, alphaData: Uint8Array): Promise<any> {
			throw new Error('This method is abstract');
		}

		fscommand(command: string, args: string): void {
			throw new Error('This method is abstract');
		}

		public processUpdates(updates: DataBuffer, assets: any []) {
			let deserializer = new Remoting.Player.PlayerChannelDeserializer(
				this.sec, updates, assets);

			let message = deserializer.read();
			switch (message.tag) {
				case MessageTag.KeyboardEvent:
					this._observers.forEach(function (observer) {
						observer.keyboardEvent(message);
					});
					break;
				case MessageTag.MouseEvent:
					this._observers.forEach(function (observer) {
						observer.mouseEvent(message);
					});
					break;
				case MessageTag.FocusEvent:
					this._observers.forEach(function (observer) {
						observer.focusEvent(message);
					});
					break;
			}
		}

		public processDisplayParameters(displayParameters: DisplayParameters) {
			this._observers.forEach(function (observer) {
				observer.displayParameters(displayParameters);
			});
		}

		public processVideoEvent(id: number, eventType: VideoPlaybackEvent, data: any) {
			this._observers.forEach(function (observer) {
				observer.videoEvent(id, eventType, data);
			});
		}
	}

	/**
	 * Helper class to handle GFXService notifications/events and forward them to
	 * the Player object.
	 */
	class GFXServiceObserver implements IGFXServiceObserver {
		private _player: Player;
		private _mouseEventDispatcher: MouseEventDispatcher;
		private _keyboardEventDispatcher: KeyboardEventDispatcher;
		private _videoEventListeners: { (eventType: VideoPlaybackEvent, data: any): void }[] = [];
		private _writer: IndentingWriter;

		constructor(player: Player) {
			this._player = player;
			this._keyboardEventDispatcher = new KeyboardEventDispatcher();
			this._mouseEventDispatcher = new MouseEventDispatcher();
			this._writer = new IndentingWriter();
		}

		videoEvent(id: number, eventType: VideoPlaybackEvent, data: any) {
			let listener = this._videoEventListeners[id];
			Debug.assert(listener, 'Video event listener is not found');
			listener(eventType, data);
		}

		displayParameters(displayParameters: DisplayParameters) {
			this._player._stage.setStageContainerSize(displayParameters.stageWidth, displayParameters.stageHeight, displayParameters.pixelRatio);
		}

		focusEvent(data: any) {
			let message: FocusEventData = data;
			let focusType = message.type;
			switch (focusType) {
				case FocusEventType.DocumentHidden:
					this._player._isPageVisible = false;
					break;
				case FocusEventType.DocumentVisible:
					this._player._isPageVisible = true;
					break;
				case FocusEventType.WindowBlur:
					// TODO: This is purposely disabled so that applications don't pause when they are out of
					// focus while the debugging window is open.
					// EventDispatcher.broadcastEventDispatchQueue.dispatchEvent(Event.getBroadcastInstance(Event.DEACTIVATE));
					this._player._hasFocus = false;
					break;
				case FocusEventType.WindowFocus:
					let events = this._player.sec.events;
					events.broadcastEventDispatchQueue.dispatchEvent(events.getBroadcastInstance(Event.ACTIVATE));
					this._player._hasFocus = true;
					break;
			}

		}

		keyboardEvent(data: any) {
			let message: KeyboardEventData = data;
			// If the stage doesn't have a focus then dispatch events on the stage
			// directly.
			let target = this._player._stage.focus ? this._player._stage.focus : this._player._stage;
			this._keyboardEventDispatcher.target = target;
			this._keyboardEventDispatcher.dispatchKeyboardEvent(message);
		}

		mouseEvent(data: any) {
			let message: MouseEventAndPointData = data;
			this._mouseEventDispatcher.stage = this._player._stage;
			let target = this._mouseEventDispatcher.handleMouseEvent(message);
			if (traceMouseEventOption.value) {
				this._writer.writeLn("Mouse Event: type: " + message.type + ", point: " + message.point + ", target: " + target + (target ? ", name: " + target._name : ""));
				if (message.type === "click" && target) {
					target.debugTrace();
				}
			}
			this._player.currentMouseTarget = this._mouseEventDispatcher.currentTarget;
		}

		registerEventListener(id: number, listener: (eventType: VideoPlaybackEvent, data: any) => void) {
			this._videoEventListeners[id] = listener;
		}
	}

	/**
	 * Shumway Player
	 *
	 * This class brings everything together. Loads the swf, runs the event loop and
	 * synchronizes the frame tree with the display list.
	 */
	export class Player implements IBitmapDataSerializer, IFSCommandListener, IVideoElementService,
		IAssetResolver, IRootElementService, ICrossDomainSWFLoadingWhitelist {
		public sec: ISecurityDomain;

		_stage: flash.display.Stage;

		private _loader: flash.display.Loader;
		private _loaderInfo: flash.display.LoaderInfo;
		private _frameTimeout: number;
		private _eventLoopIsRunning: boolean;
		private _framesPlayed: number = 0;

		get framesPlayed() {
			return this._framesPlayed;
		}

		private _writer: IndentingWriter;

		private _gfxService: IGFXService;
		private _gfxServiceObserver: GFXServiceObserver;

		/**
		 * If set, overrides SWF file background color.
		 */
		public defaultStageColor: number;

		/**
		 * Movie parameters, such as flashvars.
		 */
		public movieParams: MapObject<string>;

		/**
		 * Initial stage alignment: l|r|t|tr|tl.
		 */
		public stageAlign: string;

		/**
		 * Initial stage scaling: showall|noborder|exactfit|noscale.
		 */
		public stageScale: string;

		/**
		 * Initial display parameters.
		 */
		public displayParameters: DisplayParameters;

		/**
		 * Timestamp of initialization start of the player itself, including iframe creation.
		 */
		public initStartTime: number;

		/**
		 * Time since the last time we've synchronized the display list.
		 */
		private _lastPumpTime = 0;

		/**
		 * Page Visibility API visible state.
		 */
		_isPageVisible = true;

		/**
		 * Page focus state.
		 */
		_hasFocus = true;

		/**
		 * Stage current mouse target.
		 */
		private _currentMouseTarget: flash.display.InteractiveObject = null;

		/**
		 * Indicates whether the |currentMouseTarget| has changed since the last time it was synchronized.
		 */
		private _currentMouseTargetIsDirty = true;

		set currentMouseTarget(value: flash.display.InteractiveObject) {
			if (this._currentMouseTarget !== value) {
				this._currentMouseTargetIsDirty = true;
			}
			this._currentMouseTarget = value;
		}

		/**
		 * Page URL that hosts SWF.
		 */
		private _pageUrl: string = null;

		/**
		 * SWF URL.
		 */
		private _swfUrl: string = null;

		/**
		 * Loader URL, can be different from SWF URL.
		 */
		private _loaderUrl: string = null;

		constructor(sec: ISecurityDomain, gfxService: IGFXService) {
			this.sec = sec;
			sec.player = this;
			// Freeze in debug builds.
			release || Object.defineProperty(this, 'sec', {value: sec});
			release || Debug.assert(gfxService);
			this._writer = new IndentingWriter();
			this._gfxService = gfxService;
			this._gfxServiceObserver = new GFXServiceObserver(this);
			this._gfxService.addObserver(this._gfxServiceObserver);
		}

		/**
		 * Movie stage object.
		 */
		get stage() {
			return this._stage;
		}

		/**
		 * Whether we can get away with rendering at a lower rate.
		 */
		private _shouldThrottleDownRendering() {
			return !this._isPageVisible;
		}

		/**
		 * Whether we can get away with executing frames at a lower rate.
		 */
		private _shouldThrottleDownFrameExecution() {
			return !this._isPageVisible;
		}

		public get pageUrl(): string {
			return this._pageUrl;
		}

		public set pageUrl(value: string) {
			this._pageUrl = value || null;
		}

		public get loaderUrl(): string {
			return this._loaderUrl;
		}

		public set loaderUrl(value: string) {
			this._loaderUrl = value || null;
		}

		public get swfUrl(): string {
			return this._swfUrl;
		}

		public load(url: string, buffer?: ArrayBuffer) {
			release || assert(!this._loader, "Can't load twice.");
			this._swfUrl = url;
			this._stage = this.sec.display.Stage.create();
			let loader = this._loader = this.sec.display.Loader.getRootLoader();
			let loaderInfo = this._loaderInfo = loader.contentLoaderInfo;
			if (playAllSymbolsOption.value) {
				// @ivanpopelyshev : how did it work?
				// TODO: add it back
				// this._playAllSymbols();
				loaderInfo._allowCodeExecution = false;
			} else {
				this._enterRootLoadingLoop();
			}
			let resolvedURL = FileLoadingService.instance.resolveUrl(url);
			this.addToSWFLoadingWhitelist(resolvedURL, false, true);
			let context = this.createLoaderContext();
			if (buffer) {
				let byteArray = this.sec.utils.ByteArray.create([buffer]);
				this._loader.loadBytes(byteArray, context);
				this._loader.contentLoaderInfo._url = resolvedURL;
			} else {
				this._loader.load(this.sec.net.URLRequest.create([url]), context);
			}
		}

		private createLoaderContext(): flash.system.LoaderContext {
			let loaderContext = this.sec.system.LoaderContext.create();
			// @ivanpopelyshev: createObject

			// if (this.movieParams) {
			// 	let parameters: any = this.sec.createObject();
			// 	for (let i in this.movieParams) {
			// 		parameters.axSetPublicProperty(i, this.movieParams[i]);
			// 	}
			// 	(loaderContext as any).parameters = <Shumway.AVMX.AS.ASObject>parameters;
			// }
			return loaderContext;
		}

		private _pumpDisplayListUpdates(): void {
			this.syncDisplayObject(this._stage, true);
		}

		public syncDisplayObject(displayObject: flash.display.DisplayObject,
		                         async: boolean): DataBuffer {
			let serializer = new Remoting.Player.PlayerChannelSerializer();
			if (this.sec.display.Stage.axIsType(displayObject)) {
				let stage = <flash.display.Stage>displayObject;
				serializer.writeStage(stage);
				if (this._currentMouseTargetIsDirty) {
					serializer.writeCurrentMouseTarget(stage, this._currentMouseTarget);
					this._currentMouseTargetIsDirty = false;
				}
			}
			serializer.writeDisplayObjectRoot(displayObject);
			serializer.writeEOF();

			enterTimeline("remoting assets");
			let output;
			if (async) {
				this._gfxService.update(serializer.output, serializer.outputAssets);
			} else {
				output = this._gfxService.updateAndGet(serializer.output, serializer.outputAssets).clone();
			}
			leaveTimeline("remoting assets");

			return output;
		}

		public requestBitmapData(bitmapData: BitmapData): DataBuffer {
			let serializer = new Remoting.Player.PlayerChannelSerializer();
			serializer.writeRequestBitmapData(bitmapData);
			serializer.writeEOF();
			return this._gfxService.updateAndGet(serializer.output, serializer.outputAssets).clone();
		}

		public drawToBitmap(bitmapData: flash.display.BitmapData, source: Shumway.Remoting.IRemotable,
		                    matrix: flash.geom.Matrix = null,
		                    colorTransform: flash.geom.ColorTransform = null, blendMode: string = null,
		                    clipRect: flash.geom.Rectangle = null, smoothing: boolean = false) {
			let serializer = new Shumway.Remoting.Player.PlayerChannelSerializer();
			serializer.writeBitmapData(bitmapData);

			if (this.sec.display.BitmapData.axIsType(source)) {
				serializer.writeBitmapData(<flash.display.BitmapData>source);
			} else {
				serializer.writeDisplayObjectRoot(<flash.display.DisplayObject>source);
			}

			serializer.writeDrawToBitmap(bitmapData, source, matrix, colorTransform, blendMode, clipRect, smoothing);
			serializer.writeEOF();

			enterTimeline("sendUpdates");
			this._gfxService.updateAndGet(serializer.output, serializer.outputAssets);
			leaveTimeline("sendUpdates");
		}

		public registerEventListener(id: number, listener: (eventType: VideoPlaybackEvent, data: any) => void) {
			this._gfxServiceObserver.registerEventListener(id, listener);
		}

		public notifyVideoControl(id: number, eventType: VideoControlEvent, data: any): any {
			return this._gfxService.videoControl(id, eventType, data);
		}

		public executeFSCommand(command: string, args: string) {
			switch (command) {
				case 'quit':
					this._leaveEventLoop();
					break;
				default:
					somewhatImplemented('FSCommand ' + command);
			}
			this._gfxService.fscommand(command, args);
		}

		public requestRendering(): void {
			this._pumpDisplayListUpdates();
		}

		/**
		 * Update the frame container with the latest changes from the display list.
		 */
		private _pumpUpdates() {
			if (!dontSkipFramesOption.value) {
				if (this._shouldThrottleDownRendering()) {
					return;
				}
				let timeSinceLastPump = performance.now() - this._lastPumpTime;
				if (timeSinceLastPump < (1000 / pumpRateOption.value)) {
					return;
				}
			}
			enterTimeline("pump");
			if (pumpEnabledOption.value) {
				this._pumpDisplayListUpdates();
				this._lastPumpTime = performance.now();
			}
			leaveTimeline("pump");
		}

		private _leaveSyncLoop(): void {
			release || assert(this._frameTimeout > -1);
			clearInterval(this._frameTimeout);
		}

		private _getFrameInterval(): number {
			let frameRate = frameRateOption.value;
			if (frameRate < 0) {
				frameRate = this._stage.frameRate;
			}
			return Math.floor(1000 / frameRate);
		}

		private _enterEventLoop(): void {
			this._eventLoopIsRunning = true;
			let self = this;

			function tick() {
				// TODO: change this to the mode described in
				// http://www.craftymind.com/2008/04/18/updated-elastic-racetrack-for-flash-9-and-avm2/
				self._frameTimeout = setTimeout(tick, self._getFrameInterval()) as any;
				self._eventLoopTick();
			}

			if (!isNaN(this.initStartTime)) {
				console.info('Time from init start to main event loop start: ' +
					(Date.now() - this.initStartTime));
			}
			tick();
		}

		private _leaveEventLoop(): void {
			release || assert(this._eventLoopIsRunning);
			clearTimeout(this._frameTimeout);
			this._eventLoopIsRunning = false;
		}

		private _enterRootLoadingLoop(): void {
			let self = this;
			let rootLoader = this.sec.display.Loader.getRootLoader();
			rootLoader._setStage(this._stage);

			function rootLoadingLoop() {
				let loaderInfo = rootLoader.contentLoaderInfo;
				if (!loaderInfo._file) {
					setTimeout(rootLoadingLoop, self._getFrameInterval());
					return;
				}

				let stage = self._stage;

				let bgcolor = self.defaultStageColor !== undefined ?
					self.defaultStageColor :
					loaderInfo._file.backgroundColor;

				stage._loaderInfo = loaderInfo;
				stage.align = self.stageAlign || '';

				if (!self.stageScale || flash.display.StageScaleMode.toNumber(self.stageScale) < 0) {
					stage.scaleMode = flash.display.StageScaleMode.SHOW_ALL;
				} else {
					stage.scaleMode = self.stageScale;
				}

				stage.frameRate = loaderInfo.frameRate;
				stage.setStageWidth(loaderInfo.width);
				stage.setStageHeight(loaderInfo.height);
				stage.setStageColor(ColorUtilities.RGBAToARGB(bgcolor));

				if (self.displayParameters) {
					self._gfxServiceObserver.displayParameters(self.displayParameters);
				}

				self._enterEventLoop();
			}

			rootLoadingLoop();
		}

		public start(params: any)
		{
			params = params || {};

			const options = {
				width: params.width || 800,
				height: params.height || 600,
				backgroundColor: params.backgroundColor,
				frameRate: params.frameRate || 24,
			};

			this._stage = this.sec.display.Stage.create();
			let loader = this._loader = this.sec.display.Loader.getRootLoader();
			let loaderInfo = this._loaderInfo = loader.contentLoaderInfo;

			loader._content = this.sec.display.DisplayObjectContainer.create();
			loader._loadStatus = 3;

			let stage = this._stage;

			let bgcolor = this.defaultStageColor !== undefined ?
				this.defaultStageColor :
				params.backgroundColor;

			this._loaderInfo = loaderInfo;
			stage.align = this.stageAlign || '';

			if (!this.stageScale || flash.display.StageScaleMode.toNumber(this.stageScale) < 0) {
				stage.scaleMode = flash.display.StageScaleMode.SHOW_ALL;
			} else {
				stage.scaleMode = this.stageScale;
			}

			stage.frameRate = options.frameRate;
			stage.setStageWidth(options.width);
			stage.setStageHeight(options.height);
			stage.setStageColor(ColorUtilities.RGBAToARGB(bgcolor));

			if (this.displayParameters) {
				this._gfxServiceObserver.displayParameters(this.displayParameters);
			}

			this._enterEventLoop();
		}

		private _eventLoopTick(): void {
			let runFrameScripts = !playAllSymbolsOption.value;
			let dontSkipFrames = dontSkipFramesOption.value;
			if (!dontSkipFrames && (
					!frameEnabledOption.value && runFrameScripts ||
					this._shouldThrottleDownFrameExecution())) {
				return;
			}
			// The stage is required for frame event cycle processing.
			let displayObjectClass = this.sec.display;
			displayObjectClass._stage = this._stage;
			// Until the root SWF is initialized, only process Loader events.
			// Once the root loader's content is created, directly process all events again to avoid
			// further delay in initialization.
			let loaderClass = this.sec.display.Loader;
			if (!loaderClass.getRootLoader().content) {
				loaderClass.processEvents();
				if (!loaderClass.getRootLoader().content) {
					return;
				}
			}
			for (let i = 0; i < frameRateMultiplierOption.value; i++) {
				enterTimeline("eventLoop");
				let start = performance.now();
				displayObjectClass.performFrameNavigation(true, runFrameScripts);
				counter.count("performFrameNavigation", 1, performance.now() - start);
				loaderClass.processEvents();
				leaveTimeline("eventLoop");
			}
			this._framesPlayed++;
			if (tracePlayerOption.value > 0 && (this._framesPlayed % tracePlayerOption.value === 0)) {
				this._tracePlayer();
			}
			this._stage.render();
			this._pumpUpdates();
			this._gfxService.frame();
		}

		private _tracePlayer(): void {
			this._writer.writeLn("Frame: " +
				String(this._framesPlayed).padLeft(' ', 4) + ": " + IntegerUtilities.toHEX(this._stage.hashCode()) + " " +
				String(this._stage.getAncestorCount()).padLeft(' ', 4));
		}

		registerFont(symbol: Timeline.EagerlyResolvedSymbol, data: Uint8Array): void {
			release || assert(symbol.syncId);
			symbol.resolveAssetPromise = new PromiseWrapper(); // TODO no need for wrapper here, change to Promise
			this._gfxService.registerFont(symbol.syncId, data).then(function (result) {
				symbol.resolveAssetPromise.resolve(result);
			});
			// Fonts are immediately available in Firefox, so we can just mark the symbol as ready.
			if (inFirefox) {
				symbol.ready = true;
			} else {
				symbol.resolveAssetPromise.then(symbol.resolveAssetCallback, null);
			}
		}

		registerImage(symbol: Timeline.EagerlyResolvedSymbol, imageType: ImageType,
		              data: Uint8Array, alphaData: Uint8Array): void {
			release || assert(symbol.syncId);
			symbol.resolveAssetPromise = new PromiseWrapper(); // TODO no need for wrapper here, change to Promise
			this._gfxService.registerImage(symbol.syncId, symbol.id, imageType, data, alphaData).then(function (result) {
				symbol.resolveAssetPromise.resolve(result);
			});
			symbol.resolveAssetPromise.then(symbol.resolveAssetCallback, null);
		}

		private _crossDomainSWFLoadingWhitelist: { protocol: string; hostname: string; insecure: boolean; ownDomain: boolean }[] = [];

		addToSWFLoadingWhitelist(domain: string, insecure: boolean, ownDomain: boolean) {
			if (domain.indexOf('/') < 0) { // anything without path, this includes '*'
				this._crossDomainSWFLoadingWhitelist.push({
					protocol: 'http:',
					hostname: domain,
					insecure: insecure,
					ownDomain: ownDomain
				});
				return;
			}
			try {
				let url = new (<any>window).URL(domain);
				this._crossDomainSWFLoadingWhitelist.push({
					protocol: url.protocol,
					hostname: url.hostname,
					insecure: insecure,
					ownDomain: ownDomain
				});
			} catch (e) {
			}
		}

		checkDomainForSWFLoading(domain: string): CrossDomainSWFLoadingWhitelistResult {
			let url: any;
			try {
				url = new (<any>window).URL(domain);
			} catch (e) {
				return CrossDomainSWFLoadingWhitelistResult.Failed;
			}
			let result: CrossDomainSWFLoadingWhitelistResult =
				CrossDomainSWFLoadingWhitelistResult.Failed;
			this._crossDomainSWFLoadingWhitelist.some(function (entry) {
				let success;
				if (url.hostname !== entry.hostname && entry.hostname !== '*') {
					success = false;
				} else if (entry.insecure) {
					success = true;
				} else {
					// The HTTPS SWF has to be more protected than it's whitelisted HTTP equivalent.
					success = url.protocol === 'https:' || entry.protocol !== 'https:';
				}
				if (success) {
					result = entry.ownDomain ?
						CrossDomainSWFLoadingWhitelistResult.OwnDomain :
						CrossDomainSWFLoadingWhitelistResult.Remote;
					return true;
				}
				return false;
			}, this);
			return result;
		}
	}
}

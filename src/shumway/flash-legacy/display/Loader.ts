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

module Shumway.flash.display {
	import assert = Shumway.Debug.assert;
	import assertUnreachable = Shumway.Debug.assertUnreachable;
	import somewhatImplemented = Shumway.Debug.somewhatImplemented;

	import LoaderContext = flash.system.LoaderContext;
	import events = flash.events;
	import ICrossDomainSWFLoadingWhitelist = flash.system.ICrossDomainSWFLoadingWhitelist;
	import CrossDomainSWFLoadingWhitelistResult = flash.system.CrossDomainSWFLoadingWhitelistResult;

	import FileLoader = Shumway.FileLoader;
	import ILoadListener = Shumway.ILoadListener;
	import SWFFile = Shumway.SWF.SWFFile;

	import ABCFile = lang.ABCFile;
	import Multiname = lang.Multiname;
	import NamespaceType = lang.NamespaceType;

	export enum LoadStatus {
		Unloaded = 0,
		Opened = 1,
		Initialized = 2,
		Complete = 3
	}

	export enum LoadingType {
		External = 0,
		Bytes = 1
	}

	export class Loader extends flash.display.DisplayObjectContainer
		implements IAdvancable, ILoadListener {

		constructor() {
			super();

			const displayObjectClass = this._sec.display;

			displayObjectClass._advancableInstances.push(this);
			this._content = null;
			if (displayObjectClass.Loader._rootLoader) {
				// Loader reserves the next instance ID to use for the loaded content.
				// This isn't needed for the first, root, loader, because that uses "root1" as the name.
				this._contentID = displayObjectClass._instanceID++;
			} else {
				// The root loader gets a default name, but it's not visible and hence
				// the instance id must not be used up.
				displayObjectClass._instanceID--;
			}
			this._contentLoaderInfo = this._sec.display.LoaderInfo.create([displayObjectClass.Loader.CtorToken]);
			this._contentLoaderInfo._loader = this;

			// @ivanpopelyshev: That's bad. No cirrentABC for us.

			this._contentLoaderInfo._loaderUrl = this._sec.system._currentDomain.url;

			// let currentAbc = AVMX.getCurrentABC();
			// if (currentAbc) {
			// 	this._contentLoaderInfo._loaderUrl = currentAbc.env.url;
			// }

			this._fileLoader = null;
			this._loadStatus = LoadStatus.Unloaded;
		}

		_setStage(stage: Stage) {
			release || assert(this === this._sec.display.Loader.getRootLoader());
			this._stage = stage;
		}

		_initFrame(advance: boolean) {
			// ...
		}

		_constructFrame() {
			const context = this._sec;

			if (this === context.display.Loader.getRootLoader() && this._content) {
				context.display._advancableInstances.remove(this);
				this._children[0] = this._content;
				this._constructChildren();
				this._children.length = 0;
				return;
			}
			this._constructChildren();
		}

		addChild(child: DisplayObject): DisplayObject {
			this._sec.throwError('IllegalOperationError', Errors.InvalidLoaderMethodError);
			return null;
		}

		addChildAt(child: DisplayObject, index: number): DisplayObject {
			this._sec.throwError('IllegalOperationError', Errors.InvalidLoaderMethodError);
			return null;
		}

		removeChild(child: DisplayObject): DisplayObject {
			this._sec.throwError('IllegalOperationError', Errors.InvalidLoaderMethodError);
			return null;
		}

		removeChildAt(index: number): DisplayObject {
			this._sec.throwError('IllegalOperationError', Errors.InvalidLoaderMethodError);
			return null;
		}

		setChildIndex(child: DisplayObject, index: number): void {
			this._sec.throwError('IllegalOperationError', Errors.InvalidLoaderMethodError);
		}

		// AS -> JS Bindings

		_content: flash.display.DisplayObject;
		private _contentID: number;
		_contentLoaderInfo: flash.display.LoaderInfo;
		private _uncaughtErrorEvents: flash.events.UncaughtErrorEvents;

		private _fileLoader: FileLoader;
		_imageSymbol: BitmapSymbol;
		_loadStatus: LoadStatus;
		_loadingType: LoadingType;
		_queuedLoadUpdate: LoadProgressUpdate;

		/**
		 * No way of knowing what's in |data|, so do a best effort to print out some meaninfgul debug
		 * info.
		 */
		private _describeData(data: any): string {
			let keyValueParis = [];
			for (let k in data) {
				keyValueParis.push(k + ":" + StringUtilities.toSafeString(data[k]));
			}
			return "{" + keyValueParis.join(", ") + "}";
		}

		get content(): flash.display.DisplayObject {
			if (this._loadStatus === LoadStatus.Unloaded) {
				return null;
			}
			return this._content;
		}

		get contentLoaderInfo(): flash.display.LoaderInfo {
			return this._contentLoaderInfo;
		}

		_getJPEGLoaderContextdeblockingfilter(context: flash.system.LoaderContext): number {
			if (this._sec.system.JPEGLoaderContext.axIsType(context)) {
				return (<flash.system.JPEGLoaderContext>context).deblockingFilter;
			}
			return 0.0;
		}

		get uncaughtErrorEvents(): events.UncaughtErrorEvents {
			release || somewhatImplemented("public flash.display.Loader::uncaughtErrorEvents");
			if (!this._uncaughtErrorEvents) {
				this._uncaughtErrorEvents = new events.UncaughtErrorEvents();
			}
			return this._uncaughtErrorEvents;
		}

		private _canLoadSWFFromDomain(url: string): CrossDomainSWFLoadingWhitelistResult {
			url = FileLoadingService.instance.resolveUrl(url);
			let whitelist: ICrossDomainSWFLoadingWhitelist = this._sec.player;
			return whitelist.checkDomainForSWFLoading(url);
		}

		load(request: flash.net.URLRequest, context?: LoaderContext): void {
			this.close();
			// TODO: clean up contentloaderInfo.
			let resolvedURL = FileLoadingService.instance.resolveUrl(request.url);
			this._contentLoaderInfo._url = resolvedURL;
			this._applyLoaderContext(context);
			this._loadingType = LoadingType.External;
			let fileLoader = this._fileLoader = new FileLoader(this, this._contentLoaderInfo);
			if (!release && traceLoaderOption.value) {
				console.log("Loading url " + request.url);
			}
			fileLoader.loadFile(request._toFileRequest());

			this._queuedLoadUpdate = null;
			let loaderClass = this._sec.display.Loader;
			release || assert(loaderClass._loadQueue.indexOf(this) === -1);
			loaderClass._loadQueue.push(this);
		}

		loadBytes(data: flash.utils.ByteArray, context?: LoaderContext) {
			this.close();
			// TODO: properly coerce object arguments to their types.
			let loaderClass = this._sec.display.Loader;
			// In case this is the initial root loader, we won't have a loaderInfo object. That should
			// only happen in the inspector when a file is loaded from a Blob, though.
			this._contentLoaderInfo._url = (this.loaderInfo ? this.loaderInfo._url : '') +
				'/[[DYNAMIC]]/' + (++loaderClass._embeddedContentLoadCount);
			this._applyLoaderContext(context);
			this._loadingType = LoadingType.Bytes;
			this._fileLoader = new FileLoader(this, this._contentLoaderInfo);
			this._queuedLoadUpdate = null;
			if (!release && traceLoaderOption.value) {
				console.log("Loading embedded symbol " + this._contentLoaderInfo._url);
			}
			// Just passing in the bytes won't do, because the buffer can contain slop at the end.
			this._fileLoader.loadBytes(new Uint8Array((<any>data).bytes, 0, data.length));

			release || assert(loaderClass._loadQueue.indexOf(this) === -1);
			loaderClass._loadQueue.push(this);
		}

		close(): void {
			let loaderClass = this._sec.display.Loader;
			let queueIndex = loaderClass._loadQueue.indexOf(this);
			if (queueIndex > -1) {
				loaderClass._loadQueue.splice(queueIndex, 1);
			}
			this._contentLoaderInfo.reset();
			if (!this._fileLoader) {
				return;
			}
			this._fileLoader.abortLoad();
			this._fileLoader = null;
		}

		_unload(stopExecution: boolean, gc: boolean): void {
			if (this._loadStatus < LoadStatus.Initialized) {
				this._loadStatus = LoadStatus.Unloaded;
				return;
			}
			this.close();
			this._content = null;
			this._contentLoaderInfo._loader = null;
			this._loadStatus = LoadStatus.Unloaded;
			this.dispatchEvent(this._sec.events.getInstance(events.Event.UNLOAD));
		}

		unload() {
			this._unload(false, false);
		}

		unloadAndStop(gc: boolean) {
			// TODO: remove all DisplayObjects originating from the unloaded SWF from all lists and stop
			// them.
			this._unload(true, !!gc);
		}

		private _applyLoaderContext(context: LoaderContext) {
			let parameters = context && context.parameters ?
				context.parameters :
				{};
			if (context && context.applicationDomain) {
				this._contentLoaderInfo._applicationDomain = context.applicationDomain;
			} else if (this._loaderInfo && this._loaderInfo._applicationDomain) {
				this._contentLoaderInfo._applicationDomain = this._loaderInfo._applicationDomain;
			} else {
				this._contentLoaderInfo._applicationDomain = this._sec.system.ApplicationDomain.create();
				this._contentLoaderInfo._applicationDomain.url = this._contentLoaderInfo.url;
			}
			this._contentLoaderInfo._parameters = parameters;
			this._contentLoaderInfo._allowCodeImport = context ? context.allowCodeImport : true;
			this._contentLoaderInfo._checkPolicyFile = context ? context.checkPolicyFile : false;
			this._contentLoaderInfo._avm1Context = context ? context._avm1Context : null;
		}

		onLoadOpen(file: any) {
			if (!file) {
				this._contentLoaderInfo.dispatchEvent(
					this._sec.events.IOErrorEvent.create([events.IOErrorEvent.IO_ERROR, false, false,
						Errors.UnknownFileTypeError.message,
						Errors.UnknownFileTypeError.code
					]));
				return;
			}
			// For child SWF files, only continue loading and interpreting the loaded data if the
			// either
			// - it is loaded from the same origin as the parent, or
			// - the parent has called `system.Security.allowDomain` with the loadees origin whitelisted
			// This is a mitigation against the loadee breaking our SecurityDomain sandbox and
			// reaching into the parent's SecurityDomain, reading data it's not supposed to have
			// access to.
			//
			// We perform this check only once loading has started for two reasons: one is that only
			// at that point do we know that we're loading a SWF instead of an image (or some invalid
			// file, in which case none of this matters). The other is that the parent might call
			// `allowDomain` only after the load has started, in which case we still want to allow the
			// operation to continue.
			//
			// Additionally, all the normal cross-domain checks apply as per usual.
			if (file._file instanceof SWFFile) {
				let whitelistResult = this._canLoadSWFFromDomain(this._fileLoader._url);
				let resultType: Telemetry.LoadResource;

				switch (whitelistResult) {
					case CrossDomainSWFLoadingWhitelistResult.OwnDomain:
						resultType = Telemetry.LoadResource.LoadSource;
						break;
					case CrossDomainSWFLoadingWhitelistResult.Remote:
						resultType = Telemetry.LoadResource.LoadWhitelistAllowed;
						break;
					case CrossDomainSWFLoadingWhitelistResult.Failed:
						resultType = Telemetry.LoadResource.LoadWhitelistDenied;
						break;
					default:
						assertUnreachable("Invalid whitelistResult");
				}
				Telemetry.instance.reportTelemetry({topic: 'loadResource', resultType: resultType});

				if (whitelistResult === CrossDomainSWFLoadingWhitelistResult.Failed) {
					console.error('Loading of SWF file from ' + this._fileLoader._url +
						' was rejected based on allowDomain heuristic.');
					this._fileLoader.abortLoad();
					let message = "Security sandbox violation: SWF " + this._loaderInfo._url +
						" cannot load SWF " + this._fileLoader._url + ". This may be worked" +
						" around by calling Security.allowDomain.";
					try {
						this._contentLoaderInfo.dispatchEvent(
							this._sec.events.IOErrorEvent.create([events.SecurityErrorEvent.SECURITY_ERROR,
								false, false, message,
								Errors.SecuritySwfNotAllowedError.code
							]));
					} catch (_) {
						// Ignore error during event handling.
					}
					return;
				}
				if (!this._contentLoaderInfo._allowCodeImport) {
					this._fileLoader.abortLoad();
					try {
						this._contentLoaderInfo.dispatchEvent(
							this._sec.events.IOErrorEvent.create([events.SecurityErrorEvent.SECURITY_ERROR,
								false, false,
								Errors.AllowCodeImportError.message,
								Errors.AllowCodeImportError.code
							]));
					} catch (_) {
						// Ignore error during event handling.
					}
					return;
				}
			}

			this._contentLoaderInfo.setFile(file);
		}

		onLoadProgress(update: LoadProgressUpdate) {
			release || assert(update);
			this._queuedLoadUpdate = update;
		}

		onNewEagerlyParsedSymbols(dictionaryEntries: SWF.EagerlyParsedDictionaryEntry[],
		                          delta: number): Promise<any> {
			let promises: Promise<any>[] = [];
			for (let i = dictionaryEntries.length - delta; i < dictionaryEntries.length; i++) {
				let dictionaryEntry = dictionaryEntries[i];
				let symbol = this._contentLoaderInfo.getSymbolById(dictionaryEntry.id);
				// JPEGs with alpha channel are parsed with our JS parser for now. They're ready
				// immediately, so don't need any more work here. We'll change them to using the system
				// parser, but for now, just skip further processing here.
				if (symbol.ready) {
					continue;
				}
				release || assert(symbol.resolveAssetPromise);
				release || assert(symbol.ready === false);
				promises.push(symbol.resolveAssetPromise.promise);
			}
			return Promise.all(promises);
		}

		onImageBytesLoaded() {
			let file = this._contentLoaderInfo._file;
			release || assert(file instanceof ImageFile);
			let data = {
				id: -1,
				data: file.data, // TODO: check if we can just remove this.
				mimeType: file.mimeType,
				dataType: file.type,
				type: 'image'
			};
			let symbol = BitmapSymbol.FromData(data, this._contentLoaderInfo);
			this._imageSymbol = symbol;
			this._sec.player.registerImage(symbol, file.type, file.data, null);
			release || assert(symbol.resolveAssetPromise);
		}

		_applyDecodedImage(symbol: BitmapSymbol) {
			let bitmapData = symbol.createSharedInstance();
			this._content = this._sec.display.Bitmap.create([bitmapData]);
			this._contentLoaderInfo._width = this._content.width * 20;
			this._contentLoaderInfo._height = this._content.height * 20;
			this.addTimelineObjectAtDepth(this._content, 0);
		}

		_applyLoadUpdate(update: LoadProgressUpdate) {
			let loaderInfo = this._contentLoaderInfo;
			loaderInfo._bytesLoaded = update.bytesLoaded;
			let file = loaderInfo._file;

			if (!(file instanceof SWFFile)) {
				return;
			}

			if (file.framesLoaded === 0) {
				return;
			}

			if (loaderInfo._allowCodeExecution) {
				let app = loaderInfo.app;

				let abcBlocksLoaded = file.abcBlocks.length;
				let abcBlocksLoadedDelta = abcBlocksLoaded - loaderInfo._abcBlocksLoaded;
				if (abcBlocksLoadedDelta > 0) {
					for (let i = loaderInfo._abcBlocksLoaded; i < abcBlocksLoaded; i++) {
						let abcBlock = file.abcBlocks[i];
						let abc = new ABCFile(loaderInfo, abcBlock.data);
						if (abcBlock.flags) {
							// kDoAbcLazyInitializeFlag = 1 Indicates that the ABC block should not be executed
							// immediately.
							app.loadABC(abc);
						} else {
							// TODO: probably delay execution until playhead reaches the frame.
							app.loadAndExecuteABC(abc);
						}
					}
					loaderInfo._abcBlocksLoaded = abcBlocksLoaded;
				}

				let mappedSymbolsLoaded = file.symbolClassesList.length;
				let mappedSymbolsLoadedDelta = mappedSymbolsLoaded - loaderInfo._mappedSymbolsLoaded;
				if (mappedSymbolsLoadedDelta > 0) {
					//@ivanpopelyshev: sorry, hack
					loaderInfo.getRootSymbol();
					for (let i = loaderInfo._mappedSymbolsLoaded; i < mappedSymbolsLoaded; i++) {
						let symbolMapping = file.symbolClassesList[i];

						//@ivanpopelyshev: here we add symbol directly and right now
						const name = Multiname.FromFQNString(symbolMapping.className,
							NamespaceType.Public);

						const symbol = loaderInfo.getSymbolById(symbolMapping.id);
						const symbolClass = lang.createLegacyClass(name, symbol.symbolClass);
						symbol.symbolClass = symbolClass;
						symbolClass.setSymbol(symbol);
						loaderInfo._applicationDomain.addClass({name, value: symbolClass});

						// old code:
						// let symbolClass = app.getClass(Multiname.FromFQNString(symbolMapping.className,
						// 	NamespaceType.Public));
						// symbolClass.setSymbolResolver(loaderInfo.getSymbolResolver(symbolClass, symbolMapping.id));
					}
					loaderInfo._mappedSymbolsLoaded = mappedSymbolsLoaded;
				}
			}

			// In browsers that can't synchronously decode fonts, we have already registered all
			// embedded fonts at this point.
			if (inFirefox) {
				let fontsLoaded = file.fonts.length;
				let fontsLoadedDelta = fontsLoaded - loaderInfo._fontsLoaded;
				if (fontsLoadedDelta > 0) {
					for (let i = loaderInfo._fontsLoaded; i < fontsLoaded; i++) {
						this._sec.text.registerFontSymbol(file.fonts[i], loaderInfo);
					}
					loaderInfo._fontsLoaded = fontsLoaded;
				}
			}

			let rootSymbol = loaderInfo.getRootSymbol();
			let framesLoadedDelta = file.framesLoaded - rootSymbol.frames.length;
			if (framesLoadedDelta === 0) {
				return;
			}
			let root = this._content;
			if (!root) {
				root = this.createContentRoot(rootSymbol, file.sceneAndFrameLabelData);
			}
			let rootSprite = <Sprite><any>root;
			for (let i = 0; i < framesLoadedDelta; i++) {
				let frameInfo = loaderInfo.getFrame(null, rootSymbol.frames.length);
				rootSprite._addFrame(frameInfo);
			}
		}

		onLoadComplete() {
			// Go away, tslint.
		}

		onLoadError() {
			release || Debug.warning('Not implemented: flash.display.Loader loading-error handling');
		}

		private _addScenesToMovieClip(mc: MovieClip, sceneData: any, numFrames: number) {
			// Creating scenes so we will always have frames assigned to some scene.
			if (!sceneData) {
				mc.addScene('Scene 1', [], 0, numFrames);
				return;
			}

			// Sorting scenes by offset
			let sceneInfos = [];
			let scenes = sceneData.scenes;
			for (let i = 0; i < scenes.length; i++) {
				sceneInfos.push({offset: scenes[i].offset, name: scenes[i].name});
			}
			sceneInfos.sort((a, b) => a.offset - b.offset);

			let n = sceneInfos.length;
			let offset, endFrame;
			if (n > 0 && sceneInfos[0].offset > 0) {
				// Starting from non-zero frame, we need to create a fake scene.
				offset = sceneInfos[0].offset;
				endFrame = Math.min(offset, numFrames);
				mc.addScene('Scene 0', [], 0, endFrame);
			}

			for (let i = 0, n = sceneInfos.length; i < n; i++) {
				let sceneInfo = sceneInfos[i];
				offset = sceneInfo.offset;
				if (offset >= numFrames) {
					break; // out of the movie clip timeline range
				}
				endFrame = i < n - 1 ? Math.min(scenes[i + 1].offset, numFrames) : numFrames;
				mc.addScene(sceneInfo.name, [], offset, endFrame - offset);
			}

			let labels = sceneData.labels;
			for (let i = 0; i < labels.length; i++) {
				let labelInfo = labels[i];
				mc.addFrameLabel(labelInfo.name, labelInfo.frame + 1);
			}
		}

		private createContentRoot(symbol: SpriteSymbol, sceneData: any) {
			let isAS2LoadedFromAS3 = false;
			if (symbol.isAVM1Object && !this._contentLoaderInfo._avm1Context) {
				// For outermost AVM1 SWF we need to create AVM1Context.
				isAS2LoadedFromAS3 = true;
				this._createAVM1Context();
				// Re-sync the AVM1Context for the symbol.
				symbol.avm1Context = this._contentLoaderInfo._avm1Context;
			}

			let root = system.constructClassFromSymbol(symbol, symbol.symbolClass);
			const context = this._sec;
			// The initial SWF's root object gets a default of 'root1', which doesn't use up a
			// DisplayObject instance ID. For the others, we have reserved one in `_contentID`.

			context.display._instanceID--;
			let loaderClass = context.display.Loader;
			if (this === loaderClass._rootLoader) {
				root._name = 'root1';
			} else {
				root._name = 'instance' + this._contentID;
			}

			if (context.display.MovieClip.axIsType(root)) {
				this._addScenesToMovieClip(<MovieClip>root, sceneData, symbol.numFrames);
			}

			let loaderInfo = this._contentLoaderInfo;
			root._loaderInfo = loaderInfo;
			let rootTimeline = root;
			let isTopLevelMovie = this === loaderClass.getRootLoader();
			if (isAS2LoadedFromAS3) {
				root = this._createAVM1Movie(root);
			} else if (isTopLevelMovie) {
				let movieClipClass = this._sec.display;
				movieClipClass.frameNavigationModel = loaderInfo.swfVersion < 10 ?
					flash.display.FrameNavigationModel.SWF9 :
					flash.display.FrameNavigationModel.SWF10;
				root._perspectiveProjectionCenterX = this._stage.stageWidth / 2;
				root._perspectiveProjectionCenterY = this._stage.stageHeight / 2;
				root._setFlags(DisplayObjectFlags.HasPerspectiveProjection);
			}
			this._content = root;
			if (isTopLevelMovie) {
				loaderClass.runtimeStartTime = Date.now();
				this._stage.setRoot(root);
			} else {
				this.addTimelineObjectAtDepth(root, 0);
			}
			// Always return the non-wrapped MovieClip instead of AVM1Movie for AVM1 SWFs.
			return rootTimeline;
		}

		private _createAVM1Context(): void {
			let contentLoaderInfo: LoaderInfo = this._contentLoaderInfo;
			//@ivanpopelyshev: AVM1
			let avm1Context = (Shumway as any).AVM1.AVM1Context.create(contentLoaderInfo);
			const context = this._sec;
			let rootLoader = context.display.Loader.getRootLoader();
			avm1Context.setStage(rootLoader._stage);

			// FIXME make frameNavigationModel non-global
			if (this === rootLoader) {
				context.display.frameNavigationModel = flash.display.FrameNavigationModel.SWF1;
			}

			contentLoaderInfo._avm1Context = avm1Context;
		}

		/**
		 * Create an AVM1Movie container and wrap the root timeline into it.
		 * This associates the AVM1Context with this AVM1 MovieClip tree,
		 * including potential nested SWFs.
		 */
		private _createAVM1Movie(root: flash.display.DisplayObject): flash.display.AVM1Movie {
			let contentLoaderInfo = this._contentLoaderInfo;
			release || Debug.assert(contentLoaderInfo);

			let avm1Context = this._contentLoaderInfo._avm1Context;

			//@ivanpopelyshev: AVM1
			let avm1MovieClip: any = {};
			//let avm1MovieClip = <AVM1.Lib.AVM1MovieClip>AVM1.Lib.getAVM1Object(root, avm1Context);

			let parameters = contentLoaderInfo._parameters;
			avm1MovieClip.setParameters(parameters);

			let avm1Movie = this._sec.display.AVM1Movie.create([root]);
			release || Debug.assert(!avm1Context.levelsContainer, "One levels container per context");
			avm1Context.levelsContainer = avm1Movie;

			return avm1Movie;
		}
	}
}

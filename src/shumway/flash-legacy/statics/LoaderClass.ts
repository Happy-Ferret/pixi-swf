module Shumway.flash.system {
	import assert = Shumway.Debug.assert;
	import Loader = display.Loader;
	import LoadStatus = display.LoadStatus;
	import LoadingType= display.LoadingType;
	import Event = flash.events.Event;
	import ProgressEvent = flash.events.ProgressEvent;

	import enterTimeline = Shumway.enterTimeline;
	import leaveTimeline = Shumway.leaveTimeline;

	export class LoaderClass extends system.LegacyClass<display.Loader> {
		constructor() {
			super(display.Loader);
			this.init();
		}

		init() {
			this._rootLoader = null;
			this._loadQueue = [];
			this.runtimeStartTime = 0;
			this._embeddedContentLoadCount = 0;
		}

		runtimeStartTime: number = 0;
		_rootLoader: Loader = null;
		_loadQueue: Array<Loader> = [];
		_embeddedContentLoadCount: number = 0;

		/**
		 * Creates or returns the root Loader instance. The loader property of that instance's
		 * LoaderInfo object is always null. Also, no OPEN event ever gets dispatched.
		 */
		getRootLoader(): Loader {
			if (this._rootLoader) {
				return this._rootLoader;
			}
			let loader = this._sec.display.Loader.create();
			// The root loaderInfo's `loader` property is always null.
			loader._contentLoaderInfo._loader = null;
			this._rootLoader = loader;
			return loader;
		}

		reset() {
			this._loadQueue.forEach(loader => loader.unload());
			this.init();
		}

		/**
		 * In each turn of the event loop, Loader events are processed in two batches:
		 * first INIT and COMPLETE events are dispatched for all active Loaders, then
		 * OPEN and PROGRESS.
		 *
		 * A slightly weird result of this is that INIT and COMPLETE are dispatched at
		 * least one turn later than the other events: INIT is dispatched after the
		 * content has been created. That, in turn, happens under
		 * `DisplayObject.performFrameNavigation` in reaction to enough data being
		 * marked as available - which happens in the second batch of Loader event
		 * processing.
		 */
		processEvents() {
			this.processEarlyEvents();
			this.processLateEvents();
		}

		processEarlyEvents() {
			let queue = this._loadQueue;
			for (let i = 0; i < queue.length; i++) {
				let instance = queue[i];
				release || assert(instance._loadStatus !== LoadStatus.Complete);
				let loaderInfo = instance._contentLoaderInfo;
				let imageSymbol = instance._imageSymbol;

				// For images, only dispatch INIT and COMPLETE once the image has been decoded.
				if (loaderInfo._file instanceof ImageFile) {
					if (!imageSymbol || !imageSymbol.ready || instance._queuedLoadUpdate) {
						continue;
					}
					release || assert(loaderInfo.bytesLoaded === loaderInfo.bytesTotal);
					instance._applyDecodedImage(imageSymbol);
					release || assert(instance._content);
				}

				if (instance._loadStatus === LoadStatus.Opened && instance._content) {
					enterTimeline("Loader.INIT");
					try {
						loaderInfo.dispatchEvent(this._sec.events.getInstance(Event.INIT));
					} catch (e) {
						Debug.warning('caught error under loaderInfo INIT event:', e);
					}
					leaveTimeline();
					instance._loadStatus = LoadStatus.Initialized;
					// Only for the root loader, progress events for the data loaded up until now are
					// dispatched here.
					if (instance === this._rootLoader) {
						enterTimeline("Loader.Progress", 'rootLoader');
						try {
							loaderInfo.dispatchEvent(this._sec.events.ProgressEvent.create([
								flash.events.ProgressEvent.PROGRESS,
								false, false,
								loaderInfo.bytesLoaded,
								loaderInfo.bytesTotal]));
						} catch (e) {
							Debug.warning('caught error under loaderInfo PROGRESS event:', e);
						}
						leaveTimeline();
					}
				}

				if (instance._loadStatus === LoadStatus.Initialized &&
					loaderInfo.bytesLoaded === loaderInfo.bytesTotal) {
					queue.splice(i--, 1);
					release || assert(queue.indexOf(instance) === -1);
					instance._loadStatus = LoadStatus.Complete;
					enterTimeline("Loader.Complete");
					try {
						loaderInfo.dispatchEvent(this._sec.events.getInstance(Event.COMPLETE));
					} catch (e) {
						Debug.warning('caught error under loaderInfo COMPLETE event: ', e);
					}
					leaveTimeline();
				}
			}
		}

		processLateEvents() {
			let queue = this._loadQueue;
			for (let i = 0; i < queue.length; i++) {
				let instance = queue[i];
				release || assert(instance._loadStatus !== LoadStatus.Complete);

				let loaderInfo = instance._contentLoaderInfo;
				let update = instance._queuedLoadUpdate;
				let bytesTotal = loaderInfo._bytesTotal;
				if ((!update || !bytesTotal) && instance._loadStatus !== LoadStatus.Opened) {
					continue;
				}
				instance._queuedLoadUpdate = null;

				let progressEventCtor = this._sec.events.ProgressEvent;
				if (instance._loadStatus === LoadStatus.Unloaded) {
					// OPEN is only dispatched when loading external resources, not for loadBytes.
					if (instance._loadingType === LoadingType.External) {
						enterTimeline("Loader.Open");
						try {
							loaderInfo.dispatchEvent(this._sec.events.getInstance(Event.OPEN));
						} catch (e) {
							Debug.warning('caught error under loaderInfo OPEN event: ', e);
						}
						leaveTimeline();
					}
					// The first time any progress is made at all, a progress event with bytesLoaded = 0
					// is dispatched.
					enterTimeline("Loader.Progress");
					try {
						loaderInfo.dispatchEvent(progressEventCtor.create([ProgressEvent.PROGRESS,
							false, false, 0, bytesTotal]));
					} catch (e) {
						Debug.warning('caught error under loaderInfo PROGRESS event: ', e);
					}
					leaveTimeline();
					instance._loadStatus = LoadStatus.Opened;
				}

				// TODO: The Flash player reports progress in 16kb chunks, in a tight loop right here.
				if (update) {
					instance._applyLoadUpdate(update);
					enterTimeline("Loader.Progress");
					try {
						loaderInfo.dispatchEvent(progressEventCtor.create([ProgressEvent.PROGRESS,
							false, false, update.bytesLoaded,
							bytesTotal]));
					} catch (e) {
						Debug.warning('caught error under loaderInfo PROGRESS event: ', e);
					}
					leaveTimeline();
				}
			}
		}

		// LoaderInfo

		CtorToken = {};
	}
}
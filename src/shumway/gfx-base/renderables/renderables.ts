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

module Shumway.GFX {
	import Point = Geometry.Point;
	import Rectangle = Geometry.Rectangle;
	import PathCommand = Shumway.PathCommand;
	import Matrix = Geometry.Matrix;
	import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
	import swap32 = Shumway.IntegerUtilities.swap32;
	import memorySizeToString = Shumway.StringUtilities.memorySizeToString;
	import assertUnreachable = Shumway.Debug.assertUnreachable;
	import unpremultiplyARGB = Shumway.ColorUtilities.unpremultiplyARGB;
	import tableLookupUnpremultiplyARGB = Shumway.ColorUtilities.tableLookupUnpremultiplyARGB;
	import assert = Shumway.Debug.assert;
	import unexpected = Shumway.Debug.unexpected;
	import notImplemented = Shumway.Debug.notImplemented;
	import pushUnique = Shumway.ArrayUtilities.pushUnique;
	import indexOf = Shumway.ArrayUtilities.indexOf;
	import VideoPlaybackEvent = Shumway.Remoting.VideoPlaybackEvent;
	import VideoControlEvent = Shumway.Remoting.VideoControlEvent;

	declare let registerInspectorAsset: any;

	/**
	 * Represents some source renderable content.
	 */
	export class Renderable extends Node {

		/**
		 * Back reference to nodes that use this renderable.
		 */
		private _parents: Shape [] = [];

		/**
		 * Back reference to renderables that use this renderable.
		 */
		private _renderableParents: Renderable [] = [];

		public get parents(): Shape [] {
			return this._parents;
		}

		public addParent(frame: Shape) {
			release || assert(frame);
			let index = indexOf(this._parents, frame);
			release || assert(index < 0);
			this._parents.push(frame);
		}

		/**
		 * Checks if this node will be reached by the renderer.
		 */
		public willRender(): boolean {
			let parents = this._parents;
			for (let i = 0; i < parents.length; i++) {
				let node = <Node>parents[i];
				while (node) {
					if (node.isType(NodeType.Stage)) {
						return true;
					}
					if (!node.hasFlags(NodeFlags.Visible)) {
						break;
					}
					node = node._parent;
				}
			}
			return false;
		}

		public addRenderableParent(renderable: Renderable) {
			release || assert(renderable);
			release || assert(this._renderableParents.indexOf(renderable) === -1);
			this._renderableParents.push(renderable);
		}

		/**
		 * Returns the first unrooted parent or creates a new parent if none was found.
		 */
		public wrap(): Shape {
			let node: Shape;
			let parents = this._parents;
			for (let i = 0; i < parents.length; i++) {
				node = parents[i];
				if (!node._parent) {
					return node;
				}
			}
			node = new Shape(this);
			this.addParent(node);
			return node;
		}

		public invalidate() {
			this.setFlags(NodeFlags.Dirty);
			let nodes = this._parents;
			for (let i = 0; i < nodes.length; i++) {
				nodes[i].invalidate();
			}
			let renderables = this._renderableParents;
			for (let i = 0; i < renderables.length; i++) {
				renderables[i].invalidate();
			}
			let listeners = this._invalidateEventListeners;
			if (listeners) {
				for (let i = 0; i < listeners.length; i++) {
					listeners[i](this);
				}
			}
		}

		private _invalidateEventListeners: { (renderable: Renderable): void } [] = null;

		public addInvalidateEventListener(listener: (renderable: Renderable) => void) {
			if (!this._invalidateEventListeners) {
				this._invalidateEventListeners = [];
			}
			let index = indexOf(this._invalidateEventListeners, listener);
			release || assert(index < 0);
			this._invalidateEventListeners.push(listener);
		}


		getBounds(clone: boolean = false): Shumway.GFX.Geometry.Rectangle {
			if (clone) {
				return this._bounds.clone();
			}
			return this._bounds;
		}

		public getChildren(clone: boolean = false): Node [] {
			return null;
		}

		_propagateFlagsUp(flags: NodeFlags) {
			if (flags === NodeFlags.None || this.hasFlags(flags)) {
				return;
			}
			for (let i = 0; i < this._parents.length; i++) {
				this._parents[i]._propagateFlagsUp(flags);
			}
		}

		constructor() {
			super();
			this._flags &= ~NodeFlags.BoundsAutoCompute;
			this._type = NodeType.Renderable;
		}

		/**
		 * Render source content in the specified |context| or add one or more paths to |clipPath| if specified.
		 * If specified, the rectangular |cullBounds| can be used to cull parts of the shape for better performance.
		 * If |paintStencil| is |true| then we must not create any alpha values, and also not paint any strokes.
		 */
		render(context: CanvasRenderingContext2D, ratio: number, cullBounds?: Shumway.GFX.Geometry.Rectangle,
		       clipPath?: Path2D, paintStencil?: boolean, fillAdditive?: boolean): void {

		}
	}

	export class CustomRenderable extends Renderable {
		constructor(bounds: Rectangle, render: (context: CanvasRenderingContext2D, ratio: number, cullBounds: Shumway.GFX.Geometry.Rectangle) => void) {
			super();
			this.setBounds(bounds);
			this.render = render;
		}
	}

	export interface IVideoPlaybackEventSerializer {
		sendVideoPlaybackEvent(assetId: number, eventType: VideoPlaybackEvent, data: any): void;
	}

	export const enum RenderableVideoState {
		Idle = 1,
		Playing,
		Paused,
		Ended
	}

	export class RenderableVideo extends Renderable {
		_flags = NodeFlags.Dynamic | NodeFlags.Dirty;
		private _video: HTMLVideoElement;
		private _videoEventHandler: (e: Event) => void;
		private _assetId: number;
		private _eventSerializer: IVideoPlaybackEventSerializer;
		private _lastTimeInvalidated: number = 0;
		private _lastPausedTime: number = 0;
		private _seekHappening: boolean = false;
		private _pauseHappening: boolean = false;
		private _isDOMElement = true;
		private _state: RenderableVideoState;
		static _renderableVideos: RenderableVideo [] = [];

		constructor(assetId: number, eventSerializer: IVideoPlaybackEventSerializer) {
			super();

			this.setBounds(new Rectangle(0, 0, 1, 1));

			this._assetId = assetId;
			this._eventSerializer = eventSerializer;

			let element: HTMLVideoElement = document.createElement('video');
			let elementEventHandler = this._handleVideoEvent.bind(this);
			element.preload = 'metadata'; // for mobile devices
			element.addEventListener("play", elementEventHandler);
			element.addEventListener("pause", elementEventHandler);
			element.addEventListener("ended", elementEventHandler);
			element.addEventListener("loadeddata", elementEventHandler);
			element.addEventListener("progress", elementEventHandler);
			element.addEventListener("suspend", elementEventHandler);
			element.addEventListener("loadedmetadata", elementEventHandler);
			element.addEventListener("error", elementEventHandler);
			element.addEventListener("seeking", elementEventHandler);
			element.addEventListener("seeked", elementEventHandler);
			element.addEventListener("canplay", elementEventHandler);
			element.style.position = 'absolute';

			this._video = element;
			this._videoEventHandler = elementEventHandler;

			RenderableVideo._renderableVideos.push(this);

			if (typeof registerInspectorAsset !== "undefined") {
				registerInspectorAsset(-1, -1, this);
			}

			this._state = RenderableVideoState.Idle;
		}

		public get video(): HTMLVideoElement {
			return this._video;
		}

		public get state(): RenderableVideoState {
			return this._state;
		}

		play() {
			this._state = RenderableVideoState.Playing;
			this._video.play();
		}

		pause() {
			this._state = RenderableVideoState.Paused;
			this._video.pause();
		}

		private _handleVideoEvent(evt: Event) {
			let type: VideoPlaybackEvent;
			let data: any = null;
			let element: HTMLVideoElement = this._video;
			switch (evt.type) {
				case "play":
					if (!this._pauseHappening) {
						return;
					}
					type = VideoPlaybackEvent.Unpause;
					break;
				case "pause":
					if (this._state === RenderableVideoState.Playing) {
						element.play();
						return;
					}
					type = VideoPlaybackEvent.Pause;
					this._pauseHappening = true;
					break;
				case "ended":
					this._state = RenderableVideoState.Ended;
					this._notifyNetStream(VideoPlaybackEvent.PlayStop, data);
					type = VideoPlaybackEvent.BufferEmpty;
					break;
				case "loadeddata":
					this._pauseHappening = false;
					this._notifyNetStream(VideoPlaybackEvent.PlayStart, data);
					this.play();
					return;
				case "canplay":
					if (this._pauseHappening) {
						return;
					}
					type = VideoPlaybackEvent.BufferFull;
					break;
				case "progress":
					type = VideoPlaybackEvent.Progress;
					break;
				case "suspend":
//          type = VideoPlaybackEvent.BufferEmpty;
//          break;
					return;
				case "loadedmetadata":
					type = VideoPlaybackEvent.Metadata;
					data = {
						videoWidth: element.videoWidth,
						videoHeight: element.videoHeight,
						duration: element.duration
					};
					break;
				case "error":
					type = VideoPlaybackEvent.Error;
					data = {
						code: element.error.code
					};
					break;
				case "seeking":
					if (!this._seekHappening) {
						return;
					}
					type = VideoPlaybackEvent.Seeking;
					break;
				case "seeked":
					if (!this._seekHappening) {
						return;
					}
					type = VideoPlaybackEvent.Seeked;
					this._seekHappening = false;
					break;
				default:
					return; // unhandled event
			}
			this._notifyNetStream(type, data);
		}

		private _notifyNetStream(eventType: VideoPlaybackEvent, data: any): void {
			this._eventSerializer.sendVideoPlaybackEvent(this._assetId, eventType, data);
		}

		processControlRequest(type: VideoControlEvent, data: any): any {
			let videoElement = this._video;
			let ESTIMATED_VIDEO_SECOND_SIZE: number = 500;
			switch (type) {
				case VideoControlEvent.Init:
					videoElement.src = data.url;
					this.play();
					this._notifyNetStream(VideoPlaybackEvent.Initialized, null);
					break;
				case VideoControlEvent.EnsurePlaying:
					if (videoElement.paused) {
						videoElement.play();
					}
					break;
				case VideoControlEvent.Pause:
					if (videoElement) {
						if (data.paused && !videoElement.paused) {
							if (!isNaN(data.time)) {
								if (videoElement.seekable.length !== 0) {
									videoElement.currentTime = data.time;
								}
								this._lastPausedTime = data.time;
							} else {
								this._lastPausedTime = videoElement.currentTime;
							}
							this.pause();
						} else if (!data.paused && videoElement.paused) {
							this.play();
							if (!isNaN(data.time) && this._lastPausedTime !== data.time && videoElement.seekable.length !== 0) {
								videoElement.currentTime = data.time;
							}
						}
					}
					return;
				case VideoControlEvent.Seek:
					if (videoElement && videoElement.seekable.length !== 0) {
						this._seekHappening = true;
						videoElement.currentTime = data.time;
					}
					return;
				case VideoControlEvent.GetTime:
					return videoElement ? videoElement.currentTime : 0;
				case VideoControlEvent.GetBufferLength:
					return videoElement ? videoElement.duration : 0;
				case VideoControlEvent.SetSoundLevels:
					if (videoElement) {
						videoElement.volume = data.volume;
					}
					return;
				case VideoControlEvent.GetBytesLoaded:
					if (!videoElement) {
						return 0;
					}
					let bufferedTill: number = -1;
					if (videoElement.buffered) {
						for (let i = 0; i < videoElement.buffered.length; i++) {
							bufferedTill = Math.max(bufferedTill, videoElement.buffered.end(i));
						}
					} else {
						bufferedTill = videoElement.duration;
					}
					return Math.round(bufferedTill * ESTIMATED_VIDEO_SECOND_SIZE);
				case VideoControlEvent.GetBytesTotal:
					return videoElement ? Math.round(videoElement.duration * ESTIMATED_VIDEO_SECOND_SIZE) : 0;
			}
		}

		public checkForUpdate() {
			if (this._lastTimeInvalidated !== this._video.currentTime) {
				// Videos composited using DOM elements don't need to invalidate parents.
				if (!this._isDOMElement) {
					this.invalidate();
				}
			}
			this._lastTimeInvalidated = this._video.currentTime;
		}

		public static checkForVideoUpdates() {
			let renderables = RenderableVideo._renderableVideos;
			for (let i = 0; i < renderables.length; i++) {
				let renderable = renderables[i];
				// Check if the node will be reached by the renderer.
				if (renderable.willRender()) {
					// If the nodes video element isn't already on the video layer, mark the node as invalid to
					// make sure the video element will be added the next time the renderer reaches it.
					if (!renderable._video.parentElement) {
						renderable.invalidate();
					}
					renderable._video.style.zIndex = renderable.parents[0].depth + '';
				} else if (renderable._video.parentElement) {
					// The nodes video element should be removed if no longer visible.
					renderable._dispatchEvent(NodeEventType.RemovedFromStage);
				}
				renderables[i].checkForUpdate();
			}
		}

		render(context: CanvasRenderingContext2D, ratio: number, cullBounds: Rectangle): void {
			enterTimeline("RenderableVideo.render");
			let videoElement = this._video;
			if (videoElement && videoElement.videoWidth > 0) {
				context.drawImage(videoElement,
					0, 0, videoElement.videoWidth, videoElement.videoHeight,
					0, 0, this._bounds.w, this._bounds.h);
			}
			leaveTimeline("RenderableVideo.render");
		}
	}

	export class RenderableBitmap extends Renderable {
		_flags = NodeFlags.Dynamic | NodeFlags.Dirty;
		// properties: { [name: string]: any } = {};
		_canvas: HTMLCanvasElement;
		_context: CanvasRenderingContext2D;
		_imageData: ImageData; // Created lazily when an image is created from a BitmapData instance.
		private _sourceImage: HTMLImageElement;
		private fillStyle: ColorStyle;

		public static FromDataBuffer(type: ImageType, dataBuffer: DataBuffer, bounds: Rectangle): RenderableBitmap {
			enterTimeline("RenderableBitmap.FromDataBuffer");
			let canvas = document.createElement("canvas");
			canvas.width = bounds.w;
			canvas.height = bounds.h;
			let renderableBitmap = new RenderableBitmap(canvas, bounds);
			renderableBitmap.updateFromDataBuffer(type, dataBuffer);
			leaveTimeline("RenderableBitmap.FromDataBuffer");
			return renderableBitmap;
		}

		public static FromNode(source: Node, matrix: Shumway.GFX.Geometry.Matrix, colorMatrix: Shumway.GFX.ColorMatrix, blendMode: number, clipRect: Rectangle) {
			enterTimeline("RenderableBitmap.FromFrame");
			let canvas = document.createElement("canvas");
			let bounds = source.getBounds();
			canvas.width = bounds.w;
			canvas.height = bounds.h;
			let renderableBitmap = new RenderableBitmap(canvas, bounds);
			renderableBitmap.drawNode(source, matrix, colorMatrix, blendMode, clipRect);
			leaveTimeline("RenderableBitmap.FromFrame");
			return renderableBitmap;
		}

		/**
		 * Returns a RenderableBitmap from an Image element, which it uses as its source.
		 *
		 * Takes `width` and `height` as arguments so it can deal with non-decoded images,
		 * which will only get their data after asynchronous decoding has completed.
		 */
		public static FromImage(image: HTMLImageElement, width: number, height: number) {
			return new RenderableBitmap(image, new Rectangle(0, 0, width, height));
		}

		public updateFromDataBuffer(type: ImageType, dataBuffer: DataBuffer) {
			if (!imageUpdateOption.value) {
				return;
			}
			let buffer = dataBuffer.buffer;
			enterTimeline("RenderableBitmap.updateFromDataBuffer", {length: dataBuffer.length});
			if (type === ImageType.JPEG || type === ImageType.PNG || type === ImageType.GIF) {
				release || Debug.assertUnreachable("Mustn't encounter un-decoded images here");
			} else {
				let bounds = this._bounds;
				let imageData = this._imageData;
				if (!imageData || imageData.width !== bounds.w || imageData.height !== bounds.h) {
					imageData = this._imageData = this._context.createImageData(bounds.w, bounds.h);
				}
				if (imageConvertOption.value) {
					enterTimeline("ColorUtilities.convertImage");
					let pixels = new Int32Array(buffer);
					let out = new Int32Array((<any>imageData.data).buffer);
					ColorUtilities.convertImage(type, ImageType.StraightAlphaRGBA, pixels, out);
					leaveTimeline("ColorUtilities.convertImage");
				}
				enterTimeline("putImageData");
				this._ensureSourceCanvas();
				this._context.putImageData(imageData, 0, 0);
				leaveTimeline("putImageData");
			}
			this.invalidate();
			leaveTimeline("RenderableBitmap.updateFromDataBuffer");
		}

		/**
		 * Writes the image data into the given |output| data buffer.
		 */
		public readImageData(output: DataBuffer) {
			output.writeRawBytes((<any>this.imageData).data);
		}

		constructor(source: any /* HTMLImageElement | HTMLCanvasElement */, bounds: Rectangle) {
			super();
			this.setBounds(bounds);
			if (source instanceof HTMLCanvasElement) {
				this._initializeSourceCanvas(source);
			} else {
				this._sourceImage = source;
			}
		}

		render(context: CanvasRenderingContext2D, ratio: number, cullBounds: Rectangle): void {
			enterTimeline("RenderableBitmap.render");
			if (this.renderSource) {
				context.drawImage(this.renderSource, 0, 0);
			} else {
				this._renderFallback(context);
			}
			leaveTimeline("RenderableBitmap.render");
		}

		drawNode(source: Node, matrix: Shumway.GFX.Geometry.Matrix,
		         colorMatrix: Shumway.GFX.ColorMatrix, blendMode: number, clip: Rectangle): void {
			// TODO: Support colorMatrix and blendMode.
			enterTimeline("RenderableBitmap.drawFrame");
			// TODO: Hack to be able to compile this as part of gfx-base.
			let Canvas2D = (<any>GFX).Canvas2D;
			let bounds = this.getBounds();
			// TODO: don't create a new renderer every time.
			let renderer = new Canvas2D.Canvas2DRenderer(this._canvas, null);
			renderer.renderNode(source, clip || bounds, matrix);
			leaveTimeline("RenderableBitmap.drawFrame");
		}

		mask(alphaValues: Uint8Array) {
			let imageData = this.imageData;
			let pixels = new Int32Array((<any>imageData.data).buffer);
			let T = Shumway.ColorUtilities.getUnpremultiplyTable();
			for (let i = 0; i < alphaValues.length; i++) {
				let a = alphaValues[i];
				if (a === 0) {
					pixels[i] = 0;
					continue;
				}
				if (a === 0xff) {
					continue;
				}
				let pixel = pixels[i];
				let r = (pixel >> 0) & 0xff;
				let g = (pixel >> 8) & 0xff;
				let b = (pixel >> 16) & 0xff;
				let o = a << 8;
				r = T[o + Math.min(r, a)];
				g = T[o + Math.min(g, a)];
				b = T[o + Math.min(b, a)];
				pixels[i] = a << 24 | b << 16 | g << 8 | r;
			}
			this._context.putImageData(imageData, 0, 0);
		}

		private _initializeSourceCanvas(source: HTMLCanvasElement) {
			this._canvas = source;
			this._context = this._canvas.getContext("2d");
		}

		private _ensureSourceCanvas() {
			if (this._canvas) {
				return;
			}
			let canvas = document.createElement("canvas");
			let bounds = this._bounds;
			canvas.width = bounds.w;
			canvas.height = bounds.h;
			this._initializeSourceCanvas(canvas);
		}

		private get imageData(): ImageData {
			if (!this._canvas) {
				release || assert(this._sourceImage);
				this._ensureSourceCanvas();
				this._context.drawImage(this._sourceImage, 0, 0);
				this._sourceImage = null;
			}
			return this._context.getImageData(0, 0, this._bounds.w, this._bounds.h);
		}

		get renderSource(): any {// Image |  HTMLCanvasElement
			return this._canvas || this._sourceImage;
		}

		private _renderFallback(context: CanvasRenderingContext2D) {
			// Only render fallback in debug mode.
			if (release) {
				return;
			}
			if (!this.fillStyle) {
				this.fillStyle = Shumway.ColorStyle.randomStyle();
			}
			let bounds = this._bounds;
			context.save();
			context.beginPath();
			context.lineWidth = 2;
			context.fillStyle = this.fillStyle as string;
			context.fillRect(bounds.x, bounds.y, bounds.w, bounds.h);
			context.restore();
		}
	}

	export const enum PathType {
		Fill,
		Stroke,
		StrokeFill /* Doesn't define thickness, caps and joints. */
	}

	export class StyledPath {
		path: Path2D;
		shareBorder: boolean;

		constructor(public type: PathType, public style: any, public smoothImage: boolean,
		            public strokeProperties: StrokeProperties) {
			this.path = new Path2D();
			this.shareBorder = false;
			release || assert((type === PathType.Stroke ||
				type === PathType.StrokeFill) === !!strokeProperties);
		}
	}

	export class StrokeProperties {
		constructor(public thickness: number, public scaleMode: LineScaleMode,
		            public capsStyle: string, public jointsStyle: string,
		            public miterLimit: number) {
		}
	}

	function morph(start: number, end: number, ratio: number): number {
		return start + (end - start) * ratio;
	}

	function morphColor(start: number, end: number, ratio: number): number {
		return morph(start >> 24 & 0xff, end >> 24 & 0xff, ratio) << 24 |
			morph(start >> 16 & 0xff, end >> 16 & 0xff, ratio) << 16 |
			morph(start >> 8 & 0xff, end >> 8 & 0xff, ratio) << 8 |
			morph(start & 0xff, end & 0xff, ratio);
	}

	let tempCoordinateMap: { [key: string]: number } = {};

	function clearPointMap() {
		tempCoordinateMap = {};
	}

	function checkPointMap(x: number, y: number, newVal: number) {
		let key = x+"#"+y;
		let val = tempCoordinateMap[key];
		if (val === undefined)
		{
			tempCoordinateMap[key] = newVal;
			return false;
		}
		if (val === newVal)
		{
			return false;
		}
		tempCoordinateMap[key] = newVal;
		return true;
	}

	export class RenderableShape extends Renderable {
		_flags: NodeFlags = NodeFlags.Dirty |
			NodeFlags.Scalable |
			NodeFlags.Tileable;

		// properties: { [name: string]: any } = {};

		private fillStyle: ColorStyle;
		private _paths: StyledPath[];

		protected _id: number;
		protected _pathData: ShapeData;
		protected _textures: RenderableBitmap[];

		protected static LINE_CAPS_STYLES = ['round', 'butt', 'square'];
		protected static LINE_JOINTS_STYLES = ['round', 'bevel', 'miter'];

		constructor(id: number, pathData: ShapeData, textures: RenderableBitmap[], bounds: Rectangle) {
			super();
			this.setBounds(bounds);
			this._id = id;
			this._pathData = pathData;
			this._textures = textures;
			if (textures.length) {
				this.setFlags(NodeFlags.Dynamic);
			}
		}

		update(pathData: ShapeData, textures: RenderableBitmap[], bounds: Rectangle) {
			this.setBounds(bounds);
			this._pathData = pathData;
			this._paths = null;
			this._textures = textures;
			this.setFlags(NodeFlags.Dynamic);
			this.invalidate();
		}

		/**
		 * If |clipPath| is not |null| then we must add all paths to |clipPath| instead of drawing to |context|.
		 * We also cannot call |save| or |restore| because those functions reset the current clipping region.
		 * It looks like Flash ignores strokes when clipping so we can also ignore stroke paths when computing
		 * the clip region.
		 *
		 * If |paintStencil| is |true| then we must not create any alpha values, and also not paint
		 * any strokes.
		 */
		render(context: CanvasRenderingContext2D, ratio: number, cullBounds: Rectangle,
		       clipPath: Path2D = null, paintStencil: boolean = false, fillAdditive = false): void {
			let paintStencilStyle = release ? '#000000' : '#FF4981';
			context.fillStyle = context.strokeStyle = 'transparent';

			let paths = this._deserializePaths(this._pathData, context, ratio, fillAdditive);
			release || assert(paths);

			enterTimeline("RenderableShape.render", this);
			for (let i = 0; i < paths.length; i++) {
				let path = paths[i];
				context['mozImageSmoothingEnabled'] = context.msImageSmoothingEnabled =
					context['imageSmoothingEnabled'] =
						path.smoothImage;
				if (path.type === PathType.Fill) {
					if (clipPath) {
						clipPath.addPath(path.path, (<any>context).currentTransform);
					} else {
						if (fillAdditive && path.shareBorder) {
							context.globalCompositeOperation = 'lighter';
						}
						context.fillStyle = paintStencil ? paintStencilStyle : path.style;
						context.fill(path.path, 'evenodd');
						context.fillStyle = 'transparent';
						if (fillAdditive && path.shareBorder) {
							context.globalCompositeOperation = 'source-over';
						}
					}
				} else if (!clipPath && !paintStencil) {
					context.strokeStyle = path.style;
					let lineScaleMode = LineScaleMode.Normal;
					if (path.strokeProperties) {
						lineScaleMode = path.strokeProperties.scaleMode;
						context.lineWidth = path.strokeProperties.thickness;
						context.lineCap = path.strokeProperties.capsStyle;
						context.lineJoin = path.strokeProperties.jointsStyle;
						context.miterLimit = path.strokeProperties.miterLimit;
					}
					// Special-cases 1px and 3px lines by moving the drawing position down/right by 0.5px.
					// Flash apparently does this to create sharp, non-aliased lines in the normal case of thin
					// lines drawn on round pixel values.
					// Our handling doesn't always create the same results: for drawing coordinates with
					// fractional values, Flash draws blurry lines. We do, too, but we still move the line
					// down/right. Flash does something slightly different, with the result that a line drawn
					// on coordinates slightly below round pixels (0.8, say) will be moved up/left.
					// Properly fixing this would probably have to happen in the rasterizer. Or when replaying
					// all the drawing commands, which seems expensive.
					let lineWidth = context.lineWidth;
					let isSpecialCaseWidth = lineWidth === 1 || lineWidth === 3;
					if (isSpecialCaseWidth) {
						context.translate(0.5, 0.5);
					}
					context.flashStroke(path.path, lineScaleMode);
					if (isSpecialCaseWidth) {
						context.translate(-0.5, -0.5);
					}
					context.strokeStyle = 'transparent';
				}
			}
			context.globalCompositeOperation = 'source-over'
			leaveTimeline("RenderableShape.render");
		}

		protected _deserializePaths(data: ShapeData, context: CanvasRenderingContext2D,
		                            ratio: number, checkBorder?: boolean): StyledPath[] {
			release || assert(data ? !this._paths : this._paths);
			enterTimeline("RenderableShape.deserializePaths");
			// TODO: Optimize path handling to use only one path if possible.
			// If both line and fill style are set at the same time, we don't need to duplicate the
			// geometry.

			if (this._paths) {
				return this._paths;
			}

			let paths: Array<StyledPath> = this._paths = [];

			let fillPath: Path2D = null;
			let fillStyled: StyledPath = null;
			let strokePath: Path2D = null;
			let fillNumber = 0;

			if (checkBorder) {
				clearPointMap();
			}

			// We have to alway store the last position because Flash keeps the drawing cursor where it
			// was when changing fill or line style, whereas Canvas forgets it on beginning a new path.
			let x = 0;
			let y = 0;
			let cpX: number;
			let cpY: number;
			let formOpen = false;
			let formOpenX = 0;
			let formOpenY = 0;
			let commands = data.commands;
			let coordinates = data.coordinates;
			let styles = data.styles;
			styles.position = 0;
			let coordinatesIndex = 0;
			let commandsCount = data.commandsPosition;
			// Description of serialization format can be found in flash.display.Graphics.
			let commandIndex;
			for (commandIndex = 0; commandIndex < commandsCount; commandIndex++) {
				let command = commands[commandIndex];
				let readX = 0;
				let readY = 0;
				switch (command) {
					case PathCommand.MoveTo:
						release || assert(coordinatesIndex <= data.coordinatesPosition - 2);
						if (formOpen && fillPath) {
							fillPath.lineTo(formOpenX, formOpenY);
							strokePath && strokePath.lineTo(formOpenX, formOpenY);
						}
						formOpen = true;
						readX = coordinates[coordinatesIndex++];
						readY = coordinates[coordinatesIndex++];
						x = formOpenX = readX / 20;
						y = formOpenY = readY / 20;
						fillPath && fillPath.moveTo(x, y);
						strokePath && strokePath.moveTo(x, y);
						break;
					case PathCommand.LineTo:
						release || assert(coordinatesIndex <= data.coordinatesPosition - 2);
						readX = coordinates[coordinatesIndex++];
						readY = coordinates[coordinatesIndex++];
						x = readX / 20;
						y = readY / 20;
						fillPath && fillPath.lineTo(x, y);
						strokePath && strokePath.lineTo(x, y);
						break;
					case PathCommand.CurveTo:
						release || assert(coordinatesIndex <= data.coordinatesPosition - 4);
						cpX = coordinates[coordinatesIndex++] / 20;
						cpY = coordinates[coordinatesIndex++] / 20;
						readX = coordinates[coordinatesIndex++];
						readY = coordinates[coordinatesIndex++];
						x = readX / 20;
						y = readY / 20;
						fillPath && fillPath.quadraticCurveTo(cpX, cpY, x, y);
						strokePath && strokePath.quadraticCurveTo(cpX, cpY, x, y);
						break;
					case PathCommand.CubicCurveTo:
						release || assert(coordinatesIndex <= data.coordinatesPosition - 6);
						cpX = coordinates[coordinatesIndex++] / 20;
						cpY = coordinates[coordinatesIndex++] / 20;
						let cpX2 = coordinates[coordinatesIndex++] / 20;
						let cpY2 = coordinates[coordinatesIndex++] / 20;
						readX = coordinates[coordinatesIndex++];
						readY = coordinates[coordinatesIndex++];
						x = readX / 20;
						y = readY / 20;
						fillPath && fillPath.bezierCurveTo(cpX, cpY, cpX2, cpY2, x, y);
						strokePath && strokePath.bezierCurveTo(cpX, cpY, cpX2, cpY2, x, y);
						break;
					case PathCommand.BeginSolidFill:
						release || assert(styles.bytesAvailable >= 4);
						fillStyled = this._createPath(PathType.Fill,
							ColorUtilities.rgbaToCSSStyle(styles.readUnsignedInt()),
							false, null, x, y);
						fillPath = fillStyled.path;
						fillNumber++;
						break;
					case PathCommand.BeginBitmapFill:
						let bitmapStyle = this._readBitmap(styles, context);
						fillStyled = this._createPath(PathType.Fill, bitmapStyle.style, bitmapStyle.smoothImage,
							null, x, y);
						fillPath = fillStyled.path;
						fillNumber++;
						break;
					case PathCommand.BeginGradientFill:
						fillStyled = this._createPath(PathType.Fill, this._readGradient(styles, context),
							false, null, x, y);
						fillPath = fillStyled.path;
						fillNumber++;
						break;
					case PathCommand.EndFill:
						fillPath = null;
						break;
					case PathCommand.LineStyleSolid:
						let color = ColorUtilities.rgbaToCSSStyle(styles.readUnsignedInt());
						// Skip pixel hinting.
						styles.position += 1;
						let scaleMode: LineScaleMode = styles.readByte();
						let capsStyle: string = RenderableShape.LINE_CAPS_STYLES[styles.readByte()];
						let jointsStyle: string = RenderableShape.LINE_JOINTS_STYLES[styles.readByte()];
						let strokeProperties = new StrokeProperties(coordinates[coordinatesIndex++] / 20,
							scaleMode, capsStyle, jointsStyle, styles.readByte());
						// Look ahead at the following command to determine if this is a complex stroke style.
						if (commands[commandIndex + 1] === PathCommand.LineStyleGradient) {
							commandIndex++;
							strokePath = this._createPath(PathType.StrokeFill, this._readGradient(styles, context),
								false, strokeProperties, x, y).path;
						} else if (commands[commandIndex + 1] === PathCommand.LineStyleGradient) {
							commandIndex++;
							let bitmapStyle = this._readBitmap(styles, context);
							strokePath = this._createPath(PathType.StrokeFill, bitmapStyle.style,
								bitmapStyle.smoothImage, strokeProperties, x, y).path;
						} else {
							strokePath = this._createPath(PathType.Stroke, color, false, strokeProperties, x, y).path;
						}
						break;
					case PathCommand.LineEnd:
						strokePath = null;
						break;
					default:
						release || assertUnreachable('Invalid command ' + command + ' encountered at index' +
							commandIndex + ' of ' + commandsCount);
				}

				if (fillPath && readX && readY) {
					if (!strokePath && checkBorder) {
						fillStyled.shareBorder = checkPointMap(readX, readY, fillNumber) || fillStyled.shareBorder;
					}
				}
			}
			release || assert(styles.bytesAvailable === 0);
			release || assert(commandIndex === commandsCount);
			release || assert(coordinatesIndex === data.coordinatesPosition);
			if (formOpen && fillPath) {
				fillPath.lineTo(formOpenX, formOpenY);
				strokePath && strokePath.lineTo(formOpenX, formOpenY);
			}
			this._pathData = null;
			leaveTimeline("RenderableShape.deserializePaths");

			return paths;
		}

		private _createPath(type: PathType, style: any, smoothImage: boolean,
		                    strokeProperties: StrokeProperties, x: number, y: number): StyledPath {
			let path = new StyledPath(type, style, smoothImage, strokeProperties);
			this._paths.push(path);
			path.path.moveTo(x, y);
			return path;
		}

		private _readMatrix(data: DataBuffer): Matrix {
			return new Matrix(
				data.readFloat(), data.readFloat(), data.readFloat(),
				data.readFloat(), data.readFloat(), data.readFloat()
			);
		}

		private _readGradient(styles: DataBuffer, context: CanvasRenderingContext2D): CanvasGradient {
			// Assert at least one color stop.
			release || assert(styles.bytesAvailable >= 1 + 1 + 6 * 4 /* matrix fields as floats */ +
				1 + 1 + 4 + 1 + 1);
			let gradientType = styles.readUnsignedByte();
			let focalPoint = styles.readShort() * 2 / 0xff;
			release || assert(focalPoint >= -1 && focalPoint <= 1);
			let transform = this._readMatrix(styles);
			let gradient = gradientType === GradientType.Linear ?
				context.createLinearGradient(-1, 0, 1, 0) :
				context.createRadialGradient(focalPoint, 0, 0, 0, 0, 1);
			gradient.setTransform && gradient.setTransform(transform.toSVGMatrix());
			let colorStopsCount = styles.readUnsignedByte();
			for (let i = 0; i < colorStopsCount; i++) {
				let ratio = styles.readUnsignedByte() / 0xff;
				let cssColor = ColorUtilities.rgbaToCSSStyle(styles.readUnsignedInt());
				gradient.addColorStop(ratio, cssColor);
			}

			// Skip spread and interpolation modes for now.
			styles.position += 2;

			return gradient;
		}

		private _readBitmap(styles: DataBuffer,
		                    context: CanvasRenderingContext2D): {
			style: CanvasPattern;
			smoothImage: boolean
		} {
			release || assert(styles.bytesAvailable >= 4 + 6 * 4 /* matrix fields as floats */ + 1 + 1);
			let textureIndex = styles.readUnsignedInt();
			let fillTransform: Matrix = this._readMatrix(styles);
			let repeat = styles.readBoolean() ? 'repeat' : 'no-repeat';
			let smooth = styles.readBoolean();
			let texture = this._textures[textureIndex];
			let fillStyle: CanvasPattern;
			if (texture) {
				fillStyle = context.createPattern(texture.renderSource, repeat);
				fillStyle.setTransform(fillTransform.toSVGMatrix());
			} else {
				// TODO: Wire up initially-missing textures that become available later.
				// An invalid SWF can have shape fills refer to images that occur later in the SWF. In that
				// case, the image only becomes available once that frame is actually reached. Before that
				// the fill isn't drawn; it is drawn once the image becomes available, though.
				fillStyle = null;
			}
			return {style: fillStyle, smoothImage: smooth};
		}

		protected _renderFallback(context: CanvasRenderingContext2D) {
			if (!this.fillStyle) {
				this.fillStyle = Shumway.ColorStyle.randomStyle();
			}
			let bounds = this._bounds;
			context.save();
			context.beginPath();
			context.lineWidth = 2;
			context.fillStyle = this.fillStyle as string;
			context.fillRect(bounds.x, bounds.y, bounds.w, bounds.h);
//      context.textBaseline = "top";
//      context.fillStyle = "white";
//      context.fillText(String(id), bounds.x, bounds.y);
			context.restore();
		}

	}

	export class RenderableMorphShape extends RenderableShape {
		_flags: NodeFlags = NodeFlags.Dynamic |
			NodeFlags.Dirty |
			NodeFlags.Scalable |
			NodeFlags.Tileable;

		private _morphPaths: { [key: number]: StyledPath[] } = Object.create(null);

		protected _deserializePaths(data: ShapeData, context: CanvasRenderingContext2D, ratio: number): StyledPath[] {
			enterTimeline("RenderableMorphShape.deserializePaths");
			// TODO: Optimize path handling to use only one path if possible.
			// If both line and fill style are set at the same time, we don't need to duplicate the
			// geometry.

			if (this._morphPaths[ratio]) {
				return this._morphPaths[ratio];
			}

			let paths: Array<StyledPath> = this._morphPaths[ratio] = [];

			let fillPath: Path2D = null;
			let strokePath: Path2D = null;

			// We have to alway store the last position because Flash keeps the drawing cursor where it
			// was when changing fill or line style, whereas Canvas forgets it on beginning a new path.
			let x = 0;
			let y = 0;
			let cpX: number;
			let cpY: number;
			let formOpen = false;
			let formOpenX = 0;
			let formOpenY = 0;
			let commands = data.commands;
			let coordinates = data.coordinates;
			let morphCoordinates = data.morphCoordinates;
			let styles = data.styles;
			let morphStyles = data.morphStyles;
			styles.position = 0;
			morphStyles.position = 0;
			let coordinatesIndex = 0;
			let commandsCount = data.commandsPosition;
			// Description of serialization format can be found in flash.display.Graphics.
			let commandIndex;
			for (commandIndex = 0; commandIndex < commandsCount; commandIndex++) {
				let command = commands[commandIndex];
				switch (command) {
					case PathCommand.MoveTo:
						release || assert(coordinatesIndex <= data.coordinatesPosition - 2);
						if (formOpen && fillPath) {
							fillPath.lineTo(formOpenX, formOpenY);
							strokePath && strokePath.lineTo(formOpenX, formOpenY);
						}
						formOpen = true;
						x = formOpenX = morph(coordinates[coordinatesIndex],
							morphCoordinates[coordinatesIndex++], ratio) / 20;
						y = formOpenY = morph(coordinates[coordinatesIndex],
							morphCoordinates[coordinatesIndex++], ratio) / 20;
						fillPath && fillPath.moveTo(x, y);
						strokePath && strokePath.moveTo(x, y);
						break;
					case PathCommand.LineTo:
						release || assert(coordinatesIndex <= data.coordinatesPosition - 2);
						x = morph(coordinates[coordinatesIndex],
							morphCoordinates[coordinatesIndex++], ratio) / 20;
						y = morph(coordinates[coordinatesIndex],
							morphCoordinates[coordinatesIndex++], ratio) / 20;
						fillPath && fillPath.lineTo(x, y);
						strokePath && strokePath.lineTo(x, y);
						break;
					case PathCommand.CurveTo:
						release || assert(coordinatesIndex <= data.coordinatesPosition - 4);
						cpX = morph(coordinates[coordinatesIndex],
							morphCoordinates[coordinatesIndex++], ratio) / 20;
						cpY = morph(coordinates[coordinatesIndex],
							morphCoordinates[coordinatesIndex++], ratio) / 20;
						x = morph(coordinates[coordinatesIndex],
							morphCoordinates[coordinatesIndex++], ratio) / 20;
						y = morph(coordinates[coordinatesIndex],
							morphCoordinates[coordinatesIndex++], ratio) / 20;
						fillPath && fillPath.quadraticCurveTo(cpX, cpY, x, y);
						strokePath && strokePath.quadraticCurveTo(cpX, cpY, x, y);
						break;
					case PathCommand.CubicCurveTo:
						release || assert(coordinatesIndex <= data.coordinatesPosition - 6);
						cpX = morph(coordinates[coordinatesIndex],
							morphCoordinates[coordinatesIndex++], ratio) / 20;
						cpY = morph(coordinates[coordinatesIndex],
							morphCoordinates[coordinatesIndex++], ratio) / 20;
						let cpX2 = morph(coordinates[coordinatesIndex],
							morphCoordinates[coordinatesIndex++], ratio) / 20;
						let cpY2 = morph(coordinates[coordinatesIndex],
							morphCoordinates[coordinatesIndex++], ratio) / 20;
						x = morph(coordinates[coordinatesIndex],
							morphCoordinates[coordinatesIndex++], ratio) / 20;
						y = morph(coordinates[coordinatesIndex],
							morphCoordinates[coordinatesIndex++], ratio) / 20;
						fillPath && fillPath.bezierCurveTo(cpX, cpY, cpX2, cpY2, x, y);
						strokePath && strokePath.bezierCurveTo(cpX, cpY, cpX2, cpY2, x, y);
						break;
					case PathCommand.BeginSolidFill:
						release || assert(styles.bytesAvailable >= 4);
						fillPath = this._createMorphPath(PathType.Fill, ratio,
							ColorUtilities.rgbaToCSSStyle(
								morphColor(styles.readUnsignedInt(), morphStyles.readUnsignedInt(), ratio)
							),
							false, null, x, y);
						break;
					case PathCommand.BeginBitmapFill:
						let bitmapStyle = this._readMorphBitmap(styles, morphStyles, ratio, context);
						fillPath = this._createMorphPath(PathType.Fill, ratio, bitmapStyle.style, bitmapStyle.smoothImage,
							null, x, y);
						break;
					case PathCommand.BeginGradientFill:
						let gradientStyle = this._readMorphGradient(styles, morphStyles, ratio, context);
						fillPath = this._createMorphPath(PathType.Fill, ratio, gradientStyle,
							false, null, x, y);
						break;
					case PathCommand.EndFill:
						fillPath = null;
						break;
					case PathCommand.LineStyleSolid:
						let width = morph(coordinates[coordinatesIndex],
							morphCoordinates[coordinatesIndex++], ratio) / 20;
						let color = ColorUtilities.rgbaToCSSStyle(
							morphColor(styles.readUnsignedInt(), morphStyles.readUnsignedInt(), ratio)
						);
						// Skip pixel hinting.
						styles.position += 1;
						let scaleMode: LineScaleMode = styles.readByte();
						let capsStyle: string = RenderableShape.LINE_CAPS_STYLES[styles.readByte()];
						let jointsStyle: string = RenderableShape.LINE_JOINTS_STYLES[styles.readByte()];
						let strokeProperties = new StrokeProperties(
							width, scaleMode, capsStyle, jointsStyle, styles.readByte());
						if (strokeProperties.thickness > 0) {
							strokePath = this._createMorphPath(PathType.Stroke, ratio, color, false, strokeProperties, x, y);
						}
						break;
					case PathCommand.LineStyleGradient:
						gradientStyle = this._readMorphGradient(styles, morphStyles, ratio, context);
						strokePath = this._createMorphPath(PathType.StrokeFill, ratio, gradientStyle,
							false, null, x, y);
						break;
					case PathCommand.LineStyleBitmap:
						bitmapStyle = this._readMorphBitmap(styles, morphStyles, ratio, context);
						strokePath = this._createMorphPath(PathType.StrokeFill, ratio, bitmapStyle.style,
							bitmapStyle.smoothImage, null, x, y);
						break;
					case PathCommand.LineEnd:
						strokePath = null;
						break;
					default:
						release || assertUnreachable('Invalid command ' + command + ' encountered at index' +
							commandIndex + ' of ' + commandsCount);
				}
			}
			release || assert(styles.bytesAvailable === 0);
			release || assert(commandIndex === commandsCount);
			release || assert(coordinatesIndex === data.coordinatesPosition);
			if (formOpen && fillPath) {
				fillPath.lineTo(formOpenX, formOpenY);
				strokePath && strokePath.lineTo(formOpenX, formOpenY);
			}
			leaveTimeline("RenderableMorphShape.deserializPaths");

			return paths;
		}

		private _createMorphPath(type: PathType, ratio: number, style: any, smoothImage: boolean,
		                         strokeProperties: StrokeProperties, x: number, y: number): Path2D {
			let path = new StyledPath(type, style, smoothImage, strokeProperties);
			this._morphPaths[ratio].push(path);
			path.path.moveTo(x, y);
			return path.path;
		}

		private _readMorphMatrix(data: DataBuffer, morphData: DataBuffer, ratio: number): Matrix {
			return new Matrix(
				morph(data.readFloat(), morphData.readFloat(), ratio),
				morph(data.readFloat(), morphData.readFloat(), ratio),
				morph(data.readFloat(), morphData.readFloat(), ratio),
				morph(data.readFloat(), morphData.readFloat(), ratio),
				morph(data.readFloat(), morphData.readFloat(), ratio),
				morph(data.readFloat(), morphData.readFloat(), ratio)
			);
		}

		private _readMorphGradient(styles: DataBuffer, morphStyles: DataBuffer, ratio: number,
		                           context: CanvasRenderingContext2D): CanvasGradient {
			// Assert at least one color stop.
			release || assert(styles.bytesAvailable >= 1 + 1 + 6 * 4 /* matrix fields as floats */ +
				1 + 1 + 4 + 1 + 1);
			let gradientType = styles.readUnsignedByte();
			let focalPoint = styles.readShort() * 2 / 0xff;
			release || assert(focalPoint >= -1 && focalPoint <= 1);
			let transform = this._readMorphMatrix(styles, morphStyles, ratio);
			let gradient = gradientType === GradientType.Linear ?
				context.createLinearGradient(-1, 0, 1, 0) :
				context.createRadialGradient(focalPoint, 0, 0, 0, 0, 1);
			gradient.setTransform && gradient.setTransform(transform.toSVGMatrix());
			let colorStopsCount = styles.readUnsignedByte();
			for (let i = 0; i < colorStopsCount; i++) {
				let stop = morph(
					styles.readUnsignedByte() / 0xff, morphStyles.readUnsignedByte() / 0xff, ratio
				);
				let color = morphColor(
					styles.readUnsignedInt(), morphStyles.readUnsignedInt(), ratio
				);
				let cssColor = ColorUtilities.rgbaToCSSStyle(color);
				gradient.addColorStop(stop, cssColor);
			}

			// Skip spread and interpolation modes for now.
			styles.position += 2;

			return gradient;
		}

		private _readMorphBitmap(styles: DataBuffer, morphStyles: DataBuffer, ratio: number,
		                         context: CanvasRenderingContext2D): {
			style: CanvasPattern;
			smoothImage: boolean
		} {
			release || assert(styles.bytesAvailable >= 4 + 6 * 4 /* matrix fields as floats */ + 1 + 1);
			let textureIndex = styles.readUnsignedInt();
			let fillTransform: Matrix = this._readMorphMatrix(styles, morphStyles, ratio);
			let repeat = styles.readBoolean() ? 'repeat' : 'no-repeat';
			let smooth = styles.readBoolean();
			let texture = this._textures[textureIndex];
			release || assert(texture._canvas);
			let fillStyle: CanvasPattern = context.createPattern(texture._canvas, repeat);
			fillStyle.setTransform(fillTransform.toSVGMatrix());
			return {style: fillStyle, smoothImage: smooth};
		}

	}

	export class TextLine {
		private static _measureContext: CanvasRenderingContext2D;

		x: number = 0;
		y: number = 0;
		width: number = 0;
		ascent: number = 0;
		descent: number = 0;
		leading: number = 0;
		align: number = 0;
		runs: TextRun[] = [];

		private static _getMeasureContext(): CanvasRenderingContext2D {
			if (!TextLine._measureContext) {
				TextLine._measureContext = document.createElement('canvas').getContext('2d');
			}
			return TextLine._measureContext;
		}

		addRun(font: string, fillStyle: string, text: string,
		       letterSpacing: number, underline: boolean) {
			if (text) {
				let measureContext = TextLine._getMeasureContext();
				measureContext.font = font;
				let width = measureText(measureContext, text, letterSpacing);
				this.runs.push(new TextRun(font, fillStyle, text, width, letterSpacing, underline));
				this.width += width;
			}
		}

		wrap(maxWidth: number): TextLine[] {
			let lines: TextLine[] = [this];
			let runs = this.runs;

			let currentLine: TextLine = this;
			currentLine.width = 0;
			currentLine.runs = [];

			let measureContext = TextLine._getMeasureContext();

			for (let i = 0; i < runs.length; i++) {
				let run = runs[i];
				let text = run.text;
				run.text = '';
				run.width = 0;
				measureContext.font = run.font;
				let spaceLeft = maxWidth;
				let words = text.split(/[\s.-]/);
				let offset = 0;
				for (let j = 0; j < words.length; j++) {
					let word = words[j];
					let chunk = text.substr(offset, word.length + 1);
					let letterSpacing = run.letterSpacing;
					let wordWidth = measureText(measureContext, chunk, letterSpacing);
					if (wordWidth > spaceLeft) {
						do {
							if (run.text) {
								currentLine.runs.push(run);
								currentLine.width += run.width;
								run = new TextRun(run.font, run.fillStyle, '', 0, run.letterSpacing, run.underline);
								let newLine = new TextLine();
								newLine.y = (currentLine.y + currentLine.descent + currentLine.leading + currentLine.ascent) | 0;
								newLine.ascent = currentLine.ascent;
								newLine.descent = currentLine.descent;
								newLine.leading = currentLine.leading;
								newLine.align = currentLine.align;
								lines.push(newLine);
								currentLine = newLine;
							}
							spaceLeft = maxWidth - wordWidth;
							if (spaceLeft < 0) {
								let k = chunk.length;
								let t = chunk;
								let w = wordWidth;
								while (k > 1) {
									k--;
									t = chunk.substr(0, k);
									w = measureText(measureContext, t, letterSpacing);
									if (w <= maxWidth) {
										break;
									}
								}
								run.text = t;
								run.width = w;
								chunk = chunk.substr(k);
								wordWidth = measureText(measureContext, chunk, letterSpacing);
							}
						} while (chunk && spaceLeft < 0);
					} else {
						spaceLeft = spaceLeft - wordWidth;
					}
					run.text += chunk;
					run.width += wordWidth;
					offset += word.length + 1;
				}
				currentLine.runs.push(run);
				currentLine.width += run.width;
			}

			return lines;
		}

		toString() {
			return 'TextLine {x: ' + this.x + ', y: ' + this.y + ', width: ' + this.width +
				', height: ' + (this.ascent + this.descent + this.leading) + '}';
		}
	}

	export class TextRun {
		constructor(public font: string = '',
		            public fillStyle: string = '',
		            public text: string = '',
		            public width: number = 0,
		            public letterSpacing: number = 0,
		            public underline: boolean = false) {

		}
	}

	function measureText(context: CanvasRenderingContext2D, text: string,
	                     letterSpacing: number): number {
		let width = context.measureText(text).width | 0;
		if (letterSpacing > 0) {
			width += text.length * letterSpacing;
		}
		return width;
	}

	export class RenderableText extends Renderable {

		_flags = NodeFlags.Dynamic | NodeFlags.Dirty;
		// properties: { [name: string]: any } = {};

		private _textBounds: Rectangle;
		private _textRunData: DataBuffer;
		private _plainText: string;
		private _backgroundColor: number;
		private _borderColor: number;
		private _matrix: Shumway.GFX.Geometry.Matrix;
		private _coords: DataBuffer;
		private _scrollV: number;
		private _scrollH: number;

		textRect: Rectangle;
		lines: TextLine[];

		constructor(bounds: any) {
			super();
			this._textBounds = bounds.clone();
			this._textRunData = null;
			this._plainText = '';
			this._backgroundColor = 0;
			this._borderColor = 0;
			this._matrix = Matrix.createIdentity();
			this._coords = null;
			this._scrollV = 1;
			this._scrollH = 0;
			this.textRect = bounds.clone();
			this.lines = [];
			this.setBounds(bounds);
		}

		setBounds(bounds: any): void {
			super.setBounds(bounds);
			this._textBounds.set(bounds);
			this.textRect.setElements(bounds.x + 2, bounds.y + 2, bounds.w - 2, bounds.h - 2);
		}

		setContent(plainText: string, textRunData: DataBuffer, matrix: Shumway.GFX.Geometry.Matrix, coords: DataBuffer): void {
			this._textRunData = textRunData;
			this._plainText = plainText;
			this._matrix.set(matrix);
			this._coords = coords;
			this.lines = [];
		}

		setStyle(backgroundColor: number, borderColor: number, scrollV: number, scrollH: number): void {
			this._backgroundColor = backgroundColor;
			this._borderColor = borderColor;
			this._scrollV = scrollV;
			this._scrollH = scrollH;
		}

		reflow(autoSize: number, wordWrap: boolean): void {
			let textRunData = this._textRunData;

			if (!textRunData) {
				return;
			}

			let bounds = this._bounds;
			let availableWidth = bounds.w - 4;
			let plainText = this._plainText;
			let lines = this.lines;

			let currentLine = new TextLine();
			let baseLinePos = 0;
			let maxWidth = 0;
			let maxAscent = 0;
			let maxDescent = 0;
			let maxLeading = -0xffffffff;
			let firstAlign = -1;

			let finishLine = function () {
				if (!currentLine.runs.length) {
					baseLinePos += maxAscent + maxDescent + maxLeading;
					return;
				}

				if (lines.length) {
					baseLinePos += maxLeading;
				}

				baseLinePos += maxAscent;
				currentLine.y = baseLinePos | 0;
				baseLinePos += maxDescent;
				currentLine.ascent = maxAscent;
				currentLine.descent = maxDescent;
				currentLine.leading = maxLeading;
				currentLine.align = firstAlign;

				if (wordWrap && currentLine.width > availableWidth) {
					let wrappedLines = currentLine.wrap(availableWidth);
					for (let i = 0; i < wrappedLines.length; i++) {
						let line = wrappedLines[i];
						baseLinePos = line.y + line.descent + line.leading;
						lines.push(line);
						if (line.width > maxWidth) {
							maxWidth = line.width;
						}
					}
				} else {
					lines.push(currentLine);
					if (currentLine.width > maxWidth) {
						maxWidth = currentLine.width;
					}
				}

				currentLine = new TextLine();
			};

			enterTimeline("RenderableText.reflow");

			while (textRunData.position < textRunData.length) {
				let beginIndex = textRunData.readInt();
				let endIndex = textRunData.readInt();

				let size = textRunData.readInt();
				let fontName = textRunData.readUTF();

				let ascent = textRunData.readInt();
				let descent = textRunData.readInt();
				let leading = textRunData.readInt();
				if (ascent > maxAscent) {
					maxAscent = ascent;
				}
				if (descent > maxDescent) {
					maxDescent = descent;
				}
				if (leading > maxLeading) {
					maxLeading = leading;
				}

				let bold = textRunData.readBoolean();
				let italic = textRunData.readBoolean();
				let boldItalic = '';
				if (italic) {
					boldItalic += 'italic ';
				}
				if (bold) {
					boldItalic += 'bold ';
				}
				let font = boldItalic + size + 'px ' + fontName + ', AdobeBlank';

				let color = textRunData.readInt();
				let fillStyle = ColorUtilities.rgbToHex(color);

				let align = textRunData.readInt();
				if (firstAlign === -1) {
					firstAlign = align;
				}

				let bullet = textRunData.readBoolean();
				//let display = textRunData.readInt();
				let indent = textRunData.readInt();
				//let blockIndent = textRunData.readInt();
				let kerning = textRunData.readInt();
				let leftMargin = textRunData.readInt();
				let letterSpacing = textRunData.readInt();
				let rightMargin = textRunData.readInt();
				//let tabStops = textRunData.readInt();
				let underline = textRunData.readBoolean();

				let text = '';
				let eof = false;
				for (let i = beginIndex; !eof; i++) {
					let eof = i >= endIndex - 1;

					let char = plainText[i];
					if (char !== '\r' && char !== '\n') {
						text += char;
						if (i < plainText.length - 1) {
							continue;
						}
					}
					currentLine.addRun(font, fillStyle, text, letterSpacing, underline);
					finishLine();
					text = '';

					if (eof) {
						maxAscent = 0;
						maxDescent = 0;
						maxLeading = -0xffffffff;
						firstAlign = -1;
						break;
					}

					if (char === '\r' && plainText[i + 1] === '\n') {
						i++;
					}
				}
				currentLine.addRun(font, fillStyle, text, letterSpacing, underline);
			}

			// Append an additional empty line if we find a line break character at the end of the text.
			let endCharacter = plainText[plainText.length - 1];
			if (endCharacter === '\r' || endCharacter === '\n') {
				lines.push(currentLine);
			}

			let rect = this.textRect;
			rect.w = maxWidth;
			rect.h = baseLinePos;

			if (autoSize) {
				if (!wordWrap) {
					availableWidth = maxWidth;
					let width = bounds.w;
					switch (autoSize) {
						case 1: // CENTER
							rect.x = (width - (availableWidth + 4)) >> 1;
							break;
						case 2: // LEFT
							break;
						case 3: // RIGHT
							rect.x = width - (availableWidth + 4);
							break;
					}
					this._textBounds.setElements(rect.x - 2, rect.y - 2, rect.w + 4, rect.h + 4);
					bounds.w = availableWidth + 4;
				}
				bounds.x = rect.x - 2;
				bounds.h = baseLinePos + 4;
			} else {
				this._textBounds = bounds;
			}

			let numLines = lines.length;
			for (let i = 0; i < lines.length; i++) {
				let line = lines[i];
				if (line.width < availableWidth) {
					switch (line.align) {
						case 0: // left
							break;
						case 1: // right
							line.x = (availableWidth - line.width) | 0;
							break;
						case 2: // center
							line.x = ((availableWidth - line.width) / 2) | 0;
							break;
					}
				}
			}

			this.invalidate()
			leaveTimeline("RenderableText.reflow");
		}

		private static absoluteBoundPoints = [new Point(0, 0), new Point(0, 0),
			new Point(0, 0), new Point(0, 0)];

		private static roundBoundPoints(points: Point[]) {
			release || assert(points === RenderableText.absoluteBoundPoints);
			for (let i = 0; i < points.length; i++) {
				let point = points[i];
				point.x = Math.floor(point.x + .1) + .5;
				point.y = Math.floor(point.y + .1) + .5;
			}
		}

		render(context: CanvasRenderingContext2D): void {
			enterTimeline("RenderableText.render");
			context.save();

			let rect = this._textBounds;
			if (this._backgroundColor) {
				context.fillStyle = ColorUtilities.rgbaToCSSStyle(this._backgroundColor);
				context.fillRect(rect.x, rect.y, rect.w, rect.h);
			}
			if (this._borderColor) {
				context.strokeStyle = ColorUtilities.rgbaToCSSStyle(this._borderColor);
				context.lineCap = 'square';
				context.lineWidth = 1;
				// TextField bounds are always drawn as 1px lines on (global-space) pixel boundaries.
				// Their rounding is a bit weird, though: fractions below .9 are rounded down.
				// We can only fully implement this in browsers that support `currentTransform`.
				let boundPoints = RenderableText.absoluteBoundPoints;
				let m: SVGMatrix = (context as any)['currentTransform'];
				if (m) {
					rect = rect.clone();
					let matrix = new Matrix(m.a, m.b, m.c, m.d, m.e, m.f);
					matrix.transformRectangle(rect, boundPoints);
					context.setTransform(1, 0, 0, 1, 0, 0);
				} else {
					boundPoints[0].x = rect.x;
					boundPoints[0].y = rect.y;
					boundPoints[1].x = rect.x + rect.w;
					boundPoints[1].y = rect.y;
					boundPoints[2].x = rect.x + rect.w;
					boundPoints[2].y = rect.y + rect.h;
					boundPoints[3].x = rect.x;
					boundPoints[3].y = rect.y + rect.h;
				}
				RenderableText.roundBoundPoints(boundPoints);
				let path = new Path2D();
				path.moveTo(boundPoints[0].x, boundPoints[0].y);
				path.lineTo(boundPoints[1].x, boundPoints[1].y);
				path.lineTo(boundPoints[2].x, boundPoints[2].y);
				path.lineTo(boundPoints[3].x, boundPoints[3].y);
				path.lineTo(boundPoints[0].x, boundPoints[0].y);
				context.stroke(path);
				if (m) {
					context.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
				}
			}

			if (this._coords) {
				this._renderChars(context);
			} else {
				this._renderLines(context);
			}

			context.restore();
			leaveTimeline("RenderableText.render");
		}

		private _renderChars(context: CanvasRenderingContext2D) {
			if (this._matrix) {
				let m = this._matrix;
				context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
			}
			let lines = this.lines;
			let coords = this._coords;
			coords.position = 0;
			let font = '';
			let fillStyle = '';
			for (let i = 0; i < lines.length; i++) {
				let line = lines[i];
				let runs = line.runs;
				for (let j = 0; j < runs.length; j++) {
					let run = runs[j];
					if (run.font !== font) {
						context.font = font = run.font;
					}
					if (run.fillStyle !== fillStyle) {
						context.fillStyle = fillStyle = run.fillStyle;
					}
					let text = run.text;
					for (let k = 0; k < text.length; k++) {
						let x = coords.readInt() / 20;
						let y = coords.readInt() / 20;
						context.fillText(text[k], x, y);
					}
				}
			}
		}

		private _renderLines(context: CanvasRenderingContext2D) {
			// TODO: Render bullet points.
			let bounds = this._textBounds;
			context.beginPath();
			context.rect(bounds.x + 2, bounds.y + 2, bounds.w - 4, bounds.h - 4);
			context.clip();
			context.translate((bounds.x - this._scrollH) + 2, bounds.y + 2);
			let lines = this.lines;
			let scrollV = this._scrollV;
			let scrollY = 0;
			let font = '';
			let fillStyle = '';
			context.textAlign = "left";
			context.textBaseline = "alphabetic";
			for (let i = 0; i < lines.length; i++) {
				let line = lines[i];
				let x = line.x;
				let y = line.y;
				// Skip lines until we are within the scroll view.
				if (i + 1 < scrollV) {
					scrollY = y + line.descent + line.leading;
					continue;
				}
				y -= scrollY;
				// Flash skips rendering lines that are not fully visible in height (except of the very
				// first line within the scroll view).
				if ((i + 1) - scrollV && y > bounds.h) {
					break;
				}
				let runs = line.runs;
				for (let j = 0; j < runs.length; j++) {
					let run = runs[j];
					if (run.font !== font) {
						context.font = font = run.font;
					}
					if (run.fillStyle !== fillStyle) {
						context.fillStyle = fillStyle = run.fillStyle;
					}
					if (run.underline) {
						context.fillRect(x, (y + (line.descent / 2)) | 0, run.width, 1);
					}
					context.textAlign = "left";
					context.textBaseline = "alphabetic";
					if (run.letterSpacing > 0) {
						let text = run.text;
						for (let k = 0; k < text.length; k++) {
							context.fillText(text[k], x, y);
							x += measureText(context, text[k], run.letterSpacing);
						}
					} else {
						context.fillText(run.text, x, y);
						x += run.width;
					}
				}
			}
		}
	}

	export class Label extends Renderable {
		_flags: NodeFlags = NodeFlags.Dynamic | NodeFlags.Scalable;
		// properties: { [name: string]: any } = {};
		private _text: string;

		get text(): string {
			return this._text;
		}

		set text(value: string) {
			this._text = value;
		}

		constructor(w: number, h: number) {
			super();
			this.setBounds(new Rectangle(0, 0, w, h));
		}

		render(context: CanvasRenderingContext2D, ratio: number, cullBounds?: Rectangle) {
			context.save();
			context.textBaseline = "top";
			context.fillStyle = "white";
			context.fillText(this.text, 0, 0);
			context.restore();
		}
	}
}

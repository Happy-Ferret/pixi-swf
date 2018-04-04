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
module Shumway.Remoting.GFX {
	import BlurFilter = Shumway.GFX.BlurFilter;
	import DropshadowFilter = Shumway.GFX.DropshadowFilter;
	import NodeFlags = Shumway.GFX.NodeFlags;
	import Shape = Shumway.GFX.Shape;
	import Group = Shumway.GFX.Group;
	import Renderable = Shumway.GFX.Renderable;
	import RenderableShape = Shumway.GFX.RenderableShape;
	import RenderableMorphShape = Shumway.GFX.RenderableMorphShape;
	import RenderableBitmap = Shumway.GFX.RenderableBitmap;
	import RenderableVideo = Shumway.GFX.RenderableVideo;
	import IVideoPlaybackEventSerializer = Shumway.GFX.IVideoPlaybackEventSerializer;
	import RenderableText = Shumway.GFX.RenderableText;
	import ColorMatrix = Shumway.GFX.ColorMatrix;
	import BlendMode = Shumway.GFX.BlendMode;
	import Node = Shumway.GFX.Node;
	import ShapeData = Shumway.ShapeData;
	import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
	import Stage = Shumway.GFX.Stage;
	import NodeEventType = Shumway.GFX.NodeEventType;

	import Point = Shumway.GFX.Geometry.Point;
	import Matrix = Shumway.GFX.Geometry.Matrix;
	import Rectangle = Shumway.GFX.Geometry.Rectangle;

	import StageAlignFlags = Shumway.Remoting.StageAlignFlags;
	import StageScaleModeId = Shumway.Remoting.StageScaleMode;

	import IDataInput = Shumway.ArrayUtilities.IDataInput;
	import IDataOutput = Shumway.ArrayUtilities.IDataOutput;
	import assert = Shumway.Debug.assert;
	let writer: IndentingWriter = null; // new IndentingWriter();

	declare let registerInspectorAsset: any;
	declare let registerInspectorStage: any;

	export class GFXChannelSerializer {
		public output: IDataOutput;
		public outputAssets: any [];

		public writeMouseEvent(event: MouseEvent, point: Point) {
			let output = this.output;
			output.writeInt(MessageTag.MouseEvent);
			let typeId = Shumway.Remoting.MouseEventNames.indexOf(event.type);
			output.writeInt(typeId);
			output.writeFloat(point.x);
			output.writeFloat(point.y);
			output.writeInt(event.buttons);
			let flags =
				(event.ctrlKey ? KeyboardEventFlags.CtrlKey : 0) |
				(event.altKey ? KeyboardEventFlags.AltKey : 0) |
				(event.shiftKey ? KeyboardEventFlags.ShiftKey : 0);
			output.writeInt(flags);
		}

		public writeKeyboardEvent(event: KeyboardEvent) {
			let output = this.output;
			output.writeInt(MessageTag.KeyboardEvent);
			let typeId = Shumway.Remoting.KeyboardEventNames.indexOf(event.type);
			output.writeInt(typeId);
			output.writeInt(event.keyCode);
			output.writeInt(event.charCode);
			output.writeInt(event.location);
			let flags =
				(event.ctrlKey ? KeyboardEventFlags.CtrlKey : 0) |
				(event.altKey ? KeyboardEventFlags.AltKey : 0) |
				(event.shiftKey ? KeyboardEventFlags.ShiftKey : 0);
			output.writeInt(flags);
		}

		public writeFocusEvent(type: FocusEventType) {
			let output = this.output;
			output.writeInt(MessageTag.FocusEvent);
			output.writeInt(type);
		}
	}

	export class GFXChannelDeserializerContext implements IVideoPlaybackEventSerializer {
		stage: Stage;
		_nodes: Node [];
		private _assets: Renderable [];

		_easelHost: Shumway.GFX.EaselHost;
		private _canvas: HTMLCanvasElement;
		private _context: CanvasRenderingContext2D;

		constructor(easelHost: Shumway.GFX.EaselHost, root: Group, transparent: boolean) {
			let stage = this.stage = new Stage(128, 512);
			if (typeof registerInspectorStage !== "undefined") {
				registerInspectorStage(stage);
			}

			function updateStageBounds(node: any) {
				let stageBounds = node.getBounds(true);
				// Easel stage is the root stage and is not scaled, our stage is so
				// we need to scale down.
				let ratio = easelHost.easel.getRatio();
				stageBounds.scale(1 / ratio, 1 / ratio);
				stageBounds.snap();
				stage.setBounds(stageBounds);
			}

			updateStageBounds(easelHost.stage);
			easelHost.stage.addEventListener(NodeEventType.OnStageBoundsChanged, updateStageBounds);
			easelHost.content = stage.content;
			if (transparent) {
				this.stage.setFlags(NodeFlags.Transparent);
			}
			root.addChild(this.stage);
			this._nodes = [];
			this._assets = [];

			this._easelHost = easelHost;
			this._canvas = document.createElement("canvas");
			this._context = this._canvas.getContext("2d");
		}

		_registerAsset(id: number, symbolId: number, asset: Renderable) {
			if (typeof registerInspectorAsset !== "undefined") {
				registerInspectorAsset(id, symbolId, asset);
			}
			if (!release && this._assets[id]) {
				Debug.warning("Asset already exists: " + id + ". old:", this._assets[id], "new: " + asset);
			}
			this._assets[id] = asset;
		}

		_makeNode(id: number): Node {
			if (id === -1) {
				return null;
			}
			let node = null;
			if (id & IDMask.Asset) {
				id &= ~IDMask.Asset;
				node = this._assets[id].wrap();
			} else {
				node = this._nodes[id];
			}
			release || assert(node, "Node " + node + " of " + id + " has not been sent yet.");
			return node;
		}

		_getAsset(id: number): Renderable {
			return this._assets[id];
		}

		_getBitmapAsset(id: number): RenderableBitmap {
			return <RenderableBitmap>this._assets[id];
		}

		_getVideoAsset(id: number): RenderableVideo {
			return <RenderableVideo>this._assets[id];
		}

		_getTextAsset(id: number): RenderableText {
			return <RenderableText>this._assets[id];
		}

		registerFont(syncId: number, data: Uint8Array, resolve: (data: any) => void) {
			Shumway.registerCSSFont(syncId, data, !inFirefox);
			if (inFirefox) {
				resolve(null);
			} else {
				window.setTimeout(resolve, 400);
			}
		}

		registerImage(syncId: number, symbolId: number, imageType: ImageType, data: Uint8Array,
		              alphaData: Uint8Array, resolve: (data: any) => void) {
			this._registerAsset(syncId, symbolId, this._decodeImage(imageType, data, alphaData, resolve));
		}

		registerVideo(syncId: number) {
			this._registerAsset(syncId, 0, new RenderableVideo(syncId, this));
		}

		/**
		 * Creates an Image element to decode JPG|PNG|GIF data passed in as a buffer.
		 *
		 * The resulting image is stored as the drawing source of a new RenderableBitmap, which is
		 * returned.
		 * Once the image is loaded, the RenderableBitmap's bounds are updated and the provided
		 * oncomplete callback is invoked with the image dimensions.
		 */
		_decodeImage(type: ImageType, data: Uint8Array, alphaData: Uint8Array, oncomplete: (data: any) => void) {
			let image = new Image();
			let asset = RenderableBitmap.FromImage(image, -1, -1);
			image.src = URL.createObjectURL(new Blob([data], {type: getMIMETypeForImageType(type)}));
			image.onload = function () {
				release || assert(!asset.parent);
				asset.setBounds(new Rectangle(0, 0, image.width, image.height));
				if (alphaData) {
					asset.mask(alphaData);
				}
				asset.invalidate();
				oncomplete({width: image.width, height: image.height});
			};
			image.onerror = function () {
				oncomplete(null);
			};
			return asset;
		}

		public sendVideoPlaybackEvent(assetId: number, eventType: VideoPlaybackEvent, data: any): void {
			this._easelHost.sendVideoPlaybackEvent(assetId, eventType, data);
		}
	}

	export class GFXChannelDeserializer {
		input: IDataInput;
		inputAssets: any[];
		output: DataBuffer;
		context: GFXChannelDeserializerContext;

		/**
		 * Used to avoid extra allocation, don't ever leak a reference to this object.
		 */
		private static _temporaryReadMatrix: Matrix = Matrix.createIdentity();

		/**
		 * Used to avoid extra allocation, don't ever leak a reference to this object.
		 */
		private static _temporaryReadRectangle: Rectangle = Rectangle.createEmpty();

		/**
		 * Used to avoid extra allocation, don't ever leak a reference to this object.
		 */
		private static _temporaryReadColorMatrix: ColorMatrix = ColorMatrix.createIdentity();
		private static _temporaryReadColorMatrixIdentity: ColorMatrix = ColorMatrix.createIdentity();

		public read() {
			let tag = 0;
			let input = this.input;

			let data = {
				bytesAvailable: input.bytesAvailable,
				updateGraphics: 0,
				updateBitmapData: 0,
				updateTextContent: 0,
				updateFrame: 0,
				updateStage: 0,
				updateCurrentMouseTarget: 0,
				updateNetStream: 0,
				registerFont: 0,
				drawToBitmap: 0,
				requestBitmapData: 0,
				decodeImage: 0
			};
			Shumway.GFX.enterTimeline("GFXChannelDeserializer.read", data);
			while (input.bytesAvailable > 0) {
				tag = input.readInt();
				switch (tag) {
					case MessageTag.EOF:
						Shumway.GFX.leaveTimeline("GFXChannelDeserializer.read");
						return;
					case MessageTag.UpdateGraphics:
						data.updateGraphics++;
						this._readUpdateGraphics();
						break;
					case MessageTag.UpdateBitmapData:
						data.updateBitmapData++;
						this._readUpdateBitmapData();
						break;
					case MessageTag.UpdateTextContent:
						data.updateTextContent++;
						this._readUpdateTextContent();
						break;
					case MessageTag.UpdateFrame:
						data.updateFrame++;
						this._readUpdateFrame();
						break;
					case MessageTag.UpdateStage:
						data.updateStage++;
						this._readUpdateStage();
						break;
					case MessageTag.UpdateCurrentMouseTarget:
						data.updateCurrentMouseTarget++;
						this._readUpdateCurrentMouseTarget();
						break;
					case MessageTag.UpdateNetStream:
						data.updateNetStream++;
						this._readUpdateNetStream();
						break;
					case MessageTag.DrawToBitmap:
						data.drawToBitmap++;
						this._readDrawToBitmap();
						break;
					case MessageTag.RequestBitmapData:
						data.requestBitmapData++;
						this._readRequestBitmapData();
						break;
					default:
						release || assert(false, 'Unknown MessageReader tag: ' + tag);
						break;
				}
			}
			Shumway.GFX.leaveTimeline("GFXChannelDeserializer.read");
		}

		private _readMatrix(): Matrix {
			let input = this.input;
			let matrix = GFXChannelDeserializer._temporaryReadMatrix;
			let a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0;
			switch (input.readInt()) {
				case MatrixEncoding.ScaleAndTranslationOnly:
					a = input.readFloat();
					d = input.readFloat(); // Fallthrough
				case MatrixEncoding.TranslationOnly:
					tx = input.readFloat() / 20;
					ty = input.readFloat() / 20;
					break;
				case MatrixEncoding.UniformScaleAndTranslationOnly:
					a = d = input.readFloat();
					tx = input.readFloat() / 20;
					ty = input.readFloat() / 20;
					break;
				case MatrixEncoding.All:
					a = input.readFloat();
					b = input.readFloat();
					c = input.readFloat();
					d = input.readFloat();
					tx = input.readFloat() / 20;
					ty = input.readFloat() / 20;
					break;
			}
			matrix.setElements(a, b, c, d, tx, ty);
			return matrix;
		}

		private _readRectangle(): Rectangle {
			let input = this.input;
			let rectangle = GFXChannelDeserializer._temporaryReadRectangle;
			rectangle.setElements(
				input.readInt() / 20,
				input.readInt() / 20,
				input.readInt() / 20,
				input.readInt() / 20
			);
			return rectangle;
		}

		private _readColorMatrix(): ColorMatrix {
			let input = this.input;
			let colorMatrix = GFXChannelDeserializer._temporaryReadColorMatrix;
			let rm = 1, gm = 1, bm = 1, am = 1;
			let ro = 0, go = 0, bo = 0, ao = 0;
			switch (input.readInt()) {
				case ColorTransformEncoding.Identity:
					return GFXChannelDeserializer._temporaryReadColorMatrixIdentity;
					break;
				case ColorTransformEncoding.AlphaMultiplierOnly:
					am = input.readFloat();
					break;
				case ColorTransformEncoding.AlphaMultiplierWithOffsets:
					rm = 0;
					gm = 0;
					bm = 0;
					am = input.readFloat();
					ro = input.readInt();
					go = input.readInt();
					bo = input.readInt();
					ao = input.readInt();
					break;
				case ColorTransformEncoding.All:
					rm = input.readFloat();
					gm = input.readFloat();
					bm = input.readFloat();
					am = input.readFloat();
					ro = input.readInt();
					go = input.readInt();
					bo = input.readInt();
					ao = input.readInt();
					break;
			}
			colorMatrix.setMultipliersAndOffsets(
				rm, gm, bm, am,
				ro, go, bo, ao
			);
			return colorMatrix;
		}

		private _readAsset(): any {
			let assetId = this.input.readInt();
			let asset = this.inputAssets[assetId];
			this.inputAssets[assetId] = null;
			return asset;
		}

		private _readUpdateGraphics() {
			let input = this.input;
			let context = this.context;
			let id = input.readInt();
			let symbolId = input.readInt();
			let asset = <RenderableShape>context._getAsset(id);
			let bounds = this._readRectangle();
			let pathData = ShapeData.FromPlainObject(this._readAsset());
			let numTextures = input.readInt();
			let textures = [];
			for (let i = 0; i < numTextures; i++) {
				let bitmapId = input.readInt();
				textures.push(context._getBitmapAsset(bitmapId));
			}
			if (asset) {
				asset.update(pathData, textures, bounds);
			} else {
				let renderable: RenderableShape;
				if (pathData.morphCoordinates) {
					renderable = new RenderableMorphShape(id, pathData, textures, bounds);
				} else {
					renderable = new RenderableShape(id, pathData, textures, bounds);
				}
				for (let i = 0; i < textures.length; i++) {
					textures[i] && textures[i].addRenderableParent(renderable);
				}
				context._registerAsset(id, symbolId, renderable);
			}
		}

		private _readUpdateBitmapData() {
			let input = this.input;
			let context = this.context;
			let id = input.readInt();
			let symbolId = input.readInt();
			let asset = context._getBitmapAsset(id);
			let bounds = this._readRectangle();
			let type: ImageType = input.readInt();
			let dataBuffer = DataBuffer.FromPlainObject(this._readAsset());
			if (!asset) {
				asset = RenderableBitmap.FromDataBuffer(type, dataBuffer, bounds);
				context._registerAsset(id, symbolId, asset);
			} else {
				asset.updateFromDataBuffer(type, dataBuffer);
			}
			if (this.output) {
				// TODO: Write image data to output.
			}
		}

		private _readUpdateTextContent() {
			let input = this.input;
			let context = this.context;
			let id = input.readInt();
			let symbolId = input.readInt();
			let asset = context._getTextAsset(id);
			let bounds = this._readRectangle();
			let matrix = this._readMatrix();
			let backgroundColor = input.readInt();
			let borderColor = input.readInt();
			let autoSize = input.readInt();
			let wordWrap = input.readBoolean();
			let scrollV = input.readInt();
			let scrollH = input.readInt();
			let plainText = this._readAsset();
			let textRunData = DataBuffer.FromPlainObject(this._readAsset());
			let coords = null;
			let numCoords = input.readInt();
			if (numCoords) {
				coords = new DataBuffer(numCoords * 4);
				input.readBytes(coords, 0, numCoords * 4);
			}
			if (!asset) {
				asset = new RenderableText(bounds);
				asset.setContent(plainText, textRunData, matrix, coords);
				asset.setStyle(backgroundColor, borderColor, scrollV, scrollH);
				asset.reflow(autoSize, wordWrap);
				context._registerAsset(id, symbolId, asset);
			} else {
				asset.setBounds(bounds);
				asset.setContent(plainText, textRunData, matrix, coords);
				asset.setStyle(backgroundColor, borderColor, scrollV, scrollH);
				asset.reflow(autoSize, wordWrap);
			}
			if (this.output) {
				let rect = asset.textRect;
				this.output.writeInt(rect.w * 20);
				this.output.writeInt(rect.h * 20);
				this.output.writeInt(rect.x * 20);
				let lines = asset.lines;
				let numLines = lines.length;
				this.output.writeInt(numLines);
				for (let i = 0; i < numLines; i++) {
					this._writeLineMetrics(lines[i]);
				}
			}
		}

		private _writeLineMetrics(line: Shumway.GFX.TextLine): void {
			release || assert(this.output);
			this.output.writeInt(line.x);
			this.output.writeInt(line.width);
			this.output.writeInt(line.ascent);
			this.output.writeInt(line.descent);
			this.output.writeInt(line.leading);
		}

		private _readUpdateStage() {
			let context = this.context;
			let id = this.input.readInt();
			if (!context._nodes[id]) {
				context._nodes[id] = context.stage.content;
			}
			let color = this.input.readInt();
			let bounds = this._readRectangle();
			// TODO: Need to updateContentMatrix on stage here.
			context.stage.content.setBounds(bounds);
			context.stage.color = Color.FromARGB(color);
			context.stage.align = this.input.readInt();
			context.stage.scaleMode = this.input.readInt();
			let displayState = this.input.readInt();
			context._easelHost.fullscreen = displayState === 0 || displayState === 1;
		}

		private _readUpdateCurrentMouseTarget() {
			let context = this.context;
			let currentMouseTarget = this.input.readInt();
			let cursor = this.input.readInt();
			context._easelHost.cursor = Shumway.UI.toCSSCursor(cursor);
		}

		private _readUpdateNetStream() {
			let context = this.context;
			let id = this.input.readInt();
			let asset = context._getVideoAsset(id);
			let rectangle = this._readRectangle();
			if (!asset) {
				context.registerVideo(id);
				asset = context._getVideoAsset(id);
			}
			asset.setBounds(rectangle);
		}

		private _readFilters(node: Node) {
			let input = this.input;
			let count = input.readInt();
			let filters = [];
			if (count) {
				for (let i = 0; i < count; i++) {
					let type: FilterType = input.readInt();
					switch (type) {
						case FilterType.Blur:
							filters.push(new BlurFilter(
								input.readFloat(), // blurX
								input.readFloat(), // blurY
								input.readInt()    // quality
							));
							break;
						case FilterType.DropShadow:
							filters.push(new DropshadowFilter(
								input.readFloat(),   // alpha
								input.readFloat(),   // angle
								input.readFloat(),   // blurX
								input.readFloat(),   // blurY
								input.readInt(),     // color
								input.readFloat(),   // distance
								input.readBoolean(), // hideObject
								input.readBoolean(), // inner
								input.readBoolean(), // knockout
								input.readInt(),     // quality
								input.readFloat()    // strength
							));
							break;
						case FilterType.ColorMatrix:
							let matrix = new Float32Array(20);
							matrix[0] = input.readFloat();
							matrix[4] = input.readFloat();
							matrix[8] = input.readFloat();
							matrix[12] = input.readFloat();
							matrix[16] = input.readFloat() / 255;
							matrix[1] = input.readFloat();
							matrix[5] = input.readFloat();
							matrix[9] = input.readFloat();
							matrix[13] = input.readFloat();
							matrix[17] = input.readFloat() / 255;
							;
							matrix[2] = input.readFloat();
							matrix[6] = input.readFloat();
							matrix[10] = input.readFloat();
							matrix[14] = input.readFloat();
							matrix[18] = input.readFloat() / 255;
							;
							matrix[3] = input.readFloat();
							matrix[7] = input.readFloat();
							matrix[11] = input.readFloat();
							matrix[15] = input.readFloat();
							matrix[19] = input.readFloat() / 255;
							filters.push(new ColorMatrix(matrix));
							break;
						default:
							Shumway.Debug.somewhatImplemented(FilterType[type]);
							break;
					}
				}
				node.getLayer().filters = filters;
			}
		}

		private _readUpdateFrame() {
			let input = this.input;
			let context = this.context;
			let id = input.readInt();
			let ratio = 0;
			writer && writer.writeLn("Receiving UpdateFrame: " + id);
			let node = context._nodes[id];
			if (!node) {
				node = context._nodes[id] = new Group();
			}
			let hasBits = input.readInt();
			if (hasBits & MessageBits.HasMatrix) {
				node.getTransform().setMatrix(this._readMatrix());
			}
			if (hasBits & MessageBits.HasColorTransform) {
				node.getTransform().setColorMatrix(this._readColorMatrix());
			}
			if (hasBits & MessageBits.HasMask) {
				let maskId = input.readInt();
				node.getLayer().mask = maskId >= 0 ? context._makeNode(maskId) : null;
			}
			if (hasBits & MessageBits.HasClip) {
				node.clip = input.readInt();
			}
			if (hasBits & MessageBits.HasMiscellaneousProperties) {
				ratio = input.readInt() / 0xffff;
				release || assert(ratio >= 0 && ratio <= 1);
				node.getLayer().blendMode = input.readInt();
				this._readFilters(node);
				node.toggleFlags(NodeFlags.Visible, input.readBoolean());
				node.toggleFlags(NodeFlags.CacheAsBitmap, input.readBoolean());
				node.toggleFlags(NodeFlags.PixelSnapping, !!input.readInt()); // TODO: support `auto`.
				node.toggleFlags(NodeFlags.ImageSmoothing, !!input.readInt());
			}
			if (hasBits & MessageBits.HasChildren) {
				let count = input.readInt();
				let container = <Group>node;
				container.clearChildren();
				for (let i = 0; i < count; i++) {
					let childId = input.readInt();
					let child = context._makeNode(childId);
					release || assert(child, "Child " + childId + " of " + id + " has not been sent yet.");
					container.addChild(child);
				}
			}
			if (ratio) {
				let group = <Group>node;
				let child = group.getChildren()[0];
				if (child instanceof Shape) {
					child.ratio = ratio;
				}
			}
		}

		private _readDrawToBitmap() {
			let input = this.input;
			let context = this.context;
			let targetId = input.readInt();
			let sourceId = input.readInt();
			let hasBits = input.readInt();
			let matrix;
			let colorMatrix;
			let clipRect;
			if (hasBits & MessageBits.HasMatrix) {
				matrix = this._readMatrix().clone();
			} else {
				matrix = Matrix.createIdentity();
			}
			if (hasBits & MessageBits.HasColorTransform) {
				colorMatrix = this._readColorMatrix();
			}
			if (hasBits & MessageBits.HasClipRect) {
				clipRect = this._readRectangle();
			}
			let blendMode = input.readInt();
			input.readBoolean(); // Smoothing
			let target = context._getBitmapAsset(targetId);
			let source = context._makeNode(sourceId);
			if (!target) {
				context._registerAsset(targetId, -1, RenderableBitmap.FromNode(source, matrix, colorMatrix, blendMode, clipRect));
			} else {
				target.drawNode(source, matrix, colorMatrix, blendMode, clipRect);
			}
		}

		private _readRequestBitmapData() {
			let input = this.input;
			let output = this.output;
			let context = this.context;
			let id = input.readInt();
			let renderableBitmap = context._getBitmapAsset(id);
			renderableBitmap.readImageData(output);
		}
	}
}

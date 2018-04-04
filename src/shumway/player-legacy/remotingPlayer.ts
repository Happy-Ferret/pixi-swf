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
module Shumway.Remoting.Player {
	import MessageTag = Shumway.Remoting.MessageTag;
	import MessageBits = Shumway.Remoting.MessageBits;

	import flash = Shumway.flash;
	import Stage = flash.display.Stage;
	import Graphics = flash.display.Graphics;
	import NetStream = flash.net.NetStream;
	import Bitmap = flash.display.Bitmap;
	import BitmapData = flash.display.BitmapData;
	import DisplayObject = flash.display.DisplayObject;
	import DisplayObjectFlags = flash.display.DisplayObjectFlags;
	import DisplayObjectDirtyFlags = flash.display.DisplayObjectDirtyFlags;
	import BlendMode = flash.display.BlendMode;
	import PixelSnapping = flash.display.PixelSnapping;
	import VisitorFlags = flash.display.VisitorFlags;
	import Video = flash.media.Video;

	import Bounds = Shumway.Bounds;
	import KeyboardEventData = flash.ui.KeyboardEventData;
	import MouseEventAndPointData = flash.ui.MouseEventAndPointData;
	import MouseCursor = flash.ui.MouseCursor;

	import IDataInput = Shumway.ArrayUtilities.IDataInput;
	import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
	import assert = Shumway.Debug.assert;
	import writer = Shumway.Player.writer;

	export class PlayerChannelSerializer {
		/**
		 * Output buffer that the serializer writes to.
		 */
		public output: DataBuffer;
		public outputAssets: any [];
		public phase: RemotingPhase = RemotingPhase.Objects;
		public roots: DisplayObject [] = null;

		constructor() {
			this.output = new DataBuffer();
			this.outputAssets = [];
		}

		remoteObjects() {
			this.phase = Remoting.RemotingPhase.Objects;
			let roots = this.roots;
			for (let i = 0; i < roots.length; i++) {
				Shumway.Player.enterTimeline("remoting objects");
				this.writeDirtyDisplayObjects(roots[i], false);
				Shumway.Player.leaveTimeline("remoting objects");
			}
		}

		remoteReferences() {
			this.phase = Remoting.RemotingPhase.References;
			let roots = this.roots;
			for (let i = 0; i < roots.length; i++) {
				Shumway.Player.enterTimeline("remoting references");
				this.writeDirtyDisplayObjects(roots[i], true);
				Shumway.Player.leaveTimeline("remoting references");
			}
		}

		writeEOF() {
			this.output.writeInt(Remoting.MessageTag.EOF);
		}

		/**
		 * Serializes dirty display objects starting at the specified root |displayObject| node.
		 */
		writeDirtyDisplayObjects(displayObject: DisplayObject, clearDirtyDescendentsFlag: boolean) {
			let self = this;
			let roots = this.roots;
			displayObject.visit(function (displayObject) {
				if (displayObject._hasAnyDirtyFlags(DisplayObjectDirtyFlags.Dirty)) {
					self.writeUpdateFrame(displayObject);
					// Collect more roots?
					if (roots && displayObject.mask) {
						let root = displayObject.mask._findFurthestAncestorOrSelf();
						Shumway.ArrayUtilities.pushUnique(roots, root)
					}
				}
				// TODO: Checking if we need to write assets this way is kinda expensive, do better here.
				self.writeDirtyAssets(displayObject);
				let hasDirtyDescendents = displayObject._hasFlags(DisplayObjectFlags.DirtyDescendents);
				if (hasDirtyDescendents) {
					if (clearDirtyDescendentsFlag) {
						// We need this flag to make sure we don't clear the flag in the first remoting pass.
						displayObject._removeFlags(DisplayObjectFlags.DirtyDescendents);
					}
					return VisitorFlags.Continue;
				}
				// We can skip visiting descendents since they are not dirty.
				return VisitorFlags.Skip;
			}, VisitorFlags.None);
		}

		writeStage(stage: Stage) {
			if (!stage._isDirty) {
				return;
			}
			writer && writer.writeLn("Sending Stage");
			let serializer = this;
			this.output.writeInt(MessageTag.UpdateStage);
			this.output.writeInt(stage._id);
			this.output.writeInt(stage.color);
			this._writeRectangle(new Bounds(0, 0, stage.stageWidth * 20, stage.stageHeight * 20));
			this.output.writeInt(flash.display.StageAlign.toNumber(stage.align));
			this.output.writeInt(flash.display.StageScaleMode.toNumber(stage.scaleMode));
			this.output.writeInt(flash.display.StageDisplayState.toNumber(stage.displayState));
			stage._isDirty = false;
		}

		writeCurrentMouseTarget(stage: Stage, currentMouseTarget: flash.display.InteractiveObject) {
			this.output.writeInt(MessageTag.UpdateCurrentMouseTarget);

			let sec = stage._sec;
			let Mouse = sec.ui.Mouse;
			let cursor = Mouse._cursor;
			if (currentMouseTarget) {
				let SimpleButton = sec.display.SimpleButton;
				let Sprite = sec.display.Sprite;
				this.output.writeInt(currentMouseTarget._id);
				if (cursor === MouseCursor.AUTO) {
					let node = currentMouseTarget;
					do {
						if (SimpleButton.axIsType(node) ||
							(Sprite.axIsType(node) && (<flash.display.Sprite>node).buttonMode) &&
							(<any>currentMouseTarget).useHandCursor) {
							cursor = MouseCursor.BUTTON;
							break;
						}
						node = node._parent;
					} while (node && node !== stage);
				}
			} else {
				this.output.writeInt(-1);
			}
			this.output.writeInt(MouseCursor.toNumber(cursor));
		}

		writeGraphics(graphics: Graphics) {
			if (!graphics._isDirty) {
				return;
			}
			let textures = graphics.getUsedTextures();
			let numTextures = textures.length;
			for (let i = 0; i < numTextures; i++) {
				textures[i] && this.writeBitmapData(textures[i]);
			}
			this.output.writeInt(MessageTag.UpdateGraphics);
			this.output.writeInt(graphics._id);
			this.output.writeInt(-1);
			this._writeRectangle(graphics._getContentBounds());
			this._writeAsset(graphics.getGraphicsData().toPlainObject());
			this.output.writeInt(numTextures);
			for (let i = 0; i < numTextures; i++) {
				this.output.writeInt(textures[i] ? textures[i]._id : -1);
			}
			graphics._isDirty = false;
		}

		writeNetStream(netStream: NetStream, bounds: Bounds) {
			if (!netStream._isDirty) {
				return;
			}
			writer && writer.writeLn("Sending NetStream: " + netStream._id);
			this.output.writeInt(MessageTag.UpdateNetStream);
			this.output.writeInt(netStream._id);
			this._writeRectangle(bounds);
			netStream._isDirty = false;
		}

		writeDisplayObjectRoot(displayObject: DisplayObject) {
			release || assert(!this.roots);
			this.roots = [displayObject];
			this.remoteObjects();
			this.remoteReferences();
		}

		writeBitmapData(bitmapData: BitmapData) {
			if (!bitmapData._isDirty) {
				return;
			}
			writer && writer.writeLn("Sending BitmapData: " + bitmapData._id);
			this.output.writeInt(MessageTag.UpdateBitmapData);
			this.output.writeInt(bitmapData._id);
			this.output.writeInt(bitmapData._symbol ? bitmapData._symbol.id : -1);
			this._writeRectangle(bitmapData._getContentBounds());
			this.output.writeInt(bitmapData._type);
			this._writeAsset(bitmapData.getDataBuffer().toPlainObject());
			bitmapData._isDirty = false;
		}

		writeTextContent(textContent: Shumway.TextContent) {
			if (!(textContent.flags & Shumway.TextContentFlags.Dirty)) {
				return;
			}
			writer && writer.writeLn("Sending TextContent: " + textContent._id);
			this.output.writeInt(MessageTag.UpdateTextContent);
			this.output.writeInt(textContent._id);
			this.output.writeInt(-1);
			this._writeRectangle(textContent.bounds);
			let identity = textContent._sec.geom.FROZEN_IDENTITY_MATRIX;
			this._writeMatrix(textContent.matrix || identity);
			this.output.writeInt(textContent.backgroundColor);
			this.output.writeInt(textContent.borderColor);
			this.output.writeInt(textContent.autoSize);
			this.output.writeBoolean(textContent.wordWrap);
			this.output.writeInt(textContent.scrollV);
			this.output.writeInt(textContent.scrollH);
			this._writeAsset(textContent.plainText);
			this._writeAsset(textContent.textRunData.toPlainObject());
			let coords = textContent.coords;
			if (coords) {
				let numCoords = coords.length;
				this.output.writeInt(numCoords);
				for (let i = 0; i < numCoords; i++) {
					this.output.writeInt(coords[i]);
				}
			} else {
				this.output.writeInt(0);
			}
			textContent.flags &= ~Shumway.TextContentFlags.Dirty
		}

		/**
		 * Writes the number of display objects this display object clips.
		 */
		writeClippedObjectsCount(displayObject: DisplayObject) {
			if (displayObject._clipDepth > 0 && displayObject._parent) {
				// Clips in GFX land don't use absolute clip depth numbers. Instead we need to encode
				// the number of siblings you want to clip. If children are removed or added, GFX clip
				// values need to be recomputed.
				let i = displayObject._parent.getChildIndex(displayObject);
				let j = displayObject._parent.getClipDepthIndex(displayObject._clipDepth);
				// An invalid SWF can contain a clipping mask that doesn't clip anything, but pretends to.
				if (j - i < 0) {
					this.output.writeInt(-1);
					return;
				}
				for (let k = i + 1; k <= i; k++) {
					// assert(displayObject._parent.getChildAt(k)._depth > displayObject._depth && displayObject._parent.getChildAt(k)._depth <= displayObject._clipDepth);
				}
				this.output.writeInt(j - i);
			} else {
				this.output.writeInt(-1);
			}
		}

		writeUpdateFrame(displayObject: DisplayObject) {
			// Write Header
			this.output.writeInt(MessageTag.UpdateFrame);
			this.output.writeInt(displayObject._id);

			writer && writer.writeLn("Sending UpdateFrame: " + displayObject.debugName(true));

			let hasMask = false;
			let hasMatrix = displayObject._hasDirtyFlags(DisplayObjectDirtyFlags.DirtyMatrix);
			let hasColorTransform = displayObject._hasDirtyFlags(DisplayObjectDirtyFlags.DirtyColorTransform);
			let hasMiscellaneousProperties = displayObject._hasDirtyFlags(DisplayObjectDirtyFlags.DirtyMiscellaneousProperties);

			let video: Video = null;
			if (displayObject._sec.media.Video.axIsType(displayObject)) {
				video = <Video>displayObject;
			}

			// Check if any children need to be written. These are remoting children, not just display object children.
			let hasRemotableChildren = false;
			if (this.phase === RemotingPhase.References) {
				hasRemotableChildren = displayObject._hasAnyDirtyFlags(
					DisplayObjectDirtyFlags.DirtyChildren |
					DisplayObjectDirtyFlags.DirtyGraphics |
					DisplayObjectDirtyFlags.DirtyBitmapData |
					DisplayObjectDirtyFlags.DirtyNetStream |
					DisplayObjectDirtyFlags.DirtyTextContent
				);
				hasMask = displayObject._hasDirtyFlags(DisplayObjectDirtyFlags.DirtyMask);
			}
			let bitmap: Bitmap = null;
			if (displayObject._sec.display.Bitmap.axIsType(displayObject)) {
				bitmap = <Bitmap>displayObject;
			}

			// Checks if the computed clip value needs to be written.
			let hasClip = displayObject._hasDirtyFlags(DisplayObjectDirtyFlags.DirtyClipDepth);

			// Write Has Bits
			let hasBits = 0;
			hasBits |= hasMatrix ? MessageBits.HasMatrix : 0;
			hasBits |= hasColorTransform ? MessageBits.HasColorTransform : 0;
			hasBits |= hasMask ? MessageBits.HasMask : 0;
			hasBits |= hasClip ? MessageBits.HasClip : 0;
			hasBits |= hasMiscellaneousProperties ? MessageBits.HasMiscellaneousProperties : 0;
			hasBits |= hasRemotableChildren ? MessageBits.HasChildren : 0;
			this.output.writeInt(hasBits);

			// Write Properties
			if (hasMatrix) {
				this._writeMatrix(displayObject._getMatrix());
			}
			if (hasColorTransform) {
				this._writeColorTransform(displayObject._colorTransform);
			}
			if (hasMask) {
				this.output.writeInt(displayObject.mask ? displayObject.mask._id : -1);
			}
			if (hasClip) {
				this.writeClippedObjectsCount(displayObject);
			}
			if (hasMiscellaneousProperties) {
				this.output.writeInt(displayObject._ratio);
				this.output.writeInt(BlendMode.toNumber(displayObject._blendMode));
				this._writeFilters(displayObject._filters);
				this.output.writeBoolean(displayObject._hasFlags(DisplayObjectFlags.Visible));
				this.output.writeBoolean(displayObject.cacheAsBitmap);
				if (bitmap) {
					this.output.writeInt(PixelSnapping.toNumber(bitmap.pixelSnapping));
					this.output.writeInt(bitmap.smoothing ? 1 : 0);
				} else {
					// For non-bitmaps, write null-defaults that cause flags not to be set in the GFX backend.
					this.output.writeInt(PixelSnapping.toNumber(PixelSnapping.NEVER));
					this.output.writeInt(0);
				}
			}

			let graphics = displayObject._getGraphics();
			let textContent = displayObject._getTextContent();
			if (hasRemotableChildren) {
				writer && writer.enter("Children: {");
				if (bitmap) {
					if (bitmap.bitmapData) {
						this.output.writeInt(1);
						this.output.writeInt(IDMask.Asset | bitmap.bitmapData._id);
					} else {
						this.output.writeInt(0);
					}
				} else if (video) {
					if (video._netStream) {
						this.output.writeInt(1);
						this.output.writeInt(IDMask.Asset | video._netStream._id);
					} else {
						this.output.writeInt(0);
					}
				} else {
					// Check if we have a graphics or text object and write that as a child first.
					let count = (graphics || textContent) ? 1 : 0;
					let children = displayObject._children;
					if (children) {
						count += children.length;
					}
					this.output.writeInt(count);
					if (graphics) {
						writer && writer.writeLn("Reference Graphics: " + graphics._id);
						this.output.writeInt(IDMask.Asset | graphics._id);
					} else if (textContent) {
						writer && writer.writeLn("Reference TextContent: " + textContent._id);
						this.output.writeInt(IDMask.Asset | textContent._id);
					}
					// Write all the display object children.
					if (children) {
						for (let i = 0; i < children.length; i++) {
							writer && writer.writeLn("Reference DisplayObject: " + children[i].debugName());
							this.output.writeInt(children[i]._id);
							// Make sure children with a clip depth are getting visited.
							if (children[i]._clipDepth >= 0) {
								children[i]._setDirtyFlags(DisplayObjectDirtyFlags.DirtyClipDepth);
							}
						}
					}
				}
				writer && writer.leave("}");
			}
			if (this.phase === RemotingPhase.References) {
				displayObject._removeDirtyFlags(DisplayObjectDirtyFlags.Dirty);
			}
		}

		/**
		 * Visit remotable child objects that are not otherwise visited.
		 */
		writeDirtyAssets(displayObject: DisplayObject) {
			let graphics = displayObject._getGraphics();
			if (graphics) {
				this.writeGraphics(graphics);
				return;
			}

			let textContent = displayObject._getTextContent();
			if (textContent) {
				this.writeTextContent(textContent);
				return;
			}

			let bitmap: Bitmap = null;
			if (displayObject._sec.display.Bitmap.axIsType(displayObject)) {
				bitmap = <Bitmap>displayObject;
				if (bitmap.bitmapData) {
					this.writeBitmapData(bitmap.bitmapData);
				}
				return;
			}

			let video: Video = null;
			if (displayObject._sec.media.Video.axIsType(displayObject)) {
				video = <Video>displayObject;
				if (video._netStream) {
					this.writeNetStream(video._netStream, video._getContentBounds());
				}
				return;
			}
		}

		writeDrawToBitmap(bitmapData: flash.display.BitmapData, source: Shumway.Remoting.IRemotable,
		                  matrix: flash.geom.Matrix = null,
		                  colorTransform: flash.geom.ColorTransform = null, blendMode: string = null,
		                  clipRect: flash.geom.Rectangle = null, smoothing: boolean = false) {
			this.output.writeInt(MessageTag.DrawToBitmap);
			this.output.writeInt(bitmapData._id);
			if (bitmapData._sec.display.BitmapData.axIsType(source)) {
				this.output.writeInt(IDMask.Asset | source._id);
			} else {
				this.output.writeInt(source._id);
			}

			let hasBits = 0;
			hasBits |= matrix ? MessageBits.HasMatrix : 0;
			hasBits |= colorTransform ? MessageBits.HasColorTransform : 0;
			hasBits |= clipRect ? MessageBits.HasClipRect : 0;

			this.output.writeInt(hasBits);
			if (matrix) {
				this._writeMatrix(matrix);
			}
			if (colorTransform) {
				this._writeColorTransform(colorTransform);
			}
			if (clipRect) {
				this._writeRectangle(Bounds.FromRectangle(clipRect));
			}
			this.output.writeInt(BlendMode.toNumber(blendMode));
			this.output.writeBoolean(smoothing);
		}

		private _writeMatrix(matrix: flash.geom.Matrix) {

			if (matrix.b === 0 && matrix.c === 0) {
				if (matrix.a === 1 && matrix.d === 1) {
					this.output.writeInt(MatrixEncoding.TranslationOnly);
					this.output.write2Floats(matrix.tx, matrix.ty);
				} else {
					if (matrix.a === matrix.d) {
						this.output.writeInt(MatrixEncoding.UniformScaleAndTranslationOnly);
						this.output.writeFloat(matrix.a);
					} else {
						this.output.writeInt(MatrixEncoding.ScaleAndTranslationOnly);
						this.output.write2Floats(matrix.a, matrix.d);
					}
					this.output.write2Floats(matrix.tx, matrix.ty);
				}
			} else {
				this.output.writeInt(MatrixEncoding.All);
				this.output.write6Floats(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
			}
		}

		private _writeRectangle(bounds: Bounds) {
			let output = this.output;
			// TODO: check if we should write bounds instead. Depends on what's more useful in GFX-land.
			output.write4Ints(bounds.xMin, bounds.yMin, bounds.width, bounds.height);
		}

		private _writeAsset(asset: any) {
			this.output.writeInt(this.outputAssets.length);
			this.outputAssets.push(asset);
		}

		private _writeFilters(filters: flash.filters.BitmapFilter []) {
			if (!filters || filters.length === 0) {
				this.output.writeInt(0);
				return;
			}
			let sec = filters[0]._sec;
			let count = 0;
			let blurFilterClass = sec.filters.BlurFilter;
			let dropShadowFilterClass = sec.filters.DropShadowFilter;
			let glowFilterClass = sec.filters.GlowFilter;
			let colorMatrixFilterClass = sec.filters.ColorMatrixFilter;
			for (let i = 0; i < filters.length; i++) {
				if (blurFilterClass.axIsType(filters[i]) ||
					dropShadowFilterClass.axIsType(filters[i]) ||
					glowFilterClass.axIsType(filters[i]) ||
					colorMatrixFilterClass.axIsType(filters[i])) {
					count++;
				} else {
					Shumway.Debug.somewhatImplemented(filters[i].toString());
				}
			}
			this.output.writeInt(count);
			for (let i = 0; i < filters.length; i++) {
				let filter = filters[i];
				if (blurFilterClass.axIsType(filter)) {
					let blurFilter = <flash.filters.BlurFilter>filter;
					this.output.writeInt(FilterType.Blur);
					this.output.writeFloat(blurFilter.blurX);
					this.output.writeFloat(blurFilter.blurY);
					this.output.writeInt(blurFilter.quality);
				} else if (dropShadowFilterClass.axIsType(filter)) {
					let dropShadowFilter = <flash.filters.DropShadowFilter>filter;
					this.output.writeInt(FilterType.DropShadow);
					this.output.writeFloat(dropShadowFilter.alpha);
					this.output.writeFloat(dropShadowFilter.angle);
					this.output.writeFloat(dropShadowFilter.blurX);
					this.output.writeFloat(dropShadowFilter.blurY);
					this.output.writeInt(dropShadowFilter.color);
					this.output.writeFloat(dropShadowFilter.distance);
					this.output.writeBoolean(dropShadowFilter.hideObject);
					this.output.writeBoolean(dropShadowFilter.inner);
					this.output.writeBoolean(dropShadowFilter.knockout);
					this.output.writeInt(dropShadowFilter.quality);
					this.output.writeFloat(dropShadowFilter.strength);
				} else if (glowFilterClass.axIsType(filter)) {
					let glowFilter = <flash.filters.GlowFilter>filter;
					this.output.writeInt(FilterType.DropShadow);
					this.output.writeFloat(glowFilter.alpha);
					this.output.writeFloat(0); // angle
					this.output.writeFloat(glowFilter.blurX);
					this.output.writeFloat(glowFilter.blurY);
					this.output.writeInt(glowFilter.color);
					this.output.writeFloat(0); // distance
					this.output.writeBoolean(false); // hideObject
					this.output.writeBoolean(glowFilter.inner);
					this.output.writeBoolean(glowFilter.knockout);
					this.output.writeInt(glowFilter.quality);
					this.output.writeFloat(glowFilter.strength);
				} else if (colorMatrixFilterClass.axIsType(filter)) {
					let matrix = (<flash.filters.ColorMatrixFilter>filter).matrix;
					this.output.writeInt(FilterType.ColorMatrix);
					for (let j = 0; j < 20; j++) {
						this.output.writeFloat(matrix[j]);
					}
				}
			}
		}

		private _writeColorTransform(colorTransform: flash.geom.ColorTransform) {
			let output = this.output;
			let rM = colorTransform.redMultiplier;
			let gM = colorTransform.greenMultiplier;
			let bM = colorTransform.blueMultiplier;
			let aM = colorTransform.alphaMultiplier;
			let rO = colorTransform.redOffset;
			let gO = colorTransform.greenOffset;
			let bO = colorTransform.blueOffset;
			let aO = colorTransform.alphaOffset;

			let identityOffset = rO === gO && gO === bO && bO === aO && aO === 0;
			let identityColorMultiplier = rM === gM && gM === bM && bM === 1;

			if (identityOffset && identityColorMultiplier) {
				if (aM === 1) {
					output.writeInt(ColorTransformEncoding.Identity);
				} else {
					output.writeInt(ColorTransformEncoding.AlphaMultiplierOnly);
					output.writeFloat(aM);
				}
			} else {
				let zeroNonAlphaMultipliers = rM === 0 && gM === 0 && bM === 0;
				if (zeroNonAlphaMultipliers) {
					output.writeInt(ColorTransformEncoding.AlphaMultiplierWithOffsets);
					output.writeFloat(aM);
					output.writeInt(rO);
					output.writeInt(gO);
					output.writeInt(bO);
					output.writeInt(aO);
				} else {
					output.writeInt(ColorTransformEncoding.All);
					output.writeFloat(rM);
					output.writeFloat(gM);
					output.writeFloat(bM);
					output.writeFloat(aM);
					output.writeInt(rO);
					output.writeInt(gO);
					output.writeInt(bO);
					output.writeInt(aO);
				}
			}
		}

		writeRequestBitmapData(bitmapData: BitmapData) {
			writer && writer.writeLn("Sending BitmapData Request");
			this.output.writeInt(MessageTag.RequestBitmapData);
			this.output.writeInt(bitmapData._id);
		}
	}

	export interface FocusEventData {
		type: FocusEventType
	}

	export class PlayerChannelDeserializer {

		constructor(private sec: flash.system.ISecurityDomain, private input: IDataInput,
		            private inputAssets: any[]) {
			// ..
		}

		public read(): any {
			let input = this.input;
			let tag = input.readInt();
			switch (<MessageTag>tag) {
				case MessageTag.MouseEvent:
					return this._readMouseEvent();
				case MessageTag.KeyboardEvent:
					return this._readKeyboardEvent();
				case MessageTag.FocusEvent:
					return this._readFocusEvent();
			}
			release || assert(false, 'Unknown MessageReader tag: ' + tag);
		}

		private _readFocusEvent(): FocusEventData {
			let input = this.input;
			let typeId = input.readInt();
			return {
				tag: MessageTag.FocusEvent,
				type: <FocusEventType>typeId
			} as any;
		}

		private _readMouseEvent(): MouseEventAndPointData {
			let input = this.input;
			let typeId = input.readInt();
			let type = Shumway.Remoting.MouseEventNames[typeId];
			let pX = input.readFloat();
			let pY = input.readFloat();
			let buttons = input.readInt();
			let flags = input.readInt();
			return {
				tag: MessageTag.MouseEvent,
				type: type,
				point: this.sec.geom.Point.create([pX, pY]),
				ctrlKey: !!(flags & KeyboardEventFlags.CtrlKey),
				altKey: !!(flags & KeyboardEventFlags.AltKey),
				shiftKey: !!(flags & KeyboardEventFlags.ShiftKey),
				buttons: buttons
			} as any;
		}

		private _readKeyboardEvent(): KeyboardEventData {
			let input = this.input;
			let typeId = input.readInt();
			let type = Shumway.Remoting.KeyboardEventNames[typeId];
			let keyCode = input.readInt();
			let charCode = input.readInt();
			let location = input.readInt();
			let flags = input.readInt();
			return {
				tag: MessageTag.KeyboardEvent,
				type: type,
				keyCode: keyCode,
				charCode: charCode,
				location: location,
				ctrlKey: !!(flags & KeyboardEventFlags.CtrlKey),
				altKey: !!(flags & KeyboardEventFlags.AltKey),
				shiftKey: !!(flags & KeyboardEventFlags.ShiftKey)
			} as any;
		}
	}
}

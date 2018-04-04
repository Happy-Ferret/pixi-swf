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
// Class: BitmapData
module Shumway.flash.display {
	import notImplemented = Shumway.Debug.notImplemented;
	import assert = Shumway.Debug.assert;
	import somewhatImplemented = Shumway.Debug.somewhatImplemented;
	import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
	import swap32 = Shumway.IntegerUtilities.swap32;
	import premultiplyARGB = Shumway.ColorUtilities.premultiplyARGB;
	import unpremultiplyARGB = Shumway.ColorUtilities.unpremultiplyARGB;
	import RGBAToARGB = Shumway.ColorUtilities.RGBAToARGB;
	import tableLookupUnpremultiplyARGB = Shumway.ColorUtilities.tableLookupUnpremultiplyARGB;
	import blendPremultipliedBGRA = Shumway.ColorUtilities.blendPremultipliedBGRA;
	import indexOf = Shumway.ArrayUtilities.indexOf;

	/**
	 * Holds blobs of bitmap data in various formats and lets you do basic pixel operations. When
	 * data is unpacked, it is stored as premultiplied ARGB since it's what the SWF encodes bitmaps
	 * as.  This way we don't have to do unecessary byte conversions.
	 */
	export class BitmapData extends LegacyEntity implements IBitmapDrawable, Shumway.Remoting.IRemotable {

		static axClass: typeof BitmapData;

		static classInitializer: any = null;

		_symbol: BitmapSymbol;

		applySymbol() {
			release || assert(this._symbol);
			let symbol = this._symbol;
			release || assert(symbol.syncId);
			this._rect = this._sec.geom.Rectangle.create([0, 0, symbol.width, symbol.height]);
			this._transparent = true;
			this._id = symbol.syncId;
			if (symbol.type === ImageType.PremultipliedAlphaARGB ||
				symbol.type === ImageType.StraightAlphaARGB ||
				symbol.type === ImageType.StraightAlphaRGBA) {
				release || assert(symbol.data);
				this._setData(symbol.data, symbol.type);
			} else {
				this._isDirty = false;
				this._isRemoteDirty = true;
			}
			this._solidFillColorPBGRA = null;
			this._bitmapReferrers = [];
		}

		static MAXIMUM_WIDTH: number = 8191;
		static MAXIMUM_HEIGHT: number = 8191;
		static MAXIMUM_DIMENSION: number = 16777215;

		constructor(width: number /*int*/, height: number /*int*/, transparent: boolean = true,
		            fillColorARGB: number /*uint*/ = 4294967295) {
			width = width | 0;
			height = height | 0;
			transparent = !!transparent;
			fillColorARGB = fillColorARGB | 0;
			super();
			if (this._symbol) {
				this.applySymbol();
				return;
			}
			if (width > BitmapData.MAXIMUM_WIDTH || width <= 0 ||
				height > BitmapData.MAXIMUM_HEIGHT || height <= 0 ||
				width * height > BitmapData.MAXIMUM_DIMENSION) {
				this._sec.throwError('ArgumentError', Errors.InvalidBitmapData);
			}
			this._rect = this._sec.geom.Rectangle.create([0, 0, width, height]);
			this._transparent = transparent;
			this._id = flash.display.DisplayObject.getNextSyncID();
			this._setData(new Uint8Array(width * height * 4), ImageType.PremultipliedAlphaARGB);
			let alpha = fillColorARGB >> 24;
			if (alpha === 0 && transparent) {
				// No need to do an initial fill since this would all be zeros anyway.
				this._solidFillColorPBGRA = 0;
			} else {
				this.fillRect(this._rect, fillColorARGB);
			}
			this._bitmapReferrers = [];
			release || assert(this._isDirty === !!this._data);
			release || assert(this._isRemoteDirty === !this._data);
		}

		private _setData(data: Uint8Array, type: ImageType) {
			// Alpha images are parsed to Uint8Clamped array. Easiest to just handle here.
			if (data instanceof Uint8ClampedArray) {
				data = new Uint8Array(data.buffer);
			}
			release || assert(data instanceof Uint8Array);
			this._data = data;
			this._type = type;
			this._view = new Int32Array(data.buffer);
			this._dataBuffer = DataBuffer.FromArrayBuffer(data.buffer);
			this._isDirty = true;
			this._isRemoteDirty = false;
		}

		/**
		 * Back references to Bitmaps that use this BitmapData. These objects need to be marked as dirty
		 * when this bitmap data becomes dirty.
		 */
		private _bitmapReferrers: flash.display.Bitmap [];

		_addBitmapReferrer(bitmap: flash.display.Bitmap) {
			let index = indexOf(this._bitmapReferrers, bitmap);
			release || assert(index < 0);
			this._bitmapReferrers.push(bitmap);
		}

		_removeBitmapReferrer(bitmap: flash.display.Bitmap) {
			let index = indexOf(this._bitmapReferrers, bitmap);
			release || assert(index >= 0);
			this._bitmapReferrers[index] = null;
		}

		/**
		 * Called whenever the contents of this bitmap data changes.
		 */
		private _invalidate() {
			if (this._isDirty) {
				return;
			}
			this._isDirty = true;
			this._isRemoteDirty = false;
			// TODO: We probably don't need to propagate any flags if |_locked| is true.
			for (let i = 0; i < this._bitmapReferrers.length; i++) {
				let bitmap = this._bitmapReferrers[i];
				if (bitmap) {
					bitmap._setDirtyFlags(DisplayObjectDirtyFlags.DirtyBitmapData);
				}
			}
		}

		_transparent: boolean;
		_rect: flash.geom.Rectangle;

		_id: number;
		_locked: boolean;

		/**
		 * Image format stored in the |_data| buffer.
		 */
		_type: ImageType;

		/**
		 * Actual image bytes as raw pixel data of the format given by `_type`.
		 */
		_data: Uint8Array;

		/**
		 * Data buffer wrapped around the |_data| buffer.
		 */
		_dataBuffer: DataBuffer;

		/**
		 * Int32Array view on |_data| useful when working with 4 bytes at a time. Endianess is
		 * important here, so if |_type| is PremultipliedAlphaARGB as is usually the case for
		 * bitmap data, then |_view| values are actually BGRA (on little-endian machines).
		 */
		_view: Int32Array;

		/**
		 * Indicates whether this bitmap data's data buffer has changed since the last time it was
		 * synchronized.
		 */
		_isDirty: boolean;

		/**
		 * Indicates whether this bitmap data's data buffer has changed on the remote end and needs to
		 * be read back before any pixel operations can be performed.
		 */
		_isRemoteDirty: boolean;

		/**
		 * If non-null then this value indicates that the bitmap is filled with a solid color. This is
		 * useful for optimizations.
		 */
		_solidFillColorPBGRA: any; // any | number;

		private _getTemporaryRectangleFrom(rect: flash.geom.Rectangle): flash.geom.Rectangle {
			let r = this._sec.geom._temporaryRectangle;
			r.copyFrom(rect);
			return r;
		}

		getDataBuffer(): DataBuffer {
			return this._dataBuffer;
		}

		_getContentBounds(): Bounds {
			return Shumway.Bounds.FromRectangle(this._rect);
		}

		/**
		 * TODO: Not tested.
		 */
		private _getPixelData(rect: flash.geom.Rectangle): Int32Array {
			let r = this._getTemporaryRectangleFrom(this._rect).intersectInPlace(rect);
			if (r.isEmpty()) {
				return null;
			}
			let xMin = r.x;
			let xMax = r.x + r.width;
			let yMin = r.y;
			let yMax = r.y + r.height;
			this._ensureBitmapData();
			let view = this._view;
			let width = this._rect.width;
			let output = new Int32Array(r.area);
			let p = 0;
			for (let y = yMin; y < yMax; y++) {
				let offset = y * width;
				for (let x = xMin; x < xMax; x++) {
					let colorBGRA = view[offset + x];
					let alpha = colorBGRA & 0xff;
					let colorBGR = colorBGRA >>> 8;
					colorBGRA = ((255 * colorBGR) / alpha) << 8 | alpha;
					output[p++] = colorBGRA;
				}
			}
			return output;
		}

		/**
		 * TODO: Not tested.
		 */
		private _putPixelData(rect: flash.geom.Rectangle, input: Int32Array): void {
			let r = this._getTemporaryRectangleFrom(this._rect).intersectInPlace(rect);
			if (r.isEmpty()) {
				return;
			}
			let xMin = r.x;
			let xMax = r.x + r.width;
			let yMin = r.y;
			let yMax = r.y + r.height;
			this._ensureBitmapData();
			let view = this._view;
			let width = this._rect.width;
			let p = (rect.width * rect.height - r.height) + (xMin - rect.x);
			let padding = rect.width - r.width;
			let alphaMask = this._transparent ? 0x00 : 0xff;
			for (let y = yMin; y < yMax; y++) {
				let offset = y * width;
				for (let x = xMin; x < xMax; x++) {
					let colorBGRA = input[p++];
					let alpha = colorBGRA & alphaMask;
					let colorBGR = colorBGRA >>> 8;
					view[offset + x] = (((colorBGR * alpha + 254) / 255) & 0x00ffffff) << 8 | alpha;
				}
				p += padding;
			}
			this._invalidate();
		}

		get width(): number /*int*/ {
			return this._rect.width;
		}

		get height(): number /*int*/ {
			return this._rect.height;
		}

		get rect(): flash.geom.Rectangle {
			return this._rect.clone();
		}

		get transparent(): boolean {
			return this._transparent;
		}

		clone(): flash.display.BitmapData {
			let bd: BitmapData = this._sec.display.BitmapData.createObject();
			bd._rect = this._rect.clone();
			bd._transparent = this._transparent;
			bd._solidFillColorPBGRA = this._solidFillColorPBGRA;
			bd._bitmapReferrers = [];
			// TODO: clone without reading back bitmapdata. There's no need for that.
			this._ensureBitmapData();
			bd._id = flash.display.DisplayObject.getNextSyncID();
			bd._setData(new Uint8Array(this._data), this._type);
			return bd;
		}

		/**
		 * Returns an straight alpha RGB pixel value 0x00RRGGBB.
		 */
		getPixel(x: number /*int*/, y: number /*int*/): number /*uint*/ {
			x = x | 0;
			y = y | 0;
			return this.getPixel32(x, y) & 0x00ffffff;
		}

		/**
		 * Returns an straight alpha ARGB pixel value 0xAARRGGBB.
		 */
		getPixel32(x: number /*int*/, y: number /*int*/): number /*uint*/ {
			x = x | 0;
			y = y | 0;
			if (!this._rect.contains(x, y)) {
				return 0;
			}
			this._ensureBitmapData();
			let value = this._view[y * this._rect.width + x];
			switch (this._type) {
				case ImageType.PremultipliedAlphaARGB:
					let pARGB = swap32(value);
					let uARGB = unpremultiplyARGB(pARGB);
					return uARGB >>> 0;
				case ImageType.StraightAlphaRGBA:
					return RGBAToARGB(swap32(value));
				default:
					Shumway.Debug.notImplemented(ImageType[this._type]);
					return 0;
			}
		}

		setPixel(x: number /*int*/, y: number /*int*/, uARGB: number /*uint*/): void {
			// TODO: implement this as a wrapper for setPixel32.
			x = x | 0;
			y = y | 0;
			uARGB = uARGB | 0;
			if (!this._rect.contains(x, y)) {
				return;
			}
			this._ensureBitmapData();
			let i = y * this._rect.width + x;
			let a = this._view[i] & 0xff;
			uARGB = uARGB & 0x00ffffff | a << 24;
			let pARGB = premultiplyARGB(uARGB);
			this._view[i] = swap32(pARGB);
			this._invalidate();
			this._solidFillColorPBGRA = null;
		}

		setPixel32(x: number /*int*/, y: number /*int*/, uARGB: number /*uint*/): void {
			x = x | 0;
			y = y | 0;
			if (!this._rect.contains(x, y)) {
				return;
			}
			this._ensureBitmapData();
			let a = uARGB >>> 24;
			let uRGB = uARGB & 0x00ffffff;
			let pARGB: number;
			if (this._transparent) {
				let uARGB = uRGB | a << 24;
				pARGB = premultiplyARGB(uARGB);
			} else {
				pARGB = uRGB | 0xff000000;
			}
			this._view[y * this._rect.width + x] = swap32(pARGB);
			this._invalidate();
			this._solidFillColorPBGRA = null;
		}

		applyFilter(sourceBitmapData: flash.display.BitmapData, sourceRect: flash.geom.Rectangle,
		            destPoint: flash.geom.Point, filter: flash.filters.BitmapFilter): void {
			sourceBitmapData = sourceBitmapData;
			sourceRect = sourceRect;
			destPoint = destPoint;
			filter = filter;
			release || somewhatImplemented("public flash.display.BitmapData::applyFilter " + filter);
			return;
		}

		colorTransform(rect: flash.geom.Rectangle, colorTransform: flash.geom.ColorTransform): void {
			rect = rect;
			colorTransform = colorTransform;
			release || somewhatImplemented("public flash.display.BitmapData::colorTransform");
			return;
		}

		compare(otherBitmapData: flash.display.BitmapData): any {
			otherBitmapData = otherBitmapData;
			release || notImplemented("public flash.display.BitmapData::compare");
			return null;
		}

		copyChannel(sourceBitmapData: flash.display.BitmapData, sourceRect: flash.geom.Rectangle,
		            destPoint: flash.geom.Point, sourceChannel: number /*uint*/, destChannel: number
		            /*uint*/): void {
			sourceBitmapData = sourceBitmapData;
			sourceRect = sourceRect;
			destPoint = destPoint;
			sourceChannel = sourceChannel >>> 0;
			destChannel = destChannel >>> 0;
			release || somewhatImplemented("public flash.display.BitmapData::copyChannel");
			return;
		}

		/**
		 * Copies a rectangular region of pixels into the current bitmap data.
		 */
		copyPixels(sourceBitmapData: flash.display.BitmapData,
		           sourceRect: flash.geom.Rectangle,
		           destPoint: flash.geom.Point,
		           alphaBitmapData: flash.display.BitmapData = null,
		           alphaPoint: flash.geom.Point = null,
		           mergeAlpha?: boolean): void {
			mergeAlpha = !!mergeAlpha;

			if (alphaBitmapData || alphaPoint) {
				release || somewhatImplemented("public flash.display.BitmapData::copyPixels - Alpha");
				return;
			}

			// Deal with fractional pixel coordinates, looks like Flash "rounds" the corners of
			// the source rect, however a width of |0.5| rounds down rather than up so we're not
			// quite correct here.
			let sRect;
			if (sourceRect) {
				sRect = this._getTemporaryRectangleFrom(sourceRect).roundInPlace();
			} else {
				sRect = this._sec.geom._temporaryRectangle.setEmpty();
			}

			let tBRect = this._rect;
			let sBRect = sourceBitmapData._rect;

			// Clip sRect against SBRect.
			let sL = Math.max(sRect.x, 0);
			let sT = Math.max(sRect.y, 0);
			let sR = Math.min(sRect.x + sRect.width, sBRect.width);
			let sB = Math.min(sRect.y + sRect.height, sBRect.height);

			// Compute source rect offsets (in case the source rect had negative x, y coordinates).
			let oX = sL - sRect.x;
			let oY = sT - sRect.y;

			let tL = (destPoint.x | 0) + oX;
			let tT = (destPoint.y | 0) + oY;

			if (tL < 0) {
				sL -= tL;
				tL = 0;
			}

			if (tT < 0) {
				sT -= tT;
				tT = 0;
			}

			let tW = Math.min(sR - sL, tBRect.width - tL);
			let tH = Math.min(sB - sT, tBRect.height - tT);

			if (tW <= 0 || tH <= 0) {
				return;
			}

			let sX = sL;
			let sY = sT;

			let tX = tL;
			let tY = tT;

			let sStride = sourceBitmapData._rect.width;
			let tStride = this._rect.width;

			this._ensureBitmapData();
			sourceBitmapData._ensureBitmapData();

			let s = sourceBitmapData._view;
			let t = this._view;

			if (sourceBitmapData._type !== this._type) {
				release || somewhatImplemented("public flash.display.BitmapData::copyPixels - Color Format Conversion");
			}

			if (mergeAlpha && this._type !== ImageType.PremultipliedAlphaARGB) {
				release || somewhatImplemented("public flash.display.BitmapData::copyPixels - Merge Alpha");
				return;
			}

			// No reason to copy pixels since since both source and target are the same solid fill,
			// regardless of alpha blending. (TODO: I think the math works out for mergeAlpha also.)
			if (this._solidFillColorPBGRA !== null &&
				this._solidFillColorPBGRA === sourceBitmapData._solidFillColorPBGRA) {
				return;
			}

			// Source has a solid fill but is fully opaque, we can get away without alpha blending here.
			if (sourceBitmapData._solidFillColorPBGRA !== null &&
				(sourceBitmapData._solidFillColorPBGRA & 0xFF) === 0xFF) {
				mergeAlpha = false;
			}

			// Finally do the copy. All the math above is needed just so we don't do any branches inside
			// this hot loop.

			if (mergeAlpha) {
				this._copyPixelsAndMergeAlpha(s, sX, sY, sStride, t, tX, tY, tStride, tW, tH);
			} else {
				let sP = (sY * sStride + sX) | 0;
				let tP = (tY * tStride + tX) | 0;
				if ((tW & 3) === 0) {
					for (let y = 0; y < tH; y = y + 1 | 0) {
						for (let x = 0; x < tW; x = x + 4 | 0) {
							t[(tP + x + 0) | 0] = s[(sP + x + 0) | 0];
							t[(tP + x + 1) | 0] = s[(sP + x + 1) | 0];
							t[(tP + x + 2) | 0] = s[(sP + x + 2) | 0];
							t[(tP + x + 3) | 0] = s[(sP + x + 3) | 0];
						}
						sP = sP + sStride | 0;
						tP = tP + tStride | 0;
					}
				} else {
					for (let y = 0; y < tH; y = y + 1 | 0) {
						for (let x = 0; x < tW; x = x + 1 | 0) {
							t[tP + x | 0] = s[sP + x | 0];
						}
						sP = sP + sStride | 0;
						tP = tP + tStride | 0;
					}
				}
			}

			this._solidFillColorPBGRA = null;
			this._invalidate();
		}

		private _copyPixelsAndMergeAlpha(s: Int32Array, sX: number, sY: number, sStride: number,
		                                 t: Int32Array, tX: number, tY: number, tStride: number, tW: number, tH: number) {
			let sP = (sY * sStride + sX) | 0;
			let tP = (tY * tStride + tX) | 0;
			for (let y = 0; y < tH; y = y + 1 | 0) {
				for (let x = 0; x < tW; x = x + 1 | 0) {
					let spBGRA = s[sP + x | 0];
					let sA = spBGRA & 0xff;
					// Optimize for the case where the source pixel is fully opaque or transparent. This
					// pays off if the source image has many such pixels but slows down the normal case.
					if (sA === 0xff) {
						t[tP + x | 0] = spBGRA; // Opaque, just copy value over.
					} else if (sA === 0) {
						// Transparent, don't do anything.
					} else {
						// Compute the blending equation: src.rgb + (dst.rgb * (1 - src.a)). The trick here
						// is to compute GA and BR at the same time without pulling apart each channel.
						// We use the "double blend trick" (http://stereopsis.com/doubleblend.html) to
						// compute GA and BR without unpacking them.
						let sGA = spBGRA & 0x00ff00ff;
						let sBR = spBGRA >> 8 & 0x00ff00ff;
						let tpBGRA = t[tP + x | 0];
						let tGA = tpBGRA & 0x00ff00ff;
						let tBR = tpBGRA >> 8 & 0x00ff00ff;
						let A = 256 - sA;
						tGA = Math.imul(tGA, A) >> 8;
						tBR = Math.imul(tBR, A) >> 8;
						// TODO: Not sure if target alpha is computed correctly.
						t[tP + x | 0] = ((sBR + tBR & 0x00ff00ff) << 8) | (sGA + tGA & 0x00ff00ff);
					}
				}
				sP = sP + sStride | 0;
				tP = tP + tStride | 0;
			}
		}

		dispose(): void {
			this._rect.setEmpty();
			this._view = null;
			this._invalidate();
		}

		draw(source: flash.display.IBitmapDrawable, matrix: flash.geom.Matrix = null,
		     colorTransform: flash.geom.ColorTransform = null, blendMode: BlendMode = null,
		     clipRect: flash.geom.Rectangle = null, smoothing: boolean = false): void {
			smoothing = !!smoothing;
			release || somewhatImplemented("public flash.display.BitmapData::draw");
			let serializer: IBitmapDataSerializer = this._sec.player;
			if (matrix) {
				matrix = matrix.clone().toTwipsInPlace();
			}
			serializer.drawToBitmap(this, source, matrix, colorTransform, blendMode, clipRect, smoothing);
			this._isRemoteDirty = true;
		}

		drawWithQuality(source: flash.display.IBitmapDrawable, matrix: flash.geom.Matrix = null,
		                colorTransform: flash.geom.ColorTransform = null, blendMode: BlendMode = null,
		                clipRect: flash.geom.Rectangle = null, smoothing: boolean = false,
		                quality: StageQuality = null): void {
			release || somewhatImplemented("public flash.display.BitmapData::drawWithQuality");
			this.draw(source, matrix, colorTransform, blendMode, clipRect, smoothing);
		}

		fillRect(rect: flash.geom.Rectangle, uARGB: number /*uint*/): void {
			this._ensureBitmapData();
			// TODO: what guarantees this, and why do we even need it?
			release || assert(this._type === ImageType.PremultipliedAlphaARGB);
			let pARGB: number;
			if (this._transparent) {
				pARGB = premultiplyARGB(uARGB);
			} else {
				pARGB = uARGB | 0xff000000;
			}
			let pBGRA = swap32(pARGB);
			let r = this._getTemporaryRectangleFrom(this._rect).intersectInPlace(rect);
			if (r.isEmpty()) {
				return;
			}
			// Filling with the same color?
			if (this._solidFillColorPBGRA === pBGRA) {
				return;
			}
			let view = this._view;
			// If we are filling the entire buffer, we can do a little better ~ 25% faster.
			if (r.equals(this._rect)) {
				let length = view.length | 0;
				// Unroll 4 iterations, ~ 5% faster.
				if ((length & 0x3) === 0) {
					for (let i = 0; i < length; i += 4) {
						view[i] = pBGRA;
						view[i + 1] = pBGRA;
						view[i + 2] = pBGRA;
						view[i + 3] = pBGRA;
					}
				} else {
					for (let i = 0; i < length; i++) {
						view[i] = pBGRA;
					}
				}
				this._solidFillColorPBGRA = pBGRA;
			} else {
				let xMin = r.x | 0;
				let xMax = r.x + r.width | 0;
				let yMin = r.y | 0;
				let yMax = r.y + r.height | 0;
				let width = this._rect.width | 0;
				for (let y = yMin; y < yMax; y++) {
					let offset = y * width | 0;
					for (let x = xMin; x < xMax; x++) {
						view[offset + x] = pBGRA;
					}
				}
				this._solidFillColorPBGRA = null;
			}
			this._invalidate();
		}

		floodFill(x: number /*int*/, y: number /*int*/, color: number /*uint*/): void {
			x = x | 0;
			y = y | 0;
			color = color >>> 0;
			release || somewhatImplemented("public flash.display.BitmapData::floodFill");
			return;
		}

		generateFilterRect(sourceRect: flash.geom.Rectangle,
		                   filter: flash.filters.BitmapFilter): flash.geom.Rectangle {
			sourceRect = sourceRect;
			filter = filter;
			release || somewhatImplemented("public flash.display.BitmapData::generateFilterRect");
			return null;
		}

		getColorBoundsRect(mask: number /*uint*/, color: number /*uint*/,
		                   findColor: boolean = true): flash.geom.Rectangle {
			mask = mask >>> 0;
			color = color >>> 0;
			findColor = !!findColor;
			release || somewhatImplemented("public flash.display.BitmapData::getColorBoundsRect");
			return this._sec.geom.Rectangle.create();
		}

		getPixels(rect: flash.geom.Rectangle): flash.utils.ByteArray {
			let outputByteArray = this._sec.utils.ByteArray.create();
			this.copyPixelsToByteArray(rect, outputByteArray);
			return outputByteArray;
		}

		copyPixelsToByteArray(rect: flash.geom.Rectangle, data: flash.utils.ByteArray): void {
			let pixelData = this._getPixelData(rect);
			if (!pixelData) {
				return;
			}
			data.writeRawBytes(new Uint8Array(pixelData));
		}

		getVector(rect: flash.geom.Rectangle): Uint32Array {
			let pixelData = this._getPixelData(rect);
			if (!pixelData) {
				return new Uint32Array(0);
			}
			let outputVector = new Uint32Array(pixelData.length);
			outputVector.set(pixelData);
			return outputVector;
		}

		hitTest(firstPoint: flash.geom.Point, firstAlphaThreshold: number /*uint*/,
		        secondObject: any,
		        secondBitmapDataPoint: flash.geom.Point = null,
		        secondAlphaThreshold: number /*uint*/ = 1): boolean {
			firstPoint = firstPoint;
			firstAlphaThreshold = firstAlphaThreshold >>> 0;
			secondObject = secondObject;
			secondBitmapDataPoint = secondBitmapDataPoint;
			secondAlphaThreshold = secondAlphaThreshold >>> 0;
			release || somewhatImplemented("public flash.display.BitmapData::hitTest");
			return true;
		}

		merge(sourceBitmapData: flash.display.BitmapData, sourceRect: flash.geom.Rectangle,
		      destPoint: flash.geom.Point, redMultiplier: number /*uint*/, greenMultiplier: number
		      /*uint*/, blueMultiplier: number /*uint*/, alphaMultiplier: number /*uint*/): void {
			sourceBitmapData = sourceBitmapData;
			sourceRect = sourceRect;
			destPoint = destPoint;
			redMultiplier = redMultiplier >>> 0;
			greenMultiplier = greenMultiplier >>> 0;
			blueMultiplier = blueMultiplier >>> 0;
			alphaMultiplier = alphaMultiplier >>> 0;
			release || somewhatImplemented("public flash.display.BitmapData::merge");
		}

		noise(randomSeed: number /*int*/, low: number /*uint*/ = 0, high: number /*uint*/ = 255,
		      channelOptions: number /*uint*/ = 7, grayScale: boolean = false): void {
			randomSeed = randomSeed | 0;
			low = low >>> 0;
			high = high >>> 0;
			channelOptions = channelOptions >>> 0;
			grayScale = !!grayScale;
			release || somewhatImplemented("public flash.display.BitmapData::noise");
		}

		paletteMap(sourceBitmapData: flash.display.BitmapData, sourceRect: flash.geom.Rectangle,
		           destPoint: flash.geom.Point, redArray: any [] = null, greenArray: any [] = null,
		           blueArray: any [] = null, alphaArray: any [] = null): void {
			sourceBitmapData = sourceBitmapData;
			sourceRect = sourceRect;
			destPoint = destPoint;
			redArray = redArray;
			greenArray = greenArray;
			blueArray = blueArray;
			alphaArray = alphaArray;
			release || somewhatImplemented("public flash.display.BitmapData::paletteMap");
		}

		perlinNoise(baseX: number, baseY: number, numOctaves: number /*uint*/, randomSeed: number
		            /*int*/,
		            stitch: boolean, fractalNoise: boolean, channelOptions: number /*uint*/ = 7,
		            grayScale: boolean = false, offsets: any [] = null): void {
			baseX = +baseX;
			baseY = +baseY;
			numOctaves = numOctaves >>> 0;
			randomSeed = randomSeed | 0;
			stitch = !!stitch;
			fractalNoise = !!fractalNoise;
			channelOptions = channelOptions >>> 0;
			grayScale = !!grayScale;
			offsets = offsets;
			release || somewhatImplemented("public flash.display.BitmapData::perlinNoise");
		}

		pixelDissolve(sourceBitmapData: flash.display.BitmapData, sourceRect: flash.geom.Rectangle,
		              destPoint: flash.geom.Point, randomSeed: number /*int*/ = 0,
		              numPixels: number /*int*/ = 0, fillColor: number /*uint*/ = 0): number /*int*/ {
			sourceBitmapData = sourceBitmapData;
			sourceRect = sourceRect;
			destPoint = destPoint;
			randomSeed = randomSeed | 0;
			numPixels = numPixels | 0;
			fillColor = fillColor >>> 0;
			release || somewhatImplemented("public flash.display.BitmapData::pixelDissolve");
			return 0;
		}

		scroll(x: number /*int*/, y: number /*int*/): void {
			x = x | 0;
			y = y | 0;
			release || somewhatImplemented("public flash.display.BitmapData::scroll");
			return;
		}

		setPixels(rect: flash.geom.Rectangle, inputByteArray: flash.utils.ByteArray): void {
			this._putPixelData(rect, new Int32Array(inputByteArray.readRawBytes()));
		}

		setVector(rect: flash.geom.Rectangle, inputVector: Uint32Array): void {
			this._putPixelData(rect, inputVector);
		}

		threshold(sourceBitmapData: flash.display.BitmapData, sourceRect: flash.geom.Rectangle,
		          destPoint: flash.geom.Point, operation: string, threshold: number /*uint*/,
		          color: number /*uint*/ = 0, mask: number /*uint*/ = 4294967295,
		          copySource: boolean = false): number /*uint*/ {
			sourceBitmapData = sourceBitmapData;
			sourceRect = sourceRect;
			destPoint = destPoint;
			operation = operation;
			threshold = threshold >>> 0;
			color = color >>> 0;
			mask = mask >>> 0;
			copySource = !!copySource;
			release || somewhatImplemented("public flash.display.BitmapData::threshold");
			return 0;
		}

		lock(): void {
			this._locked = true;
		}

		unlock(changeRect: flash.geom.Rectangle = null): void {
			//changeRect = changeRect;
			this._locked = false;
		}

		histogram(hRect: flash.geom.Rectangle = null): Array<any> {
			hRect = hRect;
			release || notImplemented("public flash.display.BitmapData::histogram");
			return null;
		}

		encode(rect: flash.geom.Rectangle, compressor: any,
		       byteArray: flash.utils.ByteArray = null): flash.utils.ByteArray {
			rect = rect;
			compressor = compressor;
			byteArray = byteArray;
			release || notImplemented("public flash.display.BitmapData::encode");
			return null
		}

		/**
		 * Ensures that we have the most up-to-date version of the bitmap data. If a call to
		 * |BitmpaData.draw| was made since the last time this method was called, then we need to send
		 * a synchronous message to the GFX remote requesting the latest image data.
		 *
		 * Here we also normalize the image format to |ImageType.StraightAlphaRGBA|. We only need the
		 * normalized pixel data for pixel operations, so we defer image decoding as late as possible.
		 */
		private _ensureBitmapData() {
			if (this._isRemoteDirty) {
				let data = this._sec.player.requestBitmapData(this);
				this._setData(data.getBytes(), ImageType.StraightAlphaRGBA);
				this._isRemoteDirty = false;
				this._isDirty = false;
				this._solidFillColorPBGRA = null;
			}

			release || assert(!(this._type === ImageType.JPEG || this._type === ImageType.PNG ||
				this._type === ImageType.GIF));

			if (this._type !== ImageType.PremultipliedAlphaARGB) {
				ColorUtilities.convertImage(this._type, ImageType.PremultipliedAlphaARGB, this._view,
					this._view);
				this._type = ImageType.PremultipliedAlphaARGB;
				this._solidFillColorPBGRA = null;
			}

			release || assert(this._data);
			release || assert(this._dataBuffer);
			release || assert(this._view);
		}
	}


	export interface IBitmapDataSerializer {
		drawToBitmap(bitmapData: flash.display.BitmapData, source: flash.display.IBitmapDrawable,
		             matrix: flash.geom.Matrix, colorTransform: flash.geom.ColorTransform,
		             blendMode: string, clipRect: flash.geom.Rectangle, smoothing: boolean): void;

		requestBitmapData(bitmapData: BitmapData): DataBuffer;
	}

	export class BitmapSymbol extends Timeline.DisplaySymbol
		implements Timeline.EagerlyResolvedSymbol {
		width: number;
		height: number;
		syncId: number;
		data: Uint8Array;
		type: ImageType;

		private sharedInstance: flash.display.BitmapData;

		constructor(data: Timeline.SymbolData, _sec: system.ISecurityDomain) {
			super(data, _sec.display.BitmapData, false);
			this.ready = false;
		}

		static FromData(data: any, loaderInfo: LoaderInfo): BitmapSymbol {
			let symbol = new BitmapSymbol(data, loaderInfo._sec);
			// For non-decoded images, we don't yet have dimensions.
			symbol.width = data.width || -1;
			symbol.height = data.height || -1;
			symbol.syncId = flash.display.DisplayObject.getNextSyncID();
			symbol.data = data.data;
			switch (data.mimeType) {
				case "application/octet-stream":
					symbol.type = data.dataType;
					symbol.ready = true;
					break;
				case "image/jpeg":
					symbol.type = ImageType.JPEG;
					break;
				case "image/png":
					symbol.type = ImageType.PNG;
					break;
				case "image/gif":
					symbol.type = ImageType.GIF;
					break;
				default:
					notImplemented(data.mimeType);
			}
			return symbol;
		}

		getSharedInstance() {
			return this.sharedInstance || this.createSharedInstance();
		}

		createSharedInstance() {
			release || assert(this.ready);
			return this.sharedInstance = system.constructClassFromSymbol(this, this.symbolClass);
		}

		get resolveAssetCallback() {
			return this._unboundResolveAssetCallback.bind(this);
		}

		private _unboundResolveAssetCallback(data: any) {
			release || assert(!this.ready);
			this.ready = true;
			if (!data) {
				release || Debug.error("Error while decoding image");
				return;
			}
			release || assert(data.width);
			release || assert(data.height);
			this.width = data.width;
			this.height = data.height;
		}
	}
}

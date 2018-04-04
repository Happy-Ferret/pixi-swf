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
// Class: BitmapFilter
module Shumway.flash.filters {

	import Rectangle = flash.geom.Rectangle;

	export class BitmapFilter extends LegacyEntity {

		private static EPS: number = 0.000000001;

		// Step widths for blur based filters, for quality values 1..15:
		// If we plot the border width added by generateFilterRect for each
		// blurX (or blurY) value, the step width is the amount of blurX
		// that adds one pixel to the border width. I.e. for quality = 1,
		// the border width increments at blurX = 2, 4, 6, ...
		private static blurFilterStepWidths: number[] = [0.5, 1.05, 1.35, 1.55, 1.75, 1.9, 2, 2.1, 2.2, 2.3, 2.5, 3, 3, 3.5, 3.5];

		static _updateBlurBounds(bounds: Rectangle, blurX: number, blurY: number, quality: number /*int*/, isBlurFilter: boolean = false) {
			// Approximation of BitmapData.generateFilterRect()
			let stepWidth: number = BitmapFilter.blurFilterStepWidths[quality - 1];
			if (isBlurFilter) {
				// BlurFilter behaves slightly different from other blur based filters:
				// Given ascending blurX/blurY values, generateFilterRect with BlurFilter
				// expands the source rect later than with i.e. GlowFilter. The difference
				// appears to be stepWidth / 4 for all quality values.
				let stepWidth4: number = stepWidth / 4;
				blurX -= stepWidth4;
				blurY -= stepWidth4;
			}
			// Calculate horizontal and vertical borders:
			// blurX/blurY values <= 1 are always rounded up to 1,
			// which means that generateFilterRect always expands the source rect,
			// even when blurX/blurY is 0.
			let bh: number = Math.ceil((blurX < 1 ? 1 : blurX) * stepWidth);
			let bv: number = Math.ceil((blurY < 1 ? 1 : blurY) * stepWidth);
			bounds.inflate(bh, bv);
		}

		constructor() {
			super();
		}

		_updateFilterBounds(bounds: Rectangle) {
			// ...
		}

		_serialize(message: any) {
			// Overridden by subclasses
			// -1: Filter not supported, no further serialization
			// 0-7: Filter IDs according to SWF spec
			message.writeInt(-1);
		}

		// JS -> AS Bindings

		// AS -> JS Bindings

		clone(): BitmapFilter {
			return null;
		}

	}

	export class GradientArrays {

		static colors: any [];
		static alphas: any [];
		static ratios: any [];

		// colors null or empty - all empty
		// ratios empty - all empty
		// ratios null and alphas null - length: colors, alphas set to 0, ratios set to 0
		// ratios null and alphas != null - length: colors, alphas filled with 1, ratios set to 0
		// ratios not empty and alphas null - length: min(colors,ratios), alphas set to 0
		// ratios not empty and alphas != null - length: min(colors,ratios), alphas filled with 1
		static sanitize(colors: any [], alphas: any [], ratios: any []) {
			if (isNullOrUndefined(colors) || colors.length === 0) {
				this.colors = [];
				this.alphas = [];
				this.ratios = [];
			} else {
				let len: number;
				if (isNullOrUndefined(ratios)) {
					this.colors = this.sanitizeColors(colors);
					len = this.colors.length;
					this.ratios = this.initArray(len);
					if (isNullOrUndefined(alphas)) {
						this.alphas = this.initArray(len);
					} else {
						this.alphas = this.sanitizeAlphas(alphas, len, len, 1);
					}
				} else {
					if (ratios.length === 0) {
						this.colors = [];
						this.alphas = [];
						this.ratios = [];
					} else {
						len = Math.min(colors.length, ratios.length, 16);
						this.colors = this.sanitizeColors(colors, len);
						this.ratios = this.sanitizeRatios(ratios, len);
						if (isNullOrUndefined(alphas)) {
							this.alphas = this.initArray(len);
						} else {
							this.alphas = this.sanitizeAlphas(alphas, len, len, 1);
						}
					}
				}
			}
		}

		static sanitizeColors(colors: number [], maxLen: number = 16): number [] {
			let arr: number [] = [];
			for (let i = 0, n = Math.min(colors.length, maxLen); i < n; i++) {
				arr[i] = (colors[i] >>> 0) & 0xffffff;
			}
			return arr;
		}

		static sanitizeAlphas(alphas: number [], maxLen: number = 16, minLen: number = 0, value: number = 0): number [] {
			let arr: number [] = [];
			let i, n;
			for (i = 0, n = Math.min(alphas.length, maxLen); i < n; i++) {
				arr[i] = NumberUtilities.clamp(+alphas[i], 0, 1);
			}
			while (i < minLen) {
				arr[i++] = value;
			}
			return arr;
		}

		static sanitizeRatios(ratios: number [], maxLen: number = 16, minLen: number = 0, value: number = 0): number [] {
			let arr: number [] = [];
			let i, n;
			for (i = 0, n = Math.min(ratios.length, maxLen); i < n; i++) {
				arr[i] = NumberUtilities.clamp(+ratios[i], 0, 255);
			}
			while (i < minLen) {
				arr[i++] = value;
			}
			return arr;
		}

		static initArray(len: number, value: number = 0): number [] {
			let arr: number [] = Array(len);
			for (let i = 0; i < len; i++) {
				arr[i] = value;
			}
			return arr;
		}
	}
}

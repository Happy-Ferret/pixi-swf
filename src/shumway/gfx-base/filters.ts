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
	import Rectangle = Geometry.Rectangle;
	import Point = Geometry.Point;
	import Matrix = Geometry.Matrix;
	import DirtyRegion = Geometry.DirtyRegion;
	import clampByte = Shumway.ColorUtilities.clampByte;

	import assert = Shumway.Debug.assert;

	export class Filter {
		public expandBounds(bounds: Rectangle) {
			// NOOP
		}
	}

	let EPS = 0.000000001;
	// Step widths for blur based filters, for quality values 1..15:
	// If we plot the border width added by expandBlurBounds for each blurX (or blurY) value, the
	// step width is the amount of blurX that adds one pixel to the border width. I.e. for quality = 1,
	// the border width increments at blurX = 2, 4, 6, ...
	let blurFilterStepWidths = [
		2,
		1 / 1.05,
		1 / 1.35,
		1 / 1.55,
		1 / 1.75,
		1 / 1.9,
		1 / 2,
		1 / 2.1,
		1 / 2.2,
		1 / 2.3,
		1 / 2.5,
		1 / 3,
		1 / 3,
		1 / 3.5,
		1 / 3.5
	];

	function expandBlurBounds(bounds: Rectangle, quality: number,
	                          blurX: number, blurY: number, isBlurFilter: boolean) {
		let stepWidth = blurFilterStepWidths[quality - 1];
		let bx = blurX;
		let by = blurY;
		if (isBlurFilter) {
			// BlurFilter behaves slightly different from other blur based filters:
			// Given ascending blurX/blurY values, a BlurFilter expands the source rect later than with
			// i.e. GlowFilter. The difference appears to be stepWidth / 4 for all quality values.
			let stepWidth4 = stepWidth / 4;
			bx -= stepWidth4;
			by -= stepWidth4;
		}
		// Calculate horizontal and vertical borders:
		// blurX/blurY values <= 1 are always rounded up to 1, which means that we always expand the
		// source rect, even when blurX/blurY is 0.
		let bh = (Math.ceil((bx < 1 ? 1 : bx) / (stepWidth - EPS)));
		let bv = (Math.ceil((by < 1 ? 1 : by) / (stepWidth - EPS)));
		bounds.x -= bh;
		bounds.w += bh * 2;
		bounds.y -= bv;
		bounds.h += bv * 2;
	}

	export class BlurFilter extends Filter {
		blurX: number;
		blurY: number;
		quality: number;

		constructor(blurX: number, blurY: number, quality: number) {
			super();
			this.blurX = blurX;
			this.blurY = blurY;
			this.quality = quality;
		}

		public expandBounds(bounds: Rectangle) {
			expandBlurBounds(bounds, this.quality, this.blurX, this.blurY, true);
		}
	}

	export class DropshadowFilter extends Filter {
		alpha: number;
		angle: number;
		blurX: number;
		blurY: number;
		color: number;
		distance: number;
		hideObject: boolean;
		inner: boolean;
		knockout: boolean;
		quality: number;
		strength: number;

		constructor(alpha: number, angle: number, blurX: number, blurY: number,
		            color: number, distance: number,
		            hideObject: boolean, inner: boolean, knockout: boolean,
		            quality: number, strength: number) {
			super();
			this.alpha = alpha;
			this.angle = angle;
			this.blurX = blurX;
			this.blurY = blurY;
			this.color = color;
			this.distance = distance;
			this.hideObject = hideObject;
			this.inner = inner;
			this.knockout = knockout;
			this.quality = quality;
			this.strength = strength;
		}

		public expandBounds(bounds: Rectangle) {
			// TODO: Once we support inset drop shadows, bounds don't expand.
			//       For now, they will be rendered as normal drop shadows.
			// if (this.inner) {
			//   return;
			// }
			expandBlurBounds(bounds, this.quality, this.blurX, this.blurY, false);
			if (this.distance) {
				let a = this.angle * Math.PI / 180;
				let dx = Math.cos(a) * this.distance;
				let dy = Math.sin(a) * this.distance;
				let xMin = bounds.x + (dx >= 0 ? 0 : Math.floor(dx));
				let xMax = bounds.x + bounds.w + Math.ceil(Math.abs(dx));
				let yMin = bounds.y + (dy >= 0 ? 0 : Math.floor(dy));
				let yMax = bounds.y + bounds.h + Math.ceil(Math.abs(dy));
				bounds.x = xMin;
				bounds.w = xMax - xMin;
				bounds.y = yMin;
				bounds.h = yMax - yMin;
			}
		}
	}

	export class GlowFilter extends Filter {
		alpha: number;
		blurX: number;
		blurY: number;
		color: number;
		inner: boolean;
		knockout: boolean;
		quality: number;
		strength: number;

		constructor(alpha: number, blurX: number, blurY: number, color: number,
		            inner: boolean, knockout: boolean,
		            quality: number, strength: number) {
			super();
			this.alpha = alpha;
			this.blurX = blurX;
			this.blurY = blurY;
			this.color = color;
			this.inner = inner;
			this.knockout = knockout;
			this.quality = quality;
			this.strength = strength;
		}

		public expandBounds(bounds: Rectangle) {
			if (!this.inner) {
				expandBlurBounds(bounds, this.quality, this.blurX, this.blurY, false);
			}
		}
	}

	export const enum ColorMatrixType {
		Unknown = 0x0000,
		Identity = 0x0001
	}

	export class ColorMatrix extends Filter {
		private _data: Float32Array;
		private _type: ColorMatrixType;

		constructor(data: any) {
			super();
			release || assert(data.length === 20);
			this._data = new Float32Array(data);
			this._type = ColorMatrixType.Unknown;
		}

		public clone(): ColorMatrix {
			let colorMatrix = new ColorMatrix(this._data);
			colorMatrix._type = this._type;
			return colorMatrix;
		}

		public set(other: ColorMatrix) {
			this._data.set(other._data);
			this._type = other._type;
		}

		public toWebGLMatrix(): Float32Array {
			return new Float32Array(this._data);
		}

		public asWebGLMatrix(): Float32Array {
			return this._data.subarray(0, 16);
		}

		public asWebGLVector(): Float32Array {
			return this._data.subarray(16, 20);
		}

		public isIdentity(): boolean {
			if (this._type & ColorMatrixType.Identity) {
				return true;
			}
			let m = this._data;
			return m[0] == 1 && m[1] == 0 && m[2] == 0 && m[3] == 0 &&
				m[4] == 0 && m[5] == 1 && m[6] == 0 && m[7] == 0 &&
				m[8] == 0 && m[9] == 0 && m[10] == 1 && m[11] == 0 &&
				m[12] == 0 && m[13] == 0 && m[14] == 0 && m[15] == 1 &&
				m[16] == 0 && m[17] == 0 && m[18] == 0 && m[19] == 0;
		}

		public static createIdentity(): ColorMatrix {
			let colorMatrix = new ColorMatrix([
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1,
				0, 0, 0, 0
			]);
			colorMatrix._type = ColorMatrixType.Identity;
			return colorMatrix;
		}

		public setMultipliersAndOffsets(redMultiplier: number, greenMultiplier: number, blueMultiplier: number, alphaMultiplier: number,
		                                redOffset: number, greenOffset: number, blueOffset: number, alphaOffset: number) {
			let m: Float32Array = this._data;
			for (let i = 0; i < m.length; i++) {
				m[i] = 0;
			}
			m[0] = redMultiplier;
			m[5] = greenMultiplier;
			m[10] = blueMultiplier;
			m[15] = alphaMultiplier;
			m[16] = redOffset / 255;
			m[17] = greenOffset / 255;
			m[18] = blueOffset / 255;
			m[19] = alphaOffset / 255;
			this._type = ColorMatrixType.Unknown;
		}

		public transformRGBA(rgba: number) {
			let r = (rgba >> 24) & 0xff;
			let g = (rgba >> 16) & 0xff;
			let b = (rgba >> 8) & 0xff;
			let a = rgba & 0xff;

			let m: Float32Array = this._data;
			let R = clampByte(r * m[0] + g * m[1] + b * m[2] + a * m[3] + m[16] * 255);
			let G = clampByte(r * m[4] + g * m[5] + b * m[6] + a * m[7] + m[17] * 255);
			let B = clampByte(r * m[8] + g * m[9] + b * m[10] + a * m[11] + m[18] * 255);
			let A = clampByte(r * m[12] + g * m[13] + b * m[14] + a * m[15] + m[19] * 255);

			return R << 24 | G << 16 | B << 8 | A;
		}

		public multiply(other: ColorMatrix) {
			if (other._type & ColorMatrixType.Identity) {
				return;
			}
			let a = this._data, b = other._data;
			let a00 = a[0 * 4 + 0];
			let a01 = a[0 * 4 + 1];
			let a02 = a[0 * 4 + 2];
			let a03 = a[0 * 4 + 3];
			let a10 = a[1 * 4 + 0];
			let a11 = a[1 * 4 + 1];
			let a12 = a[1 * 4 + 2];
			let a13 = a[1 * 4 + 3];
			let a20 = a[2 * 4 + 0];
			let a21 = a[2 * 4 + 1];
			let a22 = a[2 * 4 + 2];
			let a23 = a[2 * 4 + 3];
			let a30 = a[3 * 4 + 0];
			let a31 = a[3 * 4 + 1];
			let a32 = a[3 * 4 + 2];
			let a33 = a[3 * 4 + 3];
			let a40 = a[4 * 4 + 0];
			let a41 = a[4 * 4 + 1];
			let a42 = a[4 * 4 + 2];
			let a43 = a[4 * 4 + 3];

			let b00 = b[0 * 4 + 0];
			let b01 = b[0 * 4 + 1];
			let b02 = b[0 * 4 + 2];
			let b03 = b[0 * 4 + 3];
			let b10 = b[1 * 4 + 0];
			let b11 = b[1 * 4 + 1];
			let b12 = b[1 * 4 + 2];
			let b13 = b[1 * 4 + 3];
			let b20 = b[2 * 4 + 0];
			let b21 = b[2 * 4 + 1];
			let b22 = b[2 * 4 + 2];
			let b23 = b[2 * 4 + 3];
			let b30 = b[3 * 4 + 0];
			let b31 = b[3 * 4 + 1];
			let b32 = b[3 * 4 + 2];
			let b33 = b[3 * 4 + 3];
			let b40 = b[4 * 4 + 0];
			let b41 = b[4 * 4 + 1];
			let b42 = b[4 * 4 + 2];
			let b43 = b[4 * 4 + 3];

			a[0 * 4 + 0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
			a[0 * 4 + 1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
			a[0 * 4 + 2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
			a[0 * 4 + 3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;
			a[1 * 4 + 0] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
			a[1 * 4 + 1] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
			a[1 * 4 + 2] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
			a[1 * 4 + 3] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;
			a[2 * 4 + 0] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
			a[2 * 4 + 1] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
			a[2 * 4 + 2] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
			a[2 * 4 + 3] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;
			a[3 * 4 + 0] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
			a[3 * 4 + 1] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
			a[3 * 4 + 2] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
			a[3 * 4 + 3] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;

			a[4 * 4 + 0] = a00 * b40 + a10 * b41 + a20 * b42 + a30 * b43 + a40;
			a[4 * 4 + 1] = a01 * b40 + a11 * b41 + a21 * b42 + a31 * b43 + a41;
			a[4 * 4 + 2] = a02 * b40 + a12 * b41 + a22 * b42 + a32 * b43 + a42;
			a[4 * 4 + 3] = a03 * b40 + a13 * b41 + a23 * b42 + a33 * b43 + a43;
			this._type = ColorMatrixType.Unknown;
		}

		public get alphaMultiplier(): number {
			return this._data[15];
		}

		public hasOnlyAlphaMultiplier(): boolean {
			let m = this._data;
			return m[0] == 1 && m[1] == 0 && m[2] == 0 && m[3] == 0 &&
				m[4] == 0 && m[5] == 1 && m[6] == 0 && m[7] == 0 &&
				m[8] == 0 && m[9] == 0 && m[10] == 1 && m[11] == 0 &&
				m[12] == 0 && m[13] == 0 && m[14] == 0 && m[16] == 0 &&
				m[17] == 0 && m[18] == 0 && m[19] == 0;
		}

		public equals(other: ColorMatrix): boolean {
			if (!other) {
				return false;
			} else if (this._type === other._type && this._type === ColorMatrixType.Identity) {
				return true;
			}
			let a = this._data;
			let b = other._data;
			for (let i = 0; i < 20; i++) {
				if (Math.abs(a[i] - b[i]) > 0.001) {
					return false;
				}
			}
			return true;
		}

		public toSVGFilterMatrix(): string {
			let m = this._data;
			return [m[0], m[4], m[8], m[12], m[16],
				m[1], m[5], m[9], m[13], m[17],
				m[2], m[6], m[10], m[14], m[18],
				m[3], m[7], m[11], m[15], m[19]].join(" ");
		}
	}
}

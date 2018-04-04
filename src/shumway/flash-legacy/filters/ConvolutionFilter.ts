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
// Class: ConvolutionFilter
module Shumway.flash.filters {

	export class ConvolutionFilter extends flash.filters.BitmapFilter {

		static axClass: typeof ConvolutionFilter;

		static classInitializer: any = null;

		constructor(matrixX: number = 0, matrixY: number = 0, matrix: Array<number> = null,
		            divisor: number = 1, bias: number = 0, preserveAlpha: boolean = true,
		            clamp: boolean = true, color: number /*uint*/ = 0, alpha: number = 0) {
			super();
			this.matrixX = matrixX;
			this.matrixY = matrixY;
			if (matrix) {
				this.matrix = matrix;
			} else {
				this._matrix = this._expandArray([], this._matrixX * this._matrixY);
			}
			this.divisor = divisor;
			this.bias = bias;
			this.preserveAlpha = preserveAlpha;
			this.clamp = clamp;
			this.color = color;
			this.alpha = alpha;
		}

		private _expandArray(a: number [], newLen: number /*uint*/, value: number = 0): number [] {
			if (a) {
				let i: number = a.length;
				while (i < newLen) {
					a[i++] = 0;
				}
			}
			return a;
		}

		private _matrix: number [];
		private _matrixX: number;
		private _matrixY: number;
		private _divisor: number;
		private _bias: number;
		private _preserveAlpha: boolean;
		private _clamp: boolean;
		private _color: number /*uint*/;
		private _alpha: number;

		get matrix(): Array<number> {
			return this._matrix.slice(0, this._matrixX * this._matrixY);
		}

		set matrix(value_: Array<number>) {
			if (isNullOrUndefined(value_)) {
				this._sec.throwError("TypeError", Errors.NullPointerError, "matrix");
			}
			let value: number[] = value_;
			let actualLen = this._matrixX * this._matrixY;
			let minLen = Math.min(value.length, actualLen);
			let matrix = Array(minLen);
			for (let i = 0; i < minLen; i++) {
				matrix[i] = toNumber(value[i]);
			}
			this._expandArray(matrix, actualLen);
			this._matrix = matrix;
		}

		get matrixX(): number {
			return this._matrixX;
		}

		set matrixX(value: number) {
			let mx: number = NumberUtilities.clamp(+value, 0, 15) | 0;
			if (this._matrixX !== mx) {
				this._matrixX = mx;
				this._expandArray(this._matrix, mx * this._matrixY);
			}
		}

		get matrixY(): number {
			return this._matrixY;
		}

		set matrixY(value: number) {
			let my: number = NumberUtilities.clamp(+value, 0, 15) | 0;
			if (this._matrixY !== my) {
				this._matrixY = my;
				this._expandArray(this._matrix, my * this._matrixX);
			}
		}

		get divisor(): number {
			return this._divisor;
		}

		set divisor(value: number) {
			this._divisor = +value;
		}

		get bias(): number {
			return this._bias;
		}

		set bias(value: number) {
			this._bias = +value;
		}

		get preserveAlpha(): boolean {
			return this._preserveAlpha;
		}

		set preserveAlpha(value: boolean) {
			this._preserveAlpha = !!value;
		}

		get clamp(): boolean {
			return this._clamp;
		}

		set clamp(value: boolean) {
			this._clamp = !!value;
		}

		get color(): number /*uint*/ {
			return this._color;
		}

		set color(value: number /*uint*/) {
			this._color = value >>> 0;
		}

		get alpha(): number {
			return this._alpha;
		}

		set alpha(value: number) {
			this._alpha = NumberUtilities.clamp(+value, 0, 1);
		}

		clone(): BitmapFilter {
			return this._sec.filters.ConvolutionFilter.create([
				this._matrixX,
				this._matrixY,
				this.matrix,
				this._divisor,
				this._bias,
				this._preserveAlpha,
				this._clamp,
				this._color,
				this._alpha
			]);
		}
	}
}

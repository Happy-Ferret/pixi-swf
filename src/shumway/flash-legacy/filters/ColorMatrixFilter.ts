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
// Class: ColorMatrixFilter
module Shumway.flash.filters {

	export class ColorMatrixFilter extends flash.filters.BitmapFilter {
		constructor(matrix: Array<number> = null) {
			super();
			if (matrix) {
				this.matrix = matrix;
			} else {
				this._matrix = [
					1, 0, 0, 0, 0,
					0, 1, 0, 0, 0,
					0, 0, 1, 0, 0,
					0, 0, 0, 1, 0
				];
			}
		}

		_serialize(message: any) {
			let matrix = this._matrix;
			message.ensureAdditionalCapacity((matrix.length + 1) * 4);
			message.writeIntUnsafe(6);
			for (let i: number = 0; i < matrix.length; i++) {
				message.writeFloatUnsafe(matrix[i]);
			}
		}

		_matrix: Array<number>;

		get matrix(): Array<number> {
			return this._matrix.concat();
		}

		set matrix(value_: Array<number>) {
			if (isNullOrUndefined(value_)) {
				this._sec.throwError("TypeError", Errors.NullPointerError, "matrix");
			}
			let matrix = [
				0, 0, 0, 0, 0,
				0, 0, 0, 0, 0,
				0, 0, 0, 0, 0,
				0, 0, 0, 0, 0
			];
			const value = value_;
			for (let i = 0, n = Math.min(value.length, 20); i < n; i++) {
				matrix[i] = toNumber(value[i]);
			}
			this._matrix = matrix;
		}

		clone(): BitmapFilter {
			return this._sec.filters.ColorMatrixFilter.create([this.matrix]);
		}
	}
}

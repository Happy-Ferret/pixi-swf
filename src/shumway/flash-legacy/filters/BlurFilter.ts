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
// Class: BlurFilter
module Shumway.flash.filters {

	import Rectangle = flash.geom.Rectangle;

	export class BlurFilter extends flash.filters.BitmapFilter {
		constructor(blurX: number = 4, blurY: number = 4, quality: number /*int*/ = 1) {
			super();
			this.blurX = blurX;
			this.blurY = blurY;
			this.quality = quality;
		}

		_updateFilterBounds(bounds: Rectangle) {
			BitmapFilter._updateBlurBounds(bounds, this._blurX, this._blurY, this._quality, true);
		}

		_serialize(message: any) {
			message.ensureAdditionalCapacity(16);
			message.writeIntUnsafe(1);
			message.writeFloatUnsafe(this._blurX);
			message.writeFloatUnsafe(this._blurY);
			message.writeIntUnsafe(this._quality);
		}

		// JS -> AS Bindings

		// AS -> JS Bindings

		private _blurX: number;
		private _blurY: number;
		private _quality: number /*int*/;

		get blurX(): number {
			return this._blurX;
		}

		set blurX(value: number) {
			this._blurX = NumberUtilities.clamp(+value, 0, 255);
		}

		get blurY(): number {
			return this._blurY;
		}

		set blurY(value: number) {
			this._blurY = NumberUtilities.clamp(+value, 0, 255);
		}

		get quality(): number /*int*/ {
			return this._quality;
		}

		set quality(value: number /*int*/) {
			this._quality = NumberUtilities.clamp(value | 0, 0, 15);
		}

		clone(): BitmapFilter {
			return this._sec.filters.BlurFilter.create([this._blurX, this._blurY,
				this._quality]);
		}
	}
}

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
// Class: InterpolationMethod
module Shumway.flash.display {
	import GradientInterpolationMethod = Shumway.GradientInterpolationMethod;

	export enum InterpolationMethod {
		RGB = "rgb",
		LINEAR_RGB = "linearRGB",
	}

	export namespace InterpolationMethod {
		// AS -> JS Bindings
		export function fromNumber(n: number): string {
			switch (n) {
				case GradientInterpolationMethod.RGB:
					return InterpolationMethod.RGB;
				case GradientInterpolationMethod.LinearRGB:
					return InterpolationMethod.LINEAR_RGB;
				default:
					return null;
			}
		}

		export function toNumber(value: string): number {
			switch (value) {
				case InterpolationMethod.RGB:
					return GradientInterpolationMethod.RGB;
				case InterpolationMethod.LINEAR_RGB:
					return GradientInterpolationMethod.LinearRGB;
				default:
					return -1;
			}
		}
	}
}

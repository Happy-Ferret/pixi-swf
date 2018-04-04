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
// Class: GradientType
module Shumway.flash.display {
	export enum GradientType {
		LINEAR = "linear",
		RADIAL = "radial",

	}

	export namespace GradientType {
		export function fromNumber(n: number): string {
			switch (n) {
				case Shumway.GradientType.Linear:
					return GradientType.LINEAR;
				case Shumway.GradientType.Radial:
					return GradientType.RADIAL;
				default:
					return null;
			}
		}

		export function toNumber(value: string): number {
			switch (value) {
				case GradientType.LINEAR:
					return Shumway.GradientType.Linear;
				case GradientType.RADIAL:
					return Shumway.GradientType.Radial;
				default:
					return -1;
			}
		}
	}
}

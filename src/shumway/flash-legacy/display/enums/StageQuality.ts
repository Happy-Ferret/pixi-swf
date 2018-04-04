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
// Class: StageQuality
module Shumway.flash.display {
	export enum StageQuality {
		LOW = "low",
		MEDIUM = "medium",
		HIGH = "high",
		BEST = "best",
		HIGH_8X8 = "8x8",
		HIGH_8X8_LINEAR = "8x8linear",
		HIGH_16X16 = "16x16",
		HIGH_16X16_LINEAR = "16x16linear",

	}

	export namespace StageQuality {
		export function fromNumber(n: number): string {
			switch (n) {
				case 0:
					return StageQuality.LOW;
				case 1:
					return StageQuality.MEDIUM;
				case 2:
					return StageQuality.HIGH;
				case 3:
					return StageQuality.BEST;
				case 4:
					return StageQuality.HIGH_8X8;
				case 5:
					return StageQuality.HIGH_8X8_LINEAR;
				case 6:
					return StageQuality.HIGH_16X16;
				case 7:
					return StageQuality.HIGH_16X16_LINEAR;
				default:
					return null;
			}
		}

		export function toNumber(value: string): number {
			switch (value) {
				case StageQuality.LOW:
					return 0;
				case StageQuality.MEDIUM:
					return 1;
				case StageQuality.HIGH:
					return 2;
				case StageQuality.BEST:
					return 3;
				case StageQuality.HIGH_8X8:
					return 4;
				case StageQuality.HIGH_8X8_LINEAR:
					return 5;
				case StageQuality.HIGH_16X16:
					return 6;
				case StageQuality.HIGH_16X16_LINEAR:
					return 7;
				default:
					return -1;
			}
		}
	}
}

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
// Class: CapsStyle
module Shumway.flash.display {
	export enum CapsStyle {
		// JS -> AS Bindings
		ROUND = "round",
		NONE = "none",
		SQUARE = "square",
		// AS -> JS Bindings
	}

	export namespace CapsStyle {
		export function fromNumber(n: number): string {
			switch (n) {
				case 0:
					return CapsStyle.ROUND;
				case 1:
					return CapsStyle.NONE;
				case 2:
					return CapsStyle.SQUARE;
				default:
					return null;
			}
		}

		export function toNumber(value: string): number {
			switch (value) {
				case CapsStyle.ROUND:
					return 0;
				case CapsStyle.NONE:
					return 1;
				case CapsStyle.SQUARE:
					return 2;
				default:
					return -1;
			}
		}
	}
}

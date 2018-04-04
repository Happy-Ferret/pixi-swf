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
// Class: LineScaleMode
module Shumway.flash.display {
	export enum LineScaleMode {
		NORMAL = "normal",
		VERTICAL = "vertical",
		HORIZONTAL = "horizontal",
		NONE = "none"
	}

	export namespace LineScaleMode {
		export function fromNumber(n: number): string {
			switch (n) {
				case 0:
					return LineScaleMode.NONE;
				case 1:
					return LineScaleMode.NORMAL;
				case 2:
					return LineScaleMode.VERTICAL;
				case 3:
					return LineScaleMode.HORIZONTAL;
				default:
					return null;
			}
		}

		export function toNumber(value: string): number {
			switch (value) {
				case LineScaleMode.NONE:
					return 0;
				case LineScaleMode.NORMAL:
					return 1;
				case LineScaleMode.VERTICAL:
					return 2;
				case LineScaleMode.HORIZONTAL:
					return 3;
				default:
					return -1;
			}
		}
	}
}

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
// Class: MouseCursor
module Shumway.flash.ui {
	export enum MouseCursor {
		AUTO = "auto",
		ARROW = "arrow",
		BUTTON = "button",
		HAND = "hand",
		IBEAM = "ibeam"
	}

	export namespace MouseCursor {
		export function fromNumber(n: number): string {
			switch (n) {
				case 0:
					return MouseCursor.AUTO;
				case 1:
					return MouseCursor.ARROW;
				case 2:
					return MouseCursor.BUTTON;
				case 3:
					return MouseCursor.HAND;
				case 4:
					return MouseCursor.IBEAM;
				default:
					return null;
			}
		}

		export function toNumber(value: string): number {
			switch (value) {
				case MouseCursor.AUTO:
					return 0;
				case MouseCursor.ARROW:
					return 1;
				case MouseCursor.BUTTON:
					return 2;
				case MouseCursor.HAND:
					return 3;
				case MouseCursor.IBEAM:
					return 4;
				default:
					return -1;
			}
		}
	}
}

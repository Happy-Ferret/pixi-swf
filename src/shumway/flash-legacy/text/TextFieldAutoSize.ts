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
// Class: TextFieldAutoSize
module Shumway.flash.text {
	export enum TextFieldAutoSize {
		NONE = "none",
		LEFT = "left",
		CENTER = "center",
		RIGHT = "right"
	}

	export namespace TextFieldAutoSize {
		export function fromNumber(n: number): string {
			switch (n) {
				case 0:
					return TextFieldAutoSize.NONE;
				case 1:
					return TextFieldAutoSize.CENTER;
				case 2:
					return TextFieldAutoSize.LEFT;
				case 3:
					return TextFieldAutoSize.RIGHT;
				default:
					return null;
			}
		}

		export function toNumber(value: string): number {
			switch (value) {
				case TextFieldAutoSize.NONE:
					return 0;
				case TextFieldAutoSize.CENTER:
					return 1;
				case TextFieldAutoSize.LEFT:
					return 2;
				case TextFieldAutoSize.RIGHT:
					return 3;
				default:
					return -1;
			}
		}
	}
}

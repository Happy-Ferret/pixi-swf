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
// Class: TextFormatAlign
module Shumway.flash.text {
	export enum TextFormatAlign {
		LEFT = "left",
		CENTER = "center",
		RIGHT = "right",
		JUSTIFY = "justify",
		START = "start",
		END = "end"
	}

	export namespace TextFormatAlign {

		export function fromNumber(n: number): string {
			switch (n) {
				case 0:
					return TextFormatAlign.LEFT;
				case 1:
					return TextFormatAlign.RIGHT;
				case 2:
					return TextFormatAlign.CENTER;
				case 3:
					return TextFormatAlign.JUSTIFY;
				case 4:
					return TextFormatAlign.START;
				case 5:
					return TextFormatAlign.END;
				default:
					return null;
			}
		}

		export function toNumber(value: string): number {
			switch (value) {
				case TextFormatAlign.LEFT:
					return 0;
				case TextFormatAlign.RIGHT:
					return 1;
				case TextFormatAlign.CENTER:
					return 2;
				case TextFormatAlign.JUSTIFY:
					return 3;
				case TextFormatAlign.START:
					return 4;
				case TextFormatAlign.END:
					return 5;
				default:
					return -1;
			}
		}
	}
}

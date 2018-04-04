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
// Class: BlendMode
module Shumway.flash.display {
	export enum BlendMode {
		// JS -> AS Bindings
		NORMAL = "normal",
		LAYER = "layer",
		MULTIPLY = "multiply",
		SCREEN = "screen",
		LIGHTEN = "lighten",
		DARKEN = "darken",
		ADD = "add",
		SUBTRACT = "subtract",
		DIFFERENCE = "difference",
		INVERT = "invert",
		OVERLAY = "overlay",
		HARDLIGHT = "hardlight",
		ALPHA = "alpha",
		ERASE = "erase",
		SHADER = "shader",
	}

	export namespace BlendMode {
		/**
		 * Returns the blend mode string from the numeric value that appears in the
		 * swf file.
		 */
		export function fromNumber(n: number): string {
			switch (n) {
				case 0:
				case 1:
					return BlendMode.NORMAL;
				case 2:
					return BlendMode.LAYER;
				case 3:
					return BlendMode.MULTIPLY;
				case 4:
					return BlendMode.SCREEN;
				case 5:
					return BlendMode.LIGHTEN;
				case 6:
					return BlendMode.DARKEN;
				case 7:
					return BlendMode.DIFFERENCE;
				case 8:
					return BlendMode.ADD;
				case 9:
					return BlendMode.SUBTRACT;
				case 10:
					return BlendMode.INVERT;
				case 11:
					return BlendMode.ALPHA;
				case 12:
					return BlendMode.ERASE;
				case 13:
					return BlendMode.OVERLAY;
				case 14:
					return BlendMode.HARDLIGHT;
				default:
					return null;
			}
		}

		export function toNumber(value: string): number {
			switch (value) {
				case BlendMode.NORMAL:
					return 1;
				case BlendMode.LAYER:
					return 2;
				case BlendMode.MULTIPLY:
					return 3;
				case BlendMode.SCREEN:
					return 4;
				case BlendMode.LIGHTEN:
					return 5;
				case BlendMode.DARKEN:
					return 6;
				case BlendMode.DIFFERENCE:
					return 7;
				case BlendMode.ADD:
					return 8;
				case BlendMode.SUBTRACT:
					return 9;
				case BlendMode.INVERT:
					return 10;
				case BlendMode.ALPHA:
					return 11;
				case BlendMode.ERASE:
					return 12;
				case BlendMode.OVERLAY:
					return 13;
				case BlendMode.HARDLIGHT:
					return 14;
				default:
					return -1;
			}
		}
	}
}

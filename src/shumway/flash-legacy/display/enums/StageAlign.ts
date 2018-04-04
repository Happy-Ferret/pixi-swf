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
// Class: StageAlign
module Shumway.flash.display {
	import StageAlignFlags = Shumway.Remoting.StageAlignFlags;

	export enum StageAlign {
		// JS -> AS Bindings
		TOP = "T",
		LEFT = "L",
		BOTTOM = "B",
		RIGHT = "R",
		TOP_LEFT = "TL",
		TOP_RIGHT = "TR",
		BOTTOM_LEFT = "BL",
		BOTTOM_RIGHT = "BR",
	}

	export namespace StageAlign {
		export function fromNumber(n: number): string {
			if (n === 0) {
				return "";
			}
			let s = "";
			if ((n & StageAlignFlags.Top) !== 0) {
				s += "T";
			}
			if ((n & StageAlignFlags.Bottom) !== 0) {
				s += "B";
			}
			if ((n & StageAlignFlags.Left) !== 0) {
				s += "L";
			}
			if ((n & StageAlignFlags.Right) !== 0) {
				s += "R";
			}
			return s;
		}

		/**
		 * Looks like the Flash player just searches for the "T", "B", "L", "R" characters and
		 * maintains an internal bit field for alignment, for instance it's possible to set the
		 * alignment value "TBLR" even though there is no enum for it.
		 */
		export function toNumber(value: string): number {
			let n = 0;
			value = value.toUpperCase();
			if (value.indexOf("T") >= 0) {
				n |= StageAlignFlags.Top;
			}
			if (value.indexOf("B") >= 0) {
				n |= StageAlignFlags.Bottom;
			}
			if (value.indexOf("L") >= 0) {
				n |= StageAlignFlags.Left;
			}
			if (value.indexOf("R") >= 0) {
				n |= StageAlignFlags.Right;
			}
			return n;
		}
	}
}

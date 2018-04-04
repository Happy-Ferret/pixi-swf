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
// Class: JointStyle
module Shumway.flash.display {
	export enum JointStyle {
		ROUND = "round",
		BEVEL = "bevel",
		MITER = "miter"
	}

	export namespace JointStyle {
		export function fromNumber(n: number) {
			switch (n) {
				case 0:
					return JointStyle.ROUND;
				case 1:
					return JointStyle.BEVEL;
				case 2:
					return JointStyle.MITER;
				default:
					return null;
			}
		}

		export function toNumber(value: string): number {
			switch (value) {
				case JointStyle.ROUND:
					return 0;
				case JointStyle.BEVEL:
					return 1;
				case JointStyle.MITER:
					return 2;
				default:
					return -1;
			}
		}
	}
}

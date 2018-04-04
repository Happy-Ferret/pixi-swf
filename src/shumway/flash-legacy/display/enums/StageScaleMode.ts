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
// Class: StageScaleMode
module Shumway.flash.display {
	export namespace StageScaleMode {
		export function fromNumber(n: number): string {
			switch (n) {
				case Remoting.StageScaleMode.ShowAll:
					return StageScaleMode.SHOW_ALL;
				case Remoting.StageScaleMode.ExactFit:
					return StageScaleMode.EXACT_FIT;
				case Remoting.StageScaleMode.NoBorder:
					return StageScaleMode.NO_BORDER;
				case Remoting.StageScaleMode.NoScale:
					return StageScaleMode.NO_SCALE;
				default:
					return null;
			}
		}

		export function toNumber(value: string): number {
			switch (value.toLowerCase()) {
				case StageScaleMode.SHOW_ALL_LOWERCASE:
					return Remoting.StageScaleMode.ShowAll;
				case StageScaleMode.EXACT_FIT_LOWERCASE:
					return Remoting.StageScaleMode.ExactFit;
				case StageScaleMode.NO_BORDER_LOWERCASE:
					return Remoting.StageScaleMode.NoBorder;
				case StageScaleMode.NO_SCALE_LOWERCASE:
					return Remoting.StageScaleMode.NoScale;
				default:
					return -1;
			}
		}
	}

	export enum StageScaleMode {
		SHOW_ALL = "showAll",
		EXACT_FIT = "exactFit",
		NO_BORDER = "noBorder",
		NO_SCALE = "noScale",

		SHOW_ALL_LOWERCASE = "showall",
		EXACT_FIT_LOWERCASE = "exactfit",
		NO_BORDER_LOWERCASE = "noborder",
		NO_SCALE_LOWERCASE = "noscale"
	}
}

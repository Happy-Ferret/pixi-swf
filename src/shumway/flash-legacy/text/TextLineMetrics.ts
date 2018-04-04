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
// Class: TextLineMetrics
module Shumway.flash.text {
	export class TextLineMetrics extends LegacyEntity {
		constructor(x: number, width: number, height: number, ascent: number, descent: number,
		            leading: number) {
			super();
			this.x = +x;
			this.width = +width;
			this.height = +height;
			this.ascent = +ascent;
			this.descent = +descent;
			this.leading = +leading;
		}

		// JS -> AS Bindings
		x: number;
		width: number;
		height: number;
		ascent: number;
		descent: number;
		leading: number;
	}
}

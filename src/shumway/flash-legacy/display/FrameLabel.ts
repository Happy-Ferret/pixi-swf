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
// Class: FrameLabel
module Shumway.flash.display {
	export class FrameLabel extends flash.events.EventDispatcher {
		constructor(name: string, frame: number /*int*/) {
			super();
			this._name = name;
			this._frame = frame | 0;
		}

		private _name: string;
		private _frame: number /*int*/;

		get name(): string {
			return this._name;
		}

		get frame(): number /*int*/ {
			return this._frame;
		}

		clone() {
			return this._sec.display.FrameLabel.create([this._name, this._frame]);
		}
	}
}

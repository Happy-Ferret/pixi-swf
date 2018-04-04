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
// Class: SetIntervalTimer
module Shumway.flash.utils {
	export class SetIntervalTimer extends flash.utils.Timer {
		constructor(closure: Function, delay: number, repeats: boolean, rest: Array<any>) {
			super(+delay, !!repeats ? 0 : 1);
			closure = closure;
			rest = rest;
		}

		// JS -> AS Bindings
		static intervalArray: Array<any>;
		static _clearInterval: (id: number /*uint*/) => void;

		reference: number /*uint*/;
		closure: Function;
		rest: Array<any>;
		onTimer: (event: flash.events.Event) => void;
	}
}

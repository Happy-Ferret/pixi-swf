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
// Class: Responder
module Shumway.flash.net {
	export class Responder extends LegacyEntity {
		constructor(result: Function, status: Function = null) {
			super();
		}

		private _result: Function;
		private _status: Function;

		// JS -> AS Bindings


		// AS -> JS Bindings

		ctor(result: Function, status: Function): void {
			this._result = result;
			this._status = status;
		}
	}
}

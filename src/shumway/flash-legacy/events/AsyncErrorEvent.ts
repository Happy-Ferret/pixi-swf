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
// Class: AsyncErrorEvent
module Shumway.flash.events {
	export class AsyncErrorEvent extends flash.events.ErrorEvent {
		error: system.LegacyError;

		constructor(type: string, bubbles: boolean = false, cancelable: boolean = false,
		            text: string = "", error: system.LegacyError = null) {
			super(type, bubbles, cancelable, text);
			this.error = error;
		}

		clone(): Event {
			return this._sec.events.AsyncErrorEvent.create([this._type, this._bubbles, this._cancelable,
				this._text, this.error]);
		}

		toString(): string {
			return this.formatToString('AsyncErrorEvent', 'type', 'bubbles', 'cancelable', 'eventPhase',
				'text', 'error');
		}
	}
}

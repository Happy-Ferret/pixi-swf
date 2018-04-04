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
// Class: ProgressEvent
module Shumway.flash.events {
	export class ProgressEvent extends Event {
		constructor(type: string, bubbles: boolean = false, cancelable: boolean = false,
		            bytesLoaded: number = 0, bytesTotal: number = 0) {
			super(type, bubbles, cancelable);
			this._bytesLoaded = bytesLoaded;
			this._bytesTotal = bytesTotal;
		}

		// JS -> AS Bindings
		static PROGRESS: string = "progress";
		static SOCKET_DATA: string = "socketData";

		private _bytesLoaded: number;
		private _bytesTotal: number;

		public get bytesLoaded(): number {
			return this._bytesLoaded;
		}

		public set bytesLoaded(value: number) {
			this._bytesLoaded = value;
		}

		public get bytesTotal(): number {
			return this._bytesTotal;
		}

		public set bytesTotal(value: number) {
			this._bytesTotal = value;
		}

		public clone(): Event {
			return this._sec.events.ProgressEvent.create([this._type, this._bubbles,
				this._cancelable, this._bytesLoaded,
				this._bytesTotal]);
		}

		public toString(): string {
			return this.formatToString('ProgressEvent', 'bubbles', 'cancelable', 'eventPhase',
				'bytesLoaded', 'bytesTotal');
		}
	}
}

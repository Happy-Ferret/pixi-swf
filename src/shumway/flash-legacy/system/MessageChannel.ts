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
// Class: MessageChannel
module Shumway.flash.system {
	import notImplemented = Shumway.Debug.notImplemented;

	export class MessageChannel extends flash.events.EventDispatcher {
		constructor() {
			super();
		}

		// addEventListener: (type: string, listener: ASFunction, useCapture: boolean = false, priority: number /*int*/ = 0, useWeakReference: boolean = false) => void;
		// removeEventListener: (type: string, listener: ASFunction, useCapture: boolean = false) => void;

		// AS -> JS Bindings

		// _messageAvailable: boolean;
		// _state: string;
		get messageAvailable(): boolean {
			release || notImplemented("public flash.system.MessageChannel::get messageAvailable");
			return false;
			// return this._messageAvailable;
		}

		get state(): string {
			release || notImplemented("public flash.system.MessageChannel::get state");
			return "";
			// return this._state;
		}

		send(arg: any, queueLimit: number /*int*/ = -1): void {
			queueLimit = queueLimit | 0;
			release || notImplemented("public flash.system.MessageChannel::send");
			return;
		}

		receive(blockUntilReceived: boolean = false): any {
			blockUntilReceived = !!blockUntilReceived;
			release || notImplemented("public flash.system.MessageChannel::receive");
			return;
		}

		close(): void {
			release || notImplemented("public flash.system.MessageChannel::close");
			return;
		}
	}
}

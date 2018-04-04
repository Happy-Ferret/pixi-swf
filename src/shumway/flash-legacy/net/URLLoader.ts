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
// Class: URLLoader
module Shumway.flash.net {
	import Event = flash.events.Event;
	import IOErrorEvent = flash.events.IOErrorEvent;
	import ProgressEvent = flash.events.ProgressEvent;
	import HTTPStatusEvent = flash.events.HTTPStatusEvent;
	import SecurityErrorEvent = flash.events.SecurityErrorEvent;

	export class URLLoader extends flash.events.EventDispatcher {
		constructor(request?: flash.net.URLRequest) {
			super();
			let stream = this._stream = this._sec.net.URLStream.create();

			stream.addEventListener(Event.OPEN, this.onStreamOpen.bind(this));
			stream.addEventListener(Event.COMPLETE, this.onStreamComplete.bind(this));
			stream.addEventListener(ProgressEvent.PROGRESS, this.onStreamProgress.bind(this));
			stream.addEventListener(IOErrorEvent.IO_ERROR, this.onStreamIOError.bind(this));
			stream.addEventListener(HTTPStatusEvent.HTTP_STATUS, this.onStreamHTTPStatus.bind(this));
			stream.addEventListener(HTTPStatusEvent.HTTP_RESPONSE_STATUS,
				this.onStreamHTTPResponseStatus.bind(this));
			stream.addEventListener(SecurityErrorEvent.SECURITY_ERROR,
				this.onStreamSecurityError.bind(this));

			this._dataFormat = 'text';

			if (request) {
				this.load(request);
			}
		}

		_data: any;
		_dataFormat: string;
		_bytesLoaded: number /*uint*/;
		_bytesTotal: number /*uint*/;

		get data() {
			return this._data;
		}

		get dataFormat() {
			return this._dataFormat;
		}

		set dataFormat(format: string) {
			release || Debug.assert(typeof format === 'string');
			this._dataFormat = format;
		}

		get bytesLoaded() {
			return this._bytesLoaded;
		}

		get bytesTotal() {
			return this._bytesTotal;
		}

		private _stream: flash.net.URLStream;
		private _httpResponseEventBound: boolean;
		_ignoreDecodeErrors: boolean;

		load(request: URLRequest) {
			this._stream.load(request);
		}

		close() {
			this._stream.close();
		}

		complete() {
			let response = this._sec.utils.ByteArray.create();
			this._stream.readBytes(response);

			if (this._dataFormat === 'binary') {
				this._data = response;
				return;
			}

			let data = response.toString();
			if (response.length > 0 && this._dataFormat === 'variables') {
				let variable: URLVariables = this._sec.net.URLVariables.create();
				if (this._ignoreDecodeErrors) {
					variable._ignoreDecodingErrors = true;
				}
				variable.decode(String(data));
				this._data = variable;
			} else {
				this._data = data;
			}
		}

		addEventListener(type: string, listener: (event: Event) => void, useCapture?: boolean,
		                 priority?: number, useWeakReference?: boolean): void {
			super.addEventListener(type, listener, useCapture, priority, useWeakReference);

			// Looks like there is some bug related to the HTTP_RESPONSE_STATUS
			if (type === HTTPStatusEvent.HTTP_RESPONSE_STATUS) {
				this._httpResponseEventBound = true;
			}
		}

		private onStreamOpen(e: Event) {
			this.dispatchEvent(e);
		}

		private onStreamComplete(e: Event) {
			this.complete();
			this.dispatchEvent(e);
		}

		private onStreamProgress(e: ProgressEvent) {
			this._bytesLoaded = e.bytesLoaded;
			this._bytesTotal = e.bytesTotal;
			this.dispatchEvent(e);
		}

		private onStreamIOError(e: IOErrorEvent) {
			this.complete();
			this.dispatchEvent(e);
		}

		private onStreamHTTPStatus(e: HTTPStatusEvent) {
			this.dispatchEvent(e);
		}

		private onStreamHTTPResponseStatus(e: HTTPStatusEvent) {
			if (!this._httpResponseEventBound) {
				return;
			}
			this.dispatchEvent(e);
		}

		private onStreamSecurityError(e: SecurityErrorEvent) {
			this.dispatchEvent(e);
		}
	}
}

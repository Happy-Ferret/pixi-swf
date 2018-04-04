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
/// <reference path='../references.ts'/>
module Shumway.flash.net {
	import notImplemented = Shumway.Debug.notImplemented;
	import FileLoadingService = Shumway.FileLoadingService;

	export class URLStream extends flash.events.EventDispatcher implements flash.utils.IDataInput {
		constructor() {
			super();
			this._buffer = this._sec.utils.ByteArray.create();
			this._writePosition = 0;
			this._connected = false;
		}

		private _buffer: utils.ByteArray;
		private _writePosition: number;
		private _session: FileLoadingSession;

		private _connected: boolean;

		// _diskCacheEnabled: boolean;
		get connected(): boolean {
			return this._connected;
		}

		get bytesAvailable(): number /*uint*/ {
			return this._buffer.length - this._buffer.position;
		}

		get objectEncoding(): number /*uint*/ {
			return this._buffer.objectEncoding;
		}

		set objectEncoding(version: number /*uint*/) {
			version = version >>> 0;
			this._buffer.objectEncoding = version;
		}

		get endian(): string {
			return this._buffer.endian;
		}

		set endian(type: string) {
			this._buffer.endian = type;
		}

		get diskCacheEnabled(): boolean {
			release || notImplemented("public flash.net.URLStream::get diskCacheEnabled");
			return false;
			// return this._diskCacheEnabled;
		}

		get position(): number {
			return this._buffer.position;
		}

		set position(offset: number) {
			offset = +offset;
			this._buffer.position = offset;
		}

		get length(): number {
			return this._buffer.length;
		}

		load(request: flash.net.URLRequest): void {
			let Event = flash.events.Event;
			let IOErrorEvent = flash.events.IOErrorEvent;
			let ProgressEvent = flash.events.ProgressEvent;
			let HTTPStatusEvent = flash.events.HTTPStatusEvent;

			let session = FileLoadingService.instance.createSession();
			let self = this;
			let initStream = true;
			let eventsPackage = this._sec.events;
			session.onprogress = function (data, progressState) {
				let readPosition = self._buffer.position;
				self._buffer.position = self._writePosition;
				self._buffer.writeRawBytes(data);
				self._writePosition = self._buffer.position;
				self._buffer.position = readPosition;

				self.dispatchEvent(eventsPackage.ProgressEvent.create([ProgressEvent.PROGRESS, false, false,
					progressState.bytesLoaded,
					progressState.bytesTotal]));
			};
			session.onerror = function (error) {
				self._connected = false;
				self.dispatchEvent(eventsPackage.IOErrorEvent.create([IOErrorEvent.IO_ERROR, false, false,
					error]));
				let isXDomainError = typeof error === 'string' && error.indexOf('XDOMAIN') >= 0;
				Telemetry.instance.reportTelemetry({
					topic: 'loadResource',
					resultType: isXDomainError ? Telemetry.LoadResource.StreamCrossdomain :
						Telemetry.LoadResource.StreamDenied
				});
			};
			session.onopen = function () {
				self._connected = true;
				self.dispatchEvent(eventsPackage.Event.create([Event.OPEN, false, false]));
				Telemetry.instance.reportTelemetry({
					topic: 'loadResource',
					resultType: Telemetry.LoadResource.StreamAllowed
				});
			};
			session.onhttpstatus = function (location: string, httpStatus: number, httpHeaders: any) {
				let httpStatusEvent = eventsPackage.HTTPStatusEvent.create([HTTPStatusEvent.HTTP_STATUS, false,
					false, httpStatus]);
				let headers: Array<any> = [];
				httpHeaders.split(/(?:\n|\r?\n)/g).forEach(function (h: any) {
					let m = /^([^:]+): (.*)$/.exec(h);
					if (m) {
						headers.push(self._sec.net.URLRequestHeader.create([m[1], m[2]]));
						if (m[1] === 'Location') { // Headers have redirect location
							location = m[2];
						}
					}
				});
				httpStatusEvent.responseHeaders = headers;
				httpStatusEvent.responseURL = location;
				self.dispatchEvent(httpStatusEvent);
			};
			session.onclose = function () {
				self._connected = false;
				self.dispatchEvent(eventsPackage.Event.create([Event.COMPLETE, false, false]));
			};
			session.open(request._toFileRequest());
			this._session = session;
		}

		readBytes(bytes: flash.utils.ByteArray, offset: number /*uint*/ = 0, length: number /*uint*/ = 0): void {
			offset = offset >>> 0;
			length = length >>> 0;
			if (length < 0) {
				this._sec.throwError('ArgumentError', Errors.InvalidArgumentError, "length");
			}

			this._buffer.readBytes(bytes, offset, length);
		}

		readBoolean(): boolean {
			release || notImplemented("public flash.net.URLStream::readBoolean");
			return false;
		}

		readByte(): number /*int*/ {
			return this._buffer.readByte();
		}

		readUnsignedByte(): number /*uint*/ {
			release || notImplemented("public flash.net.URLStream::readUnsignedByte");
			return 0;
		}

		readShort(): number /*int*/ {
			release || notImplemented("public flash.net.URLStream::readShort");
			return 0;
		}

		readUnsignedShort(): number /*uint*/ {
			return this._buffer.readUnsignedShort();
		}

		readUnsignedInt(): number /*uint*/ {
			release || notImplemented("public flash.net.URLStream::readUnsignedInt");
			return 0;
		}

		readInt(): number /*int*/ {
			release || notImplemented("public flash.net.URLStream::readInt");
			return 0;
		}

		readFloat(): number {
			release || notImplemented("public flash.net.URLStream::readFloat");
			return 0;
		}

		readDouble(): number {
			release || notImplemented("public flash.net.URLStream::readDouble");
			return 0;
		}

		readMultiByte(length: number /*uint*/, charSet: string): string {
			length = length >>> 0;
			charSet = charSet;
			release || notImplemented("public flash.net.URLStream::readMultiByte");
			return "";
		}

		readUTF(): string {
			return this._buffer.readUTF();
		}

		readUTFBytes(length: number /*uint*/): string {
			return this._buffer.readUTFBytes(length);
		}

		close(): void {
			if (this._session) {
				this._session.close();
			}
		}

		readObject(): any {
			release || notImplemented("public flash.net.URLStream::readObject");
			return;
		}

		stop(): void {
			release || notImplemented("public flash.net.URLStream::stop");
			return;
		}
	}
}

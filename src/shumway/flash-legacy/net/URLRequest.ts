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
// Class: URLRequest
module Shumway.flash.net {
	export class URLRequest extends LegacyEntity {
		constructor(url: string = null) {
			super();
			this._url = url;
			this._method = 'GET';
			this._data = null;
			this._digest = null;
			this._contentType = 'application/x-www-form-urlencoded';
			this._requestHeaders = [];
			this._checkPolicyFile = true;
		}

		_checkPolicyFile: boolean;

		// JS -> AS Bindings

		// AS -> JS Bindings

		private _url: string;
		private _data: any;
		private _method: string;
		private _contentType: string;
		private _requestHeaders: any [];
		private _digest: string;

		get url(): string {
			return this._url;
		}

		set url(value: string) {
			this._url = value;
		}

		get data(): any {
			return this._data;
		}

		set data(value: any) {
			this._data = value;
		}

		get method(): string {
			return this._method;
		}

		set method(value: string) {
			if (value !== 'get' && value !== 'GET' &&
				value !== 'post' && value !== 'POST') {
				this._sec.throwError('ArgumentError', Errors.InvalidArgumentError);
			}
			this._method = value;
		}

		get contentType(): string {
			return this._contentType;
		}

		set contentType(value: string) {
			this._contentType = value;
		}

		get requestHeaders(): Array<any> {
			return this._requestHeaders;
		}

		set requestHeaders(value: Array<any>) {
			if (!(value instanceof Array)) {
				this._sec.throwError('ArgumentError', Errors.InvalidArgumentError, "value");
			}
			this._requestHeaders = value;
		}

		get digest(): string {
			return this._digest;
		}

		set digest(value: string) {
			this._digest = value;
		}

		_toFileRequest(): any {
			let obj: any = {};
			obj.url = this._url;
			obj.method = this._method;
			obj.checkPolicyFile = this._checkPolicyFile;
			let data = this._data;
			if (data) {
				obj.mimeType = this._contentType;
				if (this._sec.utils.ByteArray.axIsType(data)) {
					obj.data = <any>
						new Uint8Array((<any> data)._buffer, 0, (<any> data).length);
				} else {
					let dataStr = data.toString();
					if (this._method === 'GET') {
						let i = obj.url.lastIndexOf('?');
						obj.url = (i < 0 ? obj.url : obj.url.substring(0, i)) + '?' + dataStr;
					} else {
						obj.data = dataStr;
					}
				}
			}
			return obj;
		}

	}
}

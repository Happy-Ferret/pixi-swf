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
// Class: URLVariables
module Shumway.flash.net {
	declare let escape: any;
	declare let unescape: any;

	export class URLVariables extends LegacyEntity {
		constructor(source: string = null) {
			super();
			this._ignoreDecodingErrors = false;
			source && this.decode(source);
		}

		_ignoreDecodingErrors: boolean;
		_inner: any;

		decode(source: string): void {
			let variables = source.split('&');
			for (let i = 0; i < variables.length; i++) {
				let p = variables[i];
				let j = p.indexOf('=');
				if (j < 0) {
					if (this._ignoreDecodingErrors) {
						j = p.length;
					} else {
						this._sec.throwError('Error', Errors.DecodeParamError);
					}
				}
				let name = unescape(p.substring(0, j).split('+').join(' '));
				let value = unescape(p.substring(j + 1).split('+').join(' '));
				let currentValue = this.axGetPublicProperty(name);
				if (typeof currentValue === 'undefined') {
					this.axSetPublicProperty(name, value);
				} else if (Array.isArray(currentValue)) {
					currentValue.push(value);
				} else {
					this.axSetPublicProperty(name, [currentValue, value]);
				}
			}
		}

		toString(): string {
			let pairs = [];
			let keys = this.axGetEnumerableKeys();
			for (let i = 0; i < keys.length; i++) {
				let name = keys[i].split(' ').join('+');
				let value = this.axGetPublicProperty(name);
				name = escape(name).split(' ').join('+');
				if (Array.isArray(value)) {
					for (let j = 0; j < value.length; j++) {
						pairs.push(name + '=' + escape(value[j]));
					}
				} else {
					pairs.push(name + '=' + escape(value));
				}
			}
			return pairs.join('&');
		}

		axSetPublicProperty(name: string, value: any): void {
			this._inner[name] = value;
		}

		axGetPublicProperty(name: string): any {
			return this._inner[name];
		}

		axGetEnumerableKeys() {
			return Object.keys(this._inner);
		}
	}
}

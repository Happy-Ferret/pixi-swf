/*
 * Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module Shumway {
	import notImplemented = Shumway.Debug.notImplemented;
	import unexpected = Shumway.Debug.unexpected;

	import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
	import assert = Shumway.Debug.assert;

	export module flash.net {
		export enum AMFEncoding {
			AMF0 = 0,
			AMF3 = 3,
			DEFAULT = 3
		}

		export enum ObjectEncoding {
			AMF0 = AMFEncoding.AMF0,
			AMF3 = AMFEncoding.AMF3,
			DEFAULT = AMFEncoding.DEFAULT
		}
	}

	export module flash.system {
		export class ByteArrayClass extends LegacyClass<utils.ByteArray> {
			key = "flash.utils.ByteArray";

			constructor() {
				super(utils.ByteArray);
			}

			readObject(arr: utils.ByteArray): any {
				this._sec.throwError(this.key, "Not implemented");

				// switch (this._objectEncoding) {
				// 	case flash.net.ObjectEncoding.AMF0:
				// 		return AMF0.read(this);
				// 	case flash.net.ObjectEncoding.AMF3:
				// 		return AMF3.read(this);
				// 	default:
				// 		unexpected("Object Encoding");
				// }
			}

			writeObject(arr: utils.ByteArray, obj: any) {
				this._sec.throwError(this.key, "Not implemented");

				// switch (this._objectEncoding) {
				// 	case flash.net.ObjectEncoding.AMF0:
				// 		return AMF0.write(this, object);
				// 	case flash.net.ObjectEncoding.AMF3:
				// 		return AMF3.write(this, object);
				// 	default:
				// 		unexpected("Object Encoding");
				// }
			}

		}
	}

	export module flash.utils {
		export interface IDataInput {
			readBytes: (bytes: flash.utils.ByteArray, offset?: number /*uint*/, length?: number /*uint*/) => void;
			readBoolean: () => boolean;
			readByte: () => number
			/*int*/
			;
			readUnsignedByte: () => number
			/*uint*/
			;
			readShort: () => number
			/*int*/
			;
			readUnsignedShort: () => number
			/*uint*/
			;
			readInt: () => number
			/*int*/
			;
			readUnsignedInt: () => number
			/*uint*/
			;
			readFloat: () => number;
			readDouble: () => number;
			readMultiByte: (length: number /*uint*/, charSet: string) => string;
			readUTF: () => string;
			readUTFBytes: (length: number /*uint*/) => string;
			bytesAvailable: number
			/*uint*/
			;
			readObject: () => any;
			objectEncoding: number
			/*uint*/
			;
			endian: string;
		}

		export interface IDataOutput {
			writeBytes: (bytes: flash.utils.ByteArray, offset?: number /*uint*/, length?: number /*uint*/) => void;
			writeBoolean: (value: boolean) => void;
			writeByte: (value: number /*int*/) => void;
			writeShort: (value: number /*int*/) => void;
			writeInt: (value: number /*int*/) => void;
			writeUnsignedInt: (value: number /*uint*/) => void;
			writeFloat: (value: number) => void;
			writeDouble: (value: number) => void;
			writeMultiByte: (value: string, charSet: string) => void;
			writeUTF: (value: string) => void;
			writeUTFBytes: (value: string) => void;
			writeObject: (obj: any) => void;
			objectEncoding: number
			/*uint*/
			;
			endian: string;
		}

		export class ByteArray extends DataBuffer implements LegacyEntity, IDataInput, IDataOutput {
			_symbol: {
				buffer: Uint8Array;
				byteLength: number;
			};
			_symbolProto: any;
			_sec: system.ISecurityDomain;

			constructor(source?: any) {
				super(-1);
				this._sec = system._currentDomain;
				if (this._symbol) {
					source = this._symbol;
				}
				let buffer: ArrayBuffer;
				let length = 0;
				if (source) {
					if (source instanceof ArrayBuffer) {
						buffer = source.slice(0);
					} else if (Array.isArray(source)) {
						buffer = new Uint8Array(source).buffer;
					} else if ('buffer' in source) {
						if (source.buffer instanceof ArrayBuffer) {
							buffer = new Uint8Array(source.buffer).buffer;
						} else if (source.buffer instanceof Uint8Array) {
							let begin = source.buffer.byteOffset;
							buffer = source.buffer.buffer.slice(begin, begin + source.buffer.length);
						} else {
							release || assert(source.buffer instanceof ArrayBuffer);
							buffer = source.buffer.slice();
						}
					} else {
						Debug.unexpected("Source type.");
					}
					length = buffer.byteLength;
				} else {
					buffer = new ArrayBuffer(ByteArray.INITIAL_SIZE);
				}
				this._buffer = buffer;
				this._length = length;
				this._position = 0;
				this._resetViews();
				this._objectEncoding = ByteArray.defaultObjectEncoding;
				this._littleEndian = false; // AS3 is bigEndian by default.
				this._bitBuffer = 0;
				this._bitLength = 0;
			}

			private static _defaultObjectEncoding: number = flash.net.ObjectEncoding.DEFAULT;

			static get defaultObjectEncoding(): number /*uint*/ {
				return this._defaultObjectEncoding;
			}

			static set defaultObjectEncoding(version: number /*uint*/) {
				version = version >>> 0;
				this._defaultObjectEncoding = version;
			}

			toJSON() {
				return "ByteArray";
			}

			// private _buffer: ArrayBuffer;
			readObject(): any {
				return this._sec.utils.ByteArray.readObject(this);
			}
			writeObject(obj: any) {
				this._sec.utils.ByteArray.writeObject(this, obj);
			}
		}
	}
}

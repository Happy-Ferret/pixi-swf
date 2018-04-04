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
// Class: Shader
module Shumway.flash.display {
	export class Shader extends LegacyEntity {
		constructor(code: flash.utils.ByteArray = null) {
			super();
			// TODO: coerce
			this.code = code;
		}

		// JS -> AS Bindings

		byteCode: flash.utils.ByteArray;

		// _byteCode: flash.utils.ByteArray;
		// _data: flash.display.ShaderData;
		// _precisionHint: string;
		get data(): flash.display.ShaderData {
			release || notImplemented("public flash.display.Shader::get data");
			return null;
			// return this._data;
		}

		set data(p: flash.display.ShaderData) {
			p = p;
			release || notImplemented("public flash.display.Shader::set data");
			return;
			// this._data = p;
		}

		get precisionHint(): string {
			release || notImplemented("public flash.display.Shader::get precisionHint");
			return "";
			// return this._precisionHint;
		}

		set precisionHint(p: string) {
			p = axCoerceString(p);
			release || notImplemented("public flash.display.Shader::set precisionHint");
			return;
			// this._precisionHint = p;
		}
	}
}

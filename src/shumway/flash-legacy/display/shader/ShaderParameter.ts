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
// Class: ShaderParameter
module Shumway.flash.display {
	import notImplemented = Shumway.Debug.notImplemented;
	import axCoerceString = Shumway.AVMX.axCoerceString;

	export class ShaderParameter extends ASObject {

		// Called whenever the class is initialized.
		static classInitializer: any = null;

		// List of static symbols to link.
		static classSymbols: string [] = null; // [];

		// List of instance symbols to link.
		static instanceSymbols: string [] = null; // [];

		constructor() {
			super();
		}

		// JS -> AS Bindings


		// AS -> JS Bindings

		// _value: any [];
		// _type: string;
		// _index: number /*int*/;
		get value(): ASArray {
			release || notImplemented("public flash.display.ShaderParameter::get value");
			return null;
			// return this._value;
		}

		set value(v: ASArray) {
			v = v;
			release || notImplemented("public flash.display.ShaderParameter::set value");
			return;
			// this._value = v;
		}

		get type(): string {
			release || notImplemented("public flash.display.ShaderParameter::get type");
			return "";
			// return this._type;
		}

		get index(): number /*int*/ {
			release || notImplemented("public flash.display.ShaderParameter::get index");
			return 0;
			// return this._index;
		}
	}
}

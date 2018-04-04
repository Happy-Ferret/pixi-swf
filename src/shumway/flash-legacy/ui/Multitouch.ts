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
// Class: Multitouch
module Shumway.flash.ui {
	import somewhatImplemented = Shumway.Debug.somewhatImplemented;
	import notImplemented = Shumway.Debug.notImplemented;

	export class Multitouch extends LegacyEntity {
		constructor() {
			super();
		}

		// static _inputMode: string;
		// static _supportsTouchEvents: boolean;
		// static _supportsGestureEvents: boolean;
		// static _supportedGestures: any /*ASVector*/;
		// static _maxTouchPoints: number /*int*/;
		// static _mapTouchToMouse: boolean;
		static get inputMode(): string {
			release || notImplemented("public flash.ui.Multitouch::get inputMode");
			return "";
			// return this._inputMode;
		}

		static set inputMode(value: string) {
			value = value;
			release || notImplemented("public flash.ui.Multitouch::set inputMode");
			return;
			// this._inputMode = value;
		}

		static get supportsTouchEvents(): boolean {
			release || somewhatImplemented("public flash.ui.Multitouch::get supportsTouchEvents");
			return false;
			// return this._supportsTouchEvents;
		}

		static get supportsGestureEvents(): boolean {
			release || somewhatImplemented("public flash.ui.Multitouch::get supportsGestureEvents");
			return false;
			// return this._supportsGestureEvents;
		}

		static get supportedGestures(): Array<any> {
			release || somewhatImplemented("public flash.ui.Multitouch::get supportedGestures");
			return null;
			// return this._supportedGestures;
		}

		static get maxTouchPoints(): number /*int*/ {
			release || somewhatImplemented("public flash.ui.Multitouch::get maxTouchPoints");
			return 0;
			// return this._maxTouchPoints;
		}

		static get mapTouchToMouse(): boolean {
			release || somewhatImplemented("public flash.ui.Multitouch::get mapTouchToMouse");
			return true;
			// return this._mapTouchToMouse;
		}

		static set mapTouchToMouse(value: boolean) {
			value = !!value;
			release || notImplemented("public flash.ui.Multitouch::set mapTouchToMouse");
			return;
			// this._mapTouchToMouse = value;
		}

	}
}

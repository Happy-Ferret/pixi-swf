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
// Class: MouseEvent
module Shumway.flash.events {
	import notImplemented = Shumway.Debug.notImplemented;

	export class MouseEvent extends flash.events.Event {
		constructor(type: string, bubbles: boolean = true, cancelable: boolean = false,
		            localX: number = undefined, localY: number = undefined,
		            relatedObject: flash.display.InteractiveObject = null, ctrlKey: boolean = false,
		            altKey: boolean = false, shiftKey: boolean = false, buttonDown: boolean = false,
		            delta: number /*int*/ = 0) {
			super(type, bubbles, cancelable);
			this._localX = localX;
			this._localY = localY;
			this._relatedObject = relatedObject;
			this._ctrlKey = ctrlKey;
			this._altKey = altKey;
			this._shiftKey = shiftKey;
			this._buttonDown = buttonDown;
			this._delta = delta;
		}

		// JS -> AS Bindings
		static CLICK: string = "click";
		static DOUBLE_CLICK: string = "doubleClick";
		static MOUSE_DOWN: string = "mouseDown";
		static MOUSE_MOVE: string = "mouseMove";
		static MOUSE_OUT: string = "mouseOut";
		static MOUSE_OVER: string = "mouseOver";
		static MOUSE_UP: string = "mouseUp";
		static RELEASE_OUTSIDE: string = "releaseOutside";
		static MOUSE_WHEEL: string = "mouseWheel";
		static ROLL_OUT: string = "rollOut";
		static ROLL_OVER: string = "rollOver";
		static MIDDLE_CLICK: string = "middleClick";
		static MIDDLE_MOUSE_DOWN: string = "middleMouseDown";
		static MIDDLE_MOUSE_UP: string = "middleMouseUp";
		static RIGHT_CLICK: string = "rightClick";
		static RIGHT_MOUSE_DOWN: string = "rightMouseDown";
		static RIGHT_MOUSE_UP: string = "rightMouseUp";
		static CONTEXT_MENU: string = "contextMenu";

		/**
		 * AS3 mouse event names don't match DOM even names, so map them here.
		 */
		static typeFromDOMType(name: string): string {
			switch (name) {
				case "click":
					return MouseEvent.CLICK;
				case "dblclick":
					return MouseEvent.DOUBLE_CLICK;
				case "mousedown":
					return MouseEvent.MOUSE_DOWN;
				case "mouseout":
				case "mouseover":
				case "mousemove":
					return MouseEvent.MOUSE_MOVE;
				case "mouseup":
					return MouseEvent.MOUSE_UP;
				default:
					notImplemented(name);
				// return MouseEvent.RELEASE_OUTSIDE;
				// return MouseEvent.MOUSE_WHEEL;
				// return MouseEvent.ROLL_OUT;
				// return MouseEvent.ROLL_OVER;
				// return MouseEvent.MIDDLE_CLICK;
				// return MouseEvent.MIDDLE_MOUSE_DOWN;
				// return MouseEvent.MIDDLE_MOUSE_UP;
				// return MouseEvent.RIGHT_CLICK;
				// return MouseEvent.RIGHT_MOUSE_DOWN;
				// return MouseEvent.RIGHT_MOUSE_UP;
				// return MouseEvent.CONTEXT_MENU;
			}
			return "";
		}

		// AS -> JS Bindings
		private _localX: number;
		private _localY: number;
		private _movementX: number;
		private _movementY: number;
		private _delta: number;
		private _position: flash.geom.Point;

		private _ctrlKey: boolean;
		private _altKey: boolean;
		private _shiftKey: boolean;

		private _buttonDown: boolean;

		private _relatedObject: flash.display.InteractiveObject;
		private _isRelatedObjectInaccessible: boolean;


		get localX(): number {
			return (this._localX / 20) | 0;
		}

		set localX(value: number) {
			this._localX = (value * 20) | 0;
		}

		get localY(): number {
			return (this._localY / 20) | 0;
		}

		set localY(value: number) {
			this._localY = (value * 20) | 0;
		}

		public get stageX(): Number {
			if (isNaN(this.localX + this.localY)) {
				return Number.NaN;
			}
			return (this._getGlobalPoint().x / 20) | 0;
		}

		public get stageY(): Number {
			if (isNaN(this.localX + this.localY)) {
				return Number.NaN;
			}
			return (this._getGlobalPoint().y / 20) | 0;
		}

		get movementX(): number {
			return this._movementX || 0;
		}

		set movementX(value: number) {
			this._movementX = +value;
		}

		get movementY(): number {
			return this._movementY || 0;
		}

		set movementY(value: number) {
			this._movementY = +value;
		}

		public get delta(): number {
			return this._delta;
		}

		public set delta(value: number) {
			this._delta = value;
		}

		public get ctrlKey(): boolean {
			return this._ctrlKey;
		}

		public set ctrlKey(value: boolean) {
			this._ctrlKey = value;
		}

		public get altKey(): boolean {
			return this._altKey;
		}

		public set altKey(value: boolean) {
			this._altKey = value;
		}

		public get shiftKey(): boolean {
			return this._shiftKey;
		}

		public set shiftKey(value: boolean) {
			this._shiftKey = value;
		}

		public get buttonDown(): boolean {
			return this._buttonDown;
		}

		public set buttonDown(value: boolean) {
			this._buttonDown = value;
		}

		public get relatedObject(): flash.display.InteractiveObject {
			return this._relatedObject;
		}

		public set relatedObject(value: flash.display.InteractiveObject) {
			this._relatedObject = value;
		}

		public get isRelatedObjectInaccessible(): boolean {
			return this._isRelatedObjectInaccessible;
		}

		public set isRelatedObjectInaccessible(value: boolean) {
			this._isRelatedObjectInaccessible = value;
		}

		updateAfterEvent(): void {
			this._sec.player.requestRendering();
		}

		private _getGlobalPoint(): flash.geom.Point {
			let point = this._position;
			if (!point) {
				point = this._position = this._sec.geom.Point.create();
			}
			if (this.target) {
				point.setTo(this._localX, this._localY);
				let m = (<flash.display.DisplayObject>this._target)._getConcatenatedMatrix();
				m.transformPointInPlace(point);
			} else {
				point.setTo(0, 0);
			}
			return point;
		}

		clone(): Event {
			return this._sec.events.MouseEvent.create([this.type, this.bubbles,
				this.cancelable,
				this.localX, this.localY,
				this.relatedObject, this.ctrlKey,
				this.altKey, this.shiftKey,
				this.buttonDown, this.delta]);
		}

		toString(): string {
			return this.formatToString('MouseEvent', 'type', 'bubbles', 'cancelable', 'eventPhase',
				'localX', "localY", 'relatedObject', 'ctrlKey', 'altKey',
				'shiftKey', 'buttonDown', 'delta');
		}
	}
}

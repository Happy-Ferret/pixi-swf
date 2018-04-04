module Shumway.flash.system {
	import MouseCursor = ui.MouseCursor;

	export class MouseClass extends LegacyClass<ui.Mouse> {
		constructor() {
			super(ui.Mouse);
			this.init();
		}

		init() {
			this._currentPosition = this._sec.geom.Point.create();
			this._cursor = MouseCursor.AUTO;
			this.draggableObject = null;
		}

		draggableObject: display.Sprite;
		_currentPosition: geom.Point;
		_cursor: string;

		//static _supportsCursor: boolean;

		//static _supportsNativeCursor: boolean;
		/**
		 * Remembers the current mouse position.
		 */
		public updateCurrentPosition(value: flash.geom.Point) {
			this._currentPosition.copyFrom(value);
		}
	}
}
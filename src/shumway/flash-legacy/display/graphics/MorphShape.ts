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
// Class: MorphShape
module Shumway.flash.display {
	import assert = Debug.assert;

	export class MorphShape extends flash.display.DisplayObject {
		_symbol: MorphShapeSymbol;

		applySymbol() {
			this._initializeFields();
			release || assert(this._symbol);
			this._setStaticContentFromSymbol(this._symbol);
			// TODO: Check what do do if the computed bounds of the graphics object don't
			// match those given by the symbol.
			this._setFlags(DisplayObjectFlags.ContainsMorph);
		}

		preInit() {
			if (this._symbol && !this._fieldsInitialized) {
				this.applySymbol();
			}
			super.preInit();
		}

		constructor() {
			super();
			release || assert(!this._symbol);
		}

		_canHaveGraphics(): boolean {
			return true;
		}

		_getGraphics(): flash.display.Graphics {
			return this._graphics;
		}

		get graphics(): flash.display.Graphics {
			return this._ensureGraphics();
		}

		_containsPointDirectly(localX: number, localY: number,
		                       globalX: number, globalY: number): boolean {
			let graphics = this._getGraphics();
			return graphics && graphics._containsPoint(localX, localY, true, this._ratio / 0xffff);
		}
	}

	export class MorphShapeSymbol extends flash.display.ShapeSymbol {
		morphFillBounds: Bounds;
		morphLineBounds: Bounds;

		constructor(data: Timeline.SymbolData, sec: system.ISecurityDomain) {
			super(data, sec.display.MorphShape);
		}

		static FromData(data: any, loaderInfo: flash.display.LoaderInfo): MorphShapeSymbol {
			let symbol = new MorphShapeSymbol(data, loaderInfo._sec);
			symbol._setBoundsFromData(data);
			symbol.graphics = flash.display.Graphics.FromData(data, loaderInfo);
			symbol.processRequires(data.require, loaderInfo);
			symbol.morphFillBounds = data.morphFillBounds;
			symbol.morphLineBounds = data.morphLineBounds;
			return symbol;
		}
	}
}

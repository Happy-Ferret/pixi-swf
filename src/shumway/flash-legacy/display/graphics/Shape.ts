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
// Class: Shape
module Shumway.flash.display {
	import assert = Debug.assert;
	import warning = Debug.warning;

	export class Shape extends flash.display.DisplayObject {
		_symbol: ShapeSymbol;

		applySymbol() {
			this._initializeFields();
			release || assert(this._symbol);
			// TODO: Check what do do if the computed bounds of the graphics object don't
			// match those given by the symbol.
			this._setStaticContentFromSymbol(this._symbol);
		}

		preInit() {
			if (this._symbol && !this._fieldsInitialized) {
				this.applySymbol();
			}
			super.preInit();
		}

		constructor() {
			super();
			if (!this._fieldsInitialized) {
				this._initializeFields();
			}
		}

		protected _initializeFields() {
			super._initializeFields();
			this._graphics = null;
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
			return !!graphics && graphics._containsPoint(localX, localY, true, 0);
		}
	}

	export class ShapeSymbol extends Timeline.DisplaySymbol {
		graphics: flash.display.Graphics = null;

		constructor(data: Timeline.SymbolData, symbolClass: system.LegacyClass) {
			super(data, symbolClass, false);
		}

		static FromData(data: Timeline.SymbolData, loaderInfo: flash.display.LoaderInfo): ShapeSymbol {
			let symbol = new ShapeSymbol(data, loaderInfo._sec.display.Shape);
			symbol._setBoundsFromData(data);
			symbol.graphics = flash.display.Graphics.FromData(data, loaderInfo);
			symbol.processRequires((<any>data).require, loaderInfo);
			return symbol;
		}

		processRequires(dependencies: any[], loaderInfo: flash.display.LoaderInfo): void {
			if (!dependencies) {
				return;
			}
			let textures = this.graphics.getUsedTextures();
			for (let i = 0; i < dependencies.length; i++) {
				let symbol = <flash.display.BitmapSymbol>loaderInfo.getSymbolById(dependencies[i]);
				if (!symbol) {
					if (dependencies[i] !== 65535) {
						// Id 65535 is somehow used invalidly in lots of embedded shapes created by the
						// authoring tool, so don't warn about that.
						warning("Bitmap symbol " + dependencies[i] + " required by shape, but not defined.");
					}
					textures.push(null);
					// TODO: handle null-textures from invalid SWFs correctly.
					continue;
				}
				textures.push(symbol.getSharedInstance());
			}
		}
	}
}

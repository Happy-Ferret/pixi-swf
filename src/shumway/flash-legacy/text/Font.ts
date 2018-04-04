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
// Class: Font
module Shumway.flash.text {
	import somewhatImplemented = Shumway.Debug.somewhatImplemented;
	import assert = Debug.assert;

	import FontStyle = flash.text.FontStyle;
	import FontType = flash.text.FontType;

	export class Font extends LegacyEntity implements Shumway.Remoting.IRemotable {

		private _initializeFields() {
			this._fontName = null;
			this._fontFamily = null;
			this._fontStyle = null;
			this._fontType = null;

			this.ascent = 0;
			this.descent = 0;
			this.leading = 0;
			this.advances = null;
			this._id = flash.display.DisplayObject.getNextSyncID();
		}

		_symbol: FontSymbol;

		applySymbol() {
			release || Debug.assert(this._symbol);
			let symbol = this._symbol;
			release || Debug.assert(symbol.syncId);
			this._initializeFields();

			this._id = symbol.syncId;
			this._fontName = symbol.name;
			let fontClass = this._sec.text;
			this._fontFamily = fontClass.resolveFontName(symbol.name);
			if (symbol.bold) {
				if (symbol.italic) {
					this._fontStyle = FontStyle.BOLD_ITALIC;
				} else {
					this._fontStyle = FontStyle.BOLD;
				}
			} else if (symbol.italic) {
				this._fontStyle = FontStyle.ITALIC;
			} else {
				this._fontStyle = FontStyle.REGULAR;
			}

			let metrics = symbol.metrics;
			if (metrics) {
				this.ascent = metrics.ascent;
				this.descent = metrics.descent;
				this.leading = metrics.leading;
				this.advances = metrics.advances;
			}

			// Font symbols without any glyphs describe device fonts.
			this._fontType = metrics ? FontType.EMBEDDED : FontType.DEVICE;

			// Keeping fontProp.configurable === true, some old movies have fonts with non-unique
			// names.
			let fontProp = {
				value: this,
				configurable: true
			};
			Object.defineProperty(fontClass._fontsBySymbolId, symbol.id + '', fontProp);
			Object.defineProperty(fontClass._fontsByName, symbol.name.toLowerCase() + this._fontStyle,
				fontProp);
			if (this._fontType === FontType.EMBEDDED) {
				Object.defineProperty(fontClass._fontsByName, 'swffont' + symbol.syncId + this._fontStyle,
					fontProp);
			}
		}

		constructor() {
			super();
			if (!this._symbol) {
				this._initializeFields();
			}
		}

		// JS -> AS Bindings
		_fontName: string;
		_fontFamily: string;
		_fontStyle: string;
		_fontType: string;

		_id: number;

		ascent: number;
		descent: number;
		leading: number;
		advances: number[];

		get fontName(): string {
			return this._fontName;
		}

		get fontStyle(): string {
			return this._fontStyle;
		}

		get fontType(): string {
			return this._fontType;
		}

		hasGlyphs(str: string): boolean {
			somewhatImplemented('Font#hasGlyphs');
			return true;
		}
	}

	export class FontSymbol extends Timeline.Symbol implements Timeline.EagerlyResolvedSymbol {
		name: string;
		bold: boolean;
		italic: boolean;
		codes: number[];
		originalSize: boolean;
		metrics: any;
		syncId: number;

		constructor(data: Timeline.SymbolData, sec: system.ISecurityDomain) {
			super(data, sec.text.Font);
		}

		static FromData(data: any, loaderInfo: display.LoaderInfo): FontSymbol {
			let symbol = new FontSymbol(data, loaderInfo._sec);
			// Immediately mark glyph-less fonts as ready.
			symbol.ready = !data.metrics;
			symbol.name = data.name;
			// No need to keep the original data baggage around.
			symbol.data = {id: data.id};
			symbol.bold = data.bold;
			symbol.italic = data.italic;
			symbol.originalSize = data.originalSize;
			symbol.codes = data.codes;
			symbol.metrics = data.metrics;
			symbol.syncId = flash.display.DisplayObject.getNextSyncID();
			return symbol;
		}

		get resolveAssetCallback() {
			return this._unboundResolveAssetCallback.bind(this);
		}

		private _unboundResolveAssetCallback(data: any) {
			release || Debug.assert(!this.ready);
			this.ready = true;
		}
	}
}

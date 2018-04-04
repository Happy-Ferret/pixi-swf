module Shumway.flash {
	export class LegacyEntity {
		_sec: system.ISecurityDomain;
		_symbol: any;
		_symbolProto: any;

		constructor() {
			this._sec = system._currentDomain;
			this._symbol = this._symbolProto || system._currentSymbol;
		}
	}
}

module Shumway.flash.system {

	export class LegacyNamespace extends LegacyEntity {
		key: string = null;

		classMap: MapObject<LegacyEntity>;

		_registerClass(cl: LegacyClass) {
			this.classMap[cl.key] = cl;
		}
	}

	export function checkParameterType(argument: any, name: string, type: LegacyClass) {
		if (argument == null) {
			type._sec.throwError('TypeError', Errors.NullPointerError, name);
		}
		if (!type.axIsType(argument)) {
			type._sec.throwError('TypeError', Errors.CheckTypeFailedError, argument,
				type.key);
		}
	}

	export class LegacyClass<T extends LegacyEntity = any> extends LegacyEntity {
		key: string = null;
		multiname: lang.Multiname = null;

		jsClass: Function;

		constructor(jsClass: Function) {
			super();
			this.jsClass = jsClass;
		}

		create(args?: Array<any>): T {
			// new (Function.prototype.bind.apply(cls, [cls].concat(args)));
			const oldDomain = system._currentDomain;
			const cls = this.jsClass as any;


			if (oldDomain === this._sec && !system._currentSymbol) {
				if (args) {
					return new (Function.prototype.bind.apply(cls, [cls].concat(args))) as any
				}
				return new cls();
			}
			system._currentDomain = this._sec;
			try {
				if (args) {
					return new (Function.prototype.bind.apply(cls, [cls].concat(args))) as any
				}
				return new cls();
			} catch (e) {
				this._sec.throwError("LegacyEntity.create", e);
				return null;
			} finally {
				system._currentSymbol = null;
				system._currentDomain = oldDomain;
			}
		}

		createObject(): T {
			let obj: any = Object.create(this.jsClass.prototype);
			obj._sec = this._sec;
			return obj;
		}

		axIsType(obj: any): obj is T {
			return obj instanceof (this.jsClass) && obj._sec === this._sec;
		}

		setSymbolResolver(resolver: any) {
			Object.defineProperty(this.jsClass.prototype, "_symbolProto",
				{
					'get' : resolver,
					configurable: true
				});
		}

		setSymbol(symbol: any) {
			Object.defineProperty(this.jsClass.prototype, "_symbolProto", {value : symbol});
		}

		isSymbol(symbolClass: any)
		{
			return this === symbolClass;
		}

		isSymbolPrototype(symbolClass: any) {
			return this.jsClass.prototype.isPrototypeOf(symbolClass.jsClass);
		}

		FromUntyped(obj: any): T {
			return null;
		}

		checkParameterType(argument: any, name: string) {
			checkParameterType(argument, name, this);
		}
	}
}

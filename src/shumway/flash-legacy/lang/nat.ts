module Shumway.flash.lang {
	import assert = Shumway.Debug.assert;

	import LegacyClass = system.LegacyClass;

	let nativeClasses: Shumway.MapObject<LegacyClass> = Shumway.ObjectUtilities.createMap<LegacyClass>();
	let nativeFunctions: Shumway.MapObject<Function> = Shumway.ObjectUtilities.createMap<Function>();

	export interface NativeClassLoaderName {
		name: string;
		alias: string;
		nsType: NamespaceType;
	}

	export let nativeClassLoaderNames: Array<NativeClassLoaderName> = [];

	export function registerNativeClass(name: string, asClass: LegacyClass, alias: string = name,
	                                    nsType: NamespaceType = NamespaceType.Public) {
		release || assert(!nativeClasses[name], "Native class: " + name + " is already registered.");
		nativeClasses[name] = asClass;
		nativeClassLoaderNames.push({name: name, alias: alias, nsType: nsType});
	}

	export function registerNativeFunction(path: string, fun: Function) {
		release || assert(!nativeFunctions[path], "Native function: " + path + " is already registered.");
		nativeFunctions[path] = fun;
	}

	export function createLegacyClass(name: Multiname, proto: LegacyClass) {
		var symbolClass: any = function() {
			proto.jsClass.apply(this, arguments);
		};

		symbolClass.multiname = name;

		LegacyClass.call(symbolClass, symbolClass);
		(Object as any).assign(symbolClass, LegacyClass.prototype);

		symbolClass.prototype = Object.create(proto.jsClass.prototype);
		symbolClass.prototype.constructor = symbolClass;

		return symbolClass;
	}

	export function getNativeClass(name: Multiname) {
		return this.nativeClasses[name.toFQNString(false)] || null;
	}
}

// this is taken from AVM2 only for name parsing
module Shumway.flash.lang {
	import assert = Shumway.Debug.assert;

	export const enum CONSTANT {
		Undefined = 0x00,
		Utf8 = 0x01,
		Float = 0x02,
		Int = 0x03,
		UInt = 0x04,
		PrivateNs = 0x05,
		Double = 0x06,
		QName = 0x07,
		Namespace = 0x08,
		Multiname = 0x09,
		False = 0x0A,
		True = 0x0B,
		Null = 0x0C,
		QNameA = 0x0D,
		MultinameA = 0x0E,
		RTQName = 0x0F,
		RTQNameA = 0x10,
		RTQNameL = 0x11,
		RTQNameLA = 0x12,
		NameL = 0x13,
		NameLA = 0x14,
		NamespaceSet = 0x15,
		PackageNamespace = 0x16,
		PackageInternalNs = 0x17,
		ProtectedNamespace = 0x18,
		ExplicitNamespace = 0x19,
		StaticProtectedNs = 0x1A,
		MultinameL = 0x1B,
		MultinameLA = 0x1C,
		TypeName = 0x1D,

		ClassSealed = 0x01,
		ClassFinal = 0x02,
		ClassInterface = 0x04,
		ClassProtectedNs = 0x08
	}

	let CONSTANTNames = ["Undefined", "Utf8|ClassSealed", "Float|ClassFinal", "Int", "UInt|ClassInterface", "PrivateNs", "Double", "QName", "Namespace|ClassProtectedNs", "Multiname", "False", "True", "Null", "QNameA", "MultinameA", "RTQName", "RTQNameA", "RTQNameL", "RTQNameLA", "NameL", "NameLA", "NamespaceSet", "PackageNamespace", "PackageInternalNs", "ProtectedNamespace", "ExplicitNamespace", "StaticProtectedNs", "MultinameL", "MultinameLA", "TypeName"];

	export function getCONSTANTName(constant: CONSTANT): string {
		return release ? String(constant) : CONSTANTNames[constant];
	}

	export const enum NamespaceType {
		Public = 0,
		Protected = 1,
		PackageInternal = 2,
		Private = 3,
		Explicit = 4,
		StaticProtected = 5
	}

	let namespaceTypeNames = ["Public", "Protected", "PackageInternal", "Private", "Explicit", "StaticProtected"];

	export function getNamespaceTypeName(namespaceType: NamespaceType): string {
		return release ? String(namespaceType) : namespaceTypeNames[namespaceType];
	}

	// Used in _hashNamespace so we don't need to allocate a new buffer each time.
	let namespaceHashingBuffer = new Int32Array(100);

	export class Namespace {
		public mangledName: string = null;

		constructor(public type: NamespaceType, public uri: string, public prefix: string) {
			assert(type !== undefined);
			this.mangleName();
			if (!release) {
				Object.freeze(this);
			}
		}

		toString() {
			return getNamespaceTypeName(this.type) + (this.uri !== "" ? ":" + this.uri : "");
		}

		private static _knownNames = [
			""
		];

		private static _hashNamespace(type: NamespaceType, uri: string, prefix: string) {
			uri = uri + '';
			prefix = prefix + '';
			let index = Namespace._knownNames.indexOf(uri);
			if (index >= 0) {
				return type << 2 | index;
			}
			let length = 1 + uri.length + prefix.length;
			let data = length < 101 ? namespaceHashingBuffer : new Int32Array(length);
			let j = 0;
			data[j++] = type;
			for (let i = 0; i < uri.length; i++) {
				data[j++] = uri.charCodeAt(i);
			}
			for (let i = 0; i < prefix.length; i++) {
				data[j++] = prefix.charCodeAt(i);
			}
			return Shumway.HashUtilities.hashBytesTo32BitsMD5(data, 0, j);
		}

		private mangleName() {
			if (this.type === NamespaceType.Public && this.uri === '') {
				this.mangledName = 'Bg';
				return;
			}
			let nsHash = Namespace._hashNamespace(this.type, this.uri, this.prefix);
			this.mangledName = Shumway.StringUtilities.variableLengthEncodeInt32(nsHash);
		}

		public isPublic(): boolean {
			return this.type === NamespaceType.Public;
		}

		public get reflectedURI() {
			// For public names without a URI, Tamarin uses `null`, we use `""`.
			// Hence: special-casing for reflection.
			return this.uri || (this.type === NamespaceType.Public ? null : this.uri);
		}

		public static PUBLIC: Namespace;
	}

	let _namespaces: MapObject<Namespace> = {};

	export function internNamespace(type: NamespaceType, uri: string) {
		let key = type + uri;
		return _namespaces[key] || (_namespaces[key] = new Namespace(type, uri, ''));
	}

	export function internPrefixedNamespace(type: NamespaceType, uri: string, prefix: string) {
		let key = type + uri + prefix;
		let ns = _namespaces[key];
		if (!ns) {
			ns = _namespaces[key] = new Namespace(type, uri, prefix);
		}
		return ns;
	}

	export interface ILoaderInfo {
		app: IApplicationDomain;
		url: string;
	}

	export interface IApplicationDomain {
		loadABC(file: ABCFile): void;

		loadAndExecuteABC(file: ABCFile): void;
	}

	export class ABCFile {
		constructor(loaderInfo: ILoaderInfo, _buffer: Uint8Array) {

		}
	}

	export class Multiname {
		private static _nextID = 1;
		public id: number = Multiname._nextID++;
		private _mangledName: string = null;

		constructor(public abc: ABCFile,
		            public index: number,
		            public kind: CONSTANT,
		            public namespaces: Namespace [],
		            public name: any,
		            public parameterType: Multiname = null) {
			// ...
		}

		public static FromFQNString(fqn: string, nsType: NamespaceType) {
			let lastDot = fqn.lastIndexOf('.');
			let uri = lastDot === -1 ? '' : fqn.substr(0, lastDot);
			let name = lastDot === -1 ? fqn : fqn.substr(lastDot + 1);
			let ns = internNamespace(nsType, uri);
			return new Multiname(null, 0, CONSTANT.RTQName, [ns], name);
		}

		private _nameToString(): string {
			if (this.isAnyName()) {
				return "*";
			}
			return this.isRuntimeName() ? "[" + this.name + "]" : this.name;
		}

		public isRuntime(): boolean {
			switch (this.kind) {
				case CONSTANT.QName:
				case CONSTANT.QNameA:
				case CONSTANT.Multiname:
				case CONSTANT.MultinameA:
					return false;
			}
			return true;
		}

		public isRuntimeName(): boolean {
			switch (this.kind) {
				case CONSTANT.RTQNameL:
				case CONSTANT.RTQNameLA:
				case CONSTANT.MultinameL:
				case CONSTANT.MultinameLA:
					return true;
			}
			return false;
		}

		public isRuntimeNamespace(): boolean {
			switch (this.kind) {
				case CONSTANT.RTQName:
				case CONSTANT.RTQNameA:
				case CONSTANT.RTQNameL:
				case CONSTANT.RTQNameLA:
					return true;
			}
			return false;
		}

		public isAnyName(): boolean {
			return this.name === null;
		}

		public isAnyNamespace(): boolean {
			if (this.isRuntimeNamespace() || this.namespaces.length > 1) {
				return false;
			}
			return this.namespaces.length === 0 || this.namespaces[0].uri === "";

			// x.* has the same meaning as x.*::*, so look for the former case and give
			// it the same meaning of the latter.
			// return !this.isRuntimeNamespace() &&
			//  (this.namespaces.length === 0 || (this.isAnyName() && this.namespaces.length !== 1));
		}

		public isQName(): boolean {
			let kind = this.kind;
			let result = kind === CONSTANT.TypeName ||
				kind === CONSTANT.QName || kind === CONSTANT.QNameA ||
				kind >= CONSTANT.RTQName && kind <= CONSTANT.RTQNameLA;
			release || assert(!(result && this.namespaces.length !== 1));
			return result;
		}

		public get namespace(): Namespace {
			release || assert(this.isQName());
			return this.namespaces[0];
		}

		public get uri(): string {
			release || assert(this.isQName());
			return this.namespaces[0].uri;
		}

		public get prefix(): string {
			release || assert(this.isQName());
			return this.namespaces[0].prefix;
		}

		public set prefix(prefix: string) {
			release || assert(this.isQName());
			let ns = this.namespaces[0];
			if (ns.prefix === prefix) {
				return;
			}
			this.namespaces[0] = internPrefixedNamespace(ns.type, ns.uri, prefix);
		}

		public equalsQName(mn: Multiname): boolean {
			release || assert(this.isQName());
			return this.name === mn.name && this.namespaces[0].uri === mn.namespaces[0].uri;
		}

		public matches(mn: Multiname): boolean {
			release || assert(this.isQName());
			let anyName = mn.isAnyName();
			if (anyName && !mn.isQName()) {
				return true;
			}
			if (!anyName && this.name !== mn.name) {
				return false;
			}
			let uri = this.namespaces[0].uri;
			for (let i = mn.namespaces.length; i--;) {
				if (mn.namespaces[i].uri === uri) {
					return true;
				}
			}
			return false;
		}

		public isAttribute(): boolean {
			switch (this.kind) {
				case CONSTANT.QNameA:
				case CONSTANT.RTQNameA:
				case CONSTANT.RTQNameLA:
				case CONSTANT.MultinameA:
				case CONSTANT.MultinameLA:
					return true;
			}
			return false;
		}

		public getMangledName(): string {
			release || assert(this.isQName());
			return this._mangledName || this._mangleName();
		}

		private _mangleName() {
			release || assert(!this._mangledName);
			let mangledName = "$" + this.namespaces[0].mangledName + (this.name);
			if (!this.isRuntime()) {
				this._mangledName = mangledName;
			}
			return mangledName;
		}

		public getPublicMangledName(): any {
			if (isNumeric(this.name)) {
				return this.name;
			}
			return "$Bg" + (this.name);
		}

		public static isPublicQualifiedName(value: any): boolean {
			return value.indexOf('$Bg') === 0;
		}

		public static getPublicMangledName(name: string): any {
			if (isNumeric(name)) {
				return name;
			}
			return "$Bg" + name;
		}

		public toFQNString(useColons: boolean) {
			release || assert(this.isQName());
			let prefix = this.namespaces[0].uri;
			if (prefix.length) {
				prefix += (useColons ? '::' : '.');
			}
			return prefix + this.name;
		}

		public toString() {
			let str = getCONSTANTName(this.kind) + " ";
			str += this.isAttribute() ? "@" : "";
			if (this.isRuntimeNamespace()) {
				let namespaces = this.namespaces ? this.namespaces.map(x => String(x)).join(", ") : null;
				str += "[" + namespaces + "]::" + this._nameToString();
			} else if (this.isQName()) {
				str += this.namespaces[0] + "::";
				str += this._nameToString();
			} else {
				str += "{" + this.namespaces.map(x => String(x)).join(", ") + "}";
				str += "::" + this._nameToString();
			}
			if (this.parameterType) {
				str += "<" + this.parameterType + ">";
			}
			return str;
		}

		toFlashlogString(): string {
			let namespaceUri = this.uri;
			return namespaceUri ? namespaceUri + "::" + this.name : this.name;
		}

		/**
		 * Removes the public prefix, or returns undefined if the prefix doesn't exist.
		 */
		public static stripPublicMangledName(name: string): any {
			if (name.indexOf("$Bg") === 0) {
				return name.substring(3);
			}
			return undefined;
		}

		public static FromSimpleName(simpleName: string): Multiname {
			let nameIndex = simpleName.lastIndexOf(".");
			if (nameIndex <= 0) {
				nameIndex = simpleName.lastIndexOf(" ");
			}

			let uri = '';
			let name;
			if (nameIndex > 0 && nameIndex < simpleName.length - 1) {
				name = simpleName.substring(nameIndex + 1).trim();
				uri = simpleName.substring(0, nameIndex).trim();
			} else {
				name = simpleName;
			}
			let ns = internNamespace(NamespaceType.Public, uri);
			return new Multiname(null, 0, CONSTANT.RTQName, [ns], name);
		}
	}

	// Native classes
}

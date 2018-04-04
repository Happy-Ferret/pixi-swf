module Shumway.flash.system {
	export interface ISecurityDomain {
		events: EventsNamespace
		display: DisplayNamespace
		geom: GeomNamespace
		text: TextNamespace
		system: SystemNamespace
		filters: FiltersNamespace
		media: MediaNamespace
		net: NetNamespace
		ui: UINamespace
		player: any

		createError(className: string, error: any, replacement1?: any,
		            replacement2?: any, replacement3?: any, replacement4?: any): LegacyError;
	}

	export class LegacyError extends Error {
		code: number;

		constructor(msg: string, code: number) {
			super(msg);
		}
	}

	export class SecurityDomain implements ISecurityDomain {
		constructor() {
			const oldDomain = system._currentDomain;
			system._currentDomain = this;

			this.events = new EventsNamespace();
			this.utils = new UtilsNamespace();
			this.display = new DisplayNamespace();
			this.geom = new GeomNamespace();
			this.text = new TextNamespace();
			this.system = new SystemNamespace();
			this.filters = new FiltersNamespace();
			this.media = new MediaNamespace();
			this.net = new NetNamespace();
			this.ui = new UINamespace();

			if (oldDomain) {
				system._currentDomain = oldDomain;
			}
		}

		player: any;
		events: EventsNamespace;
		utils: UtilsNamespace;
		display: DisplayNamespace;
		geom: GeomNamespace;
		text: TextNamespace;
		system: SystemNamespace;
		filters: FiltersNamespace;
		media: MediaNamespace;
		net: NetNamespace;
		ui: UINamespace;

		throwError(className: string, error: any, replacement1?: any,
		           replacement2?: any, replacement3?: any, replacement4?: any) {
			throw this.createError.apply(this, arguments);
		}

		createError(className: string, error: any, replacement1?: any,
		            replacement2?: any, replacement3?: any, replacement4?: any) {
			let message = formatErrorMessage.apply(null, sliceArguments(arguments, 1));

			return new LegacyError(message, error.code);
			// let mn = Multiname.FromFQNString(className, NamespaceType.Public);
			// let axClass: AXClass = <any>this.system.getProperty(mn, true, true);
			// return axClass.axConstruct([message, error.code]);
		}
	}
}

module Shumway.flash.system {
	import ApplicationDomain = system.ApplicationDomain;

	export class SystemNamespace extends LegacyNamespace {

		constructor() {
			super();

			this.JPEGLoaderContext = new LegacyClass(system.JPEGLoaderContext);
			this.ApplicationDomain = new LegacyClass(system.ApplicationDomain);

			this._systemDomain = new ApplicationDomain(null);
			this._applicationDomain = new ApplicationDomain(this._systemDomain);
			this.LoaderContext = new LegacyClass(system.LoaderContext);

			this._currentDomain = this._applicationDomain;
		}

		_systemDomain: ApplicationDomain;
		_applicationDomain: ApplicationDomain;
		_currentDomain: ApplicationDomain;

		JPEGLoaderContext: LegacyClass<system.JPEGLoaderContext>;
		ApplicationDomain: LegacyClass<system.ApplicationDomain>;
		LoaderContext: LegacyClass<system.LoaderContext>;
	}
}
module Shumway.flash.system {
	export class UtilsNamespace extends LegacyNamespace implements UtilsNamespace {
		constructor() {
			super();

			this.ByteArray = new ByteArrayClass();
		}

		ByteArray: ByteArrayClass;
	}
}

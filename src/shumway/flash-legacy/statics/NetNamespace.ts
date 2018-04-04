module Shumway.flash.system {
	export class SharedObjectClass extends LegacyClass<net.SharedObject> {
		constructor() {
			super(net.SharedObject);
		}
	}

	export class NetNamespace {
		constructor() {
		}

		URLRequestHeader = new LegacyClass<net.URLRequestHeader>(net.URLRequestHeader);
		URLVariables = new LegacyClass<net.URLVariables>(net.URLVariables);
		URLStream = new LegacyClass<net.URLStream>(net.URLStream);
		URLRequest = new LegacyClass<net.URLRequest>(net.URLRequest);
		SharedObject = new SharedObjectClass();
		NetStreamInfo = new LegacyClass<net.NetStreamInfo>(net.NetStreamInfo);
	}
}
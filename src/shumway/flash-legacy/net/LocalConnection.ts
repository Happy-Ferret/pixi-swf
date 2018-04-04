/**
 * Copyright 2015 Mozilla Foundation
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

module Shumway.flash.net {
	import assert = Debug.assert;
	import ByteArray = flash.utils.ByteArray;

	let forbiddenNames = ['send', 'connect', 'close', 'allowDomain', 'allowInsecureDomain', 'client',
		'domain'];
	Object.freeze(forbiddenNames);

	export class LocalConnection extends flash.events.EventDispatcher
		implements ILocalConnectionReceiver {
		constructor() {
			super();
			this._client = this;
			this._connectionName = null;
			this._allowedInsecureDomains = [];
			this._allowedSecureDomains = [];

			// tsc contains a definition for URL that's non-constructible.

			// @ivanpopelyshev: that's a problem, we dont have currentABC in legacy, only currentDomain's
			// no url in them
			// let url = new (<any>URL)(Shumway.AVMX.getCurrentABC().env.url);

			let url = new (<any>URL)("localhost:8080");
			this._domain = url.hostname;
			this._secure = url.protocol === 'https:';
		}

		static get isSupported() {
			return true;
		}

		private _domain: string;
		private _secure: boolean;

		private _client: any;
		private _connectionName: string;

		// Required because allowDomain can be called before a connection is made.
		private _allowedInsecureDomains: string[];
		private _allowedSecureDomains: string[];

		close(): void {
			let connectionName = this._connectionName;
			if (!connectionName) {
				this._sec.throwError('ArgumentError', Errors.CloseNotConnectedError);
			}
			release || assert(typeof connectionName === 'string' && connectionName.length > 0);
			this._connectionName = null;
			// TODO: verify that these really are reset. For now, we aim to err on the safe side.
			this._allowedInsecureDomains = [];
			this._allowedSecureDomains = [];
			LocalConnectionService.instance.closeConnection(connectionName, this);
		}

		connect(connectionName: string): void {
			if (connectionName === null) {
				this._sec.throwError('TypeError', Errors.NullPointerError, 'connectionName');
			}
			if (connectionName === '') {
				this._sec.throwError('TypeError', Errors.EmptyStringError, 'connectionName');
			}
			// The only disallowed character for the connection name is ":".
			if (connectionName.indexOf(':') > -1) {
				this._sec.throwError('ArgumentError', Errors.InvalidParamError);
			}
			if (this._connectionName) {
				this._sec.throwError('ArgumentError', Errors.AlreadyConnectedError);
			}
			let result = LocalConnectionService.instance.createConnection(connectionName, this);
			if (result === LocalConnectionConnectResult.AlreadyTaken) {
				this._sec.throwError('ArgumentError', Errors.AlreadyConnectedError);
			}
			this._connectionName = connectionName;
			release || assert(result === LocalConnectionConnectResult.Success);
			if (this._allowedInsecureDomains.length) {
				LocalConnectionService.instance.allowDomains(connectionName, this,
					this._allowedInsecureDomains, false);
			}
			if (this._allowedSecureDomains.length) {
				LocalConnectionService.instance.allowDomains(connectionName, this,
					this._allowedSecureDomains, true);
			}
		}

		send(connectionName: string, methodName: string, ...args: Array<any>): void {
			if (connectionName === null) {
				this._sec.throwError('TypeError', Errors.NullPointerError, 'connectionName');
			}
			if (connectionName === '') {
				this._sec.throwError('TypeError', Errors.EmptyStringError, 'connectionName');
			}
			if (methodName === null) {
				this._sec.throwError('TypeError', Errors.NullPointerError, 'methodName');
			}
			if (methodName === '') {
				this._sec.throwError('TypeError', Errors.EmptyStringError, 'methodName');
			}
			if (forbiddenNames.indexOf(methodName) > -1) {
				this._sec.throwError('ArgumentError', Errors.InvalidParamError);
			}
			let serializedArgs = this._sec.utils.ByteArray.create();
			serializedArgs.writeObject(args);
			if (serializedArgs.length > 40 * 1024) {
				this._sec.throwError('ArgumentError', Errors.ArgumentSizeError);
			}
			let argsBuffer = serializedArgs.getBytes().buffer;
			try {
				LocalConnectionService.instance.send(connectionName, methodName, argsBuffer, this,
					this._domain, this._secure);
			} catch (e) {
				// Not sure what to do here, this shouldn't happen. We'll just ignore it with a warning.
				Debug.warning('Unknown error occurred in LocalConnection#send', e);
			}
		}

		get client(): any {
			return this._client;
		}

		set client(client: any) {
			if (client._sec !== this._sec) {
				this._sec.throwError('ArgumentError', Errors.InvalidParamError);
			}
			this._client = client;
		}

		allowDomain(...domains: string[]): void {
			this._allowDomains(domains, true);
		}

		allowInsecureDomain(...domains: string[]): void {
			// allowInsecureDomain also allows secure domains.
			this._allowDomains(domains, true);
			this._allowDomains(domains, false);
		}

		private _allowDomains(domains: string[], secure: boolean) {
			let result: string[] = [];
			// If no connection has been made yet, store the domains for later retrieval.
			if (!this._connectionName) {
				result = secure ? this._allowedSecureDomains : this._allowedInsecureDomains;
			}
			for (let i = 0; i < domains.length; i++) {
				let domain = domains[i];
				if (typeof domain !== 'string') {
					this._sec.throwError('ArgumentError', Errors.AllowDomainArgumentError);
				}
				if (result.indexOf(domain) === -1) {
					result.push(domain);
				}
			}
			if (this._connectionName) {
				LocalConnectionService.instance.allowDomains(this._connectionName, this, domains, secure);
			}
		}

		public handleMessage(methodName: string, argsBuffer: ArrayBuffer): void {
			let client = this._client;
			let error: system.LegacyError;
			if (!client.axHasPublicProperty(methodName) || forbiddenNames.indexOf(methodName) > -1) {
				// Forbidden names really shouldn't reach this point, but should everything else fail,
				// we just pretend not to have found them here.
				error = <any>this._sec.createError('ReferenceError', Errors.ReadSealedError, methodName,
					client.axClass.name.name);
			} else {
				let handler = client.axGetPublicProperty(methodName);
				if (typeof handler !== 'function') {
					// Non-callable handlers are just ignored.
					return;
				}

				let ba: ByteArray = this._sec.utils.ByteArray.create([argsBuffer]);
				let args: Array<any> = ba.readObject();
				if (!(args instanceof Array)) {
					error =
						<any>this._sec.createError('TypeError', Errors.CheckTypeFailedError, args, 'Array');
				} else {
					try {
						handler.apply(client, args);
					} catch (e) {
						error = e;
					}
				}
			}
			if (!error) {
				return;
			}
			let asyncErrorEventCtor = this._sec.events.AsyncErrorEvent;
			let errorEvent = asyncErrorEventCtor.create(['asyncError', false, false,
				'Error #2095: flash.net.LocalConnection was' +
				' unable to invoke' +
				' callback ' + methodName + '.', error]);
			if (this.hasEventListener('asyncError')) {
				try {
					this.dispatchEvent(errorEvent);
				} catch (e) {
					console.warn("Exception encountered during asyncErrorEvent handling in " +
						"LocalConnection sender.");
				}
			} else {
				// TODO: add the error to the LoaderInfo#uncaughtErrorEvents list.
				console.warn('No handler for asyncError on LocalConnection sender, not sending event',
					errorEvent);
			}
		}

		get domain(): string {
			return this._domain;
		}

		get isPerUser(): boolean {
			// We always return true, because everything else would be a lie.
			return true;
		}

		set isPerUser(newValue: boolean) {
			!!newValue;
			// Ignored. See
			// https://blogs.adobe.com/simplicity/2009/08/localconnectionisperuser_in_ai.html for an
			// explanation.
		}
	}
}

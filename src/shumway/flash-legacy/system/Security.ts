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
// Class: Security
module Shumway.flash.system {
	import notImplemented = Shumway.Debug.notImplemented;
	import somewhatImplemented = Shumway.Debug.somewhatImplemented;

	export class Security extends LegacyEntity {
		constructor() {
			super();
		}

		// JS -> AS Bindings
		static REMOTE: string = "remote";
		static LOCAL_WITH_FILE: string = "localWithFile";
		static LOCAL_WITH_NETWORK: string = "localWithNetwork";
		static LOCAL_TRUSTED: string = "localTrusted";
		static APPLICATION: string = "application";


		// AS -> JS Bindings
		private static _exactSettings: boolean = false;
		// static _disableAVM1Loading: boolean;
		private static _sandboxType: string = 'remote';

		// static _pageDomain: string;
		static get exactSettings(): boolean {
			return Security._exactSettings;
		}

		static set exactSettings(value: boolean) {
			value = !!value;
			Security._exactSettings = value;
		}

		static get disableAVM1Loading(): boolean {
			release || notImplemented("public flash.system.Security::get disableAVM1Loading");
			return false;
			// return Security._disableAVM1Loading;
		}

		static set disableAVM1Loading(value: boolean) {
			value = !!value;
			release || notImplemented("public flash.system.Security::set disableAVM1Loading");
			return;
			// Security._disableAVM1Loading = value;
		}

		static get sandboxType(): string {
			release || somewhatImplemented("public flash.system.Security::get sandboxType");
			return Security._sandboxType;
		}

		static get pageDomain(): string {
			release || somewhatImplemented("public flash.system.Security::get pageDomain");
			// TODO: convert this to proper URI parsing.
			let pageHost: string = Shumway.FileLoadingService.instance.resolveUrl('/');
			let parts = pageHost.split('/');
			parts.pop();
			return parts.pop();
		}

		static allowDomain(): void {
			release || somewhatImplemented('public flash.system.Security::static allowDomain ["' +
				Array.prototype.join.call(arguments, '", "') + '"]');
			let whitelist: ICrossDomainSWFLoadingWhitelist = system.currentDomain().player;
			for (let i = 0; i < arguments.length; i++) {
				whitelist.addToSWFLoadingWhitelist(arguments[i] || '', false, false);
			}
		}

		static allowInsecureDomain(): void {
			release || somewhatImplemented("public flash.system.Security::static allowInsecureDomain");
			let whitelist: ICrossDomainSWFLoadingWhitelist = system.currentDomain().player;
			for (let i = 0; i < arguments.length; i++) {
				whitelist.addToSWFLoadingWhitelist(arguments[i]|| '', true, false);
			}
		}

		static loadPolicyFile(url: string): void {
			release || somewhatImplemented("public flash.system.Security::static loadPolicyFile");
		}

		static showSettings(panel: string = "default"): void {
			release || notImplemented("public flash.system.Security::static showSettings");
			return;
		}

		static duplicateSandboxBridgeInputArguments(toplevel: any, args: Array<any>): Array<any> {
			toplevel = toplevel;
			args = args;
			release || notImplemented("public flash.system.Security::static duplicateSandboxBridgeInputArguments");
			return null;
		}

		static duplicateSandboxBridgeOutputArgument(toplevel: any, arg: any): any {
			toplevel = toplevel;
			release || notImplemented("public flash.system.Security::static duplicateSandboxBridgeOutputArgument");
			return;
		}

	}

	export const enum CrossDomainSWFLoadingWhitelistResult {
		/**
		 * The requested domain belongs to the same domain as SWF's.
		 */
		OwnDomain = 0,
		/**
		 * The requested domain belongs to the other domain than SWF's.
		 */
		Remote = 1,
		/**
		 * The requested domain is not whitelisted.
		 */
		Failed = 2
	}

	export interface ICrossDomainSWFLoadingWhitelist {
		addToSWFLoadingWhitelist(domain: string, insecure: boolean, ownDomain: boolean): void;

		checkDomainForSWFLoading(domain: string): CrossDomainSWFLoadingWhitelistResult;
	}
}

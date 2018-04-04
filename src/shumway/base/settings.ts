/*
 * Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

///<reference path='references.ts' />

module Shumway {
	export module Settings {
		export let ROOT: string = "Shumway Options";
		export let shumwayOptions = new Options.OptionSet(ROOT);

		export function setSettings(settings: any) {
			shumwayOptions.setSettings(settings);
		}

		export function getSettings() {
			return shumwayOptions.getSettings();
		}
	}
	import Option = Shumway.Options.Option;
	import OptionSet = Shumway.Options.OptionSet;

	import shumwayOptions = Shumway.Settings.shumwayOptions;

	export let loggingOptions = shumwayOptions.register(new OptionSet("Logging Options"));

	export let omitRepeatedWarnings = loggingOptions.register(new Option("wo", "warnOnce",
		"boolean", true,
		'Omit Repeated Warnings'));
}

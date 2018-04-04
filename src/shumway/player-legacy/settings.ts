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

module Shumway {
	import Option = Shumway.Options.Option;
	import OptionSet = Shumway.Options.OptionSet;

	import shumwayOptions = Shumway.Settings.shumwayOptions;

	export let playerOptions = shumwayOptions.register(new OptionSet("Player Options"));

	export let frameEnabledOption = playerOptions.register(
		new Shumway.Options.Option("enableFrames", "Enable Frame Execution", "boolean", true, "Enable frame execution.")
	);

	export let timerEnabledOption = playerOptions.register(
		new Shumway.Options.Option("enableTimers", "Enable Timers", "boolean", true, "Enable timer events.")
	);

	export let pumpEnabledOption = playerOptions.register(
		new Shumway.Options.Option("enablePump", "Enable Pump", "boolean", true, "Enable display tree serialization.")
	);

	export let pumpRateOption = playerOptions.register(
		new Shumway.Options.Option("pumpRate", "Pump Rate", "number", 60, "Number of times / second that the display list is synchronized.", {
			range: {
				min: 1,
				max: 120,
				step: 1
			}
		})
	);

	export let frameRateOption = playerOptions.register(
		new Shumway.Options.Option("frameRate", "Frame Rate", "number", -1, "Override a movie's frame rate, set to -1 to use the movies default frame rate.", {
			range: {
				min: -1,
				max: 120,
				step: 1
			}
		})
	);

	export let tracePlayerOption = playerOptions.register(
		new Shumway.Options.Option("tp", "Trace Player", "number", 0, "Trace player every n frames.", {
			range: {
				min: 0,
				max: 512,
				step: 1
			}
		})
	);

	export let traceMouseEventOption = playerOptions.register(
		new Shumway.Options.Option("tme", "Trace Mouse Events", "boolean", false, "Trace mouse events.")
	);

	export let frameRateMultiplierOption = playerOptions.register(
		new Shumway.Options.Option("", "Frame Rate Multiplier", "number", 1, "Play frames at a faster rate.", {
			range: {
				min: 1,
				max: 16,
				step: 1
			}
		})
	);

	export let dontSkipFramesOption = playerOptions.register(
		new Shumway.Options.Option("", "Disables Frame Skipping", "boolean", false, "Play all frames, e.g. no skipping frame during throttle.")
	);

	export let playAllSymbolsOption = playerOptions.register(
		new Shumway.Options.Option("", "Play Symbols", "boolean", false, "Plays all SWF symbols automatically.")
	);

	export let playSymbolOption = playerOptions.register(
		new Shumway.Options.Option("", "Play Symbol Number", "number", 0, "Select symbol by Id.", {
			range: {
				min: 0,
				max: 20000,
				step: 1
			}
		})
	);

	export let playSymbolFrameDurationOption = playerOptions.register(
		new Shumway.Options.Option("", "Play Symbol Duration", "number", 0, "How many frames to play, 0 for all frames of the movie clip.", {
			range: {
				min: 0,
				max: 128,
				step: 1
			}
		})
	);

	export let playSymbolCountOption = playerOptions.register(
		new Shumway.Options.Option("", "Play Symbol Count", "number", -1, "Select symbol count.", {
			range: {
				min: -1,
				max: 20000,
				step: 1
			}
		})
	);
}

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

/**
 * Option and Argument Management
 *
 * Options are configuration settings sprinkled throughout the code. They can be grouped into sets of
 * options called |OptionSets| which can form a hierarchy of options. For instance:
 *
 * let set = new OptionSet();
 * let opt = set.register(new Option("v", "verbose", "boolean", false, "Enables verbose logging."));
 *
 * creates an option set with one option in it. The option can be changed directly using |opt.value = true| or
 * automatically using the |ArgumentParser|:
 *
 * let parser = new ArgumentParser();
 * parser.addBoundOptionSet(set);
 * parser.parse(["-v"]);
 *
 * The |ArgumentParser| can also be used directly:
 *
 * let parser = new ArgumentParser();
 * argumentParser.addArgument("h", "help", "boolean", {parse: function (x) {
 *   printUsage();
 * }});
 */

///<reference path='references.ts' />
module Shumway.Options {
	import isObject = Shumway.isObject;
	import isNullOrUndefined = Shumway.isNullOrUndefined;
	import assert = Shumway.Debug.assert;

	export class Argument {
		shortName: string;
		longName: string;
		type: any;
		options: any;
		positional: boolean;
		parseFn: any;
		value: any;

		constructor(shortName: string, longName: string, type: any, options: any) {
			this.shortName = shortName;
			this.longName = longName;
			this.type = type;
			options = options || {};
			this.positional = options.positional;
			this.parseFn = options.parse;
			this.value = options.defaultValue;
		}

		public parse(value: any) {
			if (this.type === "boolean") {
				release || assert(typeof value === "boolean");
				this.value = value;
			} else if (this.type === "number") {
				release || assert(!isNaN(value), value + " is not a number");
				this.value = parseInt(value, 10);
			} else {
				this.value = value;
			}
			if (this.parseFn) {
				this.parseFn(this.value);
			}
		}
	}

	export class ArgumentParser {
		args: any [];

		constructor() {
			this.args = [];
		}

		public addArgument(shortName: string, longName: string, type: any, options: any) {
			let argument = new Argument(shortName, longName, type, options);
			this.args.push(argument);
			return argument;
		}

		public addBoundOption(option: any) {
			let options = {
				parse: function (x: any) {
					option.value = x;
				}
			};
			this.args.push(new Argument(option.shortName, option.longName, option.type, options));
		}

		public addBoundOptionSet(optionSet: any) {
			let self = this;
			optionSet.options.forEach(function (x: any) {
				if (OptionSet.isOptionSet(x)) {
					self.addBoundOptionSet(x);
				} else {
					release || assert(x);
					self.addBoundOption(x);
				}
			});
		}

		public getUsage() {
			let str = "";
			this.args.forEach(function (x) {
				if (!x.positional) {
					str += "[-" + x.shortName + "|--" + x.longName + (x.type === "boolean" ? "" : " " + x.type[0].toUpperCase()) + "]";
				} else {
					str += x.longName;
				}
				str += " ";
			});
			return str;
		}

		public parse(args: any) {
			let nonPositionalArgumentMap: MapObject<any> = {};
			let positionalArgumentList: Array<any> = [];
			this.args.forEach(function (x: any) {
				if (x.positional) {
					positionalArgumentList.push(x);
				} else {
					nonPositionalArgumentMap["-" + x.shortName] = x;
					nonPositionalArgumentMap["--" + x.longName] = x;
				}
			});

			let leftoverArguments = [];

			while (args.length) {
				let argString = args.shift();
				let argument = null, value = argString;
				if (argString == '--') {
					leftoverArguments = leftoverArguments.concat(args);
					break;
				} else if (argString.slice(0, 1) == '-' || argString.slice(0, 2) == '--') {
					argument = nonPositionalArgumentMap[argString];
					// release || assert(argument, "Argument " + argString + " is unknown.");
					if (!argument) {
						continue;
					}
					if (argument.type !== "boolean") {
						value = args.shift();
						release || assert(value !== "-" && value !== "--", "Argument " + argString + " must have a value.");
					} else {
						if (args.length && ["yes", "no", "true", "false", "t", "f"].indexOf(args[0]) >= 0) {
							value = ["yes", "true", "t"].indexOf(args.shift()) >= 0;
						} else {
							value = true;
						}
					}
				} else if (positionalArgumentList.length) {
					argument = positionalArgumentList.shift();
				} else {
					leftoverArguments.push(value);
				}
				if (argument) {
					argument.parse(value);
				}
			}
			release || assert(positionalArgumentList.length === 0, "Missing positional arguments.");
			return leftoverArguments;
		}
	}

	export class OptionSet {
		name: string;
		settings: any;
		options: any;
		open: boolean = false;

		public static isOptionSet(obj: any): boolean {
			// We will be getting options from different iframe, so this function will
			// check if the obj somewhat like OptionSet.
			if (obj instanceof OptionSet) {
				return true;
			}
			if (typeof obj !== 'object' || obj === null ||
				obj instanceof Option) {
				return false;
			}
			return ('options' in obj) && ('name' in obj) && ('settings' in obj);
		}

		constructor(name: string, settings: any = null) {
			this.name = name;
			this.settings = settings || {};
			this.options = [];
		}

		public register(option: any) {
			if (OptionSet.isOptionSet(option)) {
				// check for duplicate option sets (bail if found)
				for (let i = 0; i < this.options.length; i++) {
					let optionSet = this.options[i];
					if (OptionSet.isOptionSet(optionSet) && optionSet.name === option.name) {
						return optionSet;
					}
				}
			}
			this.options.push(option);
			if (this.settings) {
				if (OptionSet.isOptionSet(option)) {
					let optionSettings = this.settings[option.name];
					if (isObject(optionSettings)) {
						option.settings = optionSettings.settings;
						option.open = optionSettings.open;
					}
				} else {
					// build_bundle chokes on this:
					// if (!isNullOrUndefined(this.settings[option.longName])) {
					if (typeof this.settings[option.longName] !== "undefined") {
						switch (option.type) {
							case "boolean":
								option.value = !!this.settings[option.longName];
								break;
							case "number":
								option.value = +this.settings[option.longName];
								break;
							default:
								option.value = this.settings[option.longName];
								break;
						}
					}
				}
			}
			return option;
		}

		public trace(writer: any) {
			writer.enter(this.name + " {");
			this.options.forEach(function (option: any) {
				option.trace(writer);
			});
			writer.leave("}");
		}

		public getSettings() {
			let settings: MapObject<any> = {};
			this.options.forEach(function (option: any) {
				if (OptionSet.isOptionSet(option)) {
					settings[option.name] = {
						settings: option.getSettings(),
						open: option.open
					};
				} else {
					settings[option.longName] = option.value;
				}
			});
			return settings;
		}

		public setSettings(settings: any) {
			if (!settings) {
				return;
			}
			this.options.forEach(function (option: any) {
				if (OptionSet.isOptionSet(option)) {
					if (option.name in settings) {
						option.setSettings(settings[option.name].settings);
					}
				} else {
					if (option.longName in settings) {
						option.value = settings[option.longName];
					}
				}
			});
		}
	}

	export class Option {
		longName: string;
		shortName: string;
		type: string;
		defaultValue: any;
		value: any; // during options merge can be changed to accessor
		description: string;
		config: any;
		/**
		 * Dat GUI control.
		 */
			// TODO remove, player will not have access to the DOM
		ctrl: any;
		// config:
		//  { range: { min: 1, max: 5, step: 1 } }
		//  { list: [ "item 1", "item 2", "item 3" ] }
		//  { choices: { "choice 1": 1, "choice 2": 2, "choice 3": 3 } }
		constructor(shortName: string, longName: string, type: string, defaultValue: any,
		            description: string, config: any = null) {
			this.longName = longName;
			this.shortName = shortName;
			this.type = type;
			this.defaultValue = defaultValue;
			this.value = defaultValue;
			this.description = description;
			this.config = config;
		}

		public parse(value: any) {
			this.value = value;
		}

		public trace(writer: any) {
			writer.writeLn(("-" + this.shortName + "|--" + this.longName).padRight(" ", 30) +
				" = " + this.type + " " + this.value + " [" + this.defaultValue + "]" +
				" (" + this.description + ")");
		}
	}
}

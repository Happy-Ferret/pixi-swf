module Shumway.SWF {
	import Option = Shumway.Options.Option;
	import OptionSet = Shumway.Options.OptionSet;

	import shumwayOptions = Shumway.Settings.shumwayOptions;

	export let parserOptions = shumwayOptions.register(new OptionSet("Parser Options"));

	export let traceLevel = parserOptions.register(new Option("parsertracelevel",
		"Parser Trace Level", "number", 0,
		"Parser Trace Level"));
}

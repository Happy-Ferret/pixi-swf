module Shumway.flash.system {
	export class UINamespace extends LegacyNamespace {
		constructor() {
			super();
		}

		Mouse = new MouseClass();
		ContextMenu = new LegacyClass<ui.ContextMenu>(ui.ContextMenu);
		ContextMenuBuiltInItems = new LegacyClass<ui.ContextMenuBuiltInItems>(ui.ContextMenuBuiltInItems);
		ContextMenuClipboardItems = new LegacyClass<ui.ContextMenuClipboardItems>(ui.ContextMenuClipboardItems);
	}
}

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


module Shumway.GFX {
	import Option = Shumway.Options.Option;
	import OptionSet = Shumway.Options.OptionSet;

	import shumwayOptions = Shumway.Settings.shumwayOptions;

	let rendererOptions = shumwayOptions.register(new OptionSet("Renderer Options"));
	export let imageUpdateOption = rendererOptions.register(new Option("", "imageUpdate", "boolean", true, "Enable image updating."));
	export let imageConvertOption = rendererOptions.register(new Option("", "imageConvert", "boolean", true, "Enable image conversion."));
	export let stageOptions = shumwayOptions.register(new OptionSet("Stage Renderer Options"));
	export let forcePaint = stageOptions.register(new Option("", "forcePaint", "boolean", false, "Force repainting."));
	export let ignoreViewport = stageOptions.register(new Option("", "ignoreViewport", "boolean", false, "Cull elements outside of the viewport."));
	export let viewportLoupeDiameter = stageOptions.register(new Option("", "viewportLoupeDiameter", "number", 256, "Size of the viewport loupe.", {
		range: {
			min: 1,
			max: 1024,
			step: 1
		}
	}));
	export let disableClipping = stageOptions.register(new Option("", "disableClipping", "boolean", false, "Disable clipping."));
	export let debugClipping = stageOptions.register(new Option("", "debugClipping", "boolean", false, "Disable clipping."));
	export let hud = stageOptions.register(new Option("", "hud", "boolean", false, "Enable HUD."));

	let canvas2DOptions = stageOptions.register(new OptionSet("Canvas2D Options"));
	export let clipDirtyRegions = canvas2DOptions.register(new Option("", "clipDirtyRegions", "boolean", false, "Clip dirty regions."));
	export let clipCanvas = canvas2DOptions.register(new Option("", "clipCanvas", "boolean", false, "Clip Regions."));
	export let cull = canvas2DOptions.register(new Option("", "cull", "boolean", false, "Enable culling."));


	export let snapToDevicePixels = canvas2DOptions.register(new Option("", "snapToDevicePixels", "boolean", false, ""));
	export let imageSmoothing = canvas2DOptions.register(new Option("", "imageSmoothing", "boolean", false, ""));
	export let masking = canvas2DOptions.register(new Option("", "masking", "boolean", true, "Composite Mask."));
	export let blending = canvas2DOptions.register(new Option("", "blending", "boolean", true, ""));
	export let debugLayers = canvas2DOptions.register(new Option("", "debugLayers", "boolean", false, ""));
	export let filters = canvas2DOptions.register(new Option("", "filters", "boolean", true, ""));
	export let cacheShapes = canvas2DOptions.register(new Option("", "cacheShapes", "boolean", true, ""));
	export let cacheShapesMaxSize = canvas2DOptions.register(new Option("", "cacheShapesMaxSize", "number", 256, "", {
		range: {
			min: 1,
			max: 1024,
			step: 1
		}
	}));
	export let cacheShapesThreshold = canvas2DOptions.register(new Option("", "cacheShapesThreshold", "number", 256, "", {
		range: {
			min: 1,
			max: 1024,
			step: 1
		}
	}));
}
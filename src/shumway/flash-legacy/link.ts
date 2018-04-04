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

namespace Shumway.flash.system  {
	function M(name: string, asClass: any) {
		lang.registerNativeClass(name, asClass);
	}

	M("flash.display.DisplayObject", flash.display.DisplayObject);
	M("flash.display.InteractiveObject", flash.display.InteractiveObject);
	M("flash.display.DisplayObjectContainer", flash.display.DisplayObjectContainer);
	M("flash.display.Sprite", flash.display.Sprite);
	M("flash.display.MovieClip", flash.display.MovieClip);
	M("flash.display.Shape", flash.display.Shape);
	M("flash.display.Bitmap", flash.display.Bitmap);
	M("flash.display.BitmapData", flash.display.BitmapData);
	M("flash.display.Stage", flash.display.Stage);
	M("flash.display.Loader", flash.display.Loader);
	M("flash.display.LoaderInfo", flash.display.LoaderInfo);
	M("flash.display.Graphics", flash.display.Graphics);
	M("flash.display.SimpleButton", flash.display.SimpleButton);
	M("flash.display.MorphShape", flash.display.MorphShape);
	M("flash.display.NativeMenu", flash.display.NativeMenu);
	M("flash.display.NativeMenuItem", flash.display.NativeMenuItem);
	M("flash.display.FrameLabel", flash.display.FrameLabel);
	M("flash.display.Scene", flash.display.Scene);
	M("flash.display.AVM1Movie", flash.display.AVM1Movie);

	M("flash.display.GradientType", flash.display.GradientType);
	M("flash.display.SpreadMethod", flash.display.SpreadMethod);
	M("flash.display.InterpolationMethod", flash.display.InterpolationMethod);
	M("flash.display.LineScaleMode", flash.display.LineScaleMode);
	M("flash.display.CapsStyle", flash.display.CapsStyle);
	M("flash.display.JointStyle", flash.display.JointStyle);

	M("flash.filters.BevelFilter", flash.filters.BevelFilter);
	M("flash.filters.BitmapFilter", flash.filters.BitmapFilter);
	M("flash.filters.BlurFilter", flash.filters.BlurFilter);
	M("flash.filters.ColorMatrixFilter", flash.filters.ColorMatrixFilter);
	M("flash.filters.ConvolutionFilter", flash.filters.ConvolutionFilter);
	M("flash.filters.DisplacementMapFilter", flash.filters.DisplacementMapFilter);
	M("flash.filters.DropShadowFilter", flash.filters.DropShadowFilter);
	M("flash.filters.GlowFilter", flash.filters.GlowFilter);
	M("flash.filters.GradientBevelFilter", flash.filters.GradientBevelFilter);
	M("flash.filters.GradientGlowFilter", flash.filters.GradientGlowFilter);

	M("flash.geom.Point", flash.geom.Point);
	M("flash.geom.Rectangle", flash.geom.Rectangle);
	M("flash.geom.Matrix", flash.geom.Matrix);
	M("flash.geom.Matrix3D", flash.geom.Matrix3D);
	M("flash.geom.Vector3D", flash.geom.Vector3D);
	M("flash.geom.Transform", flash.geom.Transform);
	M("flash.geom.ColorTransform", flash.geom.ColorTransform);
	M("flash.geom.PerspectiveProjection", flash.geom.PerspectiveProjection);

	M("flash.events.EventDispatcher", flash.events.EventDispatcher);
	M("flash.events.Event", flash.events.Event);
	M("flash.events.ErrorEvent", flash.events.ErrorEvent);
	M("flash.events.IOErrorEvent", flash.events.IOErrorEvent);
	M("flash.events.KeyboardEvent", flash.events.KeyboardEvent);
	M("flash.events.MouseEvent", flash.events.MouseEvent);
	M("flash.events.GestureEvent", flash.events.GestureEvent);
	M("flash.events.TextEvent", flash.events.TextEvent);
	M("flash.events.TimerEvent", flash.events.TimerEvent);
	M("flash.events.ProgressEvent", flash.events.ProgressEvent);
	M("flash.events.StatusEvent", flash.events.StatusEvent);
	M("flash.events.NetStatusEvent", flash.events.NetStatusEvent);
	M("flash.events.HTTPStatusEvent", flash.events.HTTPStatusEvent);
	M("flash.events.AsyncErrorEvent", flash.events.AsyncErrorEvent);
	M("flash.events.UncaughtErrorEvents", flash.events.UncaughtErrorEvents);

	M("flash.external.ExternalInterface", flash.external.ExternalInterface);

	M("flash.ui.ContextMenu", flash.ui.ContextMenu);
	M("flash.ui.ContextMenuItem", flash.ui.ContextMenuItem);
	M("flash.ui.ContextMenuBuiltInItems", flash.ui.ContextMenuBuiltInItems);
	M("flash.ui.ContextMenuClipboardItems", flash.ui.ContextMenuClipboardItems);
	M("flash.ui.Keyboard", flash.ui.Keyboard);
	M("flash.ui.Mouse", flash.ui.Mouse);
	M("flash.ui.MouseCursorData", flash.ui.MouseCursorData);

	M("flash.ui.GameInput", flash.ui.GameInput);
	M("flash.events.GameInputEvent", flash.events.GameInputEvent);
	M("flash.ui.GameInputControl", flash.ui.GameInputControl);
	M("flash.ui.GameInputControlType", flash.ui.GameInputControlType);
	M("flash.ui.GameInputDevice", flash.ui.GameInputDevice);
	M("flash.ui.GameInputFinger", flash.ui.GameInputFinger);
	M("flash.ui.GameInputHand", flash.ui.GameInputHand);
	M("flash.ui.Multitouch", flash.ui.Multitouch);
	M("flash.ui.MultitouchInputMode", flash.ui.MultitouchInputMode);
	M("flash.events.TouchEvent", flash.events.TouchEvent);

	M("flash.text.Font", flash.text.Font);
	M("flash.text.TextField", flash.text.TextField);
	M("flash.text.StaticText", flash.text.StaticText);
	M("flash.text.StyleSheet", flash.text.StyleSheet);
	M("flash.text.TextFormat", flash.text.TextFormat);
	M("flash.text.TextRun", flash.text.TextRun);
	M("flash.text.TextSnapshot", flash.text.TextSnapshot);
	M("flash.text.TextLineMetrics", flash.text.TextLineMetrics);

	M("flash.media.Sound", flash.media.Sound);
	M("flash.media.SoundChannel", flash.media.SoundChannel);
	M("flash.media.SoundMixer", flash.media.SoundMixer);
	M("flash.media.SoundTransform", flash.media.SoundTransform);
	M("flash.media.Video", flash.media.Video);
	M("flash.media.StageVideo", flash.media.StageVideo);
	M("flash.media.ID3Info", flash.media.ID3Info);
	M("flash.media.Microphone", flash.media.Microphone);
	M("flash.media.Camera", flash.media.Camera);

	M("flash.net.FileFilter", flash.net.FileFilter);
	M("flash.net.FileReference", flash.net.FileReference);
	M("flash.net.FileReferenceList", flash.net.FileReferenceList);
	M("flash.net.NetConnection", flash.net.NetConnection);
	M("flash.net.NetStream", flash.net.NetStream);
	M("flash.net.NetStreamInfo", flash.net.NetStreamInfo);
	M("flash.net.Responder", flash.net.Responder);
	M("flash.net.URLRequest", flash.net.URLRequest);
	M("flash.net.URLRequestHeader", flash.net.URLRequestHeader);
	M("flash.net.URLStream", flash.net.URLStream);
	M("flash.net.URLLoader", flash.net.URLLoader);
	M("flash.net.SharedObject", flash.net.SharedObject);
	M("flash.net.ObjectEncoding", flash.net.ObjectEncoding);
	M("flash.net.LocalConnection", flash.net.LocalConnection);
	M("flash.net.Socket", flash.net.Socket);
	M("flash.net.URLVariables", flash.net.URLVariables);

	M("flash.system.Capabilities", flash.system.Capabilities);
	M("flash.system.Security", flash.system.Security);
	// @ivanpopelyshev: System
	// M("flash.system.System", flash.system.System);
	M("flash.system.SecurityDomain", flash.system.SecurityDomain);
	M("flash.system.ApplicationDomain", flash.system.ApplicationDomain);
	M("flash.system.JPEGLoaderContext", flash.system.JPEGLoaderContext);
	M("flash.system.LoaderContext", flash.system.LoaderContext);

	M("flash.accessibility.Accessibility", flash.accessibility.Accessibility);
	M("flash.accessibility.AccessibilityProperties", flash.accessibility.AccessibilityProperties);

	M("flash.utils.Timer", flash.utils.Timer);
	M("flash.utils.ByteArray", flash.utils.ByteArray);

	// @ivanpopelyshev: XML
	// M("flash.xml.XMLNode", flash.xml.XMLNode);
	// M("flash.xml.XMLDocument", flash.xml.XMLDocument);

	// registerNativeFunction('flash.system.fscommand', flash.system.fscommand);

	export function constructClassFromSymbol(symbol: Timeline.Symbol, axClass: LegacyClass) {
		system._currentSymbol = symbol;
		const instance = axClass.create();
		release || Debug.assert(instance._symbol === symbol);
		return instance;
	}
}

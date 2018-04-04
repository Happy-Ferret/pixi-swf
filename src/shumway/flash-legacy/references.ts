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

///<reference path='lang/lazy.ts'/>
///<reference path='lang/nat.ts'/>
///<reference path='module.ts' />
///<reference path='../htmlparser.ts' />
///<reference path='TextContent.ts' />
///<reference path='settings.ts' />
///<reference path='symbol.ts' />

///<reference path='geom/Matrix.ts' />
///<reference path='geom/Matrix3D.ts' />
///<reference path='geom/Orientation3D.ts' />
///<reference path='geom/PerspectiveProjection.ts' />
///<reference path='geom/Point.ts' />
///<reference path='geom/Rectangle.ts' />
///<reference path='geom/Transform.ts' />
///<reference path='geom/Utils3D.ts' />
///<reference path='geom/Vector3D.ts' />

///<reference path='accessibility/Accessibility.ts' />
///<reference path='accessibility/AccessibilityImplementation.ts' />
///<reference path='accessibility/AccessibilityProperties.ts' />

///<reference path='events/Event.ts' />
///<reference path='events/EventDispatcher.ts' />
///<reference path='events/EventPhase.ts' />
///<reference path='events/TextEvent.ts' />
///<reference path='events/ErrorEvent.ts' />
///<reference path='events/AsyncErrorEvent.ts' />
///<reference path='events/GameInputEvent.ts' />
///<reference path='events/GestureEvent.ts' />
///<reference path='events/HTTPStatusEvent.ts' />
///<reference path='events/IEventDispatcher.ts' />
///<reference path='events/IOErrorEvent.ts' />
///<reference path='events/KeyboardEvent.ts' />
///<reference path='events/MouseEvent.ts' />
///<reference path='events/NetStatusEvent.ts' />
///<reference path='events/ProgressEvent.ts' />
///<reference path='events/SecurityErrorEvent.ts' />
///<reference path='events/StatusEvent.ts' />
///<reference path='events/TimerEvent.ts' />
///<reference path='events/TouchEvent.ts' />
///<reference path='events/UncaughtErrorEvent.ts' />
///<reference path='events/UncaughtErrorEvents.ts' />

///<reference path='display/DisplayObject.ts' />
///<reference path='display/Bitmap.ts' />
///<reference path='display/graphics/Shape.ts' />
///<reference path='display/InteractiveObject.ts' />
///<reference path='display/SimpleButton.ts' />
///<reference path='display/DisplayObjectContainer.ts' />
///<reference path='display/enums/JointStyle.ts' />
///<reference path='display/enums/CapsStyle.ts' />
///<reference path='display/enums/LineScaleMode.ts' />
///<reference path='display/enums/GradientType.ts' />
///<reference path='display/enums/SpreadMethod.ts' />
///<reference path='display/enums/InterpolationMethod.ts' />
///<reference path='display/graphics/GraphicsBitmapFill.ts' />
///<reference path='display/graphics/GraphicsEndFill.ts' />
///<reference path='display/graphics/GraphicsGradientFill.ts' />
///<reference path='display/graphics/GraphicsPath.ts' />
///<reference path='display/enums/GraphicsPathCommand.ts' />
///<reference path='display/enums/GraphicsPathWinding.ts' />
// ///<reference path='display/GraphicsShaderFill.ts' />
///<reference path='display/graphics/GraphicsSolidFill.ts' />
///<reference path='display/graphics/GraphicsStroke.ts' />
///<reference path='display/graphics/GraphicsTrianglePath.ts' />
///<reference path='display/graphics/IDrawCommand.ts' />
///<reference path='display/graphics/IGraphicsData.ts' />
///<reference path='display/graphics/IGraphicsFill.ts' />
///<reference path='display/graphics/IGraphicsPath.ts' />
///<reference path='display/graphics/IGraphicsStroke.ts' />
///<reference path='display/graphics/Graphics.ts' />
///<reference path='display/Sprite.ts' />
///<reference path='display/MovieClip.ts' />
///<reference path='display/MovieClipSoundStream.ts' />
///<reference path='display/Stage.ts' />

///<reference path='display/enums/ActionScriptVersion.ts' />
///<reference path='display/enums/BlendMode.ts' />
///<reference path='display/enums/ColorCorrection.ts' />
///<reference path='display/enums/ColorCorrectionSupport.ts' />
///<reference path='display/enums/FocusDirection.ts' />
///<reference path='display/FrameLabel.ts' />
///<reference path='display/BitmapData.ts' />
///<reference path='display/enums/BitmapDataChannel.ts' />
///<reference path='display/enums/BitmapEncodingColorSpace.ts' />
///<reference path='display/IBitmapDrawable.ts' />
///<reference path='display/JPEGEncoderOptions.ts' />
// ///<reference path='display/JPEGXREncoderOptions.ts' />
///<reference path='display/Loader.ts' />
///<reference path='display/LoaderInfo.ts' />
///<reference path='display/graphics/MorphShape.ts' />
///<reference path='display/NativeMenu.ts' />
///<reference path='display/NativeMenuItem.ts' />
///<reference path='display/PNGEncoderOptions.ts' />
///<reference path='display/enums/PixelSnapping.ts' />
///<reference path='display/enums/SWFVersion.ts' />
///<reference path='display/Scene.ts' />
// ///<reference path='display/Shader.ts' />
// ///<reference path='display/ShaderData.ts' />
// ///<reference path='display/ShaderInput.ts' />
// ///<reference path='display/ShaderJob.ts' />
// ///<reference path='display/ShaderParameter.ts' />
// ///<reference path='display/ShaderParameterType.ts' />
// ///<reference path='display/ShaderPrecision.ts' />
// ///<reference path='display/Stage3D.ts' />
///<reference path='display/enums/StageAlign.ts' />
///<reference path='display/enums/StageDisplayState.ts' />
///<reference path='display/enums/StageQuality.ts' />
///<reference path='display/enums/StageScaleMode.ts' />
///<reference path='display/enums/TriangleCulling.ts' />
///<reference path='display/AVM1Movie.ts' />

///<reference path='external/ExternalInterface.ts' />

///<reference path='filters/BitmapFilterQuality.ts' />
///<reference path='filters/BitmapFilterType.ts' />
///<reference path='filters/BitmapFilter.ts' />
///<reference path='filters/BevelFilter.ts' />
///<reference path='filters/BlurFilter.ts' />
///<reference path='filters/ColorMatrixFilter.ts' />
///<reference path='filters/ConvolutionFilter.ts' />
///<reference path='filters/DisplacementMapFilterMode.ts' />
///<reference path='filters/DisplacementMapFilter.ts' />
///<reference path='filters/DropShadowFilter.ts' />
///<reference path='filters/GlowFilter.ts' />
///<reference path='filters/GradientBevelFilter.ts' />
///<reference path='filters/GradientGlowFilter.ts' />
///<reference path='geom/ColorTransform.ts' />

///<reference path='media/Camera.ts' />
///<reference path='media/ID3Info.ts' />
///<reference path='media/Microphone.ts' />
///<reference path='media/Sound.ts' />
///<reference path='media/SoundChannel.ts' />
///<reference path='media/SoundLoaderContext.ts' />
///<reference path='media/SoundMixer.ts' />
///<reference path='media/SoundTransform.ts' />
///<reference path='media/StageVideo.ts' />
///<reference path='media/StageVideoAvailability.ts' />
///<reference path='media/Video.ts' />
///<reference path='media/VideoStreamSettings.ts' />

///<reference path='net/FileFilter.ts' />
///<reference path='net/FileReference.ts' />
///<reference path='net/FileReferenceList.ts' />
///<reference path='net/LocalConnection.ts' />
///<reference path='net/NetConnection.ts' />
///<reference path='net/NetStream.ts' />
///<reference path='net/NetStreamInfo.ts' />
///<reference path='net/NetStreamMulticastInfo.ts' />
///<reference path='net/NetStreamPlayOptions.ts' />
///<reference path='net/Responder.ts' />
///<reference path='net/SharedObject.ts' />
///<reference path='net/Socket.ts' />
///<reference path='net/URLLoader.ts' />
///<reference path='net/URLRequest.ts' />
///<reference path='net/URLRequestHeader.ts' />
///<reference path='net/URLStream.ts' />
///<reference path='net/URLVariables.ts' />

///<reference path='system/ApplicationDomain.ts' />
///<reference path='system/Capabilities.ts' />
///<reference path='system/FSCommand.ts' />
///<reference path='system/ImageDecodingPolicy.ts' />
///<reference path='system/LoaderContext.ts' />
///<reference path='system/JPEGLoaderContext.ts' />
///<reference path='system/MessageChannel.ts' />
///<reference path='system/MessageChannelState.ts' />
///<reference path='system/Security.ts' />
///<reference path='system/SecurityDomain.ts' />
///<reference path='system/SecurityPanel.ts' />
///<reference path='system/TouchscreenType.ts' />

///<reference path='text/AntiAliasType.ts' />
// ///<reference path='text/CSMSettings.ts' />
///<reference path='text/FontStyle.ts' />
///<reference path='text/FontType.ts' />
///<reference path='text/Font.ts' />
///<reference path='text/GridFitType.ts' />
///<reference path='text/StaticText.ts' />
///<reference path='text/StyleSheet.ts' />
// ///<reference path='text/TextColorType.ts' />
///<reference path='text/TextDisplayMode.ts' />
// ///<reference path='text/TextExtent.ts' />
///<reference path='text/TextField.ts' />
///<reference path='text/TextFieldAutoSize.ts' />
///<reference path='text/TextFieldType.ts' />
///<reference path='text/TextFormat.ts' />
///<reference path='text/TextFormatAlign.ts' />
///<reference path='text/TextFormatDisplay.ts' />
///<reference path='text/TextInteractionMode.ts' />
///<reference path='text/TextLineMetrics.ts' />
// ///<reference path='text/TextRenderer.ts' />
///<reference path='text/TextRun.ts' />
///<reference path='text/TextSnapshot.ts' />

///<reference path='trace/Trace.ts' />

///<reference path='ui/ContextMenu.ts' />
///<reference path='ui/ContextMenuBuiltInItems.ts' />
///<reference path='ui/ContextMenuClipboardItems.ts' />
///<reference path='ui/ContextMenuItem.ts' />
///<reference path='ui/GameInput.ts' />
///<reference path='ui/GameInputControl.ts' />
///<reference path='ui/GameInputControlType.ts' />
///<reference path='ui/GameInputDevice.ts' />
///<reference path='ui/GameInputFinger.ts' />
///<reference path='ui/GameInputHand.ts' />
///<reference path='ui/Keyboard.ts' />
///<reference path='ui/Mouse.ts' />
///<reference path='ui/MouseCursor.ts' />
///<reference path='ui/MouseCursorData.ts' />
///<reference path='ui/Multitouch.ts' />
///<reference path='ui/MultitouchInputMode.ts' />

///<reference path='utils/Endian.ts' />
///<reference path='utils/IExternalizable.ts' />
///<reference path='utils/Timer.ts' />
///<reference path='utils/SetIntervalTimer.ts' />

///<reference path='system/SecurityDomain.ts'/>
///<reference path='statics/EventsNamespace.ts'/>
///<reference path='statics/UtilsNamespace.ts'/>
///<reference path='statics/GeomNamespace.ts'/>
///<reference path='statics/DisplayNamespace.ts'/>
///<reference path='statics/SystemNamespace.ts'/>
///<reference path='statics/TextNamespace.ts'/>
///<reference path='statics/FiltersNamespace.ts'/>
///<reference path='statics/MediaNamespace.ts'/>
///<reference path='statics/NetNamespace.ts'/>
///<reference path='statics/UINamespace.ts'/>
///<reference path='statics/LoaderClass.ts'/>
///<reference path='statics/MouseClass.ts'/>

///<reference path='link.ts' />

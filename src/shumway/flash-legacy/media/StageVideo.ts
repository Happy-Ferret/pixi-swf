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
// Class: StageVideo
module Shumway.flash.media {
	import notImplemented = Shumway.Debug.notImplemented;

	export class StageVideo extends flash.events.EventDispatcher {
		constructor() {
			super();
		}

		// JS -> AS Bindings


		// AS -> JS Bindings

		// _viewPort: flash.geom.Rectangle;
		// _pan: flash.geom.Point;
		// _zoom: flash.geom.Point;
		// _depth: number /*int*/;
		// _videoWidth: number /*int*/;
		// _videoHeight: number /*int*/;
		// _colorSpaces: any /*ASVector*/;
		get viewPort(): flash.geom.Rectangle {
			release || notImplemented("public flash.media.StageVideo::get viewPort");
			return null;
			// return this._viewPort;
		}

		set viewPort(rect: flash.geom.Rectangle) {
			rect = rect;
			release || notImplemented("public flash.media.StageVideo::set viewPort");
			return;
			// this._viewPort = rect;
		}

		get pan(): flash.geom.Point {
			release || notImplemented("public flash.media.StageVideo::get pan");
			return null;
			// return this._pan;
		}

		set pan(point: flash.geom.Point) {
			point = point;
			release || notImplemented("public flash.media.StageVideo::set pan");
			return;
			// this._pan = point;
		}

		get zoom(): flash.geom.Point {
			release || notImplemented("public flash.media.StageVideo::get zoom");
			return null;
			// return this._zoom;
		}

		set zoom(point: flash.geom.Point) {
			point = point;
			release || notImplemented("public flash.media.StageVideo::set zoom");
			return;
			// this._zoom = point;
		}

		get depth(): number /*int*/ {
			release || notImplemented("public flash.media.StageVideo::get depth");
			return 0;
			// return this._depth;
		}

		set depth(depth: number /*int*/) {
			depth = depth | 0;
			release || notImplemented("public flash.media.StageVideo::set depth");
			return;
			// this._depth = depth;
		}

		get videoWidth(): number /*int*/ {
			release || notImplemented("public flash.media.StageVideo::get videoWidth");
			return 0;
			// return this._videoWidth;
		}

		get videoHeight(): number /*int*/ {
			release || notImplemented("public flash.media.StageVideo::get videoHeight");
			return 0;
			// return this._videoHeight;
		}

		get colorSpaces(): Float64Array {
			release || notImplemented("public flash.media.StageVideo::get colorSpaces");
			return null;
			// return this._colorSpaces;
		}

		attachNetStream(netStream: flash.net.NetStream): void {
			netStream = netStream;
			release || notImplemented("public flash.media.StageVideo::attachNetStream");
			return;
		}

		attachCamera(theCamera: flash.media.Camera): void {
			theCamera = theCamera;
			release || notImplemented("public flash.media.StageVideo::attachCamera");
			return;
		}
	}
}

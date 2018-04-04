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
// Class: VideoStreamSettings
module Shumway.flash.media {
	export class VideoStreamSettings extends LegacyEntity {
		constructor() {
			super();
		}

		// JS -> AS Bindings

		width: number /*int*/;
		height: number /*int*/;
		fps: number;
		quality: number /*int*/;
		bandwidth: number /*int*/;
		keyFrameInterval: number /*int*/;
		codec: string;
		setMode: (width: number /*int*/, height: number /*int*/, fps: number) => void;
		setQuality: (bandwidth: number /*int*/, quality: number /*int*/) => void;
		setKeyFrameInterval: (keyFrameInterval: number /*int*/) => void;

		// AS -> JS Bindings

		// _width: number /*int*/;
		// _height: number /*int*/;
		// _fps: number;
		// _quality: number /*int*/;
		// _bandwidth: number /*int*/;
		// _keyFrameInterval: number /*int*/;
		// _codec: string;
	}
}

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
// Class: Scene
module Shumway.flash.display {
	export class Scene extends LegacyEntity {
		constructor(name: string, labels: FrameLabel[], offset: number, numFrames: number /*int*/) {
			super();
			this._name = name;
			// Note: creating Scene objects in ActionScript, while possible, is undocumented and entirely
			// useless. Luckily, that also means that they're not very carefully implemented.
			// Specifically, the `labels` array isn't cloned during construction or when returned from
			// the getter. I.e., it can be modified freely.
			this._labels = labels;
			this.offset = offset;
			this._numFrames = numFrames | 0;
		}

		_name: string;
		offset: number;
		_numFrames: number /*int*/;
		_labels: FrameLabel[];

		get name(): string {
			return this._name;
		}

		get labels(): FrameLabel[] {
			return this._labels;
		}

		get numFrames(): number {
			return this._numFrames;
		}

		clone(): Scene {
			let labels_ = this._labels.map(function (label: FrameLabel) {
				return label.clone();
			});
			return this._sec.display.Scene.create([this._name, labels_,
				this.offset, this._numFrames]);
		}

		getLabelByName(name: string, ignoreCase: boolean): FrameLabel {
			if (ignoreCase) {
				name = name.toLowerCase();
			}
			let labels = this._labels;
			for (let i = 0; i < labels.length; i++) {
				let label = labels[i];
				if (ignoreCase ? label.name.toLowerCase() === name : label.name === name) {
					return label;
				}
			}
			return null;
		}

		getLabelByFrame(frame: number): FrameLabel {
			let labels = this._labels;
			for (let i = 0; i < labels.length; i++) {
				let label = labels[i];
				if (label.frame === frame) {
					return label;
				}
			}
			return null;
		}
	}
}

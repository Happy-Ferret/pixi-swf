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
// Class: PerspectiveProjection
module Shumway.flash.geom {
	import somewhatImplemented = Shumway.Debug.somewhatImplemented;

	/**
	 * Initial values for the projection as used in Flash. Only for `root` will a different center
	 * be used: constructing an instance manually will get 250,250.
	 */
	export const enum DefaultPerspectiveProjection {
		FOV = 55,
		CenterX = 250,
		CenterY = 250,
	}

	export class PerspectiveProjection extends LegacyEntity {

		constructor() {
			super();
			this._fieldOfView = DefaultPerspectiveProjection.FOV;
			this._centerX = DefaultPerspectiveProjection.CenterX;
			this._centerY = DefaultPerspectiveProjection.CenterY;
		}

		_displayObject: flash.display.DisplayObject;
		_fieldOfView: number;
		_centerX: number;
		_centerY: number;

		get fieldOfView(): number {
			release || somewhatImplemented("public flash.geom.PerspectiveProjection::get fieldOfView");
			return this._displayObject ?
				this._displayObject._perspectiveProjectionFOV :
				this._fieldOfView;
		}

		set fieldOfView(fieldOfViewAngleInDegrees: number) {
			fieldOfViewAngleInDegrees = +fieldOfViewAngleInDegrees;
			release || somewhatImplemented("public flash.geom.PerspectiveProjection::set fieldOfView");
			if (this._displayObject) {
				this._displayObject._perspectiveProjectionFOV = fieldOfViewAngleInDegrees;
			} else {
				this._fieldOfView = fieldOfViewAngleInDegrees;
			}
		}

		get projectionCenter(): flash.geom.Point {
			release || somewhatImplemented("public flash.geom.PerspectiveProjection::get projectionCenter");
			let centerX: number;
			let centerY: number;
			if (this._displayObject) {
				centerX = this._displayObject._perspectiveProjectionCenterX;
				centerY = this._displayObject._perspectiveProjectionCenterY;
			} else {
				centerX = this._centerX;
				centerY = this._centerY;
			}
			return this._sec.geom.Point.create([centerX, centerY]);
		}

		set projectionCenter(p: flash.geom.Point) {
			release || somewhatImplemented("public flash.geom.PerspectiveProjection::set projectionCenter");
			if (this._displayObject) {
				this._displayObject._perspectiveProjectionCenterX = +p.x;
				this._displayObject._perspectiveProjectionCenterY = +p.y;
			} else {
				this._centerX = +p.x;
				this._centerY = +p.y;
			}
		}

		get focalLength(): number {
			release || somewhatImplemented("public flash.geom.PerspectiveProjection::get focalLength");
			let fov: number;
			let centerX: number;

			if (this._displayObject) {
				fov = this._displayObject._perspectiveProjectionFOV;
				centerX = this._displayObject._perspectiveProjectionCenterX;
			} else {
				fov = this._fieldOfView;
				centerX = this._centerX;
			}
			return 1 / Math.tan(fov * Math.PI / 180 / 2) * centerX;
		}

		set focalLength(value: number) {
			value = +value;
			release || somewhatImplemented("public flash.geom.PerspectiveProjection::set focalLength");
			let centerX = this._displayObject ?
				this._displayObject._perspectiveProjectionCenterX :
				this._centerX;
			let fov = 2 * Math.atan(centerX / value);
			if (this._displayObject) {
				this._displayObject._perspectiveProjectionFOV = fov;
			} else {
				this._fieldOfView = fov;
			}
		}

		toMatrix3D(): flash.geom.Matrix3D {
			release || somewhatImplemented("public flash.geom.PerspectiveProjection::toMatrix3D");
			return this._sec.geom.Matrix3D.create();
		}

		clone(): PerspectiveProjection {
			return this._sec.geom.PerspectiveProjection.clone(this);
		}
	}
}

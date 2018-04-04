module Shumway.flash.system {

	// static fabric
	export class PerspectiveProjectionClass extends LegacyClass<geom.PerspectiveProjection> {
		FromDisplayObject(displayObject: display.DisplayObject) {
			release || Debug.assert(displayObject);
			let projection: geom.PerspectiveProjection = this.create();
			projection._displayObject = displayObject;
			return projection;
		}

		clone(this_: geom.PerspectiveProjection): geom.PerspectiveProjection {
			let clone: geom.PerspectiveProjection = this.createObject();
			clone._fieldOfView = this_._fieldOfView;
			clone._centerX = this_._centerX;
			clone._centerY = this_._centerY;
			clone._displayObject = this_._displayObject;
			return clone;
		}
	}

	export class Matrix3DClass extends LegacyClass<geom.Matrix3D> {
		FromArray(matrix: any) {
			let mat = Object.create(this.jsClass.prototype);
			mat._matrix = new Float32Array(matrix);
			mat._sec = this._sec;
			return mat;
		}
	}

	export class MatrixClass extends LegacyClass<geom.Matrix> {
		public clone(this_: geom.Matrix): geom.Matrix {
			let m = this_._data;
			return this.create([m[0], m[1], m[2], m[3], m[4], m[5]]);
		}

		public FromUntyped(object: any): geom.Matrix {
			return this.create([object.a, object.b, object.c, object.d,
				object.tx, object.ty]);
		}

		// Keep in sync with writeExternal below!
		public FromDataBuffer(input: ArrayUtilities.DataBuffer) {
			return this.create([input.readFloat(), input.readFloat(),
				input.readFloat(), input.readFloat(),
				input.readFloat(), input.readFloat()]);
		}
	}

	export class PointClass extends LegacyClass<geom.Point> {
		public clone(this_: geom.Point): geom.Point {
			return this.create([this_.x, this_.y]);
		}

		public interpolate(p1: geom.Point, p2: geom.Point, f: number): geom.Point {
			let f1: number = 1 - f;
			return this.create([p1.x * f + p2.x * f1, p1.y * f + p2.y * f1]);
		}

		public distance(p1: geom.Point, p2: geom.Point): number {
			let dx = p2.x - p1.x;
			let dy = p2.y - p1.y;
			return (dx === 0) ? Math.abs(dy) : (dy === 0) ? Math.abs(dx) : Math.sqrt(dx * dx + dy * dy);
		}

		public polar(length: number, angle: number): geom.Point {
			length = +length;
			angle = +angle;
			return this.create([length * Math.cos(angle),
				length * Math.sin(angle)]);
		}
	}

	export class RectangleClass extends LegacyClass<geom.Rectangle> {
		FromBounds(bounds: Bounds) {
			let xMin = bounds.xMin;
			let yMin = bounds.yMin;
			return this.create([xMin / 20, yMin / 20,
				(bounds.xMax - xMin) / 20,
				(bounds.yMax - yMin) / 20]);
		}

		public clone(this_: geom.Rectangle): geom.Rectangle {
			return this.create([this_.x, this_.y, this_.width, this_.height]);
		}
	}

	export class ColorTransformClass extends LegacyClass<geom.ColorTransform> {
		clone(this_: geom.ColorTransform) {
			return this.create([
				this_.redMultiplier,
				this_.greenMultiplier,
				this_.blueMultiplier,
				this_.alphaMultiplier,
				this_.redOffset,
				this_.greenOffset,
				this_.blueOffset,
				this_.alphaOffset
			]);
		}
	}

	export class GeomNamespace {
		constructor() {
			this.Point = new PointClass(geom.Point);
			this.Matrix = new MatrixClass(geom.Matrix);
			this.Matrix3D = new Matrix3DClass(geom.Matrix3D);
			this.PerspectiveProjection = new PerspectiveProjectionClass(geom.PerspectiveProjection);
			this.Rectangle = new RectangleClass(geom.Rectangle);
			this.ColorTransform = new ColorTransformClass(geom.ColorTransform);
			this.Vector3D = new LegacyClass<geom.Vector3D>(geom.Vector3D);
			this.Transform = new LegacyClass(geom.Transform);

			this._temporaryRectangle = new geom.Rectangle();
			this.FROZEN_IDENTITY_MATRIX = Object.freeze(this.Matrix.create());
			this.TEMP_MATRIX = this.Matrix.create();

			this.FROZEN_IDENTITY_COLOR_TRANSFORM = Object.freeze(this.ColorTransform.create());
			this.TEMP_COLOR_TRANSFORM = this.ColorTransform.create();
		}

		Point: PointClass;
		Matrix: MatrixClass;
		Matrix3D: Matrix3DClass;
		PerspectiveProjection: PerspectiveProjectionClass;
		Rectangle: RectangleClass;
		ColorTransform: ColorTransformClass;
		Transform: LegacyClass<geom.Transform>;
		Vector3D: LegacyClass<geom.Vector3D>;

		/**
		 * Temporary rectangle that is used to prevent allocation.
		 */
		_temporaryRectangle: geom.Rectangle;

		FROZEN_IDENTITY_MATRIX: geom.Matrix;

		// Must only be used in cases where the members are fully initialized and then directly used.
		TEMP_MATRIX: geom.Matrix;

		FROZEN_IDENTITY_COLOR_TRANSFORM: geom.ColorTransform;

		// Must only be used in cases where the members are fully initialized and then directly used.
		TEMP_COLOR_TRANSFORM: geom.ColorTransform;


	}
}
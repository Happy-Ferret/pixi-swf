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
// Class: Point
module Shumway.flash.geom {
	export class Point extends LegacyEntity {
		constructor(x: number = 0, y: number = 0) {
			super();
			this.x = +x;
			this.y = +y;
		}

		public x: number;
		public y: number;

		public set native_x(x: number) {
			this.x = x;
		}

		public get native_x(): number {
			return this.x;
		}

		public set native_y(y: number) {
			this.y = y;
		}

		public get native_y(): number {
			return this.y;
		}

		public Point(x: number = 0, y: number = 0) {
			this.x = x;
			this.y = y;
		}

		public get length(): number {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		}

		public static interpolate(p1: Point, p2: Point, f: number): Point {
			return system._currentDomain.geom.Point.interpolate(p1, p2, f);
		}

		public static distance(p1: Point, p2: Point): number {
			let dx = p2.x - p1.x;
			let dy = p2.y - p1.y;
			return (dx === 0) ? Math.abs(dy) : (dy === 0) ? Math.abs(dx) : Math.sqrt(dx * dx + dy * dy);
		}

		public static polar(length: number, angle: number): Point {
			return system._currentDomain.geom.Point.polar(length, angle);
		}

		public clone(): Point {
			return this._sec.geom.Point.clone(this);
		}

		public offset(dx: number, dy: number): void {
			this.x += +dx;
			this.y += +dy;
		}

		public equals(toCompare: Point): Boolean {
			return this.x === toCompare.x && this.y === toCompare.y;
		}

		public subtract(v: Point): Point {
			return this._sec.geom.Point.create([this.x - v.x, this.y - v.y]);
		}

		public add(v: Point): Point {
			return this._sec.geom.Point.create([this.x + v.x, this.y + v.y]);
		}

		public normalize(thickness: number): void {
			if (this.x !== 0 || this.y !== 0) {
				let relativeThickness: number = +thickness / this.length;
				this.x *= relativeThickness;
				this.y *= relativeThickness;
			}
		}

		public copyFrom(sourcePoint: Point): void {
			this.x = sourcePoint.x;
			this.y = sourcePoint.y;
		}

		public setTo(x: number, y: number): void {
			this.x = +x;
			this.y = +y;
		}

		public toTwips(): Point {
			this.x = (this.x * 20) | 0;
			this.y = (this.y * 20) | 0;
			return this;
		}

		public toPixels(): Point {
			this.x /= 20;
			this.y /= 20;
			return this;
		}

		public round(): Point {
			this.x = Math.round(this.x);
			this.y = Math.round(this.y);
			return this;
		}

		public toString(): string {
			return "(x=" + this.x + ", y=" + this.y + ")";
		}
	}
}

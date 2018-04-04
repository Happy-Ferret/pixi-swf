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
// Class: Rectangle
module Shumway.flash.geom {
	import notImplemented = Shumway.Debug.notImplemented;
	import Bounds = Shumway.Bounds;

	export class Rectangle extends LegacyEntity implements flash.utils.IExternalizable {
		public x: number;
		public y: number;
		public width: number;
		public height: number;

		constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
			super();
			x = +x;
			y = +y;
			width = +width;
			height = +height;
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
		}

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

		public set native_width(width: number) {
			this.width = +width;
		}

		public get native_width(): number {
			return this.width;
		}

		public set native_height(height: number) {
			this.height = +height;
		}

		public get native_height(): number {
			return this.height;
		}

		public get left(): number {
			return this.x;
		}

		public set left(value: number) {
			value = +value;
			this.width += this.x - value;
			this.x = value;
		}

		public get right(): number {
			return this.x + this.width;
		}

		public set right(value: number) {
			value = +value;
			this.width = value - this.x;
		}

		public get top(): number {
			return this.y;
		}

		public set top(value: number) {
			value = +value;
			this.height += this.y - value;
			this.y = value;
		}

		public get bottom(): number {
			return this.y + this.height;
		}

		public set bottom(value: number) {
			value = +value;
			this.height = value - this.y;
		}

		public get topLeft(): Point {
			return this._sec.geom.Point.create([this.left, this.top]);
		}

		public set topLeft(value: Point) {
			this.top = value.y;
			this.left = value.x;
		}

		public get bottomRight(): Point {
			return this._sec.geom.Point.create([this.right, this.bottom]);
		}

		public set bottomRight(value: Point) {
			this.bottom = value.y;
			this.right = value.x;
		}

		public get size(): Point {
			return this._sec.geom.Point.create([this.width, this.height]);
		}

		public set size(value: Point) {
			this.width = value.x;
			this.height = value.y;
		}

		public get area(): number {
			return this.width * this.height;
		}

		public clone(): Rectangle {
			return this._sec.geom.Rectangle.clone(this);
		}

		public isEmpty(): boolean {
			return this.width <= 0 || this.height <= 0;
		}

		public setEmpty(): Rectangle {
			this.x = 0;
			this.y = 0;
			this.width = 0;
			this.height = 0;
			return this;
		}

		public inflate(dx: number, dy: number): void {
			dx = +dx;
			dy = +dy;
			this.x -= dx;
			this.y -= dy;
			this.width += (dx * 2);
			this.height += (dy * 2);
		}

		public inflatePoint(point: Point): void {
			this.inflate(point.x, point.y);
		}

		public offset(dx: number, dy: number): void {
			this.x += +dx;
			this.y += +dy;
		}

		public offsetPoint(point: Point): void {
			this.offset(point.x, point.y);
		}

		public contains(x: number, y: number): boolean {
			x = +x;
			y = +y;
			return x >= this.x && x < this.right &&
				y >= this.y && y < this.bottom;
		}

		public containsPoint(point: Point): boolean {
			return this.contains(point.x, point.y);
		}

		public containsRect(rect: Rectangle): boolean {
			let r1 = rect.x + rect.width;
			let b1 = rect.y + rect.height;
			let r2 = this.x + this.width;
			let b2 = this.y + this.height;
			return (rect.x >= this.x) &&
				(rect.x < r2) &&
				(rect.y >= this.y) &&
				(rect.y < b2) &&
				(r1 > this.x) &&
				(r1 <= r2) &&
				(b1 > this.y) &&
				(b1 <= b2);
		}

		public intersection(toIntersect: Rectangle): Rectangle {
			return this.clone().intersectInPlace(toIntersect);
		}

		public intersects(toIntersect: Rectangle): boolean {
			return Math.max(this.x, toIntersect.x) <= Math.min(this.right, toIntersect.right) &&
				Math.max(this.y, toIntersect.y) <= Math.min(this.bottom, toIntersect.bottom);
		}

		public intersectInPlace(clipRect: Rectangle): Rectangle {
			let x0 = this.x;
			let y0 = this.y;
			let x1 = clipRect.x;
			let y1 = clipRect.y;
			let l = Math.max(x0, x1);
			let r = Math.min(x0 + this.width, x1 + clipRect.width);
			if (l <= r) {
				let t = Math.max(y0, y1);
				let b = Math.min(y0 + this.height, y1 + clipRect.height);
				if (t <= b) {
					this.setTo(l, t, r - l, b - t);
					return this;
				}
			}
			this.setEmpty();
			return this;
		}

		public intersectInPlaceInt32(clipRect: Rectangle): Rectangle {
			let x0 = this.x | 0;
			let y0 = this.y | 0;
			let w0 = this.width | 0;
			let h0 = this.height | 0;
			let x1 = clipRect.x | 0;
			let w1 = clipRect.width | 0;
			let l = Math.max(x0, x1) | 0;
			let r = Math.min(x0 + w0 | 0, x1 + w1 | 0) | 0;
			if (l <= r) {
				let y1 = clipRect.y | 0;
				let h1 = clipRect.height | 0;
				let t = Math.max(y0, y1) | 0;
				let b = Math.min(y0 + h0 | 0, y1 + h1 | 0);
				if (t <= b) {
					this.setTo(l, t, r - l, b - t);
					return this;
				}
			}
			this.setEmpty();
			return this;
		}

		public union(toUnion: Rectangle): Rectangle {
			return this.clone().unionInPlace(toUnion);
		}

		public unionInPlace(toUnion: Rectangle): Rectangle {
			if (toUnion.isEmpty()) {
				return this;
			}
			if (this.isEmpty()) {
				this.copyFrom(toUnion);
				return this;
			}
			let l: number = Math.min(this.x, toUnion.x);
			let t: number = Math.min(this.y, toUnion.y);
			this.setTo(l, t,
				Math.max(this.right, toUnion.right) - l,
				Math.max(this.bottom, toUnion.bottom) - t);
			return this;
		}

		public equals(toCompare: Rectangle): boolean {
			return this === toCompare ||
				this.x === toCompare.x && this.y === toCompare.y
				&& this.width === toCompare.width && this.height === toCompare.height;
		}

		public copyFrom(sourceRect: Rectangle): void {
			this.x = sourceRect.x;
			this.y = sourceRect.y;
			this.width = sourceRect.width;
			this.height = sourceRect.height;
		}

		public setTo(x: number, y: number, width: number, height: number): void {
			this.x = +x;
			this.y = +y;
			this.width = +width;
			this.height = +height;
		}

		public toTwips(): Rectangle {
			this.x = (this.x * 20) | 0;
			this.y = (this.y * 20) | 0;
			this.width = (this.width * 20) | 0;
			this.height = (this.height * 20) | 0;
			return this;
		}

		public getBaseWidth(angle: number) {
			let u = Math.abs(Math.cos(angle));
			let v = Math.abs(Math.sin(angle));
			return u * this.width + v * this.height;
		}

		public getBaseHeight(angle: number) {
			let u = Math.abs(Math.cos(angle));
			let v = Math.abs(Math.sin(angle));
			return v * this.width + u * this.height;
		}

		public toPixels(): Rectangle {
			this.x /= 20;
			this.y /= 20;
			this.width /= 20;
			this.height /= 20;
			return this;
		}

		public snapInPlace(): Rectangle {
			let x1 = Math.ceil(this.x + this.width);
			let y1 = Math.ceil(this.y + this.height);
			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);
			this.width = x1 - this.x;
			this.height = y1 - this.y;
			return this;
		}

		public roundInPlace(): Rectangle {
			let x1 = Math.round(this.x + this.width);
			let y1 = Math.round(this.y + this.height);
			this.x = Math.round(this.x);
			this.y = Math.round(this.y);
			this.width = x1 - this.x;
			this.height = y1 - this.y;
			return this;
		}

		public toString(): string {
			return "(x=" + this.x + ", y=" + this.y + ", w=" + this.width + ", h=" + this.height + ")";
		}

		public hashCode(): number {
			let hash = 0;
			hash += this.x * 20 | 0;
			hash *= 37;
			hash += this.y * 20 | 0;
			hash *= 37;
			hash += this.width * 20 | 0;
			hash *= 37;
			hash += this.height * 20 | 0;
			return hash;
		}

		public writeExternal(output: flash.utils.IDataOutput) {
			output.writeFloat(this.x);
			output.writeFloat(this.y);
			output.writeFloat(this.width);
			output.writeFloat(this.height);
		}

		public readExternal(input: flash.utils.IDataInput) {
			this.x = input.readFloat();
			this.y = input.readFloat();
			this.width = input.readFloat();
			this.height = input.readFloat();
		}
	}
}

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

/// <reference path='module.ts' />
/// <reference path='utilities.ts' />
/// <reference path='settings.ts'/>
/// <reference path='geometry.ts'/>
/// <reference path='regionAllocator.ts'/>
/// <reference path='nodes.ts'/>
/// <reference path='renderables/renderables.ts'/>
/// <reference path='filters.ts'/>

/*interface CanvasPattern {
    setTransform: (matrix: SVGMatrix) => void;
}*/

interface CanvasGradient {
	setTransform: (matrix: SVGMatrix) => void;
}

interface CanvasRenderingContext2D {
	stackDepth: number;

	fill(path: Path2D, fillRule?: string): void;

	clip(path: Path2D, fillRule?: string): void;

	stroke(path: Path2D): void;

	imageSmoothingEnabled: boolean
	mozImageSmoothingEnabled: boolean
	msImageSmoothingEnabled: boolean

	fillRule: string;
	mozFillRule: string;

	enterBuildingClippingRegion(): void;

	leaveBuildingClippingRegion(): void;
}

interface Path2D {
	/*constructor();
	constructor(path: Path2D);
	constructor(paths: Path2D[], fillRule?: string);
	constructor(d: any);*/

	addPath(path: Path2D, transform?: SVGMatrix): void;
}

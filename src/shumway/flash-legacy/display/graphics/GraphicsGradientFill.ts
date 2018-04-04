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
// Class: GraphicsGradientFill
module Shumway.flash.display {
	export class GraphicsGradientFill extends LegacyEntity implements IGraphicsFill, IGraphicsData {
		constructor(type = GradientType.LINEAR, colors: Array<number> = null, alphas: Array<number> = null,
		            ratios: Array<number> = null, matrix: any = null, spreadMethod = SpreadMethod.PAD,
		            interpolationMethod = InterpolationMethod.RGB, focalPointRatio: number = 0) {
			super();
			this.type = type;
			this.colors = colors;
			this.alphas = alphas;
			this.ratios = ratios;
			this.matrix = matrix;
			this.spreadMethod = spreadMethod;
			this.interpolationMethod = interpolationMethod;
			this.focalPointRatio = +focalPointRatio;
		}
		colors: Array<number>;
		alphas: Array<number>
		ratios: Array<number>
		matrix: flash.geom.Matrix;
		focalPointRatio: number;
		type: string;
		spreadMethod: any;
		interpolationMethod: string;
	}
}

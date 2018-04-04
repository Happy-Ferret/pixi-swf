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
// Class: GraphicsShaderFill
module Shumway.flash.display {
	export class GraphicsShaderFill extends LegacyEntity implements IGraphicsFill, IGraphicsData {
		constructor(shader: flash.display.Shader = null, matrix: flash.geom.Matrix = null) {
			super();
			this.shader = shader;
			this.matrix = matrix;
		}

		// JS -> AS Bindings

		shader: flash.display.Shader;
		matrix: flash.geom.Matrix;

		// AS -> JS Bindings

	}
}

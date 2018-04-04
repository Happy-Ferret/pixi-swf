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
// Class: ShaderParameterType
module Shumway.flash.display {
	import notImplemented = Shumway.Debug.notImplemented;
	import axCoerceString = Shumway.AVMX.axCoerceString;

	export enum ShaderParameterType {

		// JS -> AS Bindings
		FLOAT = "float",
		FLOAT2 = "float2",
		FLOAT3 = "float3",
		FLOAT4 = "float4",
		INT = "int",
		INT2 = "int2",
		INT3 = "int3",
		INT4 = "int4",
		BOOL = "bool",
		BOOL2 = "bool2",
		BOOL3 = "bool3",
		BOOL4 = "bool4",
		MATRIX2X2 = "matrix2x2",
		MATRIX3X3 = "matrix3x3",
		MATRIX4X4 = "matrix4x4",


		// AS -> JS Bindings

	}
}

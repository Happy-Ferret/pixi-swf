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

/// <reference path='references.ts'/>
module Shumway.SWF.Parser {
	import assert = Shumway.Debug.assert;

	export function defineButton(tag: ButtonTag, dictionary: any): any {
		let characters = tag.characters;
		let states = {
			up: [] as Array<any>,
			over: [] as Array<any>,
			down: [] as Array<any>,
			hitTest: [] as Array<any>
		};
		let i = 0, character;
		while ((character = characters[i++])) {
			let characterItem = dictionary[character.symbolId];
			// The Flash Player ignores references to undefined symbols here. So should we.
			// TODO: What should happen if the symbol gets defined later in the file?
			if (characterItem) {
				let cmd = {
					symbolId: characterItem.id,
					code: SwfTagCode.CODE_PLACE_OBJECT,
					depth: character.depth,
					flags: character.matrix ? PlaceObjectFlags.HasMatrix : 0,
					matrix: character.matrix
				};
				if (character.flags & ButtonCharacterFlags.StateUp)
					states.up.push(cmd);
				if (character.flags & ButtonCharacterFlags.StateOver)
					states.over.push(cmd);
				if (character.flags & ButtonCharacterFlags.StateDown)
					states.down.push(cmd);
				if (character.flags & ButtonCharacterFlags.StateHitTest)
					states.hitTest.push(cmd);
			} else {
				release || Debug.warning('undefined character in button ' + tag.id);
			}
		}
		let button = {
			type: 'button',
			id: tag.id,
			buttonActions: tag.buttonActions,
			states: states
		};
		return button;
	}
}

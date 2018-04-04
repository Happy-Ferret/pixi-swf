/*
 * Copyright 2015 Mozilla Foundation
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

/// <reference path='references.ts'/>
module Shumway.SWF.Parser.LowLevel {
	function parseBbox(stream: Stream): Bbox {
		stream.align();
		let bits = stream.readUb(5);
		let xMin = stream.readSb(bits);
		let xMax = stream.readSb(bits);
		let yMin = stream.readSb(bits);
		let yMax = stream.readSb(bits);
		stream.align();
		return <Bbox>{xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax};
	}

	export function parseRgb(stream: Stream): number {
		return ((stream.readUi8() << 24) | (stream.readUi8() << 16) |
			(stream.readUi8() << 8) | 0xff) >>> 0;
	}

	function parseRgba(stream: Stream): number {
		return (stream.readUi8() << 24) | (stream.readUi8() << 16) |
			(stream.readUi8() << 8) | stream.readUi8();
	}

	function parseArgb(stream: Stream): number {
		return stream.readUi8() | (stream.readUi8() << 24) |
			(stream.readUi8() << 16) | (stream.readUi8() << 8);
	}

	function parseMatrix(stream: Stream): Matrix {
		let matrix: Matrix = {a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0};
		stream.align();
		let hasScale = stream.readUb(1);
		if (hasScale) {
			let bits = stream.readUb(5);
			matrix.a = stream.readFb(bits);
			matrix.d = stream.readFb(bits);
		}
		let hasRotate = stream.readUb(1);
		if (hasRotate) {
			let bits = stream.readUb(5);
			matrix.b = stream.readFb(bits);
			matrix.c = stream.readFb(bits);
		}
		let bits = stream.readUb(5);
		matrix.tx = stream.readSb(bits);
		matrix.ty = stream.readSb(bits);
		stream.align();
		return matrix;
	}

	function parseColorTransform(stream: Stream, hasAlpha: boolean): ColorTransform {
		let cxform: ColorTransform = {
			redMultiplier: 0xff,
			greenMultiplier: 0xff,
			blueMultiplier: 0xff,
			alphaMultiplier: 0xff,
			redOffset: 0,
			greenOffset: 0,
			blueOffset: 0,
			alphaOffset: 0,
		};
		stream.align();
		let hasOffsets = stream.readUb(1);
		let hasMultipliers = stream.readUb(1);
		let bits = stream.readUb(4);
		if (hasMultipliers) {
			cxform.redMultiplier = stream.readSb(bits);
			cxform.greenMultiplier = stream.readSb(bits);
			cxform.blueMultiplier = stream.readSb(bits);
			if (hasAlpha) {
				cxform.alphaMultiplier = stream.readSb(bits);
			}
		}
		if (hasOffsets) {
			cxform.redOffset = stream.readSb(bits);
			cxform.greenOffset = stream.readSb(bits);
			cxform.blueOffset = stream.readSb(bits);
			if (hasAlpha) {
				cxform.alphaOffset = stream.readSb(bits);
			}
		}
		stream.align();
		return cxform;
	}

	function parsePlaceObjectTag(stream: Stream, swfVersion: number, tagCode: number,
	                             tagEnd: number): PlaceObjectTag {
		let tag: PlaceObjectTag = <any>{code: tagCode};
		tag.actionBlocksPrecedence = stream.pos;
		if (tagCode === SwfTagCode.CODE_PLACE_OBJECT) {
			tag.symbolId = stream.readUi16();
			tag.depth = stream.readUi16();
			tag.flags |= PlaceObjectFlags.HasMatrix;
			tag.matrix = parseMatrix(stream);
			if (stream.pos < tagEnd) {
				tag.flags |= PlaceObjectFlags.HasColorTransform;
				tag.cxform = parseColorTransform(stream, false);
			}
			return tag;
		}
		let flags = tag.flags = tagCode > SwfTagCode.CODE_PLACE_OBJECT2 ?
			stream.readUi16() :
			stream.readUi8();
		tag.depth = stream.readUi16();
		if (flags & PlaceObjectFlags.HasClassName) {
			tag.className = stream.readString(-1);
		}
		if (flags & PlaceObjectFlags.HasCharacter) {
			tag.symbolId = stream.readUi16();
		}
		if (flags & PlaceObjectFlags.HasMatrix) {
			tag.matrix = parseMatrix(stream);
		}
		if (flags & PlaceObjectFlags.HasColorTransform) {
			tag.cxform = parseColorTransform(stream, true);
		}
		if (flags & PlaceObjectFlags.HasRatio) {
			tag.ratio = stream.readUi16();
		}
		if (flags & PlaceObjectFlags.HasName) {
			tag.name = stream.readString(-1);
		}
		if (flags & PlaceObjectFlags.HasClipDepth) {
			tag.clipDepth = stream.readUi16();
		}
		if (flags & PlaceObjectFlags.HasFilterList) {
			let count = stream.readUi8();
			let filters: Filter[] = tag.filters = [];
			while (count--) {
				filters.push(parseFilter(stream));
			}
		}
		if (flags & PlaceObjectFlags.HasBlendMode) {
			tag.blendMode = stream.readUi8();
		}
		if (flags & PlaceObjectFlags.HasCacheAsBitmap) {
			tag.bmpCache = stream.readUi8();
		}
		if (flags & PlaceObjectFlags.HasVisible) {
			tag.visibility = stream.readBool();
		}
		if (flags & PlaceObjectFlags.OpaqueBackground) {
			tag.backgroundColor = parseArgb(stream);
		}
		if (flags & PlaceObjectFlags.HasClipActions) {
			let reserved = stream.readUi16();
			let allFlags = swfVersion >= 6 ? stream.readUi32() : stream.readUi16();
			let allEvents: ClipEvents[] = tag.events = [];
			let events: ClipEvents;
			while (events = parseEvents(stream, swfVersion)) {
				if (stream.pos > tagEnd) {
					Debug.warning('PlaceObject handler attempted to read clip events beyond tag end');
					stream.pos = tagEnd;
					break;
				}
				allEvents.push(events);
			}
			;
		}
		return tag;
	}

	function parseEvents(stream: Stream, swfVersion: number): ClipEvents {
		let flags = swfVersion >= 6 ? stream.readUi32() : stream.readUi16();
		if (!flags) {
			// `true` means this is the EndOfEvents marker.
			return null;
		}
		let events: ClipEvents = <any>{};
		// The Construct event is only allowed in 7+. It can't be set in < 6, so mask it out for 6.
		if (swfVersion === 6) {
			flags = flags & ~AVM1ClipEvents.Construct;
		}
		events.flags = flags;
		let length = stream.readUi32();
		if (flags & AVM1ClipEvents.KeyPress) {
			events.keyCode = stream.readUi8();
			length--;
		}
		let end = stream.pos + length;
		events.actionsBlock = stream.bytes.subarray(stream.pos, end);
		stream.pos = end;
		return events;
	}

	function parseFilter(stream: Stream): Filter {
		let filter: Filter = <any>{};
		let type = filter.type = stream.readUi8();
		let matrix: Array<number>;
		let i;
		switch (type) {
			case 0:
			case 2:
			case 3:
			case 4:
			case 7:
				let glow = <GlowFilter>filter;
				let count: number;
				if (type === 4 || type === 7) {
					count = stream.readUi8();
				} else {
					count = type === 3 ? 2 : 1;
				}
				let colors: number[] = glow.colors = [];
				i = count;
				while (i--) {
					colors.push(parseRgba(stream));
				}
				if (type === 4 || type === 7) {
					let ratios: number[] = glow.ratios = [];
					i = count;
					while (i--) {
						ratios.push(stream.readUi8());
					}
				}
				glow.blurX = stream.readFixed();
				glow.blurY = stream.readFixed();
				if (type !== 2) {
					glow.angle = stream.readFixed();
					glow.distance = stream.readFixed();
				}
				glow.strength = stream.readFixed8();
				glow.inner = !!stream.readUb(1);
				glow.knockout = !!stream.readUb(1);
				glow.compositeSource = !!stream.readUb(1);
				if (type === 3 || type === 4 || type === 7) {
					glow.onTop = !!stream.readUb(1);
					glow.quality = stream.readUb(4);
				} else {
					glow.quality = stream.readUb(5);
				}
				return glow;
			case 1:
				let blur = <BlurFilter>filter;
				blur.blurX = stream.readFixed();
				blur.blurY = stream.readFixed();
				blur.quality = stream.readUb(5);
				stream.readUb(3);
				return blur;
			case 5:
				let conv = <ConvolutionFilter>filter;
				let matrixX = conv.matrixX = stream.readUi8();
				let matrixY = conv.matrixY = stream.readUi8();
				conv.divisor = stream.readFloat();
				conv.bias = stream.readFloat();
				matrix = conv.matrix = [];
				i = matrixX * matrixY;
				while (i--) {
					matrix.push(stream.readFloat());
				}
				conv.color = parseRgba(stream);
				let reserved = stream.readUb(6);
				conv.clamp = !!stream.readUb(1);
				conv.preserveAlpha = !!stream.readUb(1);
				return conv;
			case 6:
				let cm = <ColorMatrixFilter>filter;
				matrix = cm.matrix = [];
				i = 20;
				while (i--) {
					matrix.push(stream.readFloat());
				}
				return cm;
			default:
		}
		return filter;
	}

	function parseRemoveObjectTag(stream: Stream, swfVersion: number,
	                              tagCode: number): RemoveObjectTag {
		let tag: RemoveObjectTag = <any>{code: tagCode};
		if (tagCode === SwfTagCode.CODE_REMOVE_OBJECT) {
			tag.depth = stream.readUi16();
			tag.symbolId = stream.readUi16();
		} else {
			tag.depth = stream.readUi16();
		}
		return tag;
	}

	export function parseDefineImageTag(stream: Stream, swfVersion: number, tagCode: number,
	                                    tagEnd: number, jpegTables: Uint8Array): ImageTag {
		let tag: ImageTag = <any>{code: tagCode};
		tag.id = stream.readUi16();
		let imgData: Uint8Array;
		if (tagCode > SwfTagCode.CODE_DEFINE_BITS_JPEG2) {
			let alphaDataOffset = stream.readUi32();
			if (tagCode === SwfTagCode.CODE_DEFINE_BITS_JPEG4) {
				tag.deblock = stream.readFixed8();
			}
			alphaDataOffset += stream.pos;
			imgData = tag.imgData = stream.bytes.subarray(stream.pos, alphaDataOffset);
			tag.alphaData = stream.bytes.subarray(alphaDataOffset, tagEnd);
			stream.pos = tagEnd;
		} else {
			imgData = tag.imgData = stream.bytes.subarray(stream.pos, tagEnd);
			stream.pos = tagEnd;
		}
		switch (imgData[0] << 8 | imgData[1]) {
			case 65496:
			case 65497:
				tag.mimeType = "image/jpeg";
				break;
			case 35152:
				tag.mimeType = "image/png";
				break;
			case 18249:
				tag.mimeType = "image/gif";
				break;
			default:
				tag.mimeType = "application/octet-stream";
		}
		if (tagCode === SwfTagCode.CODE_DEFINE_BITS) {
			tag.jpegTables = {data: jpegTables};
		}
		return tag;
	}

	function parseDefineButtonTag(stream: Stream, swfVersion: number, tagCode: number,
	                              tagEnd: number): ButtonTag {
		let tag: ButtonTag = <any>{code: tagCode};
		tag.id = stream.readUi16();
		let characters: ButtonCharacter[] = tag.characters = [];
		let character: ButtonCharacter;
		if (tagCode == SwfTagCode.CODE_DEFINE_BUTTON) {
			while (character = parseButtonCharacter(stream, swfVersion, tagCode)) {
				characters.push(character);
			}
			tag.actionsData = stream.bytes.subarray(stream.pos, tagEnd);
			stream.pos = tagEnd;
		} else {
			let trackFlags = stream.readUi8();
			tag.trackAsMenu = !!(trackFlags >> 7 & 1);
			let actionOffset = stream.readUi16();
			while (character = parseButtonCharacter(stream, swfVersion, tagCode)) {
				characters.push(character);
			}
			;
			if (!!actionOffset) {
				let buttonActions: Array<any> = tag.buttonActions = [];
				while (stream.pos < tagEnd) {
					let action = parseButtonCondAction(stream, tagEnd);
					// Ignore actions that exceed the tag length.
					if (stream.pos > tagEnd) {
						break;
					}
					buttonActions.push(action);
				}
				stream.pos = tagEnd;
			}
		}
		return tag;
	}

	function parseButtonCharacter(stream: Stream, swfVersion: number,
	                              tagCode: number): ButtonCharacter {
		let flags = stream.readUi8();
		if (!flags) {
			return null;
		}
		let character: ButtonCharacter = <any>{};
		if (swfVersion < 8) {
			// Clear HasBlendMode and HasFilterList flags.
			flags &= ~(PlaceObjectFlags.HasBlendMode | PlaceObjectFlags.HasFilterList);
		}
		character.flags = flags;
		character.symbolId = stream.readUi16();
		character.depth = stream.readUi16();
		character.matrix = parseMatrix(stream);
		if (tagCode === SwfTagCode.CODE_DEFINE_BUTTON2) {
			character.cxform = parseColorTransform(stream, true);
		}
		if (character.flags & ButtonCharacterFlags.HasFilterList) {
			let count = stream.readUi8();
			let filters: Filter[] = character.filters = [];
			let i = count;
			while (i--) {
				filters.push(parseFilter(stream));
			}
		}
		if (character.flags & ButtonCharacterFlags.HasBlendMode) {
			character.blendMode = stream.readUi8();
		}
		return character;
	}

	function parseButtonCondAction(stream: Stream, tagEnd: number): ButtonCondAction {
		let start = stream.pos;
		let tagSize = stream.readUi16();
		// If no tagSize is given, read to the tag's end.
		let end = tagSize ? start + tagSize : tagEnd;
		let conditions = stream.readUi16();
		stream.pos = end;
		return <ButtonCondAction>{
			// The 7 upper bits hold a key code the button should respond to.
			keyCode: (conditions & 0xfe00) >> 9,
			// The lower 9 bits hold state transition flags. See the enum in AVM1Button for details.
			stateTransitionFlags: conditions & 0x1ff,
			// If no tagSize is given, pass `0` to readBinary.
			actionsData: stream.bytes.subarray(start + 4, end)
		};
	}

	function parseDefineBinaryDataTag(stream: Stream, swfVersion: number,
	                                  tagCode: number, tagEnd: number): BinaryDataTag {
		let tag: BinaryDataTag = <any>{code: tagCode};
		tag.id = stream.readUi16();
		stream.pos += 4; // Reserved
		tag.data = stream.bytes.subarray(stream.pos, tagEnd);
		stream.pos = tagEnd;
		return tag;
	}

	export function parseDefineFontTag(stream: Stream, swfVersion: number,
	                                   tagCode: number): FontTag {
		let tag: FontTag = <any>{code: tagCode};
		tag.id = stream.readUi16();
		let firstOffset = stream.readUi16();
		let glyphCount = firstOffset / 2;
		let restOffsets: number[] = [];
		let i = glyphCount - 1;
		while (i--) {
			restOffsets.push(stream.readUi16());
		}
		tag.offsets = [firstOffset].concat(restOffsets);
		let glyphs: Glyph[] = tag.glyphs = [];
		i = glyphCount;
		while (i--) {
			glyphs.push(parseGlyph(stream, swfVersion, tagCode));
		}
		return tag;
	}

	function parseGlyph(stream: Stream, swfVersion: number, tagCode: number): Glyph {
		stream.align();
		let fillBits = stream.readUb(4);
		let lineBits = stream.readUb(4);
		return parseShapeRecords(stream, swfVersion, tagCode, false, fillBits, lineBits, false);
	}

	function parseDefineTextTag(stream: Stream, swfVersion: number, tagCode: number): StaticTextTag {
		let tag: StaticTextTag = <any>{code: tagCode};
		tag.id = stream.readUi16();
		tag.bbox = parseBbox(stream);
		tag.matrix = parseMatrix(stream);
		let glyphBits = stream.readUi8();
		let advanceBits = stream.readUi8();
		let records: TextRecord[] = tag.records = [];
		let record: TextRecord;
		while (record = parseTextRecord(stream, swfVersion, tagCode, glyphBits, advanceBits)) {
			records.push(record);
		}
		return tag;
	}

	function parseTextRecord(stream: Stream, swfVersion: number, tagCode: number, glyphBits: number,
	                         advanceBits: number): TextRecord {
		stream.align();
		let flags = stream.readUb(8);
		if (!flags) {
			return null;
		}
		let record: TextRecord = <any>{};
		record.flags = flags;
		if (flags & TextRecordFlags.HasFont) {
			record.fontId = stream.readUi16();
		}
		if (flags & TextRecordFlags.HasColor) {
			record.color = tagCode === SwfTagCode.CODE_DEFINE_TEXT2 ?
				parseRgba(stream) :
				parseRgb(stream);
		}
		if (flags & TextRecordFlags.HasMoveX) {
			record.moveX = stream.readSi16();
		}
		if (flags & TextRecordFlags.HasMoveY) {
			record.moveY = stream.readSi16();
		}
		if (flags & TextRecordFlags.HasFont) {
			record.fontHeight = stream.readUi16();
		}
		let glyphCount = stream.readUi8();
		if (swfVersion <= 6) {
			glyphCount = glyphCount; // & 0x7f ???;
		}
		let entries: TextEntry[] = record.entries = [];
		let i = glyphCount;
		while (i--) {
			entries.push({
				glyphIndex: stream.readUb(glyphBits),
				advance: stream.readSb(advanceBits)
			});
		}
		return record;
	}

	function parseDefineSoundTag(stream: Stream, swfVersion: number, tagCode: number,
	                             tagEnd: number): SoundTag {
		let tag: SoundTag = <any>{code: tagCode};
		tag.id = stream.readUi16();
		let soundFlags = stream.readUi8();
		tag.soundFormat = soundFlags >> 4 & 15;
		tag.soundRate = soundFlags >> 2 & 3;
		tag.soundSize = soundFlags >> 1 & 1;
		tag.soundType = soundFlags & 1;
		tag.samplesCount = stream.readUi32();
		tag.soundData = stream.bytes.subarray(stream.pos, tagEnd);
		stream.pos = tagEnd;
		return tag;
	}

	function parseStartSoundTag(stream: Stream, swfVersion: number,
	                            tagCode: number): StartSoundTag {
		let tag: StartSoundTag = <any>{code: tagCode};
		if (tagCode == SwfTagCode.CODE_START_SOUND) {
			tag.soundId = stream.readUi16();
		}
		if (tagCode == SwfTagCode.CODE_START_SOUND2) {
			tag.soundClassName = stream.readString(-1);
		}
		tag.soundInfo = parseSoundInfo(stream);
		return tag;
	}

	function parseSoundInfo(stream: Stream): SoundInfo {
		let info: SoundInfo = <any>{};
		let flags = info.flags = stream.readUi8();
		if (flags & SoundInfoFlags.HasInPoint) {
			info.inPoint = stream.readUi32();
		}
		if (flags & SoundInfoFlags.HasOutPoint) {
			info.outPoint = stream.readUi32();
		}
		if (flags & SoundInfoFlags.HasLoops) {
			info.loopCount = stream.readUi16();
		}
		if (flags & SoundInfoFlags.HasEnvelope) {
			let envelopeCount = stream.readUi8();
			let envelopes: SoundEnvelope[] = info.envelopes = [];
			let i = envelopeCount;
			while (i--) {
				envelopes.push({
					pos44: stream.readUi32(),
					volumeLeft: stream.readUi16(),
					volumeRight: stream.readUi16()
				});
			}
		}
		return info;
	}

	export function parseSoundStreamHeadTag(stream: Stream, tagEnd: number): SoundStreamHeadTag {
		let tag: SoundStreamHeadTag = <any>{};
		let playbackFlags = stream.readUi8();
		tag.playbackRate = playbackFlags >> 2 & 3;
		tag.playbackSize = playbackFlags >> 1 & 1;
		tag.playbackType = playbackFlags & 1;
		let streamFlags = stream.readUi8();
		let streamCompression = tag.streamCompression = streamFlags >> 4 & 15;
		tag.streamRate = streamFlags >> 2 & 3;
		tag.streamSize = streamFlags >> 1 & 1;
		tag.streamType = streamFlags & 1;
		tag.samplesCount = stream.readUi16();
		if (streamCompression == 2 && tagEnd - stream.pos >= 2) {
			tag.latencySeek = stream.readSi16();
		}
		return tag
	}

	export function parseDefineBitmapTag(stream: Stream, swfVersion: number, tagCode: number,
	                                     tagEnd: number): BitmapTag {
		let tag: BitmapTag = <any>{code: tagCode};
		tag.id = stream.readUi16();
		let format = tag.format = stream.readUi8();
		tag.width = stream.readUi16();
		tag.height = stream.readUi16();
		tag.hasAlpha = tagCode === SwfTagCode.CODE_DEFINE_BITS_LOSSLESS2;
		if (format === 3) {
			tag.colorTableSize = stream.readUi8();
		}
		tag.bmpData = stream.bytes.subarray(stream.pos, tagEnd);
		stream.pos = tagEnd;
		return tag;
	}

	function parseDefineEditTextTag(stream: Stream, swfVersion: number, tagCode: number): TextTag {
		let tag: TextTag = <any>{code: tagCode};
		tag.id = stream.readUi16();
		tag.bbox = parseBbox(stream);
		let flags = tag.flags = stream.readUi16();
		if (flags & TextFlags.HasFont) {
			tag.fontId = stream.readUi16();
		}
		if (flags & TextFlags.HasFontClass) {
			tag.fontClass = stream.readString(-1);
		}
		if (flags & TextFlags.HasFont) {
			tag.fontHeight = stream.readUi16();
		}
		if (flags & TextFlags.HasColor) {
			tag.color = parseRgba(stream);
		}
		if (flags & TextFlags.HasMaxLength) {
			tag.maxLength = stream.readUi16();
		}
		if (flags & TextFlags.HasLayout) {
			tag.align = stream.readUi8();
			tag.leftMargin = stream.readUi16();
			tag.rightMargin = stream.readUi16();
			tag.indent = stream.readSi16();
			tag.leading = stream.readSi16();
		}
		tag.variableName = stream.readString(-1);
		if (flags & TextFlags.HasText) {
			tag.initialText = stream.readString(-1);
		}
		return tag;
	}

	export function parseDefineFont2Tag(stream: Stream, swfVersion: number, tagCode: number,
	                                    tagEnd: number): FontTag {
		let tag: FontTag = <any>{code: tagCode};
		tag.id = stream.readUi16();
		let flags = tag.flags = stream.readUi8();
		let wide = !!(flags & FontFlags.WideOrHasFontData);
		if (swfVersion > 5) {
			tag.language = stream.readUi8();
		} else {
			// Clear ShiftJis flag.
			flags = tag.flags = flags & ~FontFlags.ShiftJis;
			// Skip reserved byte.
			stream.pos += 1;
			tag.language = 0;
		}
		let nameLength = stream.readUi8();
		tag.name = stream.readString(nameLength);
		if (tagCode === SwfTagCode.CODE_DEFINE_FONT3) {
			tag.resolution = 20;
		}
		let glyphCount = stream.readUi16();
		// The SWF format docs doesn't say that, but the DefineFont{2,3} tag ends here for device fonts.
		if (glyphCount === 0) {
			return tag;
		}
		let startpos = stream.pos;
		let offsets: number[] = tag.offsets = [];
		let i = glyphCount;
		if ((flags & FontFlags.WideOffset) !== 0) {
			while (i--) {
				offsets.push(stream.readUi32());
			}
			tag.mapOffset = stream.readUi32();
		} else {
			while (i--) {
				offsets.push(stream.readUi16());
			}
			tag.mapOffset = stream.readUi16();
		}
		let glyphs: Glyph[] = tag.glyphs = [];
		i = glyphCount;
		while (i--) {
			let dist = tag.offsets[glyphCount - i] + startpos - stream.pos;
			// when just one byte difference between two offsets, just read that and insert an empty glyph.
			if (dist === 1) {
				stream.pos += 1;
				glyphs.push([]);
				continue;
			}
			glyphs.push(parseGlyph(stream, swfVersion, tagCode));
		}
		let codes: number[] = tag.codes = [];
		i = glyphCount;
		while (i--) {
			codes.push(wide ? stream.readUi16() : stream.readUi8());
		}
		if ((flags & FontFlags.HasLayout) !== 0) {
			tag.ascent = stream.readUi16();
			tag.descent = stream.readUi16();
			tag.leading = stream.readSi16();
			let advance: number[] = tag.advance = [];
			i = glyphCount;
			while (i--) {
				advance.push(stream.readSi16());
			}
			let bbox: Bbox[] = tag.bbox = [];
			i = glyphCount;
			while (i--) {
				bbox.push(parseBbox(stream));
			}
			let kerningCount = stream.readUi16();
			let kernings: Kerning[] = tag.kerning = [];
			i = kerningCount;
			// DefineFont2 tags tend to have a wrong kerning count so we have to make sure here that there is enough unread
			// data remaining before parsing the next kerning record. If not, we have to bail out earlier in the following
			// loop to avoid reading out of bound.
			while (i-- && tagEnd - stream.pos >= (wide ? 4 : 2) + 2) {
				kernings.push(parseKerning(stream, wide));
			}
		}
		return tag;
	}

	function parseKerning(stream: Stream, wide: boolean): Kerning {
		let kerning: Kerning = <any>{};
		if (wide) {
			kerning.code1 = stream.readUi16();
			kerning.code2 = stream.readUi16();
		}
		else {
			kerning.code1 = stream.readUi8();
			kerning.code2 = stream.readUi8();
		}
		kerning.adjustment = stream.readUi16();
		return kerning;
	}

	export function parseDefineFont4Tag(stream: Stream, swfVersion: number, tagCode: number,
	                                    tagEnd: number): FontTag {
		let tag: FontTag = <any>{code: tagCode};
		tag.id = stream.readUi16();
		let flags = tag.flags = stream.readUi8();
		tag.name = stream.readString(-1);
		if (flags & FontFlags.WideOrHasFontData) {
			tag.data = stream.bytes.subarray(stream.pos, tagEnd);
			stream.pos = tagEnd;
		}
		return tag;
	}

	function parseDefineScalingGridTag(stream: Stream, swfVersion: number,
	                                   tagCode: number): ScalingGridTag {
		let tag: ScalingGridTag = <any>{code: tagCode};
		tag.symbolId = stream.readUi16();
		tag.splitter = parseBbox(stream);
		return tag;
	}

	export function parseDefineSceneTag(stream: Stream, tagCode: number): SceneTag {
		let tag: SceneTag = <any>{code: tagCode};
		let sceneCount = stream.readEncodedU32();
		let scenes: Scene[] = tag.scenes = [];
		let i = sceneCount;
		while (i--) {
			scenes.push({
				offset: stream.readEncodedU32(),
				name: stream.readString(-1)
			});
		}
		let labelCount = stream.readEncodedU32();
		let labels: Label[] = tag.labels = [];
		i = labelCount;
		while (i--) {
			labels.push({
				frame: stream.readEncodedU32(),
				name: stream.readString(-1)
			});
		}
		return tag;
	}

	function parseDefineShapeTag(stream: Stream, swfVersion: number, tagCode: number): ShapeTag {
		let tag: ShapeTag = <any>{code: tagCode};
		tag.id = stream.readUi16();
		tag.lineBounds = parseBbox(stream);
		let flags = 0;
		let isMorph = tagCode === SwfTagCode.CODE_DEFINE_MORPH_SHAPE ||
			tagCode === SwfTagCode.CODE_DEFINE_MORPH_SHAPE2;
		if (isMorph) {
			flags |= ShapeFlags.IsMorph;
			tag.lineBoundsMorph = parseBbox(stream);
		}
		let canHaveStrokes = tagCode === SwfTagCode.CODE_DEFINE_SHAPE4 ||
			tagCode === SwfTagCode.CODE_DEFINE_MORPH_SHAPE2;
		if (canHaveStrokes) {
			let fillBounds = tag.fillBounds = parseBbox(stream);
			if (isMorph) {
				tag.fillBoundsMorph = parseBbox(stream);
			}
			flags |= stream.readUi8() & 0x07;
		}
		tag.flags = flags;
		if (isMorph) {
			stream.pos += 4;
		}
		tag.fillStyles = parseFillStyles(stream, swfVersion, tagCode, isMorph);
		tag.lineStyles = parseLineStyles(stream, swfVersion, tagCode, isMorph, canHaveStrokes);
		stream.align();
		let fillBits = stream.readUb(4);
		let lineBits = stream.readUb(4);
		tag.records = parseShapeRecords(stream, swfVersion, tagCode, isMorph, fillBits, lineBits,
			canHaveStrokes);
		if (isMorph) {
			stream.align();
			fillBits = stream.readUb(4);
			lineBits = stream.readUb(4);
			tag.recordsMorph = parseShapeRecords(stream, swfVersion, tagCode, isMorph, fillBits,
				lineBits, canHaveStrokes);
		}
		return tag;
	}

	function parseShapeRecords(stream: Stream, swfVersion: number, tagCode: number,
	                           isMorph: boolean, fillBits: number, lineBits: number,
	                           hasStrokes: boolean): ShapeRecord[] {
		let records: ShapeRecord[] = [];
		let bits: number;
		do {
			let record: any = {};
			let type = record.type = stream.readUb(1);
			let flags = stream.readUb(5);
			if (!(type || flags)) {
				break;
			}
			if (type) {
				let bits = (flags & 0x0f) + 2;
				flags = (flags & 0xf0) << 1;
				if (flags & ShapeRecordFlags.IsStraight) {
					let isGeneral = record.isGeneral = stream.readUb(1);
					if (isGeneral) {
						flags |= ShapeRecordFlags.IsGeneral;
						record.deltaX = stream.readSb(bits);
						record.deltaY = stream.readSb(bits);
					} else {
						let isVertical = record.isVertical = stream.readUb(1);
						if (isVertical) {
							flags |= ShapeRecordFlags.IsVertical;
							record.deltaY = stream.readSb(bits);
						} else {
							record.deltaX = stream.readSb(bits);
						}
					}
				} else {
					record.controlDeltaX = stream.readSb(bits);
					record.controlDeltaY = stream.readSb(bits);
					record.anchorDeltaX = stream.readSb(bits);
					record.anchorDeltaY = stream.readSb(bits);
				}
			} else {
				if (tagCode <= SwfTagCode.CODE_DEFINE_SHAPE) {
					// Clear HasNewStyles flag.
					flags &= ~ShapeRecordFlags.HasNewStyles;
				}
				if (flags & ShapeRecordFlags.Move) {
					bits = stream.readUb(5);
					record.moveX = stream.readSb(bits);
					record.moveY = stream.readSb(bits);
				}
				if (flags & ShapeRecordFlags.HasFillStyle0) {
					record.fillStyle0 = stream.readUb(fillBits);
				}
				if (flags & ShapeRecordFlags.HasFillStyle1) {
					record.fillStyle1 = stream.readUb(fillBits);
				}
				if (flags & ShapeRecordFlags.HasLineStyle) {
					record.lineStyle = stream.readUb(lineBits);
				}
				if (flags & ShapeRecordFlags.HasNewStyles) {
					record.fillStyles = parseFillStyles(stream, swfVersion, tagCode, isMorph);
					record.lineStyles = parseLineStyles(stream, swfVersion, tagCode, isMorph, hasStrokes);
					stream.align();
					fillBits = stream.readUb(4);
					lineBits = stream.readUb(4);
				}
			}
			record.flags = flags;
			records.push(record);
		} while (true);
		return records;
	}

	function parseFillStyles(stream: Stream, swfVersion: number, tagCode: number,
	                         isMorph: boolean): FillStyle[] {
		let count = stream.readUi8();
		if (tagCode > SwfTagCode.CODE_DEFINE_SHAPE && count === 255) {
			count = stream.readUi16();
		}
		let styles: FillStyle[] = [];
		let i = count;
		while (i--) {
			styles.push(parseFillStyle(stream, swfVersion, tagCode, isMorph));
		}
		return styles;
	}

	function parseFillStyle(stream: Stream, swfVersion: number, tagCode: number,
	                        isMorph: boolean): FillStyle {
		let style: FillStyle = <any>{};
		let type = style.type = stream.readUi8();
		switch (type) {
			case 0:
				let solid = <SolidFill>style;
				solid.color = tagCode > SwfTagCode.CODE_DEFINE_SHAPE2 || isMorph ?
					parseRgba(stream) :
					parseRgb(stream);
				if (isMorph) {
					solid.colorMorph = parseRgba(stream);
				}
				return solid;
			case 16:
			case 18:
			case 19:
				let gradient = <GradientFill>style;
				gradient.matrix = parseMatrix(stream);
				if (isMorph) {
					gradient.matrixMorph = parseMatrix(stream);
				}
				if (tagCode === SwfTagCode.CODE_DEFINE_SHAPE4) {
					gradient.spreadMode = stream.readUb(2);
					gradient.interpolationMode = stream.readUb(2);
				} else {
					stream.readUb(4);
				}
				let count = stream.readUb(4);
				let records: GradientRecord[] = gradient.records = [];
				let j = count;
				while (j--) {
					records.push(parseGradientRecord(stream, tagCode, isMorph));
				}
				if (type === 19) {
					gradient.focalPoint = stream.readSi16();
					if (isMorph) {
						gradient.focalPointMorph = stream.readSi16();
					}
				}
				return gradient;
			case 64:
			case 65:
			case 66:
			case 67:
				let pattern = <BitmapFill>style;
				pattern.bitmapId = stream.readUi16();
				pattern.condition = type === 64 || type === 67;
				pattern.matrix = parseMatrix(stream);
				if (isMorph) {
					pattern.matrixMorph = parseMatrix(stream);
				}
				return pattern;
		}
		return style;
	}

	function parseGradientRecord(stream: Stream, tagCode: number,
	                             isMorph: boolean): GradientRecord {
		let record: GradientRecord = <any>{};
		record.ratio = stream.readUi8();
		if (tagCode > SwfTagCode.CODE_DEFINE_SHAPE2) {
			record.color = parseRgba(stream);
		} else {
			record.color = parseRgb(stream);
		}
		if (isMorph) {
			record.ratioMorph = stream.readUi8();
			record.colorMorph = parseRgba(stream);
		}
		return record;
	}

	function parseLineStyles(stream: Stream, swfVersion: number, tagCode: number,
	                         isMorph: boolean, hasStrokes: boolean): LineStyle[] {
		let count = stream.readUi8();
		if (tagCode > SwfTagCode.CODE_DEFINE_SHAPE && count === 255) {
			count = stream.readUi16();
		}
		let styles: LineStyle[] = [];
		let i = count;
		while (i--) {
			let style: any = {};
			style.width = stream.readUi16();
			if (isMorph) {
				style.widthMorph = stream.readUi16();
			}
			if (hasStrokes) {
				stream.align();
				style.startCapsStyle = stream.readUb(2);
				let jointStyle = style.jointStyle = stream.readUb(2);
				let hasFill = style.hasFill = stream.readUb(1);
				style.noHscale = !!stream.readUb(1);
				style.noVscale = !!stream.readUb(1);
				style.pixelHinting = !!stream.readUb(1);
				stream.readUb(5);
				style.noClose = !!stream.readUb(1);
				style.endCapsStyle = stream.readUb(2);
				if (jointStyle === 2) {
					style.miterLimitFactor = stream.readFixed8();
				}
				if (hasFill) {
					style.fillStyle = parseFillStyle(stream, swfVersion, tagCode, isMorph);
				} else {
					style.color = parseRgba(stream);
					if (isMorph) {
						style.colorMorph = parseRgba(stream);
					}
				}
			} else {
				if (tagCode > SwfTagCode.CODE_DEFINE_SHAPE2) {
					style.color = parseRgba(stream);
				} else {
					style.color = parseRgb(stream);
				}
				if (isMorph) {
					style.colorMorph = parseRgba(stream);
				}
			}
			styles.push(style);
		}
		return styles;
	}

	function parseDefineVideoStreamTag(stream: Stream, swfVersion: number,
	                                   tagCode: number): VideoStreamTag {
		let tag: VideoStreamTag = <any>{code: tagCode};
		tag.id = stream.readUi16();
		tag.numFrames = stream.readUi16();
		tag.width = stream.readUi16();
		tag.height = stream.readUi16();
		stream.readUb(4);
		tag.deblocking = stream.readUb(3);
		tag.smoothing = !!stream.readUb(1);
		tag.codecId = stream.readUi8();
		return tag;
	}

	function parseVideoFrameTag(stream: Stream, swfVersion: number,
	                            tagCode: number, tagEnd: number): VideoFrameTag {
		let tag: VideoFrameTag = <any>{code: tagCode};
		tag.streamId = stream.readUi16();
		tag.frameNum = stream.readUi16();
		tag.videoData = stream.bytes.subarray(stream.pos, tagEnd);
		stream.pos = tagEnd;
		return tag;
	}

	export let tagHandlers: any = {
		/* End */                            0: undefined,
		/* ShowFrame */                      1: undefined,
		/* DefineShape */                    2: parseDefineShapeTag,
		/* PlaceObject */                    4: parsePlaceObjectTag,
		/* RemoveObject */                   5: parseRemoveObjectTag,
		/* DefineBits */                     6: parseDefineImageTag,
		/* DefineButton */                   7: parseDefineButtonTag,
		/* JPEGTables */                     8: undefined,
		/* SetBackgroundColor */             9: undefined,
		/* DefineFont */                    10: parseDefineFontTag,
		/* DefineText */                    11: parseDefineTextTag,
		/* DoAction */                      12: undefined,
		/* DefineFontInfo */                13: undefined,
		/* DefineSound */                   14: parseDefineSoundTag,
		/* StartSound */                    15: parseStartSoundTag,
		/* DefineButtonSound */             17: undefined,
		/* SoundStreamHead */               18: undefined,
		/* SoundStreamBlock */              19: undefined,
		/* DefineBitsLossless */            20: parseDefineBitmapTag,
		/* DefineBitsJPEG2 */               21: parseDefineImageTag,
		/* DefineShape2 */                  22: parseDefineShapeTag,
		/* DefineButtonCxform */            23: undefined,
		/* Protect */                       24: undefined,
		/* PlaceObject2 */                  26: parsePlaceObjectTag,
		/* RemoveObject2 */                 28: parseRemoveObjectTag,
		/* DefineShape3 */                  32: parseDefineShapeTag,
		/* DefineText2 */                   33: parseDefineTextTag,
		/* DefineButton2 */                 34: parseDefineButtonTag,
		/* DefineBitsJPEG3 */               35: parseDefineImageTag,
		/* DefineBitsLossless2 */           36: parseDefineBitmapTag,
		/* DefineEditText */                37: parseDefineEditTextTag,
		/* DefineSprite */                  39: undefined,
		/* FrameLabel */                    43: undefined,
		/* SoundStreamHead2 */              45: undefined,
		/* DefineMorphShape */              46: parseDefineShapeTag,
		/* DefineFont2 */                   48: parseDefineFont2Tag,
		/* ExportAssets */                  56: undefined,
		/* ImportAssets */                  57: undefined,
		/* EnableDebugger */                58: undefined,
		/* DoInitAction */                  59: undefined,
		/* DefineVideoStream */             60: parseDefineVideoStreamTag,
		/* VideoFrame */                    61: parseVideoFrameTag,
		/* DefineFontInfo2 */               62: undefined,
		/* EnableDebugger2 */               64: undefined,
		/* ScriptLimits */                  65: undefined,
		/* SetTabIndex */                   66: undefined,
		/* FileAttributes */                69: undefined,
		/* PlaceObject3 */                  70: parsePlaceObjectTag,
		/* ImportAssets2 */                 71: undefined,
		/* DoABC (undoc) */                 72: undefined,
		/* DefineFontAlignZones */          73: undefined,
		/* CSMTextSettings */               74: undefined,
		/* DefineFont3 */                   75: parseDefineFont2Tag,
		/* SymbolClass */                   76: undefined,
		/* Metadata */                      77: undefined,
		/* DefineScalingGrid */             78: parseDefineScalingGridTag,
		/* DoABC */                         82: undefined,
		/* DefineShape4 */                  83: parseDefineShapeTag,
		/* DefineMorphShape2 */             84: parseDefineShapeTag,
		/* DefineSceneAndFrameLabelData */  86: parseDefineSceneTag,
		/* DefineBinaryData */              87: parseDefineBinaryDataTag,
		/* DefineFontName */                88: undefined,
		/* StartSound2 */                   89: parseStartSoundTag,
		/* DefineBitsJPEG4 */               90: parseDefineImageTag,
		/* DefineFont4 */                   91: parseDefineFont4Tag
	};

	export function parseHeader(stream: Stream) {
		let bits = stream.readUb(5);
		let xMin = stream.readSb(bits);
		let xMax = stream.readSb(bits);
		let yMin = stream.readSb(bits);
		let yMax = stream.readSb(bits);
		stream.align();
		let frameRateFraction = stream.readUi8();
		let frameRate = stream.readUi8() + frameRateFraction / 256;
		let frameCount = stream.readUi16();
		return {
			frameRate: frameRate,
			frameCount: frameCount,
			bounds: new Shumway.Bounds(xMin, yMin, xMax, yMax)
		};
	}
}

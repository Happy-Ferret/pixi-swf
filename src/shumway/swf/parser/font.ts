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

module Shumway.SWF.Parser {
	let pow = Math.pow;
	let min = Math.min;
	let max = Math.max;
	let logE = Math.log;
	let fromCharCode = String.fromCharCode;

	let nextFontId = 1;

	function maxPower2(num: number) {
		let maxPower = 0;
		let val = num;
		while (val >= 2) {
			val /= 2;
			++maxPower;
		}
		return pow(2, maxPower);
	}

	function toString16(val: number) {
		return fromCharCode((val >> 8) & 0xff, val & 0xff);
	}

	function toString32(val: number) {
		return toString16(val >> 16) + toString16(val);
	}

	/**
	 * Heuristic to detect if DefineFont2 was scaled as Font3: scanning all
	 * x and y coordinates of the glyphs and if their bounding box dimensions
	 * greater than 5000 (that's more than enough for normal TrueType font),
	 * then the font coordinates were scaled by 20.
	 */
	function isScaledFont2(glyphs: Array<any>) {
		let xMin = 0, yMin = 0, xMax = 0, yMax = 0;
		let record;
		for (let i = 0; i < glyphs.length; i++) {
			let records = glyphs[i];
			if (!records) {
				continue;
			}
			let x = 0;
			let y = 0;

			for (let j = 0; j < records.length; j++) {
				record = records[j];
				if (record.type) {
					if ((record.flags & ShapeRecordFlags.IsStraight) !== 0) {
						x += (record.deltaX || 0);
						y += -(record.deltaY || 0);
					} else {
						x += record.controlDeltaX;
						y += -record.controlDeltaY;
						x += record.anchorDeltaX;
						y += -record.anchorDeltaY;
					}
				} else {
					if ((record.flags & ShapeRecordFlags.Move) !== 0) {
						x = record.moveX;
						y = -record.moveY;
					}
				}

				if (xMin > x) {
					xMin = x;
				}
				if (yMin > y) {
					yMin = y;
				}
				if (xMax < x) {
					xMax = x;
				}
				if (yMax < y) {
					yMax = y;
				}
			}
		}
		let maxDimension = Math.max(xMax - xMin, yMax - yMin);
		return maxDimension > 5000;
	}

	export function defineFont(tag: FontTag) {
		let uniqueName = 'swf-font-' + tag.id;
		let fontName = tag.name || uniqueName;

		let font = {
			type: 'font',
			id: tag.id,
			name: fontName,
			bold: !!(tag.flags & FontFlags.Bold),
			italic: !!(tag.flags & FontFlags.Italic),
			codes: null as any,
			metrics: null as any,
			data: tag.data,
			originalSize: false
		};

		let glyphs = tag.glyphs;
		let glyphCount = glyphs ? glyphs.length : 0;

		if (!glyphCount) {
			return font;
		}

		let tables: any = {};
		let codes: any = [];
		let glyphIndex: any = {};
		let ranges: any = [];

		let originalCode;
		let generateAdvancement = !('advance' in tag);
		let correction = 0;
		let isFont2 = tag.code === SwfTagCode.CODE_DEFINE_FONT2;
		let isFont3 = tag.code === SwfTagCode.CODE_DEFINE_FONT3;

		if (generateAdvancement) {
			tag.advance = [];
		}

		let maxCode = Math.max.apply(null, tag.codes) || 35;

		let indices: Array<number>;
		let code: number;
		if (tag.codes) {
			for (let i = 0; i < tag.codes.length; i++) {
				let code = tag.codes[i];
				if (code < 32 || code in glyphIndex) {
					maxCode++;
					if (maxCode == 8232) {
						maxCode = 8240;
					}
					code = maxCode;
				}
				codes.push(code);
				glyphIndex[code] = i;
			}

			originalCode = codes.concat();

			codes.sort(function (a: number, b: number) {
				return a - b;
			});
			let i = 0;
			while ((code = codes[i++]) !== undefined) {
				let start = code;
				let end = start;
				indices = [i - 1];
				while (((code = codes[i]) !== undefined) && end + 1 === code) {
					++end;
					indices.push(i);
					++i;
				}
				ranges.push([start, end, indices]);
			}
		} else {
			indices = [];
			let UAC_OFFSET = 0xe000;
			for (let i = 0; i < glyphCount; i++) {
				code = UAC_OFFSET + i;
				codes.push(code);
				glyphIndex[code] = i;
				indices.push(i);
			}
			ranges.push([UAC_OFFSET, UAC_OFFSET + glyphCount - 1, indices]);
			originalCode = codes.concat();
		}

		let resolution = tag.resolution || 1;
		if (isFont2 && isScaledFont2(glyphs)) {
			// some DefineFont2 without layout using DefineFont3 resolution, why?
			resolution = 20;
			font.originalSize = true;
		}
		let ascent = Math.ceil(tag.ascent / resolution) || 1024;
		let descent = -Math.ceil(tag.descent / resolution) || 0;
		let leading = (tag.leading / resolution) || 0;
		tables['OS/2'] = '';

		let startCount = '';
		let endCount = '';
		let idDelta = '';
		let idRangeOffset = '';
		let i = 0;
		let range;
		while ((range = ranges[i++])) {
			let start: number = range[0];
			let end: number = range[1];
			code = range[2][0];
			startCount += toString16(start);
			endCount += toString16(end);
			idDelta += toString16(((code - start) + 1) & 0xffff);
			idRangeOffset += toString16(0);
		}
		endCount += '\xff\xff';
		startCount += '\xff\xff';
		idDelta += '\x00\x01';
		idRangeOffset += '\x00\x00';
		let segCount = ranges.length + 1;
		let searchRange = maxPower2(segCount) * 2;
		let rangeShift = (2 * segCount) - searchRange;
		let format314 =
			'\x00\x00' + // language
			toString16(segCount * 2) + // segCountX2
			toString16(searchRange) +
			toString16(logE(segCount) / logE(2)) + // entrySelector
			toString16(rangeShift) +
			endCount +
			'\x00\x00' + // reservedPad
			startCount +
			idDelta +
			idRangeOffset
		;
		tables['cmap'] =
			'\x00\x00' + // version
			'\x00\x01' +  // numTables
			'\x00\x03' + // platformID
			'\x00\x01' + // encodingID
			'\x00\x00\x00\x0c' + // offset
			'\x00\x04' + // format
			toString16(format314.length + 4) + // length
			format314
		;

		let glyf = '\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x31\x00';
		let loca = '\x00\x00';
		let offset = 16;
		let maxPoints = 0;
		let xMins: Array<number> = [];
		let xMaxs: Array<number> = [];
		let yMins: Array<number> = [];
		let yMaxs: Array<number> = [];
		let maxContours = 0;
		i = 0;
		let j;
		let rawData: any = {};
		let record;
		let segments: any;
		let myFlags = '';
		let myEndpts = '';
		let endPoint = 0;
		while ((code = codes[i++]) !== undefined) {
			let records = glyphs[glyphIndex[code]];
			let x = 0;
			let y = 0;

			myFlags = '';
			myEndpts = '';
			endPoint = 0;
			segments = [];
			let segmentIndex = -1;

			for (j = 0; j < records.length; j++) {
				record = records[j];
				if (record.type) {
					if (segmentIndex < 0) {
						segmentIndex = 0;
						segments[segmentIndex] = {data: [], commands: [], xMin: 0, xMax: 0, yMin: 0, yMax: 0};
					}
					if (record.flags & ShapeRecordFlags.IsStraight) {
						segments[segmentIndex].commands.push(2);
						let dx = (record.deltaX || 0) / resolution;
						let dy = -(record.deltaY || 0) / resolution;
						x += dx;
						y += dy;
						segments[segmentIndex].data.push(x, y);
					} else {
						segments[segmentIndex].commands.push(3);
						let cx = record.controlDeltaX / resolution;
						let cy = -record.controlDeltaY / resolution;
						x += cx;
						y += cy;
						segments[segmentIndex].data.push(x, y);
						let dx = record.anchorDeltaX / resolution;
						let dy = -record.anchorDeltaY / resolution;
						x += dx;
						y += dy;
						segments[segmentIndex].data.push(x, y);
					}
				} else {
					if ((record.flags & ShapeRecordFlags.Move) !== 0) {
						segmentIndex++;
						segments[segmentIndex] = {data: [], commands: [], xMin: 0, xMax: 0, yMin: 0, yMax: 0};
						segments[segmentIndex].commands.push(1);
						let moveX = record.moveX / resolution;
						let moveY = -record.moveY / resolution;
						let dx = moveX - x;
						let dy = moveY - y;
						x = moveX;
						y = moveY;
						segments[segmentIndex].data.push(x, y);
					}
				}

				if (segmentIndex > -1) {
					if (segments[segmentIndex].xMin > x) {
						segments[segmentIndex].xMin = x;
					}
					if (segments[segmentIndex].yMin > y) {
						segments[segmentIndex].yMin = y;
					}
					if (segments[segmentIndex].xMax < x) {
						segments[segmentIndex].xMax = x;
					}
					if (segments[segmentIndex].yMax < y) {
						segments[segmentIndex].yMax = y;
					}
				}
			}

			if (!isFont3) {
				segments.sort(function (a: any, b: any) {
					return (b.xMax - b.xMin) * (b.yMax - b.yMin) - (a.xMax - a.xMin) * (a.yMax - a.yMin);
				});
			}

			rawData[code] = segments;
		}

		i = 0;
		while ((code = codes[i++]) !== undefined) {
			let records = glyphs[glyphIndex[code]];
			segments = rawData[code];
			let numberOfContours = 1;
			endPoint = 0;
			let endPtsOfContours = '';
			let flags = '';
			let xCoordinates = '';
			let yCoordinates = '';
			let x = 0;
			let y = 0;
			let xMin = 0;
			let xMax = -1024;
			let yMin = 0;
			let yMax = -1024;

			let myFlags = '';
			myEndpts = '';
			let segmentIndex = -1;

			let data: any = [];
			let commands: any = [];

			for (j = 0; j < segments.length; j++) {
				data = data.concat(segments[j].data);
				commands = commands.concat(segments[j].commands);
			}

			x = 0;
			y = 0;
			let nx = 0;
			let ny = 0;
			let myXCoordinates = '';
			let myYCoordinates = '';
			let dataIndex = 0;
			endPoint = 0;
			numberOfContours = 1;
			myEndpts = '';
			for (j = 0; j < commands.length; j++) {
				let command = commands[j];
				let cx, cy;
				if (command === 1) {
					if (endPoint) {
						++numberOfContours;
						myEndpts += toString16(endPoint - 1);
					}
					nx = data[dataIndex++];
					ny = data[dataIndex++];
					let dx = nx - x;
					let dy = ny - y;
					myFlags += '\x01';
					myXCoordinates += toString16(dx);
					myYCoordinates += toString16(dy);
					x = nx;
					y = ny;
				} else if (command === 2) {
					nx = data[dataIndex++];
					ny = data[dataIndex++];
					let dx = nx - x;
					let dy = ny - y;
					myFlags += '\x01';
					myXCoordinates += toString16(dx);
					myYCoordinates += toString16(dy);
					x = nx;
					y = ny;
				} else if (command === 3) {
					nx = data[dataIndex++];
					ny = data[dataIndex++];
					cx = nx - x;
					cy = ny - y;
					myFlags += '\x00';
					myXCoordinates += toString16(cx);
					myYCoordinates += toString16(cy);
					x = nx;
					y = ny;
					endPoint++;

					nx = data[dataIndex++];
					ny = data[dataIndex++];
					cx = nx - x;
					cy = ny - y;
					myFlags += '\x01';
					myXCoordinates += toString16(cx);
					myYCoordinates += toString16(cy);
					x = nx;
					y = ny;
				}
				endPoint++;
				if (endPoint > maxPoints) {
					maxPoints = endPoint;
				}
				if (xMin > x) {
					xMin = x;
				}
				if (yMin > y) {
					yMin = y;
				}
				if (xMax < x) {
					xMax = x;
				}
				if (yMax < y) {
					yMax = y;
				}
			}
			myEndpts += toString16((endPoint || 1) - 1);

			endPtsOfContours = myEndpts;
			xCoordinates = myXCoordinates;
			yCoordinates = myYCoordinates;
			flags = myFlags;

			if (!j) {
				xMin = xMax = yMin = yMax = 0;
				flags += '\x31';
			}
			let entry =
				toString16(numberOfContours) +
				toString16(xMin) +
				toString16(yMin) +
				toString16(xMax) +
				toString16(yMax) +
				endPtsOfContours +
				'\x00\x00' + // instructionLength
				flags +
				xCoordinates +
				yCoordinates
			;
			if (entry.length & 1) {
				entry += '\x00';
			}
			glyf += entry;
			loca += toString16(offset / 2);
			offset += entry.length;
			xMins.push(xMin);
			xMaxs.push(xMax);
			yMins.push(yMin);
			yMaxs.push(yMax);
			if (numberOfContours > maxContours) {
				maxContours = numberOfContours;
			}
			if (endPoint > maxPoints) {
				maxPoints = endPoint;
			}
			if (generateAdvancement) {
				tag.advance.push((xMax - xMin) * resolution * 1.3);
			}
		}
		loca += toString16(offset / 2);
		tables['glyf'] = glyf;

		if (!isFont3) {
			let minYmin = Math.min.apply(null, yMins);
			if (minYmin < 0) {
				descent = descent || minYmin;
			}
		}

		tables['OS/2'] =
			'\x00\x01' + // version
			'\x00\x00' + // xAvgCharWidth
			toString16(font.bold ? 700 : 400) + // usWeightClass
			'\x00\x05' + // usWidthClass
			'\x00\x00' + // fstype
			'\x00\x00' + // ySubscriptXSize
			'\x00\x00' + // ySubscriptYSize
			'\x00\x00' + // ySubscriptXOffset
			'\x00\x00' + // ySubscriptYOffset
			'\x00\x00' + // ySuperScriptXSize
			'\x00\x00' + // ySuperScriptYSize
			'\x00\x00' + // ySuperScriptXOffset
			'\x00\x00' + // ySuperScriptYOffset
			'\x00\x00' + // yStrikeoutSize
			'\x00\x00' + // yStrikeoutPosition
			'\x00\x00' + // sFamilyClass
			'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00' + // panose
			'\x00\x00\x00\x00' + // ulUnicodeRange1
			'\x00\x00\x00\x00' + // ulUnicodeRange2
			'\x00\x00\x00\x00' + // ulUnicodeRange3
			'\x00\x00\x00\x00' + // ulUnicodeRange4
			'ALF ' + // achVendID
			toString16((font.italic ? 0x01 : 0) | (font.bold ? 0x20 : 0)) + // fsSelection
			toString16(codes[0]) + // usFirstCharIndex
			toString16(codes[codes.length - 1]) + // usLastCharIndex
			toString16(ascent) + // sTypoAscender
			toString16(descent) + // sTypoDescender
			toString16(leading) + // sTypoLineGap
			toString16(ascent) + // usWinAscent
			toString16(-descent) + // usWinDescent
			'\x00\x00\x00\x00' + // ulCodePageRange1
			'\x00\x00\x00\x00' // ulCodePageRange2
		;

		tables['head'] =
			'\x00\x01\x00\x00' + // version
			'\x00\x01\x00\x00' + // fontRevision
			'\x00\x00\x00\x00' + // checkSumAdjustement
			'\x5f\x0f\x3c\xf5' + // magicNumber
			'\x00\x0b' + // flags
			'\x04\x00' + // unitsPerEm
			'\x00\x00\x00\x00' + toString32(Date.now()) + // created
			'\x00\x00\x00\x00' + toString32(Date.now()) + // modified
			toString16(min.apply(null, xMins)) + // xMin
			toString16(min.apply(null, yMins)) + // yMin
			toString16(max.apply(null, xMaxs)) + // xMax
			toString16(max.apply(null, yMaxs)) + // yMax
			toString16((font.italic ? 2 : 0) | (font.bold ? 1 : 0)) + // macStyle
			'\x00\x08' + // lowestRecPPEM
			'\x00\x02' + // fontDirectionHint
			'\x00\x00' + // indexToLocFormat
			'\x00\x00' // glyphDataFormat
		;

		let advance = tag.advance;
		tables['hhea'] =
			'\x00\x01\x00\x00' + // version
			toString16(ascent) + // ascender
			toString16(descent) + // descender
			toString16(leading) + // lineGap
			toString16(advance ? max.apply(null, advance) : 1024) + // advanceWidthMax
			'\x00\x00' + // minLeftSidebearing
			'\x00\x00' + // minRightSidebearing
			'\x03\xb8' + // xMaxExtent
			'\x00\x01' + // caretSlopeRise
			'\x00\x00' + // caretSlopeRun
			'\x00\x00' + // caretOffset
			'\x00\x00' + // reserved
			'\x00\x00' + // reserved
			'\x00\x00' + // reserved
			'\x00\x00' + // reserved
			'\x00\x00' + // metricDataFormat
			toString16(glyphCount + 1) // numberOfHMetrics
		;

		let hmtx = '\x00\x00\x00\x00';
		for (let i = 0; i < glyphCount; ++i) {
			hmtx += toString16(advance ? (advance[i] / resolution) : 1024) + '\x00\x00';
		}
		tables['hmtx'] = hmtx;

		if (tag.kerning && tag.kerning.length) {
			let kerning = tag.kerning;
			let nPairs = kerning.length;
			let searchRange = maxPower2(nPairs) * 2;
			let kern =
				'\x00\x00' + // version
				'\x00\x01' + // nTables
				'\x00\x00' + // subtable version
				toString16(14 + (nPairs * 6)) + // length
				'\x00\x01' + // coverage
				toString16(nPairs) +
				toString16(searchRange) +
				toString16(logE(nPairs) / logE(2)) + // entrySelector
				toString16((2 * nPairs) - searchRange) // rangeShift
			;
			let i = 0;
			while ((record = kerning[i++])) {
				kern +=
					toString16(glyphIndex[record.code1]) + // left
					toString16(glyphIndex[record.code2]) + // right
					toString16(record.adjustment) // value
				;
			}
			tables['kern'] = kern;
		}

		tables['loca'] = loca;

		tables['maxp'] =
			'\x00\x01\x00\x00' + // version
			toString16(glyphCount + 1) + // numGlyphs
			toString16(maxPoints) +
			toString16(maxContours) +
			'\x00\x00' + // maxCompositePoints
			'\x00\x00' + // maxCompositeContours
			'\x00\x01' + // maxZones
			'\x00\x00' + // maxTwilightPoints
			'\x00\x00' + // maxStorage
			'\x00\x00' + // maxFunctionDefs
			'\x00\x00' + // maxInstructionDefs
			'\x00\x00' + // maxStackElements
			'\x00\x00' + // maxSizeOfInstructions
			'\x00\x00' + // maxComponentElements
			'\x00\x00' // maxComponentDepth
		;

		let psName = fontName.replace(/ /g, '');
		let strings = [
			tag.copyright || 'Original licence', // 0. Copyright
			fontName, // 1. Font family
			'Unknown', // 2. Font subfamily
			uniqueName, // 3. Unique ID
			fontName, // 4. Full font name
			'1.0', // 5. Version
			psName, // 6. Postscript name
			'Unknown', // 7. Trademark
			'Unknown', // 8. Manufacturer
			'Unknown' // 9. Designer
		];
		let count = strings.length;
		let name =
			'\x00\x00' + // format
			toString16(count) + // count
			toString16((count * 12) + 6); // stringOffset
		offset = 0;
		i = 0;
		let str;
		while ((str = strings[i++])) {
			name +=
				'\x00\x01' + // platformID
				'\x00\x00' + // encodingID
				'\x00\x00' + // languageID
				toString16(i - 1) + // nameID
				toString16(str.length) +
				toString16(offset);
			offset += str.length;
		}
		tables['name'] = name + strings.join('');

		tables['post'] =
			'\x00\x03\x00\x00' + // version
			'\x00\x00\x00\x00' + // italicAngle
			'\x00\x00' + // underlinePosition
			'\x00\x00' + // underlineThickness
			'\x00\x00\x00\x00' + // isFixedPitch
			'\x00\x00\x00\x00' + // minMemType42
			'\x00\x00\x00\x00' + // maxMemType42
			'\x00\x00\x00\x00' + // minMemType1
			'\x00\x00\x00\x00' // maxMemType1
		;

		let names = Object.keys(tables);
		let numTables = names.length;
		let header =
			'\x00\x01\x00\x00' + // version
			toString16(numTables) +
			'\x00\x80' + // searchRange
			'\x00\x03' + // entrySelector
			'\x00\x20' // rangeShift
		;
		let dataString = '';
		offset = (numTables * 16) + header.length;
		i = 0;
		while ((name = names[i++])) {
			let table = tables[name];
			let length = table.length;
			header +=
				name +
				'\x00\x00\x00\x00' + // checkSum
				toString32(offset) +
				toString32(length)
			;
			while (length & 3) {
				table += '\x00';
				++length;
			}
			dataString += table;
			while (offset & 3) {
				++offset;
			}
			offset += length;
		}
		let otf = header + dataString;
		let unitPerEm = 1024;
		let metrics = {
			ascent: ascent / unitPerEm,
			descent: -descent / unitPerEm,
			leading: leading / unitPerEm
		};

		// TODO: use a buffer to generate font data
		let dataBuffer = new Uint8Array(otf.length);
		for (let i = 0; i < otf.length; i++) {
			dataBuffer[i] = otf.charCodeAt(i) & 0xff;
		}

		font.codes = originalCode;
		font.metrics = metrics;
		font.data = dataBuffer;

		return font;
	}
}

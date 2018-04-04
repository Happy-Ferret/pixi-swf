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
	import notImplemented = Shumway.Debug.notImplemented;
	import assertUnreachable = Shumway.Debug.assertUnreachable;
	import roundToMultipleOfFour = Shumway.IntegerUtilities.roundToMultipleOfFour;
	import Inflate = Shumway.ArrayUtilities.Inflate;

	export const enum BitmapFormat {
		/**
		 * 8-bit color mapped image.
		 */
		FORMAT_COLORMAPPED = 3,

		/**
		 * 15-bit RGB image.
		 */
		FORMAT_15BPP = 4,

		/**
		 * 24-bit RGB image, however stored as 4 byte value 0x00RRGGBB.
		 */
		FORMAT_24BPP = 5
	}

	/** @const */ let FACTOR_5BBP = 255 / 31;

	/*
	 * Returns a Uint8Array of ARGB values. The source image is color mapped meaning
	 * that the buffer is first prefixed with a color table:
	 *
	 * +--------------|--------------------------------------------------+
	 * | Color Table  |  Image Data (byte indices into the color table)  |
	 * +--------------|--------------------------------------------------+
	 *
	 * Color Table entries are either in RGB or RGBA format.
	 *
	 * There are two variations of these file formats, with or without alpha.
	 *
	 * Row pixels always start at 32 bit alinged offsets, the color table as
	 * well as the end of each row may be padded so that the next row of pixels
	 * is aligned.
	 */
	function parseColorMapped(tag: BitmapTag): Uint8Array {
		let width = tag.width, height = tag.height;
		let hasAlpha = tag.hasAlpha;

		let padding = roundToMultipleOfFour(width) - width;
		let colorTableLength = tag.colorTableSize + 1;
		let colorTableEntrySize = hasAlpha ? 4 : 3;
		let colorTableSize = roundToMultipleOfFour(colorTableLength * colorTableEntrySize);

		let dataSize = colorTableSize + ((width + padding) * height);

		let bytes: Uint8Array = Inflate.inflate(tag.bmpData, dataSize, true);

		let view = new Uint32Array(width * height);

		// TODO: Figure out why this fails.
		// Make sure we've deflated enough bytes.
		// stream.ensure(dataSize);

		let p = colorTableSize, i = 0, offset = 0;
		if (hasAlpha) {
			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {
					offset = bytes[p++] << 2;
					let a = bytes[offset + 3]; // A
					let r = bytes[offset + 0]; // R
					let g = bytes[offset + 1]; // G
					let b = bytes[offset + 2]; // B
					view[i++] = b << 24 | g << 16 | r << 8 | a;
				}
				p += padding;
			}
		} else {
			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {
					offset = bytes[p++] * colorTableEntrySize;
					let a = 0xff; // A
					let r = bytes[offset + 0]; // R
					let g = bytes[offset + 1]; // G
					let b = bytes[offset + 2]; // B
					view[i++] = b << 24 | g << 16 | r << 8 | a;
				}
				p += padding;
			}
		}
		release || assert(p === dataSize, "We should be at the end of the data buffer now.");
		release || assert(i === width * height, "Should have filled the entire image.");
		return new Uint8Array(view.buffer);
	}

	/**
	 * Returns a Uint8Array of ARGB values. The data is already stored in premultiplied ARGB
	 * so there's not much to do unless there's no alpha in which case we expand it here.
	 */
	function parse24BPP(tag: BitmapTag): Uint8Array {
		let width = tag.width, height = tag.height;
		let hasAlpha = tag.hasAlpha;

		// Even without alpha, 24BPP is stored as 4 bytes, probably for alignment reasons.
		let dataSize = height * width * 4;

		let bytes: Uint8Array = Inflate.inflate(tag.bmpData, dataSize, true);
		if (hasAlpha) {
			return bytes;
		}
		let view = new Uint32Array(width * height);
		let length = width * height, p = 0;
		// TODO: Looks like we can probably get away with just setting alpha to 0xff instead of
		// reading the entire buffer.
		for (let i = 0; i < length; i++) {
			p++; // Reserved, always zero.
			let r = bytes[p++];
			let g = bytes[p++];
			let b = bytes[p++];
			view[i] = b << 24 | g << 16 | r << 8 | 0xff;
		}
		release || assert(p === dataSize, "We should be at the end of the data buffer now.");
		return new Uint8Array(view.buffer);
	}

	function parse15BPP(tag: BitmapTag): Uint8Array {
		release || notImplemented("parse15BPP");
		/*
		  case FORMAT_15BPP:
			let colorType = 0x02;
			let bytesPerLine = ((width * 2) + 3) & ~3;
			let stream = createInflatedStream(bmpData, bytesPerLine * height);

			for (let y = 0, i = 0; y < height; ++y) {
			  stream.ensure(bytesPerLine);
			  for (let x = 0; x < width; ++x, i += 4) {
				let word = stream.readUi16();
				// Extracting RGB color components and changing values range
				// from 0..31 to 0..255.
				data[i] = 0 | (FACTOR_5BBP * ((word >> 10) & 0x1f));
				data[i + 1] = 0 | (FACTOR_5BBP * ((word >> 5) & 0x1f));
				data[i + 2] = 0 | (FACTOR_5BBP * (word & 0x1f));
				data[i + 3] = 255;
			  }
			  stream += bytesPerLine;
			}
			break;
		  */
		return null;
	}

	export function defineBitmap(tag: BitmapTag): { definition: ImageDefinition; type: string } {
		enterTimeline("defineBitmap");
		let data: Uint32Array;
		let type = ImageType.None;
		switch (tag.format) {
			case BitmapFormat.FORMAT_COLORMAPPED:
				data = parseColorMapped(tag);
				type = ImageType.PremultipliedAlphaARGB;
				break;
			case BitmapFormat.FORMAT_24BPP:
				data = parse24BPP(tag);
				type = ImageType.PremultipliedAlphaARGB;
				break;
			case BitmapFormat.FORMAT_15BPP:
				data = parse15BPP(tag);
				type = ImageType.PremultipliedAlphaARGB;
				break;
			default:
				release || assertUnreachable('invalid bitmap format');
		}
		leaveTimeline();
		return {
			definition: {
				type: 'image',
				id: tag.id,
				width: tag.width,
				height: tag.height,
				mimeType: 'application/octet-stream',
				data: data,
				dataType: type,
				image: null
			},
			type: 'image'
		};
	}
}

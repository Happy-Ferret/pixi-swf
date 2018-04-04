/**
 * Copyright 2015 Mozilla Foundation
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

module RtmpJs.MP4 {
	function hex(s: string): Uint8Array {
		let len = s.length >> 1;
		let arr = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
			arr[i] = parseInt(s.substr(i * 2, 2), 16);
		}
		return arr;
	}

	let SOUNDRATES = [5500, 11025, 22050, 44100];
	let SOUNDFORMATS = ['PCM', 'ADPCM', 'MP3', 'PCM le', 'Nellymouser16', 'Nellymouser8', 'Nellymouser', 'G.711 A-law', 'G.711 mu-law', null, 'AAC', 'Speex', 'MP3 8khz'];
	let MP3_SOUND_CODEC_ID = 2;
	let AAC_SOUND_CODEC_ID = 10;

	enum AudioPacketType {
		HEADER = 0,
		RAW = 1,
	}

	interface AudioPacket {
		codecDescription: string;
		codecId: number;
		data: Uint8Array;
		rate: number;
		size: number;
		channels: number;
		samples: number;
		packetType: AudioPacketType;
	}

	function parseAudiodata(data: Uint8Array): AudioPacket {
		let i = 0;
		let packetType = AudioPacketType.RAW;
		let flags = data[i];
		let codecId = flags >> 4;
		let soundRateId = (flags >> 2) & 3;
		let sampleSize = (flags & 2) !==0 ? 16 : 8;
		let channels = (flags & 1) !== 0 ? 2 : 1;
		let samples: number;
		i++;
		switch (codecId) {
			case AAC_SOUND_CODEC_ID:
				let type = data[i++];
				packetType = <AudioPacketType>type;
				samples = 1024; // AAC implementations typically represent 1024 PCM audio samples
				break;
			case MP3_SOUND_CODEC_ID:
				let version = (data[i + 1] >> 3) & 3; // 3 - MPEG 1
				let layer = (data[i + 1] >> 1) & 3; // 3 - Layer I, 2 - II, 1 - III
				samples = layer === 1 ? (version === 3 ? 1152 : 576) :
					(layer === 3 ? 384 : 1152);
				break;
		}
		return {
			codecDescription: SOUNDFORMATS[codecId],
			codecId: codecId,
			data: data.subarray(i),
			rate: SOUNDRATES[soundRateId],
			size: sampleSize,
			channels: channels,
			samples: samples,
			packetType: packetType
		};
	}

	let VIDEOCODECS = [null, 'JPEG', 'Sorenson', 'Screen', 'VP6', 'VP6 alpha', 'Screen2', 'AVC'];
	let VP6_VIDEO_CODEC_ID = 4;
	let AVC_VIDEO_CODEC_ID = 7;

	enum VideoFrameType {
		KEY = 1,
		INNER = 2,
		DISPOSABLE = 3,
		GENERATED = 4,
		INFO = 5,
	}

	enum VideoPacketType {
		HEADER = 0,
		NALU = 1,
		END = 2,
	}

	interface VideoPacket {
		frameType: VideoFrameType;
		codecId: number;
		codecDescription: string;
		data: Uint8Array;
		packetType: VideoPacketType;
		compositionTime: number;
		horizontalOffset?: number;
		verticalOffset?: number;
	}

	function parseVideodata(data: Uint8Array): VideoPacket {
		let i = 0;
		let frameType = data[i] >> 4;
		let codecId = data[i] & 15;
		i++;
		let result: any = {
			frameType: <VideoFrameType>frameType,
			codecId: codecId,
			codecDescription: VIDEOCODECS[codecId]
		};
		switch (codecId) {
			case AVC_VIDEO_CODEC_ID:
				let type = data[i++];
				result.packetType = <VideoPacketType>type;
				result.compositionTime = ((data[i] << 24) | (data[i + 1] << 16) | (data[i + 2] << 8)) >> 8;
				i += 3;
				break;
			case VP6_VIDEO_CODEC_ID:
				result.packetType = VideoPacketType.NALU;
				result.horizontalOffset = (data[i] >> 4) & 15;
				result.verticalOffset = data[i] & 15;
				result.compositionTime = 0;
				i++;
				break;
		}
		result.data = data.subarray(i);
		return result;
	}

	let AUDIO_PACKET = 8;
	let VIDEO_PACKET = 9;
	let MAX_PACKETS_IN_CHUNK = 200;
	let SPLIT_AT_KEYFRAMES = false;

	interface CachedPacket {
		packet: any;
		timestamp: number;
		trackId: number;
	}

	export interface MP4Track {
		codecDescription?: string;
		codecId: number;
		language: string;
		timescale: number;

		samplerate?: number;
		channels?: number;
		samplesize?: number;

		framerate?: number;
		width?: number;
		height?: number;
	}

	export interface MP4Metadata {
		tracks: MP4Track[];
		duration: number;
		audioTrackId: number;
		videoTrackId: number;
	}

	enum MP4MuxState {
		CAN_GENERATE_HEADER = 0,
		NEED_HEADER_DATA = 1,
		MAIN_PACKETS = 2
	}

	interface MP4TrackState {
		trackId: number;
		trackInfo: MP4Track;
		cachedDuration: number;
		samplesProcessed: number;
		initializationData: Uint8Array[];
		mimeTypeCodec?: string;
	}

	export class MP4Mux {
		private metadata: MP4Metadata;

		private filePos: number;
		private cachedPackets: CachedPacket[];
		private trackStates: MP4TrackState[];
		private audioTrackState: MP4TrackState;
		private videoTrackState: MP4TrackState;
		private state: MP4MuxState;
		private chunkIndex: number;

		oncodecinfo: (codecs: string[]) => void = function (codecs: string[]) {
			//
		};

		ondata: (data: any) => void = function (data) {
			throw new Error('MP4Mux.ondata is not set');
		};

		public constructor(metadata: MP4Metadata) {
			this.metadata = metadata;

			this.trackStates = this.metadata.tracks.map((t, index) => {
				let state = {
					trackId: index + 1,
					trackInfo: t,
					cachedDuration: 0,
					samplesProcessed: 0,
					initializationData: [] as any
				};
				if (this.metadata.audioTrackId === index) {
					this.audioTrackState = state;
				}
				if (this.metadata.videoTrackId === index) {
					this.videoTrackState = state;
				}
				return state;
			}, this);

			this._checkIfNeedHeaderData();

			this.filePos = 0;
			this.cachedPackets = [];
			this.chunkIndex = 0;
		}

		public pushPacket(type: number, data: Uint8Array, timestamp: number) {
			if (this.state === MP4MuxState.CAN_GENERATE_HEADER) {
				this._tryGenerateHeader();
			}

			switch (type) {
				case AUDIO_PACKET: // audio
					let audioTrack = this.audioTrackState;
					let audioPacket = parseAudiodata(data);
					if (!audioTrack || audioTrack.trackInfo.codecId !== audioPacket.codecId) {
						throw new Error('Unexpected audio packet codec: ' + audioPacket.codecDescription);
					}
					switch (audioPacket.codecId) {
						default:
							throw new Error('Unsupported audio codec: ' + audioPacket.codecDescription);
						case MP3_SOUND_CODEC_ID:
							break; // supported codec
						case AAC_SOUND_CODEC_ID:
							if (audioPacket.packetType === AudioPacketType.HEADER) {
								audioTrack.initializationData.push(audioPacket.data);
								return;
							}
							break;
					}
					this.cachedPackets.push({packet: audioPacket, timestamp: timestamp, trackId: audioTrack.trackId});
					break;
				case VIDEO_PACKET:
					let videoTrack = this.videoTrackState;
					let videoPacket = parseVideodata(data);
					if (!videoTrack || videoTrack.trackInfo.codecId !== videoPacket.codecId) {
						throw new Error('Unexpected video packet codec: ' + videoPacket.codecDescription);
					}
					switch (videoPacket.codecId) {
						default:
							throw new Error('unsupported video codec: ' + videoPacket.codecDescription);
						case VP6_VIDEO_CODEC_ID:
							break; // supported
						case AVC_VIDEO_CODEC_ID:
							if (videoPacket.packetType === VideoPacketType.HEADER) {
								videoTrack.initializationData.push(videoPacket.data);
								return;
							}
							break;
					}
					this.cachedPackets.push({packet: videoPacket, timestamp: timestamp, trackId: videoTrack.trackId});
					break;
				default:
					throw new Error('unknown packet type: ' + type);
			}

			if (this.state === MP4MuxState.NEED_HEADER_DATA) {
				this._tryGenerateHeader();
			}
			if (this.cachedPackets.length >= MAX_PACKETS_IN_CHUNK &&
				this.state === MP4MuxState.MAIN_PACKETS) {
				this._chunk();
			}
		}

		public flush() {
			if (this.cachedPackets.length > 0) {
				this._chunk();
			}
		}

		private _checkIfNeedHeaderData() {
			if (this.trackStates.some((ts) =>
					ts.trackInfo.codecId === AAC_SOUND_CODEC_ID || ts.trackInfo.codecId === AVC_VIDEO_CODEC_ID)) {
				this.state = MP4MuxState.NEED_HEADER_DATA;
			} else {
				this.state = MP4MuxState.CAN_GENERATE_HEADER;
			}
		}

		private _tryGenerateHeader() {
			let allInitializationDataExists = this.trackStates.every((ts) => {
				switch (ts.trackInfo.codecId) {
					case AAC_SOUND_CODEC_ID:
					case AVC_VIDEO_CODEC_ID:
						return ts.initializationData.length > 0;
					default:
						return true;
				}
			});
			if (!allInitializationDataExists) {
				return; // not enough data, waiting more
			}

			let brands: string[] = ['isom'];
			let audioDataReferenceIndex = 1, videoDataReferenceIndex = 1;
			let traks: Iso.TrackBox[] = [];
			for (let i = 0; i < this.trackStates.length; i++) {
				let trackState = this.trackStates[i];
				let trackInfo = trackState.trackInfo;
				let sampleEntry: Iso.SampleEntry;
				switch (trackInfo.codecId) {
					case AAC_SOUND_CODEC_ID:
						let audioSpecificConfig = trackState.initializationData[0];
						sampleEntry = new Iso.AudioSampleEntry('mp4a', audioDataReferenceIndex, trackInfo.channels, trackInfo.samplesize, trackInfo.samplerate);

						let esdsData = new Uint8Array(41 + audioSpecificConfig.length);
						esdsData.set(hex('0000000003808080'), 0);
						esdsData[8] = 32 + audioSpecificConfig.length;
						esdsData.set(hex('00020004808080'), 9);
						esdsData[16] = 18 + audioSpecificConfig.length;
						esdsData.set(hex('40150000000000FA000000000005808080'), 17);
						esdsData[34] = audioSpecificConfig.length;
						esdsData.set(audioSpecificConfig, 35);
						esdsData.set(hex('068080800102'), 35 + audioSpecificConfig.length);
						(<Iso.AudioSampleEntry>sampleEntry).otherBoxes = [
							new Iso.RawTag('esds', esdsData)
						];
						let objectType = (audioSpecificConfig[0] >> 3); // TODO 31
						// mp4a.40.objectType
						trackState.mimeTypeCodec = 'mp4a.40.' + objectType;
						break;
					case MP3_SOUND_CODEC_ID:
						sampleEntry = new Iso.AudioSampleEntry('.mp3', audioDataReferenceIndex, trackInfo.channels, trackInfo.samplesize, trackInfo.samplerate);
						trackState.mimeTypeCodec = 'mp3';
						break;
					case AVC_VIDEO_CODEC_ID:
						let avcC = trackState.initializationData[0];
						sampleEntry = new Iso.VideoSampleEntry('avc1', videoDataReferenceIndex, trackInfo.width, trackInfo.height);
						(<Iso.VideoSampleEntry>sampleEntry).otherBoxes = [
							new Iso.RawTag('avcC', avcC)
						];
						let codecProfile = (avcC[1] << 16) | (avcC[2] << 8) | avcC[3];
						// avc1.XXYYZZ -- XX - profile + YY - constraints + ZZ - level
						trackState.mimeTypeCodec = 'avc1.' + (0x1000000 | codecProfile).toString(16).substr(1);
						brands.push('iso2', 'avc1', 'mp41');
						break;
					case VP6_VIDEO_CODEC_ID:
						sampleEntry = new Iso.VideoSampleEntry('VP6F', videoDataReferenceIndex, trackInfo.width, trackInfo.height);
						(<Iso.VideoSampleEntry>sampleEntry).otherBoxes = [
							new Iso.RawTag('glbl', hex('00'))
						];
						// TODO to lie about codec to get it playing in MSE?
						trackState.mimeTypeCodec = 'avc1.42001E';
						break;
					default:
						throw new Error('not supported track type');
				}

				let trak;
				let trakFlags = Iso.TrackHeaderFlags.TRACK_ENABLED | Iso.TrackHeaderFlags.TRACK_IN_MOVIE;
				if (trackState === this.audioTrackState) {
					trak = new Iso.TrackBox(
						new Iso.TrackHeaderBox(trakFlags, trackState.trackId, -1, 0 /*width*/, 0 /*height*/, 1.0, i),
						new Iso.MediaBox(
							new Iso.MediaHeaderBox(trackInfo.timescale, -1, trackInfo.language),
							new Iso.HandlerBox('soun', 'SoundHandler'),
							new Iso.MediaInformationBox(
								new Iso.SoundMediaHeaderBox(),
								new Iso.DataInformationBox(
									new Iso.DataReferenceBox([new Iso.DataEntryUrlBox(Iso.SELF_CONTAINED_DATA_REFERENCE_FLAG)])),
								new Iso.SampleTableBox(
									new Iso.SampleDescriptionBox([sampleEntry]),
									new Iso.RawTag('stts', hex('0000000000000000')),
									new Iso.RawTag('stsc', hex('0000000000000000')),
									new Iso.RawTag('stsz', hex('000000000000000000000000')),
									new Iso.RawTag('stco', hex('0000000000000000'))
								)
							)
						)
					);
				} else if (trackState === this.videoTrackState) {
					trak = new Iso.TrackBox(
						new Iso.TrackHeaderBox(trakFlags, trackState.trackId, -1, trackInfo.width, trackInfo.height, 0 /* volume */, i),
						new Iso.MediaBox(
							new Iso.MediaHeaderBox(trackInfo.timescale, -1, trackInfo.language),
							new Iso.HandlerBox('vide', 'VideoHandler'),
							new Iso.MediaInformationBox(
								new Iso.VideoMediaHeaderBox(),
								new Iso.DataInformationBox(
									new Iso.DataReferenceBox([new Iso.DataEntryUrlBox(Iso.SELF_CONTAINED_DATA_REFERENCE_FLAG)])),
								new Iso.SampleTableBox(
									new Iso.SampleDescriptionBox([sampleEntry]),
									new Iso.RawTag('stts', hex('0000000000000000')),
									new Iso.RawTag('stsc', hex('0000000000000000')),
									new Iso.RawTag('stsz', hex('000000000000000000000000')),
									new Iso.RawTag('stco', hex('0000000000000000'))
								)
							)
						)
					);
				}
				traks.push(trak);
			}

			let mvex = new Iso.MovieExtendsBox(null, [
				new Iso.TrackExtendsBox(1, 1, 0, 0, 0),
				new Iso.TrackExtendsBox(2, 1, 0, 0, 0)
			], null);
			let udat = new Iso.BoxContainerBox('udat', [
				new Iso.MetaBox(
					new Iso.RawTag('hdlr', hex('00000000000000006D6469726170706C000000000000000000')), // notice weird stuff in reserved field
					[new Iso.RawTag('ilst', hex('00000025A9746F6F0000001D6461746100000001000000004C61766635342E36332E313034'))]
				)
			]);
			let mvhd = new Iso.MovieHeaderBox(1000, 0 /* unknown duration */, this.trackStates.length + 1);
			let moov = new Iso.MovieBox(mvhd, traks, mvex, udat);
			let ftype = new Iso.FileTypeBox('isom', 0x00000200, brands);

			let ftypeSize = ftype.layout(0);
			let moovSize = moov.layout(ftypeSize);

			let header = new Uint8Array(ftypeSize + moovSize);
			ftype.write(header);
			moov.write(header);

			this.oncodecinfo(this.trackStates.map((ts) => ts.mimeTypeCodec));
			this.ondata(header);
			this.filePos += header.length;
			this.state = MP4MuxState.MAIN_PACKETS;
		}

		_chunk() {
			let cachedPackets = this.cachedPackets;

			if (SPLIT_AT_KEYFRAMES) {
				let j = cachedPackets.length - 1;
				let videoTrackId = this.videoTrackState.trackId;
				// Finding last video keyframe.
				while (j > 0 &&
				(cachedPackets[j].trackId !== videoTrackId || cachedPackets[j].packet.frameType !== VideoFrameType.KEY)) {
					j--;
				}
				if (j > 0) {
					// We have keyframes and not only the first frame is a keyframe...
					cachedPackets = cachedPackets.slice(0, j);
				}
			}
			if (cachedPackets.length === 0) {
				return; // No data to produce.
			}

			let tdatParts: Uint8Array[] = [];
			let tdatPosition: number = 0;
			let trafs: Iso.TrackFragmentBox[] = [];
			let trafDataStarts: number[] = [];

			for (let i = 0; i < this.trackStates.length; i++) {
				let trackState = this.trackStates[i];
				let trackInfo = trackState.trackInfo;
				let trackId = trackState.trackId;

				// Finding all packets for this track.
				let trackPackets = cachedPackets.filter((cp) => cp.trackId === trackId);
				if (trackPackets.length === 0) {
					continue;
				}

				//let currentTimestamp = (trackPackets[0].timestamp * trackInfo.timescale / 1000) | 0;
				let tfdt = new Iso.TrackFragmentBaseMediaDecodeTimeBox(trackState.cachedDuration);
				let tfhd: Iso.TrackFragmentHeaderBox;
				let trun: Iso.TrackRunBox;
				let trunSamples: Iso.TrackRunSample[];
				let tfhdFlags: number, trunFlags: number;

				trafDataStarts.push(tdatPosition);
				switch (trackInfo.codecId) {
					case AAC_SOUND_CODEC_ID:
					case MP3_SOUND_CODEC_ID:
						trunSamples = [];
						for (let j = 0; j < trackPackets.length; j++) {
							let audioPacket: AudioPacket = trackPackets[j].packet;
							let audioFrameDuration = Math.round(audioPacket.samples * trackInfo.timescale / trackInfo.samplerate);
							tdatParts.push(audioPacket.data);
							tdatPosition += audioPacket.data.length;
							trunSamples.push({duration: audioFrameDuration, size: audioPacket.data.length});
							trackState.samplesProcessed += audioPacket.samples;
						}
						tfhdFlags = Iso.TrackFragmentFlags.DEFAULT_SAMPLE_FLAGS_PRESENT;
						tfhd = new Iso.TrackFragmentHeaderBox(tfhdFlags, trackId, 0 /* offset */, 0 /* index */, 0 /* duration */, 0 /* size */, Iso.SampleFlags.SAMPLE_DEPENDS_ON_NO_OTHERS);
						trunFlags = Iso.TrackRunFlags.DATA_OFFSET_PRESENT |
							Iso.TrackRunFlags.SAMPLE_DURATION_PRESENT | Iso.TrackRunFlags.SAMPLE_SIZE_PRESENT;
						trun = new Iso.TrackRunBox(trunFlags, trunSamples, 0 /* data offset */, 0 /* first flags */);
						trackState.cachedDuration = Math.round(trackState.samplesProcessed * trackInfo.timescale / trackInfo.samplerate);
						break;
					case AVC_VIDEO_CODEC_ID:
					case VP6_VIDEO_CODEC_ID:
						trunSamples = [];
						let samplesProcessed = trackState.samplesProcessed;
						let decodeTime = samplesProcessed * trackInfo.timescale / trackInfo.framerate;
						let lastTime = Math.round(decodeTime);
						for (let j = 0; j < trackPackets.length; j++) {
							let videoPacket: VideoPacket = trackPackets[j].packet;
							samplesProcessed++;
							let nextTime = Math.round(samplesProcessed * trackInfo.timescale / trackInfo.framerate);
							let videoFrameDuration = nextTime - lastTime;
							lastTime = nextTime;
							let compositionTime = Math.round(samplesProcessed * trackInfo.timescale / trackInfo.framerate +
								videoPacket.compositionTime * trackInfo.timescale / 1000);

							tdatParts.push(videoPacket.data);
							tdatPosition += videoPacket.data.length;
							let frameFlags = videoPacket.frameType === VideoFrameType.KEY ?
								Iso.SampleFlags.SAMPLE_DEPENDS_ON_NO_OTHERS :
								(Iso.SampleFlags.SAMPLE_DEPENDS_ON_OTHER | Iso.SampleFlags.SAMPLE_IS_NOT_SYNC);
							trunSamples.push({
								duration: videoFrameDuration, size: videoPacket.data.length,
								flags: frameFlags, compositionTimeOffset: (compositionTime - nextTime)
							});
						}
						tfhdFlags = Iso.TrackFragmentFlags.DEFAULT_SAMPLE_FLAGS_PRESENT;
						tfhd = new Iso.TrackFragmentHeaderBox(tfhdFlags, trackId, 0 /* offset */, 0 /* index */, 0 /* duration */, 0 /* size */, Iso.SampleFlags.SAMPLE_DEPENDS_ON_NO_OTHERS);
						trunFlags = Iso.TrackRunFlags.DATA_OFFSET_PRESENT |
							Iso.TrackRunFlags.SAMPLE_DURATION_PRESENT | Iso.TrackRunFlags.SAMPLE_SIZE_PRESENT |
							Iso.TrackRunFlags.SAMPLE_FLAGS_PRESENT | Iso.TrackRunFlags.SAMPLE_COMPOSITION_TIME_OFFSET;
						trun = new Iso.TrackRunBox(trunFlags, trunSamples, 0 /* data offset */, 0 /* first flag */);
						trackState.cachedDuration = lastTime;
						trackState.samplesProcessed = samplesProcessed;
						break;
					default:
						throw new Error('Un codec');
				}

				let traf = new Iso.TrackFragmentBox(tfhd, tfdt, trun);
				trafs.push(traf);
			}
			this.cachedPackets.splice(0, cachedPackets.length);

			let moofHeader = new Iso.MovieFragmentHeaderBox(++this.chunkIndex);
			let moof = new Iso.MovieFragmentBox(moofHeader, trafs);
			let moofSize = moof.layout(0);
			let mdat = new Iso.MediaDataBox(tdatParts);
			let mdatSize = mdat.layout(moofSize);

			let tdatOffset = moofSize + 8 /* 'mdat' header size */;
			for (let i = 0; i < trafs.length; i++) {
				trafs[i].run.dataOffset = tdatOffset + trafDataStarts[i];
			}

			let chunk = new Uint8Array(moofSize + mdatSize);
			moof.write(chunk);
			mdat.write(chunk);

			this.ondata(chunk);
			this.filePos += chunk.length;
		}
	}

	export function parseFLVMetadata(metadata: any): MP4Metadata {
		let tracks: MP4Track[] = [];
		let audioTrackId = -1;
		let videoTrackId = -1;

		let duration = +metadata.axGetPublicProperty('duration');

		let audioCodec, audioCodecId;
		let audioCodecCode = metadata.axGetPublicProperty('audiocodecid');
		switch (audioCodecCode) {
			case MP3_SOUND_CODEC_ID:
			case 'mp3':
				audioCodec = 'mp3';
				audioCodecId = MP3_SOUND_CODEC_ID;
				break;
			case AAC_SOUND_CODEC_ID:
			case 'mp4a':
				audioCodec = 'mp4a';
				audioCodecId = AAC_SOUND_CODEC_ID;
				break;
			default:
				if (!isNaN(audioCodecCode)) {
					throw new Error('Unsupported audio codec: ' + audioCodecCode);
				}
				audioCodec = null;
				audioCodecId = -1;
				break;
		}

		let videoCodec, videoCodecId;
		let videoCodecCode = metadata.axGetPublicProperty('videocodecid');
		switch (videoCodecCode) {
			case VP6_VIDEO_CODEC_ID:
			case 'vp6f':
				videoCodec = 'vp6f';
				videoCodecId = VP6_VIDEO_CODEC_ID;
				break;
			case AVC_VIDEO_CODEC_ID:
			case 'avc1':
				videoCodec = 'avc1';
				videoCodecId = AVC_VIDEO_CODEC_ID;
				break;
			default:
				if (!isNaN(videoCodecCode)) {
					throw new Error('Unsupported video codec: ' + videoCodecCode);
				}
				videoCodec = null;
				videoCodecId = -1;
				break;
		}

		let audioTrack: MP4Track = (audioCodec === null) ? null : {
			codecDescription: audioCodec,
			codecId: audioCodecId,
			language: 'und',
			timescale: +metadata.axGetPublicProperty('audiosamplerate') || 44100,
			samplerate: +metadata.axGetPublicProperty('audiosamplerate') || 44100,
			channels: +metadata.axGetPublicProperty('audiochannels') || 2,
			samplesize: 16
		};
		let videoTrack: MP4Track = (videoCodec === null) ? null : {
			codecDescription: videoCodec,
			codecId: videoCodecId,
			language: 'und',
			timescale: 60000,
			framerate: +metadata.axGetPublicProperty('videoframerate') ||
			+metadata.axGetPublicProperty('framerate'),
			width: +metadata.axGetPublicProperty('width'),
			height: +metadata.axGetPublicProperty('height')
		};

		let trackInfos = metadata.axGetPublicProperty('trackinfo');
		if (trackInfos) {
			// Not in the Adobe's references, red5 specific?
			for (let i = 0; i < trackInfos.length; i++) {
				let info = trackInfos[i];
				let sampleDescription = info.axGetPublicProperty('sampledescription')[0];
				if (sampleDescription.axGetPublicProperty('sampletype') === audioCodecCode) {
					audioTrack.language = info.axGetPublicProperty('language');
					audioTrack.timescale = +info.axGetPublicProperty('timescale');
				} else if (sampleDescription.axGetPublicProperty('sampletype') === videoCodecCode) {
					videoTrack.language = info.axGetPublicProperty('language');
					videoTrack.timescale = +info.axGetPublicProperty('timescale');
				}
			}
		}

		if (videoTrack) {
			videoTrackId = tracks.length;
			tracks.push(videoTrack);
		}
		if (audioTrack) {
			audioTrackId = tracks.length;
			tracks.push(audioTrack);
		}

		return {
			tracks: tracks,
			duration: duration,
			audioTrackId: audioTrackId,
			videoTrackId: videoTrackId
		};
	}
}

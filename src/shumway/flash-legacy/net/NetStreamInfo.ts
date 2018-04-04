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
// Class: NetStreamInfo
module Shumway.flash.net {
	export class NetStreamInfo extends LegacyEntity {
		constructor(curBPS: number, byteCount: number, maxBPS: number, audioBPS: number,
		            audioByteCount: number, videoBPS: number, videoByteCount: number, dataBPS: number,
		            dataByteCount: number, playbackBPS: number, droppedFrames: number,
		            audioBufferByteLength: number, videoBufferByteLength: number,
		            dataBufferByteLength: number, audioBufferLength: number, videoBufferLength: number,
		            dataBufferLength: number, srtt: number, audioLossRate: number,
		            videoLossRate: number, metaData: any = null, xmpData: any = null,
		            uri: string = null, resourceName: string = null, isLive: boolean = true) {
			super();
			this.currentBytesPerSecond = +curBPS;
			this.byteCount = +byteCount;
			this.maxBytesPerSecond = +maxBPS;
			this.audioBytesPerSecond = +audioBPS;
			this.audioByteCount = +audioByteCount;
			this.videoBytesPerSecond = +videoBPS;
			this.videoByteCount = +videoByteCount;
			this.dataBytesPerSecond = +dataBPS;
			this.dataByteCount = +dataByteCount;
			this.playbackBytesPerSecond = +playbackBPS;
			this.droppedFrames = +droppedFrames;
			this.audioBufferByteLength = +audioBufferByteLength;
			this.videoBufferByteLength = +videoBufferByteLength;
			this.dataBufferByteLength = +dataBufferByteLength;
			this.audioBufferLength = +audioBufferLength;
			this.videoBufferLength = +videoBufferLength;
			this.dataBufferLength = +dataBufferLength;
			this._srtt = +srtt;
			this.audioLossRate = +audioLossRate;
			this.videoLossRate = +videoLossRate;
			this.metaData = metaData;
			this.xmpData = xmpData;
			this.uri = uri;
			this.resourceName = resourceName;
			this.isLive = !!isLive;
		}

		currentBytesPerSecond: number;
		byteCount: number;
		maxBytesPerSecond: number;
		audioBytesPerSecond: number;
		audioByteCount: number;
		videoBytesPerSecond: number;
		videoByteCount: number;
		dataBytesPerSecond: number;
		dataByteCount: number;
		playbackBytesPerSecond: number;
		droppedFrames: number;
		audioBufferByteLength: number;
		videoBufferByteLength: number;
		dataBufferByteLength: number;
		audioBufferLength: number;
		videoBufferLength: number;
		dataBufferLength: number;
		SRTT: number;
		audioLossRate: number;
		videoLossRate: number;
		metaData: any;
		xmpData: any;
		uri: string;
		resourceName: string;
		isLive: boolean;
		_curBPS: number;
		_byteCount: number;
		_maxBPS: number;
		_audioBPS: number;
		_audioByteCount: number;
		_videoBPS: number;
		_videoByteCount: number;
		_dataBPS: number;
		_dataByteCount: number;
		_playbackBPS: number;
		_droppedFrames: number;
		_audioBufferByteLength: number;
		_videoBufferByteLength: number;
		_dataBufferByteLength: number;
		_audioBufferLength: number;
		_videoBufferLength: number;
		_dataBufferLength: number;
		_srtt: number;
		_audioLossRate: number;
		_videoLossRate: number;
		_metaData: any;
		_xmpData: any;
		_uri: string;
		_resourceName: string;
		_isLive: boolean;
	}
}

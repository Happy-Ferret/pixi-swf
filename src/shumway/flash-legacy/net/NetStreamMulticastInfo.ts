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
// Class: NetStreamMulticastInfo
module Shumway.flash.net {
	export class NetStreamMulticastInfo extends LegacyEntity {
		constructor(sendDataBytesPerSecond: number, sendControlBytesPerSecond: number,
		            receiveDataBytesPerSecond: number, receiveControlBytesPerSecond: number,
		            bytesPushedToPeers: number, fragmentsPushedToPeers: number,
		            bytesRequestedByPeers: number, fragmentsRequestedByPeers: number,
		            bytesPushedFromPeers: number, fragmentsPushedFromPeers: number,
		            bytesRequestedFromPeers: number, fragmentsRequestedFromPeers: number,
		            sendControlBytesPerSecondToServer: number,
		            receiveDataBytesPerSecondFromServer: number, bytesReceivedFromServer: number,
		            fragmentsReceivedFromServer: number,
		            receiveDataBytesPerSecondFromIPMulticast: number,
		            bytesReceivedFromIPMulticast: number, fragmentsReceivedFromIPMulticast: number) {
			super();
			this.sendDataBytesPerSecond = +sendDataBytesPerSecond;
			this.sendControlBytesPerSecond = +sendControlBytesPerSecond;
			this.receiveDataBytesPerSecond = +receiveDataBytesPerSecond;
			this.receiveControlBytesPerSecond = +receiveControlBytesPerSecond;
			this.bytesPushedToPeers = +bytesPushedToPeers;
			this.fragmentsPushedToPeers = +fragmentsPushedToPeers;
			this.bytesRequestedByPeers = +bytesRequestedByPeers;
			this.fragmentsRequestedByPeers = +fragmentsRequestedByPeers;
			this.bytesPushedFromPeers = +bytesPushedFromPeers;
			this.fragmentsPushedFromPeers = +fragmentsPushedFromPeers;
			this.bytesRequestedFromPeers = +bytesRequestedFromPeers;
			this.fragmentsRequestedFromPeers = +fragmentsRequestedFromPeers;
			this.sendControlBytesPerSecondToServer = +sendControlBytesPerSecondToServer;
			this.receiveDataBytesPerSecondFromServer = +receiveDataBytesPerSecondFromServer;
			this.bytesReceivedFromServer = +bytesReceivedFromServer;
			this.fragmentsReceivedFromServer = +fragmentsReceivedFromServer;
			this.receiveDataBytesPerSecondFromIPMulticast = +receiveDataBytesPerSecondFromIPMulticast;
			this.bytesReceivedFromIPMulticast = +bytesReceivedFromIPMulticast;
			this.fragmentsReceivedFromIPMulticast = +fragmentsReceivedFromIPMulticast;
		}

		// JS -> AS Bindings

		_sendDataBytesPerSecond: number;
		_sendControlBytesPerSecond: number;
		_receiveDataBytesPerSecond: number;
		_receiveControlBytesPerSecond: number;
		_bytesPushedToPeers: number;
		_fragmentsPushedToPeers: number;
		_bytesRequestedByPeers: number;
		_fragmentsRequestedByPeers: number;
		_bytesPushedFromPeers: number;
		_fragmentsPushedFromPeers: number;
		_bytesRequestedFromPeers: number;
		_fragmentsRequestedFromPeers: number;
		_sendControlBytesPerSecondToServer: number;
		_receiveDataBytesPerSecondFromServer: number;
		_bytesReceivedFromServer: number;
		_fragmentsReceivedFromServer: number;
		_receiveDataBytesPerSecondFromIPMulticast: number;
		_bytesReceivedFromIPMulticast: number;
		_fragmentsReceivedFromIPMulticast: number;
		sendDataBytesPerSecond: number;
		sendControlBytesPerSecond: number;
		receiveDataBytesPerSecond: number;
		receiveControlBytesPerSecond: number;
		bytesPushedToPeers: number;
		fragmentsPushedToPeers: number;
		bytesRequestedByPeers: number;
		fragmentsRequestedByPeers: number;
		bytesPushedFromPeers: number;
		fragmentsPushedFromPeers: number;
		bytesRequestedFromPeers: number;
		fragmentsRequestedFromPeers: number;
		sendControlBytesPerSecondToServer: number;
		receiveDataBytesPerSecondFromServer: number;
		bytesReceivedFromServer: number;
		fragmentsReceivedFromServer: number;
		receiveDataBytesPerSecondFromIPMulticast: number;
		bytesReceivedFromIPMulticast: number;
		fragmentsReceivedFromIPMulticast: number;
	}
}

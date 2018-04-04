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

module RtmpJs.Browser {
	let DEFAULT_RTMP_PORT = 1935;
	let COMBINE_RTMPT_DATA = true;

	export class RtmpTransport extends BaseTransport {
		host: string;
		port: number;
		ssl: boolean;

		constructor(connectionSettings: any) {
			super();

			if (typeof connectionSettings === 'string') {
				connectionSettings = {host: connectionSettings};
			}

			this.host = connectionSettings.host || 'localhost';
			this.port = connectionSettings.port || DEFAULT_RTMP_PORT;
			this.ssl = !!connectionSettings.ssl || false;
		}

		connect(properties: any, args?: any) {
			let TCPSocket = typeof navigator !== 'undefined' &&
				(<any>navigator).mozTCPSocket;

			if (!TCPSocket) {
				throw new Error('Your browser does not support socket communication.\n' +
					'Currenly only Firefox with enabled mozTCPSocket is allowed (see README.md).');
			}

			let channel = this._initChannel(properties, args);

			let writeQueue: Array<Uint8Array> = [], socketError = false;
			let socket: any = typeof ShumwayComRtmpSocket !== 'undefined' && ShumwayComRtmpSocket.isAvailable ?
				new ShumwayComRtmpSocket(this.host, this.port, {
					useSecureTransport: this.ssl,
					binaryType: 'arraybuffer'
				}) :
				TCPSocket.open(this.host, this.port, {useSecureTransport: this.ssl, binaryType: 'arraybuffer'});


			let sendData = function (data: Uint8Array) {
				return socket.send(data.buffer, data.byteOffset, data.byteLength);
			};

			socket.onopen = function (e: any) {
				channel.ondata = function (data) {
					let buf = new Uint8Array(data);
					writeQueue.push(buf);
					if (writeQueue.length > 1) {
						return;
					}
					release || console.log('Bytes written: ' + buf.length);
					if (sendData(buf)) {
						writeQueue.shift();
					}
				};
				channel.onclose = function () {
					socket.close();
				};
				channel.start();
			};
			socket.ondrain = function (e: any) {
				writeQueue.shift();
				release || console.log('Write completed');
				while (writeQueue.length > 0) {
					release || console.log('Bytes written: ' + writeQueue[0].length);
					if (!sendData(writeQueue[0])) {
						break;
					}
					writeQueue.shift();
				}
			};
			socket.onclose = function (e: any) {
				channel.stop(socketError);
			};
			socket.onerror = function (e: any) {
				socketError = true;
				console.error('socket error: ' + e.data);
			};
			socket.ondata = function (e: any) {
				release || console.log('Bytes read: ' + e.data.byteLength);
				channel.push(new Uint8Array(e.data));
			};
		}
	}


	/*
	 * RtmptTransport uses systemXHR to send HTTP requests.
	 * See https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest#XMLHttpRequest%28%29 and
	 * https://github.com/mozilla-b2g/gaia/blob/master/apps/email/README.md#running-in-firefox
	 *
	 * Spec at http://red5.electroteque.org/dev/doc/html/rtmpt.html
	 */
	export class RtmptTransport extends BaseTransport {
		baseUrl: string;
		stopped: boolean;
		sessionId: string;
		requestId: number;
		data: Uint8Array[];

		constructor(connectionSettings: any) {
			super();

			let host = connectionSettings.host || 'localhost';
			let url = (connectionSettings.ssl ? 'https' : 'http') + '://' + host;
			if (connectionSettings.port) {
				url += ':' + connectionSettings.port;
			}
			this.baseUrl = url;

			this.stopped = false;
			this.sessionId = null;
			this.requestId = 0;
			this.data = [];
		}

		connect(properties: any, args?: any) {
			let channel = this._initChannel(properties, args);
			channel.ondata = function (data: any) {
				release || console.log('Bytes written: ' + data.length);
				this.data.push(new Uint8Array(data));
			}.bind(this);
			channel.onclose = function () {
				this.stopped = true;
			}.bind(this);


			post(this.baseUrl + '/fcs/ident2', null, function (data: any, status: any) {
				if (status !== 404) {
					throw new Error('Unexpected response: ' + status);
				}

				post(this.baseUrl + '/open/1', null, function (data: any, status: any) {
					this.sessionId = String.fromCharCode.apply(null, data).slice(0, -1); // - '\n'
					console.log('session id: ' + this.sessionId);

					this.tick();
					channel.start();
				}.bind(this));
			}.bind(this));
		}

		tick() {
			let continueSend = function (data: any, status: number) {
				if (status !== 200) {
					throw new Error('Invalid HTTP status');
				}

				let idle = data[0];
				if (data.length > 1) {
					this.channel.push(data.subarray(1));
				}
				setTimeout(this.tick.bind(this), idle * 16);
			}.bind(this);

			if (this.stopped) {
				post(this.baseUrl + '/close/2', null, function () {
					// do nothing
				});
				return;
			}

			if (this.data.length > 0) {
				let data: Uint8Array;
				if (COMBINE_RTMPT_DATA) {
					let length = 0;
					this.data.forEach(function (i: Uint8Array) {
						length += i.length;
					});
					let pos = 0;
					data = new Uint8Array(length);
					this.data.forEach(function (i: Uint8Array) {
						data.set(i, pos);
						pos += i.length;
					});
					this.data.length = 0;
				} else {
					data = this.data.shift();
				}
				post(this.baseUrl + '/send/' + this.sessionId + '/' + (this.requestId++),
					data, continueSend);
			} else {
				post(this.baseUrl + '/idle/' + this.sessionId + '/' + (this.requestId++),
					null, continueSend);
			}
		}
	}

	let emptyPostData = new Uint8Array([0]);

	function post(path: any, data: any, onload: any) {
		data || (data = emptyPostData);

		let xhr: any = typeof ShumwayComRtmpXHR !== 'undefined' && ShumwayComRtmpXHR.isAvailable ?
			new ShumwayComRtmpXHR() : new (<any>XMLHttpRequest)({mozSystem: true});
		xhr.open('POST', path, true);
		xhr.responseType = 'arraybuffer';
		xhr.setRequestHeader('Content-Type', 'application/x-fcs');
		xhr.onload = function (e: any) {
			onload(new Uint8Array(xhr.response), xhr.status);
		};
		xhr.onerror = function (e: any) {
			console.log('error');
			throw new Error('HTTP error');
		};
		xhr.send(data);
	}
}

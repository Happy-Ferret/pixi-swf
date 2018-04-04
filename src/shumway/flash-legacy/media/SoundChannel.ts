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
// Class: SoundChannel
module Shumway.flash.media {
	import assert = Shumway.Debug.assert;
	import somewhatImplemented = Shumway.Debug.somewhatImplemented;
	import error = Shumway.Debug.error;

	declare let URL: any;
	declare let Blob: any;

	declare class AudioContext {
		constructor();

		sampleRate: number;
		destination: any;

		createScriptProcessor(a: any, b: any, c: any): any;
	}

	function createAudioChannel(sampleRate: number, channels: number) {
		if (WebAudioChannel.isSupported) {
			return new WebAudioChannel(sampleRate, channels);
		} else {
			error('PCM data playback is not supported by the browser');
			return null;
		}
	}

	// Resample sound using linear interpolation for Web Audio due to
	// http://code.google.com/p/chromium/issues/detail?id=73062
	interface AudioResamplerData {
		data: any[];
		count: number;
	}

	class AudioResampler {
		ondatarequested: (e: AudioResamplerData) => void;
		private _sourceRate: number;
		private _targetRate: number;
		private _tail: any[];
		private _sourceOffset: number;

		constructor(sourceRate: number, targetRate: number) {
			this._sourceRate = sourceRate;
			this._targetRate = targetRate;
			this._tail = [];
			this._sourceOffset = 0;
		}

		getData(channelsData: any, count: number) {
			let k = this._sourceRate / this._targetRate;

			let offset = this._sourceOffset;
			let needed = Math.ceil((count - 1) * k + offset) + 1;
			let sourceData = [];
			for (let channel = 0; channel < channelsData.length; channel++) {
				sourceData.push(new Float32Array(needed));
			}
			let e = {data: sourceData, count: needed};
			this.ondatarequested(e);
			for (let channel = 0; channel < channelsData.length; channel++) {
				let data = channelsData[channel];
				let source = sourceData[channel];
				for (let j = 0; j < count; j++) {
					let i = j * k + offset;
					let i1 = i | 0, i2 = Math.ceil(i) | 0;
					let source_i1 = i1 < 0 ? this._tail[channel] : source[i1];
					if (i1 === i2) {
						data[j] = source_i1;
					} else {
						let alpha = i - i1;
						data[j] = source_i1 * (1 - alpha) + source[i2] * alpha;
					}
				}
				this._tail[channel] = source[needed - 1];
			}
			this._sourceOffset = ((count - 1) * k + offset) - (needed - 1);
		}
	}

	class WebAudioChannel {
		private static _cachedContext: AudioContext;
		private _contextSampleRate: number;
		private _context: AudioContext;
		private _resampler: AudioResampler;
		private _channels: number;
		private _sampleRate: number;
		private _source: any;
		ondatarequested: (e: any) => void;

		constructor(sampleRate: number, channels: number) {
			let context = WebAudioChannel._cachedContext;
			if (!context) {
				context = new AudioContext();
				WebAudioChannel._cachedContext = context;
			}
			this._context = context;
			this._contextSampleRate = context.sampleRate || 44100;

			this._channels = channels;
			this._sampleRate = sampleRate;
			if (this._contextSampleRate !== sampleRate) {
				this._resampler = new AudioResampler(sampleRate, this._contextSampleRate);
				this._resampler.ondatarequested = function (e: AudioResamplerData) {
					this.requestData(e.data, e.count);
				}.bind(this);
			}
		}

		setVolume(value: number) {
			// TODO set volume on this._source via gain node
		}

		start() {
			let source = this._context.createScriptProcessor(2048, 0, this._channels);
			let self = this;
			source.onaudioprocess = function (e: any) {
				let channelsData = [];
				for (let i = 0; i < self._channels; i++) {
					channelsData.push(e.outputBuffer.getChannelData(i));
				}
				let count = channelsData[0].length;
				if (self._resampler) {
					self._resampler.getData(channelsData, count);
				} else {
					self.requestData(channelsData, count);
				}
			};

			source.connect(this._context.destination);
			this._source = source;
		}

		stop() {
			this._source.disconnect(this._context.destination);
		}

		requestData(channelsData: any[], count: number) {
			let channels = this._channels;
			let buffer = new Float32Array(count * channels);
			let e = {data: buffer, count: buffer.length};
			this.ondatarequested(e);

			for (let j = 0, p = 0; j < count; j++) {
				for (let i = 0; i < channels; i++) {
					channelsData[i][j] = buffer[p++];
				}
			}
		}

		static isSupported() {
			return typeof AudioContext !== 'undefined';
		}
	}

	export class SoundChannel extends flash.events.EventDispatcher implements ISoundSource {

		static classInitializer: any = null;

		_symbol: SoundChannel;

		constructor() {
			super();

			this._element = null;
			this._position = 0;
			this._leftPeak = 0;
			this._rightPeak = 0;
			this._pcmData = null;
			this._soundTransform = this._sec.media.SoundTransform.create();
			this._playing = false;
			this._element = null;
		}

		static initializeFromAudioElement(sec: system.ISecurityDomain, element: HTMLAudioElement): SoundChannel {
			let channel = sec.media.SoundChannel.create();
			channel._element = element;
			SoundMixer._registerSoundSource(channel);
			return channel;
		}

		_element: any;
		_sound: flash.media.Sound;
		private _audioChannel: any;
		private _pcmData: any;
		private _playing: boolean;

		// JS -> AS Bindings


		// AS -> JS Bindings

		private _position: number;
		_soundTransform: flash.media.SoundTransform;
		private _leftPeak: number;
		private _rightPeak: number;

		get position(): number {
			return this._position;
		}

		get soundTransform(): flash.media.SoundTransform {
			return this._soundTransform;
		}

		set soundTransform(sndTransform: flash.media.SoundTransform) {
			release || somewhatImplemented("public flash.media.SoundChannel::set soundTransform");
			this._soundTransform = isNullOrUndefined(sndTransform) ?
				this._sec.media.SoundTransform.create() :
				sndTransform;
			SoundMixer._updateSoundSource(this);
		}

		get leftPeak(): number {
			return this._leftPeak;
		}

		get rightPeak(): number {
			return this._rightPeak;
		}

		get playing(): boolean {
			return this._playing;
		}

		stop(): void {
			if (this._element) {
				SoundMixer._unregisterSoundSource(this);

				this._element.loop = false;
				this._element.pause();
				this._element.removeAttribute('src');
				this._playing = false;
			}
			if (this._audioChannel) {
				SoundMixer._unregisterSoundSource(this);

				this._audioChannel.stop();
				this._playing = false;
			}
		}

		_playSoundDataViaAudio(soundData: any, startTime: number, loops: number) {
			if (!soundData.mimeType) {
				return;
			}

			SoundMixer._registerSoundSource(this);

			this._position = startTime;
			let self = this;
			let lastCurrentTime = 0;
			let element = document.createElement('audio');
			if (!element.canPlayType(soundData.mimeType)) {
				console.error('ERROR: \"' + soundData.mimeType + '\" ' +
					'type playback is not supported by the browser');
				return;
			}
			element.preload = 'metadata'; // for mobile devices
			element.loop = loops > 0; // starts loop played if at least one is specified
			let blob = new Blob([soundData.data], {type: soundData.mimeType});
			element.src = URL.createObjectURL(blob);
			element.addEventListener("loadeddata", function loaded() {
				element.currentTime = startTime / 1000;
				element.play();
			});
			element.addEventListener("timeupdate", function timeupdate() {
				let currentTime = element.currentTime;
				if (loops && lastCurrentTime > currentTime) {
					--loops;
					if (!loops) { // checks if we need to stop looping
						element.loop = false;
					}
					if (currentTime < startTime / 1000) {
						element.currentTime = startTime / 1000;
					}
				}
				self._position = (lastCurrentTime = currentTime) * 1000;
			});
			element.addEventListener("ended", function ended() {
				SoundMixer._unregisterSoundSource(self);

				self._element = null;
				self._playing = false;
				self.dispatchEvent(self._sec.events.Event.create(["soundComplete", false,
					false]));
			});
			this._element = element;
			this._playing = true;

			SoundMixer._updateSoundSource(this);
		}

		_playSoundDataViaChannel(soundData: any, startTime: number, loops: number) {
			release || assert(soundData.pcm, 'no pcm data found');

			SoundMixer._registerSoundSource(this);

			let self = this;
			let startPosition = Math.round(startTime / 1000 * soundData.sampleRate) *
				soundData.channels;
			let position = startPosition;
			this._position = startTime;
			this._audioChannel = createAudioChannel(soundData.sampleRate, soundData.channels);
			this._audioChannel.ondatarequested = function (e: any) {
				let end = soundData.end;
				if (position >= end && soundData.completed) {
					// end of buffer
					SoundMixer._unregisterSoundSource(this);

					self._audioChannel.stop();
					self._playing = false;
					self.dispatchEvent(self._sec.events.Event.create(["soundComplete", false,
						false]));
					return;
				}

				let left = e.count;
				let data = e.data;
				let source = soundData.pcm;
				do {
					let count = Math.min(end - position, left);
					for (let j = 0; j < count; j++) {
						data[j] = source[position++];
					}
					left -= count;
					if (position >= end) {
						if (!loops) {
							break;
						}
						loops--;
						position = startPosition;
					}
				} while (left > 0);

				self._position = position / soundData.sampleRate / soundData.channels * 1000;
			};
			this._audioChannel.start();
			this._playing = true;

			SoundMixer._updateSoundSource(this);
		}

		stopSound() {
			this.stop();
		}

		updateSoundLevels(volume: number) {
			if (this._element) {
				this._element.volume = volume <= 0 ? 0 : volume >= 1.0 ? 1.0 : volume;
			}
			if (this._audioChannel) {
				this._audioChannel.setVolume(volume);
			}
		}
	}
}

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
module Shumway.Tools.Profiler {

	export interface TimelineItemKind {
		id: number;
		name: string;
		bgColor: string;
		textColor: string;
		visible: boolean;
	}

	/**
	 * Records enter / leave events in two circular buffers.
	 * The goal here is to be able to handle large amounts of data.
	 */
	export class TimelineBuffer {

		static ENTER = 0 << 31;
		static LEAVE = 1 << 31;

		static MAX_KINDID = 0xffff;
		static MAX_DATAID = 0x7fff;

		private _depth: number;
		private _data: any [];
		private _kinds: TimelineItemKind [];
		private _kindNameMap: Shumway.MapObject<TimelineItemKind>;
		private _marks: Shumway.CircularBuffer;
		private _times: Shumway.CircularBuffer;
		private _stack: number [];
		private _startTime: number;

		public name: string;

		constructor(name: string = "", startTime?: number) {
			this.name = name || "";
			this._startTime = isNullOrUndefined(startTime) ? jsGlobal.START_TIME : startTime;
		}

		getKind(kind: number): TimelineItemKind {
			return this._kinds[kind];
		}

		get kinds(): TimelineItemKind [] {
			return this._kinds.concat();
		}

		get depth(): number {
			return this._depth;
		}

		private _initialize() {
			this._depth = 0;
			this._stack = [];
			this._data = [];
			this._kinds = [];
			this._kindNameMap = Object.create(null);
			this._marks = new Shumway.CircularBuffer(Int32Array, 20);
			this._times = new Shumway.CircularBuffer(Float64Array, 20);
		}

		private _getKindId(name: string): number {
			let kindId = TimelineBuffer.MAX_KINDID;
			if (this._kindNameMap[name] === undefined) {
				kindId = this._kinds.length;
				if (kindId < TimelineBuffer.MAX_KINDID) {
					let kind: TimelineItemKind = <TimelineItemKind>{
						id: kindId,
						name: name,
						visible: true
					};
					this._kinds.push(kind);
					this._kindNameMap[name] = kind;
				} else {
					kindId = TimelineBuffer.MAX_KINDID;
				}
			} else {
				kindId = this._kindNameMap[name].id;
			}
			return kindId;
		}

		private _getMark(type: number, kindId: number, data?: any): number {
			let dataId = TimelineBuffer.MAX_DATAID;
			if (!isNullOrUndefined(data) && kindId !== TimelineBuffer.MAX_KINDID) {
				dataId = this._data.length;
				if (dataId < TimelineBuffer.MAX_DATAID) {
					this._data.push(data);
				} else {
					dataId = TimelineBuffer.MAX_DATAID;
				}
			}
			return type | (dataId << 16) | kindId;
		}

		enter(name: string, data?: any, time?: number) {
			time = (isNullOrUndefined(time) ? performance.now() : time) - this._startTime;
			if (!this._marks) {
				this._initialize();
			}
			this._depth++;
			let kindId = this._getKindId(name);
			this._marks.write(this._getMark(TimelineBuffer.ENTER, kindId, data));
			this._times.write(time);
			this._stack.push(kindId);
		}

		leave(name?: string, data?: any, time?: number) {
			time = (isNullOrUndefined(time) ? performance.now() : time) - this._startTime;
			let kindId = this._stack.pop();
			if (name) {
				kindId = this._getKindId(name);
			}
			this._marks.write(this._getMark(TimelineBuffer.LEAVE, kindId, data));
			this._times.write(time);
			this._depth--;
		}

		count(name: string, value: number, data?: any) {
			// Not Implemented
		}

		/**
		 * Constructs an easier to work with TimelineFrame data structure.
		 */
		createSnapshot(count: number = Number.MAX_VALUE): TimelineBufferSnapshot {
			if (!this._marks) {
				return null;
			}
			let times = this._times;
			let kinds = this._kinds;
			let datastore = this._data;
			let snapshot = new TimelineBufferSnapshot(this.name);
			let stack: TimelineFrame [] = [snapshot];
			let topLevelFrameCount = 0;

			if (!this._marks) {
				this._initialize();
			}

			this._marks.forEachInReverse(function (mark: number, i: number) {
				let dataId = (mark >>> 16) & TimelineBuffer.MAX_DATAID;
				let data = datastore[dataId];
				let kindId = mark & TimelineBuffer.MAX_KINDID;
				let kind = kinds[kindId];
				if (isNullOrUndefined(kind) || kind.visible) {
					let action = mark & 0x80000000;
					let time = times.get(i);
					let stackLength = stack.length;
					if (action === TimelineBuffer.LEAVE) {
						if (stackLength === 1) {
							topLevelFrameCount++;
							if (topLevelFrameCount > count) {
								return true;
							}
						}
						stack.push(new TimelineFrame(stack[stackLength - 1], kind, null, data, NaN, time));
					} else if (action === TimelineBuffer.ENTER) {
						let node = stack.pop();
						let top = stack[stack.length - 1];
						if (top) {
							if (!top.children) {
								top.children = [node];
							} else {
								top.children.unshift(node);
							}
							let currentDepth = stack.length;
							node.depth = currentDepth;
							node.startData = data;
							node.startTime = time;
							while (node) {
								if (node.maxDepth < currentDepth) {
									node.maxDepth = currentDepth;
									node = node.parent;
								} else {
									break;
								}
							}
						} else {
							return true;
						}
					}
				}
				return false;
			});
			if (snapshot.children && snapshot.children.length) {
				snapshot.startTime = snapshot.children[0].startTime;
				snapshot.endTime = snapshot.children[snapshot.children.length - 1].endTime;
			}
			return snapshot;
		}

		reset(startTime?: number) {
			this._startTime = isNullOrUndefined(startTime) ? performance.now() : startTime;
			if (!this._marks) {
				this._initialize();
				return;
			}
			this._depth = 0;
			this._data = [];
			this._marks.reset();
			this._times.reset();
		}

		static FromFirefoxProfile(profile: any, name?: string) {
			let samples = profile.profile.threads[0].samples;
			let buffer = new TimelineBuffer(name, samples[0].time);
			let currentStack : any = [];
			let sample;
			let time;
			for (let i = 0; i < samples.length; i++) {
				sample = samples[i];
				time = sample.time;
				let stack = sample.frames;
				let j = 0;
				let minStackLen = Math.min(stack.length, currentStack.length);
				while (j < minStackLen && stack[j].location === currentStack[j].location) {
					j++;
				}
				let leaveCount = currentStack.length - j;
				for (let k = 0; k < leaveCount; k++) {
					sample = currentStack.pop();
					buffer.leave(sample.location, null, time);
				}
				while (j < stack.length) {
					sample = stack[j++];
					buffer.enter(sample.location, null, time);
				}
				currentStack = stack;
			}
			while (sample = currentStack.pop()) {
				buffer.leave(sample.location, null, time);
			}
			return buffer;
		}

		static FromChromeProfile(profile: any, name?: string) {
			let timestamps = profile.timestamps;
			let samples = profile.samples;
			let buffer = new TimelineBuffer(name, timestamps[0] / 1000);
			let currentStack: any = [];
			let idMap: MapObject<any> = {};
			let sample;
			let time;
			TimelineBuffer._resolveIds(profile.head, idMap);
			for (let i = 0; i < timestamps.length; i++) {
				time = timestamps[i] / 1000;
				let stack: any = [];
				sample = idMap[samples[i]];
				while (sample) {
					stack.unshift(sample);
					sample = sample.parent;
				}
				let j = 0;
				let minStackLen = Math.min(stack.length, currentStack.length);
				while (j < minStackLen && stack[j] === currentStack[j]) {
					j++;
				}
				let leaveCount = currentStack.length - j;
				for (let k = 0; k < leaveCount; k++) {
					sample = currentStack.pop();
					buffer.leave(sample.functionName, null, time);
				}
				while (j < stack.length) {
					sample = stack[j++];
					buffer.enter(sample.functionName, null, time);
				}
				currentStack = stack;
			}
			while (sample = currentStack.pop()) {
				buffer.leave(sample.functionName, null, time);
			}
			return buffer;
		}

		private static _resolveIds(parent: any, idMap: any) {
			idMap[parent.id] = parent;
			if (parent.children) {
				for (let i = 0; i < parent.children.length; i++) {
					parent.children[i].parent = parent;
					TimelineBuffer._resolveIds(parent.children[i], idMap);
				}
			}
		}
	}

}

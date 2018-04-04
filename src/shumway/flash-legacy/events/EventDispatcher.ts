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
// Class: EventDispatcher
module Shumway.flash.events {
	import isNullOrUndefined = Shumway.isNullOrUndefined;
	import assert = Shumway.Debug.assert;

	class EventListenerEntry {
		constructor(public listener: EventHandler, public useCapture: boolean, public priority: number) {
		}
	}

	/**
	 * Implements Copy-On-Write for event listener lists. Event handlers can add and/or remove
	 * event handlers while the events are processed. The easiest way to implement this is to
	 * clone the event listener list before executing the event listeners. This however can be
	 * wasteful, since most of the time, event handlers don't mutate the event list. Here we
	 * implement a simple copy-on-write strategy that clones the entry list if it's been
	 * snapshotted and it's about to be mutated.
	 */

	class EventListenerList {
		private _entries: EventListenerEntry [];

		/**
		 * The number of times the current entry list has been aliased (or snapshotted).
		 */
		private _aliasCount = 0;

		constructor() {
			this._entries = [];
		}

		isEmpty(): boolean {
			return this._entries.length === 0;
		}

		insert(listener: EventHandler, useCapture: boolean, priority: number) {
			let entries = this._entries;
			let index = entries.length;
			for (let i = index - 1; i >= 0; i--) {
				let entry = entries[i];
				if (entry.listener === listener) {
					return;
				}
				if (priority > entry.priority) {
					index = i;
				} else {
					break;
				}
			}
			entries = this.ensureNonAliasedEntries();
			entries.splice(index, 0, new EventListenerEntry(listener, useCapture, priority));
		}

		/**
		 * Make sure we get a fresh list if it's been aliased.
		 */
		private ensureNonAliasedEntries(): EventListenerEntry [] {
			let entries = this._entries;
			if (this._aliasCount > 0) {
				entries = this._entries = entries.slice();
				this._aliasCount = 0;
			}
			return entries;
		}

		remove(listener: EventHandler) {
			let entries = this._entries;
			for (let i = 0; i < entries.length; i++) {
				let item = entries[i];
				if (item.listener === listener) {
					this.ensureNonAliasedEntries().splice(i, 1);
					return;
				}
			}
		}

		/**
		 * Get a snapshot of the current entry list.
		 */
		snapshot(): EventListenerEntry [] {
			this._aliasCount++;
			return this._entries;
		}

		/**
		 * Release the snapshot, hopefully no other mutations occured so we can reuse the entry list.
		 */
		releaseSnapshot(snapshot: EventListenerEntry []) {
			// We ignore any non current snapshots.
			if (this._entries !== snapshot) {
				return;
			}
			if (this._aliasCount > 0) {
				this._aliasCount--;
			}
		}
	}

	/**
	 * Broadcast Events
	 *
	 * The logic here is pretty much copied from:
	 * http://www.senocular.com/flash/tutorials/orderofoperations/
	 */
	export class BroadcastEventDispatchQueue {
		/**
		 * The queues start off compact but can have null values if event targets are removed.
		 * Periodically we compact them if too many null values exist.
		 */
		private _queues: MapObject<EventDispatcher []>;

		constructor() {
			this.reset();
		}

		reset() {
			this._queues = Object.create(null);
		}

		add(type: string, target: EventDispatcher) {
			release || assert(Event.isBroadcastEventType(type), "Can only register broadcast events.");
			let queue = this._queues[type] || (this._queues[type] = []);
			if (queue.indexOf(target) >= 0) {
				return;
			}
			queue.push(target);
		}

		remove(type: string, target: EventDispatcher) {
			release || assert(Event.isBroadcastEventType(type), "Can only unregister broadcast events.");
			let queue = this._queues[type];
			release || assert(queue, "There should already be a queue for this.");
			let index = queue.indexOf(target);
			release || assert(index >= 0, "Target should be somewhere in this queue.");
			queue[index] = null;
			release || assert(queue.indexOf(target) < 0, "Target shouldn't be in this queue anymore.");
		}

		dispatchEvent(event: flash.events.Event) {
			release || assert(event.isBroadcastEvent(), "Cannot dispatch non-broadcast events.");
			let queue = this._queues[event._type];
			if (!queue) {
				return;
			}
			if (!release && traceEventsOption.value) {
				console.log('Broadcast event of type ' + event._type + ' to ' + queue.length +
					' listeners');
			}
			let nullCount = 0;
			for (let i = 0; i < queue.length; i++) {
				let target = queue[i];
				if (target === null) {
					nullCount++;
				} else {
					target.dispatchEvent(event);
				}
			}
			// Compact the queue if there are too many holes in it.
			if (nullCount > 16 && nullCount > (queue.length >> 1)) {
				let compactedQueue = [];
				for (let i = 0; i < queue.length; i++) {
					if (queue[i]) {
						compactedQueue.push(queue[i]);
					}
				}
				this._queues[event.type] = compactedQueue;
			}
		}

		getQueueLength(type: string) {
			return this._queues[type] ? this._queues[type].length : 0;
		}
	}

	/**
	 * The EventDispatcher class is the base class for all classes that dispatch events.
	 * The EventDispatcher class implements the IEventDispatcher interface and is the base class for
	 * the DisplayObject class. The EventDispatcher class allows any object on the display list to be
	 * an event target and as such, to use the methods of the IEventDispatcher interface.
	 */
	export class EventDispatcher extends LegacyEntity implements IEventDispatcher {

		private _target: flash.events.IEventDispatcher;

		/*
		 * Keep two lists of listeners, one for capture events and one for all others.
		 */
		private _captureListeners: MapObject<EventListenerList>;
		private _targetOrBubblingListeners: MapObject<EventListenerList>;

		protected _fieldsInitialized: boolean;

		preInit() {

		}

		constructor(target: flash.events.IEventDispatcher = null) {
			super();
			this.preInit();
			if (!this._fieldsInitialized) {
				this._initializeFields(target || this);
			}
		}

		protected _initializeFields(target: flash.events.IEventDispatcher) {
			release || assert(!this._fieldsInitialized);
			this._fieldsInitialized = true;
			this._target = target;
			this._captureListeners = null;
			this._targetOrBubblingListeners = null;
		}

		toString(): string {
			// EventDispatcher's toString doesn't actually do anything. It just introduces a trait that
			// forwards to Object.prototype's toString method.

			// @ivanpopelyshev: fix it
			// return this.sec.AXObject.dPrototype.$BgtoString.axCall(this);
			return "EventDispatcher";
		}

		/**
		 * Don't lazily construct listener lists if all we're doing is looking for listener types that
		 * don't exist yet.
		 */
		private _getListenersForType(useCapture: boolean, type: string) {
			let listeners = useCapture ? this._captureListeners : this._targetOrBubblingListeners;
			if (listeners) {
				return listeners[type];
			}
			return null;
		}

		/**
		 * Lazily construct listeners lists to avoid object allocation.
		 */
		private _getListeners(useCapture: boolean): MapObject<EventListenerList> {
			if (useCapture) {
				return this._captureListeners || (this._captureListeners = Object.create(null));
			}
			return this._targetOrBubblingListeners || (this._targetOrBubblingListeners = Object.create(null));
		}

		addEventListener(type: string, listener: EventHandler, useCapture: boolean = false,
		                 priority: number /*int*/ = 0, useWeakReference: boolean = false): void {
			// The error message always says "2", even though up to five arguments are valid.
			if (arguments.length < 2 || arguments.length > 5) {
				this._sec.throwError("ArgumentError", Errors.WrongArgumentCountError,
					"flash.events::EventDispatcher/addEventListener()", 2,
					arguments.length);
			}
			if (isNullOrUndefined(type)) {
				this._sec.throwError("TypeError", Errors.NullPointerError, "type");
			}
			useCapture = !!useCapture;
			priority |= 0;
			useWeakReference = !!useWeakReference;
			let listeners = this._getListeners(useCapture);
			let list = listeners[type] || (listeners[type] = new EventListenerList());
			list.insert(listener, useCapture, priority);

			// Notify the broadcast event queue. If |useCapture| is set then the Flash player
			// doesn't seem to register this target.
			if (!useCapture && Event.isBroadcastEventType(type)) {
				this._sec.events.broadcastEventDispatchQueue.add(type, this);
			}
		}

		removeEventListener(type: string, listener: EventHandler, useCapture: boolean = false): void {
			// The error message always says "2", even though 3 arguments are valid.
			if (arguments.length < 2 || arguments.length > 3) {
				this._sec.throwError("ArgumentError", Errors.WrongArgumentCountError,
					"flash.events::EventDispatcher/removeEventListener()", 2,
					arguments.length);
			}
			if (isNullOrUndefined(type)) {
				this._sec.throwError("TypeError", Errors.NullPointerError, "type");
			}
			let listeners = this._getListeners(!!useCapture);
			let list = listeners[type];
			if (list) {
				list.remove(listener);
				if (list.isEmpty()) {
					// Notify the broadcast event queue of the removal.
					if (!useCapture && Event.isBroadcastEventType(type)) {
						this._sec.events.broadcastEventDispatchQueue.remove(type, this);
					}
					listeners[type] = null;
				}
			}
		}

		private _hasTargetOrBubblingEventListener(type: string): boolean {
			return !!(this._targetOrBubblingListeners && this._targetOrBubblingListeners[type]);
		}

		private _hasCaptureEventListener(type: string): boolean {
			return !!(this._captureListeners && this._captureListeners[type]);
		}

		/**
		 * Faster internal version of |hasEventListener| that doesn't do any argument checking.
		 */
		private _hasEventListener(type: string): boolean {
			return this._hasTargetOrBubblingEventListener(type) || this._hasCaptureEventListener(type);
		}

		hasEventListener(type: string): boolean {
			if (arguments.length !== 1) {
				this._sec.throwError("ArgumentError", Errors.WrongArgumentCountError,
					"flash.events::EventDispatcher/hasEventListener()", 1,
					arguments.length);
			}
			if (isNullOrUndefined(type)) {
				this._sec.throwError("TypeError", Errors.NullPointerError, "type");
			}
			return this._hasEventListener(type);
		}

		willTrigger(type: string): boolean {
			if (arguments.length !== 1) {
				this._sec.throwError("ArgumentError", Errors.WrongArgumentCountError,
					"flash.events::EventDispatcher/hasEventListener()", 1,
					arguments.length);
			}
			if (isNullOrUndefined(type)) {
				this._sec.throwError("TypeError", Errors.NullPointerError, "type");
			}
			if (this._hasEventListener(type)) {
				return true;
			}
			if (this._sec.display.DisplayObject.axIsType(this)) {
				let node: flash.display.DisplayObject = (this as any)._parent;
				do {
					if (node._hasEventListener(type)) {
						return true;
					}
				} while ((node = node._parent));
			}
			return false;
		}

		/**
		 * Check to see if we can skip event dispatching in case there are no event listeners
		 * for this |event|.
		 */
		private _skipDispatchEvent(event: Event): boolean {
			if (this._hasEventListener(event.type)) {
				return false;
			}
			// Broadcast events don't have capturing or bubbling phases so it's a simple check.
			if (event.isBroadcastEvent()) {
				return true;
			} else if (event._bubbles && this._sec.display.DisplayObject.axIsType(this)) {
				// Check to see if there are any event listeners on the path to the root.
				for (let node = (this as any)._parent; node; node = node._parent) {
					if (node._hasEventListener(event.type)) {
						return false;
					}
				}
			}
			return true;
		}

		public dispatchEvent(event: Event): boolean {
			if (arguments.length !== 1) {
				this._sec.throwError("ArgumentError", Errors.WrongArgumentCountError,
					"flash.events::EventDispatcher/dispatchEvent()", 1,
					arguments.length);
			}
			if (this._skipDispatchEvent(event)) {
				return true;
			}

			if (!release && traceEventsOption.value) {
				console.log('Dispatch event of type ' + event._type);
			}

			release || counter.count("EventDispatcher::dispatchEvent");

			let type = event._type;
			let target = this._target;

			release || counter.count("EventDispatcher::dispatchEvent(" + type + ")");

			/**
			 * 1. Capturing Phase
			 */
			let keepPropagating = true;
			let ancestors: flash.display.DisplayObject [] = [];

			if (!event.isBroadcastEvent() && this._sec.display.DisplayObject.axIsType(this)) {
				let node: flash.display.DisplayObject = (this as any)._parent;

				// Gather all parent display objects that have event listeners for this event type.
				while (node) {
					if (node._hasEventListener(type)) {
						ancestors.push(node);
					}
					node = node._parent;
				}

				for (let i = ancestors.length - 1; i >= 0 && keepPropagating; i--) {
					let ancestor = ancestors[i];
					if (!ancestor._hasCaptureEventListener(type)) {
						continue;
					}
					let list = ancestor._getListenersForType(true, type);
					release || assert(list);
					keepPropagating = EventDispatcher.callListeners(list, event, target, ancestor,
						EventPhase.CAPTURING_PHASE);
				}
			}

			/**
			 * 2. At Target
			 */
			if (keepPropagating) {
				let list = this._getListenersForType(false, type);
				if (list) {
					keepPropagating = EventDispatcher.callListeners(list, event, target, target,
						EventPhase.AT_TARGET);
				}
			}

			/**
			 * 3. Bubbling Phase
			 */
			if (!event.isBroadcastEvent() && keepPropagating && event.bubbles) {
				for (let i = 0; i < ancestors.length && keepPropagating; i++) {
					let ancestor = ancestors[i];
					if (!ancestor._hasTargetOrBubblingEventListener(type)) {
						continue;
					}
					let list = ancestor._getListenersForType(false, type);
					keepPropagating = EventDispatcher.callListeners(list, event, target, ancestor,
						EventPhase.BUBBLING_PHASE);
				}
			}

			return !event._isDefaultPrevented;
		}

		private static callListeners(list: EventListenerList, event: Event, target: IEventDispatcher,
		                             currentTarget: IEventDispatcher, eventPhase: number): boolean {
			if (list.isEmpty()) {
				return true;
			}
			/**
			 * If the target is already set then we must clone the event. We can reuse the event object
			 * for all listener callbacks but not when bubbling.
			 */
			if (event._target) {
				event = event.clone();
			}
			let snapshot = list.snapshot();
			try {
				for (let i = 0; i < snapshot.length; i++) {
					let entry = snapshot[i];
					event._target = target;
					event._currentTarget = currentTarget;
					event._eventPhase = eventPhase;
					typeof entry.listener === 'function' ?
						entry.listener(event) :
						(entry.listener as any).call(entry.listener, event);
					if (event._stopImmediatePropagation) {
						break;
					}
				}
			} catch (e) {
				Debug.warning('Uncaught error in handler for event ' + event._type + ': ', e);
			}
			list.releaseSnapshot(snapshot);
			return !event._stopPropagation;
		}
	}
}

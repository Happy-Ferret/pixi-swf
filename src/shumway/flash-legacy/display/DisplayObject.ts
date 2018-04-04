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

/**
 * Flash bugs to keep in mind:
 *
 * http://aaronhardy.com/flex/displayobject-quirks-and-tips/
 * http://blog.anselmbradford.com/2009/02/12/flash-movie-clip-transformational-properties-explorer-x-y-width-height-more/
 * http://gskinner.com/blog/archives/2007/08/annoying_as3_bu.html
 * http://blog.dennisrobinson.name/getbounds-getrect-unexpected-results/
 *
 */
// Class: DisplayObject
module Shumway.flash.display {
	import notImplemented = Shumway.Debug.notImplemented;
	import somewhatImplemented = Shumway.Debug.somewhatImplemented;
	import abstractMethod = Shumway.Debug.abstractMethod;
	import isNullOrUndefined = Shumway.isNullOrUndefined;
	import assert = Shumway.Debug.assert;
	import unexpected = Shumway.Debug.unexpected;

	import Bounds = Shumway.Bounds;
	import geom = flash.geom;
	import events = flash.events;

	import PlaceObjectFlags = Shumway.SWF.Parser.PlaceObjectFlags;

	/*
	 * Invalid Bits:
	 *
	 * Invalid bits are used to mark path dependent properties of display objects as stale. To compute these properties we either have to
	 * walk the tree all the way the root, or visit all children.
	 *
	 *       +---+
	 *       | A |
	 *       +---+
	 *       /   \
	 *   +---+   +---+
	 *   | B |   | C |
	 *   +---+   +---+
	 *           /   \
	 *       +---+   +---+
	 *       | D |   | E |
	 *       +---+   +---+
	 *
	 * We use a combination of eager invalid bit propagation and lazy property evaluation. If a node becomes invalid because one of its
	 * local properties has changed, we mark all of its valid descendents as invalid. When computing dependent properties, we walk up
	 * the tree until we find a valid node and propagate the computation lazily downwards, marking all the nodes along the path as
	 * valid.
	 *
	 * Suppose we mark A as invalid, this causes nodes B, C, D, and E to become invalid. We then compute a path dependent property
	 * on E, causing A, and C to become valid. If we mark A as invalid again, A and C become invalid again. We don't need to mark
	 * parts of the tree that are already invalid.
	 *
	 *
	 * Dirty Bits:
	 *
	 * These are used to mark properties as having been changed.
	 */
	export const enum DisplayObjectFlags {
		None = 0x0000,

		/**
		 * Display object is visible.
		 */
		Visible = 0x0001,

		/**
		 * Display object has invalid line bounds.
		 */
		InvalidLineBounds = 0x0002,

		/**
		 * Display object has invalid fill bounds.
		 */
		InvalidFillBounds = 0x0004,

		/**
		 * Display object has an invalid matrix because one of its local properties: x, y, scaleX, ...
		 * has been mutated.
		 */
		InvalidMatrix = 0x0008,

		/**
		 * Display object has an invalid inverted matrix because its matrix has been mutated.
		 */
		InvalidInvertedMatrix = 0x0010,

		/**
		 * Display object has an invalid concatenated matrix because its matrix or one of its
		 * ancestor's matrices has been mutated.
		 */
		InvalidConcatenatedMatrix = 0x0020,

		/**
		 * Display object has an invalid inverted concatenated matrix because its matrix or one of its
		 * ancestor's matrices has been mutated. We don't always need to compute the inverted matrix.
		 * This is why we use a sepearete invalid flag for it and don't roll it under the
		 * |InvalidConcatenatedMatrix| flag.
		 */
		InvalidInvertedConcatenatedMatrix = 0x0040,

		/**
		 * Display object has an invalid concatenated color transform because its color transform or
		 * one of its ancestor's color transforms has been mutated.
		 */
		InvalidConcatenatedColorTransform = 0x0080,

		/**
		 * The display object's constructor has been executed or any of the derived class constructors
		 * have executed. It may be that the derived class doesn't call super, in such cases this flag
		 * must be set manually elsewhere.
		 */
		Constructed = 0x0100,

		/**
		 * Display object has been removed by the timeline but it no longer recieves any event.
		 */
		Destroyed = 0x0200,

		/**
		 * Indicates wether an AVM1 load event needs to be dispatched on this display object.
		 */
		NeedsLoadEvent = 0x0400,

		/**
		 * Display object is owned by the timeline, meaning that it is under the control of the
		 * timeline and that a reference to this object has not leaked into AS3 code via the
		 * DisplayObjectContainer methods |getChildAt|,  |getChildByName| or through the execution of
		 * the symbol class constructor.
		 */
		OwnedByTimeline = 0x0800,

		/**
		 * Display object is animated by the timeline. It may no longer be owned by the timeline
		 * (|OwnedByTimeline|) but it is still animated by it. If AS3 code mutates any property on the
		 * display object, this flag is cleared and further timeline mutations are ignored.
		 */
		AnimatedByTimeline = 0x1000,

		/**
		 * MovieClip object has reached a frame with a frame script or ran a frame script that attached
		 * a new one to the current frame. To run the script, it has to be appended to the queue of
		 * scripts.
		 */
		HasFrameScriptPending = 0x2000,

		/**
		 * DisplayObjectContainer contains at least one descendant with the HasFrameScriptPending flag
		 * set.
		 */
		ContainsFrameScriptPendingChildren = 0x4000,

		/**
		 * Indicates whether this display object is a MorphShape or contains at least one descendant
		 * that is.
		 */
		ContainsMorph = 0x8000,

		/**
		 * Indicates whether this display object should be cached as a bitmap. The display object may
		 * be cached as bitmap even if this flag is not set, depending on whether any filters are
		 * applied or if the bitmap is too large or we've run out of memory.
		 */
		CacheAsBitmap = 0x010000,

		/**
		 * Indicates whether an AVM1 timeline needs to initialize an object after place object
		 * occurred.
		 */
		HasPlaceObjectInitPending = 0x020000,

		/**
		 * Indicates whether a transform.perspectiveProjection was set.
		 */
		HasPerspectiveProjection = 0x040000,

		/**
		 * Indicates whether this display object has dirty descendents. If this flag is set then the
		 * subtree need to be synchronized.
		 */
		DirtyDescendents = 0x20000000,

		/**
		 * Used for serialization of layers
		 */
		DirtyParents = 0x40000000,

		/**
		 * Masks flags that need to be propagated up when this display object gets added to a parent.
		 */
		Bubbling = ContainsFrameScriptPendingChildren | ContainsMorph | DirtyDescendents
	}

	export const enum DisplayObjectDirtyFlags {
		/**
		 * Indicates whether this display object's matrix has changed since the last time it was
		 * synchronized.
		 */
		DirtyMatrix = 0x001,

		/**
		 * Indicates whether this display object's children list is dirty.
		 */
		DirtyChildren = 0x002,

		/**
		 * Indicates whether this display object's graphics has changed since the last time it was
		 * synchronized.
		 */
		DirtyGraphics = 0x004,

		/**
		 * Indicates whether this display object's text content has changed since the last time it was
		 * synchronized.
		 */
		DirtyTextContent = 0x008,

		/**
		 * Indicates whether this display object's bitmap data has changed since the last time it was
		 * synchronized.
		 */
		DirtyBitmapData = 0x010,

		/**
		 * Indicates whether this display object's bitmap data has changed since the last time it was
		 * synchronized.
		 */
		DirtyNetStream = 0x020,

		/**
		 * Indicates whether this display object's color transform has changed since the last time it
		 * was synchronized.
		 */
		DirtyColorTransform = 0x040,

		/**
		 * Indicates whether this display object's mask has changed since the last time it was
		 * synchronized.
		 */
		DirtyMask = 0x080,

		/**
		 * Indicates whether this display object's clip depth has changed since the last time it was
		 * synchronized.
		 */
		DirtyClipDepth = 0x100,

		/**
		 * Indicates whether this display object's other properties have changed. We need to split this
		 * up in multiple bits so we don't serialize as much:
		 *
		 * So far we only mark these properties here:
		 *
		 * blendMode,
		 * scale9Grid,
		 * cacheAsBitmap,
		 * filters,
		 * visible,
		 */
		DirtyMiscellaneousProperties = 0x200,

		/**
		 * All synchronizable properties are dirty.
		 */
		Dirty = DirtyMatrix | DirtyChildren | DirtyGraphics |
			DirtyTextContent | DirtyBitmapData | DirtyNetStream |
			DirtyColorTransform | DirtyMask | DirtyClipDepth |
			DirtyMiscellaneousProperties
	}

	/**
	 * Controls how the visitor walks the display tree.
	 */
	export const enum VisitorFlags {
		/**
		 * None
		 */
		None = 0,

		/**
		 * Continue with normal traversal.
		 */
		Continue = 0,

		/**
		 * Not used yet, should probably just stop the visitor.
		 */
		Stop = 0x01,

		/**
		 * Skip processing current node.
		 */
		Skip = 0x02,

		/**
		 * Visit front to back.
		 */
		FrontToBack = 0x08,

		/**
		 * Only visit the nodes matching a certain flag set.
		 */
		Filter = 0x10
	}

	export const enum HitTestingType {
		HitTestBounds,
		HitTestBoundsAndMask,
		HitTestShape,
		Mouse,
		ObjectsUnderPoint,
		Drop
	}

	export const enum HitTestingResult {
		None,
		Bounds,
		Shape
	}

	/*
	 * Note: Private or functions are prefixed with "_" and *may* return objects that
	 * should not be mutated. This is for performance reasons and it's up to you to make sure
	 * such return values are cloned.
	 *
	 * Private or functions usually operate on twips, public functions work with pixels
	 * since that's what the AS3 specifies.
	 */

	export interface IAdvancable extends Shumway.IReferenceCountable {
		_initFrame(advance: boolean): void;

		_constructFrame(): void;
	}

	let displayObjectSyncID = 0;

	export class DisplayObject extends flash.events.EventDispatcher implements IBitmapDrawable, Shumway.Remoting.IRemotable {

		static axClass: typeof DisplayObject;

		/**
		 * Every displayObject is assigned an unique integer ID.
		 */
		static getNextSyncID() {
			return displayObjectSyncID++;
		}

		// Called whenever the class is initialized.
		static classInitializer: any = null;

		// List of static symbols to link.
		static classSymbols: string [] = null; // [];

		// List of instance symbols to link.
		static instanceSymbols: string [] = null; // ["hitTestObject", "hitTestPoint"];

		/**
		 * Creates a new display object from a symbol and initializes its animated display properties.
		 * Calling its constructor is optional at this point, since that can happen in a later frame
		 * phase.
		 */
		createAnimatedDisplayObject(symbol: Shumway.Timeline.DisplaySymbol,
		                            placeObjectTag: Shumway.SWF.Parser.PlaceObjectTag,
		                            callConstructor: boolean): DisplayObject {
			let symbolClass = symbol.symbolClass;

			let bitmapDataClass = this._sec.display.BitmapData;
			if (bitmapDataClass.isSymbol(symbolClass) ||
				bitmapDataClass.isSymbolPrototype(symbolClass)) {
				symbolClass = this._sec.display.Bitmap;
			}
			let instance: DisplayObject = system.constructClassFromSymbol(symbol, symbolClass);
			if (placeObjectTag.flags & PlaceObjectFlags.HasName) {
				instance._name = placeObjectTag.name;
			}
			instance._setFlags(DisplayObjectFlags.AnimatedByTimeline);
			instance._animate(placeObjectTag);
			if (callConstructor) {
				instance.constructor();
			}
			return instance;
		}

		constructor() {
			super();

			if (!this._fieldsInitialized) {
				this._initializeFields();
			}

			this._addReference();
			this._setFlags(DisplayObjectFlags.Constructed);
		}

		protected _initializeFields() {
			super._initializeFields(this);
			this._id = DisplayObject.getNextSyncID();
			this._flags = DisplayObjectFlags.Visible |
				DisplayObjectFlags.InvalidLineBounds |
				DisplayObjectFlags.InvalidFillBounds |
				DisplayObjectFlags.InvalidConcatenatedMatrix |
				DisplayObjectFlags.InvalidInvertedConcatenatedMatrix |
				DisplayObjectFlags.DirtyDescendents;
			this._dirtyFlags = DisplayObjectDirtyFlags.DirtyGraphics |
				DisplayObjectDirtyFlags.DirtyMatrix |
				DisplayObjectDirtyFlags.DirtyColorTransform |
				DisplayObjectDirtyFlags.DirtyMask |
				DisplayObjectDirtyFlags.DirtyClipDepth |
				DisplayObjectDirtyFlags.DirtyMiscellaneousProperties;
			this._root = null;
			this._stage = null;
			this._setInitialName();
			this._parent = null;
			this._mask = null;

			this._z = 0;
			this._scaleX = 1;
			this._scaleY = 1;
			this._skewX = 0;
			this._skewY = 0;
			this._scaleZ = 1;
			this._rotation = 0;
			this._rotationX = 0;
			this._rotationY = 0;
			this._rotationZ = 0;

			this._width = 0;
			this._height = 0;
			this._opaqueBackground = null;
			this._scrollRect = null;
			this._filters = null;
			this._blendMode = BlendMode.NORMAL;
			// No need to take ownership: scale9Grid is never changed.
			this._scale9Grid = this._symbol ? this._symbol.scale9Grid : null;
			this._loaderInfo = null;
			this._accessibilityProperties = null;

			this._fillBounds = new Bounds(0, 0, 0, 0);
			this._lineBounds = new Bounds(0, 0, 0, 0);
			this._clipDepth = -1;

			let matrixClass = this._sec.geom.Matrix;
			this._concatenatedMatrix = matrixClass.create();
			this._invertedConcatenatedMatrix = matrixClass.create();
			this._matrix = matrixClass.create();
			this._invertedMatrix = matrixClass.create();
			this._matrix3D = null;
			this._perspectiveProjectionFOV = geom.DefaultPerspectiveProjection.FOV;
			this._perspectiveProjectionCenterX = geom.DefaultPerspectiveProjection.CenterX;
			this._perspectiveProjectionCenterY = geom.DefaultPerspectiveProjection.CenterY;
			let colorTransformClass = this._sec.geom.ColorTransform;
			this._colorTransform = colorTransformClass.create();
			this._concatenatedColorTransform = colorTransformClass.create();

			this._depth = -1;
			this._ratio = 0;
			this._index = -1;
			this._maskedObject = null;

			this._mouseOver = false;
			this._mouseDown = false;

			this._graphics = null;
			this._children = null;

			this._referenceCount = 0;
		}

		/**
		 * Sets the object's initial name to adhere to the 'instanceN' naming scheme.
		 */
		_setInitialName() {
			this._name = 'instance' +
				(this._sec.display._instanceID++);
		}

		_setParent(parent: DisplayObjectContainer, depth: number) {
			let oldParent = this._parent;
			release || assert(parent !== this as any);
			this._parent = parent;
			this._setDepth(depth);
			if (parent) {
				this._addReference();
				let bubblingFlags = DisplayObjectFlags.None;
				if (this._hasFlags(DisplayObjectFlags.HasFrameScriptPending)) {
					bubblingFlags |= DisplayObjectFlags.ContainsFrameScriptPendingChildren;
				}
				if (this._hasAnyDirtyFlags(DisplayObjectDirtyFlags.Dirty)) {
					bubblingFlags |= DisplayObjectFlags.DirtyDescendents;
				}
				if (this._hasAnyFlags(DisplayObjectFlags.Bubbling)) {
					bubblingFlags |= this._flags & DisplayObjectFlags.Bubbling;
				}
				if (bubblingFlags) {
					parent._propagateFlagsUp(bubblingFlags);
				}
			}
			if (oldParent) {
				this._removeReference();
			}
		}

		_setDepth(value: number) {
			if (value > -1) {
				this._setFlags(DisplayObjectFlags.OwnedByTimeline);
			} else {
				this._removeFlags(DisplayObjectFlags.OwnedByTimeline);
			}
			this._depth = value;
		}

		_setFillAndLineBoundsFromWidthAndHeight(width: number, height: number) {
			this._fillBounds.width = width;
			this._fillBounds.height = height;
			this._lineBounds.width = width;
			this._lineBounds.height = height;
			this._removeFlags(DisplayObjectFlags.InvalidLineBounds | DisplayObjectFlags.InvalidFillBounds);
			this._invalidateParentFillAndLineBounds(true, true);
		}

		_setFillAndLineBoundsFromSymbol(symbol: Timeline.DisplaySymbol) {
			release || assert(symbol.fillBounds || symbol.lineBounds, "Fill or Line bounds are not defined in the symbol.");
			if (symbol.fillBounds) {
				this._fillBounds.copyFrom(symbol.fillBounds);
				this._removeFlags(DisplayObjectFlags.InvalidFillBounds);
			}
			if (symbol.lineBounds) {
				this._lineBounds.copyFrom(symbol.lineBounds);
				this._removeFlags(DisplayObjectFlags.InvalidLineBounds);
			}
			this._invalidateParentFillAndLineBounds(!!symbol.fillBounds, !!symbol.lineBounds);
		}

		_setFlags(flags: DisplayObjectFlags) {
			this._flags |= flags;
		}

		/**
		 * Use this to set dirty flags so that we can also propagate the dirty child bit.
		 */
		_setDirtyFlags(flags: DisplayObjectDirtyFlags) {
			this._dirtyFlags |= flags;
			if (this._parent) {
				// Notify parent that it has a dirty descendent.
				this._parent._propagateFlagsUp(DisplayObjectFlags.DirtyDescendents);
			}
		}

		_removeDirtyFlags(flags: DisplayObjectDirtyFlags) {
			this._dirtyFlags &= ~flags;
		}

		_hasDirtyFlags(flags: DisplayObjectDirtyFlags): boolean {
			return (this._dirtyFlags & flags) === flags;
		}

		_hasAnyDirtyFlags(flags: DisplayObjectDirtyFlags): boolean {
			return !!(this._dirtyFlags & flags);
		}

		_toggleFlags(flags: DisplayObjectFlags, on: boolean) {
			if (on) {
				this._flags |= flags;
			} else {
				this._flags &= ~flags;
			}
		}

		_removeFlags(flags: DisplayObjectFlags) {
			this._flags &= ~flags;
		}

		_hasFlags(flags: DisplayObjectFlags): boolean {
			return (this._flags & flags) === flags;
		}

		_hasAnyFlags(flags: DisplayObjectFlags): boolean {
			return !!(this._flags & flags);
		}

		/**
		 * Propagates flags up the display list. Propagation stops if all flags are already set.
		 */
		_propagateFlagsUp(flags: DisplayObjectFlags) {
			if (this._hasFlags(flags)) {
				return;
			}
			this._setFlags(flags);
			let parent = this._parent;
			if (parent) {
				parent._propagateFlagsUp(flags);
			}
		}

		/**
		 * Propagates flags down the display list. Non-containers just set the flags on themselves.
		 *
		 * Overridden in DisplayObjectContainer.
		 */
		_propagateFlagsDown(flags: DisplayObjectFlags) {
			this._setFlags(flags);
		}

		// AS -> JS Bindings

		_id: number;
		private _flags: DisplayObjectFlags;
		private _dirtyFlags: DisplayObjectDirtyFlags;

		_root: flash.display.DisplayObject;
		_stage: flash.display.Stage;
		_name: string;
		_parent: flash.display.DisplayObjectContainer;
		_mask: flash.display.DisplayObject;

		/**
		 * These are always the most up to date properties. The |_matrix| is kept in sync with
		 * these values. This is only true when |_matrix3D| is null.
		 */
		_scaleX: number;
		_scaleY: number;

		_skewX: number;
		_skewY: number;

		_z: number;
		_scaleZ: number;
		_rotation: number;

		_rotationX: number;
		_rotationY: number;
		_rotationZ: number;

		_mouseX: number;
		_mouseY: number;

		_width: number;
		_height: number;
		_opaqueBackground: any;
		_scrollRect: flash.geom.Rectangle;
		_filters: any [];
		_blendMode: string;
		_scale9Grid: Bounds;
		_loaderInfo: flash.display.LoaderInfo;
		_accessibilityProperties: flash.accessibility.AccessibilityProperties;

		/**
		 * Bounding box excluding strokes.
		 */
		_fillBounds: Bounds;

		/**
		 * Bounding box including strokes.
		 */
		_lineBounds: Bounds;

		/*
		 * If larger than |-1| then this object acts like a mask for all objects between
		 * |_depth + 1| and |_clipDepth| inclusive. The swf experts say that Adobe tools only
		 * generate neatly nested clip segments.
		 *
		 * A: -------------[-------------------)---------------
		 * B: -----------------[-------------)-----------------
		 *    ----X----------Y--------Z-------------W----------
		 *
		 * X is not clipped, Y is only clipped by A, Z by both A and B and finally W is not
		 * clipped at all.
		 */
		_clipDepth: number;

		/**
		 * The a, b, c, d components of the matrix are only valid if the InvalidMatrix flag
		 * is not set. Don't access this directly unless you can be sure that its components
		 * are valid.
		 */
		_matrix: flash.geom.Matrix;
		_invertedMatrix: flash.geom.Matrix;


		_concatenatedMatrix: flash.geom.Matrix;
		_invertedConcatenatedMatrix: flash.geom.Matrix;
		_colorTransform: flash.geom.ColorTransform;
		_concatenatedColorTransform: flash.geom.ColorTransform;
		_matrix3D: flash.geom.Matrix3D;
		_perspectiveProjectionFOV: number;
		_perspectiveProjectionCenterX: number;
		_perspectiveProjectionCenterY: number;
		_perspectiveProjection: flash.geom.PerspectiveProjection;
		_depth: number;
		_ratio: number;

		/**
		 * Index of this display object within its container's children
		 */
		_index: number;

		_isContainer: boolean;
		_maskedObject: flash.display.DisplayObject;
		_mouseOver: boolean;
		_mouseDown: boolean;

		_symbol: Shumway.Timeline.DisplaySymbol;
		_placeObjectTag: Shumway.SWF.Parser.PlaceObjectTag;
		_graphics: flash.display.Graphics;

		/**
		 * This is only ever used in classes that can have children, like |DisplayObjectContainer| or
		 * |SimpleButton|.
		 */
		_children: DisplayObject [];

		/**
		 *
		 */
		_referenceCount: number;

		/**
		 * Finds the nearest ancestor with a given set of flags that are either turned on or off.
		 */
		private _findNearestAncestor(flags: DisplayObjectFlags, on: boolean): DisplayObject {
			let node: DisplayObject = this;
			while (node) {
				if (node._hasFlags(flags) === on) {
					return node;
				}
				node = node._parent;
			}
			return null;
		}

		_findFurthestAncestorOrSelf(): DisplayObject {
			let node: DisplayObject = this;
			while (node) {
				if (!node._parent) {
					return node;
				}
				node = node._parent;
			}
			return null;
		}

		/**
		 * Tests if this display object is an ancestor of the specified display object.
		 */
		_isAncestor(child: DisplayObject): boolean {
			let node = child;
			while (node) {
				if (node === this) {
					return true;
				}
				node = node._parent;
			}
			return false;
		}

		/**
		 * Clamps the rotation value to the range (-180, 180).
		 */
		private static _clampRotation(value: number): number {
			value %= 360;
			if (value > 180) {
				value -= 360;
			} else if (value < -180) {
				value += 360;
			}
			return value;
		}

		/**
		 * Used as a temporary array to avoid allocations.
		 */
		private static _path: DisplayObject[] = [];

		/**
		 * Return's a list of ancestors excluding the |last|, the return list is reused.
		 */
		private static _getAncestors(node: DisplayObject, last: DisplayObject) {
			let path = DisplayObject._path;
			path.length = 0;
			while (node && node !== last) {
				path.push(node);
				node = node._parent;
			}
			release || assert(node === last, "Last ancestor is not an ancestor.");
			return path;
		}

		/**
		 * Computes the combined transformation matrixes of this display object and all of its parents.
		 * It is not the same as |transform.concatenatedMatrix|, the latter also includes the screen
		 * space matrix.
		 */
		_getConcatenatedMatrix(): flash.geom.Matrix {
			if (this._hasFlags(DisplayObjectFlags.InvalidConcatenatedMatrix)) {
				if (this._parent) {
					this._parent._getConcatenatedMatrix().preMultiplyInto(this._getMatrix(),
						this._concatenatedMatrix);
				} else {
					this._concatenatedMatrix.copyFrom(this._getMatrix());
				}
				this._removeFlags(DisplayObjectFlags.InvalidConcatenatedMatrix);
			}
			return this._concatenatedMatrix;
		}

		_getInvertedConcatenatedMatrix(): flash.geom.Matrix {
			if (this._hasFlags(DisplayObjectFlags.InvalidInvertedConcatenatedMatrix)) {
				this._getConcatenatedMatrix().invertInto(this._invertedConcatenatedMatrix);
				this._removeFlags(DisplayObjectFlags.InvalidInvertedConcatenatedMatrix);
			}
			return this._invertedConcatenatedMatrix;
		}

		_setMatrix(matrix: flash.geom.Matrix, toTwips: boolean): void {
			if (!toTwips && this._matrix.equals(matrix)) {
				// No need to dirty the matrix if it's equal to the current matrix.
				return;
			}
			let m = this._matrix;
			m.copyFrom(matrix);
			if (toTwips) {
				m.toTwipsInPlace();
			}
			this._scaleX = m.getScaleX();
			this._scaleY = m.getScaleY();
			this._skewX = matrix.getSkewX();
			this._skewY = matrix.getSkewY();
			this._rotation = DisplayObject._clampRotation(this._skewY * 180 / Math.PI);
			this._removeFlags(DisplayObjectFlags.InvalidMatrix);
			this._setFlags(DisplayObjectFlags.InvalidInvertedMatrix);
			this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyMatrix);
			this._invalidatePosition();
		}

		/**
		 * Returns an updated matrix if the current one is invalid.
		 */
		_getMatrix() {
			if (this._hasFlags(DisplayObjectFlags.InvalidMatrix)) {
				this._matrix.updateScaleAndRotation(this._scaleX, this._scaleY, this._skewX, this._skewY);
				this._removeFlags(DisplayObjectFlags.InvalidMatrix);
			}
			return this._matrix;
		}

		_getInvertedMatrix() {
			if (this._hasFlags(DisplayObjectFlags.InvalidInvertedMatrix)) {
				this._getMatrix().invertInto(this._invertedMatrix);
				this._removeFlags(DisplayObjectFlags.InvalidInvertedMatrix);
			}
			return this._invertedMatrix;
		}

		/**
		 * Computes the combined transformation color matrixes of this display object and all of its
		 * ancestors.
		 */
		_getConcatenatedColorTransform(): flash.geom.ColorTransform {
			if (!this.stage) {
				return this._colorTransform.clone();
			}
			// Compute the concatenated color transforms for this node and all of its ancestors.
			if (this._hasFlags(DisplayObjectFlags.InvalidConcatenatedColorTransform)) {
				let ancestor = this._findNearestAncestor(DisplayObjectFlags.InvalidConcatenatedColorTransform, false);
				let path = DisplayObject._getAncestors(this, ancestor);
				let i = path.length - 1;
				let stageClass = this._sec.display.Stage;
				if (stageClass.axIsType(path[i])) {
					i--;
				}
				let m = ancestor && !stageClass.axIsType(ancestor) ?
					ancestor._concatenatedColorTransform.clone() :
					this._sec.geom.ColorTransform.create();
				while (i >= 0) {
					ancestor = path[i--];
					release || assert(ancestor._hasFlags(DisplayObjectFlags.InvalidConcatenatedColorTransform));
					m.preMultiply(ancestor._colorTransform);
					m.convertToFixedPoint();
					ancestor._concatenatedColorTransform.copyFrom(m);
					ancestor._removeFlags(DisplayObjectFlags.InvalidConcatenatedColorTransform);
				}
			}
			return this._concatenatedColorTransform;
		}

		_setColorTransform(colorTransform: flash.geom.ColorTransform) {
			if (this._colorTransform.equals(colorTransform)) {
				return;
			}
			this._colorTransform.copyFrom(colorTransform);
			this._colorTransform.convertToFixedPoint();
			this._propagateFlagsDown(DisplayObjectFlags.InvalidConcatenatedColorTransform);
			this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyColorTransform);
		}

		/**
		 * Invalidates the fill- and lineBounds of this display object along with all of its ancestors.
		 */
		_invalidateFillAndLineBounds(fill: boolean, line: boolean): void {
			/* TODO: We should only propagate this bit if the bounds are actually changed. We can do the
			 * bounds computation eagerly if the number of children is low. If there are no changes in the
			 * bounds we don't need to propagate the bit. */
			this._propagateFlagsUp((line ? DisplayObjectFlags.InvalidLineBounds : 0) |
				(fill ? DisplayObjectFlags.InvalidFillBounds : 0));
		}

		_invalidateParentFillAndLineBounds(fill: boolean, line: boolean): void {
			if (this._parent) {
				this._parent._invalidateFillAndLineBounds(fill, line);
			}
		}

		/**
		 * Computes the bounding box for all of this display object's content, its graphics and all of
		 * its children.
		 */
		_getContentBounds(includeStrokes: boolean = true): Bounds {
			// Tobias: What about filters?
			let invalidFlag: number;
			let bounds: Bounds;
			if (includeStrokes) {
				invalidFlag = DisplayObjectFlags.InvalidLineBounds;
				bounds = this._lineBounds;
			} else {
				invalidFlag = DisplayObjectFlags.InvalidFillBounds;
				bounds = this._fillBounds;
			}
			if (this._hasFlags(invalidFlag)) {
				let graphics: Graphics = this._getGraphics();
				if (graphics) {
					bounds.copyFrom(graphics._getContentBounds(includeStrokes));
				} else {
					bounds.setToSentinels();
				}
				this._getChildBounds(bounds, includeStrokes);
				this._removeFlags(invalidFlag);
			}
			return bounds;
		}

		/**
		 * Empty base case: DisplayObject cannot have children, but several distinct subclasses can.
		 * Overridden in DisplayObjectContainer, SimpleButton, and AVM1Movie.
		 */
		_getChildBounds(bounds: Bounds, includeStrokes: boolean) {
			// TSLint thinks empty methods are uncool. I think TSLint is uncool.
		}

		/**
		 * Gets the bounds of this display object relative to another coordinate space. The
		 * transformation matrix from the local coordinate space to the target coordinate space is
		 * computed using:
		 *
		 *   this.concatenatedMatrix * inverse(target.concatenatedMatrix)
		 *
		 * If the |targetCoordinateSpace| is |null| then assume the identity coordinate space.
		 */
		_getTransformedBounds(targetCoordinateSpace: DisplayObject, includeStroke: boolean): Bounds {
			let bounds = this._getContentBounds(includeStroke).clone();
			if (targetCoordinateSpace === this || bounds.isEmpty()) {
				return bounds;
			}
			let m;
			if (targetCoordinateSpace) {
				m = this._sec.geom.TEMP_MATRIX;
				let invertedTargetMatrix = targetCoordinateSpace._getInvertedConcatenatedMatrix();
				invertedTargetMatrix.preMultiplyInto(this._getConcatenatedMatrix(), m);
			} else {
				m = this._getConcatenatedMatrix();
			}
			m.transformBounds(bounds);
			return bounds;
		}

		/**
		 * Detaches this object from being animated by the timeline. This happens whenever a display
		 * property of this object is changed by user code.
		 */
		private _stopTimelineAnimation() {
			this._removeFlags(DisplayObjectFlags.AnimatedByTimeline);
		}

		/**
		 * Marks this object as having its matrix changed.
		 *
		 * Propagates flags both up- and (via invalidatePosition) downwards, so is quite costly.
		 * TODO: check if we can usefully combine all upwards-propagated flags here.
		 */
		private _invalidateMatrix() {
			this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyMatrix);
			this._setFlags(DisplayObjectFlags.InvalidMatrix | DisplayObjectFlags.InvalidInvertedMatrix);
			this._invalidatePosition();
		}

		/**
		 * Marks this object as having been moved in its parent display object.
		 */
		_invalidatePosition() {
			this._propagateFlagsDown(DisplayObjectFlags.InvalidConcatenatedMatrix |
				DisplayObjectFlags.InvalidInvertedConcatenatedMatrix);
			this._invalidateParentFillAndLineBounds(true, true);
		}

		/**
		 * Animates this object's display properties.
		 */
		_animate(placeObjectTag: Shumway.SWF.Parser.PlaceObjectTag): void {
			release || assert(this._hasFlags(DisplayObjectFlags.AnimatedByTimeline));

			let reset = (placeObjectTag.flags & PlaceObjectFlags.Move) === 0 &&
				(placeObjectTag.flags & PlaceObjectFlags.HasCharacter) !== 0;

			let matrixClass = this._sec.geom;
			if (placeObjectTag.flags & PlaceObjectFlags.HasMatrix) {
				matrixClass.TEMP_MATRIX.copyFromUntyped(placeObjectTag.matrix);
				this._setMatrix(matrixClass.TEMP_MATRIX, false);
			} else if (reset) {
				this._setMatrix(matrixClass.FROZEN_IDENTITY_MATRIX, false);
			}

			let colorTransformClass = matrixClass;
			if (placeObjectTag.flags & PlaceObjectFlags.HasColorTransform) {
				colorTransformClass.TEMP_COLOR_TRANSFORM.copyFromUntyped(placeObjectTag.cxform);
				this._setColorTransform(colorTransformClass.TEMP_COLOR_TRANSFORM);
			} else if (reset) {
				this._setColorTransform(colorTransformClass.FROZEN_IDENTITY_COLOR_TRANSFORM);
			}

			if (placeObjectTag.flags & PlaceObjectFlags.HasRatio || reset) {
				let ratio = placeObjectTag.ratio | 0;
				if (ratio !== this._ratio) {
					release || assert(ratio >= 0 && ratio <= 0xffff);
					this._ratio = ratio;
					this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyMiscellaneousProperties);
				}
			}

			if (placeObjectTag.flags & PlaceObjectFlags.HasClipDepth || reset) {
				let clipDepth = placeObjectTag.clipDepth === undefined ? -1 : placeObjectTag.clipDepth;
				if (clipDepth !== this._clipDepth) {
					this._clipDepth = clipDepth;
					this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyClipDepth);
				}
			}

			if (placeObjectTag.flags & PlaceObjectFlags.HasFilterList) {
				let filtersPackage = this._sec.filters;
				let filters: filters.BitmapFilter[] = [];
				let swfFilters = placeObjectTag.filters;
				for (let i = 0; i < swfFilters.length; i++) {
					let obj = swfFilters[i];
					let filterClass = filtersPackage.swfFilterTypes[obj.type];
					let filter: filters.BitmapFilter;
					if (!filterClass) {
						release || assert(filterClass, "Unknown filter type.");
					} else {
						filter = filterClass.FromUntyped(obj);
					}
					filters.push(filter);
				}
				this._filters = filters;
				this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyMiscellaneousProperties);
			} else if (reset && this._filters) {
				this._filters = null;
				this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyMiscellaneousProperties);
			}

			if (placeObjectTag.flags & PlaceObjectFlags.HasBlendMode || reset) {
				let blendMode = flash.display.BlendMode.fromNumber(placeObjectTag.blendMode === undefined ?
					1 : placeObjectTag.blendMode);
				if (blendMode !== this._blendMode) {
					this._blendMode = blendMode;
					this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyMiscellaneousProperties);
				}
			}

			if (placeObjectTag.flags & PlaceObjectFlags.HasCacheAsBitmap || reset) {
				let cacheAsBitmap = placeObjectTag.bmpCache > 0;
				if (cacheAsBitmap !== this._hasFlags(DisplayObjectFlags.CacheAsBitmap)) {
					this._toggleFlags(DisplayObjectFlags.CacheAsBitmap, cacheAsBitmap);
					this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyMiscellaneousProperties);
				}
			}

			if (placeObjectTag.flags & PlaceObjectFlags.HasVisible || reset) {
				let visible = placeObjectTag.visibility === undefined || placeObjectTag.visibility;
				if (visible !== this._hasFlags(DisplayObjectFlags.Visible)) {
					this._toggleFlags(DisplayObjectFlags.Visible, visible);
					this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyMiscellaneousProperties);
				}
			}
		}

		/**
		 * Dispatches an event on this object and all its descendants.
		 */
		_propagateEvent(event: flash.events.Event): void {
			// @ivanpopelyshev: stop double events
			// link is not responding, adobe jura doesnt have this issue
			// http://bugs.adobe.com/jira/browse/FP-1569

			this.visit(function (node) {
				if (event.type === events.Event.ADDED_TO_STAGE) {
					if (node._cacheStage !== null) {
						return VisitorFlags.None;
					}
					node._cacheStage = node.stage;
				}
				if (event.type === events.Event.REMOVED_FROM_STAGE) {
					if (node._cacheStage === null) {
						return VisitorFlags.None;
					}
					node._cacheStage = null;
				}

				node.dispatchEvent(event);
				return VisitorFlags.Continue;
			}, VisitorFlags.None);
		}

		get x(): number {
			return this._getX();
		}

		_getX(): number {
			let value = this._matrix.tx;
			if (this._canHaveTextContent()) {
				let bounds = this._getContentBounds();
				value += bounds.xMin;
			}
			return value / 20;
		}

		set x(value: number) {
			value = (value * 20) | 0;
			this._stopTimelineAnimation();
			if (this._canHaveTextContent()) {
				let bounds = this._getContentBounds();
				value -= bounds.xMin;
			}
			if (value === this._matrix.tx) {
				return;
			}
			this._matrix.tx = value;
			this._invertedMatrix.tx = -value;
			this._invalidatePosition();
			this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyMatrix);
		}

		get y(): number {
			return this._getY();
		}

		_getY(): number {
			let value = this._matrix.ty;
			if (this._canHaveTextContent()) {
				let bounds = this._getContentBounds();
				value += bounds.yMin;
			}
			return value / 20;
		}

		set y(value: number) {
			value = (value * 20) | 0;
			this._stopTimelineAnimation();
			if (this._canHaveTextContent()) {
				let bounds = this._getContentBounds();
				value -= bounds.yMin;
			}
			if (value === this._matrix.ty) {
				return;
			}
			this._matrix.ty = value;
			this._invertedMatrix.ty = -value;
			this._invalidatePosition();
			this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyMatrix);
		}

		/**
		 * In Flash player, this always returns a positive number for some reason. This however, is not
		 * the case for scaleY.
		 */
		get scaleX(): number {
			return Math.abs(this._scaleX);
		}

		set scaleX(value: number) {
			value = +value;
			this._stopTimelineAnimation();
			if (value === this._scaleX) {
				return;
			}
			this._scaleX = value;
			this._invalidateMatrix();
		}

		get scaleY(): number {
			return this._scaleY;
		}

		set scaleY(value: number) {
			value = +value;
			this._stopTimelineAnimation();
			if (value === this._scaleY) {
				return;
			}
			this._scaleY = value;
			this._invalidateMatrix();
		}

		get scaleZ(): number {
			return this._scaleZ;
		}

		set scaleZ(value: number) {
			value = +value;
			release || somewhatImplemented("public DisplayObject::set scaleZ");
			this._scaleZ = value;
		}

		get rotation(): number {
			return this._rotation;
		}

		set rotation(value: number) {
			value = +value;
			this._stopTimelineAnimation();
			value = DisplayObject._clampRotation(value);
			if (value === this._rotation) {
				return;
			}
			let delta = value - this._rotation;
			let angle = delta / 180 * Math.PI;
			this._skewX += angle;
			this._skewY += angle;
			this._rotation = value;
			this._invalidateMatrix();
		}

		get rotationX(): number {
			return this._rotationX;
		}

		set rotationX(value: number) {
			value = +value;
			release || somewhatImplemented("public DisplayObject::set rotationX");
			this._rotationZ = value;
		}

		get rotationY(): number {
			return this._rotationY;
		}

		set rotationY(value: number) {
			value = +value;
			release || somewhatImplemented("public DisplayObject::set rotationY");
			this._rotationY = value;
		}

		get rotationZ(): number {
			return this._rotationZ;
		}

		set rotationZ(value: number) {
			value = +value;
			release || somewhatImplemented("public DisplayObject::set rotationZ");
			this._rotationZ = value;
		}

		/**
		 * The width of this display object in its parent coordinate space.
		 */
		get width(): number {
			return this._getWidth();
		}

		// `get width` is overriden in `Stage` and has to be able to call this.
		_getWidth(): number {
			return this._getTransformedBounds(this._parent, true).width / 20;
		}

		/**
		 * Attempts to change the width of this display object by changing its scaleX / scaleY
		 * properties. The scaleX property is set to the specified |width| value / baseWidth
		 * of the object in its parent cooridnate space with rotation applied.
		 */
		set width(value: number) {
			this._setWidth(value);
		}

		// `set width` is overriden in `Stage` and has to be able to call this.
		_setWidth(value: number) {
			value = (value * 20) | 0;
			this._stopTimelineAnimation();
			if (value < 0) {
				return;
			}
			let contentBounds = this._getContentBounds(true);
			if (this._canHaveTextContent()) {
				let bounds = this._getContentBounds();
				this._setFillAndLineBoundsFromWidthAndHeight(value, contentBounds.height);
				return;
			}
			let bounds = this._getTransformedBounds(this._parent, true);
			let angle = this._rotation / 180 * Math.PI;
			let baseWidth = contentBounds.getBaseWidth(angle);
			if (!baseWidth) {
				return;
			}
			let baseHeight = contentBounds.getBaseHeight(angle);
			this._scaleY = bounds.height / baseHeight;
			this._scaleX = value / baseWidth;
			this._invalidateMatrix();
		}

		/**
		 * The height of this display object in its parent coordinate space.
		 */
		get height(): number {
			return this._getHeight();
		}

		// `get height` is overriden in `Stage` and has to be able to call this.
		_getHeight(): number {
			let bounds = this._getTransformedBounds(this._parent, true);
			return bounds.height / 20;
		}

		/**
		 * Attempts to change the height of this display object by changing its scaleY / scaleX
		 * properties. The scaleY property is set to the specified |height| value / baseHeight
		 * of the object in its parent cooridnate space with rotation applied.
		 */
		set height(value: number) {
			this._setHeight(value);
		}

		// `set height` is overriden in `Stage` and has to be able to call this.
		_setHeight(value: number) {
			value = (value * 20) | 0;
			this._stopTimelineAnimation();
			if (value < 0) {
				return;
			}
			let contentBounds = this._getContentBounds(true);
			if (this._canHaveTextContent()) {
				let bounds = this._getContentBounds();
				this._setFillAndLineBoundsFromWidthAndHeight(contentBounds.width, value);
				return;
			}
			let bounds = this._getTransformedBounds(this._parent, true);
			let angle = this._rotation / 180 * Math.PI;
			let baseHeight = contentBounds.getBaseHeight(angle);
			if (!baseHeight) {
				return;
			}
			let baseWidth = contentBounds.getBaseWidth(angle);
			this._scaleY = value / baseHeight;
			this._scaleX = bounds.width / baseWidth;
			this._invalidateMatrix();
		}

		get mask(): DisplayObject {
			return this._mask;
		}

		/**
		 * Sets the mask for this display object. This does not affect the bounds.
		 */
		set mask(value: DisplayObject) {
			if (this._mask === value || value === this) {
				return;
			}

			if (value && value._maskedObject) {
				value._maskedObject.mask = null;
			}
			if (this._mask) {
				this._mask._maskedObject = null;
			}
			this._mask = value;
			if (value) {
				value._maskedObject = this;
			}
			this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyMask);
		}

		get transform(): flash.geom.Transform {
			return this._getTransform();
		}

		_getTransform() {
			return this._sec.geom.Transform.create([this]);
		}

		set transform(value: flash.geom.Transform) {
			this._stopTimelineAnimation();
			if (value.matrix3D) {
				this._matrix3D = value.matrix3D;
			} else {
				this._setMatrix(value.matrix, true);
			}
			this._setColorTransform(value.colorTransform);
		}

		private destroy(): void {
			this._setFlags(DisplayObjectFlags.Destroyed);
		}

		/**
		 * Walks up the tree to find this display object's root. An object is classified
		 * as a root if its _root property points to itself. Root objects are the Stage,
		 * the main timeline object and a Loader's content.
		 */
		get root(): DisplayObject {
			let node: DisplayObject = this;
			do {
				if (node._root === node) {
					return node;
				}
				node = node._parent;
			} while (node);
			return null;
		}

		/**
		 * Walks up the tree to find this display object's stage, the first object whose
		 * |_stage| property points to itself.
		 */
		get stage(): flash.display.Stage {
			let node: DisplayObject = this;
			do {
				if (node._stage === node) {
					release || assert(this._sec.display.Stage.axIsType(node));
					return <flash.display.Stage>node;
				}
				node = node._parent;
			} while (node);
			return null;
		}

		_cacheStage: flash.display.Stage = null;

		get name(): string {
			return this._name;
		}

		set name(value: string) {
			checkNullParameter(value, "name", this._sec);
			if (this._hasFlags(DisplayObjectFlags.OwnedByTimeline)) {
				// In AVM2, setting the name of a timline-placed DisplayObject throws.
				if (this._symbol && !this._symbol.isAVM1Object) { // fail only in AVM2
					this._sec.throwError('IllegalOperationError', Errors.TimelineObjectNameSealedError);
				}
				return;
			}
			this._name = value;
		}

		get parent(): DisplayObjectContainer {
			return this._parent;
		}

		get alpha(): number {
			return this._colorTransform.alphaMultiplier;
		}

		set alpha(value: number) {
			this._stopTimelineAnimation();
			value = +value;
			if (value === this._colorTransform.alphaMultiplier) {
				return;
			}
			this._colorTransform.alphaMultiplier = value;
			this._colorTransform.convertToFixedPoint();
			this._propagateFlagsDown(DisplayObjectFlags.InvalidConcatenatedColorTransform);
			this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyColorTransform);
		}

		get blendMode(): string {
			return this._blendMode;
		}

		set blendMode(value: string) {
			this._stopTimelineAnimation();
			if (value === this._blendMode) {
				return;
			}
			if (BlendMode.toNumber(value) < 0) {
				this._sec.throwError("ArgumentError", Errors.InvalidEnumError, "blendMode");
			}
			this._blendMode = value;
			this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyMiscellaneousProperties);
		}

		get scale9Grid(): flash.geom.Rectangle {
			return this._getScale9Grid();
		}

		_getScale9Grid() {
			let rectangleClass = this._sec.geom.Rectangle;
			return this._scale9Grid ? rectangleClass.FromBounds(this._scale9Grid) : null;
		}

		set scale9Grid(innerRectangle: flash.geom.Rectangle) {
			this._stopTimelineAnimation();
			this._scale9Grid = Bounds.FromRectangle(innerRectangle);
			this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyMiscellaneousProperties);
		}

		/**
		 * This is always true if a filter is applied.
		 */
		get cacheAsBitmap(): boolean {
			return this._getCacheAsBitmap();
		}

		_getCacheAsBitmap() {
			return (this._filters && this._filters.length > 0) || this._hasFlags(DisplayObjectFlags.CacheAsBitmap);
		}

		set cacheAsBitmap(value: boolean) {
			if (this._hasFlags(DisplayObjectFlags.CacheAsBitmap)) {
				return;
			}
			this._toggleFlags(DisplayObjectFlags.CacheAsBitmap, !!value);
			this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyMiscellaneousProperties);
		}

		/**
		 * References to the internal |_filters| array and its BitmapFilter objects are never leaked
		 * outside of this class. The get/set filters accessors always return deep clones of this
		 * array.
		 */
		get filters(): Array<filters.BitmapFilter> /* flash.filters.BitmapFilter [] */ {
			return this._getFilters();
		}

		_getFilters() {
			let filters = this._filters ? this._filters.map(function (x: flash.filters.BitmapFilter) {
				return x.clone();
			}) : [];
			return filters;
		}

		set filters(value_: Array<filters.BitmapFilter>) {
			let value: flash.filters.BitmapFilter [] = value_ ? value_ : null;
			if (!this._filters) {
				this._filters = [];
			}
			let changed = false;
			if (isNullOrUndefined(value)) {
				changed = this._filters.length > 0;
				this._filters.length = 0;
			} else {
				let bitmapFilterClass = this._sec.filters.BitmapFilter;
				this._filters = value.map(function (x: flash.filters.BitmapFilter) {
					if (!bitmapFilterClass.axIsType(x)) {
						this._sec.throwError('TypeError', Errors.ParamTypeError, '0', 'Filter');
					}
					return x.clone();
				});
				changed = true;
			}
			if (changed) {
				this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyMiscellaneousProperties);
			}
		}

		get visible(): boolean {
			return this._hasFlags(DisplayObjectFlags.Visible);
		}

		/**
		 * Marks this display object as visible / invisible. This does not affect the bounds.
		 */
		set visible(value: boolean) {
			value = !!value;
			if (value === this._hasFlags(DisplayObjectFlags.Visible)) {
				return;
			}
			this._toggleFlags(DisplayObjectFlags.Visible, value);
			this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyMiscellaneousProperties);
		}

		get z(): number {
			return this._z;
		}

		set z(value: number) {
			value = +value;
			this._z = value;
			release || somewhatImplemented("public DisplayObject::set z");
		}

		getBounds(targetCoordinateSpace: DisplayObject): flash.geom.Rectangle {
			targetCoordinateSpace = targetCoordinateSpace || this;
			let rectangleClass = this._sec.geom.Rectangle;
			return rectangleClass.FromBounds(this._getTransformedBounds(targetCoordinateSpace, true));
		}

		getRect(targetCoordinateSpace: DisplayObject): flash.geom.Rectangle {
			targetCoordinateSpace = targetCoordinateSpace || this;
			let rectangleClass = this._sec.geom.Rectangle;
			return rectangleClass.FromBounds(this._getTransformedBounds(targetCoordinateSpace, false));
		}

		/**
		 * Converts a point from the global coordinate space into the local coordinate space.
		 */
		globalToLocal(point: flash.geom.Point): flash.geom.Point {
			let m = this._getInvertedConcatenatedMatrix();
			let p = m.transformPointInPlace(point.clone().toTwips()).round();
			return p.toPixels();
		}

		/**
		 * Converts a point form the local coordinate sapce into the global coordinate space.
		 */
		localToGlobal(point: flash.geom.Point): flash.geom.Point {
			let m = this._getConcatenatedMatrix();
			let p = m.transformPointInPlace(point.clone().toTwips()).round();
			return p.toPixels();
		}

		globalToLocal3D(point: flash.geom.Point): flash.geom.Vector3D {
			release || notImplemented("public DisplayObject::globalToLocal3D");
			return null;
		}

		localToGlobal3D(point: flash.geom.Point): flash.geom.Vector3D {
			release || notImplemented("public DisplayObject::localToGlobal3D");
			return null;
		}

		local3DToGlobal(point3d: flash.geom.Vector3D): flash.geom.Point {
			release || notImplemented("public DisplayObject::local3DToGlobal");
			return null;
		}

		/**
		 * Tree visitor that lets you skip nodes or return early.
		 */
		public visit(visitor: (d: DisplayObject) => VisitorFlags, visitorFlags: VisitorFlags, displayObjectFlags: DisplayObjectFlags = DisplayObjectFlags.None) {
			let stack: DisplayObject [];
			let displayObject: DisplayObject;
			let displayObjectContainer: DisplayObjectContainer;
			let frontToBack = visitorFlags & VisitorFlags.FrontToBack;
			stack = [this];
			while (stack.length > 0) {
				displayObject = stack.pop();
				let flags = VisitorFlags.None;
				if (visitorFlags & VisitorFlags.Filter && !displayObject._hasAnyFlags(displayObjectFlags)) {
					flags = VisitorFlags.Skip;
				} else {
					flags = visitor(displayObject);
				}
				if (flags === VisitorFlags.Continue) {
					let children = displayObject._children;
					if (children) {
						let length = children.length;
						for (let i = 0; i < length; i++) {
							let child = children[frontToBack ? i : length - 1 - i];
							stack.push(child);
						}
					}
				} else if (flags === VisitorFlags.Stop) {
					return;
				}
			}
		}

		/**
		 * Returns the loader info for this display object's root.
		 */
		get loaderInfo(): flash.display.LoaderInfo {
			let root = this.root;
			if (root) {
				release || assert(root._loaderInfo, "No LoaderInfo object found on root.");
				return root._loaderInfo;
			}
			return null;
		}

		/**
		 * Only these objects can have graphics.
		 */
		_canHaveGraphics(): boolean {
			return false;
		}

		/**
		 * Gets the graphics object of this object. Shapes, MorphShapes, and Sprites override this.
		 */
		_getGraphics(): flash.display.Graphics {
			return null;
		}

		/**
		 * Only these objects can have text content.
		 */
		_canHaveTextContent(): boolean {
			return false;
		}

		/**
		 * Gets the text content of this object. StaticTexts and TextFields override this.
		 */
		_getTextContent(): Shumway.TextContent {
			return null;
		}

		/**
		 * Lazily construct a graphics object.
		 */
		_ensureGraphics(): flash.display.Graphics {
			release || assert(this._canHaveGraphics());
			if (this._graphics) {
				return this._graphics;
			}
			this._graphics = this._sec.display.Graphics.create();
			this._graphics._setParent(this);
			this._invalidateFillAndLineBounds(true, true);
			this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyGraphics);
			return this._graphics;
		}

		/**
		 * Sets this object's graphics or text content. Happens when an animated Shape or StaticText
		 * object is initialized from a symbol or replaced by a timeline command using the same symbol
		 * as this object was initialized from.
		 */
		_setStaticContentFromSymbol(symbol: Shumway.Timeline.DisplaySymbol) {
			release || assert(!symbol.dynamic);
			if (symbol instanceof flash.display.ShapeSymbol) {
				release || assert(this._canHaveGraphics());
				let newGraphics = (<flash.display.ShapeSymbol>symbol).graphics;
				if (this._graphics === newGraphics) {
					return;
				}
				this._graphics = newGraphics;
				this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyGraphics);
			} else if (symbol instanceof flash.text.TextSymbol) {
				release || assert(this._sec.text.StaticText.axIsType(this));
				let newTextContent = (<flash.text.TextSymbol>symbol).textContent;
				if ((this as any)._textContent === newTextContent) {
					return;
				}
				(this as any)._textContent = newTextContent;
				this._setDirtyFlags(DisplayObjectDirtyFlags.DirtyTextContent);
			}
			this._symbol = symbol;
			this._setFillAndLineBoundsFromSymbol(symbol);
		}

		/**
		 * Checks if the bounding boxes of two display objects overlap, this happens in the global
		 * coordinate coordinate space.
		 *
		 * Two objects overlap even if one or both are not on the stage, as long as their bounds
		 * in the global coordinate space overlap.
		 */
		hitTestObject(other: DisplayObject): boolean {
			release || assert(other && this._sec.display.DisplayObject.axIsType(other));
			let a = this, b = other;
			let aBounds = a._getContentBounds(false).clone();
			let bBounds = b._getContentBounds(false).clone();
			a._getConcatenatedMatrix().transformBounds(aBounds);
			b._getConcatenatedMatrix().transformBounds(bBounds);
			return aBounds.intersects(bBounds);
		}

		/**
		 * The |globalX| and |globalY| arguments are in global coordinates. The |shapeFlag| indicates
		 * whether the hit test should be on the actual shape of the object or just its bounding box.
		 *
		 * Note: shapeFlag is optional, but the type coercion will do the right thing for it, so we
		 * don't need to take the overhead from being explicit about that.
		 */
		hitTestPoint(globalX: number, globalY: number, shapeFlag: boolean): boolean {
			globalX = +globalX * 20 | 0;
			globalY = +globalY * 20 | 0;
			shapeFlag = !!shapeFlag;
			let testingType = shapeFlag ?
				HitTestingType.HitTestShape :
				HitTestingType.HitTestBounds;
			return !!this._containsGlobalPoint(globalX, globalY, testingType, null);
		}

		/**
		 * Internal implementation of all point intersection checks.
		 *
		 * _containsPoint is used for
		 *  - mouse/drop target finding
		 *  - getObjectsUnderPoint
		 *  - hitTestPoint
		 *
		 * Mouse/Drop target finding and getObjectsUnderPoint require checking against the exact shape,
		 * and making sure that the checked coordinates aren't hidden through masking or clipping.
		 *
		 * hitTestPoint never checks for clipping, and masking only for testingType HitTestShape.
		 *
		 * The `objects` object is used for collecting objects for `getObjectsUnderPoint` or looking
		 * for a drop target. If it is supplied, objects for which `_containsPointDirectly` is true are
		 * added to it.
		 *
		 * Overridden in DisplayObjectContainer, Sprite and SimpleButton.
		 */
		_containsPoint(globalX: number, globalY: number, localX: number, localY: number,
		               testingType: HitTestingType, objects: DisplayObject[]): HitTestingResult {
			let result = this._boundsAndMaskContainPoint(globalX, globalY, localX, localY, testingType);
			// We're done if either we don't have a hit, or if we're only interested in matching bounds
			// or bounds + mask. That is true for HitTestPoint without shapeFlag set.
			if (result === HitTestingResult.None || testingType < HitTestingType.HitTestShape) {
				return result;
			}
			let containsPoint = this._containsPointDirectly(localX, localY, globalX, globalY);
			if (containsPoint && objects) {
				if (testingType === HitTestingType.Drop) {
					// For Drop, replace previous hit with current one.
					objects[0] = this;
				} else if (testingType === HitTestingType.ObjectsUnderPoint ||
					this._sec.display.InteractiveObject.axIsType(this) &&
					(this as any)._mouseEnabled) {
					// For getObjectsUnderPoint, push all direct hits, for mouse target finding
					// InteractiveObjects only.
					objects.push(this);
				}
			}
			return containsPoint ? HitTestingResult.Shape : result;
		}

		_containsGlobalPoint(globalX: number, globalY: number,
		                     testingType: HitTestingType, objects: DisplayObject[]): HitTestingResult {
			let matrix = this._getInvertedConcatenatedMatrix();
			let localX = matrix.transformX(globalX, globalY);
			let localY = matrix.transformY(globalX, globalY);
			return this._containsPoint(globalX, globalY, localX, localY, testingType, objects);
		}

		/**
		 * Fast check if a point can intersect the receiver object. Returns true if
		 * - the object is visible OR hit testing is performed for one of the `hitTest{Point,Object}`
		 *   methods.
		 * - the point is within the receiver's bounds
		 * - for testingType values other than HitTestBounds, the point intersects with the a mask,
		 *   if the object has one.
		 *
		 * Note that the callers are expected to have both local and global coordinates available
		 * anyway, so _boundsAndMaskContainPoint takes both to avoid recalculating them.
		 */
		_boundsAndMaskContainPoint(globalX: number, globalY: number, localX: number, localY: number,
		                           testingType: HitTestingType): HitTestingResult {
			if (testingType >= HitTestingType.HitTestBoundsAndMask &&
				this._hasFlags(DisplayObjectFlags.ContainsMorph)) {
				// If this display object is a MorphShape or contains at least one descendant that is, then
				// bailing out too early might lead to a wrong hit test result, since the reported bounds
				// of MorphShapes are always the one of their start shapes and don't take the current morph
				// ratio into account. We have to make sure we always hit test MorphShape instances on
				// graphics level.
				return HitTestingResult.Bounds;
			}
			if (testingType >= HitTestingType.Mouse && !this._hasFlags(DisplayObjectFlags.Visible) ||
				!this._getContentBounds().contains(localX, localY)) {
				return HitTestingResult.None;
			}
			if (testingType === HitTestingType.HitTestBounds || !this._mask) {
				return HitTestingResult.Bounds;
			}
			return this._mask._containsGlobalPoint(globalX, globalY,
				HitTestingType.HitTestBoundsAndMask, null);
		}

		/**
		 * Tests if the receiver's own visual content intersects with the given point.
		 * In the base implementation, this just returns false, because not all DisplayObjects can
		 * ever match.
		 * Overridden in Shape, MorphShape, Sprite, Bitmap, Video, and TextField.
		 */
		_containsPointDirectly(localX: number, localY: number,
		                       globalX: number, globalY: number): boolean {
			return false;
		}

		get scrollRect(): flash.geom.Rectangle {
			return this._getScrollRect();
		}

		_getScrollRect(): flash.geom.Rectangle {
			return this._scrollRect ? this._scrollRect.clone() : null;
		}

		set scrollRect(value: flash.geom.Rectangle) {
			value = value;
			this._scrollRect = value ? value.clone() : null;
			/* TODO: Figure out how to deal with the bounds and hit testing when scroll rects are applied.
			 * The Flash implementation appears to be broken. */
			release || somewhatImplemented("public DisplayObject::set scrollRect");
			return;
		}

		get opaqueBackground(): any {
			return this._opaqueBackground;
		}

		/**
		 * Sets the opaque background color. By default this is |null|, which indicates that no opaque
		 * color is set. Otherwise this is an unsinged number.
		 */
		set opaqueBackground(value: any) {
			release || assert(value === null || Shumway.isInteger(value));
			this._opaqueBackground = value;
		}

		/**
		 * Returns the distance between this object and a given ancestor.
		 */
		private _getDistance(ancestor: DisplayObject): number {
			let d = 0;
			let node: DisplayObject = this;
			while (node && node !== ancestor) {
				d++;
				node = node._parent;
			}
			return d;
		}

		/**
		 * Finds the nearest common ancestor with a given node.
		 */
		findNearestCommonAncestor(node: DisplayObject): DisplayObject {
			if (!node) {
				return null;
			}
			let ancestor: DisplayObject = this;
			let d1 = ancestor._getDistance(null);
			let d2 = node._getDistance(null);
			while (d1 > d2) {
				ancestor = ancestor._parent;
				d1--;
			}
			while (d2 > d1) {
				node = node._parent;
				d2--;
			}
			while (ancestor !== node) {
				ancestor = ancestor._parent;
				node = node._parent;
			}
			return ancestor;
		}

		/**
		 * Returns the current mouse position relative to this object.
		 */
		_getLocalMousePosition(): flash.geom.Point {
			let position = this._sec.ui.Mouse._currentPosition;
			return this.globalToLocal(position);
		}

		get mouseX(): number {
			return this._getLocalMousePosition().x;
		}

		get mouseY(): number {
			return this._getLocalMousePosition().y;
		}

		public debugName(withFlags: boolean = false): string {
			let name = this._id + " [" + this._depth + "]: (" + this._referenceCount + ") " + this;
			if (withFlags) {
				let flagNames = [];
				for (let i = 0; i < 32; i++) {
					if (this._hasFlags(1 << i)) {
						flagNames.push(String([1 << i]));
					}
				}
				name += " " + flagNames.join("|");
			}
			return name;
		}

		public debugNameShort(): string {
			return "[" + this._depth + ":" + this._id + "]: (" + this._referenceCount + ") {" + this._flags + "} " + this;
		}

		public hashCode(): number {
			return this.getBounds(null).hashCode();
		}

		public getAncestorCount(): number {
			return 0;
		}

		public debugTrace(writer = new IndentingWriter(), maxDistance = 1024, name = "") {
			let self = this;
			this.visit(function (node) {
				let distance = node._getDistance(self);
				if (distance > maxDistance) {
					return VisitorFlags.Skip;
				}
				let prefix = name + Shumway.StringUtilities.multiple(" ", distance);
				writer.writeLn(prefix + node.debugNameShort() + ", bounds: " + node.getBounds(null).toString());
				return VisitorFlags.Continue;
			}, VisitorFlags.None);
		}

		_addReference() {
			this._referenceCount++;
		}

		_removeReference() {
			// TODO: Uncomment this assertion once we're sure reference counting works correctly.
			// assert (this._referenceCount > 0);
			this._referenceCount--;
			if (this._referenceCount !== 0 || !this._children) {
				return;
			}
			let children = this._children;
			for (let i = 0; i < children.length; i++) {
				children[i]._removeReference();
			}
		}

		/**
		 * Returns script precedence sequence based on placeObjectTag. Creates every
		 * time a new array, so it's safe to modify it.
		 * @private
		 */
		_getScriptPrecedence(): number[] {
			if (!this._parent) {
				return [];
			}
			let result = this._parent._getScriptPrecedence();
			if (this._placeObjectTag) {
				result.push(this._placeObjectTag.actionBlocksPrecedence);
			}
			return result;
		}

		get accessibilityProperties(): accessibility.AccessibilityProperties {
			return this._accessibilityProperties;
		}

		set accessibilityProperties(value: accessibility.AccessibilityProperties) {
			// In Flash this does not do copying.
			// TODO: coerce to the correct type.
			this._accessibilityProperties = value;
		}

		set blendShader(value: any /* flash.display.Shader */) {
			release || somewhatImplemented("public DisplayObject::set blendShader");
		}

		axSetPublicProperty(name: string, value: any): void {

		}

		axGetPublicProperty(name: string): any {

		}
	}
}

module Shumway.GFX {

	import Rectangle = Shumway.GFX.Geometry.Rectangle;
	import Point = Shumway.GFX.Geometry.Point;
	import Matrix = Shumway.GFX.Geometry.Matrix;
	import DirtyRegion = Shumway.GFX.Geometry.DirtyRegion;
	import Filter = Shumway.GFX.Filter;
	import TileCache = Shumway.GFX.Geometry.TileCache;
	import Tile = Shumway.GFX.Geometry.Tile;
	import OBB = Shumway.GFX.Geometry.OBB;

	export const enum Layout {
		Simple
	}

	export class TreeRendererOptions extends RendererOptions {
		layout: Layout = Layout.Simple;
	}

	export class TreeRenderer extends Renderer {
		_options: TreeRendererOptions;
		_canvas: HTMLCanvasElement;
		_context: CanvasRenderingContext2D;
		layout: any;

		constructor(container: HTMLDivElement,
		            stage: Stage,
		            options: TreeRendererOptions = new TreeRendererOptions()) {
			super(container, stage, options);
			this._canvas = document.createElement("canvas");
			this._container.appendChild(this._canvas);
			this._context = this._canvas.getContext("2d");
			this._listenForContainerSizeChanges();
		}

		private _listenForContainerSizeChanges() {
			let pollInterval = 10;
			let w = this._containerWidth;
			let h = this._containerHeight;
			this._onContainerSizeChanged();
			let self = this;
			setInterval(function () {
				if (w !== self._containerWidth || h !== self._containerHeight) {
					self._onContainerSizeChanged();
					w = self._containerWidth;
					h = self._containerHeight;
				}
			}, pollInterval);
		}

		private _getRatio(): number {
			let devicePixelRatio = window.devicePixelRatio || 1;
			let backingStoreRatio = 1;
			let ratio = 1;
			if (devicePixelRatio !== backingStoreRatio) {
				ratio = devicePixelRatio / backingStoreRatio;
			}
			return ratio;
		}

		private _onContainerSizeChanged() {
			let ratio = this._getRatio();
			let w = Math.ceil(this._containerWidth * ratio);
			let h = Math.ceil(this._containerHeight * ratio);
			let canvas = this._canvas;
			if (ratio > 0) {
				canvas.width = w * ratio;
				canvas.height = h * ratio;
				canvas.style.width = w + 'px';
				canvas.style.height = h + 'px';
			} else {
				canvas.width = w;
				canvas.height = h;
			}
		}

		private get _containerWidth(): number {
			return this._container.clientWidth;
		}

		private get _containerHeight(): number {
			return this._container.clientHeight;
		}

		public render() {
			let context = this._context;
			context.save();

			context.clearRect(0, 0, this._canvas.width, this._canvas.height);
			context.scale(1, 1);
			if (this._options.layout === Layout.Simple) {
				this._renderNodeSimple(this._context, this._stage, Matrix.createIdentity());
			}
			context.restore();
		}

		_renderNodeSimple(context: CanvasRenderingContext2D, root: Node, transform: Matrix) {
			let self = this;
			context.save();
			let fontHeight = 16;
			context.font = fontHeight + "px Arial";
			context.fillStyle = "white";
			let x = 0, y = 0;
			let w = 20, h = fontHeight, hPadding = 2, wColPadding = 8;
			let colX = 0;
			let maxX = 0;

			function visit(node: Node) {
				let children = node.getChildren();
				if (node.hasFlags(NodeFlags.Dirty)) {
					context.fillStyle = "red";
				} else {
					context.fillStyle = "white";
				}

				let l = String(node.id);

				if (node instanceof RenderableText) {
					l = "T" + l;
				} else if (node instanceof RenderableShape) {
					l = "S" + l;
				} else if (node instanceof RenderableBitmap) {
					l = "B" + l;
				} else if (node instanceof RenderableVideo) {
					l = "V" + l;
				}

				if (node instanceof Renderable) {
					l = l + " [" + (<any>node)._parents.length + "]";
				}

				let t = context.measureText(l).width;
				// context.fillRect(x, y, t, h);
				context.fillText(l, x, y);
				if (children) {
					x += t + 4;
					maxX = Math.max(maxX, x + w);
					for (let i = 0; i < children.length; i++) {
						visit(children[i]);
						if (i < children.length - 1) {
							y += h + hPadding;
							if (y > self._canvas.height) {
								context.fillStyle = "gray";
								// context.fillRect(maxX + 4, 0, 2, self._canvas.height);
								x = x - colX + maxX + wColPadding;
								colX = maxX + wColPadding;
								y = 0;
								context.fillStyle = "white";
							}
						}
					}
					x -= t + 4;
				}
			}

			visit(root);
			context.restore();
		}
	}
}
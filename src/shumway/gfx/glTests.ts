/// <reference path='references.ts'/>

module Shumway.GFX.GL.Tests {
	export function runTests(writer: IndentingWriter) {
		writer.writeLn("Running Tests");
		runLRUListTests(writer);
		runCompact(writer);
	}

	import LRUList = Shumway.GFX.GL.LRUList;
	import ILinkedListNode = Shumway.GFX.GL.ILinkedListNode;

	class Node implements ILinkedListNode<Node> {
		previous: Node;
		next: Node;
		value: number;

		constructor(value: number) {
			this.value = value;
		}
	}

	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

	function runLRUListTests(writer: IndentingWriter): boolean {
		let nodes = [];
		for (let i = 0; i < 1000; i++) {
			nodes.push(new Node(i));
		}
		let list = new LRUList<Node>();
		for (let i = 0; i < 1000; i++) {
			list.put(nodes[i]);
		}
		for (let c = 0; c < 20; c++) {
			for (let i = 0; i < 1000; i++) {
				list.put(nodes[getRandomInt(nodes.length - 1)]);
			}
			let c = list.count;
			for (let i = 0; i < c; i++) {
				list.pop();
			}
		}

		return true;
	}

	function runCompact(writer: IndentingWriter): boolean {
		let x = new Shumway.GFX.Geometry.RegionAllocator.Compact(1024, 1024, 0);
		let a = [];
		let c = 100;
		for (let k = 0; k < c; k++) {
			for (let i = 0; i < c; i++) {
				let r = x.allocate(getRandomInt(10), getRandomInt(10));
				release || assert(r);
				a.push(r);
			}
			for (let i = 0; i < c; i++) {
				x.free(a.pop());
			}
		}
		return true;
	}
}

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
// Class: FileReference
module Shumway.flash.net {
	import notImplemented = Shumway.Debug.notImplemented;
	export class FileReference extends flash.events.EventDispatcher {
		constructor() {
			super();
		}

		load: () => void;
		save: (data: any, defaultFileName?: string) => void;

		// _creationDate: ASDate;
		// _creator: string;
		// _modificationDate: ASDate;
		// _name: string;
		// _size: number;
		// _type: string;
		// _data: flash.utils.ByteArray;
		get creationDate(): any {
			release || notImplemented("public flash.net.FileReference::get creationDate");
			return null;
			// return this._creationDate;
		}

		get creator(): string {
			release || notImplemented("public flash.net.FileReference::get creator");
			return "";
			// return this._creator;
		}

		get modificationDate(): any {
			release || notImplemented("public flash.net.FileReference::get modificationDate");
			return null;
			// return this._modificationDate;
		}

		get name(): string {
			release || notImplemented("public flash.net.FileReference::get name");
			return "";
			// return this._name;
		}

		get size(): number {
			release || notImplemented("public flash.net.FileReference::get size");
			return 0;
			// return this._size;
		}

		get type(): string {
			release || notImplemented("public flash.net.FileReference::get type");
			return "";
			// return this._type;
		}

		cancel(): void {
			release || notImplemented("public flash.net.FileReference::cancel");
			return;
		}

		download(request: flash.net.URLRequest, defaultFileName: string = null): void {
			request = request;
			defaultFileName = defaultFileName;
			release || notImplemented("public flash.net.FileReference::download");
			return;
		}

		upload(request: flash.net.URLRequest, uploadDataFieldName: string = "Filedata", testUpload: boolean = false): void {
			request = request;
			uploadDataFieldName = uploadDataFieldName;
			testUpload = !!testUpload;
			release || notImplemented("public flash.net.FileReference::upload");
			return;
		}

		get data(): flash.utils.ByteArray {
			release || notImplemented("public flash.net.FileReference::get data");
			return null;
			// return this._data;
		}

		browse(typeFilter: Array<string> = null): boolean {
			typeFilter = typeFilter;
			release || notImplemented("public flash.net.FileReference::browse");
			return false;
		}
	}
}

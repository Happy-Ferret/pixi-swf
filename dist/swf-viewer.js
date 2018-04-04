var MozTransprotPeer = /** @class */ (function () {
    function MozTransprotPeer(window, target, name) {
        this.target = target;
        this.window = window;
        this._name = name;
    }
    Object.defineProperty(MozTransprotPeer.prototype, "onAsyncMessage", {
        set: function (callback) {
            this.window.addEventListener('message', function (e) {
                Promise.resolve(e.data).then(function (msg) {
                    // console.log('received async', this._name, msg);
                    callback(msg);
                });
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MozTransprotPeer.prototype, "onSyncMessage", {
        set: function (callback) {
            this.window.addEventListener('syncmessage', function (e) {
                var wrappedMessage = e.detail;
                var msg = wrappedMessage.msg;
                // console.log('received sync', this._name, msg);
                wrappedMessage.result = callback(msg);
            });
        },
        enumerable: true,
        configurable: true
    });
    MozTransprotPeer.prototype.postAsyncMessage = function (msg, transfers) {
        //console.log('sending async', this._name, msg, transfers);
        this.target.postMessage(msg, '*', transfers);
    };
    MozTransprotPeer.prototype.sendSyncMessage = function (msg, transfers) {
        //console.log('sending sync', this._name, msg, transfers);
        var event = this.target.document.createEvent('CustomEvent');
        var wrappedMessage = {
            msg: msg,
            result: undefined
        };
        event.initCustomEvent('syncmessage', false, false, wrappedMessage);
        this.target.dispatchEvent(event);
        return wrappedMessage.result;
    };
    return MozTransprotPeer;
}());
var PandaTransprotPeer = /** @class */ (function () {
    function PandaTransprotPeer(key, name) {
        this._another = null;
        this._name = null;
        this._name = name;
        console.log('PandaTransprotPeer::ctor, key:', key, 'name', this._name, 'counter:', PandaTransprotPeer._counter);
        PandaTransprotPeer._counter++;
        var another = PandaTransprotPeer._aloneHash[key];
        if (another) {
            another._another = this;
            this._another = another;
            delete PandaTransprotPeer._aloneHash[key];
            console.log('PandaTransprotPeer::connected');
        }
        else {
            PandaTransprotPeer._aloneHash[key] = this;
            console.log('PandaTransprotPeer::created alone');
        }
    }
    Object.defineProperty(PandaTransprotPeer.prototype, "onAsyncMessage", {
        set: function (callback) {
            var _this = this;
            window.addEventListener('message', function (e) {
                var rawMessage = e.data;
                if (_this.isPandaWrappedMessageFromAnother(rawMessage)) {
                    var msg_1 = rawMessage.payload;
                    Promise.resolve().then(function () {
                        callback(msg_1);
                    });
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    PandaTransprotPeer.prototype.isPandaWrappedMessageFromAnother = function (msg) {
        if ('from' in msg && 'payload' in msg) {
            if (this._another) {
                if (msg.from == this._another._name) {
                    return true;
                }
            }
            else {
                console.log(this._name, 'received PandaWrappedMessage from', msg.from, 'but has no this._another link');
            }
        }
        return false;
    };
    PandaTransprotPeer.prototype.postAsyncMessage = function (msg, transfers) {
        //console.log('sending async', this._name, msg, transfers);
        var wrapped = new PandaWrappedMessage(msg, this._name);
        window.postMessage(wrapped, '*', transfers);
    };
    Object.defineProperty(PandaTransprotPeer.prototype, "onSyncMessage", {
        set: function (callback) {
            this._syncCallBack = callback;
        },
        enumerable: true,
        configurable: true
    });
    PandaTransprotPeer.prototype.sendSyncMessage = function (msg, transfers) {
        //console.log('sending sync', this._name, msg, transfers);
        var callback = this._another ? this._another._syncCallBack : null;
        if (callback) {
            return callback(msg);
        }
    };
    PandaTransprotPeer._aloneHash = {};
    PandaTransprotPeer._counter = 0;
    return PandaTransprotPeer;
}());
var PandaWrappedMessage = /** @class */ (function () {
    function PandaWrappedMessage(payload, from) {
        this.payload = payload;
        this.from = from;
    }
    return PandaWrappedMessage;
}());
///ts:ref=transportPeer
/// <reference path="./transportPeer.ts"/> ///ts:ref:generated
// Implements most of APIs from https://code.google.com/p/swfobject/wiki/api
var ShumwayObject = /** @class */ (function () {
    function ShumwayObject() {
        this._originalCreateElement = document.createElement;
        // Using last loaded script director as a base for Shumway resources
        this._lastScriptElement = (document.body || document.getElementsByTagName('head')[0]).lastChild;
        this._shumwayHome = combineUrl(this._lastScriptElement.src, '.');
        // Checking if viewer is hosted remotely
        this._shumwayRemote = getOrigin(document.location.href) !== getOrigin(this._shumwayHome);
        this._enabledRemoteOrigins = null;
    }
    ShumwayObject.prototype.setupRemote = function (origin) {
        var _this = this;
        if (!this._enabledRemoteOrigins) {
            window.addEventListener('message', function (e) {
                var data = e.data;
                if (typeof data !== 'object' || data === null || data.type !== 'shumwayFileLoading') {
                    return;
                }
                if (!_this._enabledRemoteOrigins[e.origin]) {
                    return;
                }
                fetchRemoteFile(data, e.source, e.origin);
            });
            this._enabledRemoteOrigins = Object.create(null);
        }
        this._enabledRemoteOrigins[origin] = true;
    };
    // Creates Shumway iframe
    ShumwayObject.prototype._createSWF = function (swfUrl, id, width, height, flashvars, params, attributes) {
        var cssStyle;
        if (attributes) {
            swfUrl = swfUrl || attributes['data'];
            id = attributes['id'] || id;
            width = width || attributes['width'];
            height = height || attributes['height'];
            cssStyle = attributes['style'];
        }
        var viewerUrl = combineUrl(this._shumwayHome, 'iframe/viewer.html');
        var absoluteSwfUrl = combineUrl(getDocumentBase(), swfUrl);
        var iframeElement = document.createElement('iframe');
        if (width) {
            iframeElement.width = width;
        }
        if (height) {
            iframeElement.height = height;
        }
        iframeElement.setAttribute('id', id);
        if (attributes) {
            Object.keys(attributes).forEach(function (name) {
                switch (name.toLowerCase()) {
                    case 'styleclass':
                        iframeElement.setAttribute('class', attributes[name]);
                        break;
                    case 'class':
                    case 'name':
                    case 'align':
                        iframeElement.setAttribute(name, attributes[name]);
                        break;
                }
            });
        }
        var objectParams = {};
        var flashBase;
        if (params) {
            Object.keys(params).forEach(function (name) {
                name = name.toLowerCase();
                if (name === 'flashvars') {
                    if (!flashvars) {
                        flashvars = parseQueryString(params[name]);
                    }
                }
                else if (name === 'base') {
                    // Base param, send as baseUrl in pluginParams below
                    flashBase = combineUrl(getDocumentBase(), params[name]);
                }
                objectParams[name] = params[name];
            });
        }
        var movieParams = {};
        if (flashvars) {
            var flashvarsParts = [];
            Object.keys(flashvars).forEach(function (name) {
                movieParams[name] = flashvars[name];
                flashvarsParts.push(encodeURIComponent(name) + '=' + encodeURIComponent(flashvars[name]));
            });
            if (flashvarsParts.length > 0) {
                objectParams['flashvars'] = flashvarsParts.join('&');
            }
        }
        var pluginParams = {
            baseUrl: flashBase || getDocumentBase(),
            url: absoluteSwfUrl,
            movieParams: movieParams,
            objectParams: objectParams,
            isRemote: this._shumwayRemote
        };
        if (this._shumwayRemote) {
            this.setupRemote(getOrigin(viewerUrl));
        }
        iframeElement.src = viewerUrl;
        iframeElement.setAttribute('frameborder', '0');
        if (cssStyle) {
            iframeElement.setAttribute('style', cssStyle);
        }
        var load = function (e) {
            iframeElement.removeEventListener('load', load);
            iframeElement.contentWindow.postMessage({ type: 'pluginParams', flashParams: pluginParams }, '*');
        };
        iframeElement.addEventListener('load', load);
        return iframeElement;
    };
    // Replaces initial DOM element with Shumway iframe.
    ShumwayObject.prototype._embedSWF = function (element, swfUrl, id, width, height, flashvars, params, attributes, callbackFn) {
        var _this = this;
        var iframeElement = this._createSWF(swfUrl, id, width, height, flashvars, params, attributes);
        var load = function (e) {
            iframeElement.removeEventListener('load', load);
            if (_this._shumwayRemote) {
                // It's not possible expose the external interface or internals of
                // the Shumway, because iframeElement.contentDocument is not available.
                if (callbackFn) {
                    callbackFn({ success: true, id: iframeElement.id, ref: iframeElement });
                }
                return;
            }
            var contentDocument = iframeElement.contentDocument;
            var started = function (e) {
                contentDocument.removeEventListener('shumwaystarted', started, true);
                iframeElement.shumway = new ShumwayBindings(iframeElement);
                if (callbackFn) {
                    callbackFn({ success: true, id: iframeElement.id, ref: iframeElement });
                }
            };
            contentDocument.addEventListener('shumwaystarted', started, true);
        };
        iframeElement.addEventListener('load', load);
        element.parentNode.replaceChild(iframeElement, element);
    };
    // Copies parameters/attributes from the DOM element and replaces it.
    ShumwayObject.prototype.replaceBySWF = function (element, id, callbackFn) {
        // import parameters
        var width = element.getAttribute('width');
        var height = element.getAttribute('height');
        var swfUrl = element.getAttribute('data');
        var attributes = {
            id: element.getAttribute('id'),
            name: element.getAttribute('name'),
            "class": element.getAttribute('class'),
            align: element.getAttribute('align'),
            style: element.getAttribute('style')
        };
        var paramNodes = element.getElementsByTagName('param');
        var params = {};
        for (var i = 0; i < paramNodes.length; i++) {
            var paramName = paramNodes[i].getAttribute('name');
            var paramValue = paramNodes[i].getAttribute('value');
            if (!paramName) {
                continue;
            }
            params[paramName.toLowerCase()] = paramValue;
        }
        if (!swfUrl) {
            swfUrl = params['src'] || params['movie'];
        }
        this._embedSWF(element, swfUrl, id, width, height, undefined, params, attributes, callbackFn);
    };
    ShumwayObject.prototype.createAndMonitorShadowObject = function () {
        var _this = this;
        var xObject = this._originalCreateElement.call(document, 'x-shu-object');
        var observer = new MutationObserver(function (mutations) {
            for (var _i = 0, mutations_1 = mutations; _i < mutations_1.length; _i++) {
                var mutation = mutations_1[_i];
                var addedNodes = mutation.addedNodes;
                if (!addedNodes || addedNodes.length === 0) {
                    break;
                }
                for (var i = 0; i < addedNodes.length; i++) {
                    if (addedNodes[i] === xObject) {
                        _this.replaceBySWF(xObject, undefined, undefined);
                        observer.disconnect();
                        break;
                    }
                }
            }
            ;
        });
        observer.observe(document, { childList: true, subtree: true });
        return xObject;
    };
    Object.defineProperty(ShumwayObject.prototype, "shumwayHome", {
        /**
         * Specifies the location of the Shumway base folder.
         */
        get: function () {
            return this._shumwayHome;
        },
        set: function (value) {
            this._shumwayHome = combineUrl(document.location.href, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShumwayObject.prototype, "shumwayRemote", {
        /**
         * Specifies if Shumway shall take in account cross-domain policies.
         *
         * When true is set, SWF files will be requested by the main page, external
         * interface is disable and Shumway internal objects are not available.
         */
        get: function () {
            return this._shumwayRemote;
        },
        set: function (value) {
            this._shumwayRemote = !!value;
        },
        enumerable: true,
        configurable: true
    });
    ShumwayObject.prototype.registerObject = function (id, version, expressInstallSwfurl, callbackFn) {
        var _this = this;
        onDOMReady(function () {
            var element = document.getElementById(id);
            if (!element) {
                throw new Error('element ' + id + ' was not found');
            }
            _this.replaceBySWF(element, id, callbackFn);
        });
    };
    ShumwayObject.prototype.embedSWF = function (swfUrl, id, width, height, version, expressInstallSwfurl, flashvars, params, attributes, callbackFn) {
        var _this = this;
        onDOMReady(function () {
            var element = document.getElementById(id);
            if (!element) {
                throw new Error('element ' + id + ' was not found');
            }
            _this._embedSWF(element, swfUrl, id, width, height, flashvars, params, attributes, callbackFn);
        });
    };
    ShumwayObject.prototype.getObjectById = function (id) {
        return document.getElementById(id);
    };
    ShumwayObject.prototype.getFlashPlayerVersion = function () {
        return { major: 10, minor: 0, release: 0 };
    };
    ShumwayObject.prototype.hasFlashPlayerVersion = function (version) {
        return true;
    };
    ShumwayObject.prototype.addLoadEvent = function (fn) {
        onDOMReady(fn);
    };
    ShumwayObject.prototype.addDomLoadEvent = function (fn) {
        onDOMReady(fn);
    };
    ShumwayObject.prototype.createSWF = function (attributes, params, id) {
        var element = document.getElementById(id);
        if (!element) {
            throw new Error('element ' + id + ' was not found');
        }
        var iframeElement = this._createSWF(undefined, id, undefined, undefined, undefined, params, attributes);
        element.parentNode.replaceChild(iframeElement, element);
        return iframeElement;
    };
    ShumwayObject.prototype.removeSWF = function (id) {
        var element = document.getElementById(id);
        element.parentNode.removeChild(element);
    };
    ShumwayObject.prototype.buildEmptySWF = function (swfVersion, width, height, framerate, avm2, background) {
        return URL.createObjectURL(createEmptySWFBlob(swfVersion, width, height, framerate, avm2, background));
    };
    ShumwayObject.prototype.createElement = function (name) {
        if (typeof name !== 'string' || name.toLowerCase() !== 'object') {
            return this._originalCreateElement.apply(document, arguments);
        }
        return this.createAndMonitorShadowObject();
    };
    ShumwayObject.prototype.getShumwayObject = function (idOrElement) {
        var element = typeof idOrElement === 'string' ? document.getElementById(idOrElement) : idOrElement;
        if (!element) {
            throw new Error('element ' + idOrElement + ' was not found');
        }
        return element.shumway;
    };
    ShumwayObject.prototype.getQueryParamValue = function (paramName) {
        if (!this._cachedQueryParams) {
            this._cachedQueryParams = parseQueryString(document.location.search);
        }
        return this._cachedQueryParams[paramName];
    };
    ShumwayObject.prototype.hack = function (scope, setNavigatorPlugins) {
        scope = scope || 'all';
        var self = this;
        document.createElement = function (name) {
            if (typeof name !== 'string' || name.toLowerCase() !== 'object') {
                return self._originalCreateElement.apply(document, arguments);
            }
            if (scope === 'all') {
                return self.createAndMonitorShadowObject();
            }
            else {
                return self._originalCreateElement.apply(document, arguments);
            }
        };
        var pluginName = 'Shockwave Flash';
        var mimeTypeName = 'application/x-shockwave-flash';
        if (setNavigatorPlugins && !window.navigator.plugins[pluginName]) {
            var mimeType = {
                description: "Shockwave Flash",
                suffixes: 'swf',
                type: mimeTypeName
            };
            window.navigator.mimeTypes[mimeTypeName] = mimeType;
            var plugin = {
                description: 'Shockwave Flash 10.0 r0 compatible',
                filename: 'shumway.js',
                length: 1,
                name: pluginName,
                '0': mimeType
            };
            mimeType.enabledPlugin = plugin;
            window.navigator.plugins[pluginName] = plugin;
        }
    };
    return ShumwayObject;
}());
var shuobject = new ShumwayObject();
// Exposed as the 'shumway' property in the Shumway iframe, contains:
// stage, flash namespace, and other Shumway utils.
var ShumwayBindings = /** @class */ (function () {
    function ShumwayBindings(iframeElement) {
        var gfxWindow = iframeElement.contentWindow.gfxWindow;
        var easelHost = gfxWindow.easelHost;
        easelHost.processFrame = this.processFrame.bind(this, iframeElement);
        easelHost.processFSCommand = this.processFSCommand.bind(this, iframeElement);
        var playerWindow = iframeElement.contentWindow.playerWindow;
        var externalInterfaceService = playerWindow.iframeExternalInterface;
        externalInterfaceService.processExternalCommand = processExternalCommand.bind(externalInterfaceService, iframeElement);
        this.sec = playerWindow.player.sec;
        this.stage = playerWindow.player.stage;
        this.Shumway = playerWindow.Shumway;
        this.flash = playerWindow.player.sec.flash;
        this.easelHost = easelHost;
        this.onFrame = null;
        this.onFSCommand = null;
    }
    ShumwayBindings.prototype.takeScreenshot = function (options) {
        options = options || {};
        var bounds = options.bounds || null;
        var stageContent = !!options.stageContent;
        var disableHidpi = !!options.disableHidpi;
        var easel = this.easelHost.easel;
        easel.render();
        return easel.screenShot(bounds, stageContent, disableHidpi);
    };
    ShumwayBindings.prototype.processFrame = function (iframeElement) {
        var onFrame = iframeElement.shumway.onFrame;
        if (onFrame) {
            onFrame();
        }
    };
    ShumwayBindings.prototype.processFSCommand = function (iframeElement, command, args) {
        var onFSCommand = iframeElement.shumway.onFSCommand;
        if (onFSCommand) {
            return onFSCommand(command, args);
        }
    };
    return ShumwayBindings;
}());
function createEmptySWFBlob(swfVersion, width, height, framerate, avm2, background) {
    var headerBytes = [0x46, 0x57, 0x53, swfVersion]; // 'FWS'
    var swfBody = [];
    // Encoding SWF dimensions
    var bitsPerSizeComponent = 15;
    var buffer = bitsPerSizeComponent, bufferSize = 5;
    buffer = (buffer << bitsPerSizeComponent);
    bufferSize += bitsPerSizeComponent;
    while (bufferSize > 8) {
        swfBody.push((buffer >> (bufferSize -= 8)) & 255);
    }
    buffer = (buffer << bitsPerSizeComponent) | (width * 20);
    bufferSize += bitsPerSizeComponent;
    while (bufferSize > 8) {
        swfBody.push((buffer >> (bufferSize -= 8)) & 255);
    }
    buffer = (buffer << bitsPerSizeComponent);
    bufferSize += bitsPerSizeComponent;
    while (bufferSize > 8) {
        swfBody.push((buffer >> (bufferSize -= 8)) & 255);
    }
    buffer = (buffer << bitsPerSizeComponent) | (height * 20);
    bufferSize += bitsPerSizeComponent;
    while (bufferSize > 8) {
        swfBody.push((buffer >> (bufferSize -= 8)) & 255);
    }
    if (bufferSize > 0) {
        swfBody.push((buffer << (8 - bufferSize)) & 255);
    }
    swfBody.push(((framerate - (framerate | 0)) * 255) | 0, framerate | 0);
    swfBody.push(1, 0); // frame count
    var attributesTagCode = (69 << 6) | 4;
    swfBody.push(attributesTagCode & 255, attributesTagCode >> 8, (avm2 ? 8 : 0), 0, 0, 0);
    if (background !== undefined) {
        var backgroundTagCode = (9 << 6) | 3;
        swfBody.push(backgroundTagCode & 255, backgroundTagCode >> 8, (background >> 16) & 255, (background >> 8) & 255, background & 255);
    }
    var frameTagCode = (1 << 6) | 0;
    swfBody.push(frameTagCode & 255, frameTagCode >> 8);
    swfBody.push(0, 0); // end
    var swfSize = swfBody.length + 8;
    var sizeBytes = [swfSize & 255, (swfSize >> 8) & 255, (swfSize >> 16) & 255, (swfSize >> 24) & 255];
    var blob = new Blob([new Uint8Array(headerBytes.concat(sizeBytes, swfBody))], { type: 'application/x-shockwave-flash' });
    return blob;
}
function combineUrl(baseUrl, url) {
    return new URL(url, baseUrl).href;
}
function getOrigin(url) {
    return new URL(url).origin;
}
function onDOMReady(callback) {
    if (document.readyState !== 'loading') {
        callback();
        return;
    }
    document.addEventListener('DOMContentLoaded', function loaded(e) {
        document.removeEventListener('DOMContentLoaded', loaded);
        callback();
    });
}
function getDocumentBase() {
    var baseElement = document.getElementsByTagName('base')[0];
    return baseElement ? baseElement.href : document.location.href;
}
function parseQueryString(qs) {
    if (!qs) {
        return {};
    }
    if (qs.charAt(0) == '?') {
        qs = qs.slice(1);
    }
    var values = qs.split('&');
    var obj = {};
    for (var i = 0; i < values.length; i++) {
        var kv = values[i].split('=');
        var key = kv[0], value = kv[1];
        obj[decodeURIComponent(key)] = decodeURIComponent(value);
    }
    return obj;
}
function fetchRemoteFile(data, target, origin) {
    function sendResponse(args) {
        args.type = 'shumwayFileLoadingResponse';
        args.sessionId = sessionId;
        target.postMessage(args, origin);
    }
    var sessionId = data.sessionId;
    var xhr = new XMLHttpRequest();
    xhr.open(data.method || 'GET', data.url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
        if (xhr.status !== 200) {
            sendResponse({ topic: 'error', error: 'XHR status: ' + xhr.status });
            return;
        }
        var data = new Uint8Array(xhr.response);
        sendResponse({ topic: 'progress', array: data, loaded: data.length, total: data.length });
        sendResponse({ topic: 'close' });
    };
    xhr.onerror = function () {
        sendResponse({ topic: 'error', error: 'XHR error' });
    };
    xhr.send(data.postData || null);
    sendResponse({ topic: 'open' });
}
// Initializes and performs external interface communication.
function processExternalCommand(iframe, command) {
    switch (command.action) {
        case 'init':
            var externalInterfaceService = this;
            iframe.__flash__registerCallback = function (functionName) {
                console.log('__flash__registerCallback: ' + functionName);
                this[functionName] = function () {
                    var args = Array.prototype.slice.call(arguments, 0);
                    console.log('__flash__callIn: ' + functionName);
                    var result = externalInterfaceService.onExternalCallback(functionName, args);
                    return window.eval(result);
                };
            };
            iframe.__flash__unregisterCallback = function (functionName) {
                console.log('__flash__unregisterCallback: ' + functionName);
                delete this[functionName];
            };
            if (window.__flash__toXML) {
                break;
            }
            window.__flash__toXML = function __flash__toXML(obj) {
                switch (typeof obj) {
                    case 'boolean':
                        return obj ? '<true/>' : '<false/>';
                    case 'number':
                        return '<number>' + obj + '</number>';
                    case 'object':
                        if (obj === null) {
                            return '<null/>';
                        }
                        if ('hasOwnProperty' in obj && obj.hasOwnProperty('length')) {
                            // array
                            var xml = '<array>';
                            for (var i = 0; i < obj.length; i++) {
                                xml += '<property id="' + i + '">' + __flash__toXML(obj[i]) + '</property>';
                            }
                            return xml + '</array>';
                        }
                        var xml = '<object>';
                        for (var key in obj) {
                            xml += '<property id="' + key + '">' + __flash__toXML(obj[key]) + '</property>';
                        }
                        return xml + '</object>';
                    case 'string':
                        return '<string>' + obj.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</string>';
                    case 'undefined':
                        return '<undefined/>';
                }
                throw new Error('impossible obj type');
            };
            window.__flash__eval = function (expr) {
                console.log('__flash__eval: ' + expr);
                // allowScriptAccess protects page from unwanted swf scripts,
                // we can execute script in the page context without restrictions.
                return window.eval(expr);
            };
            window.__flash__call = function (expr) {
                console.log('__flash__call (ignored): ' + expr);
            };
            break;
        case 'getId':
            command.result = iframe.id;
            break;
        case 'eval':
            command.result = window.__flash__eval(command.expression);
            break;
        case 'call':
            command.result = window.__flash__call(command.request);
            break;
        case 'register':
            iframe.__flash__registerCallback(command.functionName);
            break;
        case 'unregister':
            iframe.__flash__unregisterCallback(command.functionName);
            break;
    }
}
//# sourceMappingURL=swf-viewer.js.map
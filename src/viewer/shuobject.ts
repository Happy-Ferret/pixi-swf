///ts:ref=transportPeer
/// <reference path="./transportPeer.ts"/> ///ts:ref:generated
// Implements most of APIs from https://code.google.com/p/swfobject/wiki/api
class ShumwayObject {

  private _lastScriptElement: HTMLScriptElement;
  private _shumwayHome: string;
  // Checking if viewer is hosted remotely
  private _shumwayRemote: boolean;
  private _originalCreateElement = document.createElement;
  private _cachedQueryParams;
  private _enabledRemoteOrigins: any;
  public constructor() {
    // Using last loaded script director as a base for Shumway resources
    this._lastScriptElement = (document.body || document.getElementsByTagName('head')[0]).lastChild as HTMLScriptElement;
    this._shumwayHome = combineUrl(this._lastScriptElement.src, '.');
    // Checking if viewer is hosted remotely
    this._shumwayRemote = getOrigin(document.location.href) !== getOrigin(this._shumwayHome);
    this._enabledRemoteOrigins = null;
  }
  private setupRemote(origin) {
    if (!this._enabledRemoteOrigins) {
      window.addEventListener('message', (e) => {
        var data = e.data;
        if (typeof data !== 'object' || data === null || data.type !== 'shumwayFileLoading') {
          return;
        }
        if (!this._enabledRemoteOrigins[e.origin]) {
          return;
        }
        fetchRemoteFile(data, e.source, e.origin);
      });
      this._enabledRemoteOrigins = Object.create(null);
    }
    this._enabledRemoteOrigins[origin] = true;
  }

  // Creates Shumway iframe
  private _createSWF(swfUrl, id, width, height, flashvars, params, attributes): HTMLIFrameElement & { shumway: ShumwayBindings } {
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
      Object.keys(attributes).forEach((name) => {
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
      Object.keys(params).forEach((name) => {
        name = name.toLowerCase();
        if (name === 'flashvars') {
          if (!flashvars) {
            flashvars = parseQueryString(params[name]);
          }
        } else if (name === 'base') {
          // Base param, send as baseUrl in pluginParams below
          flashBase = combineUrl(getDocumentBase(), params[name]);
        }
        objectParams[name] = params[name];
      });
    }
    var movieParams = {};
    if (flashvars) {
      var flashvarsParts = [];
      Object.keys(flashvars).forEach((name) => {
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
    let load = (e) => {
      iframeElement.removeEventListener('load', load);
      iframeElement.contentWindow.postMessage({ type: 'pluginParams', flashParams: pluginParams }, '*');
    }
    iframeElement.addEventListener('load', load);
    return iframeElement as any;
  }

  // Replaces initial DOM element with Shumway iframe.
  private _embedSWF(element, swfUrl, id, width, height, flashvars, params, attributes, callbackFn) {
    var iframeElement = this._createSWF(swfUrl, id, width, height, flashvars, params, attributes);
    let load = (e) => {
      iframeElement.removeEventListener('load', load);
      if (this._shumwayRemote) {
        // It's not possible expose the external interface or internals of
        // the Shumway, because iframeElement.contentDocument is not available.
        if (callbackFn) {
          callbackFn({ success: true, id: iframeElement.id, ref: iframeElement });
        }
        return;
      }
      var contentDocument = iframeElement.contentDocument;
      let started = e => {
        contentDocument.removeEventListener('shumwaystarted', started, true);
        iframeElement.shumway = new ShumwayBindings(iframeElement);
        if (callbackFn) {
          callbackFn({ success: true, id: iframeElement.id, ref: iframeElement });
        }
      }
      contentDocument.addEventListener('shumwaystarted', started, true);
    }
    iframeElement.addEventListener('load', load);
    element.parentNode.replaceChild(iframeElement, element);
  }

  // Copies parameters/attributes from the DOM element and replaces it.
  private replaceBySWF(element, id, callbackFn) {
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
  }

  private createAndMonitorShadowObject() {
    var xObject = this._originalCreateElement.call(document, 'x-shu-object');
    var observer = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        var addedNodes = mutation.addedNodes;
        if (!addedNodes || addedNodes.length === 0) {
          break;
        }
        for (var i = 0; i < addedNodes.length; i++) {
          if (addedNodes[i] === xObject) {
            this.replaceBySWF(xObject, undefined, undefined);
            observer.disconnect();
            break;
          }
        }
      };
    });
    observer.observe(document, { childList: true, subtree: true });
    return xObject;
  }

  /**
   * Specifies the location of the Shumway base folder.
   */
  get shumwayHome() {
    return this._shumwayHome;
  }

  set shumwayHome(value) {
    this._shumwayHome = combineUrl(document.location.href, value);
  }

  /**
   * Specifies if Shumway shall take in account cross-domain policies.
   *
   * When true is set, SWF files will be requested by the main page, external
   * interface is disable and Shumway internal objects are not available.
   */
  get shumwayRemote() {
    return this._shumwayRemote;
  }

  set shumwayRemote(value) {
    this._shumwayRemote = !!value;
  }

  public registerObject(id, version, expressInstallSwfurl, callbackFn) {
    onDOMReady(() => {
      var element = document.getElementById(id);
      if (!element) {
        throw new Error('element ' + id + ' was not found');
      }
      this.replaceBySWF(element, id, callbackFn);
    });
  }
  public embedSWF(swfUrl, id, width, height, version, expressInstallSwfurl, flashvars, params, attributes, callbackFn) {
    onDOMReady(() => {
      var element = document.getElementById(id);
      if (!element) {
        throw new Error('element ' + id + ' was not found');
      }
      this._embedSWF(element, swfUrl, id, width, height, flashvars, params, attributes, callbackFn);
    });
  }
  public getObjectById(id) {
    return document.getElementById(id);
  }
  public getFlashPlayerVersion() {
    return { major: 10, minor: 0, release: 0 };
  }
  public hasFlashPlayerVersion(version) {
    return true;
  }
  public addLoadEvent(fn) {
    onDOMReady(fn);
  }
  public addDomLoadEvent(fn) {
    onDOMReady(fn);
  }
  public createSWF(attributes, params, id) {
    var element = document.getElementById(id);
    if (!element) {
      throw new Error('element ' + id + ' was not found');
    }
    var iframeElement = this._createSWF(undefined, id, undefined, undefined, undefined, params, attributes);
    element.parentNode.replaceChild(iframeElement, element);
    return iframeElement;
  }
  public removeSWF (id) {
    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
  }
  public buildEmptySWF (swfVersion, width, height, framerate, avm2, background) {
    return URL.createObjectURL(createEmptySWFBlob(swfVersion, width, height, framerate, avm2, background));
  }
  
  public createElement (name) {
    if (typeof name !== 'string' || name.toLowerCase() !== 'object') {
      return this._originalCreateElement.apply(document, arguments);
    }
    return this.createAndMonitorShadowObject();
  }
  public getShumwayObject(idOrElement) {
    var element = typeof idOrElement === 'string' ? document.getElementById(idOrElement) : idOrElement;
    if (!element) {
      throw new Error('element ' + idOrElement + ' was not found');
    }
    return element.shumway;
  }
  public getQueryParamValue(paramName) {
    if (!this._cachedQueryParams) {
      this._cachedQueryParams = parseQueryString(document.location.search);
    }
    return this._cachedQueryParams[paramName];
  }
  public hack(scope, setNavigatorPlugins) {
    scope = scope || 'all';
    let self = this;
    document.createElement = function (name) {
      if (typeof name !== 'string' || name.toLowerCase() !== 'object') {
        return self._originalCreateElement.apply(document, arguments);
      }
      if (scope === 'all') {
        return self.createAndMonitorShadowObject();
      } else {
        return self._originalCreateElement.apply(document, arguments);
      }
    };
    var pluginName = 'Shockwave Flash';
    var mimeTypeName = 'application/x-shockwave-flash';
    if (setNavigatorPlugins && !window.navigator.plugins[pluginName]) {
      var mimeType: any = {
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
  }
  ua: {
    w3: true,
    pv: [10, 0, 0]
  }
}

var shuobject = new ShumwayObject();


interface Window {
  __flash__toXML: (obj: any) => string;
  __flash__eval: (exp: any) => void;
  __flash__call: (exp: any) => void;
  eval: (...any) => void;
}

// Exposed as the 'shumway' property in the Shumway iframe, contains:
// stage, flash namespace, and other Shumway utils.
class ShumwayBindings {
  public sec: any;
  public stage: any;
  public Shumway: any;
  public flash: any;
  public easelHost: any;
  public onFrame: any;
  public onFSCommand: any;

  constructor(iframeElement: HTMLIFrameElement & any) {
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

  public takeScreenshot(options) {
    options = options || {};
    var bounds = options.bounds || null;
    var stageContent = !!options.stageContent;
    var disableHidpi = !!options.disableHidpi;

    var easel = this.easelHost.easel;
    easel.render();
    return easel.screenShot(bounds, stageContent, disableHidpi);
  }
  private processFrame(iframeElement) {
    var onFrame = iframeElement.shumway.onFrame;
    if (onFrame) {
      onFrame();
    }
  }
  private processFSCommand(iframeElement, command, args) {
    var onFSCommand = iframeElement.shumway.onFSCommand;
    if (onFSCommand) {
      return onFSCommand(command, args);
    }
  }
}

function createEmptySWFBlob(swfVersion, width, height, framerate, avm2, background) {
  var headerBytes = [0x46, 0x57, 0x53, swfVersion]; // 'FWS'
  var swfBody = [];

  // Encoding SWF dimensions
  var bitsPerSizeComponent = 15;
  var buffer = bitsPerSizeComponent, bufferSize = 5;
  buffer = (buffer << bitsPerSizeComponent); bufferSize += bitsPerSizeComponent;
  while (bufferSize > 8) {
    swfBody.push((buffer >> (bufferSize -= 8)) & 255);
  }
  buffer = (buffer << bitsPerSizeComponent) | (width * 20); bufferSize += bitsPerSizeComponent;
  while (bufferSize > 8) {
    swfBody.push((buffer >> (bufferSize -= 8)) & 255);
  }
  buffer = (buffer << bitsPerSizeComponent); bufferSize += bitsPerSizeComponent;
  while (bufferSize > 8) {
    swfBody.push((buffer >> (bufferSize -= 8)) & 255);
  }
  buffer = (buffer << bitsPerSizeComponent) | (height * 20); bufferSize += bitsPerSizeComponent;
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
    swfBody.push(backgroundTagCode & 255, backgroundTagCode >> 8,
      (background >> 16) & 255, (background >> 8) & 255, background & 255);
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
              for (let i = 0; i < obj.length; i++) {
                xml += '<property id="' + i + '">' + __flash__toXML(obj[i]) + '</property>';
              }
              return xml + '</array>';
            }
            var xml = '<object>';
            for (let key in obj) {
              xml += '<property id="' + key + '">' + __flash__toXML(obj[key]) + '</property>';
            }
            return xml + '</object>';
          case 'string':
            return '<string>' + obj.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</string>';
          case 'undefined':
            return '<undefined/>';
        }
        throw new Error('impossible obj type')
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
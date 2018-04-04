/*
 * Copyright 2013 Mozilla Foundation
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

var release = false;

function parseQueryString(qs) {
    if (!qs)
        return {};

    if (qs.charAt(0) == '?')
        qs = qs.slice(1);

    var values = qs.split('&');
    var obj = {};
    for (var i = 0; i < values.length; i++) {
        var kv = values[i].split('=');
        var key = kv[0], value = kv[1];
        obj[decodeURIComponent(key)] = decodeURIComponent(value);
    }

    return obj;
}

function getPluginParams() {
    var params = parseQueryString(window.location.search);
    return {
        baseUrl: params.base || document.location.href,
        url: params.swf,
        movieParams: {},
        objectParams: {},
        compilerSettings: {
            sysCompiler: true,
            appCompiler: true,
            verifier: true,
            forceHidpi: (typeof params.forceHidpi === "undefined") ? false : !!params.forceHidpi
        }
    };
}

function runViewer(params) {
    var easel = createEasel();
    var easelHost = createEaselHost(params.recordingLimit);
    var flashParams = {
        empty: params.empty,
        url: params.url,
        baseUrl: params.baseUrl || params.url,
        movieParams: params.movieParams || {},
        objectParams: params.objectParams || {},
        compilerSettings: params.compilerSettings || {
            sysCompiler: true,
            appCompiler: true,
            verifier: true
        },
        isRemote: params.isRemote,
        bgcolor: 0x00ffffff,
        displayParameters: easel.getDisplayParameters()
    };
    runSwfPlayer(flashParams, null);
}

function waitForParametersMessage(e) {
    if (e.data && typeof e.data === 'object' && e.data.type === 'pluginParams') {
        window.removeEventListener('message', waitForParametersMessage);
        runViewer(e.data.flashParams);
    }
}

var playerReady = new Promise(function (resolve) {
    function iframeLoaded() {
        if (--iframesToLoad > 0) {
            return;
        }
        resolve();
    }

    // var iframesToLoad = 2;
    var iframesToLoad = 0;
    iframeLoaded();
    //document.getElementById('gfxIframe').addEventListener('load', iframeLoaded);
    // document.getElementById('playerIframe').addEventListener('load', iframeLoaded);
});

playerReady.then(function () {
    var flashParams = getPluginParams();
    if (!flashParams.url) {
        // no movie url provided -- waiting for parameters via postMessage
        window.addEventListener('message', waitForParametersMessage);
    } else {
        runViewer(flashParams);
    }
});


// from viewerGfx.js

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

var easel;

function createEasel() {
    var Stage = Shumway.GFX.Stage;
    var Easel = Shumway.GFX.Easel;
    var Canvas2DRenderer = Shumway.GFX.Canvas2DRenderer;

    easel = new Easel(document.getElementById("easelContainer"));
    easel.toggleOption("cacheShapes");
    easel.startRendering();
    return easel;
}

var easelHost;

function createEaselHost(recordingLimit) {
    var peer = new PandaTransprotPeer('pandaShumway', 'gfx');
    if (recordingLimit) {
        easelHost = new Shumway.GFX.Test.RecordingEaselHost(easel, peer, recordingLimit);
    } else {
        easelHost = new Shumway.GFX.Window.WindowEaselHost(easel, peer);
    }
    return easelHost;
}

/// from viewerPlayer.js


/*
 * Copyright 2013 Mozilla Foundation
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

var viewerPlayerglobalInfo = {
    abcs: "../build/playerglobal/playerglobal.abcs",
    catalog: "../build/playerglobal/playerglobal.json"
};

var builtinPath = "../build/libs/builtin.abc";

window.print = function (msg) {
    console.log(msg);
};

Shumway.Telemetry.instance = {
    reportTelemetry: function (data) {
    }
};

var player;

var iframeExternalInterface = {
    onExternalCallback: null,
    processExternalCommand: null,

    get enabled() {
        return !!this.processExternalCommand;
    },

    initJS: function (callback) {
        this.processExternalCommand({action: 'init'});
        this.onExternalCallback = function (functionName, args) {
            return callback(functionName, args);
        };
    },

    registerCallback: function (functionName) {
        var cmd = {action: 'register', functionName: functionName, remove: false};
        this.processExternalCommand(cmd);
    },

    unregisterCallback: function (functionName) {
        var cmd = {action: 'register', functionName: functionName, remove: true};
        this.processExternalCommand(cmd);
    },

    eval: function (expression) {
        var cmd = {action: 'eval', expression: expression};
        this.processExternalCommand(cmd);
        return cmd.result;
    },

    call: function (request) {
        var cmd = {action: 'call', request: request};
        this.processExternalCommand(cmd);
        return cmd.result;
    },

    getId: function () {
        var cmd = {action: 'getId'};
        this.processExternalCommand(cmd);
        return cmd.result;
    }
};
var securityDomain = new Shumway.flash.system.SecurityDomain();
function runSwfPlayer(flashParams, settings) {
    if (settings) {
        Shumway.Settings.setSettings(settings);
    }
    var compilerSettings = flashParams.compilerSettings;
    var asyncLoading = true;
    var baseUrl = flashParams.baseUrl;
    var movieUrl = flashParams.url;
    // Shumway.SystemResourcesLoadingService.instance =
    //   new Shumway.Player.BrowserSystemResourcesLoadingService(builtinPath, viewerPlayerglobalInfo);
    

    function runSWF(file, buffer, baseUrl) {
        var movieParams = flashParams.movieParams;
        var objectParams = flashParams.objectParams;

        var peer = new PandaTransprotPeer('pandaShumway', 'player');
        var gfxService = new Shumway.Player.Window.WindowGFXService(securityDomain, peer);
        player = new Shumway.Player.Player(securityDomain, gfxService);
        player.defaultStageColor = flashParams.bgcolor;
        player.movieParams = movieParams;
        player.stageAlign = (objectParams && (objectParams.salign || objectParams.align)) || '';
        player.stageScale = (objectParams && objectParams.scale) || 'showall';
        player.displayParameters = flashParams.displayParameters;

        player.pageUrl = baseUrl;

        if (buffer) {
            player.load(file, buffer);
        }
        else {
            player.start(objectParams);
        }

        var parentDocument = window.parent.document;
        var event = parentDocument.createEvent('CustomEvent');
        event.initCustomEvent('shumwaystarted', true, true, null);
        parentDocument.dispatchEvent(event);
    }

    Shumway.FileLoadingService.instance = flashParams.isRemote ?
        new RemoteFileLoadingService() :
        new Shumway.Player.BrowserFileLoadingService();
    Shumway.FileLoadingService.instance.init(baseUrl);

    if (flashParams.empty) {
        runSWF(movieUrl, undefined, baseUrl);
    } else {
        new Shumway.BinaryFileReader(movieUrl).readAll(null, function (buffer, error) {
            if (!buffer) {
                throw "Unable to open the file " + file + ": " + error;
            }
            runSWF(movieUrl, buffer, baseUrl);
        });
    }
}

function RemoteFileLoadingService() {
    this._baseUrl = null;
    this._nextSessionId = 1;
    this._sessions = [];
}

RemoteFileLoadingService.prototype = {
    init: function (baseUrl) {
        this._baseUrl = baseUrl;
        var service = this;
        window.addEventListener('message', function (e) {
            var data = e.data;
            if (typeof data !== 'object' || data === null ||
                data.type !== 'shumwayFileLoadingResponse') {
                return;
            }
            var session = service._sessions[data.sessionId];
            if (session) {
                service._notifySession(session, data);
            }
        });
    },

    _notifySession: function (session, args) {
        var sessionId = args.sessionId;
        switch (args.topic) {
            case "open":
                session.onopen();
                break;
            case "close":
                session.onclose();
                this._sessions[sessionId] = null;
                console.log('Session #' + sessionId + ': closed');
                break;
            case "error":
                session.onerror && session.onerror(args.error);
                break;
            case "progress":
                console.log('Session #' + sessionId + ': loaded ' + args.loaded + '/' + args.total);
                var data = args.array;
                if (!(data instanceof Uint8Array)) {
                    data = new Uint8Array(data);
                }
                session.onprogress && session.onprogress(data, {bytesLoaded: args.loaded, bytesTotal: args.total});
                break;
        }
    },

    createSession: function () {
        var sessionId = this._nextSessionId++;
        var service = this;
        var session = {
            open: function (request) {
                var path = service.resolveUrl(request.url);
                console.log('Session #' + sessionId + ': loading ' + path);
                window.parent.parent.postMessage({
                    type: 'shumwayFileLoading', url: path, method: request.method,
                    mimeType: request.mimeType, postData: request.data,
                    checkPolicyFile: request.checkPolicyFile, sessionId: sessionId
                }, '*');
            },
            close: function () {
                if (service._sessions[sessionId]) {
                    // TODO send abort
                }
            }
        };
        return (this._sessions[sessionId] = session);
    },

    resolveUrl: function (url) {
        return new URL(url, this._baseUrl).href;
    },

    navigateTo: function (url, target) {
        window.open(this.resolveUrl(url), target || '_blank');
    }
};


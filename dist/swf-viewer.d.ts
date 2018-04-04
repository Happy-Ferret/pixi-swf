interface ITransportPeer {
    onAsyncMessage: (msg: any) => void;
    onSyncMessage: (msg: any) => any;
    postAsyncMessage(msg: any, transfers?: any[]): void;
    sendSyncMessage(msg: any, transfers?: any[]): any;
}
declare class MozTransprotPeer implements ITransportPeer {
    window: Window;
    target: Window;
    private _name;
    constructor(window: Window, target: Window, name: string);
    onAsyncMessage: (msg: any) => void;
    onSyncMessage: (msg: any) => any;
    postAsyncMessage(msg: any, transfers?: any[]): void;
    sendSyncMessage(msg: any, transfers?: any[]): any;
}
declare class PandaTransprotPeer implements ITransportPeer {
    private static _aloneHash;
    private static _counter;
    private _another;
    private _syncCallBack;
    private _name;
    constructor(key: string, name: string);
    onAsyncMessage: (msg: any) => void;
    private isPandaWrappedMessageFromAnother(msg);
    postAsyncMessage(msg: any, transfers?: any[]): void;
    onSyncMessage: (msg: any) => any;
    sendSyncMessage(msg: any, transfers?: any[]): any;
}
declare class PandaWrappedMessage {
    payload: any;
    from: string;
    constructor(payload: any, from: string);
}
declare class ShumwayObject {
    private _lastScriptElement;
    private _shumwayHome;
    private _shumwayRemote;
    private _originalCreateElement;
    private _cachedQueryParams;
    private _enabledRemoteOrigins;
    constructor();
    private setupRemote(origin);
    private _createSWF(swfUrl, id, width, height, flashvars, params, attributes);
    private _embedSWF(element, swfUrl, id, width, height, flashvars, params, attributes, callbackFn);
    private replaceBySWF(element, id, callbackFn);
    private createAndMonitorShadowObject();
    /**
     * Specifies the location of the Shumway base folder.
     */
    shumwayHome: string;
    /**
     * Specifies if Shumway shall take in account cross-domain policies.
     *
     * When true is set, SWF files will be requested by the main page, external
     * interface is disable and Shumway internal objects are not available.
     */
    shumwayRemote: boolean;
    registerObject(id: any, version: any, expressInstallSwfurl: any, callbackFn: any): void;
    embedSWF(swfUrl: any, id: any, width: any, height: any, version: any, expressInstallSwfurl: any, flashvars: any, params: any, attributes: any, callbackFn: any): void;
    getObjectById(id: any): HTMLElement;
    getFlashPlayerVersion(): {
        major: number;
        minor: number;
        release: number;
    };
    hasFlashPlayerVersion(version: any): boolean;
    addLoadEvent(fn: any): void;
    addDomLoadEvent(fn: any): void;
    createSWF(attributes: any, params: any, id: any): HTMLIFrameElement & {
        shumway: ShumwayBindings;
    };
    removeSWF(id: any): void;
    buildEmptySWF(swfVersion: any, width: any, height: any, framerate: any, avm2: any, background: any): string;
    createElement(name: any): any;
    getShumwayObject(idOrElement: any): any;
    getQueryParamValue(paramName: any): any;
    hack(scope: any, setNavigatorPlugins: any): void;
    ua: {
        w3: true;
        pv: [10, 0, 0];
    };
}
declare var shuobject: ShumwayObject;
interface Window {
    __flash__toXML: (obj: any) => string;
    __flash__eval: (exp: any) => void;
    __flash__call: (exp: any) => void;
    eval: (...any) => void;
}
declare class ShumwayBindings {
    sec: any;
    stage: any;
    Shumway: any;
    flash: any;
    easelHost: any;
    onFrame: any;
    onFSCommand: any;
    constructor(iframeElement: HTMLIFrameElement & any);
    takeScreenshot(options: any): any;
    private processFrame(iframeElement);
    private processFSCommand(iframeElement, command, args);
}
declare function createEmptySWFBlob(swfVersion: any, width: any, height: any, framerate: any, avm2: any, background: any): Blob;
declare function combineUrl(baseUrl: any, url: any): string;
declare function getOrigin(url: any): string;
declare function onDOMReady(callback: any): void;
declare function getDocumentBase(): string;
declare function parseQueryString(qs: any): {};
declare function fetchRemoteFile(data: any, target: any, origin: any): void;
declare function processExternalCommand(iframe: any, command: any): void;

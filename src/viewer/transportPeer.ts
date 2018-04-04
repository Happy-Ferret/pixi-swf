interface ITransportPeer {
    onAsyncMessage: (msg: any) => void;
    onSyncMessage: (msg: any) => any;

    postAsyncMessage(msg: any, transfers?: any[]): void;

    sendSyncMessage(msg: any, transfers?: any[]): any;
}

class MozTransprotPeer implements ITransportPeer {
    public window: Window;
    public target: Window;
    private _name: string;

    constructor(window: Window, target: Window, name: string) {
        this.target = target;
        this.window = window;
        this._name = name;
    }

    set onAsyncMessage(callback: (msg: any) => void) {
        this.window.addEventListener('message', (e) => {
            Promise.resolve(e.data).then((msg) => { // delay
                // console.log('received async', this._name, msg);
                callback(msg);
            });
        });
    }

    set onSyncMessage(callback: (msg: any) => any) {
        this.window.addEventListener('syncmessage', (e) => {
            let wrappedMessage = (<any>e).detail;
            let msg: any = wrappedMessage.msg;
            // console.log('received sync', this._name, msg);
            wrappedMessage.result = callback(msg);
        });
    }


    postAsyncMessage(msg: any, transfers?: any[]): void {
        //console.log('sending async', this._name, msg, transfers);
        this.target.postMessage(msg, '*', transfers);
    }

    sendSyncMessage(msg: any, transfers?: any[]): any {
        //console.log('sending sync', this._name, msg, transfers);
        let event = this.target.document.createEvent('CustomEvent');
        let wrappedMessage = {
            msg: msg,
            result: undefined as any
        };
        event.initCustomEvent('syncmessage', false, false, wrappedMessage);
        this.target.dispatchEvent(event);
        return wrappedMessage.result;
    }
}


class PandaTransprotPeer implements ITransportPeer {
    private static _aloneHash: { [key: string]: PandaTransprotPeer } = {};
    private static _counter: number = 0;
    private _another: PandaTransprotPeer = null;
    private _syncCallBack: (msg: any) => any;
    private _name: string = null;

    constructor(key: string, name: string) {
        this._name = name;
        console.log('PandaTransprotPeer::ctor, key:', key, 'name', this._name, 'counter:', PandaTransprotPeer._counter);
        PandaTransprotPeer._counter++;
        let another = PandaTransprotPeer._aloneHash[key];
        if (another) {
            another._another = this;
            this._another = another;
            delete PandaTransprotPeer._aloneHash[key];
            console.log('PandaTransprotPeer::connected');
        } else {
            PandaTransprotPeer._aloneHash[key] = this;
            console.log('PandaTransprotPeer::created alone');
        }
    }

    set onAsyncMessage(callback: (msg: any) => void) {
        window.addEventListener('message', (e) => {
            let rawMessage = e.data;
            if (this.isPandaWrappedMessageFromAnother(rawMessage)) {
                let msg = rawMessage.payload;
                Promise.resolve().then(() => { // delay
                    callback(msg);
                });
            }
        });
    }

    private isPandaWrappedMessageFromAnother(msg: any): msg is PandaWrappedMessage {
        if ('from' in msg && 'payload' in msg) {
            if (this._another) {
                if (msg.from == this._another._name) {
                    return true;
                }
            } else {
                console.log(this._name, 'received PandaWrappedMessage from', msg.from, 'but has no this._another link');
            }
        }
        return false;
    }

    postAsyncMessage(msg: any, transfers?: any[]): void {
        //console.log('sending async', this._name, msg, transfers);
        let wrapped = new PandaWrappedMessage(msg, this._name);
        window.postMessage(wrapped, '*', transfers);
    }

    set onSyncMessage(callback: (msg: any) => any) {
        this._syncCallBack = callback;
    }

    sendSyncMessage(msg: any, transfers?: any[]): any {
        //console.log('sending sync', this._name, msg, transfers);
        let callback = this._another ? this._another._syncCallBack : null;
        if (callback) {
            return callback(msg);
        }
    }
}

class PandaWrappedMessage {
    public payload: any;
    public from: string;
    public constructor(payload: any, from: string) {
        this.payload = payload;
        this.from = from;
    }
}
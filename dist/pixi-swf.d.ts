declare let jsGlobal: any;
declare let inBrowser: boolean;
declare let inFirefox: boolean;
declare let putstr: any;
/** @define {boolean} */ declare let release: boolean;
/** @define {boolean} */ declare let profile: boolean;
declare let dump: (message: string) => void;
declare function dumpLine(line: string): void;
declare let START_TIME: number;
interface String {
    padRight(c: string, n: number): string;
    padLeft(c: string, n: number): string;
    endsWith(s: string): boolean;
}
interface Function {
    boundTo: boolean;
}
interface Array<T> {
    runtimeId: number;
}
interface Math {
    imul(a: number, b: number): number;
    /**
     * Returns the number of leading zeros of a number.
     * @param x A numeric expression.
     */
    clz32(x: number): number;
}
declare module Shumway {
    let version: string;
    let build: string;
}
declare module Shumway {
    const enum CharacterCodes {
        _0 = 48,
        _1 = 49,
        _2 = 50,
        _3 = 51,
        _4 = 52,
        _5 = 53,
        _6 = 54,
        _7 = 55,
        _8 = 56,
        _9 = 57,
    }
    /**
     * The buffer length required to contain any unsigned 32-bit integer.
     */
    /** @const */ let UINT32_CHAR_BUFFER_LENGTH: number;
    /** @const */ let UINT32_MAX: number;
    /** @const */ let UINT32_MAX_DIV_10: number;
    /** @const */ let UINT32_MAX_MOD_10: number;
    function isString(value: any): boolean;
    function isFunction(value: any): boolean;
    function isNumber(value: any): boolean;
    function isInteger(value: any): boolean;
    function isArray(value: any): boolean;
    function isNumberOrString(value: any): boolean;
    function isObject(value: any): boolean;
    function toNumber(x: any): number;
    function isNumericString(value: string): boolean;
    /**
     * Whether the specified |value| is a number or the string representation of a number.
     */
    function isNumeric(value: any): boolean;
    /**
     * Whether the specified |value| is an unsigned 32 bit number expressed as a number
     * or string.
     */
    function isIndex(value: any): boolean;
    function isNullOrUndefined(value: any): boolean;
    function argumentsToString(args: IArguments): string;
    module Debug {
        function error(message: string): void;
        function assert(condition: any, message?: any): void;
        function assertUnreachable(msg: string): void;
        function assertNotImplemented(condition: boolean, message: string): void;
        function warning(message: any, arg1?: any, arg2?: any): void;
        function warnCounts(): string;
        function notImplemented(message: string): void;
        function dummyConstructor(message: string): void;
        function abstractMethod(message: string): void;
        function somewhatImplemented(message: string): void;
        function unexpected(message?: any): void;
        function unexpectedCase(message?: any): void;
    }
    function getTicks(): number;
    interface MapObject<T> {
        [name: string]: T;
    }
    module ArrayUtilities {
        /**
         * Pops elements from a source array into a destination array. This avoids
         * allocations and should be faster. The elements in the destination array
         * are pushed in the same order as they appear in the source array:
         *
         * popManyInto([1, 2, 3], 2, dst) => dst = [2, 3]
         */
        function popManyInto(src: any[], count: number, dst: any[]): void;
        function popMany<T>(array: T[], count: number): T[];
        /**
         * Just deletes several array elements from the end of the list.
         */
        function popManyIntoVoid(array: any[], count: number): void;
        function pushMany(dst: any[], src: any[]): void;
        function top(array: any[]): any;
        function last(array: any[]): any;
        function peek(array: any[]): any;
        function indexOf<T>(array: T[], value: T): number;
        function equals<T>(a: T[], b: T[]): boolean;
        function pushUnique<T>(array: T[], value: T): number;
        function unique<T>(array: T[]): T[];
        function copyFrom(dst: any[], src: any[]): void;
        interface TypedArray extends ArrayLike<number> {
            buffer: ArrayBuffer;
            length: number;
            set: (array: ArrayLike<number>, offset?: number) => void;
            subarray: (begin: number, end?: number) => TypedArray;
        }
        /**
         * Makes sure that a typed array has the requested capacity. If required, it creates a new
         * instance of the array's class with a power-of-two capacity at least as large as required.
         */
        function ensureTypedArrayCapacity<T extends TypedArray>(array: T, capacity: number): T;
        function memCopy<T extends TypedArray>(destination: T, source: T, doffset?: number, soffset?: number, length?: number): void;
        interface IDataDecoder {
            onData: (data: Uint8Array) => void;
            onError: (e: any) => void;
            push(data: Uint8Array): void;
            close(): void;
        }
    }
    module ObjectUtilities {
        function boxValue(value: any): any;
        function toKeyValueArray(object: any): any[][];
        function isPrototypeWriteable(object: Object): boolean;
        function hasOwnProperty(object: Object, name: string): boolean;
        function propertyIsEnumerable(object: Object, name: string): boolean;
        /**
         * Returns a property descriptor for the own or inherited property with the given name, or
         * null if one doesn't exist.
         */
        function getPropertyDescriptor(object: Object, name: string): PropertyDescriptor;
        function hasOwnGetter(object: Object, name: string): boolean;
        function getOwnGetter(object: Object, name: string): () => any;
        function hasOwnSetter(object: Object, name: string): boolean;
        function createMap<T>(): MapObject<T>;
        function createArrayMap<T>(): MapObject<T>;
        function defineReadOnlyProperty(object: Object, name: string, value: any): void;
        function copyProperties(object: any, template: any): void;
        function copyOwnProperties(object: any, template: any): void;
        function copyOwnPropertyDescriptors(object: Object, template: Object, filter?: (name: string) => boolean, overwrite?: boolean, makeWritable?: boolean): void;
        function copyPropertiesByList(object: any, template: any, propertyList: string[]): void;
        function defineNonEnumerableGetter(obj: any, name: any, getter: any): void;
        function defineNonEnumerableProperty(obj: any, name: any, value: any): void;
    }
    module FunctionUtilities {
        function makeForwardingGetter(target: string): () => any;
        function makeForwardingSetter(target: string): (a: any) => void;
    }
    module StringUtilities {
        function repeatString(c: string, n: number): string;
        function memorySizeToString(value: number): string;
        /**
         * Returns a reasonably sized description of the |value|, to be used for debugging purposes.
         */
        function toSafeString(value: any): string;
        function toSafeArrayString(array: any): string;
        function utf8decode(str: string): Uint8Array;
        function utf8encode(bytes: Uint8Array): string;
        function base64EncodeBytes(bytes: Uint8Array): string;
        /**
         * Decodes the result of encoding with base64EncodeBytes, but not necessarily any other
         * base64-encoded data. Note that this also doesn't do any error checking.
         */
        function decodeRestrictedBase64ToBytes(encoded: string): Uint8Array;
        function escapeString(str: string): string;
        /**
         * Workaround for max stack size limit.
         */
        function fromCharCodeArray(buffer: Uint8Array): string;
        function variableLengthEncodeInt32(n: number): string;
        function toEncoding(n: number): string;
        function fromEncoding(c: number): number;
        function variableLengthDecodeInt32(s: string): number;
        function trimMiddle(s: string, maxLength: number): string;
        function multiple(s: string, count: number): string;
        function indexOfAny(s: string, chars: string[], position: number): number;
        /**
         * The concatN() functions concatenate multiple strings in a way that
         * avoids creating intermediate strings, unlike String.prototype.concat().
         *
         * Note that these functions don't have identical behaviour to using '+',
         * because they will ignore any arguments that are |undefined| or |null|.
         * This usually doesn't matter.
         */
        function concat3(s0: any, s1: any, s2: any): string;
        function concat4(s0: any, s1: any, s2: any, s3: any): string;
        function concat9(s0: any, s1: any, s2: any, s3: any, s4: any, s5: any, s6: any, s7: any, s8: any): string;
    }
    module HashUtilities {
        function hashBytesTo32BitsMD5(data: Uint8Array, offset: number, length: number): number;
        function mixHash(a: number, b: number): number;
    }
    /**
     * An extremely naive cache with a maximum size.
     * TODO: LRU
     */
    class Cache {
        private _data;
        private _size;
        private _maxSize;
        constructor(maxSize: number);
        get(key: any): any;
        set(key: any, value: any): boolean;
    }
    /**
     * Marsaglia's algorithm, adapted from V8. Use this if you want a deterministic random number.
     */
    class Random {
        private static _state;
        static seed(seed: number): void;
        static reset(): void;
        static next(): number;
    }
    /**
     * This should only be called if you need fake time.
     */
    function installTimeWarper(): void;
    interface IReferenceCountable {
        _referenceCount: number;
        _addReference(): void;
        _removeReference(): void;
    }
    class WeakList<T extends IReferenceCountable> {
        private _map;
        private _newAdditions;
        private _list;
        private _id;
        constructor();
        clear(): void;
        push(value: T): void;
        remove(value: T): void;
        forEach(callback: (value: T) => void): void;
        readonly length: number;
    }
    module NumberUtilities {
        function pow2(exponent: number): number;
        function clamp(value: number, min: number, max: number): number;
        /**
         * Rounds *.5 to the nearest even number.
         * See https://en.wikipedia.org/wiki/Rounding#Round_half_to_even for details.
         */
        function roundHalfEven(value: number): number;
        /**
         * Rounds *.5 up on even occurrences, down on odd occurrences.
         * See https://en.wikipedia.org/wiki/Rounding#Alternating_tie-breaking for details.
         */
        function altTieBreakRound(value: number, even: boolean): number;
        function epsilonEquals(value: number, other: number): boolean;
    }
    const enum Numbers {
        MaxU16 = 65535,
        MaxI16 = 32767,
        MinI16 = -32768,
    }
    module IntegerUtilities {
        let i8: Int8Array;
        let u8: Uint8Array;
        let i32: Int32Array;
        let f32: Float32Array;
        let f64: Float64Array;
        let nativeLittleEndian: boolean;
        /**
         * Convert a float into 32 bits.
         */
        function floatToInt32(v: number): number;
        /**
         * Convert 32 bits into a float.
         */
        function int32ToFloat(i: number): number;
        /**
         * Swap the bytes of a 16 bit number.
         */
        function swap16(i: number): number;
        /**
         * Swap the bytes of a 32 bit number.
         */
        function swap32(i: number): number;
        /**
         * Converts a number to s8.u8 fixed point representation.
         */
        function toS8U8(v: number): number;
        /**
         * Converts a number from s8.u8 fixed point representation.
         */
        function fromS8U8(i: number): number;
        /**
         * Round trips a number through s8.u8 conversion.
         */
        function clampS8U8(v: number): number;
        /**
         * Converts a number to signed 16 bits.
         */
        function toS16(v: number): number;
        function bitCount(i: number): number;
        function ones(i: number): number;
        function trailingZeros(i: number): number;
        function getFlags(i: number, flags: string[]): string;
        function isPowerOfTwo(x: number): boolean;
        function roundToMultipleOfFour(x: number): number;
        function nearestPowerOfTwo(x: number): number;
        function roundToMultipleOfPowerOfTwo(i: number, powerOfTwo: number): number;
        function toHEX(i: number): string;
    }
    const enum LogLevel {
        Error = 1,
        Warn = 2,
        Debug = 4,
        Log = 8,
        Info = 16,
        All = 31,
    }
    class IndentingWriter {
        static PURPLE: string;
        static YELLOW: string;
        static GREEN: string;
        static RED: string;
        static BOLD_RED: string;
        static ENDC: string;
        static logLevel: LogLevel;
        private static _consoleOut;
        private static _consoleOutNoNewline;
        private _tab;
        private _padding;
        private _suppressOutput;
        private _out;
        private _outNoNewline;
        suppressOutput: boolean;
        constructor(suppressOutput?: boolean, out?: any);
        write(str?: string, writePadding?: boolean): void;
        writeLn(str?: string): void;
        writeObject(str?: string, object?: Object): void;
        writeTimeLn(str?: string): void;
        writeComment(str: string): void;
        writeLns(str: string): void;
        errorLn(str: string): void;
        warnLn(str: string): void;
        debugLn(str: string): void;
        logLn(str: string): void;
        infoLn(str: string): void;
        yellowLn(str: string): void;
        greenLn(str: string): void;
        boldRedLn(str: string): void;
        redLn(str: string): void;
        purpleLn(str: string): void;
        colorLn(color: string, str: string): void;
        redLns(str: string): void;
        colorLns(color: string, str: string): void;
        enter(str: string): void;
        leaveAndEnter(str: string): void;
        leave(str?: string): void;
        indent(): void;
        outdent(): void;
        writeArray(arr: any[], detailed?: boolean, noNumbers?: boolean): void;
    }
    class CircularBuffer {
        index: number;
        start: number;
        array: Array<number>;
        _size: number;
        _mask: number;
        constructor(Type: any, sizeInBits?: number);
        get(i: number): any;
        forEachInReverse(visitor: any): void;
        write(value: any): void;
        isFull(): boolean;
        isEmpty(): boolean;
        reset(): void;
    }
    class ColorStyle {
        static TabToolbar: string;
        static Toolbars: string;
        static HighlightBlue: string;
        static LightText: string;
        static ForegroundText: string;
        static Black: string;
        static VeryDark: string;
        static Dark: string;
        static Light: string;
        static Grey: string;
        static DarkGrey: string;
        static Blue: string;
        static Purple: string;
        static Pink: string;
        static Red: string;
        static Orange: string;
        static LightOrange: string;
        static Green: string;
        static BlueGrey: string;
        private static _randomStyleCache;
        private static _nextStyle;
        static randomStyle(): string;
        private static _gradient;
        static gradientColor(value: number): string;
        static contrastStyle(rgb: string): string;
        static reset(): void;
    }
    interface UntypedBounds {
        xMin: number;
        yMin: number;
        xMax: number;
        yMax: number;
    }
    interface ASRectangle {
        x: number;
        y: number;
        width: number;
        height: number;
    }
    /**
     * Faster release version of bounds.
     */
    class Bounds {
        xMin: number;
        yMin: number;
        xMax: number;
        yMax: number;
        constructor(xMin: number, yMin: number, xMax: number, yMax: number);
        static FromUntyped(source: UntypedBounds): Bounds;
        static FromRectangle(source: ASRectangle): Bounds;
        setElements(xMin: number, yMin: number, xMax: number, yMax: number): void;
        copyFrom(source: Bounds): void;
        contains(x: number, y: number): boolean;
        unionInPlace(other: Bounds): void;
        extendByPoint(x: number, y: number): void;
        extendByX(x: number): void;
        extendByY(y: number): void;
        intersects(toIntersect: Bounds): boolean;
        isEmpty(): boolean;
        width: number;
        height: number;
        getBaseWidth(angle: number): number;
        getBaseHeight(angle: number): number;
        setEmpty(): void;
        /**
         * Set all fields to the sentinel value 0x8000000.
         *
         * This is what Flash uses to indicate uninitialized bounds. Important for bounds calculation
         * in `Graphics` instances, which start out with empty bounds but must not just extend them
         * from an 0,0 origin.
         */
        setToSentinels(): void;
        clone(): Bounds;
        toString(): string;
    }
    /**
     * Slower debug version of bounds, makes sure that all points have integer coordinates.
     */
    class DebugBounds {
        private _xMin;
        private _yMin;
        private _xMax;
        private _yMax;
        constructor(xMin: number, yMin: number, xMax: number, yMax: number);
        static FromUntyped(source: UntypedBounds): DebugBounds;
        static FromRectangle(source: ASRectangle): DebugBounds;
        setElements(xMin: number, yMin: number, xMax: number, yMax: number): void;
        copyFrom(source: DebugBounds): void;
        contains(x: number, y: number): boolean;
        unionInPlace(other: DebugBounds): void;
        extendByPoint(x: number, y: number): void;
        extendByX(x: number): void;
        extendByY(y: number): void;
        intersects(toIntersect: DebugBounds): boolean;
        isEmpty(): boolean;
        xMin: number;
        yMin: number;
        xMax: number;
        readonly width: number;
        yMax: number;
        readonly height: number;
        getBaseWidth(angle: number): number;
        getBaseHeight(angle: number): number;
        setEmpty(): void;
        clone(): DebugBounds;
        toString(): string;
        private assertValid();
    }
    /**
     * Override Bounds with a slower by safer version, don't do this in release mode.
     */
    class Color {
        r: number;
        g: number;
        b: number;
        a: number;
        constructor(r: number, g: number, b: number, a: number);
        static FromARGB(argb: number): Color;
        static FromRGBA(rgba: number): Color;
        toRGBA(): number;
        toCSSStyle(): string;
        set(other: Color): void;
        static Red: Color;
        static Green: Color;
        static Blue: Color;
        static None: Color;
        static White: Color;
        static Black: Color;
        private static colorCache;
        static randomColor(alpha?: number): Color;
        static parseColor(color: string): Color;
    }
    module ColorUtilities {
        function RGBAToARGB(rgba: number): number;
        function ARGBToRGBA(argb: number): number;
        function rgbaToCSSStyle(rgba: number): string;
        function cssStyleToRGBA(style: string): any;
        function hexToRGB(color: string): number;
        function rgbToHex(color: number): string;
        function isValidHexColor(value: any): boolean;
        function clampByte(value: number): number;
        /**
         * Unpremultiplies the given |pARGB| color value.
         */
        function unpremultiplyARGB(pARGB: number): number;
        /**
         * Premultiplies the given |pARGB| color value.
         */
        function premultiplyARGB(uARGB: number): number;
        /**
         * Make sure to call this before using the |unpremultiplyARGBUsingTableLookup| or
         * |premultiplyARGBUsingTableLookup| functions. We want to execute this lazily so
         * we don't incur any startup overhead.
         */
        function ensureUnpremultiplyTable(): void;
        function getUnpremultiplyTable(): Uint8Array;
        function tableLookupUnpremultiplyARGB(pARGB: number): number;
        /**
         * The blending equation for unpremultiplied alpha is:
         *
         *   (src.rgb * src.a) + (dst.rgb * (1 - src.a))
         *
         * For premultiplied alpha src.rgb and dst.rgb are already
         * premultiplied by alpha, so the equation becomes:
         *
         *   src.rgb + (dst.rgb * (1 - src.a))
         *
         * TODO: Not sure what to do about the dst.rgb which is
         * premultiplied by its alpah, but this appears to work.
         *
         * We use the "double blend trick" (http://stereopsis.com/doubleblend.html) to
         * compute GA and BR without unpacking them.
         */
        function blendPremultipliedBGRA(tpBGRA: number, spBGRA: number): number;
        function convertImage(sourceFormat: ImageType, targetFormat: ImageType, source: Int32Array, target: Int32Array): void;
    }
    /**
     * Simple pool allocator for ArrayBuffers. This reduces memory usage in data structures
     * that resize buffers.
     */
    class ArrayBufferPool {
        private _list;
        private _maxSize;
        private static _enabled;
        /**
         * Creates a pool that manages a pool of a |maxSize| number of array buffers.
         */
        constructor(maxSize?: number);
        /**
         * Creates or reuses an existing array buffer that is at least the
         * specified |length|.
         */
        acquire(length: number): ArrayBuffer;
        /**
         * Releases an array buffer that is no longer needed back to the pool.
         */
        release(buffer: ArrayBuffer): void;
        /**
         * Resizes a Uint8Array to have the given length.
         */
        ensureUint8ArrayLength(array: Uint8Array, length: number): Uint8Array;
        /**
         * Resizes a Float64Array to have the given length.
         */
        ensureFloat64ArrayLength(array: Float64Array, length: number): Float64Array;
    }
    module Telemetry {
        const enum Feature {
            EXTERNAL_INTERFACE_FEATURE = 1,
            CLIPBOARD_FEATURE = 2,
            SHAREDOBJECT_FEATURE = 3,
            VIDEO_FEATURE = 4,
            SOUND_FEATURE = 5,
            NETCONNECTION_FEATURE = 6,
        }
        const enum ErrorTypes {
            AVM1_ERROR = 1,
            AVM2_ERROR = 2,
        }
        const enum LoadResource {
            LoadSource = 0,
            LoadWhitelistAllowed = 1,
            LoadWhitelistDenied = 2,
            StreamAllowed = 3,
            StreamDenied = 4,
            StreamCrossdomain = 5,
        }
        let instance: ITelemetryService;
    }
    interface ITelemetryService {
        reportTelemetry(data: any): void;
    }
    interface FileLoadingRequest {
        url: string;
        data: any;
    }
    interface FileLoadingProgress {
        bytesLoaded: number;
        bytesTotal: number;
    }
    interface FileLoadingSession {
        onopen?: () => void;
        onclose?: () => void;
        onprogress?: (data: any, progressStatus: FileLoadingProgress) => void;
        onhttpstatus?: (location: string, httpStatus: number, httpHeaders: any) => void;
        onerror?: (e: any) => void;
        open(request: FileLoadingRequest): void;
        close: () => void;
    }
    interface IFileLoadingService {
        createSession(): FileLoadingSession;
        resolveUrl(url: string): string;
        navigateTo(url: string, target: string): void;
    }
    module FileLoadingService {
        let instance: IFileLoadingService;
    }
    const enum SystemResourceId {
        BuiltinAbc = 0,
        PlayerglobalAbcs = 1,
        PlayerglobalManifest = 2,
        ShellAbc = 3,
    }
    interface ISystemResourcesLoadingService {
        load(id: SystemResourceId): Promise<any>;
    }
    module SystemResourcesLoadingService {
        let instance: ISystemResourcesLoadingService;
    }
    function registerCSSFont(id: number, data: Uint8Array, forceFontInit: boolean): void;
    interface IExternalInterfaceService {
        enabled: boolean;
        initJS(callback: (functionName: string, args: any[]) => any): void;
        registerCallback(functionName: string): void;
        unregisterCallback(functionName: string): void;
        eval(expression: any): any;
        call(request: any): any;
        getId(): string;
    }
    module ExternalInterfaceService {
        let instance: IExternalInterfaceService;
    }
    const enum LocalConnectionConnectResult {
        InvalidCallback = -3,
        AlreadyTaken = -2,
        InvalidName = -1,
        Success = 0,
    }
    const enum LocalConnectionCloseResult {
        NotConnected = -1,
        Success = 0,
    }
    interface ILocalConnectionReceiver {
        handleMessage(methodName: string, argsBuffer: ArrayBuffer): void;
    }
    interface ILocalConnectionSender {
        dispatchEvent(event: any): void;
        hasEventListener(type: string): boolean;
        sec?: any;
        _sec?: any;
    }
    interface ILocalConnectionService {
        createConnection(connectionName: string, receiver: ILocalConnectionReceiver): LocalConnectionConnectResult;
        closeConnection(connectionName: string, receiver: ILocalConnectionReceiver): LocalConnectionCloseResult;
        send(connectionName: string, methodName: string, args: ArrayBuffer, sender: ILocalConnectionSender, senderDomain: string, senderIsSecure: boolean): void;
        allowDomains(connectionName: string, receiver: ILocalConnectionReceiver, domains: string[], secure: boolean): void;
    }
    module LocalConnectionService {
        let instance: ILocalConnectionService;
    }
    interface IClipboardService {
        setClipboard(data: string): void;
    }
    module ClipboardService {
        let instance: IClipboardService;
    }
    class Callback {
        private _queues;
        constructor();
        register(type: any, callback: any): void;
        unregister(type: string, callback: any): void;
        notify(type: string, args_: any): void;
        notify1(type: string, value: any): void;
    }
    enum ImageType {
        None = 0,
        /**
         * Premultiplied ARGB (byte-order).
         */
        PremultipliedAlphaARGB = 1,
        /**
         * Unpremultiplied ARGB (byte-order).
         */
        StraightAlphaARGB = 2,
        /**
         * Unpremultiplied RGBA (byte-order), this is what putImageData expects.
         */
        StraightAlphaRGBA = 3,
        JPEG = 4,
        PNG = 5,
        GIF = 6,
    }
    function getMIMETypeForImageType(type: ImageType): string;
    module UI {
        function toCSSCursor(mouseCursor: number): "auto" | "default" | "text" | "pointer" | "grab";
    }
    class PromiseWrapper<T> {
        promise: Promise<T>;
        resolve: (result: T) => void;
        reject: (reason: any) => void;
        then(onFulfilled: any, onRejected: any): Promise<T>;
        constructor();
    }
}
/**
 * Option and Argument Management
 *
 * Options are configuration settings sprinkled throughout the code. They can be grouped into sets of
 * options called |OptionSets| which can form a hierarchy of options. For instance:
 *
 * let set = new OptionSet();
 * let opt = set.register(new Option("v", "verbose", "boolean", false, "Enables verbose logging."));
 *
 * creates an option set with one option in it. The option can be changed directly using |opt.value = true| or
 * automatically using the |ArgumentParser|:
 *
 * let parser = new ArgumentParser();
 * parser.addBoundOptionSet(set);
 * parser.parse(["-v"]);
 *
 * The |ArgumentParser| can also be used directly:
 *
 * let parser = new ArgumentParser();
 * argumentParser.addArgument("h", "help", "boolean", {parse: function (x) {
 *   printUsage();
 * }});
 */
declare module Shumway.Options {
    class Argument {
        shortName: string;
        longName: string;
        type: any;
        options: any;
        positional: boolean;
        parseFn: any;
        value: any;
        constructor(shortName: string, longName: string, type: any, options: any);
        parse(value: any): void;
    }
    class ArgumentParser {
        args: any[];
        constructor();
        addArgument(shortName: string, longName: string, type: any, options: any): Argument;
        addBoundOption(option: any): void;
        addBoundOptionSet(optionSet: any): void;
        getUsage(): string;
        parse(args: any): any[];
    }
    class OptionSet {
        name: string;
        settings: any;
        options: any;
        open: boolean;
        static isOptionSet(obj: any): boolean;
        constructor(name: string, settings?: any);
        register(option: any): any;
        trace(writer: any): void;
        getSettings(): MapObject<any>;
        setSettings(settings: any): void;
    }
    class Option {
        longName: string;
        shortName: string;
        type: string;
        defaultValue: any;
        value: any;
        description: string;
        config: any;
        /**
         * Dat GUI control.
         */
        ctrl: any;
        constructor(shortName: string, longName: string, type: string, defaultValue: any, description: string, config?: any);
        parse(value: any): void;
        trace(writer: any): void;
    }
}
declare module Shumway {
    module Settings {
        let ROOT: string;
        let shumwayOptions: OptionSet;
        function setSettings(settings: any): void;
        function getSettings(): MapObject<any>;
    }
    import OptionSet = Shumway.Options.OptionSet;
    let loggingOptions: any;
    let omitRepeatedWarnings: any;
}
declare module Shumway.Metrics {
    class Timer {
        private static _base;
        private static _top;
        private static _flat;
        private static _flatStack;
        private _parent;
        private _name;
        private _begin;
        private _last;
        private _total;
        private _count;
        private _timers;
        constructor(parent: Timer, name: string);
        static time(name: string, fn: Function): void;
        static start(name: string): void;
        static stop(): void;
        static stopStart(name: string): void;
        start(): void;
        stop(): void;
        toJSON(): {
            name: string;
            total: number;
            timers: MapObject<Timer>;
        };
        trace(writer: IndentingWriter): void;
        static trace(writer: IndentingWriter): void;
    }
    /**
     * Quick way to count named events.
     */
    class Counter {
        static instance: Counter;
        private _enabled;
        private _counts;
        private _times;
        readonly counts: MapObject<number>;
        constructor(enabled: boolean);
        setEnabled(enabled: boolean): void;
        clear(): void;
        toJSON(): {
            counts: MapObject<number>;
            times: MapObject<number>;
        };
        count(name: string, increment?: number, time?: number): number;
        trace(writer: IndentingWriter): void;
        private _pairToString(times, pair);
        toStringSorted(): string;
        traceSorted(writer: IndentingWriter, inline?: boolean): void;
    }
    class Average {
        private _samples;
        private _count;
        private _index;
        constructor(max: number);
        push(sample: number): void;
        average(): number;
    }
}
declare module Shumway.ArrayUtilities {
    class Inflate implements IDataDecoder {
        onData: (buffer: Uint8Array) => void;
        onError: (e: any) => void;
        constructor(verifyHeader: boolean);
        push(data: Uint8Array): void;
        close(): void;
        static create(verifyHeader: boolean): Inflate;
        _processZLibHeader(buffer: Uint8Array, start: number, end: number): number;
        static inflate(data: Uint8Array, expectedLength: number, zlibHeader: boolean): Uint8Array;
    }
    class Adler32 {
        private a;
        private b;
        constructor();
        update(data: Uint8Array, start: number, end: number): void;
        getChecksum(): number;
    }
    class Deflate implements IDataDecoder {
        onData: (data: Uint8Array) => void;
        onError: (e: any) => void;
        private _writeZlibHeader;
        private _state;
        private _adler32;
        constructor(writeZlibHeader: boolean);
        push(data: Uint8Array): void;
        close(): void;
    }
}
declare module Shumway.ArrayUtilities {
    class LzmaDecoder implements IDataDecoder {
        onData: (data: Uint8Array) => void;
        onError: (e: any) => void;
        private _state;
        buffer: Uint8Array;
        private _inStream;
        private _outStream;
        private _decoder;
        constructor(swfHeader?: boolean);
        push(data: Uint8Array): void;
        close(): void;
        private _error(error);
        private _checkError(res);
    }
}
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
declare module Shumway.ArrayUtilities {
    interface IDataInput {
        readBytes: (bytes: DataBuffer, offset?: number, length?: number) => void;
        readBoolean: () => boolean;
        readByte: () => number;
        readUnsignedByte: () => number;
        readShort: () => number;
        readUnsignedShort: () => number;
        readInt: () => number;
        readUnsignedInt: () => number;
        readFloat: () => number;
        readDouble: () => number;
        readMultiByte: (length: number, charSet: string) => string;
        readUTF: () => string;
        readUTFBytes: (length: number) => string;
        bytesAvailable: number;
        objectEncoding: number;
        endian: string;
    }
    interface IDataOutput {
        writeBytes: (bytes: DataBuffer, offset?: number, length?: number) => void;
        writeBoolean: (value: boolean) => void;
        writeByte: (value: number) => void;
        writeShort: (value: number) => void;
        writeInt: (value: number) => void;
        writeUnsignedInt: (value: number) => void;
        writeFloat: (value: number) => void;
        writeDouble: (value: number) => void;
        writeMultiByte: (value: string, charSet: string) => void;
        writeUTF: (value: string) => void;
        writeUTFBytes: (value: string) => void;
        objectEncoding: number;
        endian: string;
    }
    class PlainObjectDataBuffer {
        buffer: ArrayBuffer;
        length: number;
        littleEndian: boolean;
        constructor(buffer: ArrayBuffer, length: number, littleEndian: boolean);
    }
    class DataBuffer implements IDataInput, IDataOutput {
        private static _nativeLittleEndian;
        protected static INITIAL_SIZE: number;
        protected _buffer: ArrayBuffer;
        protected _length: number;
        protected _position: number;
        protected _littleEndian: boolean;
        protected _objectEncoding: number;
        private _u8;
        private _i32;
        private _f32;
        protected _bitBuffer: number;
        protected _bitLength: number;
        private static _arrayBufferPool;
        constructor(initialSize?: number);
        static FromArrayBuffer(buffer: ArrayBuffer, length?: number): DataBuffer;
        static FromPlainObject(source: PlainObjectDataBuffer): DataBuffer;
        toPlainObject(): PlainObjectDataBuffer;
        /**
         * Clone the DataBuffer in a way that guarantees the underlying ArrayBuffer to be copied
         * into an instance of the current global's ArrayBuffer.
         *
         * Important if the underlying buffer comes from a different global, in which case accessing
         * its elements is excruiciatingly slow.
         */
        clone(): DataBuffer;
        /**
         * By default, we only have a byte view. All other views are |null|.
         */
        protected _resetViews(): void;
        /**
         * We don't want to eagerly allocate views if we won't ever need them. You must call this method
         * before using a view of a certain type to make sure it's available. Once a view is allocated,
         * it is not re-allocated unless the view becomes |null| as a result of a call to |resetViews|.
         */
        private _requestViews(flags);
        getBytes(): Uint8Array;
        private _ensureCapacity(length);
        clear(): void;
        readBoolean(): boolean;
        readByte(): number;
        readUnsignedByte(): number;
        readBytes(bytes: DataBuffer, offset?: number, length?: number): void;
        readShort(): number;
        readUnsignedShort(): number;
        readInt(): number;
        readUnsignedInt(): number;
        readFloat(): number;
        readDouble(): number;
        writeBoolean(value: boolean): void;
        writeByte(value: number): void;
        writeUnsignedByte(value: number): void;
        writeRawBytes(bytes: Uint8Array): void;
        writeBytes(bytes: DataBuffer, offset?: number, length?: number): void;
        writeShort(value: number): void;
        writeUnsignedShort(value: number): void;
        writeInt(value: number): void;
        write2Ints(a: number, b: number): void;
        write4Ints(a: number, b: number, c: number, d: number): void;
        writeUnsignedInt(value: number): void;
        write2UnsignedInts(a: number, b: number): void;
        write4UnsignedInts(a: number, b: number, c: number, d: number): void;
        writeFloat(value: number): void;
        write2Floats(a: number, b: number): void;
        write6Floats(a: number, b: number, c: number, d: number, e: number, f: number): void;
        writeDouble(value: number): void;
        readRawBytes(): Int8Array;
        writeUTF(value: string): void;
        writeUTFBytes(value: string): void;
        readUTF(): string;
        readUTFBytes(length: number): string;
        length: number;
        readonly bytesAvailable: number;
        position: number;
        readonly buffer: ArrayBuffer;
        readonly bytes: Uint8Array;
        readonly ints: Int32Array;
        objectEncoding: number;
        endian: string;
        toString(): string;
        toBlob(type: string): Blob;
        writeMultiByte(value: string, charSet: string): void;
        readMultiByte(length: number, charSet: string): string;
        getValue(name: number): any;
        setValue(name: number, value: any): void;
        readFixed(): number;
        readFixed8(): number;
        readFloat16(): number;
        readEncodedU32(): number;
        readBits(size: number): number;
        readUnsignedBits(size: number): number;
        readFixedBits(size: number): number;
        readString(length?: number): string;
        align(): void;
        deflate(): void;
        inflate(): void;
        compress(algorithm: string): void;
        uncompress(algorithm: string): void;
    }
}
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
 * Serialization format for shape data:
 * (canonical, update this instead of anything else!)
 *
 * Shape data is serialized into a set of three buffers:
 * - `commands`: a Uint8Array for commands
 *  - valid values: [1-11] (i.e. one of the PathCommand enum values)
 * - `coordinates`: an Int32Array for path coordinates*
 *                  OR uint8 thickness iff the current command is PathCommand.LineStyleSolid
 *  - valid values: the full range of 32bit numbers, representing x,y coordinates in twips
 * - `styles`: a DataBuffer for style definitions
 *  - valid values: structs for the various style definitions as described below
 *
 * (*: with one exception: to make various things faster, stroke widths are stored in the
 * coordinates buffer, too.)
 *
 * All entries always contain all fields, default values aren't omitted.
 *
 * the various commands write the following sets of values into the various buffers:
 *
 * moveTo:
 * commands:      PathCommand.MoveTo
 * coordinates:   target x coordinate, in twips
 *                target y coordinate, in twips
 * styles:        n/a
 *
 * lineTo:
 * commands:      PathCommand.LineTo
 * coordinates:   target x coordinate, in twips
 *                target y coordinate, in twips
 * styles:        n/a
 *
 * curveTo:
 * commands:      PathCommand.CurveTo
 * coordinates:   control point x coordinate, in twips
 *                control point y coordinate, in twips
 *                target x coordinate, in twips
 *                target y coordinate, in twips
 * styles:        n/a
 *
 * cubicCurveTo:
 * commands:      PathCommand.CubicCurveTo
 * coordinates:   control point 1 x coordinate, in twips
 *                control point 1 y coordinate, in twips
 *                control point 2 x coordinate, in twips
 *                control point 2 y coordinate, in twips
 *                target x coordinate, in twips
 *                target y coordinate, in twips
 * styles:        n/a
 *
 * beginFill:
 * commands:      PathCommand.BeginSolidFill
 * coordinates:   n/a
 * styles:        uint32 - RGBA color
 *
 * beginGradientFill:
 * commands:      PathCommand.BeginGradientFill
 * coordinates:   n/a
 * Note: the style fields are ordered this way to optimize performance in the rendering backend
 * Note: the style record has a variable length depending on the number of color stops
 * styles:        uint8  - GradientType.{LINEAR,RADIAL}
 *                fix8   - focalPoint [-128.0xff,127.0xff]
 *                matrix - transform (see Matrix#writeExternal for details)
 *                uint8  - colorStops (Number of color stop records that follow)
 *                list of uint8,uint32 pairs:
 *                    uint8  - ratio [0-0xff]
 *                    uint32 - RGBA color
 *                uint8  - SpreadMethod.{PAD,REFLECT,REPEAT}
 *                uint8  - InterpolationMethod.{RGB,LINEAR_RGB}
 *
 * beginBitmapFill:
 * commands:      PathCommand.BeginBitmapFill
 * coordinates:   n/a
 * styles:        uint32 - Index of the bitmapData object in the Graphics object's `textures`
 *                         array
 *                matrix - transform (see Matrix#writeExternal for details)
 *                bool   - repeat
 *                bool   - smooth
 *
 * lineStyle:
 * commands:      PathCommand.LineStyleSolid
 * coordinates:   uint32 - thickness (!)
 * style:         uint32 - RGBA color
 *                bool   - pixelHinting
 *                uint8  - LineScaleMode, [0-3] see LineScaleMode.fromNumber for meaning
 *                uint8  - CapsStyle, [0-2] see CapsStyle.fromNumber for meaning
 *                uint8  - JointStyle, [0-2] see JointStyle.fromNumber for meaning
 *                uint8  - miterLimit
 *
 * lineGradientStyle:
 * commands:      PathCommand.LineStyleGradient
 * coordinates:   n/a
 * Note: the style fields are ordered this way to optimize performance in the rendering backend
 * Note: the style record has a variable length depending on the number of color stops
 * styles:        uint8  - GradientType.{LINEAR,RADIAL}
 *                int8   - focalPoint [-128,127]
 *                matrix - transform (see Matrix#writeExternal for details)
 *                uint8  - colorStops (Number of color stop records that follow)
 *                list of uint8,uint32 pairs:
 *                    uint8  - ratio [0-0xff]
 *                    uint32 - RGBA color
 *                uint8  - SpreadMethod.{PAD,REFLECT,REPEAT}
 *                uint8  - InterpolationMethod.{RGB,LINEAR_RGB}
 *
 * lineBitmapStyle:
 * commands:      PathCommand.LineBitmapStyle
 * coordinates:   n/a
 * styles:        uint32 - Index of the bitmapData object in the Graphics object's `textures`
 *                         array
 *                matrix - transform (see Matrix#writeExternal for details)
 *                bool   - repeat
 *                bool   - smooth
 *
 * lineEnd:
 * Note: emitted for invalid `lineStyle` calls
 * commands:      PathCommand.LineEnd
 * coordinates:   n/a
 * styles:        n/a
 *
 */
declare module Shumway {
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    /**
     * Used for (de-)serializing Graphics path data in defineShape, flash.display.Graphics
     * and the renderer.
     */
    const enum PathCommand {
        BeginSolidFill = 1,
        BeginGradientFill = 2,
        BeginBitmapFill = 3,
        EndFill = 4,
        LineStyleSolid = 5,
        LineStyleGradient = 6,
        LineStyleBitmap = 7,
        LineEnd = 8,
        MoveTo = 9,
        LineTo = 10,
        CurveTo = 11,
        CubicCurveTo = 12,
    }
    const enum GradientType {
        Linear = 16,
        Radial = 18,
    }
    const enum GradientSpreadMethod {
        Pad = 0,
        Reflect = 1,
        Repeat = 2,
    }
    const enum GradientInterpolationMethod {
        RGB = 0,
        LinearRGB = 1,
    }
    const enum LineScaleMode {
        None = 0,
        Normal = 1,
        Vertical = 2,
        Horizontal = 3,
    }
    interface ShapeMatrix {
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
    }
    class PlainObjectShapeData {
        commands: Uint8Array;
        commandsPosition: number;
        coordinates: Int32Array;
        morphCoordinates: Int32Array;
        coordinatesPosition: number;
        styles: ArrayBuffer;
        stylesLength: number;
        morphStyles: ArrayBuffer;
        morphStylesLength: number;
        hasFills: boolean;
        hasLines: boolean;
        constructor(commands: Uint8Array, commandsPosition: number, coordinates: Int32Array, morphCoordinates: Int32Array, coordinatesPosition: number, styles: ArrayBuffer, stylesLength: number, morphStyles: ArrayBuffer, morphStylesLength: number, hasFills: boolean, hasLines: boolean);
    }
    class ShapeData {
        commands: Uint8Array;
        commandsPosition: number;
        coordinates: Int32Array;
        morphCoordinates: Int32Array;
        coordinatesPosition: number;
        styles: DataBuffer;
        morphStyles: DataBuffer;
        hasFills: boolean;
        hasLines: boolean;
        constructor(initialize?: boolean);
        static FromPlainObject(source: PlainObjectShapeData): ShapeData;
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        curveTo(controlX: number, controlY: number, anchorX: number, anchorY: number): void;
        cubicCurveTo(controlX1: number, controlY1: number, controlX2: number, controlY2: number, anchorX: number, anchorY: number): void;
        beginFill(color: number): void;
        writeMorphFill(color: number): void;
        endFill(): void;
        endLine(): void;
        lineStyle(thickness: number, color: number, pixelHinting: boolean, scaleMode: LineScaleMode, caps: number, joints: number, miterLimit: number): void;
        writeMorphLineStyle(thickness: number, color: number): void;
        /**
         * Bitmaps are specified the same for fills and strokes, so we only need to serialize them
         * once. The Parameter `pathCommand` is treated as the actual command to serialize, and must
         * be one of BeginBitmapFill and LineStyleBitmap.
         */
        beginBitmap(pathCommand: PathCommand, bitmapId: number, matrix: ShapeMatrix, repeat: boolean, smooth: boolean): void;
        writeMorphBitmap(matrix: ShapeMatrix): void;
        /**
         * Gradients are specified the same for fills and strokes, so we only need to serialize them
         * once. The Parameter `pathCommand` is treated as the actual command to serialize, and must
         * be one of BeginGradientFill and LineStyleGradient.
         */
        beginGradient(pathCommand: PathCommand, colors: number[], ratios: number[], gradientType: number, matrix: ShapeMatrix, spread: number, interpolation: number, focalPointRatio: number): void;
        writeMorphGradient(colors: number[], ratios: number[], matrix: ShapeMatrix): void;
        writeCommandAndCoordinates(command: PathCommand, x: number, y: number): void;
        writeCoordinates(x: number, y: number): void;
        writeMorphCoordinates(x: number, y: number): void;
        clear(): void;
        isEmpty(): boolean;
        clone(): ShapeData;
        toPlainObject(): PlainObjectShapeData;
        readonly buffers: ArrayBuffer[];
        private _writeStyleMatrix(matrix, isMorph);
        private ensurePathCapacities(numCommands, numCoordinates);
    }
}
declare module Shumway.SWF.Parser {
    const enum SwfTagCode {
        CODE_END = 0,
        CODE_SHOW_FRAME = 1,
        CODE_DEFINE_SHAPE = 2,
        CODE_FREE_CHARACTER = 3,
        CODE_PLACE_OBJECT = 4,
        CODE_REMOVE_OBJECT = 5,
        CODE_DEFINE_BITS = 6,
        CODE_DEFINE_BUTTON = 7,
        CODE_JPEG_TABLES = 8,
        CODE_SET_BACKGROUND_COLOR = 9,
        CODE_DEFINE_FONT = 10,
        CODE_DEFINE_TEXT = 11,
        CODE_DO_ACTION = 12,
        CODE_DEFINE_FONT_INFO = 13,
        CODE_DEFINE_SOUND = 14,
        CODE_START_SOUND = 15,
        CODE_STOP_SOUND = 16,
        CODE_DEFINE_BUTTON_SOUND = 17,
        CODE_SOUND_STREAM_HEAD = 18,
        CODE_SOUND_STREAM_BLOCK = 19,
        CODE_DEFINE_BITS_LOSSLESS = 20,
        CODE_DEFINE_BITS_JPEG2 = 21,
        CODE_DEFINE_SHAPE2 = 22,
        CODE_DEFINE_BUTTON_CXFORM = 23,
        CODE_PROTECT = 24,
        CODE_PATHS_ARE_POSTSCRIPT = 25,
        CODE_PLACE_OBJECT2 = 26,
        CODE_REMOVE_OBJECT2 = 28,
        CODE_SYNC_FRAME = 29,
        CODE_FREE_ALL = 31,
        CODE_DEFINE_SHAPE3 = 32,
        CODE_DEFINE_TEXT2 = 33,
        CODE_DEFINE_BUTTON2 = 34,
        CODE_DEFINE_BITS_JPEG3 = 35,
        CODE_DEFINE_BITS_LOSSLESS2 = 36,
        CODE_DEFINE_EDIT_TEXT = 37,
        CODE_DEFINE_VIDEO = 38,
        CODE_DEFINE_SPRITE = 39,
        CODE_NAME_CHARACTER = 40,
        CODE_PRODUCT_INFO = 41,
        CODE_DEFINE_TEXT_FORMAT = 42,
        CODE_FRAME_LABEL = 43,
        CODE_DEFINE_BEHAVIOUR = 44,
        CODE_SOUND_STREAM_HEAD2 = 45,
        CODE_DEFINE_MORPH_SHAPE = 46,
        CODE_GENERATE_FRAME = 47,
        CODE_DEFINE_FONT2 = 48,
        CODE_GEN_COMMAND = 49,
        CODE_DEFINE_COMMAND_OBJECT = 50,
        CODE_CHARACTER_SET = 51,
        CODE_EXTERNAL_FONT = 52,
        CODE_DEFINE_FUNCTION = 53,
        CODE_PLACE_FUNCTION = 54,
        CODE_GEN_TAG_OBJECTS = 55,
        CODE_EXPORT_ASSETS = 56,
        CODE_IMPORT_ASSETS = 57,
        CODE_ENABLE_DEBUGGER = 58,
        CODE_DO_INIT_ACTION = 59,
        CODE_DEFINE_VIDEO_STREAM = 60,
        CODE_VIDEO_FRAME = 61,
        CODE_DEFINE_FONT_INFO2 = 62,
        CODE_DEBUG_ID = 63,
        CODE_ENABLE_DEBUGGER2 = 64,
        CODE_SCRIPT_LIMITS = 65,
        CODE_SET_TAB_INDEX = 66,
        CODE_FILE_ATTRIBUTES = 69,
        CODE_PLACE_OBJECT3 = 70,
        CODE_IMPORT_ASSETS2 = 71,
        CODE_DO_ABC_DEFINE = 72,
        CODE_DEFINE_FONT_ALIGN_ZONES = 73,
        CODE_CSM_TEXT_SETTINGS = 74,
        CODE_DEFINE_FONT3 = 75,
        CODE_SYMBOL_CLASS = 76,
        CODE_METADATA = 77,
        CODE_DEFINE_SCALING_GRID = 78,
        CODE_DO_ABC = 82,
        CODE_DEFINE_SHAPE4 = 83,
        CODE_DEFINE_MORPH_SHAPE2 = 84,
        CODE_DEFINE_SCENE_AND_FRAME_LABEL_DATA = 86,
        CODE_DEFINE_BINARY_DATA = 87,
        CODE_DEFINE_FONT_NAME = 88,
        CODE_START_SOUND2 = 89,
        CODE_DEFINE_BITS_JPEG4 = 90,
        CODE_DEFINE_FONT4 = 91,
        CODE_TELEMETRY = 93,
    }
    function getSwfTagCodeName(tagCode: SwfTagCode): string;
    enum DefinitionTags {
        CODE_DEFINE_SHAPE = 2,
        CODE_DEFINE_BITS = 6,
        CODE_DEFINE_BUTTON = 7,
        CODE_DEFINE_FONT = 10,
        CODE_DEFINE_TEXT = 11,
        CODE_DEFINE_SOUND = 14,
        CODE_DEFINE_BITS_LOSSLESS = 20,
        CODE_DEFINE_BITS_JPEG2 = 21,
        CODE_DEFINE_SHAPE2 = 22,
        CODE_DEFINE_SHAPE3 = 32,
        CODE_DEFINE_TEXT2 = 33,
        CODE_DEFINE_BUTTON2 = 34,
        CODE_DEFINE_BITS_JPEG3 = 35,
        CODE_DEFINE_BITS_LOSSLESS2 = 36,
        CODE_DEFINE_EDIT_TEXT = 37,
        CODE_DEFINE_SPRITE = 39,
        CODE_DEFINE_MORPH_SHAPE = 46,
        CODE_DEFINE_FONT2 = 48,
        CODE_DEFINE_VIDEO_STREAM = 60,
        CODE_DEFINE_FONT3 = 75,
        CODE_DEFINE_SHAPE4 = 83,
        CODE_DEFINE_MORPH_SHAPE2 = 84,
        CODE_DEFINE_BINARY_DATA = 87,
        CODE_DEFINE_BITS_JPEG4 = 90,
        CODE_DEFINE_FONT4 = 91,
    }
    enum ImageDefinitionTags {
        CODE_DEFINE_BITS = 6,
        CODE_DEFINE_BITS_JPEG2 = 21,
        CODE_DEFINE_BITS_JPEG3 = 35,
        CODE_DEFINE_BITS_JPEG4 = 90,
    }
    enum FontDefinitionTags {
        CODE_DEFINE_FONT = 10,
        CODE_DEFINE_FONT2 = 48,
        CODE_DEFINE_FONT3 = 75,
        CODE_DEFINE_FONT4 = 91,
    }
    enum ControlTags {
        CODE_PLACE_OBJECT = 4,
        CODE_PLACE_OBJECT2 = 26,
        CODE_PLACE_OBJECT3 = 70,
        CODE_REMOVE_OBJECT = 5,
        CODE_REMOVE_OBJECT2 = 28,
        CODE_START_SOUND = 15,
        CODE_START_SOUND2 = 89,
        CODE_VIDEO_FRAME = 61,
    }
    interface Bbox {
        xMin: number;
        xMax: number;
        yMin: number;
        yMax: number;
    }
    interface Matrix {
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
    }
    interface ColorTransform {
        redMultiplier: number;
        greenMultiplier: number;
        blueMultiplier: number;
        alphaMultiplier: number;
        redOffset: number;
        greenOffset: number;
        blueOffset: number;
        alphaOffset: number;
    }
    interface SwfTag {
        code: number;
    }
    interface DefinitionTag extends SwfTag {
        id: number;
    }
    interface DisplayListTag extends SwfTag {
        depth: number;
    }
    interface PlaceObjectTag extends DisplayListTag {
        actionBlocksPrecedence?: number;
        symbolId?: number;
        flags: number;
        matrix?: Matrix;
        cxform?: ColorTransform;
        className?: string;
        ratio?: number;
        name?: string;
        clipDepth?: number;
        filters?: any[];
        blendMode?: number;
        bmpCache?: number;
        visibility?: boolean;
        backgroundColor?: number;
        events?: ClipEvents[];
    }
    const enum PlaceObjectFlags {
        Move = 1,
        HasCharacter = 2,
        HasMatrix = 4,
        HasColorTransform = 8,
        HasRatio = 16,
        HasName = 32,
        HasClipDepth = 64,
        HasClipActions = 128,
        HasFilterList = 256,
        HasBlendMode = 512,
        HasCacheAsBitmap = 1024,
        HasClassName = 2048,
        HasImage = 4096,
        HasVisible = 8192,
        OpaqueBackground = 16384,
        Reserved = 32768,
    }
    const enum AVM1ClipEvents {
        Load = 1,
        EnterFrame = 2,
        Unload = 4,
        MouseMove = 8,
        MouseDown = 16,
        MouseUp = 32,
        KeyDown = 64,
        KeyUp = 128,
        Data = 256,
        Initialize = 512,
        Press = 1024,
        Release = 2048,
        ReleaseOutside = 4096,
        RollOver = 8192,
        RollOut = 16384,
        DragOver = 32768,
        DragOut = 65536,
        KeyPress = 131072,
        Construct = 262144,
    }
    interface ClipEvents {
        flags: number;
        keyCode?: number;
        actionsBlock: Uint8Array;
    }
    interface Filter {
        type: number;
    }
    interface GlowFilter extends Filter {
        colors: number[];
        ratios?: number[];
        blurX: number;
        blurY: number;
        angle?: number;
        distance?: number;
        strength: number;
        inner: boolean;
        knockout: boolean;
        compositeSource: boolean;
        onTop?: boolean;
        quality: number;
    }
    interface BlurFilter extends Filter {
        blurX: number;
        blurY: number;
        quality: number;
    }
    interface ConvolutionFilter extends Filter {
        matrixX: number;
        matrixY: number;
        divisor: number;
        bias: number;
        matrix: number[];
        color: number;
        clamp: boolean;
        preserveAlpha: boolean;
    }
    interface ColorMatrixFilter extends Filter {
        matrix: number[];
    }
    interface RemoveObjectTag extends DisplayListTag {
        depth: number;
        symbolId?: number;
    }
    interface ImageTag extends DefinitionTag {
        deblock?: number;
        imgData: Uint8Array;
        alphaData?: Uint8Array;
        mimeType: string;
        jpegTables?: {
            data: Uint8Array;
        };
    }
    interface ButtonTag extends DefinitionTag {
        characters?: ButtonCharacter[];
        actionsData?: Uint8Array;
        trackAsMenu?: boolean;
        buttonActions?: ButtonCondAction[];
    }
    interface ButtonCharacter {
        flags: number;
        symbolId?: number;
        depth?: number;
        matrix?: Matrix;
        cxform?: ColorTransform;
        filters?: Filter[];
        blendMode?: number;
        buttonActions?: ButtonCondAction[];
    }
    const enum ButtonCharacterFlags {
        StateUp = 1,
        StateOver = 2,
        StateDown = 4,
        StateHitTest = 8,
        HasFilterList = 16,
        HasBlendMode = 32,
    }
    interface ButtonCondAction {
        keyCode: number;
        stateTransitionFlags: number;
        actionsData: Uint8Array;
    }
    interface BinaryDataTag extends DefinitionTag {
        data: Uint8Array;
    }
    interface FontTag extends DefinitionTag {
        flags: number;
        language?: number;
        name?: string;
        copyright?: string;
        resolution?: number;
        offsets?: number[];
        mapOffset?: number;
        glyphs?: Glyph[];
        codes?: number[];
        ascent?: number;
        descent?: number;
        leading?: number;
        advance?: number[];
        bbox?: Bbox[];
        kerning?: Kerning[];
        data?: Uint8Array;
    }
    const enum FontFlags {
        Bold = 1,
        Italic = 2,
        WideOrHasFontData = 4,
        WideOffset = 8,
        Ansi = 16,
        SmallText = 32,
        ShiftJis = 64,
        HasLayout = 128,
    }
    type Glyph = ShapeRecord[];
    interface StaticTextTag extends DefinitionTag {
        bbox: Bbox;
        matrix: Matrix;
        records: TextRecord[];
    }
    interface TextRecord {
        flags: number;
        fontId?: number;
        color?: number;
        moveX?: number;
        moveY?: number;
        fontHeight?: number;
        glyphCount?: number;
        entries?: TextEntry[];
    }
    const enum TextRecordFlags {
        HasMoveX = 1,
        HasMoveY = 2,
        HasColor = 4,
        HasFont = 8,
    }
    interface TextEntry {
        glyphIndex: number;
        advance: number;
    }
    interface SoundTag extends DefinitionTag {
        soundFormat: number;
        soundRate: number;
        soundSize: number;
        soundType: number;
        samplesCount: number;
        soundData: Uint8Array;
    }
    interface StartSoundTag extends SwfTag {
        soundId?: number;
        soundClassName?: string;
        soundInfo: SoundInfo;
    }
    interface SoundInfo {
        flags: number;
        inPoint?: number;
        outPoint?: number;
        loopCount?: number;
        envelopes?: SoundEnvelope[];
    }
    const enum SoundInfoFlags {
        HasInPoint = 1,
        HasOutPoint = 2,
        HasLoops = 4,
        HasEnvelope = 8,
        NoMultiple = 16,
        Stop = 32,
    }
    interface SoundEnvelope {
        pos44: number;
        volumeLeft: number;
        volumeRight: number;
    }
    interface SoundStreamHeadTag {
        playbackRate: number;
        playbackSize: number;
        playbackType: number;
        streamCompression: number;
        streamRate: number;
        streamSize: number;
        streamType: number;
        samplesCount: number;
        latencySeek?: number;
    }
    interface BitmapTag extends DefinitionTag {
        format: number;
        width: number;
        height: number;
        hasAlpha: boolean;
        colorTableSize?: number;
        bmpData: Uint8Array;
    }
    interface TextTag extends DefinitionTag {
        bbox: Bbox;
        flags: number;
        fontId?: number;
        fontClass?: string;
        fontHeight?: number;
        color?: number;
        maxLength?: number;
        align?: number;
        leftMargin?: number;
        rightMargin?: number;
        indent?: number;
        leading?: number;
        variableName: string;
        initialText?: string;
    }
    const enum TextFlags {
        HasFont = 1,
        HasMaxLength = 2,
        HasColor = 4,
        ReadOnly = 8,
        Password = 16,
        Multiline = 32,
        WordWrap = 64,
        HasText = 128,
        UseOutlines = 256,
        Html = 512,
        WasStatic = 1024,
        Border = 2048,
        NoSelect = 4096,
        HasLayout = 8192,
        AutoSize = 16384,
        HasFontClass = 32768,
    }
    interface Kerning {
        code1: number;
        code2: number;
        adjustment: number;
    }
    interface ScalingGridTag extends SwfTag {
        symbolId: number;
        splitter: Bbox;
    }
    interface SceneTag extends SwfTag {
        scenes: Scene[];
        labels: Label[];
    }
    interface Scene {
        offset: number;
        name: string;
    }
    interface Label {
        frame: number;
        name: string;
    }
    interface ShapeTag extends DefinitionTag {
        lineBounds: Bbox;
        lineBoundsMorph?: Bbox;
        fillBounds?: Bbox;
        fillBoundsMorph?: Bbox;
        flags: number;
        fillStyles: FillStyle[];
        lineStyles: LineStyle[];
        records: ShapeRecord[];
        recordsMorph?: ShapeRecord[];
    }
    const enum ShapeFlags {
        UsesScalingStrokes = 1,
        UsesNonScalingStrokes = 2,
        UsesFillWindingRule = 4,
        IsMorph = 8,
    }
    interface FillStyle {
        type: number;
    }
    interface SolidFill extends FillStyle {
        color: number;
        colorMorph?: number;
    }
    interface GradientFill extends FillStyle {
        matrix: Matrix;
        matrixMorph?: Matrix;
        spreadMode?: number;
        interpolationMode?: number;
        records: GradientRecord[];
        focalPoint?: number;
        focalPointMorph?: number;
    }
    interface GradientRecord {
        ratio: number;
        color: number;
        ratioMorph?: number;
        colorMorph?: number;
    }
    interface BitmapFill extends FillStyle {
        bitmapId: number;
        condition: boolean;
        matrix: Matrix;
        matrixMorph?: Matrix;
    }
    interface LineStyle {
        width: number;
        widthMorph?: number;
        startCapsStyle?: number;
        jointStyle?: number;
        hasFill?: number;
        noHscale?: boolean;
        noVscale?: boolean;
        pixelHinting?: boolean;
        noClose?: boolean;
        endCapsStyle?: number;
        miterLimitFactor?: number;
        fillStyle?: FillStyle;
        color?: number;
        colorMorph?: number;
    }
    interface ShapeRecord {
        type: number;
        flags: number;
        deltaX?: number;
        deltaY?: number;
        controlDeltaX?: number;
        controlDeltaY?: number;
        anchorDeltaX?: number;
        anchorDeltaY?: number;
        moveX?: number;
        moveY?: number;
        fillStyle0?: number;
        fillStyle1?: number;
        lineStyle?: number;
        fillStyles?: FillStyle[];
        lineStyles?: LineStyle[];
        lineBits?: number;
        fillBits?: number;
    }
    const enum ShapeRecordFlags {
        Move = 1,
        HasFillStyle0 = 2,
        HasFillStyle1 = 4,
        HasLineStyle = 8,
        HasNewStyles = 16,
        IsStraight = 32,
        IsGeneral = 64,
        IsVertical = 128,
    }
    interface VideoStreamTag extends DefinitionTag {
        numFrames: number;
        width: number;
        height: number;
        deblocking: number;
        smoothing: boolean;
        codecId: number;
    }
    interface VideoFrameTag extends SwfTag {
        streamId: number;
        frameNum: number;
        videoData: Uint8Array;
    }
}
declare module Shumway {
    interface BinaryFileReaderProgressInfo {
        loaded: number;
        total: number;
    }
    class BinaryFileReader {
        url: string;
        method: string;
        mimeType: string;
        data: any;
        xhr: XMLHttpRequest;
        constructor(url: string, method?: string, mimeType?: string, data?: any);
        readAll(progress: (response: any, loaded: number, total: number) => void, complete: (response: any, error?: any) => void): void;
        readChunked(chunkSize: number, ondata: (data: Uint8Array, progress: BinaryFileReaderProgressInfo) => void, onerror: (err: any) => void, onopen?: () => void, oncomplete?: () => void, onhttpstatus?: (location: string, status: string, responseHeaders: any) => void): void;
        readAsync(ondata: (data: Uint8Array, progress: BinaryFileReaderProgressInfo) => void, onerror: (err: any) => void, onopen?: () => void, oncomplete?: () => void, onhttpstatus?: (location: string, status: string, responseHeaders: any) => void): void;
        abort(): void;
    }
}
declare module Shumway {
    class FlashLog {
        isAS3TraceOn: boolean;
        private _startTime;
        constructor();
        readonly currentTimestamp: number;
        _writeLine(line: string): void;
        writeAS3Trace(msg: string): void;
    }
    let flashlog: FlashLog;
}
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
declare module Shumway.Remoting {
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    interface IRemotable {
        _id: number;
    }
    /**
     * Remoting phases.
     */
    const enum RemotingPhase {
        /**
         * Objects are serialized. During this phase all reachable remotable objects (all objects
         * reachable from a root set) that are dirty are remoted. This includes all dirty object
         * properties except for dirty references.
         */
        Objects = 0,
        /**
         * Object references are serialized. All objects that are referred to have already been
         * remoted at this point.
         */
        References = 1,
    }
    const enum MessageBits {
        HasMatrix = 1,
        HasBounds = 2,
        HasChildren = 4,
        HasColorTransform = 8,
        HasClipRect = 16,
        HasMiscellaneousProperties = 32,
        HasMask = 64,
        HasClip = 128,
    }
    const enum IDMask {
        None = 0,
        Asset = 134217728,
    }
    /**
     * Serialization Format. All commands start with a message tag.
     */
    const enum MessageTag {
        EOF = 0,
        /**
         * id                   int32,
         * hasBits              int32,
         * matrix               Matrix,
         * colorMatrix          ColorMatrix,
         * mask                 int32,
         * misc
         *   blendMode          int32,
         *   visible            int32
         *
         * @type {number}
         */
        UpdateFrame = 100,
        UpdateGraphics = 101,
        UpdateBitmapData = 102,
        UpdateTextContent = 103,
        UpdateStage = 104,
        UpdateNetStream = 105,
        RequestBitmapData = 106,
        UpdateCurrentMouseTarget = 107,
        DrawToBitmap = 200,
        MouseEvent = 300,
        KeyboardEvent = 301,
        FocusEvent = 302,
    }
    enum FilterType {
        Blur = 0,
        DropShadow = 1,
        ColorMatrix = 2,
    }
    /**
     * Dictates how color transforms are encoded. The majority of color transforms are
     * either identity or only modify the alpha multiplier, so we can encode these more
     * efficiently.
     */
    const enum ColorTransformEncoding {
        /**
         * Identity, no need to serialize all the fields.
         */
        Identity = 0,
        /**
         * Identity w/ AlphaMultiplier, only the alpha multiplier is serialized.
         */
        AlphaMultiplierOnly = 1,
        /**
         * Offsets w/ AlphaMultiplier.
         */
        AlphaMultiplierWithOffsets = 2,
        /**
         * All fields are serialized.
         */
        All = 3,
    }
    /**
     * Dictates how matrices are encoded.
     */
    const enum MatrixEncoding {
        /**
         * Translation only.
         */
        TranslationOnly = 0,
        /**
         * Scale and translation only.
         */
        ScaleAndTranslationOnly = 1,
        /**
         * Uniform scale in the x and y direction and translation only.
         */
        UniformScaleAndTranslationOnly = 2,
        /**
         * All fields are serialized.
         */
        All = 3,
    }
    const enum VideoPlaybackEvent {
        Initialized = 0,
        Metadata = 1,
        PlayStart = 2,
        PlayStop = 3,
        BufferEmpty = 4,
        BufferFull = 5,
        Pause = 6,
        Unpause = 7,
        Seeking = 8,
        Seeked = 9,
        Progress = 10,
        Error = 11,
    }
    const enum VideoControlEvent {
        Init = 1,
        Pause = 2,
        Seek = 3,
        GetTime = 4,
        GetBufferLength = 5,
        SetSoundLevels = 6,
        GetBytesLoaded = 7,
        GetBytesTotal = 8,
        EnsurePlaying = 9,
    }
    const enum StageScaleMode {
        ShowAll = 0,
        ExactFit = 1,
        NoBorder = 2,
        NoScale = 4,
    }
    const enum StageAlignFlags {
        None = 0,
        Top = 1,
        Bottom = 2,
        Left = 4,
        Right = 8,
        TopLeft = 5,
        BottomLeft = 6,
        BottomRight = 10,
        TopRight = 9,
    }
    let MouseEventNames: string[];
    let KeyboardEventNames: string[];
    const enum KeyboardEventFlags {
        CtrlKey = 1,
        AltKey = 2,
        ShiftKey = 4,
    }
    const enum FocusEventType {
        DocumentHidden = 0,
        DocumentVisible = 1,
        WindowBlur = 2,
        WindowFocus = 3,
    }
    interface DisplayParameters {
        stageWidth: number;
        stageHeight: number;
        pixelRatio: number;
        screenWidth: number;
        screenHeight: number;
    }
    interface IGFXServiceObserver {
        displayParameters(displayParameters: DisplayParameters): void;
        focusEvent(data: any): void;
        keyboardEvent(data: any): void;
        mouseEvent(data: any): void;
        videoEvent(id: number, eventType: VideoPlaybackEvent, data: any): void;
    }
    interface IGFXService {
        addObserver(observer: IGFXServiceObserver): void;
        removeObserver(observer: IGFXServiceObserver): void;
        update(updates: DataBuffer, assets: Array<DataBuffer>): void;
        updateAndGet(updates: DataBuffer, assets: Array<DataBuffer>): any;
        frame(): void;
        videoControl(id: number, eventType: VideoControlEvent, data: any): any;
        registerFont(syncId: number, data: Uint8Array): Promise<any>;
        registerImage(syncId: number, symbolId: number, imageType: ImageType, data: Uint8Array, alphaData: Uint8Array): Promise<any>;
        fscommand(command: string, args: string): void;
    }
    /**
     * Messaging peer for sending data synchronously and asynchronously. Currently
     * used by GFX and Player iframes.
     */
    interface ITransportPeer {
        onAsyncMessage: (msg: any) => void;
        onSyncMessage: (msg: any) => any;
        postAsyncMessage(msg: any, transfers?: any[]): void;
        sendSyncMessage(msg: any, transfers?: any[]): any;
    }
    /**
     * Implementation of ITransportPeer that uses standard DOM postMessage and
     * events to exchange data between messaging peers.
     */
    class WindowTransportPeer implements ITransportPeer {
        window: Window;
        target: Window;
        onAsyncMessage: (msg: any) => void;
        onSyncMessage: (msg: any) => any;
        constructor(window: Window, target: Window);
        postAsyncMessage(msg: any, transfers?: any[]): void;
        sendSyncMessage(msg: any, transfers?: any[]): any;
    }
    /**
     * Implementation of ITransportPeer that uses ShumwayCom API to exchange data
     * between messaging peers.
     */
    class ShumwayComTransportPeer implements ITransportPeer {
        onAsyncMessage: (msg: any) => void;
        onSyncMessage: (msg: any) => any;
        postAsyncMessage(msg: any, transfers?: any[]): void;
        sendSyncMessage(msg: any, transfers?: any[]): any;
    }
}
declare let ShumwayEnvironment: {
    DEBUG: string;
    DEVELOPMENT: string;
    RELEASE: string;
    TEST: string;
};
declare let ShumwayCom: {
    environment: string;
    createSpecialInflate?: () => SpecialInflate;
    createRtmpSocket?: (options: {
        host: string;
        port: number;
        ssl: boolean;
    }) => RtmpSocket;
    createRtmpXHR?: () => RtmpXHR;
    createSpecialStorage: () => SpecialStorage;
    getWeakMapKeys: (weakMap: any) => Array<any>;
    fallback: () => void;
    reportIssue: (details?: string) => void;
    reportTelemetry: (data: any) => void;
    enableDebug: () => void;
    getPluginParams: () => any;
    getSettings: () => any;
    setClipboard: (data: string) => void;
    setFullscreen: (enabled: boolean) => void;
    externalCom: (args: any) => any;
    loadFile: (args: any) => void;
    abortLoad: (sessionId: number) => void;
    loadSystemResource: (id: number) => void;
    navigateTo: (args: any) => void;
    setupComBridge: (playerWindow: any) => void;
    sendSyncMessage: (data: any) => any;
    postAsyncMessage: (data: any) => void;
    setLoadFileCallback: (callback: (data: any) => void) => void;
    setExternalCallback: (callback: (call: any) => any) => void;
    setSystemResourceCallback: (callback: (id: number, data: any) => void) => void;
    setSyncMessageCallback: (callback: (data: any) => any) => void;
    setAsyncMessageCallback: (callback: (data: any) => void) => void;
    getLocalConnectionService: () => LocalConnectionService;
    processFrame?: () => void;
    processFSCommand?: (command: string, args: any) => void;
    print?: (msg: string) => void;
};
interface SpecialStorage {
    getItem(key: string): string;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}
interface SpecialInflate {
    setDataCallback(callback: (data: Uint8Array) => void): void;
    push(data: Uint8Array): void;
    close(): void;
}
interface LocalConnectionService {
    createLocalConnection: (connectionName: string, callback: (methodName: string, argsBuffer: ArrayBuffer) => any) => Shumway.LocalConnectionConnectResult;
    hasLocalConnection: (connectionName: string) => boolean;
    closeLocalConnection: (connectionName: string) => Shumway.LocalConnectionCloseResult;
    sendLocalConnectionMessage: (connectionName: string, methodName: string, argsBuffer: ArrayBuffer, sender: Shumway.ILocalConnectionSender, senderDomain: string, senderIsSecure: boolean) => void;
    allowDomainsForLocalConnection: (connectionName: string, domains: string[], secure: boolean) => void;
}
interface RtmpSocket {
    setOpenCallback(callback: () => void): void;
    setDataCallback(callback: (e: {
        data: ArrayBuffer;
    }) => void): void;
    setDrainCallback(callback: () => void): void;
    setErrorCallback(callback: (e: any) => void): void;
    setCloseCallback(callback: () => void): void;
    send(buffer: ArrayBuffer, offset: number, count: number): boolean;
    close(): void;
}
interface RtmpXHR {
    status: number;
    response: any;
    responseType: string;
    setLoadCallback(callback: () => void): void;
    setErrorCallback(callback: () => void): void;
    open(method: string, path: string, async?: boolean): void;
    setRequestHeader(header: string, value: string): void;
    send(data?: any): void;
}
declare module Shumway.flash.system {
    let _currentDomain: ISecurityDomain;
    let _currentSymbol: any;
    function currentDomain(): any;
    interface ISecurityDomain {
        utils: IUtilsNamespace;
        throwError(className: string, error: any, replacement1?: any, replacement2?: any, replacement3?: any, replacement4?: any): void;
    }
    interface IUtilsNamespace {
        ByteArray: ByteArrayClass;
    }
}
declare module Shumway {
    interface ErrorInfo {
        code: number;
        message: string;
    }
    interface Error {
        code: number;
        message: string;
        typeName?: string;
    }
    let Errors: any;
    function getErrorMessage(index: number): string;
    function getErrorInfo(index: number): ErrorInfo;
    function formatErrorMessage(error: Error, ...args: Array<any>): string;
    function translateErrorMessage(error: any): any;
    function sliceArguments(args: ArrayLike<number>, offset: number): any;
    function checkNullParameter(argument: any, name: string, sec: flash.system.ISecurityDomain): void;
}
declare module Shumway.flash {
    class LegacyEntity {
        _sec: system.ISecurityDomain;
        _symbol: any;
        _symbolProto: any;
        constructor();
    }
}
declare module Shumway.flash.system {
    class LegacyNamespace extends LegacyEntity {
        key: string;
        classMap: MapObject<LegacyEntity>;
        _registerClass(cl: LegacyClass): void;
    }
    function checkParameterType(argument: any, name: string, type: LegacyClass): void;
    class LegacyClass<T extends LegacyEntity = any> extends LegacyEntity {
        key: string;
        multiname: lang.Multiname;
        jsClass: Function;
        constructor(jsClass: Function);
        create(args?: Array<any>): T;
        createObject(): T;
        axIsType(obj: any): obj is T;
        setSymbolResolver(resolver: any): void;
        setSymbol(symbol: any): void;
        isSymbol(symbolClass: any): boolean;
        isSymbolPrototype(symbolClass: any): any;
        FromUntyped(obj: any): T;
        checkParameterType(argument: any, name: string): void;
    }
}
declare module Shumway {
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    module flash.net {
        enum AMFEncoding {
            AMF0 = 0,
            AMF3 = 3,
            DEFAULT = 3,
        }
        enum ObjectEncoding {
            AMF0 = 0,
            AMF3 = 3,
            DEFAULT = 3,
        }
    }
    module flash.system {
        class ByteArrayClass extends LegacyClass<utils.ByteArray> {
            key: string;
            constructor();
            readObject(arr: utils.ByteArray): any;
            writeObject(arr: utils.ByteArray, obj: any): void;
        }
    }
    module flash.utils {
        interface IDataInput {
            readBytes: (bytes: flash.utils.ByteArray, offset?: number, length?: number) => void;
            readBoolean: () => boolean;
            readByte: () => number;
            readUnsignedByte: () => number;
            readShort: () => number;
            readUnsignedShort: () => number;
            readInt: () => number;
            readUnsignedInt: () => number;
            readFloat: () => number;
            readDouble: () => number;
            readMultiByte: (length: number, charSet: string) => string;
            readUTF: () => string;
            readUTFBytes: (length: number) => string;
            bytesAvailable: number;
            readObject: () => any;
            objectEncoding: number;
            endian: string;
        }
        interface IDataOutput {
            writeBytes: (bytes: flash.utils.ByteArray, offset?: number, length?: number) => void;
            writeBoolean: (value: boolean) => void;
            writeByte: (value: number) => void;
            writeShort: (value: number) => void;
            writeInt: (value: number) => void;
            writeUnsignedInt: (value: number) => void;
            writeFloat: (value: number) => void;
            writeDouble: (value: number) => void;
            writeMultiByte: (value: string, charSet: string) => void;
            writeUTF: (value: string) => void;
            writeUTFBytes: (value: string) => void;
            writeObject: (obj: any) => void;
            objectEncoding: number;
            endian: string;
        }
        class ByteArray extends DataBuffer implements LegacyEntity, IDataInput, IDataOutput {
            _symbol: {
                buffer: Uint8Array;
                byteLength: number;
            };
            _symbolProto: any;
            _sec: system.ISecurityDomain;
            constructor(source?: any);
            private static _defaultObjectEncoding;
            static defaultObjectEncoding: number;
            toJSON(): string;
            readObject(): any;
            writeObject(obj: any): void;
        }
    }
}
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
declare module Shumway.Tools.Theme {
    interface UITheme {
        tabToolbar(a: number): string;
        toolbars(a: number): string;
        selectionBackground(a: number): string;
        selectionText(a: number): string;
        splitters(a: number): string;
        bodyBackground(a: number): string;
        sidebarBackground(a: number): string;
        attentionBackground(a: number): string;
        bodyText(a: number): string;
        foregroundTextGrey(a: number): string;
        contentTextHighContrast(a: number): string;
        contentTextGrey(a: number): string;
        contentTextDarkGrey(a: number): string;
        blueHighlight(a: number): string;
        purpleHighlight(a: number): string;
        pinkHighlight(a: number): string;
        redHighlight(a: number): string;
        orangeHighlight(a: number): string;
        lightOrangeHighlight(a: number): string;
        greenHighlight(a: number): string;
        blueGreyHighlight(a: number): string;
    }
    class UI {
        static toRGBA(r: number, g: number, b: number, a?: number): string;
    }
    class UIThemeDark implements UITheme {
        constructor();
        tabToolbar(a?: number): string;
        toolbars(a?: number): string;
        selectionBackground(a?: number): string;
        selectionText(a?: number): string;
        splitters(a?: number): string;
        bodyBackground(a?: number): string;
        sidebarBackground(a?: number): string;
        attentionBackground(a?: number): string;
        bodyText(a?: number): string;
        foregroundTextGrey(a?: number): string;
        contentTextHighContrast(a?: number): string;
        contentTextGrey(a?: number): string;
        contentTextDarkGrey(a?: number): string;
        blueHighlight(a?: number): string;
        purpleHighlight(a?: number): string;
        pinkHighlight(a?: number): string;
        redHighlight(a?: number): string;
        orangeHighlight(a?: number): string;
        lightOrangeHighlight(a?: number): string;
        greenHighlight(a?: number): string;
        blueGreyHighlight(a?: number): string;
    }
    class UIThemeLight implements UITheme {
        constructor();
        tabToolbar(a?: number): string;
        toolbars(a?: number): string;
        selectionBackground(a?: number): string;
        selectionText(a?: number): string;
        splitters(a?: number): string;
        bodyBackground(a?: number): string;
        sidebarBackground(a?: number): string;
        attentionBackground(a?: number): string;
        bodyText(a?: number): string;
        foregroundTextGrey(a?: number): string;
        contentTextHighContrast(a?: number): string;
        contentTextGrey(a?: number): string;
        contentTextDarkGrey(a?: number): string;
        blueHighlight(a?: number): string;
        purpleHighlight(a?: number): string;
        pinkHighlight(a?: number): string;
        redHighlight(a?: number): string;
        orangeHighlight(a?: number): string;
        lightOrangeHighlight(a?: number): string;
        greenHighlight(a?: number): string;
        blueGreyHighlight(a?: number): string;
    }
}
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
declare module Shumway.Tools.Profiler {
    class Profile {
        private _snapshots;
        private _buffers;
        private _startTime;
        private _endTime;
        private _windowStart;
        private _windowEnd;
        private _maxDepth;
        constructor(buffers: TimelineBuffer[], startTime: number);
        addBuffer(buffer: TimelineBuffer): void;
        getSnapshotAt(index: number): TimelineBufferSnapshot;
        readonly hasSnapshots: boolean;
        readonly snapshotCount: number;
        readonly startTime: number;
        readonly endTime: number;
        readonly totalTime: number;
        readonly windowStart: number;
        readonly windowEnd: number;
        readonly windowLength: number;
        readonly maxDepth: number;
        forEachSnapshot(visitor: (snapshot: TimelineBufferSnapshot, index: number) => void): void;
        createSnapshots(): void;
        setWindow(start: number, end: number): void;
        moveWindowTo(time: number): void;
    }
}
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
declare module Shumway.Tools.Profiler {
    interface TimelineFrameRange {
        startIndex: number;
        endIndex: number;
        startTime: number;
        endTime: number;
        totalTime: number;
    }
    class TimelineFrameStatistics {
        kind: TimelineItemKind;
        count: number;
        selfTime: number;
        totalTime: number;
        constructor(kind: TimelineItemKind);
    }
    /**
     * Represents a single timeline frame range and makes it easier to work with the compacted
     * timeline buffer data.
     */
    class TimelineFrame {
        parent: TimelineFrame;
        kind: TimelineItemKind;
        startData: any;
        endData: any;
        startTime: number;
        endTime: number;
        statistics: TimelineFrameStatistics[];
        children: TimelineFrame[];
        total: number;
        maxDepth: number;
        depth: number;
        constructor(parent: TimelineFrame, kind: TimelineItemKind, startData: any, endData: any, startTime: number, endTime: number);
        readonly totalTime: number;
        readonly selfTime: number;
        /**
         * Gets the child index of the first child to overlap the specified time.
         */
        getChildIndex(time: number): number;
        /**
         * Gets the high and low index of the children that intersect the specified time range.
         */
        getChildRange(startTime: number, endTime: number): TimelineFrameRange;
        private _getNearestChild(time);
        private _getNearestChildReverse(time);
        /**
         * Finds the deepest child that intersects with the specified time.
         */
        query(time: number): TimelineFrame;
        /**
         * When querying a series of samples, if the deepest child for the previous time is known,
         * it is faster to go up the tree from there, until a frame is found that contains the next time,
         * and then go back down.
         *
         * More often than not we don't have to start at the very top.
         */
        queryNext(time: number): TimelineFrame;
        /**
         * Gets this frame's distance to the root.
         */
        getDepth(): number;
        calculateStatistics(): void;
        trace(writer: IndentingWriter): void;
    }
    class TimelineBufferSnapshot extends TimelineFrame {
        name: string;
        constructor(name: string);
    }
}
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
declare module Shumway.Tools.Profiler {
    interface TimelineItemKind {
        id: number;
        name: string;
        bgColor: string;
        textColor: string;
        visible: boolean;
    }
    /**
     * Records enter / leave events in two circular buffers.
     * The goal here is to be able to handle large amounts of data.
     */
    class TimelineBuffer {
        static ENTER: number;
        static LEAVE: number;
        static MAX_KINDID: number;
        static MAX_DATAID: number;
        private _depth;
        private _data;
        private _kinds;
        private _kindNameMap;
        private _marks;
        private _times;
        private _stack;
        private _startTime;
        name: string;
        constructor(name?: string, startTime?: number);
        getKind(kind: number): TimelineItemKind;
        readonly kinds: TimelineItemKind[];
        readonly depth: number;
        private _initialize();
        private _getKindId(name);
        private _getMark(type, kindId, data?);
        enter(name: string, data?: any, time?: number): void;
        leave(name?: string, data?: any, time?: number): void;
        count(name: string, value: number, data?: any): void;
        /**
         * Constructs an easier to work with TimelineFrame data structure.
         */
        createSnapshot(count?: number): TimelineBufferSnapshot;
        reset(startTime?: number): void;
        static FromFirefoxProfile(profile: any, name?: string): TimelineBuffer;
        static FromChromeProfile(profile: any, name?: string): TimelineBuffer;
        private static _resolveIds(parent, idMap);
    }
}
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
declare module Shumway.Tools.Profiler {
    const enum UIThemeType {
        DARK = 0,
        LIGHT = 1,
    }
    class Controller {
        private _container;
        private _profiles;
        private _activeProfile;
        private _overviewHeader;
        private _overview;
        private _headers;
        private _charts;
        private _themeType;
        private _theme;
        private _tooltip;
        constructor(container: HTMLElement, themeType?: UIThemeType);
        createProfile(buffers: TimelineBuffer[], startTime: number): Profile;
        activateProfile(profile: Profile): void;
        activateProfileAt(index: number): void;
        deactivateProfile(): void;
        resize(): void;
        getProfileAt(index: number): Profile;
        readonly activeProfile: Profile;
        readonly profileCount: number;
        readonly container: HTMLElement;
        themeType: UIThemeType;
        readonly theme: Theme.UITheme;
        getSnapshotAt(index: number): TimelineBufferSnapshot;
        private _createViews();
        private _destroyViews();
        private _initializeViews();
        private _onResize();
        private _updateViews();
        private _drawViews();
        private _createTooltip();
        /**
         * View callbacks
         */
        setWindow(start: number, end: number): void;
        moveWindowTo(time: number): void;
        showTooltip(chart: FlameChart, frame: TimelineFrame, x: number, y: number): void;
        hideTooltip(): void;
        createTooltipContent(chart: FlameChart, frame: TimelineFrame): HTMLElement;
        appendDataElements(el: HTMLElement, data: any): void;
        removeTooltipContent(): void;
    }
}
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
declare module Shumway.Tools.Profiler {
    interface MouseControllerTarget {
        onMouseDown(x: number, y: number): void;
        onMouseMove(x: number, y: number): void;
        onMouseOver(x: number, y: number): void;
        onMouseOut(): void;
        onMouseWheel(x: number, y: number, delta: number): void;
        onDrag(startX: number, startY: number, currentX: number, currentY: number, deltaX: number, deltaY: number): void;
        onDragEnd(startX: number, startY: number, currentX: number, currentY: number, deltaX: number, deltaY: number): void;
        onClick(x: number, y: number): void;
        onHoverStart(x: number, y: number): void;
        onHoverEnd(): void;
    }
    class MouseCursor {
        value: string;
        constructor(value: string);
        toString(): string;
        static AUTO: MouseCursor;
        static DEFAULT: MouseCursor;
        static NONE: MouseCursor;
        static HELP: MouseCursor;
        static POINTER: MouseCursor;
        static PROGRESS: MouseCursor;
        static WAIT: MouseCursor;
        static CELL: MouseCursor;
        static CROSSHAIR: MouseCursor;
        static TEXT: MouseCursor;
        static ALIAS: MouseCursor;
        static COPY: MouseCursor;
        static MOVE: MouseCursor;
        static NO_DROP: MouseCursor;
        static NOT_ALLOWED: MouseCursor;
        static ALL_SCROLL: MouseCursor;
        static COL_RESIZE: MouseCursor;
        static ROW_RESIZE: MouseCursor;
        static N_RESIZE: MouseCursor;
        static E_RESIZE: MouseCursor;
        static S_RESIZE: MouseCursor;
        static W_RESIZE: MouseCursor;
        static NE_RESIZE: MouseCursor;
        static NW_RESIZE: MouseCursor;
        static SE_RESIZE: MouseCursor;
        static SW_RESIZE: MouseCursor;
        static EW_RESIZE: MouseCursor;
        static NS_RESIZE: MouseCursor;
        static NESW_RESIZE: MouseCursor;
        static NWSE_RESIZE: MouseCursor;
        static ZOOM_IN: MouseCursor;
        static ZOOM_OUT: MouseCursor;
        static GRAB: MouseCursor;
        static GRABBING: MouseCursor;
    }
    class MouseController {
        private _target;
        private _eventTarget;
        private _boundOnMouseDown;
        private _boundOnMouseUp;
        private _boundOnMouseOver;
        private _boundOnMouseOut;
        private _boundOnMouseMove;
        private _boundOnMouseWheel;
        private _boundOnDrag;
        private _dragInfo;
        private _hoverInfo;
        private _wheelDisabled;
        private static HOVER_TIMEOUT;
        private static _cursor;
        private static _cursorOwner;
        constructor(target: MouseControllerTarget, eventTarget: EventTarget);
        destroy(): void;
        updateCursor(cursor: MouseCursor): void;
        private _onMouseDown(event);
        private _onDrag(event);
        private _onMouseUp(event);
        private _onMouseOver(event);
        private _onMouseOut(event);
        private _onMouseMove(event);
        private _onMouseWheel(event);
        private _startHoverCheck(event);
        private _killHoverCheck();
        private _onMouseMoveIdleHandler();
        private _getTargetMousePos(event, target);
    }
}
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
declare module Shumway.Tools.Profiler {
    const enum FlameChartDragTarget {
        NONE = 0,
        WINDOW = 1,
        HANDLE_LEFT = 2,
        HANDLE_RIGHT = 3,
        HANDLE_BOTH = 4,
    }
    interface FlameChartDragInfo {
        windowStartInitial: number;
        windowEndInitial: number;
        target: FlameChartDragTarget;
    }
    class FlameChartBase implements MouseControllerTarget {
        _controller: Controller;
        _mouseController: MouseController;
        _canvas: HTMLCanvasElement;
        _context: CanvasRenderingContext2D;
        _width: number;
        _height: number;
        _windowStart: number;
        _windowEnd: number;
        _rangeStart: number;
        _rangeEnd: number;
        _initialized: boolean;
        _dragInfo: FlameChartDragInfo;
        static DRAGHANDLE_WIDTH: number;
        static MIN_WINDOW_LEN: number;
        preConstructor(): void;
        constructor(controller: Controller, ...preArgs: Array<any>);
        readonly canvas: HTMLCanvasElement;
        setSize(width: number, height?: number): void;
        initialize(rangeStart: number, rangeEnd: number): void;
        setWindow(start: number, end: number, draw?: boolean): void;
        setRange(start: number, end: number, draw?: boolean): void;
        destroy(): void;
        _resetCanvas(): void;
        draw(): void;
        _almostEq(a: number, b: number, precision?: number): boolean;
        _windowEqRange(): boolean;
        _decimalPlaces(value: number): number;
        _toPixelsRelative(time: number): number;
        _toPixels(time: number): number;
        _toTimeRelative(px: number): number;
        _toTime(px: number): number;
        onMouseWheel(x: number, y: number, delta: number): void;
        onMouseDown(x: number, y: number): void;
        onMouseMove(x: number, y: number): void;
        onMouseOver(x: number, y: number): void;
        onMouseOut(): void;
        onDrag(startX: number, startY: number, currentX: number, currentY: number, deltaX: number, deltaY: number): void;
        onDragEnd(startX: number, startY: number, currentX: number, currentY: number, deltaX: number, deltaY: number): void;
        onClick(x: number, y: number): void;
        onHoverStart(x: number, y: number): void;
        onHoverEnd(): void;
    }
}
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
declare module Shumway.Tools.Profiler {
    class FlameChart extends FlameChartBase implements MouseControllerTarget {
        private _snapshot;
        private _kindStyle;
        private _textWidth;
        private _maxDepth;
        private _hoveredFrame;
        /**
         * Don't paint frames whose width is smaller than this value. This helps a lot when drawing
         * large ranges. This can be < 1 since anti-aliasing can look quite nice.
         */
        private _minFrameWidthInPixels;
        constructor(controller: Controller, snapshot: TimelineBufferSnapshot);
        setSize(width: number, height?: number): void;
        initialize(rangeStart: number, rangeEnd: number): void;
        destroy(): void;
        draw(): void;
        private _drawChildren(parent, depth?);
        private _drawFrame(frame, depth);
        private _prepareText(context, title, maxSize);
        private _measureWidth(context, text);
        _toPixelsRelative(time: number): number;
        _toPixels(time: number): number;
        _toTimeRelative(px: number): number;
        _toTime(px: number): number;
        private _getFrameAtPosition(x, y);
        onMouseDown(x: number, y: number): void;
        onMouseMove(x: number, y: number): void;
        onMouseOver(x: number, y: number): void;
        onMouseOut(): void;
        onDrag(startX: number, startY: number, currentX: number, currentY: number, deltaX: number, deltaY: number): void;
        onDragEnd(startX: number, startY: number, currentX: number, currentY: number, deltaX: number, deltaY: number): void;
        onClick(x: number, y: number): void;
        onHoverStart(x: number, y: number): void;
        onHoverEnd(): void;
        getStatistics(kind: TimelineItemKind): TimelineFrameStatistics;
    }
}
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
declare module Shumway.Tools.Profiler {
    const enum FlameChartOverviewMode {
        OVERLAY = 0,
        STACK = 1,
        UNION = 2,
    }
    class FlameChartOverview extends FlameChartBase implements MouseControllerTarget {
        private _overviewCanvasDirty;
        private _overviewCanvas;
        private _overviewContext;
        private _selection;
        private _mode;
        constructor(controller: Controller, mode: FlameChartOverviewMode);
        preConstructor(mode?: FlameChartOverviewMode): void;
        setSize(width: number, height?: number): void;
        mode: FlameChartOverviewMode;
        _resetCanvas(): void;
        draw(): void;
        private _drawSelection();
        private _drawChart();
        _toPixelsRelative(time: number): number;
        _toPixels(time: number): number;
        _toTimeRelative(px: number): number;
        _toTime(px: number): number;
        private _getDragTargetUnderCursor(x, y);
        onMouseDown(x: number, y: number): void;
        onMouseMove(x: number, y: number): void;
        onMouseOver(x: number, y: number): void;
        onMouseOut(): void;
        onDrag(startX: number, startY: number, currentX: number, currentY: number, deltaX: number, deltaY: number): void;
        onDragEnd(startX: number, startY: number, currentX: number, currentY: number, deltaX: number, deltaY: number): void;
        onClick(x: number, y: number): void;
        onHoverStart(x: number, y: number): void;
        onHoverEnd(): void;
    }
}
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
declare module Shumway.Tools.Profiler {
    const enum FlameChartHeaderType {
        OVERVIEW = 0,
        CHART = 1,
    }
    class FlameChartHeader extends FlameChartBase implements MouseControllerTarget {
        private _type;
        private static TICK_MAX_WIDTH;
        constructor(controller: Controller, type: FlameChartHeaderType);
        preConstructor(type?: FlameChartHeaderType): void;
        draw(): void;
        private _drawLabels(rangeStart, rangeEnd);
        private _calculateTickInterval(rangeStart, rangeEnd);
        private _drawDragHandle(pos);
        private _drawRoundedRect(context, x, y, width, height, radius, stroke?, fill?);
        _toPixelsRelative(time: number): number;
        _toPixels(time: number): number;
        _toTimeRelative(px: number): number;
        _toTime(px: number): number;
        private _getDragTargetUnderCursor(x, y);
        onMouseDown(x: number, y: number): void;
        onMouseMove(x: number, y: number): void;
        onMouseOver(x: number, y: number): void;
        onMouseOut(): void;
        onDrag(startX: number, startY: number, currentX: number, currentY: number, deltaX: number, deltaY: number): void;
        onDragEnd(startX: number, startY: number, currentX: number, currentY: number, deltaX: number, deltaY: number): void;
        onClick(x: number, y: number): void;
        onHoverStart(x: number, y: number): void;
        onHoverEnd(): void;
    }
}
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
declare module Shumway.Tools.Profiler.TraceLogger {
    class TraceLoggerProgressInfo {
        pageLoaded: boolean;
        threadsTotal: number;
        threadsLoaded: number;
        threadFilesTotal: number;
        threadFilesLoaded: number;
        constructor(pageLoaded: boolean, threadsTotal: number, threadsLoaded: number, threadFilesTotal: number, threadFilesLoaded: number);
        toString(): string;
    }
    class TraceLogger {
        private _baseUrl;
        private _threads;
        private _pageLoadCallback;
        private _pageLoadProgressCallback;
        private _progressInfo;
        constructor(baseUrl: string);
        loadPage(url: string, callback: (err: any, result: any[]) => void, progress?: (info: TraceLoggerProgressInfo) => void): void;
        readonly buffers: TimelineBuffer[];
        private _onProgress();
        private _onLoadPage(result);
        private _loadData(urls, callback, progress?);
        private static colors;
    }
}
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
declare module Shumway.Tools.Profiler.TraceLogger {
    interface TreeItem {
        start: number;
        stop: number;
        textId: number;
        nextId: number;
        hasChildren: boolean;
    }
    class Thread {
        private _data;
        private _text;
        private _buffer;
        private static ITEM_SIZE;
        constructor(data: any[]);
        readonly buffer: TimelineBuffer;
        private _walkTree(id);
    }
}
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
declare module Shumway.Tools.Terminal {
    class Buffer {
        lines: string[];
        format: any[];
        time: number[];
        repeat: number[];
        length: number;
        constructor();
        append(line: string, color: string): void;
        get(i: number): string;
        getFormat(i: number): any;
        getTime(i: number): number;
        getRepeat(i: number): number;
    }
    /**
     * If you're going to write a lot of data to the browser console you're gonna have a bad time. This may make your
     * life a little more pleasant.
     */
    class Terminal {
        lineColor: string;
        alternateLineColor: string;
        textColor: string;
        selectionColor: string;
        selectionTextColor: string;
        ratio: number;
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        fontSize: number;
        lineIndex: number;
        pageIndex: number;
        columnIndex: number;
        selection: any;
        lineHeight: number;
        hasFocus: boolean;
        pageLineCount: number;
        refreshFrequency: number;
        textMarginLeft: number;
        textMarginBottom: number;
        buffer: Buffer;
        showLineNumbers: boolean;
        showLineTime: boolean;
        showLineCounter: boolean;
        constructor(canvas: HTMLCanvasElement);
        printHelp(): void;
        resize(): void;
        private _resizeHandler();
        gotoLine(index: number): void;
        scrollIntoView(): void;
        scroll(delta: number): void;
        paint(): void;
        refreshEvery(ms: number): void;
        isScrolledToBottom(): boolean;
    }
}
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
declare module Shumway.Tools.Mini {
    class FPS {
        private _container;
        private _canvas;
        private _context;
        private _ratio;
        private _index;
        private _lastTime;
        private _lastWeightedTime;
        private _gradient;
        constructor(container: HTMLDivElement);
        private _listenForContainerSizeChanges();
        private _onContainerSizeChanged();
        private readonly _containerWidth;
        private readonly _containerHeight;
        tickAndRender(idle?: boolean, renderTime?: number): void;
    }
}
declare module Shumway.SWF.Parser.LowLevel {
    function parseRgb(stream: Stream): number;
    function parseDefineImageTag(stream: Stream, swfVersion: number, tagCode: number, tagEnd: number, jpegTables: Uint8Array): ImageTag;
    function parseDefineFontTag(stream: Stream, swfVersion: number, tagCode: number): FontTag;
    function parseSoundStreamHeadTag(stream: Stream, tagEnd: number): SoundStreamHeadTag;
    function parseDefineBitmapTag(stream: Stream, swfVersion: number, tagCode: number, tagEnd: number): BitmapTag;
    function parseDefineFont2Tag(stream: Stream, swfVersion: number, tagCode: number, tagEnd: number): FontTag;
    function parseDefineFont4Tag(stream: Stream, swfVersion: number, tagCode: number, tagEnd: number): FontTag;
    function parseDefineSceneTag(stream: Stream, tagCode: number): SceneTag;
    let tagHandlers: any;
    function parseHeader(stream: Stream): {
        frameRate: number;
        frameCount: number;
        bounds: Bounds;
    };
}
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
declare module Shumway.SWF.Parser {
    const enum BitmapFormat {
        /**
         * 8-bit color mapped image.
         */
        FORMAT_COLORMAPPED = 3,
        /**
         * 15-bit RGB image.
         */
        FORMAT_15BPP = 4,
        /**
         * 24-bit RGB image, however stored as 4 byte value 0x00RRGGBB.
         */
        FORMAT_24BPP = 5,
    }
    function defineBitmap(tag: BitmapTag): {
        definition: ImageDefinition;
        type: string;
    };
}
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
declare module Shumway.SWF.Parser {
    function defineButton(tag: ButtonTag, dictionary: any): any;
}
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
declare module Shumway.SWF.Parser {
    function defineFont(tag: FontTag): {
        type: string;
        id: number;
        name: string;
        bold: boolean;
        italic: boolean;
        codes: any;
        metrics: any;
        data: Uint8Array;
        originalSize: boolean;
    };
}
declare module Shumway.SWF.Parser {
    /**
     * Parses JPEG chunks and reads image width and height information. JPEG data
     * in SWFs is encoded in chunks and not directly decodable by the JPEG parser.
     */
    function parseJpegChunks(bytes: Uint8Array, chunks: Uint8Array[]): void;
    /**
     * Extracts PNG width and height information.
     */
    function parsePngHeaders(image: any, bytes: Uint8Array): void;
    interface ImageDefinition {
        type: string;
        id: number;
        width: number;
        height: number;
        mimeType: string;
        data: Uint8Array;
        dataType?: ImageType;
        image: any;
    }
    interface JPEGTablesState {
        data: Uint8Array;
        parsedChunks?: Uint8Array[];
    }
    function defineImage(tag: ImageTag): ImageDefinition;
}
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
declare module Shumway.SWF.Parser {
    function defineLabel(tag: StaticTextTag): {
        type: string;
        id: number;
        fillBounds: Bbox;
        matrix: Matrix;
        tag: {
            hasText: boolean;
            initialText: string;
            html: boolean;
            readonly: boolean;
        };
        records: TextRecord[];
        coords: any;
        static: boolean;
        require: any;
    };
}
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
declare module Shumway.SWF.Parser {
    function defineShape(tag: ShapeTag): {
        type: string;
        id: number;
        fillBounds: Bbox;
        lineBounds: Bbox;
        morphFillBounds: Bbox;
        morphLineBounds: Bbox;
        shape: PlainObjectShapeData;
        transferables: ArrayBuffer[];
        require: any[];
    };
}
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
declare module Shumway.SWF.Parser {
    function defineSound(tag: SoundTag): {
        type: string;
        id: number;
        sampleRate: number;
        channels: number;
        pcm: Float32Array;
        packaged: any;
    };
    interface DecodedSound {
        streamId: number;
        samplesCount: number;
        pcm?: Float32Array;
        data?: Uint8Array;
        seek?: number;
    }
    class SoundStream {
        streamId: number;
        samplesCount: number;
        sampleRate: number;
        channels: number;
        format: any;
        currentSample: number;
        decode: (block: Uint8Array) => DecodedSound;
        constructor(samplesCount: number, sampleRate: number, channels: number);
        static FromTag(tag: any): SoundStream;
    }
}
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
declare module Shumway.SWF.Parser {
    function defineText(tag: TextTag): {
        type: string;
        id: number;
        fillBounds: Bbox;
        variableName: string;
        tag: TextTag;
        bold: boolean;
        italic: boolean;
    };
}
declare module Shumway.SWF {
    let timelineBuffer: Tools.Profiler.TimelineBuffer;
    function enterTimeline(name: string, data?: any): void;
    function leaveTimeline(data?: any): void;
}
declare module Shumway.SWF {
    let parserOptions: any;
    let traceLevel: any;
}
declare module Shumway.SWF {
    let StreamNoDataError: {};
    class Stream {
        bytes: Uint8Array;
        view: DataView;
        pos: number;
        end: number;
        bitBuffer: number;
        bitLength: number;
        constructor(buffer: any, offset?: number, length?: number, maxLength?: number);
        align(): void;
        ensure(size: number): void;
        remaining(): number;
        substream(begin: number, end: number): Stream;
        push(data: ArrayLike<number>): void;
        readSi8(): number;
        readSi16(): number;
        readSi32(): number;
        readUi8(): number;
        readUi16(): number;
        readUi32(): number;
        readFixed(): number;
        readFixed8(): number;
        readFloat16(): number;
        readFloat(): number;
        readDouble(): number;
        readEncodedU32(): number;
        readBool(): boolean;
        readSb(size: number): number;
        readUb(size: number): number;
        readFb(size: number): number;
        readString(length: number): string;
    }
}
declare module Shumway.SWF {
    let MP3WORKER_PATH: string;
    class MP3DecoderSession {
        private _sessionId;
        private _onworkermessageBound;
        private _worker;
        onframedata: (frameData: Uint8Array, channels: number, sampleRate: number, bitRate: number) => void;
        onid3tag: (tagData: any) => void;
        onclosed: () => void;
        onerror: (error: string) => void;
        constructor();
        private onworkermessage(e);
        pushAsync(data: any): void;
        close(): void;
        static processAll(data: Uint8Array): Promise<{
            data: Uint8Array;
            id3Tags: any;
        }>;
    }
}
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
declare module Shumway.SWF {
    import Parser = Shumway.SWF.Parser;
    const enum CompressionMethod {
        None = 0,
        Deflate = 1,
        LZMA = 2,
    }
    class SWFFile {
        compression: CompressionMethod;
        swfVersion: number;
        useAVM1: boolean;
        backgroundColor: number;
        bounds: Bounds;
        frameRate: number;
        frameCount: number;
        attributes: any;
        sceneAndFrameLabelData: any;
        bytesLoaded: number;
        bytesTotal: number;
        pendingUpdateDelays: number;
        framesLoaded: number;
        frames: SWFFrame[];
        abcBlocks: ABCBlock[];
        dictionary: DictionaryEntry[];
        fonts: {
            name: string;
            style: string;
            id: number;
        }[];
        data: Uint8Array;
        env: any;
        symbolClassesMap: string[];
        symbolClassesList: {
            id: number;
            className: string;
        }[];
        eagerlyParsedSymbolsMap: EagerlyParsedDictionaryEntry[];
        eagerlyParsedSymbolsList: EagerlyParsedDictionaryEntry[];
        private _uncompressedLength;
        private _uncompressedLoadedLength;
        private _dataView;
        private _dataStream;
        private _decompressor;
        private _jpegTables;
        private _endTagEncountered;
        private _loadStarted;
        private _lastScanPosition;
        private _currentFrameLabel;
        private _currentSoundStreamHead;
        private _currentSoundStreamBlock;
        private _currentControlTags;
        private _currentActionBlocks;
        private _currentInitActionBlocks;
        private _currentExports;
        constructor(initialBytes: Uint8Array, length: number, env: any);
        appendLoadedData(bytes: Uint8Array): void;
        finishLoading(): void;
        getSymbol(id: number): any;
        getParsedTag(unparsed: UnparsedTag): any;
        private readHeaderAndInitialize(initialBytes);
        private parseHeaderContents();
        private processFirstBatchOfDecompressedData(data);
        private processDecompressedData(data);
        private scanLoadedData();
        private scanTagsToOffset(endOffset, rootTimelineMode);
        /**
         * Parses tag header information at the current seek offset and stores it in the given object.
         *
         * Public so it can be used by tools to parse through entire SWFs.
         */
        parseNextTagHeader(target: UnparsedTag): boolean;
        private scanTag(tag, rootTimelineMode);
        parseSpriteTimeline(spriteTag: DictionaryEntry): any;
        private jumpToNextTag(currentTagLength);
        private emitTagSlopWarning(tag, tagEnd);
        private finishFrame();
        private setFileAttributes(tagLength);
        private setSceneAndFrameLabelData(tagLength);
        private addControlTag(tagCode, byteOffset, tagLength);
        private addLazySymbol(tagCode, byteOffset, tagLength);
        private decodeEmbeddedFont(unparsed);
        private registerEmbeddedFont(unparsed);
        private decodeEmbeddedImage(unparsed);
    }
    class SWFFrame {
        controlTags: UnparsedTag[];
        labelName: string;
        soundStreamHead: Parser.SoundStream;
        soundStreamBlock: Uint8Array;
        actionBlocks: ActionBlock[];
        initActionBlocks: InitActionBlock[];
        exports: SymbolExport[];
        constructor(controlTags?: UnparsedTag[], labelName?: string, soundStreamHead?: Parser.SoundStream, soundStreamBlock?: Uint8Array, actionBlocks?: ActionBlock[], initActionBlocks?: InitActionBlock[], exports?: SymbolExport[]);
    }
    class ABCBlock {
        name: string;
        flags: number;
        data: Uint8Array;
    }
    class ActionBlock {
        actionsData: Uint8Array;
        precedence: number;
    }
    class InitActionBlock {
        spriteId: number;
        actionsData: Uint8Array;
    }
    class SymbolExport {
        symbolId: number;
        className: string;
        constructor(symbolId: number, className: string);
    }
    class UnparsedTag {
        tagCode: number;
        byteOffset: number;
        byteLength: number;
        constructor(tagCode: number, byteOffset: number, byteLength: number);
    }
    class DictionaryEntry extends UnparsedTag {
        id: number;
        constructor(id: number, tagCode: number, byteOffset: number, byteLength: number);
    }
    class EagerlyParsedDictionaryEntry extends DictionaryEntry {
        type: string;
        definition: Object;
        env: any;
        ready: boolean;
        constructor(id: number, unparsed: UnparsedTag, type: string, definition: any, env: any);
    }
}
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
declare module Shumway {
    class ImageFile {
        env: any;
        data: Uint8Array;
        bytesLoaded: number;
        image: any;
        mimeType: string;
        type: number;
        width: number;
        height: number;
        constructor(header: Uint8Array, fileLength: number, env: any);
        readonly bytesTotal: number;
        appendLoadedData(data: Uint8Array): void;
        private setMimetype();
    }
}
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
 * Encapsulates as much of the external file loading process as possible. This means all of it
 * except for (stand-alone or embedded) images and fonts embedded in SWFs. As these have to be
 * decoded before being usable by content, we stall reporting loading progress until the decoding
 * has finished. The following is a description of the ridiculously complicated contortions we
 * have to go through for this to work:

 ### Life-cycle of embedded images and fonts from being encountered in the SWF to being ready for
 use:
 1.
 1. An image tag is encountered, `SWFFile#decodeEmbeddedImage` is called.
 2. A font tag is encountered, `SWFFile#registerEmbeddedFont` is called. For Firefox, things end
 here for now: fonts can be decoded synchronously, so we don't need to do it eagerly.
 2. Embedded asset's contents are extracted from SWF and stored in an
 `EagerlyParsedDictionaryEntry`.
 3. Once scanning of the currently loaded SWF bytes is complete, `Loader#onNewEagerlyParsedSymbols`
 is called with a list of all newly encountered fonts and images.
 Note: `Loader` does *not* receive updates about any other newly loaded data; not even how many
 bytes were loaded.
 4. `Loader#onNewEagerlyParsedSymbols` iterates over list of fonts and images and retrieves their
 symbols.
 5. `LoaderInfo#getSymbolById` creates a `{Font,Bitmap}Symbol` instance, which gets a `syncID` and
 a `resolveAssetPromise` and a `ready` flag set to `false`.
 6. `LoaderInfo#getSymbolById` invokes `Timeline.IAssetResolver#registerFont` or
 `Timeline.IAssetResolver#registerImage`. The singleton implementation of `IAssetResolver` is
 the active instance of `Player`.
 7. `Player#registerFont` or `Player#registerImage` send sync message to GFX side requesting
 decoding of asset.
 8. `GFXChannelDeserializerContext#register{Font,Image}` is called, which triggers the actual
 decoding and, in the image case, registration of the asset.
 9.
 1. A `CSSFont` is created and a 400ms timeout triggered.
 2.
 1. A `HTMLImageElement` is created and a load triggered from the blob containing the image
 bytes.
 2. A `RenderableBitmap` is created with the `HTMLImageElement` as its `renderSource` and
 `-1,-1` dimensions.
 10. `Loader#onNewEagerlyParsedSymbols` creates a `Promise.all` promise for all assets'
 `resolveAssetPromise`s and returns that to the `FileLoader`.
 11. For all assets:
 1. Loading finishes for images / timeout happens for fonts, resolving their
 `resolveAssetPromise`.
 2. Symbols get marked as `ready`, fonts get their metrics filled in.
 12. The combined promise is resolved, causing `FileLoader` to deliver the queued load update,
 informing content about newly loaded bytes, assets, scripts, etc.

 Note: loading and scanning of the SWF has continued in the meantime, so there can be multiple
 updates queued for the same promise.


 ### Usage of an image in GFX-land:
 Images are guaranteed to be ready for rendering when content is told about them, so there can
 never be a need to asynchronously decode them. If an image is never used for anything but
 rendering, it's never expanded into a Canvas. If, see below, content accesses the image's bytes,
 it's expanded and the original `HTMLImageElement` discarded.

 ### Usage of an image in Player-land:
 If content accesses an image's pixels for the first time, e.g. using `BitmapData#getPixel`, the
 `BitmapData` instance requests the pixel data from GFX-land. That causes the above-mentioned
 expansion into a Canvas and discarding of the `HTMLImageElement`, followed by a `getImageData`
 call.
 */
declare module Shumway {
    class LoadProgressUpdate {
        bytesLoaded: number;
        framesLoaded: number;
        constructor(bytesLoaded: number, framesLoaded: number);
    }
    interface ILoadListener {
        onLoadOpen: (x: any) => void;
        onLoadProgress: (update: LoadProgressUpdate) => void;
        onNewEagerlyParsedSymbols: (symbols: SWF.EagerlyParsedDictionaryEntry[], delta: number) => Promise<any>;
        onImageBytesLoaded: () => void;
        onLoadComplete: () => void;
        onLoadError: () => void;
    }
    class FileLoader {
        _url: string;
        _file: any;
        private _listener;
        private _env;
        private _loadingServiceSession;
        private _delayedUpdatesPromise;
        private _lastDelayedUpdate;
        private _bytesLoaded;
        private _queuedInitialData;
        constructor(listener: ILoadListener, env: any);
        loadFile(request: any): void;
        abortLoad(): void;
        loadBytes(bytes: Uint8Array): void;
        processLoadOpen(): void;
        processNewData(data: Uint8Array, progressInfo: {
            bytesLoaded: number;
            bytesTotal: number;
        }): void;
        processError(error: any): void;
        processLoadClose(): void;
        private processSWFFileUpdate(file, previousEagerlyParsedSymbolsCount, previousFramesLoaded);
    }
}
declare module RtmpJs.Browser {
    class ShumwayComRtmpSocket {
        static readonly isAvailable: boolean;
        private _socket;
        private _onopen;
        private _ondata;
        private _ondrain;
        private _onerror;
        private _onclose;
        constructor(host: string, port: number, params: any);
        onopen: () => void;
        ondata: (e: {
            data: ArrayBuffer;
        }) => void;
        ondrain: () => void;
        onerror: (e: any) => void;
        onclose: () => void;
        send(buffer: ArrayBuffer, offset: number, count: number): boolean;
        close(): void;
    }
    class ShumwayComRtmpXHR {
        static readonly isAvailable: boolean;
        private _xhr;
        private _onload;
        private _onerror;
        readonly status: number;
        readonly response: any;
        responseType: string;
        onload: () => void;
        onerror: () => void;
        constructor();
        open(method: string, path: string, async?: boolean): void;
        setRequestHeader(header: string, value: string): void;
        send(data?: any): void;
    }
}
declare module RtmpJs {
    interface IChunkedStreamMessage {
        timestamp: number;
        streamId: number;
        chunkedStreamId: number;
        typeId: number;
        data: Uint8Array;
        firstChunk: boolean;
        lastChunk: boolean;
    }
    class ChunkedStream {
        private id;
        private buffer;
        private bufferLength;
        lastStreamId: number;
        lastTimestamp: number;
        lastLength: number;
        lastTypeId: number;
        lastMessageComplete: boolean;
        waitingForBytes: number;
        sentStreamId: number;
        sentTimestamp: number;
        sentLength: number;
        sentTypeId: number;
        onmessage: (message: IChunkedStreamMessage) => void;
        constructor(id: number);
        setBuffer(enabled: boolean): void;
        abort(): void;
        _push(data: Uint8Array, firstChunk: boolean, lastChunk: boolean): void;
    }
    interface IChunkedChannelUserControlMessage {
        type: number;
        data: Uint8Array;
    }
    interface ISendMessage {
        streamId: number;
        typeId: number;
        data: Uint8Array;
        timestamp?: number;
    }
    class ChunkedChannel {
        private state;
        private buffer;
        private bufferLength;
        private chunkSize;
        private chunkStreams;
        private peerChunkSize;
        private peerAckWindowSize;
        private bandwidthLimitType;
        private windowAckSize;
        private bytesReceived;
        private lastAckSent;
        private serverVersion;
        private epochStart;
        private randomData;
        onusercontrolmessage: (message: IChunkedChannelUserControlMessage) => void;
        onack: () => void;
        ondata: (data: Uint8Array) => void;
        onclose: () => void;
        oncreated: () => void;
        onmessage: (message: IChunkedStreamMessage) => void;
        constructor();
        push(data: Uint8Array): void;
        private _initialize();
        setChunkSize(chunkSize: number): void;
        send(chunkStreamId: number, message: ISendMessage): number;
        sendUserControlMessage(type: number, data: Uint8Array): void;
        private _sendAck();
        private _sendMessage(chunkStreamId, message);
        private _getChunkStream(id);
        private _parseChunkedData();
        start(): void;
        stop(error: any): void;
        private _fail(message);
    }
}
declare module RtmpJs {
    interface ITransportConnectedParameters {
        properties: any;
        information: any;
        isError: boolean;
    }
    interface ITransportStreamCreatedParameters {
        transactionId: number;
        commandObject: any;
        streamId: number;
        stream: INetStream;
        isError: boolean;
    }
    interface ITransportResponse {
        commandName: string;
        transactionId: number;
        commandObject: any;
        response: any;
    }
    interface ITransportEvent {
        type: number;
        data: Uint8Array;
    }
    class BaseTransport {
        channel: ChunkedChannel;
        onconnected: (props: ITransportConnectedParameters) => void;
        onstreamcreated: (props: ITransportStreamCreatedParameters) => void;
        onresponse: (response: ITransportResponse) => void;
        onevent: (event: ITransportEvent) => void;
        private _streams;
        constructor();
        connect(properties: any, args?: any): void;
        _initChannel(properties: any, args?: any): ChunkedChannel;
        call(procedureName: string, transactionId: number, commandObject: any, args: any): void;
        createStream(transactionId: number, commandObject: any): void;
        sendCommandOrResponse(commandName: string, transactionId: number, commandObject: any, response?: any): void;
        _setBuffer(streamId: number, ms: number): void;
        _sendCommand(streamId: number, data: Uint8Array): void;
    }
    interface INetStreamData {
        typeId: number;
        data: Uint8Array;
        timestamp: number;
    }
    interface INetStream {
        ondata: (data: INetStreamData) => void;
        onscriptdata: (type: string, ...data: any[]) => void;
        oncallback: (...args: any[]) => void;
        play(name: string, start?: number, duration?: number, reset?: boolean): void;
    }
    interface RtmpConnectionString {
        protocol: string;
        host: string;
        port: number;
        app: string;
    }
    function parseConnectionString(s: string): RtmpConnectionString;
}
declare module RtmpJs.Browser {
    class RtmpTransport extends BaseTransport {
        host: string;
        port: number;
        ssl: boolean;
        constructor(connectionSettings: any);
        connect(properties: any, args?: any): void;
    }
    class RtmptTransport extends BaseTransport {
        baseUrl: string;
        stopped: boolean;
        sessionId: string;
        requestId: number;
        data: Uint8Array[];
        constructor(connectionSettings: any);
        connect(properties: any, args?: any): void;
        tick(): void;
    }
}
/**
 * Copyright 2015 Mozilla Foundation
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
declare module RtmpJs.MP4.Iso {
    class Box {
        offset: number;
        size: number;
        boxtype: string;
        userType: Uint8Array;
        constructor(boxtype: string, extendedType?: Uint8Array);
        /**
         * @param offset Position where writing will start in the output array
         * @returns {number} Size of the written data
         */
        layout(offset: number): number;
        /**
         * @param data Output array
         * @returns {number} Amount of written bytes by this Box and its children only.
         */
        write(data: Uint8Array): number;
        toUint8Array(): Uint8Array;
    }
    class FullBox extends Box {
        version: number;
        flags: number;
        constructor(boxtype: string, version?: number, flags?: number);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    class FileTypeBox extends Box {
        majorBrand: string;
        minorVersion: number;
        compatibleBrands: string[];
        constructor(majorBrand: string, minorVersion: number, compatibleBrands: string[]);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    class BoxContainerBox extends Box {
        children: Box[];
        constructor(type: string, children: Box[]);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    class MovieBox extends BoxContainerBox {
        header: MovieHeaderBox;
        tracks: Box[];
        extendsBox: MovieExtendsBox;
        userData: Box;
        constructor(header: MovieHeaderBox, tracks: Box[], extendsBox: MovieExtendsBox, userData: Box);
    }
    class MovieHeaderBox extends FullBox {
        timescale: number;
        duration: number;
        nextTrackId: number;
        rate: number;
        volume: number;
        matrix: number[];
        creationTime: number;
        modificationTime: number;
        constructor(timescale: number, duration: number, nextTrackId: number, rate?: number, volume?: number, matrix?: number[], creationTime?: number, modificationTime?: number);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    const enum TrackHeaderFlags {
        TRACK_ENABLED = 1,
        TRACK_IN_MOVIE = 2,
        TRACK_IN_PREVIEW = 4,
    }
    class TrackHeaderBox extends FullBox {
        trackId: number;
        duration: number;
        width: number;
        height: number;
        volume: number;
        alternateGroup: number;
        layer: number;
        matrix: number[];
        creationTime: number;
        modificationTime: number;
        constructor(flags: number, trackId: number, duration: number, width: number, height: number, volume: number, alternateGroup?: number, layer?: number, matrix?: number[], creationTime?: number, modificationTime?: number);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    class MediaHeaderBox extends FullBox {
        timescale: number;
        duration: number;
        language: string;
        creationTime: number;
        modificationTime: number;
        constructor(timescale: number, duration: number, language?: string, creationTime?: number, modificationTime?: number);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    class HandlerBox extends FullBox {
        handlerType: string;
        name: string;
        private _encodedName;
        constructor(handlerType: string, name: string);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    class SoundMediaHeaderBox extends FullBox {
        balance: number;
        constructor(balance?: number);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    class VideoMediaHeaderBox extends FullBox {
        graphicsMode: number;
        opColor: number[];
        constructor(graphicsMode?: number, opColor?: number[]);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    let SELF_CONTAINED_DATA_REFERENCE_FLAG: number;
    class DataEntryUrlBox extends FullBox {
        location: string;
        private _encodedLocation;
        constructor(flags: number, location?: string);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    class DataReferenceBox extends FullBox {
        entries: Box[];
        constructor(entries: Box[]);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    class DataInformationBox extends BoxContainerBox {
        dataReference: Box;
        constructor(dataReference: Box);
    }
    class SampleDescriptionBox extends FullBox {
        entries: Box[];
        constructor(entries: Box[]);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    class SampleTableBox extends BoxContainerBox {
        sampleDescriptions: SampleDescriptionBox;
        timeToSample: Box;
        sampleToChunk: Box;
        sampleSizes: Box;
        chunkOffset: Box;
        constructor(sampleDescriptions: SampleDescriptionBox, timeToSample: Box, sampleToChunk: Box, sampleSizes: Box, chunkOffset: Box);
    }
    class MediaInformationBox extends BoxContainerBox {
        header: Box;
        info: DataInformationBox;
        sampleTable: SampleTableBox;
        constructor(header: Box, info: DataInformationBox, sampleTable: SampleTableBox);
    }
    class MediaBox extends BoxContainerBox {
        header: MediaHeaderBox;
        handler: HandlerBox;
        info: MediaInformationBox;
        constructor(header: MediaHeaderBox, handler: HandlerBox, info: MediaInformationBox);
    }
    class TrackBox extends BoxContainerBox {
        header: TrackHeaderBox;
        media: Box;
        constructor(header: TrackHeaderBox, media: Box);
    }
    class TrackExtendsBox extends FullBox {
        trackId: number;
        defaultSampleDescriptionIndex: number;
        defaultSampleDuration: number;
        defaultSampleSize: number;
        defaultSampleFlags: number;
        constructor(trackId: number, defaultSampleDescriptionIndex: number, defaultSampleDuration: number, defaultSampleSize: number, defaultSampleFlags: number);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    class MovieExtendsBox extends BoxContainerBox {
        header: Box;
        tracDefaults: TrackExtendsBox[];
        levels: Box;
        constructor(header: Box, tracDefaults: TrackExtendsBox[], levels: Box);
    }
    class MetaBox extends FullBox {
        handler: Box;
        otherBoxes: Box[];
        constructor(handler: Box, otherBoxes: Box[]);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    class MovieFragmentHeaderBox extends FullBox {
        sequenceNumber: number;
        constructor(sequenceNumber: number);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    const enum TrackFragmentFlags {
        BASE_DATA_OFFSET_PRESENT = 1,
        SAMPLE_DESCRIPTION_INDEX_PRESENT = 2,
        DEFAULT_SAMPLE_DURATION_PRESENT = 8,
        DEFAULT_SAMPLE_SIZE_PRESENT = 16,
        DEFAULT_SAMPLE_FLAGS_PRESENT = 32,
    }
    class TrackFragmentHeaderBox extends FullBox {
        trackId: number;
        baseDataOffset: number;
        sampleDescriptionIndex: number;
        defaultSampleDuration: number;
        defaultSampleSize: number;
        defaultSampleFlags: number;
        constructor(flags: number, trackId: number, baseDataOffset: number, sampleDescriptionIndex: number, defaultSampleDuration: number, defaultSampleSize: number, defaultSampleFlags: number);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    class TrackFragmentBaseMediaDecodeTimeBox extends FullBox {
        baseMediaDecodeTime: number;
        constructor(baseMediaDecodeTime: number);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    class TrackFragmentBox extends BoxContainerBox {
        header: TrackFragmentHeaderBox;
        decodeTime: TrackFragmentBaseMediaDecodeTimeBox;
        run: TrackRunBox;
        constructor(header: TrackFragmentHeaderBox, decodeTime: TrackFragmentBaseMediaDecodeTimeBox, run: TrackRunBox);
    }
    const enum SampleFlags {
        IS_LEADING_MASK = 201326592,
        SAMPLE_DEPENDS_ON_MASK = 50331648,
        SAMPLE_DEPENDS_ON_OTHER = 16777216,
        SAMPLE_DEPENDS_ON_NO_OTHERS = 33554432,
        SAMPLE_IS_DEPENDED_ON_MASK = 12582912,
        SAMPLE_HAS_REDUNDANCY_MASK = 3145728,
        SAMPLE_PADDING_VALUE_MASK = 917504,
        SAMPLE_IS_NOT_SYNC = 65536,
        SAMPLE_DEGRADATION_PRIORITY_MASK = 65535,
    }
    const enum TrackRunFlags {
        DATA_OFFSET_PRESENT = 1,
        FIRST_SAMPLE_FLAGS_PRESENT = 4,
        SAMPLE_DURATION_PRESENT = 256,
        SAMPLE_SIZE_PRESENT = 512,
        SAMPLE_FLAGS_PRESENT = 1024,
        SAMPLE_COMPOSITION_TIME_OFFSET = 2048,
    }
    interface TrackRunSample {
        duration?: number;
        size?: number;
        flags?: number;
        compositionTimeOffset?: number;
    }
    class TrackRunBox extends FullBox {
        samples: TrackRunSample[];
        dataOffset: number;
        firstSampleFlags: number;
        constructor(flags: number, samples: TrackRunSample[], dataOffset?: number, firstSampleFlags?: number);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    class MovieFragmentBox extends BoxContainerBox {
        header: MovieFragmentHeaderBox;
        trafs: TrackFragmentBox[];
        constructor(header: MovieFragmentHeaderBox, trafs: TrackFragmentBox[]);
    }
    class MediaDataBox extends Box {
        chunks: Uint8Array[];
        constructor(chunks: Uint8Array[]);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    class SampleEntry extends Box {
        dataReferenceIndex: number;
        constructor(format: string, dataReferenceIndex: number);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    class AudioSampleEntry extends SampleEntry {
        channelCount: number;
        sampleSize: number;
        sampleRate: number;
        otherBoxes: Box[];
        constructor(codingName: string, dataReferenceIndex: number, channelCount?: number, sampleSize?: number, sampleRate?: number, otherBoxes?: Box[]);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    let COLOR_NO_ALPHA_VIDEO_SAMPLE_DEPTH: number;
    class VideoSampleEntry extends SampleEntry {
        width: number;
        height: number;
        compressorName: string;
        horizResolution: number;
        vertResolution: number;
        frameCount: number;
        depth: number;
        otherBoxes: Box[];
        constructor(codingName: string, dataReferenceIndex: number, width: number, height: number, compressorName?: string, horizResolution?: number, vertResolution?: number, frameCount?: number, depth?: number, otherBoxes?: Box[]);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
    class RawTag extends Box {
        data: Uint8Array;
        constructor(type: string, data: Uint8Array);
        layout(offset: number): number;
        write(data: Uint8Array): number;
    }
}
/**
 * Copyright 2015 Mozilla Foundation
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
declare module RtmpJs.MP4 {
    interface MP4Track {
        codecDescription?: string;
        codecId: number;
        language: string;
        timescale: number;
        samplerate?: number;
        channels?: number;
        samplesize?: number;
        framerate?: number;
        width?: number;
        height?: number;
    }
    interface MP4Metadata {
        tracks: MP4Track[];
        duration: number;
        audioTrackId: number;
        videoTrackId: number;
    }
    class MP4Mux {
        private metadata;
        private filePos;
        private cachedPackets;
        private trackStates;
        private audioTrackState;
        private videoTrackState;
        private state;
        private chunkIndex;
        oncodecinfo: (codecs: string[]) => void;
        ondata: (data: any) => void;
        constructor(metadata: MP4Metadata);
        pushPacket(type: number, data: Uint8Array, timestamp: number): void;
        flush(): void;
        private _checkIfNeedHeaderData();
        private _tryGenerateHeader();
        _chunk(): void;
    }
    function parseFLVMetadata(metadata: any): MP4Metadata;
}
/**
 * Copyright 2015 Mozilla Foundation
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
declare module RtmpJs.FLV {
    interface FLVHeader {
        hasAudio: boolean;
        hasVideo: boolean;
        extra: Uint8Array;
    }
    interface FLVTag {
        type: number;
        needPreprocessing: boolean;
        timestamp: number;
        data: Uint8Array;
    }
    class FLVParser {
        private state;
        private buffer;
        private bufferSize;
        private previousTagSize;
        onHeader: (header: FLVHeader) => void;
        onTag: (tag: FLVTag) => void;
        onClose: () => void;
        onError: (error: any) => void;
        constructor();
        push(data: Uint8Array): void;
        private _error(message);
        close(): void;
    }
}
declare module Shumway.flash.lang {
    const enum CONSTANT {
        Undefined = 0,
        Utf8 = 1,
        Float = 2,
        Int = 3,
        UInt = 4,
        PrivateNs = 5,
        Double = 6,
        QName = 7,
        Namespace = 8,
        Multiname = 9,
        False = 10,
        True = 11,
        Null = 12,
        QNameA = 13,
        MultinameA = 14,
        RTQName = 15,
        RTQNameA = 16,
        RTQNameL = 17,
        RTQNameLA = 18,
        NameL = 19,
        NameLA = 20,
        NamespaceSet = 21,
        PackageNamespace = 22,
        PackageInternalNs = 23,
        ProtectedNamespace = 24,
        ExplicitNamespace = 25,
        StaticProtectedNs = 26,
        MultinameL = 27,
        MultinameLA = 28,
        TypeName = 29,
        ClassSealed = 1,
        ClassFinal = 2,
        ClassInterface = 4,
        ClassProtectedNs = 8,
    }
    function getCONSTANTName(constant: CONSTANT): string;
    const enum NamespaceType {
        Public = 0,
        Protected = 1,
        PackageInternal = 2,
        Private = 3,
        Explicit = 4,
        StaticProtected = 5,
    }
    function getNamespaceTypeName(namespaceType: NamespaceType): string;
    class Namespace {
        type: NamespaceType;
        uri: string;
        prefix: string;
        mangledName: string;
        constructor(type: NamespaceType, uri: string, prefix: string);
        toString(): string;
        private static _knownNames;
        private static _hashNamespace(type, uri, prefix);
        private mangleName();
        isPublic(): boolean;
        readonly reflectedURI: string;
        static PUBLIC: Namespace;
    }
    function internNamespace(type: NamespaceType, uri: string): Namespace;
    function internPrefixedNamespace(type: NamespaceType, uri: string, prefix: string): Namespace;
    interface ILoaderInfo {
        app: IApplicationDomain;
        url: string;
    }
    interface IApplicationDomain {
        loadABC(file: ABCFile): void;
        loadAndExecuteABC(file: ABCFile): void;
    }
    class ABCFile {
        constructor(loaderInfo: ILoaderInfo, _buffer: Uint8Array);
    }
    class Multiname {
        abc: ABCFile;
        index: number;
        kind: CONSTANT;
        namespaces: Namespace[];
        name: any;
        parameterType: Multiname;
        private static _nextID;
        id: number;
        private _mangledName;
        constructor(abc: ABCFile, index: number, kind: CONSTANT, namespaces: Namespace[], name: any, parameterType?: Multiname);
        static FromFQNString(fqn: string, nsType: NamespaceType): Multiname;
        private _nameToString();
        isRuntime(): boolean;
        isRuntimeName(): boolean;
        isRuntimeNamespace(): boolean;
        isAnyName(): boolean;
        isAnyNamespace(): boolean;
        isQName(): boolean;
        readonly namespace: Namespace;
        readonly uri: string;
        prefix: string;
        equalsQName(mn: Multiname): boolean;
        matches(mn: Multiname): boolean;
        isAttribute(): boolean;
        getMangledName(): string;
        private _mangleName();
        getPublicMangledName(): any;
        static isPublicQualifiedName(value: any): boolean;
        static getPublicMangledName(name: string): any;
        toFQNString(useColons: boolean): string;
        toString(): string;
        toFlashlogString(): string;
        /**
         * Removes the public prefix, or returns undefined if the prefix doesn't exist.
         */
        static stripPublicMangledName(name: string): any;
        static FromSimpleName(simpleName: string): Multiname;
    }
}
declare module Shumway.flash.lang {
    import LegacyClass = system.LegacyClass;
    interface NativeClassLoaderName {
        name: string;
        alias: string;
        nsType: NamespaceType;
    }
    let nativeClassLoaderNames: Array<NativeClassLoaderName>;
    function registerNativeClass(name: string, asClass: LegacyClass, alias?: string, nsType?: NamespaceType): void;
    function registerNativeFunction(path: string, fun: Function): void;
    function createLegacyClass(name: Multiname, proto: LegacyClass): any;
    function getNativeClass(name: Multiname): any;
}
declare module Shumway {
    let timelineBuffer: Tools.Profiler.TimelineBuffer;
    let counter: Metrics.Counter;
    function countTimeline(name: string, value?: number): void;
    function enterTimeline(name: string, data?: any): void;
    function leaveTimeline(data?: any): void;
}
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
declare module Shumway {
    interface HTMLParserHandler {
        comment?: (text: string) => void;
        chars?: (text: string) => void;
        start?: (tag: string, attrs: any, unary: boolean) => void;
        end?: (tag: string) => void;
    }
    function HTMLParser(html: string, handler: HTMLParserHandler): void;
}
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
declare module Shumway {
    import Bounds = Shumway.Bounds;
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import flash = Shumway.flash;
    const enum TextContentFlags {
        None = 0,
        DirtyBounds = 1,
        DirtyContent = 2,
        DirtyStyle = 4,
        DirtyFlow = 8,
        Dirty = 15,
    }
    class TextContent implements Shumway.Remoting.IRemotable {
        _id: number;
        _sec: flash.system.ISecurityDomain;
        private _bounds;
        private _plainText;
        private _backgroundColor;
        private _borderColor;
        private _autoSize;
        private _wordWrap;
        private _scrollV;
        private _scrollH;
        flags: number;
        defaultTextFormat: flash.text.TextFormat;
        textRuns: flash.text.TextRun[];
        textRunData: DataBuffer;
        matrix: flash.geom.Matrix;
        coords: number[];
        constructor(sec: flash.system.ISecurityDomain, defaultTextFormat?: flash.text.TextFormat);
        parseHtml(htmlText: string, styleSheet: flash.text.StyleSheet, multiline: boolean): void;
        plainText: string;
        bounds: Bounds;
        autoSize: number;
        wordWrap: boolean;
        scrollV: number;
        scrollH: number;
        backgroundColor: number;
        borderColor: number;
        private _serializeTextRuns();
        private _writeTextRun(textRun);
        appendText(newText: string, format?: flash.text.TextFormat): void;
        prependText(newText: string, format?: flash.text.TextFormat): void;
        replaceText(beginIndex: number, endIndex: number, newText: string, format?: flash.text.TextFormat): void;
    }
}
declare module Shumway {
    let flashOptions: any;
    let traceEventsOption: any;
    let traceLoaderOption: any;
    let disableAudioOption: any;
    let webAudioOption: any;
    let webAudioMP3Option: any;
    let mediaSourceOption: any;
    let mediaSourceMP3Option: any;
    let flvOption: any;
}
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
declare module Shumway.Timeline {
    import Bounds = Shumway.Bounds;
    interface IAssetResolver {
        registerFont(symbol: Timeline.EagerlyResolvedSymbol, data: Uint8Array): void;
        registerImage(symbol: Timeline.EagerlyResolvedSymbol, imageType: ImageType, data: Uint8Array, alphaData: Uint8Array): void;
    }
    interface EagerlyResolvedSymbol {
        syncId: number;
        id: number;
        ready: boolean;
        resolveAssetPromise: PromiseWrapper<any>;
        resolveAssetCallback: (data: any) => void;
    }
    interface SymbolData {
        id: number;
        className: string;
        env: flash.lang.ILoaderInfo;
    }
    /**
     * TODO document
     */
    class Symbol {
        ready: boolean;
        resolveAssetPromise: PromiseWrapper<any>;
        data: any;
        isAVM1Object: boolean;
        avm1Context: any;
        symbolClass: flash.system.LegacyClass;
        constructor(data: SymbolData, symbolDefaultClass: flash.system.LegacyClass);
        readonly id: number;
    }
    class DisplaySymbol extends Symbol {
        fillBounds: Bounds;
        lineBounds: Bounds;
        scale9Grid: Bounds;
        dynamic: boolean;
        constructor(data: SymbolData, symbolClass: flash.system.LegacyClass, dynamic: boolean);
        _setBoundsFromData(data: any): void;
    }
    class BinarySymbol extends Symbol {
        buffer: Uint8Array;
        byteLength: number;
        constructor(data: SymbolData, sec: flash.system.ISecurityDomain);
        static FromData(data: any, loaderInfo: flash.display.LoaderInfo): BinarySymbol;
    }
    class SoundStart {
        soundId: number;
        soundInfo: any;
        constructor(soundId: number, soundInfo: any);
    }
}
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
declare module Shumway.flash.geom {
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import Bounds = Shumway.Bounds;
    class Matrix extends LegacyEntity {
        static axClass: typeof Matrix;
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        _data: Float64Array;
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
        /**
         * this = this * other
         */
        concat(other: Matrix): void;
        /**
         * this = other * this
         */
        preMultiply(other: Matrix): void;
        /**
         * target = other * this
         */
        preMultiplyInto(other: Matrix, target: Matrix): void;
        invert(): void;
        invertInto(target: Matrix): void;
        identity(): void;
        createBox(scaleX: number, scaleY: number, rotation?: number, tx?: number, ty?: number): void;
        createGradientBox(width: number, height: number, rotation?: number, tx?: number, ty?: number): void;
        rotate(angle: number): void;
        translate(dx: number, dy: number): void;
        scale(sx: number, sy: number): void;
        deltaTransformPoint(point: Point): Point;
        transformX(x: number, y: number): number;
        transformY(x: number, y: number): number;
        transformPoint(point: Point): Point;
        transformPointInPlace(point: Point): Point;
        transformBounds(bounds: Bounds): void;
        getDeterminant(): number;
        getScaleX(): number;
        getScaleY(): number;
        getAbsoluteScaleX(): number;
        getAbsoluteScaleY(): number;
        getSkewX(): number;
        getSkewY(): number;
        copyFrom(other: Matrix): void;
        copyFromUntyped(object: any): void;
        setTo(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        toTwipsInPlace(): Matrix;
        toPixelsInPlace(): Matrix;
        toSerializedScaleInPlace(): Matrix;
        copyRowTo(row: number, vector3D: Vector3D): void;
        copyColumnTo(column: number, vector3D: Vector3D): void;
        copyRowFrom(row: number, vector3D: Vector3D): void;
        copyColumnFrom(column: number, vector3D: Vector3D): void;
        /**
         * Updates the scale and skew componenets of the matrix.
         */
        updateScaleAndRotation(scaleX: number, scaleY: number, skewX: number, skewY: number): void;
        clone(): Matrix;
        equals(other: Matrix): boolean;
        toString(): string;
        writeExternal(output: DataBuffer): void;
    }
}
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
declare module Shumway.flash.geom {
    class Matrix3D extends LegacyEntity {
        _matrix: Float32Array;
        private _displayObject;
        constructor(v?: any);
        static interpolate(thisMat: flash.geom.Matrix3D, toMat: flash.geom.Matrix3D, percent: number): flash.geom.Matrix3D;
        setTargetDisplayObject(object: flash.display.DisplayObject): void;
        resetTargetDisplayObject(): void;
        rawData: any;
        position: flash.geom.Vector3D;
        readonly determinant: number;
        clone(): flash.geom.Matrix3D;
        copyToMatrix3D(dest: flash.geom.Matrix3D): void;
        append(lhs: flash.geom.Matrix3D): void;
        prepend(rhs: flash.geom.Matrix3D): void;
        invert(): boolean;
        identity(): void;
        decompose(orientationStyle?: string): Float64Array;
        recompose(components: Float64Array, orientationStyle?: string): boolean;
        appendTranslation(x: number, y: number, z: number): void;
        appendRotation(degrees: number, axis: flash.geom.Vector3D, pivotPoint?: flash.geom.Vector3D): void;
        appendScale(xScale: number, yScale: number, zScale: number): void;
        prependTranslation(x: number, y: number, z: number): void;
        prependRotation(degrees: number, axis: flash.geom.Vector3D, pivotPoint?: flash.geom.Vector3D): void;
        prependScale(xScale: number, yScale: number, zScale: number): void;
        transformVector(v: flash.geom.Vector3D): flash.geom.Vector3D;
        deltaTransformVector(v: flash.geom.Vector3D): flash.geom.Vector3D;
        transformVectors(vin: any, vout: any): void;
        transpose(): void;
        pointAt(pos: flash.geom.Vector3D, at?: flash.geom.Vector3D, up?: flash.geom.Vector3D): void;
        interpolateTo(toMat: flash.geom.Matrix3D, percent: number): void;
        copyFrom(sourceMatrix3D: flash.geom.Matrix3D): void;
        copyRawDataTo(vector: any, index?: number, transpose?: boolean): void;
        copyRawDataFrom(vector: Float64Array, index?: number, transpose?: boolean): void;
        copyRowTo(row: number, vector3D: flash.geom.Vector3D): void;
        copyColumnTo(column: number, vector3D: flash.geom.Vector3D): void;
        copyRowFrom(row: number, vector3D: flash.geom.Vector3D): void;
        copyColumnFrom(column: number, vector3D: flash.geom.Vector3D): void;
    }
}
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
declare module Shumway.flash.geom {
    enum Orientation3D {
        EULER_ANGLES = "eulerAngles",
        AXIS_ANGLE = "axisAngle",
        QUATERNION = "quaternion",
    }
}
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
declare module Shumway.flash.geom {
    /**
     * Initial values for the projection as used in Flash. Only for `root` will a different center
     * be used: constructing an instance manually will get 250,250.
     */
    const enum DefaultPerspectiveProjection {
        FOV = 55,
        CenterX = 250,
        CenterY = 250,
    }
    class PerspectiveProjection extends LegacyEntity {
        constructor();
        _displayObject: flash.display.DisplayObject;
        _fieldOfView: number;
        _centerX: number;
        _centerY: number;
        fieldOfView: number;
        projectionCenter: flash.geom.Point;
        focalLength: number;
        toMatrix3D(): flash.geom.Matrix3D;
        clone(): PerspectiveProjection;
    }
}
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
declare module Shumway.flash.geom {
    class Point extends LegacyEntity {
        constructor(x?: number, y?: number);
        x: number;
        y: number;
        native_x: number;
        native_y: number;
        Point(x?: number, y?: number): void;
        readonly length: number;
        static interpolate(p1: Point, p2: Point, f: number): Point;
        static distance(p1: Point, p2: Point): number;
        static polar(length: number, angle: number): Point;
        clone(): Point;
        offset(dx: number, dy: number): void;
        equals(toCompare: Point): Boolean;
        subtract(v: Point): Point;
        add(v: Point): Point;
        normalize(thickness: number): void;
        copyFrom(sourcePoint: Point): void;
        setTo(x: number, y: number): void;
        toTwips(): Point;
        toPixels(): Point;
        round(): Point;
        toString(): string;
    }
}
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
declare module Shumway.flash.geom {
    class Rectangle extends LegacyEntity implements flash.utils.IExternalizable {
        x: number;
        y: number;
        width: number;
        height: number;
        constructor(x?: number, y?: number, width?: number, height?: number);
        native_x: number;
        native_y: number;
        native_width: number;
        native_height: number;
        left: number;
        right: number;
        top: number;
        bottom: number;
        topLeft: Point;
        bottomRight: Point;
        size: Point;
        readonly area: number;
        clone(): Rectangle;
        isEmpty(): boolean;
        setEmpty(): Rectangle;
        inflate(dx: number, dy: number): void;
        inflatePoint(point: Point): void;
        offset(dx: number, dy: number): void;
        offsetPoint(point: Point): void;
        contains(x: number, y: number): boolean;
        containsPoint(point: Point): boolean;
        containsRect(rect: Rectangle): boolean;
        intersection(toIntersect: Rectangle): Rectangle;
        intersects(toIntersect: Rectangle): boolean;
        intersectInPlace(clipRect: Rectangle): Rectangle;
        intersectInPlaceInt32(clipRect: Rectangle): Rectangle;
        union(toUnion: Rectangle): Rectangle;
        unionInPlace(toUnion: Rectangle): Rectangle;
        equals(toCompare: Rectangle): boolean;
        copyFrom(sourceRect: Rectangle): void;
        setTo(x: number, y: number, width: number, height: number): void;
        toTwips(): Rectangle;
        getBaseWidth(angle: number): number;
        getBaseHeight(angle: number): number;
        toPixels(): Rectangle;
        snapInPlace(): Rectangle;
        roundInPlace(): Rectangle;
        toString(): string;
        hashCode(): number;
        writeExternal(output: flash.utils.IDataOutput): void;
        readExternal(input: flash.utils.IDataInput): void;
    }
}
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
declare module Shumway.flash.geom {
    class Transform extends LegacyEntity {
        static classInitializer: any;
        private _displayObject;
        constructor(displayObject: flash.display.DisplayObject);
        matrix: flash.geom.Matrix;
        colorTransform: flash.geom.ColorTransform;
        readonly concatenatedMatrix: flash.geom.Matrix;
        readonly concatenatedColorTransform: flash.geom.ColorTransform;
        readonly pixelBounds: flash.geom.Rectangle;
        matrix3D: flash.geom.Matrix3D;
        getRelativeMatrix3D(relativeTo: flash.display.DisplayObject): flash.geom.Matrix3D;
        perspectiveProjection: flash.geom.PerspectiveProjection;
    }
}
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
declare module Shumway.flash.geom {
    class Utils3D extends LegacyEntity {
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static projectVector(m: flash.geom.Matrix3D, v: flash.geom.Vector3D): flash.geom.Vector3D;
        static projectVectors(m: flash.geom.Matrix3D, verts: Float64Array, projectedVerts: Float64Array, uvts: Float64Array): void;
        static pointTowards(percent: number, mat: flash.geom.Matrix3D, pos: flash.geom.Vector3D, at?: flash.geom.Vector3D, up?: flash.geom.Vector3D): flash.geom.Matrix3D;
    }
}
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
declare module Shumway.flash.geom {
    class Vector3D extends LegacyEntity {
        static classInitializer(): void;
        static Create(x: number, y: number, z: number, w: number): Vector3D;
        static X_AXIS: Vector3D;
        static Y_AXIS: Vector3D;
        static Z_AXIS: Vector3D;
        constructor(x?: number, y?: number, z?: number, w?: number);
        x: number;
        y: number;
        z: number;
        w: number;
        native_x: number;
        native_y: number;
        native_z: number;
        native_w: number;
        readonly length: number;
        readonly lengthSquared: number;
        static angleBetween(a: Vector3D, b: Vector3D): number;
        static distance(pt1: Vector3D, pt2: Vector3D): number;
        dotProduct(a: flash.geom.Vector3D): number;
        crossProduct(a: flash.geom.Vector3D): flash.geom.Vector3D;
        normalize(): number;
        scaleBy(s: number): void;
        incrementBy(a: flash.geom.Vector3D): void;
        decrementBy(a: flash.geom.Vector3D): void;
        add(a: flash.geom.Vector3D): flash.geom.Vector3D;
        subtract(a: flash.geom.Vector3D): flash.geom.Vector3D;
        negate(): void;
        equals(toCompare: flash.geom.Vector3D, allFour?: boolean): boolean;
        nearEquals(toCompare: flash.geom.Vector3D, tolerance: number, allFour?: boolean): boolean;
        project(): void;
        copyFrom(sourceVector3D: flash.geom.Vector3D): void;
        setTo(xa: number, ya: number, za: number): void;
        clone(): flash.geom.Vector3D;
        toString(): string;
    }
}
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
declare module Shumway.flash.accessibility {
    class Accessibility extends LegacyEntity {
        private static _active;
        static readonly active: boolean;
        static sendEvent(source: flash.display.DisplayObject, childID: number, eventType: number, nonHTML?: boolean): void;
        static updateProperties(): void;
    }
}
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
declare module Shumway.flash.accessibility {
    class AccessibilityImplementation extends LegacyEntity {
        stub: boolean;
        errno: number;
        get_accRole: (childID: number) => number;
        get_accName: (childID: number) => string;
        get_accValue: (childID: number) => string;
        get_accState: (childID: number) => number;
        get_accDefaultAction: (childID: number) => string;
        accDoDefaultAction: (childID: number) => void;
        isLabeledBy: (labelBounds: flash.geom.Rectangle) => boolean;
        getChildIDArray: () => any[];
        accLocation: (childID: number) => any;
        get_accSelection: () => any[];
        get_accFocus: () => number;
        accSelect: (operation: number, childID: number) => void;
        get_selectionAnchorIndex: () => any;
        get_selectionActiveIndex: () => any;
    }
}
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
declare module Shumway.flash.accessibility {
    class AccessibilityProperties extends LegacyEntity {
        name: string;
        description: string;
        shortcut: string;
        silent: boolean;
        forceSimple: boolean;
        noAutoLabeling: boolean;
    }
}
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
declare module Shumway.flash.events {
    class Event extends LegacyEntity {
        /**
         * http://stackoverflow.com/questions/16900176/as3enterframe-event-propagation-understanding-issue
         */
        static isBroadcastEventType(type: string): boolean;
        constructor(type: string, bubbles: boolean, cancelable: boolean);
        static ACTIVATE: string;
        static ADDED: string;
        static ADDED_TO_STAGE: string;
        static CANCEL: string;
        static CHANGE: string;
        static CLEAR: string;
        static CLOSE: string;
        static COMPLETE: string;
        static CONNECT: string;
        static COPY: string;
        static CUT: string;
        static DEACTIVATE: string;
        static ENTER_FRAME: string;
        static FRAME_CONSTRUCTED: string;
        static EXIT_FRAME: string;
        static FRAME_LABEL: string;
        static ID3: string;
        static INIT: string;
        static MOUSE_LEAVE: string;
        static OPEN: string;
        static PASTE: string;
        static REMOVED: string;
        static REMOVED_FROM_STAGE: string;
        static RENDER: string;
        static RESIZE: string;
        static SCROLL: string;
        static TEXT_INTERACTION_MODE_CHANGE: string;
        static SELECT: string;
        static SELECT_ALL: string;
        static SOUND_COMPLETE: string;
        static TAB_CHILDREN_CHANGE: string;
        static TAB_ENABLED_CHANGE: string;
        static TAB_INDEX_CHANGE: string;
        static UNLOAD: string;
        static FULLSCREEN: string;
        static CONTEXT3D_CREATE: string;
        static TEXTURE_READY: string;
        static VIDEO_FRAME: string;
        static SUSPEND: string;
        static AVM1_INIT: string;
        static AVM1_CONSTRUCT: string;
        static AVM1_LOAD: string;
        _type: string;
        _bubbles: boolean;
        _cancelable: boolean;
        _target: Object;
        _currentTarget: Object;
        _eventPhase: number;
        _stopPropagation: boolean;
        _stopImmediatePropagation: boolean;
        _isDefaultPrevented: boolean;
        /**
         * Some events don't participate in the normal capturing and bubbling phase.
         */
        _isBroadcastEvent: boolean;
        readonly type: string;
        readonly bubbles: boolean;
        readonly cancelable: boolean;
        readonly target: Object;
        readonly currentTarget: Object;
        readonly eventPhase: number;
        stopPropagation(): void;
        stopImmediatePropagation(): void;
        preventDefault(): void;
        isDefaultPrevented(): boolean;
        isBroadcastEvent(): boolean;
        clone(): Event;
        toString(): string;
        formatToString(className: string, ...args: string[]): string;
    }
}
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
declare module Shumway.flash.events {
    /**
     * Broadcast Events
     *
     * The logic here is pretty much copied from:
     * http://www.senocular.com/flash/tutorials/orderofoperations/
     */
    class BroadcastEventDispatchQueue {
        /**
         * The queues start off compact but can have null values if event targets are removed.
         * Periodically we compact them if too many null values exist.
         */
        private _queues;
        constructor();
        reset(): void;
        add(type: string, target: EventDispatcher): void;
        remove(type: string, target: EventDispatcher): void;
        dispatchEvent(event: flash.events.Event): void;
        getQueueLength(type: string): number;
    }
    /**
     * The EventDispatcher class is the base class for all classes that dispatch events.
     * The EventDispatcher class implements the IEventDispatcher interface and is the base class for
     * the DisplayObject class. The EventDispatcher class allows any object on the display list to be
     * an event target and as such, to use the methods of the IEventDispatcher interface.
     */
    class EventDispatcher extends LegacyEntity implements IEventDispatcher {
        private _target;
        private _captureListeners;
        private _targetOrBubblingListeners;
        protected _fieldsInitialized: boolean;
        preInit(): void;
        constructor(target?: flash.events.IEventDispatcher);
        protected _initializeFields(target: flash.events.IEventDispatcher): void;
        toString(): string;
        /**
         * Don't lazily construct listener lists if all we're doing is looking for listener types that
         * don't exist yet.
         */
        private _getListenersForType(useCapture, type);
        /**
         * Lazily construct listeners lists to avoid object allocation.
         */
        private _getListeners(useCapture);
        addEventListener(type: string, listener: EventHandler, useCapture?: boolean, priority?: number, useWeakReference?: boolean): void;
        removeEventListener(type: string, listener: EventHandler, useCapture?: boolean): void;
        private _hasTargetOrBubblingEventListener(type);
        private _hasCaptureEventListener(type);
        /**
         * Faster internal version of |hasEventListener| that doesn't do any argument checking.
         */
        private _hasEventListener(type);
        hasEventListener(type: string): boolean;
        willTrigger(type: string): boolean;
        /**
         * Check to see if we can skip event dispatching in case there are no event listeners
         * for this |event|.
         */
        private _skipDispatchEvent(event);
        dispatchEvent(event: Event): boolean;
        private static callListeners(list, event, target, currentTarget, eventPhase);
    }
}
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
declare module Shumway.flash.events {
    enum EventPhase {
        CAPTURING_PHASE = 1,
        AT_TARGET = 2,
        BUBBLING_PHASE = 3,
    }
}
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
declare module Shumway.flash.events {
    class TextEvent extends flash.events.Event {
        constructor(type: string, bubbles: boolean, cancelable: boolean, text: string);
        static LINK: string;
        static TEXT_INPUT: string;
        _text: string;
        text: string;
        clone(): Event;
        toString(): string;
        copyNativeData(event: flash.events.TextEvent): void;
    }
}
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
declare module Shumway.flash.events {
    class ErrorEvent extends flash.events.TextEvent {
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, text?: string, id?: number);
        static ERROR: string;
        _id: number;
        private setID(id);
        readonly errorID: number;
        clone(): Event;
        toString(): string;
    }
}
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
declare module Shumway.flash.events {
    class AsyncErrorEvent extends flash.events.ErrorEvent {
        error: system.LegacyError;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, text?: string, error?: system.LegacyError);
        clone(): Event;
        toString(): string;
    }
}
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
declare module Shumway.flash.events {
    class GameInputEvent extends flash.events.Event {
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        device: flash.ui.GameInputDevice;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, device?: flash.ui.GameInputDevice);
        static DEVICE_ADDED: string;
        static DEVICE_REMOVED: string;
    }
}
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
declare module Shumway.flash.events {
    class GestureEvent extends flash.events.Event {
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, phase?: string, localX?: number, localY?: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean);
        static GESTURE_TWO_FINGER_TAP: string;
        private _phase;
        private _localX;
        private _localY;
        private _ctrlKey;
        private _altKey;
        private _shiftKey;
        localX: number;
        localY: number;
        readonly stageX: number;
        readonly stageY: number;
        ctrlKey: boolean;
        altKey: boolean;
        shiftKey: boolean;
        phase: string;
        updateAfterEvent(): void;
        NativeCtor(phase: string, localX: number, localY: number, ctrlKey: boolean, altKey: boolean, shiftKey: boolean): void;
        clone(): Event;
        toString(): string;
    }
}
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
declare module Shumway.flash.events {
    class HTTPStatusEvent extends flash.events.Event {
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, status?: number);
        static HTTP_STATUS: string;
        static HTTP_RESPONSE_STATUS: string;
        private _status;
        responseHeaders: Array<net.URLRequestHeader>;
        responseURL: string;
        _setStatus(value: number): void;
        readonly status: number;
        clone(): Event;
        toString(): string;
    }
}
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
declare module Shumway.flash.events {
    interface EventHandler {
        (event: Event): void;
    }
    interface IEventDispatcher {
        addEventListener: (type: string, listener: EventHandler, useCapture?: boolean, priority?: number, useWeakReference?: boolean) => void;
        removeEventListener: (type: string, listener: EventHandler, useCapture?: boolean) => void;
        hasEventListener: (type: string) => boolean;
        willTrigger: (type: string) => boolean;
        dispatchEvent: (event: Event) => boolean;
    }
}
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
declare module Shumway.flash.events {
    class IOErrorEvent extends flash.events.ErrorEvent {
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, text?: string, id?: number);
        static IO_ERROR: string;
        static NETWORK_ERROR: string;
        static DISK_ERROR: string;
        static VERIFY_ERROR: string;
        clone(): Event;
        toString(): string;
    }
}
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
declare module Shumway.flash.events {
    class KeyboardEvent extends flash.events.Event {
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, charCodeValue?: number, keyCodeValue?: number, keyLocationValue?: number, ctrlKeyValue?: boolean, altKeyValue?: boolean, shiftKeyValue?: boolean);
        static KEY_DOWN: string;
        static KEY_UP: string;
        private _charCode;
        private _keyCode;
        private _keyLocation;
        private _ctrlKey;
        private _altKey;
        private _shiftKey;
        charCode: number;
        keyCode: number;
        keyLocation: number;
        ctrlKey: boolean;
        altKey: boolean;
        shiftKey: boolean;
        clone(): Event;
        toString(): string;
        updateAfterEvent(): void;
    }
}
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
declare module Shumway.flash.events {
    class MouseEvent extends flash.events.Event {
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, localX?: number, localY?: number, relatedObject?: flash.display.InteractiveObject, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, buttonDown?: boolean, delta?: number);
        static CLICK: string;
        static DOUBLE_CLICK: string;
        static MOUSE_DOWN: string;
        static MOUSE_MOVE: string;
        static MOUSE_OUT: string;
        static MOUSE_OVER: string;
        static MOUSE_UP: string;
        static RELEASE_OUTSIDE: string;
        static MOUSE_WHEEL: string;
        static ROLL_OUT: string;
        static ROLL_OVER: string;
        static MIDDLE_CLICK: string;
        static MIDDLE_MOUSE_DOWN: string;
        static MIDDLE_MOUSE_UP: string;
        static RIGHT_CLICK: string;
        static RIGHT_MOUSE_DOWN: string;
        static RIGHT_MOUSE_UP: string;
        static CONTEXT_MENU: string;
        /**
         * AS3 mouse event names don't match DOM even names, so map them here.
         */
        static typeFromDOMType(name: string): string;
        private _localX;
        private _localY;
        private _movementX;
        private _movementY;
        private _delta;
        private _position;
        private _ctrlKey;
        private _altKey;
        private _shiftKey;
        private _buttonDown;
        private _relatedObject;
        private _isRelatedObjectInaccessible;
        localX: number;
        localY: number;
        readonly stageX: Number;
        readonly stageY: Number;
        movementX: number;
        movementY: number;
        delta: number;
        ctrlKey: boolean;
        altKey: boolean;
        shiftKey: boolean;
        buttonDown: boolean;
        relatedObject: flash.display.InteractiveObject;
        isRelatedObjectInaccessible: boolean;
        updateAfterEvent(): void;
        private _getGlobalPoint();
        clone(): Event;
        toString(): string;
    }
}
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
declare module Shumway.flash.events {
    class NetStatusEvent extends flash.events.Event {
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, info?: Object);
        private _info;
        info: Object;
        static NET_STATUS: string;
        clone(): Event;
        toString(): string;
    }
}
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
declare module Shumway.flash.events {
    class ProgressEvent extends Event {
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, bytesLoaded?: number, bytesTotal?: number);
        static PROGRESS: string;
        static SOCKET_DATA: string;
        private _bytesLoaded;
        private _bytesTotal;
        bytesLoaded: number;
        bytesTotal: number;
        clone(): Event;
        toString(): string;
    }
}
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
declare module Shumway.flash.events {
    class SecurityErrorEvent extends flash.events.ErrorEvent {
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, text?: string, id?: number);
        static SECURITY_ERROR: string;
    }
}
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
declare module Shumway.flash.events {
    class StatusEvent extends flash.events.Event {
        private _code;
        private _level;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, code?: string, level?: string);
        level: string;
        code: string;
        clone(): Event;
        toString(): string;
        static STATUS: string;
    }
}
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
declare module Shumway.flash.events {
    class TimerEvent extends flash.events.Event {
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        static TIMER: string;
        static TIMER_COMPLETE: string;
        clone(): Event;
        toString(): string;
        updateAfterEvent(): void;
    }
}
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
declare module Shumway.flash.events {
    class TouchEvent extends flash.events.Event {
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, touchPointID?: number, isPrimaryTouchPoint?: boolean, localX?: number, localY?: number, sizeX?: number, sizeY?: number, pressure?: number, relatedObject?: flash.display.InteractiveObject, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean);
        static TOUCH_BEGIN: string;
        static TOUCH_END: string;
        static TOUCH_MOVE: string;
        static TOUCH_OVER: string;
        static TOUCH_OUT: string;
        static TOUCH_ROLL_OVER: string;
        static TOUCH_ROLL_OUT: string;
        static TOUCH_TAP: string;
        static PROXIMITY_BEGIN: string;
        static PROXIMITY_END: string;
        static PROXIMITY_MOVE: string;
        static PROXIMITY_OUT: string;
        static PROXIMITY_OVER: string;
        static PROXIMITY_ROLL_OUT: string;
        static PROXIMITY_ROLL_OVER: string;
        private _touchPointID;
        private _isPrimaryTouchPoint;
        private _localX;
        private _localY;
        private _sizeX;
        private _sizeY;
        private _pressure;
        private _relatedObject;
        private _ctrlKey;
        private _altKey;
        private _shiftKey;
        private _isRelatedObjectInaccessible;
        touchPointID: number;
        isPrimaryTouchPoint: boolean;
        localX: number;
        localY: number;
        sizeX: number;
        sizeY: number;
        pressure: number;
        relatedObject: display.InteractiveObject;
        ctrlKey: boolean;
        altKey: boolean;
        shiftKey: boolean;
        readonly stageX: number;
        readonly stageY: number;
        isRelatedObjectInaccessible: boolean;
        clone(): Event;
        toString(): string;
        updateAfterEvent(): void;
    }
}
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
declare module Shumway.flash.events {
    class UncaughtErrorEvent extends flash.events.ErrorEvent {
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(type?: string, bubbles?: boolean, cancelable?: boolean, error_in?: any);
        static UNCAUGHT_ERROR: string;
    }
}
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
declare module Shumway.flash.events {
    class UncaughtErrorEvents extends flash.events.EventDispatcher {
        constructor();
    }
}
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
declare module Shumway.flash.display {
    import Bounds = Shumway.Bounds;
    import geom = flash.geom;
    const enum DisplayObjectFlags {
        None = 0,
        /**
         * Display object is visible.
         */
        Visible = 1,
        /**
         * Display object has invalid line bounds.
         */
        InvalidLineBounds = 2,
        /**
         * Display object has invalid fill bounds.
         */
        InvalidFillBounds = 4,
        /**
         * Display object has an invalid matrix because one of its local properties: x, y, scaleX, ...
         * has been mutated.
         */
        InvalidMatrix = 8,
        /**
         * Display object has an invalid inverted matrix because its matrix has been mutated.
         */
        InvalidInvertedMatrix = 16,
        /**
         * Display object has an invalid concatenated matrix because its matrix or one of its
         * ancestor's matrices has been mutated.
         */
        InvalidConcatenatedMatrix = 32,
        /**
         * Display object has an invalid inverted concatenated matrix because its matrix or one of its
         * ancestor's matrices has been mutated. We don't always need to compute the inverted matrix.
         * This is why we use a sepearete invalid flag for it and don't roll it under the
         * |InvalidConcatenatedMatrix| flag.
         */
        InvalidInvertedConcatenatedMatrix = 64,
        /**
         * Display object has an invalid concatenated color transform because its color transform or
         * one of its ancestor's color transforms has been mutated.
         */
        InvalidConcatenatedColorTransform = 128,
        /**
         * The display object's constructor has been executed or any of the derived class constructors
         * have executed. It may be that the derived class doesn't call super, in such cases this flag
         * must be set manually elsewhere.
         */
        Constructed = 256,
        /**
         * Display object has been removed by the timeline but it no longer recieves any event.
         */
        Destroyed = 512,
        /**
         * Indicates wether an AVM1 load event needs to be dispatched on this display object.
         */
        NeedsLoadEvent = 1024,
        /**
         * Display object is owned by the timeline, meaning that it is under the control of the
         * timeline and that a reference to this object has not leaked into AS3 code via the
         * DisplayObjectContainer methods |getChildAt|,  |getChildByName| or through the execution of
         * the symbol class constructor.
         */
        OwnedByTimeline = 2048,
        /**
         * Display object is animated by the timeline. It may no longer be owned by the timeline
         * (|OwnedByTimeline|) but it is still animated by it. If AS3 code mutates any property on the
         * display object, this flag is cleared and further timeline mutations are ignored.
         */
        AnimatedByTimeline = 4096,
        /**
         * MovieClip object has reached a frame with a frame script or ran a frame script that attached
         * a new one to the current frame. To run the script, it has to be appended to the queue of
         * scripts.
         */
        HasFrameScriptPending = 8192,
        /**
         * DisplayObjectContainer contains at least one descendant with the HasFrameScriptPending flag
         * set.
         */
        ContainsFrameScriptPendingChildren = 16384,
        /**
         * Indicates whether this display object is a MorphShape or contains at least one descendant
         * that is.
         */
        ContainsMorph = 32768,
        /**
         * Indicates whether this display object should be cached as a bitmap. The display object may
         * be cached as bitmap even if this flag is not set, depending on whether any filters are
         * applied or if the bitmap is too large or we've run out of memory.
         */
        CacheAsBitmap = 65536,
        /**
         * Indicates whether an AVM1 timeline needs to initialize an object after place object
         * occurred.
         */
        HasPlaceObjectInitPending = 131072,
        /**
         * Indicates whether a transform.perspectiveProjection was set.
         */
        HasPerspectiveProjection = 262144,
        /**
         * Indicates whether this display object has dirty descendents. If this flag is set then the
         * subtree need to be synchronized.
         */
        DirtyDescendents = 536870912,
        /**
         * Used for serialization of layers
         */
        DirtyParents = 1073741824,
        /**
         * Masks flags that need to be propagated up when this display object gets added to a parent.
         */
        Bubbling = 536920064,
    }
    const enum DisplayObjectDirtyFlags {
        /**
         * Indicates whether this display object's matrix has changed since the last time it was
         * synchronized.
         */
        DirtyMatrix = 1,
        /**
         * Indicates whether this display object's children list is dirty.
         */
        DirtyChildren = 2,
        /**
         * Indicates whether this display object's graphics has changed since the last time it was
         * synchronized.
         */
        DirtyGraphics = 4,
        /**
         * Indicates whether this display object's text content has changed since the last time it was
         * synchronized.
         */
        DirtyTextContent = 8,
        /**
         * Indicates whether this display object's bitmap data has changed since the last time it was
         * synchronized.
         */
        DirtyBitmapData = 16,
        /**
         * Indicates whether this display object's bitmap data has changed since the last time it was
         * synchronized.
         */
        DirtyNetStream = 32,
        /**
         * Indicates whether this display object's color transform has changed since the last time it
         * was synchronized.
         */
        DirtyColorTransform = 64,
        /**
         * Indicates whether this display object's mask has changed since the last time it was
         * synchronized.
         */
        DirtyMask = 128,
        /**
         * Indicates whether this display object's clip depth has changed since the last time it was
         * synchronized.
         */
        DirtyClipDepth = 256,
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
        DirtyMiscellaneousProperties = 512,
        /**
         * All synchronizable properties are dirty.
         */
        Dirty = 1023,
    }
    /**
     * Controls how the visitor walks the display tree.
     */
    const enum VisitorFlags {
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
        Stop = 1,
        /**
         * Skip processing current node.
         */
        Skip = 2,
        /**
         * Visit front to back.
         */
        FrontToBack = 8,
        /**
         * Only visit the nodes matching a certain flag set.
         */
        Filter = 16,
    }
    const enum HitTestingType {
        HitTestBounds = 0,
        HitTestBoundsAndMask = 1,
        HitTestShape = 2,
        Mouse = 3,
        ObjectsUnderPoint = 4,
        Drop = 5,
    }
    const enum HitTestingResult {
        None = 0,
        Bounds = 1,
        Shape = 2,
    }
    interface IAdvancable extends Shumway.IReferenceCountable {
        _initFrame(advance: boolean): void;
        _constructFrame(): void;
    }
    class DisplayObject extends flash.events.EventDispatcher implements IBitmapDrawable, Shumway.Remoting.IRemotable {
        static axClass: typeof DisplayObject;
        /**
         * Every displayObject is assigned an unique integer ID.
         */
        static getNextSyncID(): number;
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        /**
         * Creates a new display object from a symbol and initializes its animated display properties.
         * Calling its constructor is optional at this point, since that can happen in a later frame
         * phase.
         */
        createAnimatedDisplayObject(symbol: Shumway.Timeline.DisplaySymbol, placeObjectTag: Shumway.SWF.Parser.PlaceObjectTag, callConstructor: boolean): DisplayObject;
        constructor();
        protected _initializeFields(): void;
        /**
         * Sets the object's initial name to adhere to the 'instanceN' naming scheme.
         */
        _setInitialName(): void;
        _setParent(parent: DisplayObjectContainer, depth: number): void;
        _setDepth(value: number): void;
        _setFillAndLineBoundsFromWidthAndHeight(width: number, height: number): void;
        _setFillAndLineBoundsFromSymbol(symbol: Timeline.DisplaySymbol): void;
        _setFlags(flags: DisplayObjectFlags): void;
        /**
         * Use this to set dirty flags so that we can also propagate the dirty child bit.
         */
        _setDirtyFlags(flags: DisplayObjectDirtyFlags): void;
        _removeDirtyFlags(flags: DisplayObjectDirtyFlags): void;
        _hasDirtyFlags(flags: DisplayObjectDirtyFlags): boolean;
        _hasAnyDirtyFlags(flags: DisplayObjectDirtyFlags): boolean;
        _toggleFlags(flags: DisplayObjectFlags, on: boolean): void;
        _removeFlags(flags: DisplayObjectFlags): void;
        _hasFlags(flags: DisplayObjectFlags): boolean;
        _hasAnyFlags(flags: DisplayObjectFlags): boolean;
        /**
         * Propagates flags up the display list. Propagation stops if all flags are already set.
         */
        _propagateFlagsUp(flags: DisplayObjectFlags): void;
        /**
         * Propagates flags down the display list. Non-containers just set the flags on themselves.
         *
         * Overridden in DisplayObjectContainer.
         */
        _propagateFlagsDown(flags: DisplayObjectFlags): void;
        _id: number;
        private _flags;
        private _dirtyFlags;
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
        _filters: any[];
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
        _children: DisplayObject[];
        /**
         *
         */
        _referenceCount: number;
        /**
         * Finds the nearest ancestor with a given set of flags that are either turned on or off.
         */
        private _findNearestAncestor(flags, on);
        _findFurthestAncestorOrSelf(): DisplayObject;
        /**
         * Tests if this display object is an ancestor of the specified display object.
         */
        _isAncestor(child: DisplayObject): boolean;
        /**
         * Clamps the rotation value to the range (-180, 180).
         */
        private static _clampRotation(value);
        /**
         * Used as a temporary array to avoid allocations.
         */
        private static _path;
        /**
         * Return's a list of ancestors excluding the |last|, the return list is reused.
         */
        private static _getAncestors(node, last);
        /**
         * Computes the combined transformation matrixes of this display object and all of its parents.
         * It is not the same as |transform.concatenatedMatrix|, the latter also includes the screen
         * space matrix.
         */
        _getConcatenatedMatrix(): flash.geom.Matrix;
        _getInvertedConcatenatedMatrix(): flash.geom.Matrix;
        _setMatrix(matrix: flash.geom.Matrix, toTwips: boolean): void;
        /**
         * Returns an updated matrix if the current one is invalid.
         */
        _getMatrix(): geom.Matrix;
        _getInvertedMatrix(): geom.Matrix;
        /**
         * Computes the combined transformation color matrixes of this display object and all of its
         * ancestors.
         */
        _getConcatenatedColorTransform(): flash.geom.ColorTransform;
        _setColorTransform(colorTransform: flash.geom.ColorTransform): void;
        /**
         * Invalidates the fill- and lineBounds of this display object along with all of its ancestors.
         */
        _invalidateFillAndLineBounds(fill: boolean, line: boolean): void;
        _invalidateParentFillAndLineBounds(fill: boolean, line: boolean): void;
        /**
         * Computes the bounding box for all of this display object's content, its graphics and all of
         * its children.
         */
        _getContentBounds(includeStrokes?: boolean): Bounds;
        /**
         * Empty base case: DisplayObject cannot have children, but several distinct subclasses can.
         * Overridden in DisplayObjectContainer, SimpleButton, and AVM1Movie.
         */
        _getChildBounds(bounds: Bounds, includeStrokes: boolean): void;
        /**
         * Gets the bounds of this display object relative to another coordinate space. The
         * transformation matrix from the local coordinate space to the target coordinate space is
         * computed using:
         *
         *   this.concatenatedMatrix * inverse(target.concatenatedMatrix)
         *
         * If the |targetCoordinateSpace| is |null| then assume the identity coordinate space.
         */
        _getTransformedBounds(targetCoordinateSpace: DisplayObject, includeStroke: boolean): Bounds;
        /**
         * Detaches this object from being animated by the timeline. This happens whenever a display
         * property of this object is changed by user code.
         */
        private _stopTimelineAnimation();
        /**
         * Marks this object as having its matrix changed.
         *
         * Propagates flags both up- and (via invalidatePosition) downwards, so is quite costly.
         * TODO: check if we can usefully combine all upwards-propagated flags here.
         */
        private _invalidateMatrix();
        /**
         * Marks this object as having been moved in its parent display object.
         */
        _invalidatePosition(): void;
        /**
         * Animates this object's display properties.
         */
        _animate(placeObjectTag: Shumway.SWF.Parser.PlaceObjectTag): void;
        /**
         * Dispatches an event on this object and all its descendants.
         */
        _propagateEvent(event: flash.events.Event): void;
        x: number;
        _getX(): number;
        y: number;
        _getY(): number;
        /**
         * In Flash player, this always returns a positive number for some reason. This however, is not
         * the case for scaleY.
         */
        scaleX: number;
        scaleY: number;
        scaleZ: number;
        rotation: number;
        rotationX: number;
        rotationY: number;
        rotationZ: number;
        /**
         * The width of this display object in its parent coordinate space.
         */
        /**
         * Attempts to change the width of this display object by changing its scaleX / scaleY
         * properties. The scaleX property is set to the specified |width| value / baseWidth
         * of the object in its parent cooridnate space with rotation applied.
         */
        width: number;
        _getWidth(): number;
        _setWidth(value: number): void;
        /**
         * The height of this display object in its parent coordinate space.
         */
        /**
         * Attempts to change the height of this display object by changing its scaleY / scaleX
         * properties. The scaleY property is set to the specified |height| value / baseHeight
         * of the object in its parent cooridnate space with rotation applied.
         */
        height: number;
        _getHeight(): number;
        _setHeight(value: number): void;
        /**
         * Sets the mask for this display object. This does not affect the bounds.
         */
        mask: DisplayObject;
        transform: flash.geom.Transform;
        _getTransform(): geom.Transform;
        private destroy();
        /**
         * Walks up the tree to find this display object's root. An object is classified
         * as a root if its _root property points to itself. Root objects are the Stage,
         * the main timeline object and a Loader's content.
         */
        readonly root: DisplayObject;
        /**
         * Walks up the tree to find this display object's stage, the first object whose
         * |_stage| property points to itself.
         */
        readonly stage: flash.display.Stage;
        _cacheStage: flash.display.Stage;
        name: string;
        readonly parent: DisplayObjectContainer;
        alpha: number;
        blendMode: string;
        scale9Grid: flash.geom.Rectangle;
        _getScale9Grid(): geom.Rectangle;
        /**
         * This is always true if a filter is applied.
         */
        cacheAsBitmap: boolean;
        _getCacheAsBitmap(): boolean;
        /**
         * References to the internal |_filters| array and its BitmapFilter objects are never leaked
         * outside of this class. The get/set filters accessors always return deep clones of this
         * array.
         */
        filters: Array<filters.BitmapFilter>;
        _getFilters(): filters.BitmapFilter[];
        /**
         * Marks this display object as visible / invisible. This does not affect the bounds.
         */
        visible: boolean;
        z: number;
        getBounds(targetCoordinateSpace: DisplayObject): flash.geom.Rectangle;
        getRect(targetCoordinateSpace: DisplayObject): flash.geom.Rectangle;
        /**
         * Converts a point from the global coordinate space into the local coordinate space.
         */
        globalToLocal(point: flash.geom.Point): flash.geom.Point;
        /**
         * Converts a point form the local coordinate sapce into the global coordinate space.
         */
        localToGlobal(point: flash.geom.Point): flash.geom.Point;
        globalToLocal3D(point: flash.geom.Point): flash.geom.Vector3D;
        localToGlobal3D(point: flash.geom.Point): flash.geom.Vector3D;
        local3DToGlobal(point3d: flash.geom.Vector3D): flash.geom.Point;
        /**
         * Tree visitor that lets you skip nodes or return early.
         */
        visit(visitor: (d: DisplayObject) => VisitorFlags, visitorFlags: VisitorFlags, displayObjectFlags?: DisplayObjectFlags): void;
        /**
         * Returns the loader info for this display object's root.
         */
        readonly loaderInfo: flash.display.LoaderInfo;
        /**
         * Only these objects can have graphics.
         */
        _canHaveGraphics(): boolean;
        /**
         * Gets the graphics object of this object. Shapes, MorphShapes, and Sprites override this.
         */
        _getGraphics(): flash.display.Graphics;
        /**
         * Only these objects can have text content.
         */
        _canHaveTextContent(): boolean;
        /**
         * Gets the text content of this object. StaticTexts and TextFields override this.
         */
        _getTextContent(): Shumway.TextContent;
        /**
         * Lazily construct a graphics object.
         */
        _ensureGraphics(): flash.display.Graphics;
        /**
         * Sets this object's graphics or text content. Happens when an animated Shape or StaticText
         * object is initialized from a symbol or replaced by a timeline command using the same symbol
         * as this object was initialized from.
         */
        _setStaticContentFromSymbol(symbol: Shumway.Timeline.DisplaySymbol): void;
        /**
         * Checks if the bounding boxes of two display objects overlap, this happens in the global
         * coordinate coordinate space.
         *
         * Two objects overlap even if one or both are not on the stage, as long as their bounds
         * in the global coordinate space overlap.
         */
        hitTestObject(other: DisplayObject): boolean;
        /**
         * The |globalX| and |globalY| arguments are in global coordinates. The |shapeFlag| indicates
         * whether the hit test should be on the actual shape of the object or just its bounding box.
         *
         * Note: shapeFlag is optional, but the type coercion will do the right thing for it, so we
         * don't need to take the overhead from being explicit about that.
         */
        hitTestPoint(globalX: number, globalY: number, shapeFlag: boolean): boolean;
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
        _containsPoint(globalX: number, globalY: number, localX: number, localY: number, testingType: HitTestingType, objects: DisplayObject[]): HitTestingResult;
        _containsGlobalPoint(globalX: number, globalY: number, testingType: HitTestingType, objects: DisplayObject[]): HitTestingResult;
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
        _boundsAndMaskContainPoint(globalX: number, globalY: number, localX: number, localY: number, testingType: HitTestingType): HitTestingResult;
        /**
         * Tests if the receiver's own visual content intersects with the given point.
         * In the base implementation, this just returns false, because not all DisplayObjects can
         * ever match.
         * Overridden in Shape, MorphShape, Sprite, Bitmap, Video, and TextField.
         */
        _containsPointDirectly(localX: number, localY: number, globalX: number, globalY: number): boolean;
        scrollRect: flash.geom.Rectangle;
        _getScrollRect(): flash.geom.Rectangle;
        /**
         * Sets the opaque background color. By default this is |null|, which indicates that no opaque
         * color is set. Otherwise this is an unsinged number.
         */
        opaqueBackground: any;
        /**
         * Returns the distance between this object and a given ancestor.
         */
        private _getDistance(ancestor);
        /**
         * Finds the nearest common ancestor with a given node.
         */
        findNearestCommonAncestor(node: DisplayObject): DisplayObject;
        /**
         * Returns the current mouse position relative to this object.
         */
        _getLocalMousePosition(): flash.geom.Point;
        readonly mouseX: number;
        readonly mouseY: number;
        debugName(withFlags?: boolean): string;
        debugNameShort(): string;
        hashCode(): number;
        getAncestorCount(): number;
        debugTrace(writer?: IndentingWriter, maxDistance?: number, name?: string): void;
        _addReference(): void;
        _removeReference(): void;
        /**
         * Returns script precedence sequence based on placeObjectTag. Creates every
         * time a new array, so it's safe to modify it.
         * @private
         */
        _getScriptPrecedence(): number[];
        accessibilityProperties: accessibility.AccessibilityProperties;
        blendShader: any;
        axSetPublicProperty(name: string, value: any): void;
        axGetPublicProperty(name: string): any;
    }
}
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
declare module Shumway.flash.display {
    class Bitmap extends flash.display.DisplayObject {
        static classInitializer: any;
        _symbol: BitmapSymbol;
        applySymbol(): void;
        static classSymbols: string[];
        static instanceSymbols: string[];
        preInit(): void;
        constructor(bitmapData?: flash.display.BitmapData, pixelSnapping?: string, smoothing?: boolean);
        _pixelSnapping: string;
        _smoothing: boolean;
        _bitmapData: flash.display.BitmapData;
        pixelSnapping: string;
        smoothing: boolean;
        bitmapData: flash.display.BitmapData;
        _getContentBounds(includeStrokes?: boolean): Bounds;
        _containsPointDirectly(localX: number, localY: number, globalX: number, globalY: number): boolean;
    }
}
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
declare module Shumway.flash.display {
    class Shape extends flash.display.DisplayObject {
        _symbol: ShapeSymbol;
        applySymbol(): void;
        preInit(): void;
        constructor();
        protected _initializeFields(): void;
        _canHaveGraphics(): boolean;
        _getGraphics(): flash.display.Graphics;
        readonly graphics: flash.display.Graphics;
        _containsPointDirectly(localX: number, localY: number, globalX: number, globalY: number): boolean;
    }
    class ShapeSymbol extends Timeline.DisplaySymbol {
        graphics: flash.display.Graphics;
        constructor(data: Timeline.SymbolData, symbolClass: system.LegacyClass);
        static FromData(data: Timeline.SymbolData, loaderInfo: flash.display.LoaderInfo): ShapeSymbol;
        processRequires(dependencies: any[], loaderInfo: flash.display.LoaderInfo): void;
    }
}
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
declare module Shumway.flash.display {
    class InteractiveObject extends flash.display.DisplayObject {
        constructor();
        protected _initializeFields(): void;
        _tabEnabled: boolean;
        _tabIndex: number;
        _focusRect: any;
        _mouseEnabled: boolean;
        _doubleClickEnabled: boolean;
        _accessibilityImplementation: flash.accessibility.AccessibilityImplementation;
        _softKeyboardInputAreaOfInterest: flash.geom.Rectangle;
        _needsSoftKeyboard: boolean;
        _contextMenu: flash.ui.ContextMenu;
        tabEnabled: boolean;
        tabIndex: number;
        /**
         * The given |focusRect| can be one of: |true|, |false| or |null|.
         */
        focusRect: any;
        mouseEnabled: boolean;
        doubleClickEnabled: boolean;
        accessibilityImplementation: flash.accessibility.AccessibilityImplementation;
        softKeyboardInputAreaOfInterest: flash.geom.Rectangle;
        needsSoftKeyboard: boolean;
        contextMenu: flash.ui.ContextMenu;
        requestSoftKeyboard(): boolean;
    }
}
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
declare module Shumway.flash.display {
    class SimpleButton extends flash.display.InteractiveObject {
        static axClass: typeof SimpleButton;
        static classInitializer: any;
        _symbol: ButtonSymbol;
        applySymbol(): void;
        protected _initializeFields(): void;
        static classSymbols: string[];
        static instanceSymbols: string[];
        preInit(): void;
        constructor(upState?: flash.display.DisplayObject, overState?: flash.display.DisplayObject, downState?: flash.display.DisplayObject, hitTestState?: flash.display.DisplayObject);
        _initFrame(advance: boolean): void;
        _constructFrame(): void;
        private _useHandCursor;
        private _enabled;
        private _trackAsMenu;
        private _upState;
        private _overState;
        private _downState;
        private _hitTestState;
        private _currentState;
        useHandCursor: boolean;
        enabled: boolean;
        trackAsMenu: boolean;
        upState: flash.display.DisplayObject;
        overState: flash.display.DisplayObject;
        downState: flash.display.DisplayObject;
        hitTestState: flash.display.DisplayObject;
        soundTransform: flash.media.SoundTransform;
        /**
         * Override of DisplayObject#_containsPoint that applies the test on hitTestState if
         * that is defined.
         */
        _containsPoint(globalX: number, globalY: number, localX: number, localY: number, testingType: HitTestingType, objects: DisplayObject[]): HitTestingResult;
        /**
         * Override of DisplayObject#_getChildBounds that retrieves the current hitTestState's bounds.
         */
        _getChildBounds(bounds: Bounds, includeStrokes: boolean): void;
        _propagateFlagsDown(flags: DisplayObjectFlags): void;
        _updateButton(): void;
    }
    class ButtonState {
        symbol: Timeline.DisplaySymbol;
        placeObjectTag: SWF.Parser.PlaceObjectTag;
        constructor(symbol: Timeline.DisplaySymbol, placeObjectTag: SWF.Parser.PlaceObjectTag);
    }
    class ButtonSymbol extends Timeline.DisplaySymbol {
        [keyState: string]: any;
        upState: ButtonState;
        overState: ButtonState;
        downState: ButtonState;
        hitTestState: ButtonState;
        loaderInfo: flash.display.LoaderInfo;
        constructor(data: Timeline.SymbolData, loaderInfo: flash.display.LoaderInfo);
        static FromData(data: any, loaderInfo: flash.display.LoaderInfo): ButtonSymbol;
    }
}
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
declare module Shumway.flash.display {
    const enum LookupChildOptions {
        DEFAULT = 0,
        IGNORE_CASE = 1,
        INCLUDE_NON_INITIALIZED = 2,
    }
    class DisplayObjectContainer extends flash.display.InteractiveObject {
        constructor();
        protected _initializeFields(): void;
        private _tabChildren;
        private _mouseChildren;
        /**
         * This object's children have changed.
         */
        private _invalidateChildren();
        /**
         * Propagates flags down the display list. Propagation stops if all flags are already set.
         */
        _propagateFlagsDown(flags: DisplayObjectFlags): void;
        /**
         * Calls the constructors of new children placed by timeline commands.
         */
        _constructChildren(): void;
        _enqueueFrameScripts(): void;
        readonly numChildren: number;
        _getNumChildren(): number;
        readonly textSnapshot: flash.text.TextSnapshot;
        tabChildren: boolean;
        _getTabChildren(): boolean;
        _setTabChildren(enable: boolean): void;
        mouseChildren: boolean;
        _getMouseChildren(): boolean;
        _setMouseChildren(enable: boolean): void;
        addChild(child: DisplayObject): DisplayObject;
        /**
         * Adds a child at a given index. The index must be within the range [0 ... children.length].
         * Note that this is different than the range setChildIndex expects.
         */
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        /**
         * Adds a timeline object to this container. The new child is added after the last object that
         * exists at a smaller depth, or before the first object that exists at a greater depth. If no
         * other timeline object is found, the new child is added to the front(top) of all other
         * children.
         *
         * Note that this differs from `addChildAt` in that the depth isn't an index in the `children`
         * array, and doesn't have to be in the dense range [0..children.length].
         */
        addTimelineObjectAtDepth(child: flash.display.DisplayObject, depth: number): void;
        removeChild(child: DisplayObject): DisplayObject;
        removeChildAt(index: number): DisplayObject;
        getChildIndex(child: DisplayObject): number;
        /**
         * Sets the index of a child. The index must be within the range [0 ... children.length - 1].
         */
        setChildIndex(child: DisplayObject, index: number): void;
        getChildAt(index: number): DisplayObject;
        /**
         * Returns the timeline object that exists at the specified depth.
         */
        getTimelineObjectAtDepth(depth: number): flash.display.DisplayObject;
        /**
         * Returns the last child index that is covered by the clip depth.
         */
        getClipDepthIndex(depth: number): number;
        getChildByName(name: string): DisplayObject;
        /**
         * Returns the child display object instance that exists at given index without creating a
         * reference nor taking ownership.
         */
        _lookupChildByIndex(index: number, options: LookupChildOptions): DisplayObject;
        /**
         * Returns the child display object that exists with given name without creating a reference
         * nor taking ownership.
         */
        _lookupChildByName(name: string, options: LookupChildOptions): DisplayObject;
        /**
         * Override of DisplayObject#_containsPoint that takes children into consideration.
         */
        _containsPoint(globalX: number, globalY: number, localX: number, localY: number, testingType: HitTestingType, objects: DisplayObject[]): HitTestingResult;
        _containsPointImpl(globalX: number, globalY: number, localX: number, localY: number, testingType: HitTestingType, objects: DisplayObject[], skipBoundsCheck: boolean): HitTestingResult;
        private _getUnclippedChildren(testingType, globalX, globalY);
        /**
         * Override of DisplayObject#_getChildBounds that union all childrens's
         * bounds into the bounds.
         */
        _getChildBounds(bounds: Bounds, includeStrokes: boolean): void;
        /**
         * Returns an array of all leaf objects under the given point in global coordinates.
         * A leaf node in this context is an object that itself contains visual content, so it can be
         * any of Shape, Sprite, MovieClip, Bitmap, Video, and TextField.
         * Note that, while the Flash documentation makes it sound like it doesn't, the result also
         * contains the receiver object if that matches the criteria above.
         */
        getObjectsUnderPoint(globalPoint: flash.geom.Point): Array<any>;
        areInaccessibleObjectsUnderPoint(point: flash.geom.Point): boolean;
        contains(child: DisplayObject): boolean;
        swapChildrenAt(index1: number, index2: number): void;
        private _swapChildrenAt(index1, index2);
        swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        removeChildren(beginIndex?: number, endIndex?: number): void;
        hashCode(): number;
        /**
         * This is a very slow recursive function that should not be used in performance critical code.
         */
        getAncestorCount(): number;
    }
}
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
declare module Shumway.flash.display {
    enum JointStyle {
        ROUND = "round",
        BEVEL = "bevel",
        MITER = "miter",
    }
    namespace JointStyle {
        function fromNumber(n: number): JointStyle;
        function toNumber(value: string): number;
    }
}
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
declare module Shumway.flash.display {
    enum CapsStyle {
        ROUND = "round",
        NONE = "none",
        SQUARE = "square",
    }
    namespace CapsStyle {
        function fromNumber(n: number): string;
        function toNumber(value: string): number;
    }
}
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
declare module Shumway.flash.display {
    enum LineScaleMode {
        NORMAL = "normal",
        VERTICAL = "vertical",
        HORIZONTAL = "horizontal",
        NONE = "none",
    }
    namespace LineScaleMode {
        function fromNumber(n: number): string;
        function toNumber(value: string): number;
    }
}
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
declare module Shumway.flash.display {
    enum GradientType {
        LINEAR = "linear",
        RADIAL = "radial",
    }
    namespace GradientType {
        function fromNumber(n: number): string;
        function toNumber(value: string): number;
    }
}
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
declare module Shumway.flash.display {
    enum SpreadMethod {
        PAD = "pad",
        REFLECT = "reflect",
        REPEAT = "repeat",
    }
    namespace SpreadMethod {
        function fromNumber(n: number): string;
        function toNumber(value: string): number;
    }
}
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
declare module Shumway.flash.display {
    enum InterpolationMethod {
        RGB = "rgb",
        LINEAR_RGB = "linearRGB",
    }
    namespace InterpolationMethod {
        function fromNumber(n: number): string;
        function toNumber(value: string): number;
    }
}
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
declare module Shumway.flash.display {
    class GraphicsBitmapFill extends LegacyEntity implements IGraphicsFill, IGraphicsData {
        constructor(bitmapData?: flash.display.BitmapData, matrix?: flash.geom.Matrix, repeat?: boolean, smooth?: boolean);
        bitmapData: flash.display.BitmapData;
        matrix: flash.geom.Matrix;
        repeat: boolean;
        smooth: boolean;
    }
}
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
declare module Shumway.flash.display {
    class GraphicsEndFill extends LegacyEntity implements IGraphicsFill, IGraphicsData {
        constructor();
    }
}
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
declare module Shumway.flash.display {
    class GraphicsGradientFill extends LegacyEntity implements IGraphicsFill, IGraphicsData {
        constructor(type?: GradientType, colors?: Array<number>, alphas?: Array<number>, ratios?: Array<number>, matrix?: any, spreadMethod?: SpreadMethod, interpolationMethod?: InterpolationMethod, focalPointRatio?: number);
        colors: Array<number>;
        alphas: Array<number>;
        ratios: Array<number>;
        matrix: flash.geom.Matrix;
        focalPointRatio: number;
        type: string;
        spreadMethod: any;
        interpolationMethod: string;
    }
}
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
declare module Shumway.flash.display {
    class GraphicsPath extends LegacyEntity implements IGraphicsPath, IGraphicsData {
        constructor(commands?: ArrayLike<number>, data?: ArrayLike<number>, winding?: string);
        commands: ArrayLike<number>;
        data: ArrayLike<number>;
        _winding: string;
        winding: string;
        moveTo: (x: number, y: number) => void;
        lineTo: (x: number, y: number) => void;
        curveTo: (controlX: number, controlY: number, anchorX: number, anchorY: number) => void;
        cubicCurveTo: (controlX1: number, controlY1: number, controlX2: number, controlY2: number, anchorX: number, anchorY: number) => void;
        wideLineTo: (x: number, y: number) => void;
        wideMoveTo: (x: number, y: number) => void;
        ensureLists: () => void;
    }
}
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
declare module Shumway.flash.display {
    enum GraphicsPathCommand {
        NO_OP,
        MOVE_TO = 1,
        LINE_TO = 2,
        CURVE_TO = 3,
        WIDE_MOVE_TO = 4,
        WIDE_LINE_TO = 5,
        CUBIC_CURVE_TO = 6,
    }
}
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
declare module Shumway.flash.display {
    enum GraphicsPathWinding {
        EVEN_ODD = "evenOdd",
        NON_ZERO = "nonZero",
    }
}
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
declare module Shumway.flash.display {
    class GraphicsSolidFill extends LegacyEntity implements IGraphicsFill, IGraphicsData {
        constructor(color?: number, alpha?: number);
        color: number;
        alpha: number;
    }
}
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
declare module Shumway.flash.display {
    class GraphicsStroke extends LegacyEntity implements IGraphicsStroke, IGraphicsData {
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(thickness?: number, pixelHinting?: boolean, scaleMode?: string, caps?: string, joints?: string, miterLimit?: number, fill?: flash.display.IGraphicsFill);
        thickness: number;
        pixelHinting: boolean;
        miterLimit: number;
        fill: flash.display.IGraphicsFill;
        scaleMode: string;
        caps: string;
        joints: string;
    }
}
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
declare module Shumway.flash.display {
    class GraphicsTrianglePath extends LegacyEntity implements IGraphicsPath, IGraphicsData {
        constructor(vertices?: Float64Array, indices?: Int32Array, uvtData?: Float64Array, culling?: string);
        indices: Int32Array;
        vertices: Float64Array;
        uvtData: Float64Array;
        _culling: string;
        culling: string;
    }
}
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
declare module Shumway.flash.display {
    interface IDrawCommand {
    }
}
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
declare module Shumway.flash.display {
    interface IGraphicsData {
    }
}
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
declare module Shumway.flash.display {
    interface IGraphicsFill {
    }
}
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
declare module Shumway.flash.display {
    interface IGraphicsPath {
    }
}
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
declare module Shumway.flash.display {
    interface IGraphicsStroke {
    }
}
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
declare module Shumway.flash.display {
    import Bounds = Shumway.Bounds;
    import DisplayObject = flash.display.DisplayObject;
    import ShapeData = Shumway.ShapeData;
    class Graphics extends LegacyEntity implements Shumway.Remoting.IRemotable {
        constructor();
        static FromData(data: any, loaderInfo: LoaderInfo): Graphics;
        getGraphicsData(): ShapeData;
        getUsedTextures(): BitmapData[];
        _id: number;
        private _graphicsData;
        private _textures;
        private _lastX;
        private _lastY;
        private _boundsIncludeLastCoordinates;
        /**
         * Determine by how much the lineBounds are larger than the fillBounds.
         */
        private _topLeftStrokeWidth;
        private _bottomRightStrokeWidth;
        /**
         * Indicates whether this graphics object has changed since the last time it was synchronized.
         */
        _isDirty: boolean;
        /**
         * Flash special-cases lines that are 1px and 3px wide.
         * They're offset by 0.5px to the bottom-right.
         */
        private _setStrokeWidth(width);
        /**
         * Bounding box excluding strokes.
         */
        private _fillBounds;
        /**
         * Bounding box including strokes.
         */
        private _lineBounds;
        /**
         * Back reference to the display object that references this graphics object. This is
         * needed so that we can propagate invalid / dirty bits whenever the graphics object
         * changes.
         */
        _parent: DisplayObject;
        _setParent(parent: DisplayObject): void;
        _invalidate(): void;
        _getContentBounds(includeStrokes?: boolean): Bounds;
        clear(): void;
        /**
         * Sets a solid color and opacity as the fill for subsequent drawing commands.
         *
         * @see http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/display/Graphics.html#beginFill%28%29
         * @param color
         * @param alpha While any Number is a valid input, the value is clamped to [0,1] and then scaled
         * to an integer in the interval [0,0xff].
         */
        beginFill(color: number, alpha?: number): void;
        beginGradientFill(type: string, colors: Array<number>, alphas: Array<number>, ratios: Array<number>, matrix?: flash.geom.Matrix, spreadMethod?: string, interpolationMethod?: string, focalPointRatio?: number): void;
        beginBitmapFill(bitmap: flash.display.BitmapData, matrix?: flash.geom.Matrix, repeat?: boolean, smooth?: boolean): void;
        endFill(): void;
        lineStyle(thickness: number, color?: number, alpha?: number, pixelHinting?: boolean, scaleMode?: string, caps?: string, joints?: string, miterLimit?: number): void;
        lineGradientStyle(type: string, colors: Array<number>, alphas: Array<number>, ratios: Array<number>, matrix?: flash.geom.Matrix, spreadMethod?: string, interpolationMethod?: string, focalPointRatio?: number): void;
        lineBitmapStyle(bitmap: flash.display.BitmapData, matrix?: flash.geom.Matrix, repeat?: boolean, smooth?: boolean): void;
        drawRect(x: number, y: number, width: number, height: number): void;
        drawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight: number): void;
        drawRoundRectComplex(x: number, y: number, width: number, height: number, topLeftRadius: number, topRightRadius: number, bottomLeftRadius: number, bottomRightRadius: number): void;
        drawCircle(x: number, y: number, radius: number): void;
        /**
         * Here x and y are the top-left coordinates of the bounding box of the
         * ellipse not the center as is the case for circles.
         */
        drawEllipse(x: number, y: number, width: number, height: number): void;
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        curveTo(controlX: number, controlY: number, anchorX: number, anchorY: number): void;
        cubicCurveTo(controlX1: number, controlY1: number, controlX2: number, controlY2: number, anchorX: number, anchorY: number): void;
        copyFrom(sourceGraphics: flash.display.Graphics): void;
        drawPath(commands: Array<any>, data: Array<any>, winding?: string): void;
        drawTriangles(vertices: Array<any>, indices?: Array<any>, uvtData?: Array<any>, culling?: string): void;
        drawGraphicsData(graphicsData: Array<any>): void;
        /**
         * Tests if the specified point is within this graphics path.
         */
        _containsPoint(x: number, y: number, includeLines: boolean, ratio: number): boolean;
        private _fillContainsPoint(x, y, ratio);
        private _linesContainsPoint(x, y, ratio);
        /**
         * Bitmaps are specified the same for fills and strokes, so we only need to serialize them
         * once. The Parameter `pathCommand` is treated as the actual command to serialize, and must
         * be one of PathCommand.BeginBitmapFill and PathCommand.LineStyleBitmap.
         *
         * This method doesn't actually write anything if the `skipWrite` argument is true. In that
         * case, it only does arguments checks so the right exceptions are thrown.
         */
        private _writeBitmapStyle(pathCommand, bitmap, matrix, repeat, smooth, skipWrite);
        /**
         * Gradients are specified the same for fills and strokes, so we only need to serialize them
         * once. The Parameter `pathCommand` is treated as the actual command to serialize, and must
         * be one of PathCommand.BeginGradientFill and PathCommand.LineStyleGradient.
         *
         * This method doesn't actually write anything if the `skipWrite` argument is true. In that
         * case, it only does arguments checks so the right exceptions are thrown.
         */
        private _writeGradientStyle(pathCommand, type, colors_, alphas_, ratios_, matrix, spreadMethod, interpolationMethod, focalPointRatio, skipWrite);
        private _extendBoundsByPoint(x, y);
        private _extendBoundsByX(x);
        private _extendBoundsByY(y);
        private _applyLastCoordinates(x, y);
    }
}
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
declare module Shumway.flash.display {
    import Timeline = Shumway.Timeline;
    class Sprite extends flash.display.DisplayObjectContainer {
        static classInitializer: any;
        _symbol: SpriteSymbol;
        applySymbol(): void;
        static classSymbols: string[];
        static instanceSymbols: string[];
        preInit(): void;
        constructor();
        protected _initializeFields(): void;
        private _buttonMode;
        private _dropTarget;
        private _hitArea;
        private _useHandCursor;
        private _dragMode;
        private _dragDeltaX;
        private _dragDeltaY;
        private _dragBounds;
        _hitTarget: flash.display.Sprite;
        _addFrame(frame: Shumway.SWF.SWFFrame): void;
        _initializeChildren(frame: Shumway.SWF.SWFFrame): void;
        _processControlTags(tags: any[], backwards: boolean): void;
        _removeAnimatedChild(child: flash.display.DisplayObject): void;
        _canHaveGraphics(): boolean;
        _getGraphics(): flash.display.Graphics;
        readonly graphics: flash.display.Graphics;
        buttonMode: boolean;
        readonly dropTarget: flash.display.DisplayObject;
        hitArea: flash.display.Sprite;
        useHandCursor: boolean;
        soundTransform: flash.media.SoundTransform;
        /**
         * Returns the current mouse position relative to this object.
         */
        _getDragMousePosition(): flash.geom.Point;
        startDrag(lockCenter?: boolean, bounds?: flash.geom.Rectangle): void;
        stopDrag(): void;
        _updateDragState(dropTarget?: DisplayObject): void;
        startTouchDrag(touchPointID: number, lockCenter?: boolean, bounds?: flash.geom.Rectangle): void;
        stopTouchDrag(touchPointID: number): void;
        _containsPoint(globalX: number, globalY: number, localX: number, localY: number, testingType: HitTestingType, objects: DisplayObject[]): HitTestingResult;
        _containsPointDirectly(localX: number, localY: number, globalX: number, globalY: number): boolean;
    }
    class SpriteSymbol extends Timeline.DisplaySymbol {
        numFrames: number;
        frames: any[];
        labels: flash.display.FrameLabel[];
        isRoot: boolean;
        avm1Name: string;
        loaderInfo: flash.display.LoaderInfo;
        constructor(data: Timeline.SymbolData, loaderInfo: flash.display.LoaderInfo);
        static FromData(data: any, loaderInfo: flash.display.LoaderInfo): SpriteSymbol;
    }
}
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
declare module Shumway.flash.display {
    /**
     * Controls how to behave on inter-frame navigation.
     */
    const enum FrameNavigationModel {
        SWF1 = 1,
        SWF9 = 9,
        SWF10 = 10,
    }
    interface FrameScript {
        [key: string]: any;
        precedence?: number[];
        context?: MovieClip;
    }
    class MovieClip extends flash.display.Sprite implements IAdvancable {
        static axClass: typeof MovieClip;
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        applySymbol(): void;
        private _initAvm1Data();
        private _initAvm1FrameData(frameIndex, frameInfo);
        private _addAvm1FrameScripts(frameIndex, actionsBlocks);
        /**
         * AVM1 InitActionBlocks are executed once, before the children are initialized for a frame.
         * That matches AS3's enterFrame event, so we can add an event listener that just bails
         * as long as the target frame isn't reached, and executes the InitActionBlock once it is.
         *
         * After that, the listener removes itself.
         */
        private _addAvm1InitActionBlocks(frameIndex, actionsBlocks);
        /**
         * Field holding the as2 object associated with this MovieClip instance.
         *
         * This field is only ever populated by the AVM1 runtime, so can only be used for MovieClips
         * used in the implementation of an AVM1 display list.
         */
        private _as2Object;
        removeChildAt(index: number): DisplayObject;
        constructor();
        protected _initializeFields(): void;
        _addFrame(frameInfo: any): void;
        _initFrame(advance: boolean): void;
        _constructFrame(): void;
        _enqueueFrameScripts(): void;
        _currentFrame: number;
        _nextFrame: number;
        private _totalFrames;
        private _frames;
        private _frameScripts;
        private _scenes;
        private _enabled;
        private _isPlaying;
        private _stopped;
        private _trackAsMenu;
        _allowFrameNavigation: boolean;
        private _sounds;
        private _buttonFrames;
        private _currentButtonState;
        readonly currentFrame: number;
        readonly framesLoaded: number;
        readonly totalFrames: number;
        trackAsMenu: boolean;
        readonly scenes: Array<any>;
        readonly currentScene: Scene;
        readonly currentLabel: string;
        readonly currentLabels: FrameLabel[];
        readonly currentFrameLabel: string;
        enabled: boolean;
        readonly isPlaying: boolean;
        play(): void;
        stop(): void;
        /**
         * Resolves frame and scene into absolute frame number. If scene is not specified,
         * the current scene is used. In legacy mode, it might return `undefined` if frame/scene
         * was not found.
         */
        _getAbsFrameNumber(frame: string, sceneName: string): number;
        /**
         * Implementation for both gotoAndPlay and gotoAndStop.
         *
         * Technically, we should throw all errors from those functions directly so the stack is
         * correct.
         * We might at some point do that by explicitly inlining this function using some build step.
         */
        private _gotoFrame(frame, sceneName);
        private _gotoFrameAbs(frame);
        _advanceFrame(): void;
        private _seekToFrame(frame);
        /**
         * Because that's how it's mostly used, the current frame is stored as an offset into the
         * entire timeline. Sometimes, we need to know which scene it falls into. This utility
         * function answers that.
         */
        private _sceneForFrameIndex(frameIndex);
        /**
         * Frame indices are stored as offsets into the entire timline, whereas labels are stored
         * in their scenes. This utility function iterates over scenes and their labels to find
         * the label clostest to, but not after the target frame.
         */
        private _labelForFrame(frame);
        callFrame(frame: number): void;
        queueAvm1FrameScripts(frame: number, queue: Array<FrameScript>): void;
        nextFrame(): void;
        prevFrame(): void;
        gotoAndPlay(frame: any, scene?: string): void;
        gotoAndStop(frame: any, scene?: string): void;
        /**
         * Takes pairs of `frameIndex`, `script` arguments and adds the `script`s to the `_frameScripts`
         * Array.
         *
         * Undocumented method used to implement the old timeline concept in AS3.
         */
        addFrameScript(frameIndex: number, script: FrameScript): void;
        readonly _isFullyLoaded: boolean;
        _registerStartSounds(frameNum: number, soundStartInfo: any): void;
        _initSoundStream(streamInfo: any): void;
        _addSoundStreamBlock(frameNum: number, streamBlock: any): void;
        private _syncSounds(frameNum);
        addScene(name: string, labels_: FrameLabel[], offset: number, numFrames: number): void;
        addFrameLabel(name: string, frame: number): void;
        prevScene(): void;
        nextScene(): void;
        _containsPointImpl(globalX: number, globalY: number, localX: number, localY: number, testingType: HitTestingType, objects: DisplayObject[], skipBoundsCheck: boolean): HitTestingResult;
    }
}
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
declare module Shumway.flash.display {
    class MovieClipSoundStream {
        private movieClip;
        private data;
        private seekIndex;
        private position;
        private element;
        private soundStreamAdapter;
        private wasFullyLoaded;
        private decode;
        private expectedFrame;
        private waitFor;
        constructor(streamInfo: SWF.Parser.SoundStream, movieClip: MovieClip);
        appendBlock(frameNum: number, streamBlock: Uint8Array): void;
        playFrame(frameNum: number): void;
    }
}
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
declare module Shumway.flash.display {
    class Stage extends flash.display.DisplayObjectContainer {
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        /**
         * Indicates whether the stage object has changed since the last time it was synchronized.
         */
        _isDirty: boolean;
        constructor();
        private _frameRate;
        private _scaleMode;
        private _align;
        private _stageWidth;
        private _stageHeight;
        private _showDefaultContextMenu;
        private _focus;
        private _colorCorrection;
        private _colorCorrectionSupport;
        private _stageFocusRect;
        private _quality;
        private _displayState;
        private _fullScreenSourceRect;
        private _mouseLock;
        private _stageVideos;
        private _stage3Ds;
        private _colorARGB;
        private _fullScreenWidth;
        private _fullScreenHeight;
        private _wmodeGPU;
        private _softKeyboardRect;
        private _allowsFullScreen;
        private _allowsFullScreenInteractive;
        private _contentsScaleFactor;
        private _displayContextInfo;
        private _timeout;
        private _stageContainerWidth;
        private _stageContainerHeight;
        /**
         * The |invalidate| function was called on the stage. This flag indicates that
         * the |RENDER| event gets fired right before the stage is rendered.
         */
        private _invalidated;
        setRoot(root: MovieClip): void;
        frameRate: number;
        scaleMode: string;
        align: string;
        stageWidth: number;
        _setInitialName(): void;
        /**
         * Non-AS3-available setter. In AS3, the `stageWidth` setter is silently ignored.
         */
        setStageWidth(value: number): void;
        stageHeight: number;
        /**
         * Non-AS3-available setter. In AS3, the `stageHeight` setter is silently ignored.
         */
        setStageHeight(value: number): void;
        /**
         * Almost the same as color setter, except it preserves alpha channel.
         * @param value
         */
        setStageColor(value: number): void;
        /**
         * Non-AS3-available setter. Notifies the stage that the dimensions of the stage container have changed.
         */
        setStageContainerSize(width: number, height: number, pixelRatio: number): void;
        showDefaultContextMenu: boolean;
        focus: flash.display.InteractiveObject;
        colorCorrection: string;
        readonly colorCorrectionSupport: string;
        stageFocusRect: boolean;
        quality: string;
        displayState: string;
        fullScreenSourceRect: flash.geom.Rectangle;
        mouseLock: boolean;
        readonly stageVideos: any;
        readonly stage3Ds: Array<any>;
        color: number;
        alpha: number;
        readonly fullScreenWidth: number;
        readonly fullScreenHeight: number;
        readonly wmodeGPU: boolean;
        readonly softKeyboardRect: flash.geom.Rectangle;
        readonly allowsFullScreen: boolean;
        readonly allowsFullScreenInteractive: boolean;
        readonly contentsScaleFactor: number;
        readonly displayContextInfo: string;
        removeChildAt(index: number): flash.display.DisplayObject;
        swapChildrenAt(index1: number, index2: number): void;
        width: number;
        height: number;
        mouseChildren: boolean;
        readonly numChildren: number;
        tabChildren: boolean;
        addChild(child: DisplayObject): DisplayObject;
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        setChildIndex(child: DisplayObject, index: number): void;
        addEventListener(type: string, listener: (event: events.Event) => void, useCapture: boolean, priority?: number, useWeakReference?: boolean): void;
        hasEventListener(type: string): boolean;
        willTrigger(type: string): boolean;
        dispatchEvent(event: events.Event): boolean;
        invalidate(): void;
        isFocusInaccessible(): boolean;
        requireOwnerPermissions(): void;
        render(): void;
        name: string;
        mask: DisplayObject;
        visible: boolean;
        x: number;
        y: number;
        z: number;
        scaleX: number;
        scaleY: number;
        scaleZ: number;
        rotation: number;
        rotationX: number;
        rotationY: number;
        rotationZ: number;
        cacheAsBitmap: boolean;
        opaqueBackground: any;
        scrollRect: flash.geom.Rectangle;
        filters: Array<any>;
        blendMode: string;
        transform: flash.geom.Transform;
        accessibilityProperties: flash.accessibility.AccessibilityProperties;
        scale9Grid: flash.geom.Rectangle;
        tabEnabled: boolean;
        tabIndex: number;
        focusRect: any;
        mouseEnabled: boolean;
        accessibilityImplementation: flash.accessibility.AccessibilityImplementation;
        readonly textSnapshot: text.TextSnapshot;
        contextMenu: flash.ui.ContextMenu;
    }
}
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
declare module Shumway.flash.display {
    enum ActionScriptVersion {
        ACTIONSCRIPT2 = 2,
        ACTIONSCRIPT3 = 3,
    }
}
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
declare module Shumway.flash.display {
    enum BlendMode {
        NORMAL = "normal",
        LAYER = "layer",
        MULTIPLY = "multiply",
        SCREEN = "screen",
        LIGHTEN = "lighten",
        DARKEN = "darken",
        ADD = "add",
        SUBTRACT = "subtract",
        DIFFERENCE = "difference",
        INVERT = "invert",
        OVERLAY = "overlay",
        HARDLIGHT = "hardlight",
        ALPHA = "alpha",
        ERASE = "erase",
        SHADER = "shader",
    }
    namespace BlendMode {
        /**
         * Returns the blend mode string from the numeric value that appears in the
         * swf file.
         */
        function fromNumber(n: number): string;
        function toNumber(value: string): number;
    }
}
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
declare module Shumway.flash.display {
    enum ColorCorrection {
        DEFAULT = "default",
        ON = "on",
        OFF = "off",
    }
    namespace ColorCorrection {
        function fromNumber(n: number): string;
        function toNumber(value: string): number;
    }
}
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
declare module Shumway.flash.display {
    enum ColorCorrectionSupport {
        UNSUPPORTED = "unsupported",
        DEFAULT_ON = "defaultOn",
        DEFAULT_OFF = "defaultOff",
    }
    namespace ColorCorrectionSupport {
        function fromNumber(n: number): string;
        function toNumber(value: string): number;
    }
}
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
declare module Shumway.flash.display {
    enum FocusDirection {
        TOP = "top",
        BOTTOM = "bottom",
        NONE = "none",
    }
}
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
declare module Shumway.flash.display {
    class FrameLabel extends flash.events.EventDispatcher {
        constructor(name: string, frame: number);
        private _name;
        private _frame;
        readonly name: string;
        readonly frame: number;
        clone(): FrameLabel;
    }
}
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
declare module Shumway.flash.display {
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    /**
     * Holds blobs of bitmap data in various formats and lets you do basic pixel operations. When
     * data is unpacked, it is stored as premultiplied ARGB since it's what the SWF encodes bitmaps
     * as.  This way we don't have to do unecessary byte conversions.
     */
    class BitmapData extends LegacyEntity implements IBitmapDrawable, Shumway.Remoting.IRemotable {
        static axClass: typeof BitmapData;
        static classInitializer: any;
        _symbol: BitmapSymbol;
        applySymbol(): void;
        static MAXIMUM_WIDTH: number;
        static MAXIMUM_HEIGHT: number;
        static MAXIMUM_DIMENSION: number;
        constructor(width: number, height: number, transparent?: boolean, fillColorARGB?: number);
        private _setData(data, type);
        /**
         * Back references to Bitmaps that use this BitmapData. These objects need to be marked as dirty
         * when this bitmap data becomes dirty.
         */
        private _bitmapReferrers;
        _addBitmapReferrer(bitmap: flash.display.Bitmap): void;
        _removeBitmapReferrer(bitmap: flash.display.Bitmap): void;
        /**
         * Called whenever the contents of this bitmap data changes.
         */
        private _invalidate();
        _transparent: boolean;
        _rect: flash.geom.Rectangle;
        _id: number;
        _locked: boolean;
        /**
         * Image format stored in the |_data| buffer.
         */
        _type: ImageType;
        /**
         * Actual image bytes as raw pixel data of the format given by `_type`.
         */
        _data: Uint8Array;
        /**
         * Data buffer wrapped around the |_data| buffer.
         */
        _dataBuffer: DataBuffer;
        /**
         * Int32Array view on |_data| useful when working with 4 bytes at a time. Endianess is
         * important here, so if |_type| is PremultipliedAlphaARGB as is usually the case for
         * bitmap data, then |_view| values are actually BGRA (on little-endian machines).
         */
        _view: Int32Array;
        /**
         * Indicates whether this bitmap data's data buffer has changed since the last time it was
         * synchronized.
         */
        _isDirty: boolean;
        /**
         * Indicates whether this bitmap data's data buffer has changed on the remote end and needs to
         * be read back before any pixel operations can be performed.
         */
        _isRemoteDirty: boolean;
        /**
         * If non-null then this value indicates that the bitmap is filled with a solid color. This is
         * useful for optimizations.
         */
        _solidFillColorPBGRA: any;
        private _getTemporaryRectangleFrom(rect);
        getDataBuffer(): DataBuffer;
        _getContentBounds(): Bounds;
        /**
         * TODO: Not tested.
         */
        private _getPixelData(rect);
        /**
         * TODO: Not tested.
         */
        private _putPixelData(rect, input);
        readonly width: number;
        readonly height: number;
        readonly rect: flash.geom.Rectangle;
        readonly transparent: boolean;
        clone(): flash.display.BitmapData;
        /**
         * Returns an straight alpha RGB pixel value 0x00RRGGBB.
         */
        getPixel(x: number, y: number): number;
        /**
         * Returns an straight alpha ARGB pixel value 0xAARRGGBB.
         */
        getPixel32(x: number, y: number): number;
        setPixel(x: number, y: number, uARGB: number): void;
        setPixel32(x: number, y: number, uARGB: number): void;
        applyFilter(sourceBitmapData: flash.display.BitmapData, sourceRect: flash.geom.Rectangle, destPoint: flash.geom.Point, filter: flash.filters.BitmapFilter): void;
        colorTransform(rect: flash.geom.Rectangle, colorTransform: flash.geom.ColorTransform): void;
        compare(otherBitmapData: flash.display.BitmapData): any;
        copyChannel(sourceBitmapData: flash.display.BitmapData, sourceRect: flash.geom.Rectangle, destPoint: flash.geom.Point, sourceChannel: number, destChannel: number): void;
        /**
         * Copies a rectangular region of pixels into the current bitmap data.
         */
        copyPixels(sourceBitmapData: flash.display.BitmapData, sourceRect: flash.geom.Rectangle, destPoint: flash.geom.Point, alphaBitmapData?: flash.display.BitmapData, alphaPoint?: flash.geom.Point, mergeAlpha?: boolean): void;
        private _copyPixelsAndMergeAlpha(s, sX, sY, sStride, t, tX, tY, tStride, tW, tH);
        dispose(): void;
        draw(source: flash.display.IBitmapDrawable, matrix?: flash.geom.Matrix, colorTransform?: flash.geom.ColorTransform, blendMode?: BlendMode, clipRect?: flash.geom.Rectangle, smoothing?: boolean): void;
        drawWithQuality(source: flash.display.IBitmapDrawable, matrix?: flash.geom.Matrix, colorTransform?: flash.geom.ColorTransform, blendMode?: BlendMode, clipRect?: flash.geom.Rectangle, smoothing?: boolean, quality?: StageQuality): void;
        fillRect(rect: flash.geom.Rectangle, uARGB: number): void;
        floodFill(x: number, y: number, color: number): void;
        generateFilterRect(sourceRect: flash.geom.Rectangle, filter: flash.filters.BitmapFilter): flash.geom.Rectangle;
        getColorBoundsRect(mask: number, color: number, findColor?: boolean): flash.geom.Rectangle;
        getPixels(rect: flash.geom.Rectangle): flash.utils.ByteArray;
        copyPixelsToByteArray(rect: flash.geom.Rectangle, data: flash.utils.ByteArray): void;
        getVector(rect: flash.geom.Rectangle): Uint32Array;
        hitTest(firstPoint: flash.geom.Point, firstAlphaThreshold: number, secondObject: any, secondBitmapDataPoint?: flash.geom.Point, secondAlphaThreshold?: number): boolean;
        merge(sourceBitmapData: flash.display.BitmapData, sourceRect: flash.geom.Rectangle, destPoint: flash.geom.Point, redMultiplier: number, greenMultiplier: number, blueMultiplier: number, alphaMultiplier: number): void;
        noise(randomSeed: number, low?: number, high?: number, channelOptions?: number, grayScale?: boolean): void;
        paletteMap(sourceBitmapData: flash.display.BitmapData, sourceRect: flash.geom.Rectangle, destPoint: flash.geom.Point, redArray?: any[], greenArray?: any[], blueArray?: any[], alphaArray?: any[]): void;
        perlinNoise(baseX: number, baseY: number, numOctaves: number, randomSeed: number, stitch: boolean, fractalNoise: boolean, channelOptions?: number, grayScale?: boolean, offsets?: any[]): void;
        pixelDissolve(sourceBitmapData: flash.display.BitmapData, sourceRect: flash.geom.Rectangle, destPoint: flash.geom.Point, randomSeed?: number, numPixels?: number, fillColor?: number): number;
        scroll(x: number, y: number): void;
        setPixels(rect: flash.geom.Rectangle, inputByteArray: flash.utils.ByteArray): void;
        setVector(rect: flash.geom.Rectangle, inputVector: Uint32Array): void;
        threshold(sourceBitmapData: flash.display.BitmapData, sourceRect: flash.geom.Rectangle, destPoint: flash.geom.Point, operation: string, threshold: number, color?: number, mask?: number, copySource?: boolean): number;
        lock(): void;
        unlock(changeRect?: flash.geom.Rectangle): void;
        histogram(hRect?: flash.geom.Rectangle): Array<any>;
        encode(rect: flash.geom.Rectangle, compressor: any, byteArray?: flash.utils.ByteArray): flash.utils.ByteArray;
        /**
         * Ensures that we have the most up-to-date version of the bitmap data. If a call to
         * |BitmpaData.draw| was made since the last time this method was called, then we need to send
         * a synchronous message to the GFX remote requesting the latest image data.
         *
         * Here we also normalize the image format to |ImageType.StraightAlphaRGBA|. We only need the
         * normalized pixel data for pixel operations, so we defer image decoding as late as possible.
         */
        private _ensureBitmapData();
    }
    interface IBitmapDataSerializer {
        drawToBitmap(bitmapData: flash.display.BitmapData, source: flash.display.IBitmapDrawable, matrix: flash.geom.Matrix, colorTransform: flash.geom.ColorTransform, blendMode: string, clipRect: flash.geom.Rectangle, smoothing: boolean): void;
        requestBitmapData(bitmapData: BitmapData): DataBuffer;
    }
    class BitmapSymbol extends Timeline.DisplaySymbol implements Timeline.EagerlyResolvedSymbol {
        width: number;
        height: number;
        syncId: number;
        data: Uint8Array;
        type: ImageType;
        private sharedInstance;
        constructor(data: Timeline.SymbolData, _sec: system.ISecurityDomain);
        static FromData(data: any, loaderInfo: LoaderInfo): BitmapSymbol;
        getSharedInstance(): any;
        createSharedInstance(): any;
        readonly resolveAssetCallback: any;
        private _unboundResolveAssetCallback(data);
    }
}
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
declare module Shumway.flash.display {
    enum BitmapDataChannel {
        RED = 1,
        GREEN = 2,
        BLUE = 4,
        ALPHA = 8,
    }
}
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
declare module Shumway.flash.display {
    enum BitmapEncodingColorSpace {
        COLORSPACE_AUTO = "auto",
        COLORSPACE_4_4_4 = "4:4:4",
        COLORSPACE_4_2_2 = "4:2:2",
        COLORSPACE_4_2_0 = "4:2:0",
    }
}
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
declare module Shumway.flash.display {
    interface IBitmapDrawable {
    }
}
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
declare module Shumway.flash.display {
    class JPEGEncoderOptions extends LegacyEntity {
        constructor(quality?: number);
        quality: number;
    }
}
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
declare module Shumway.flash.display {
    import LoaderContext = flash.system.LoaderContext;
    import events = flash.events;
    import ILoadListener = Shumway.ILoadListener;
    enum LoadStatus {
        Unloaded = 0,
        Opened = 1,
        Initialized = 2,
        Complete = 3,
    }
    enum LoadingType {
        External = 0,
        Bytes = 1,
    }
    class Loader extends flash.display.DisplayObjectContainer implements IAdvancable, ILoadListener {
        constructor();
        _setStage(stage: Stage): void;
        _initFrame(advance: boolean): void;
        _constructFrame(): void;
        addChild(child: DisplayObject): DisplayObject;
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        removeChild(child: DisplayObject): DisplayObject;
        removeChildAt(index: number): DisplayObject;
        setChildIndex(child: DisplayObject, index: number): void;
        _content: flash.display.DisplayObject;
        private _contentID;
        _contentLoaderInfo: flash.display.LoaderInfo;
        private _uncaughtErrorEvents;
        private _fileLoader;
        _imageSymbol: BitmapSymbol;
        _loadStatus: LoadStatus;
        _loadingType: LoadingType;
        _queuedLoadUpdate: LoadProgressUpdate;
        /**
         * No way of knowing what's in |data|, so do a best effort to print out some meaninfgul debug
         * info.
         */
        private _describeData(data);
        readonly content: flash.display.DisplayObject;
        readonly contentLoaderInfo: flash.display.LoaderInfo;
        _getJPEGLoaderContextdeblockingfilter(context: flash.system.LoaderContext): number;
        readonly uncaughtErrorEvents: events.UncaughtErrorEvents;
        private _canLoadSWFFromDomain(url);
        load(request: flash.net.URLRequest, context?: LoaderContext): void;
        loadBytes(data: flash.utils.ByteArray, context?: LoaderContext): void;
        close(): void;
        _unload(stopExecution: boolean, gc: boolean): void;
        unload(): void;
        unloadAndStop(gc: boolean): void;
        private _applyLoaderContext(context);
        onLoadOpen(file: any): void;
        onLoadProgress(update: LoadProgressUpdate): void;
        onNewEagerlyParsedSymbols(dictionaryEntries: SWF.EagerlyParsedDictionaryEntry[], delta: number): Promise<any>;
        onImageBytesLoaded(): void;
        _applyDecodedImage(symbol: BitmapSymbol): void;
        _applyLoadUpdate(update: LoadProgressUpdate): void;
        onLoadComplete(): void;
        onLoadError(): void;
        private _addScenesToMovieClip(mc, sceneData, numFrames);
        private createContentRoot(symbol, sceneData);
        private _createAVM1Context();
        /**
         * Create an AVM1Movie container and wrap the root timeline into it.
         * This associates the AVM1Context with this AVM1 MovieClip tree,
         * including potential nested SWFs.
         */
        private _createAVM1Movie(root);
    }
}
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
declare module Shumway.flash.display {
    import SWFFrame = Shumway.SWF.SWFFrame;
    class LoaderInfo extends flash.events.EventDispatcher {
        constructor(token: Object);
        reset(): void;
        setFile(file: any): void;
        static getLoaderInfoByDefinition(object: Object): flash.display.LoaderInfo;
        _url: string;
        _loaderUrl: string;
        _file: any;
        _bytesLoaded: number;
        _bytesTotal: number;
        _applicationDomain: system.ApplicationDomain;
        _parameters: Object;
        _allowCodeImport: boolean;
        _checkPolicyFile: boolean;
        _width: number;
        _height: number;
        _sharedEvents: flash.events.EventDispatcher;
        _parentSandboxBridge: Object;
        _childSandboxBridge: Object;
        _loader: flash.display.Loader;
        _content: flash.display.DisplayObject;
        _bytes: flash.utils.ByteArray;
        _abcBlocksLoaded: number;
        _mappedSymbolsLoaded: number;
        _fontsLoaded: number;
        _uncaughtErrorEvents: flash.events.UncaughtErrorEvents;
        /**
         * Use this to ignore any user code.
         */
        _allowCodeExecution: boolean;
        _dictionary: Shumway.Timeline.Symbol[];
        _avm1Context: any;
        readonly loaderURL: string;
        readonly url: string;
        readonly isURLInaccessible: boolean;
        readonly bytesLoaded: number;
        readonly bytesTotal: number;
        readonly applicationDomain: flash.system.ApplicationDomain;
        readonly app: system.ApplicationDomain;
        readonly swfVersion: number;
        readonly actionScriptVersion: number;
        readonly frameRate: number;
        readonly width: number;
        readonly height: number;
        readonly contentType: string;
        readonly sharedEvents: flash.events.EventDispatcher;
        parentSandboxBridge: Object;
        childSandboxBridge: Object;
        readonly sameDomain: boolean;
        readonly childAllowsParent: boolean;
        readonly parentAllowsChild: boolean;
        readonly loader: flash.display.Loader;
        readonly content: flash.display.DisplayObject;
        readonly bytes: flash.utils.ByteArray;
        readonly parameters: Object;
        readonly uncaughtErrorEvents: flash.events.UncaughtErrorEvents;
        getSymbolResolver(classDefinition: system.LegacyClass, symbolId: number): () => any;
        getSymbolById(id: number): Shumway.Timeline.Symbol;
        getRootSymbol(): flash.display.SpriteSymbol;
        private _syncAVM1Attributes(symbol);
        getFrame(sprite: {
            frames: SWFFrame[];
        }, index: number): SWFFrame;
        private resolveClassSymbol(classDefinition, symbolId);
    }
    interface IRootElementService {
        pageUrl: string;
        swfUrl: string;
        loaderUrl: string;
    }
}
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
declare module Shumway.flash.display {
    class MorphShape extends flash.display.DisplayObject {
        _symbol: MorphShapeSymbol;
        applySymbol(): void;
        preInit(): void;
        constructor();
        _canHaveGraphics(): boolean;
        _getGraphics(): flash.display.Graphics;
        readonly graphics: flash.display.Graphics;
        _containsPointDirectly(localX: number, localY: number, globalX: number, globalY: number): boolean;
    }
    class MorphShapeSymbol extends flash.display.ShapeSymbol {
        morphFillBounds: Bounds;
        morphLineBounds: Bounds;
        constructor(data: Timeline.SymbolData, sec: system.ISecurityDomain);
        static FromData(data: any, loaderInfo: flash.display.LoaderInfo): MorphShapeSymbol;
    }
}
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
declare module Shumway.flash.display {
    class NativeMenu extends flash.events.EventDispatcher {
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
    }
}
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
declare module Shumway.flash.display {
    class NativeMenuItem extends flash.events.EventDispatcher {
        constructor();
        _enabled: boolean;
        enabled: boolean;
    }
}
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
declare module Shumway.flash.display {
    class PNGEncoderOptions extends LegacyEntity {
        constructor(fastCompression?: boolean);
        fastCompression: boolean;
    }
}
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
declare module Shumway.flash.display {
    enum PixelSnapping {
        NEVER = "never",
        ALWAYS = "always",
        AUTO = "auto",
    }
    namespace PixelSnapping {
        function fromNumber(n: number): string;
        function toNumber(value: string): number;
    }
}
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
declare module Shumway.flash.display {
    enum SWFVersion {
        FLASH1 = 1,
        FLASH2 = 2,
        FLASH3 = 3,
        FLASH4 = 4,
        FLASH5 = 5,
        FLASH6 = 6,
        FLASH7 = 7,
        FLASH8 = 8,
        FLASH9 = 9,
        FLASH10 = 10,
        FLASH11 = 11,
        FLASH12 = 12,
    }
}
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
declare module Shumway.flash.display {
    class Scene extends LegacyEntity {
        constructor(name: string, labels: FrameLabel[], offset: number, numFrames: number);
        _name: string;
        offset: number;
        _numFrames: number;
        _labels: FrameLabel[];
        readonly name: string;
        readonly labels: FrameLabel[];
        readonly numFrames: number;
        clone(): Scene;
        getLabelByName(name: string, ignoreCase: boolean): FrameLabel;
        getLabelByFrame(frame: number): FrameLabel;
    }
}
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
declare module Shumway.flash.display {
    enum StageAlign {
        TOP = "T",
        LEFT = "L",
        BOTTOM = "B",
        RIGHT = "R",
        TOP_LEFT = "TL",
        TOP_RIGHT = "TR",
        BOTTOM_LEFT = "BL",
        BOTTOM_RIGHT = "BR",
    }
    namespace StageAlign {
        function fromNumber(n: number): string;
        /**
         * Looks like the Flash player just searches for the "T", "B", "L", "R" characters and
         * maintains an internal bit field for alignment, for instance it's possible to set the
         * alignment value "TBLR" even though there is no enum for it.
         */
        function toNumber(value: string): number;
    }
}
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
declare module Shumway.flash.display {
    enum StageDisplayState {
        FULL_SCREEN = "fullScreen",
        FULL_SCREEN_INTERACTIVE = "fullScreenInteractive",
        NORMAL = "normal",
    }
    namespace StageDisplayState {
        function fromNumber(n: number): string;
        function toNumber(value: string): number;
    }
}
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
declare module Shumway.flash.display {
    enum StageQuality {
        LOW = "low",
        MEDIUM = "medium",
        HIGH = "high",
        BEST = "best",
        HIGH_8X8 = "8x8",
        HIGH_8X8_LINEAR = "8x8linear",
        HIGH_16X16 = "16x16",
        HIGH_16X16_LINEAR = "16x16linear",
    }
    namespace StageQuality {
        function fromNumber(n: number): string;
        function toNumber(value: string): number;
    }
}
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
declare module Shumway.flash.display {
    namespace StageScaleMode {
        function fromNumber(n: number): string;
        function toNumber(value: string): number;
    }
    enum StageScaleMode {
        SHOW_ALL = "showAll",
        EXACT_FIT = "exactFit",
        NO_BORDER = "noBorder",
        NO_SCALE = "noScale",
        SHOW_ALL_LOWERCASE = "showall",
        EXACT_FIT_LOWERCASE = "exactfit",
        NO_BORDER_LOWERCASE = "noborder",
        NO_SCALE_LOWERCASE = "noscale",
    }
}
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
declare module Shumway.flash.display {
    enum TriangleCulling {
        NONE = "none",
        POSITIVE = "positive",
        NEGATIVE = "negative",
    }
}
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
 * AVM1Movie is the reflection of AVM1 SWFs loaded into AVM2 content. Since AVM1 content is
 * completely opaque to AVM2 content, it's not a DisplayObjectContainer, even though it contains
 * nested children. This is because the two worlds are completely separated from each other[1], and
 * each AVM1 SWF is entirely isolated from everything else.
 *
 * This causes a few headaches because we implement the AVM1 display list in terms of the AVM2
 * display list: each AVM1 MovieClip is a wrapper around an AVM2 MovieClip instance, which is
 * what's actually on stage. Theoretically, the top-most AVM2 MovieClip for an AVM1 SWF isn't
 * supposed to have a parent. However, we need it to be part of the stage's display tree in order
 * to take part in rendering.
 *
 * Therefore, the AVM2 MovieClip wrapped by an AVM1Movie gets the latter set as its parent, even
 * though AVM1Movie isn't a DisplayObjectContainer. We borrow methods from that and generally
 * pretend that AVM1Movie is a container in some places to pull that off.
 *
 * [1]: If you ignore the undocumented `call` and `addCallback` methods for a moment.
 */
declare module Shumway.flash.display {
    class AVM1Movie extends flash.display.DisplayObject implements IAdvancable {
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(level0: DisplayObject);
        private _content;
        private _constructed;
        call(functionName: string): any;
        addCallback(functionName: string, closure: any): void;
        _addFrame(frame: Shumway.SWF.SWFFrame): void;
        _initFrame(advance: boolean): void;
        _constructFrame(): void;
        _enqueueFrameScripts(): void;
        _propagateFlagsDown(flags: DisplayObjectFlags): void;
        /**
         * AVM1Movie only takes the AVM1 content into consideration when testing points against
         * bounding boxes, not otherwise.
         */
        _containsPoint(globalX: number, globalY: number, localX: number, localY: number, testingType: HitTestingType, objects: DisplayObject[]): HitTestingResult;
        /**
         * Override of DisplayObject#_getChildBounds that retrieves the AVM1 content's bounds.
         */
        _getChildBounds(bounds: Bounds, includeStrokes: boolean): void;
        _getLevelForRoot(root: DisplayObject): number;
        _getRootForLevel(level: number): DisplayObject;
        _addRoot(level: number, root: DisplayObject): void;
        _removeRoot(level: number): boolean;
    }
}
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
declare module Shumway.flash.external {
    class ExternalInterface extends LegacyEntity {
        constructor();
        static $BgmarshallExceptions: boolean;
        private static initialized;
        private static registeredCallbacks;
        static ensureInitialized(): void;
        static call(functionName: string): any;
        static addCallback(functionName: string, closure: Function): void;
        static readonly available: boolean;
        static readonly objectID: string;
        static _addCallback(functionName: string, closure: Function): void;
        static _removeCallback(functionName: string): void;
        static _evalJS(expression: string): string;
        private static _callIn(functionName, args);
        static _callOut(request: string): string;
        static convertToXML(s: String): any;
        static convertToXMLString(obj: any): String;
        static convertFromXML(xml: any): any;
        static convertToJSString(obj: any): string;
    }
}
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
declare module Shumway.flash.filters {
    enum BitmapFilterQuality {
        LOW = 1,
        MEDIUM = 2,
        HIGH = 3,
    }
}
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
declare module Shumway.flash.filters {
    enum BitmapFilterType {
        INNER = "inner",
        OUTER = "outer",
        FULL = "full",
    }
}
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
declare module Shumway.flash.filters {
    import Rectangle = flash.geom.Rectangle;
    class BitmapFilter extends LegacyEntity {
        private static EPS;
        private static blurFilterStepWidths;
        static _updateBlurBounds(bounds: Rectangle, blurX: number, blurY: number, quality: number, isBlurFilter?: boolean): void;
        constructor();
        _updateFilterBounds(bounds: Rectangle): void;
        _serialize(message: any): void;
        clone(): BitmapFilter;
    }
    class GradientArrays {
        static colors: any[];
        static alphas: any[];
        static ratios: any[];
        static sanitize(colors: any[], alphas: any[], ratios: any[]): void;
        static sanitizeColors(colors: number[], maxLen?: number): number[];
        static sanitizeAlphas(alphas: number[], maxLen?: number, minLen?: number, value?: number): number[];
        static sanitizeRatios(ratios: number[], maxLen?: number, minLen?: number, value?: number): number[];
        static initArray(len: number, value?: number): number[];
    }
}
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
declare module Shumway.flash.filters {
    import Rectangle = geom.Rectangle;
    class BevelFilter extends filters.BitmapFilter {
        constructor(distance?: number, angle?: number, highlightColor?: number, highlightAlpha?: number, shadowColor?: number, shadowAlpha?: number, blurX?: number, blurY?: number, strength?: number, quality?: number, type?: string, knockout?: boolean);
        _updateFilterBounds(bounds: Rectangle): void;
        private _distance;
        private _angle;
        private _highlightColor;
        private _highlightAlpha;
        private _shadowColor;
        private _shadowAlpha;
        private _blurX;
        private _blurY;
        private _knockout;
        private _quality;
        private _strength;
        private _type;
        distance: number;
        angle: number;
        highlightColor: number;
        highlightAlpha: number;
        shadowColor: number;
        shadowAlpha: number;
        blurX: number;
        blurY: number;
        knockout: boolean;
        quality: number;
        strength: number;
        type: string;
        clone(): BitmapFilter;
    }
}
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
declare module Shumway.flash.filters {
    import Rectangle = flash.geom.Rectangle;
    class BlurFilter extends flash.filters.BitmapFilter {
        constructor(blurX?: number, blurY?: number, quality?: number);
        _updateFilterBounds(bounds: Rectangle): void;
        _serialize(message: any): void;
        private _blurX;
        private _blurY;
        private _quality;
        blurX: number;
        blurY: number;
        quality: number;
        clone(): BitmapFilter;
    }
}
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
declare module Shumway.flash.filters {
    class ColorMatrixFilter extends flash.filters.BitmapFilter {
        constructor(matrix?: Array<number>);
        _serialize(message: any): void;
        _matrix: Array<number>;
        matrix: Array<number>;
        clone(): BitmapFilter;
    }
}
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
declare module Shumway.flash.filters {
    class ConvolutionFilter extends flash.filters.BitmapFilter {
        static axClass: typeof ConvolutionFilter;
        static classInitializer: any;
        constructor(matrixX?: number, matrixY?: number, matrix?: Array<number>, divisor?: number, bias?: number, preserveAlpha?: boolean, clamp?: boolean, color?: number, alpha?: number);
        private _expandArray(a, newLen, value?);
        private _matrix;
        private _matrixX;
        private _matrixY;
        private _divisor;
        private _bias;
        private _preserveAlpha;
        private _clamp;
        private _color;
        private _alpha;
        matrix: Array<number>;
        matrixX: number;
        matrixY: number;
        divisor: number;
        bias: number;
        preserveAlpha: boolean;
        clamp: boolean;
        color: number;
        alpha: number;
        clone(): BitmapFilter;
    }
}
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
declare module Shumway.flash.filters {
    enum DisplacementMapFilterMode {
        WRAP = "wrap",
        CLAMP = "clamp",
        IGNORE = "ignore",
        COLOR = "color",
    }
}
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
declare module Shumway.flash.filters {
    class DisplacementMapFilter extends flash.filters.BitmapFilter {
        static FromUntyped(obj: any): any;
        constructor(mapBitmap?: flash.display.BitmapData, mapPoint?: flash.geom.Point, componentX?: number, componentY?: number, scaleX?: number, scaleY?: number, mode?: string, color?: number, alpha?: number);
        private _mapBitmap;
        private _mapPoint;
        private _componentX;
        private _componentY;
        private _scaleX;
        private _scaleY;
        private _mode;
        private _color;
        private _alpha;
        mapBitmap: flash.display.BitmapData;
        mapPoint: flash.geom.Point;
        componentX: number;
        componentY: number;
        scaleX: number;
        scaleY: number;
        mode: string;
        color: number;
        alpha: number;
        clone(): BitmapFilter;
    }
}
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
declare module Shumway.flash.filters {
    import Rectangle = flash.geom.Rectangle;
    class DropShadowFilter extends flash.filters.BitmapFilter {
        constructor(distance?: number, angle?: number, color?: number, alpha?: number, blurX?: number, blurY?: number, strength?: number, quality?: number, inner?: boolean, knockout?: boolean, hideObject?: boolean);
        _updateFilterBounds(bounds: Rectangle): void;
        private _distance;
        private _angle;
        private _color;
        private _alpha;
        private _blurX;
        private _blurY;
        private _hideObject;
        private _inner;
        private _knockout;
        private _quality;
        private _strength;
        distance: number;
        angle: number;
        color: number;
        alpha: number;
        blurX: number;
        blurY: number;
        hideObject: boolean;
        inner: boolean;
        knockout: boolean;
        quality: number;
        strength: number;
        clone(): BitmapFilter;
    }
}
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
declare module Shumway.flash.filters {
    import Rectangle = flash.geom.Rectangle;
    class GlowFilter extends flash.filters.BitmapFilter {
        constructor(color?: number, alpha?: number, blurX?: number, blurY?: number, strength?: number, quality?: number, inner?: boolean, knockout?: boolean);
        _updateFilterBounds(bounds: Rectangle): void;
        private _color;
        private _alpha;
        private _blurX;
        private _blurY;
        private _inner;
        private _knockout;
        private _quality;
        private _strength;
        color: number;
        alpha: number;
        blurX: number;
        blurY: number;
        inner: boolean;
        knockout: boolean;
        quality: number;
        strength: number;
        clone(): BitmapFilter;
    }
}
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
declare module Shumway.flash.filters {
    import Rectangle = flash.geom.Rectangle;
    class GradientBevelFilter extends flash.filters.BitmapFilter {
        constructor(distance?: number, angle?: number, colors?: Array<number>, alphas?: Array<number>, ratios?: Array<number>, blurX?: number, blurY?: number, strength?: number, quality?: number, type?: string, knockout?: boolean);
        _updateFilterBounds(bounds: Rectangle): void;
        private _distance;
        private _angle;
        private _colors;
        private _alphas;
        private _ratios;
        private _blurX;
        private _blurY;
        private _knockout;
        private _quality;
        private _strength;
        private _type;
        distance: number;
        angle: number;
        colors: Array<number>;
        alphas: Array<number>;
        ratios: Array<number>;
        blurX: number;
        blurY: number;
        knockout: boolean;
        quality: number;
        strength: number;
        type: string;
        clone(): BitmapFilter;
    }
}
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
declare module Shumway.flash.filters {
    import Rectangle = flash.geom.Rectangle;
    class GradientGlowFilter extends flash.filters.BitmapFilter {
        constructor(distance?: number, angle?: number, colors?: Array<number>, alphas?: Array<number>, ratios?: Array<number>, blurX?: number, blurY?: number, strength?: number, quality?: number, type?: string, knockout?: boolean);
        _updateFilterBounds(bounds: Rectangle): void;
        private _distance;
        private _angle;
        private _colors;
        private _alphas;
        private _ratios;
        private _blurX;
        private _blurY;
        private _knockout;
        private _quality;
        private _strength;
        private _type;
        distance: number;
        angle: number;
        colors: Array<number>;
        alphas: Array<number>;
        ratios: Array<number>;
        blurX: number;
        blurY: number;
        knockout: boolean;
        quality: number;
        strength: number;
        type: string;
        clone(): BitmapFilter;
    }
}
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
declare module Shumway.flash.geom {
    class ColorTransform extends LegacyEntity {
        static axClass: typeof ColorTransform;
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(redMultiplier?: number, greenMultiplier?: number, blueMultiplier?: number, alphaMultiplier?: number, redOffset?: number, greenOffset?: number, blueOffset?: number, alphaOffset?: number);
        redMultiplier: number;
        greenMultiplier: number;
        blueMultiplier: number;
        alphaMultiplier: number;
        redOffset: number;
        greenOffset: number;
        blueOffset: number;
        alphaOffset: number;
        native_redMultiplier: number;
        native_greenMultiplier: number;
        native_blueMultiplier: number;
        native_alphaMultiplier: number;
        native_redOffset: number;
        native_greenOffset: number;
        native_blueOffset: number;
        native_alphaOffset: number;
        ColorTransform(redMultiplier?: number, greenMultiplier?: number, blueMultiplier?: number, alphaMultiplier?: number, redOffset?: number, greenOffset?: number, blueOffset?: number, alphaOffset?: number): void;
        color: number;
        concat(second: ColorTransform): void;
        preMultiply(second: ColorTransform): void;
        copyFrom(sourceColorTransform: ColorTransform): void;
        copyFromUntyped(object: any): void;
        setTo(redMultiplier: number, greenMultiplier: number, blueMultiplier: number, alphaMultiplier: number, redOffset: number, greenOffset: number, blueOffset: number, alphaOffset: number): void;
        clone(): ColorTransform;
        convertToFixedPoint(): ColorTransform;
        equals(other: ColorTransform): boolean;
        toString(): string;
    }
}
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
declare module Shumway.flash.media {
    class Camera extends flash.events.EventDispatcher {
        constructor();
        static readonly names: Array<string>;
        static readonly isSupported: boolean;
        static getCamera(name?: string): flash.media.Camera;
        static _scanHardware(): void;
        readonly activityLevel: number;
        readonly bandwidth: number;
        readonly currentFPS: number;
        readonly fps: number;
        readonly height: number;
        readonly index: number;
        readonly keyFrameInterval: number;
        readonly loopback: boolean;
        readonly motionLevel: number;
        readonly motionTimeout: number;
        readonly muted: boolean;
        readonly name: string;
        readonly quality: number;
        readonly width: number;
        setCursor(value: boolean): void;
        setKeyFrameInterval(keyFrameInterval: number): void;
        setLoopback(compress?: boolean): void;
        setMode(width: number, height: number, fps: number, favorArea?: boolean): void;
        setMotionLevel(motionLevel: number, timeout?: number): void;
        setQuality(bandwidth: number, quality: number): void;
        drawToBitmapData(destination: flash.display.BitmapData): void;
        copyToByteArray(rect: flash.geom.Rectangle, destination: flash.utils.ByteArray): void;
        copyToVector(rect: flash.geom.Rectangle, destination: Float64Array): void;
    }
}
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
declare module Shumway.flash.media {
    class ID3Info extends LegacyEntity {
        songName: string;
        artist: string;
        album: string;
        year: string;
        comment: string;
        genre: string;
        track: string;
    }
}
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
declare module Shumway.flash.media {
    class Microphone extends flash.events.EventDispatcher {
        static classInitializer: any;
        constructor();
        static readonly names: Array<string>;
        static readonly isSupported: boolean;
        static getMicrophone(index?: number): flash.media.Microphone;
        static getEnhancedMicrophone(index?: number): flash.media.Microphone;
        rate: number;
        codec: string;
        framesPerPacket: number;
        encodeQuality: number;
        noiseSuppressionLevel: number;
        enableVAD: boolean;
        readonly activityLevel: number;
        gain: number;
        readonly index: number;
        readonly muted: boolean;
        readonly name: string;
        readonly silenceLevel: number;
        readonly silenceTimeout: number;
        readonly useEchoSuppression: boolean;
        soundTransform: flash.media.SoundTransform;
        enhancedOptions: any;
        setSilenceLevel(silenceLevel: number, timeout?: number): void;
        setUseEchoSuppression(useEchoSuppression: boolean): void;
        setLoopBack(state?: boolean): void;
    }
}
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
declare module Shumway.flash.media {
    class Sound extends flash.events.EventDispatcher {
        static classInitializer: any;
        _symbol: SoundSymbol;
        applySymbol(): void;
        static initializeFromPCMData(sec: system.ISecurityDomain, data: any): Sound;
        static classSymbols: string[];
        static instanceSymbols: string[];
        preInit(): void;
        constructor(stream?: flash.net.URLRequest, context?: flash.media.SoundLoaderContext);
        private _playQueue;
        private _soundData;
        private _stream;
        private _url;
        _isURLInaccessible: boolean;
        private _length;
        _isBuffering: boolean;
        private _bytesLoaded;
        private _bytesTotal;
        private _id3;
        readonly url: string;
        readonly isURLInaccessible: boolean;
        readonly length: number;
        readonly isBuffering: boolean;
        readonly bytesLoaded: number;
        readonly bytesTotal: number;
        readonly id3: flash.media.ID3Info;
        loadCompressedDataFromByteArray(bytes: flash.utils.ByteArray, bytesLength: number): void;
        loadPCMFromByteArray(bytes: flash.utils.ByteArray, samples: number, format?: string, stereo?: boolean, sampleRate?: number): void;
        play(startTime?: number, loops?: number, sndTransform?: flash.media.SoundTransform): flash.media.SoundChannel;
        close(): void;
        extract(target: flash.utils.ByteArray, length: number, startPosition?: number): number;
        load(request: flash.net.URLRequest, context?: SoundLoaderContext): void;
    }
    class SoundSymbol extends Timeline.Symbol {
        channels: number;
        sampleRate: number;
        pcm: Float32Array;
        packaged: any;
        constructor(data: Timeline.SymbolData, sec: system.ISecurityDomain);
        static FromData(data: any, loaderInfo: display.LoaderInfo): SoundSymbol;
    }
}
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
declare module Shumway.flash.media {
    class SoundChannel extends flash.events.EventDispatcher implements ISoundSource {
        static classInitializer: any;
        _symbol: SoundChannel;
        constructor();
        static initializeFromAudioElement(sec: system.ISecurityDomain, element: HTMLAudioElement): SoundChannel;
        _element: any;
        _sound: flash.media.Sound;
        private _audioChannel;
        private _pcmData;
        private _playing;
        private _position;
        _soundTransform: flash.media.SoundTransform;
        private _leftPeak;
        private _rightPeak;
        readonly position: number;
        soundTransform: flash.media.SoundTransform;
        readonly leftPeak: number;
        readonly rightPeak: number;
        readonly playing: boolean;
        stop(): void;
        _playSoundDataViaAudio(soundData: any, startTime: number, loops: number): void;
        _playSoundDataViaChannel(soundData: any, startTime: number, loops: number): void;
        stopSound(): void;
        updateSoundLevels(volume: number): void;
    }
}
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
declare module Shumway.flash.media {
    class SoundLoaderContext extends LegacyEntity {
        constructor(bufferTime?: number, checkPolicyFile?: boolean);
        bufferTime: number;
        checkPolicyFile: boolean;
    }
}
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
declare module Shumway.flash.media {
    interface ISoundSource {
        soundTransform: flash.media.SoundTransform;
        updateSoundLevels(volume: number): void;
        stopSound(): void;
    }
    class SoundMixer extends LegacyEntity {
        constructor();
        private static _masterVolume;
        private static _registeredSoundSources;
        private static _bufferTime;
        static _soundTransform: flash.media.SoundTransform;
        static bufferTime: number;
        static soundTransform: flash.media.SoundTransform;
        static audioPlaybackMode: string;
        static useSpeakerphoneForVoice: boolean;
        static stopAll(): void;
        static computeSpectrum(outputArray: flash.utils.ByteArray, FFTMode?: boolean, stretchFactor?: number): void;
        static areSoundsInaccessible(): boolean;
        static _getMasterVolume(): number;
        static _setMasterVolume(volume: number): void;
        static _registerSoundSource(source: ISoundSource): void;
        static _unregisterSoundSource(source: ISoundSource): void;
        static _updateSoundSource(source: ISoundSource): void;
        static _updateAllSoundSources(): void;
    }
}
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
declare module Shumway.flash.media {
    class SoundTransform extends LegacyEntity {
        constructor(vol?: number, panning?: number);
        private _volume;
        private _leftToLeft;
        private _leftToRight;
        private _rightToRight;
        private _rightToLeft;
        volume: number;
        leftToLeft: number;
        leftToRight: number;
        rightToRight: number;
        rightToLeft: number;
        pan: number;
        _updateTransform(): void;
    }
}
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
declare module Shumway.flash.media {
    class StageVideo extends flash.events.EventDispatcher {
        constructor();
        viewPort: flash.geom.Rectangle;
        pan: flash.geom.Point;
        zoom: flash.geom.Point;
        depth: number;
        readonly videoWidth: number;
        readonly videoHeight: number;
        readonly colorSpaces: Float64Array;
        attachNetStream(netStream: flash.net.NetStream): void;
        attachCamera(theCamera: flash.media.Camera): void;
    }
}
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
declare module Shumway.flash.media {
    enum StageVideoAvailability {
        AVAILABLE = "available",
        UNAVAILABLE = "unavailable",
    }
}
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
declare module Shumway.flash.media {
    class Video extends flash.display.DisplayObject {
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        _symbol: VideoSymbol;
        applySymbol(): void;
        protected _initializeFields(): void;
        preInit(): void;
        constructor(width?: number, height?: number);
        _deblocking: number;
        _smoothing: boolean;
        _videoWidth: number;
        _videoHeight: number;
        _netStream: flash.net.NetStream;
        _camera: flash.media.Camera;
        deblocking: number;
        smoothing: boolean;
        readonly videoWidth: number;
        readonly videoHeight: number;
        _containsPointDirectly(localX: number, localY: number, globalX: number, globalY: number): boolean;
        clear(): void;
        attachNetStream(netStream: flash.net.NetStream): void;
        attachCamera(camera: flash.media.Camera): void;
    }
    class VideoSymbol extends Timeline.DisplaySymbol {
        width: number;
        height: number;
        deblocking: number;
        smoothing: boolean;
        codec: number;
        constructor(data: Timeline.SymbolData, sec: system.ISecurityDomain);
        static FromData(data: any, loaderInfo: display.LoaderInfo): VideoSymbol;
    }
}
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
declare module Shumway.flash.media {
    class VideoStreamSettings extends LegacyEntity {
        constructor();
        width: number;
        height: number;
        fps: number;
        quality: number;
        bandwidth: number;
        keyFrameInterval: number;
        codec: string;
        setMode: (width: number, height: number, fps: number) => void;
        setQuality: (bandwidth: number, quality: number) => void;
        setKeyFrameInterval: (keyFrameInterval: number) => void;
    }
}
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
declare module Shumway.flash.net {
    class FileFilter extends LegacyEntity {
        constructor(description: string, extension: string, macType?: string);
        private _description;
        private _extension;
        private _macType;
        description: string;
        extension: string;
        macType: string;
    }
}
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
declare module Shumway.flash.net {
    class FileReference extends flash.events.EventDispatcher {
        constructor();
        load: () => void;
        save: (data: any, defaultFileName?: string) => void;
        readonly creationDate: any;
        readonly creator: string;
        readonly modificationDate: any;
        readonly name: string;
        readonly size: number;
        readonly type: string;
        cancel(): void;
        download(request: flash.net.URLRequest, defaultFileName?: string): void;
        upload(request: flash.net.URLRequest, uploadDataFieldName?: string, testUpload?: boolean): void;
        readonly data: flash.utils.ByteArray;
        browse(typeFilter?: Array<string>): boolean;
    }
}
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
declare module Shumway.flash.net {
    class FileReferenceList extends flash.events.EventDispatcher {
        static classInitializer: any;
        constructor();
        readonly fileList: Array<number>;
        browse(typeFilter?: Array<string>): boolean;
    }
}
/**
 * Copyright 2015 Mozilla Foundation
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
declare module Shumway.flash.net {
    class LocalConnection extends flash.events.EventDispatcher implements ILocalConnectionReceiver {
        constructor();
        static readonly isSupported: boolean;
        private _domain;
        private _secure;
        private _client;
        private _connectionName;
        private _allowedInsecureDomains;
        private _allowedSecureDomains;
        close(): void;
        connect(connectionName: string): void;
        send(connectionName: string, methodName: string, ...args: Array<any>): void;
        client: any;
        allowDomain(...domains: string[]): void;
        allowInsecureDomain(...domains: string[]): void;
        private _allowDomains(domains, secure);
        handleMessage(methodName: string, argsBuffer: ArrayBuffer): void;
        readonly domain: string;
        isPerUser: boolean;
    }
}
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
declare module Shumway.flash.net {
    class NetConnection extends flash.events.EventDispatcher {
        static classInitializer: any;
        constructor();
        close(): void;
        addHeader(operation: string, mustUnderstand?: Boolean, param?: Object): void;
        call(command: string, responder: Responder): void;
        static _defaultObjectEncoding: number;
        static defaultObjectEncoding: number;
        private _connected;
        private _uri;
        private _client;
        private _objectEncoding;
        private _proxyType;
        private _usingTLS;
        private _protocol;
        private _rtmpConnection;
        private _rtmpCreateStreamCallbacks;
        readonly connected: boolean;
        readonly uri: string;
        connect(command: string): void;
        _createRtmpStream(callback: any): void;
        client: any;
        objectEncoding: number;
        proxyType: string;
        readonly connectedProxyType: string;
        readonly usingTLS: boolean;
        readonly protocol: string;
        maxPeerConnections: number;
        readonly nearID: string;
        readonly farID: string;
        readonly nearNonce: string;
        readonly farNonce: string;
        readonly unconnectedPeerStreams: Array<any>;
        invoke(index: number): any;
        private _invoke(index, args);
    }
}
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
declare module Shumway.flash.net {
    import VideoPlaybackEvent = Shumway.Remoting.VideoPlaybackEvent;
    import VideoControlEvent = Shumway.Remoting.VideoControlEvent;
    import ISoundSource = flash.media.ISoundSource;
    class NetStream extends flash.events.EventDispatcher implements ISoundSource {
        _isDirty: boolean;
        constructor(connection: flash.net.NetConnection, peerID?: string);
        _connection: flash.net.NetConnection;
        _peerID: string;
        _id: number;
        private _resourceName;
        private _metaData;
        /**
         * Only one video can be attached to this |NetStream| object. If we attach another video, then
         * the previous attachement is lost. (Validated through experimentation.)
         */
        _videoReferrer: flash.media.Video;
        private _videoStream;
        private _contentTypeHint;
        static DIRECT_CONNECTIONS: string;
        static CONNECT_TO_FMS: string;
        attach: (connection: flash.net.NetConnection) => void;
        close: () => void;
        attachAudio: (microphone: flash.media.Microphone) => void;
        attachCamera: (theCamera: flash.media.Camera, snapshotMilliseconds?: number) => void;
        send: (handlerName: string) => void;
        bufferTime: number;
        maxPauseBufferTime: number;
        backBufferTime: number;
        backBufferLength: number;
        step: (frames: number) => void;
        bufferTimeMax: number;
        receiveAudio: (flag: boolean) => void;
        receiveVideo: (flag: boolean) => void;
        receiveVideoFPS: (FPS: number) => void;
        pause: () => void;
        resume: () => void;
        togglePause: () => void;
        seek: (offset: number) => void;
        publish: (name?: string, type?: string) => void;
        time: number;
        currentFPS: number;
        bufferLength: number;
        liveDelay: number;
        bytesLoaded: number;
        bytesTotal: number;
        decodedFrames: number;
        videoCodec: number;
        audioCodec: number;
        onPeerConnect: (subscriber: flash.net.NetStream) => boolean;
        call: () => void;
        _inBufferSeek: boolean;
        private _info;
        private _soundTransform;
        private _checkPolicyFile;
        private _client;
        private _objectEncoding;
        dispose(): void;
        _getVideoStreamURL(): string;
        play(url: string): void;
        play2(param: flash.net.NetStreamPlayOptions): void;
        readonly info: flash.net.NetStreamInfo;
        readonly multicastInfo: flash.net.NetStreamMulticastInfo;
        soundTransform: flash.media.SoundTransform;
        checkPolicyFile: boolean;
        client: any;
        readonly objectEncoding: number;
        multicastPushNeighborLimit: number;
        multicastWindowDuration: number;
        multicastRelayMarginDuration: number;
        multicastAvailabilityUpdatePeriod: number;
        multicastFetchPeriod: number;
        multicastAvailabilitySendToAll: boolean;
        readonly farID: string;
        readonly nearNonce: string;
        readonly farNonce: string;
        readonly peerStreams: Array<any>;
        audioReliable: boolean;
        videoReliable: boolean;
        dataReliable: boolean;
        audioSampleAccess: boolean;
        videoSampleAccess: boolean;
        appendBytes(bytes: flash.utils.ByteArray): void;
        appendBytesAction(netStreamAppendBytesAction: string): void;
        useHardwareDecoder: boolean;
        useJitterBuffer: boolean;
        videoStreamSettings: flash.media.VideoStreamSettings;
        invoke(index: number): any;
        invokeWithArgsArray(index: number, p_arguments: Array<any>): any;
        inBufferSeek: boolean;
        private _invoke(index, args);
        private _notifyVideoControl(eventType, data);
        processVideoEvent(eventType: VideoPlaybackEvent, data: any): void;
        stopSound(): void;
        updateSoundLevels(volume: number): void;
    }
    interface IVideoElementService {
        registerEventListener(id: number, listener: (eventType: VideoPlaybackEvent, data: any) => void): void;
        notifyVideoControl(id: number, eventType: VideoControlEvent, data: any): any;
    }
}
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
declare module Shumway.flash.net {
    class NetStreamInfo extends LegacyEntity {
        constructor(curBPS: number, byteCount: number, maxBPS: number, audioBPS: number, audioByteCount: number, videoBPS: number, videoByteCount: number, dataBPS: number, dataByteCount: number, playbackBPS: number, droppedFrames: number, audioBufferByteLength: number, videoBufferByteLength: number, dataBufferByteLength: number, audioBufferLength: number, videoBufferLength: number, dataBufferLength: number, srtt: number, audioLossRate: number, videoLossRate: number, metaData?: any, xmpData?: any, uri?: string, resourceName?: string, isLive?: boolean);
        currentBytesPerSecond: number;
        byteCount: number;
        maxBytesPerSecond: number;
        audioBytesPerSecond: number;
        audioByteCount: number;
        videoBytesPerSecond: number;
        videoByteCount: number;
        dataBytesPerSecond: number;
        dataByteCount: number;
        playbackBytesPerSecond: number;
        droppedFrames: number;
        audioBufferByteLength: number;
        videoBufferByteLength: number;
        dataBufferByteLength: number;
        audioBufferLength: number;
        videoBufferLength: number;
        dataBufferLength: number;
        SRTT: number;
        audioLossRate: number;
        videoLossRate: number;
        metaData: any;
        xmpData: any;
        uri: string;
        resourceName: string;
        isLive: boolean;
        _curBPS: number;
        _byteCount: number;
        _maxBPS: number;
        _audioBPS: number;
        _audioByteCount: number;
        _videoBPS: number;
        _videoByteCount: number;
        _dataBPS: number;
        _dataByteCount: number;
        _playbackBPS: number;
        _droppedFrames: number;
        _audioBufferByteLength: number;
        _videoBufferByteLength: number;
        _dataBufferByteLength: number;
        _audioBufferLength: number;
        _videoBufferLength: number;
        _dataBufferLength: number;
        _srtt: number;
        _audioLossRate: number;
        _videoLossRate: number;
        _metaData: any;
        _xmpData: any;
        _uri: string;
        _resourceName: string;
        _isLive: boolean;
    }
}
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
declare module Shumway.flash.net {
    class NetStreamMulticastInfo extends LegacyEntity {
        constructor(sendDataBytesPerSecond: number, sendControlBytesPerSecond: number, receiveDataBytesPerSecond: number, receiveControlBytesPerSecond: number, bytesPushedToPeers: number, fragmentsPushedToPeers: number, bytesRequestedByPeers: number, fragmentsRequestedByPeers: number, bytesPushedFromPeers: number, fragmentsPushedFromPeers: number, bytesRequestedFromPeers: number, fragmentsRequestedFromPeers: number, sendControlBytesPerSecondToServer: number, receiveDataBytesPerSecondFromServer: number, bytesReceivedFromServer: number, fragmentsReceivedFromServer: number, receiveDataBytesPerSecondFromIPMulticast: number, bytesReceivedFromIPMulticast: number, fragmentsReceivedFromIPMulticast: number);
        _sendDataBytesPerSecond: number;
        _sendControlBytesPerSecond: number;
        _receiveDataBytesPerSecond: number;
        _receiveControlBytesPerSecond: number;
        _bytesPushedToPeers: number;
        _fragmentsPushedToPeers: number;
        _bytesRequestedByPeers: number;
        _fragmentsRequestedByPeers: number;
        _bytesPushedFromPeers: number;
        _fragmentsPushedFromPeers: number;
        _bytesRequestedFromPeers: number;
        _fragmentsRequestedFromPeers: number;
        _sendControlBytesPerSecondToServer: number;
        _receiveDataBytesPerSecondFromServer: number;
        _bytesReceivedFromServer: number;
        _fragmentsReceivedFromServer: number;
        _receiveDataBytesPerSecondFromIPMulticast: number;
        _bytesReceivedFromIPMulticast: number;
        _fragmentsReceivedFromIPMulticast: number;
        sendDataBytesPerSecond: number;
        sendControlBytesPerSecond: number;
        receiveDataBytesPerSecond: number;
        receiveControlBytesPerSecond: number;
        bytesPushedToPeers: number;
        fragmentsPushedToPeers: number;
        bytesRequestedByPeers: number;
        fragmentsRequestedByPeers: number;
        bytesPushedFromPeers: number;
        fragmentsPushedFromPeers: number;
        bytesRequestedFromPeers: number;
        fragmentsRequestedFromPeers: number;
        sendControlBytesPerSecondToServer: number;
        receiveDataBytesPerSecondFromServer: number;
        bytesReceivedFromServer: number;
        fragmentsReceivedFromServer: number;
        receiveDataBytesPerSecondFromIPMulticast: number;
        bytesReceivedFromIPMulticast: number;
        fragmentsReceivedFromIPMulticast: number;
    }
}
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
declare module Shumway.flash.net {
    class NetStreamPlayOptions extends flash.events.EventDispatcher {
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        streamName: string;
        oldStreamName: string;
        start: number;
        len: number;
        offset: number;
        transition: string;
    }
}
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
declare module Shumway.flash.net {
    class Responder extends LegacyEntity {
        constructor(result: Function, status?: Function);
        private _result;
        private _status;
        ctor(result: Function, status: Function): void;
    }
}
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
declare module Shumway.flash.net {
    class SharedObject extends flash.events.EventDispatcher {
        static classInitializer: any;
        constructor();
        static _sharedObjects: any;
        private static _defaultObjectEncoding;
        static deleteAll(url: string): number;
        static getDiskUsage(url: string): number;
        private static _create(path, data, encoding);
        static getLocal(name: string, localPath?: string, secure?: boolean): SharedObject;
        static getRemote(name: string, remotePath?: string, persistence?: any, secure?: boolean): flash.net.SharedObject;
        static defaultObjectEncoding: number;
        private _path;
        private _data;
        private _fps;
        private _objectEncoding;
        private _pendingFlushId;
        readonly data: Object;
        objectEncoding: number;
        client: any;
        setDirty(propertyName: string): void;
        connect(myConnection: NetConnection, params?: string): void;
        send(): void;
        close(): void;
        flush(minDiskSpace?: number): string;
        clear(): void;
        readonly size: number;
        fps: number;
        setProperty(propertyName: string, value?: any): void;
        private queueFlush();
    }
}
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
declare module Shumway.flash.net {
    class Socket extends flash.events.EventDispatcher implements flash.utils.IDataInput, flash.utils.IDataOutput {
        constructor(host?: string, port?: number);
        timeout: number;
        connect: (host: string, port: number) => void;
        close: () => void;
        readonly bytesAvailable: number;
        readonly connected: boolean;
        objectEncoding: number;
        endian: string;
        readonly bytesPending: number;
        readBytes(bytes: flash.utils.ByteArray, offset?: number, length?: number): void;
        writeBytes(bytes: flash.utils.ByteArray, offset?: number, length?: number): void;
        writeBoolean(value: boolean): void;
        writeByte(value: number): void;
        writeShort(value: number): void;
        writeInt(value: number): void;
        writeUnsignedInt(value: number): void;
        writeFloat(value: number): void;
        writeDouble(value: number): void;
        writeMultiByte(value: string, charSet: string): void;
        writeUTF(value: string): void;
        writeUTFBytes(value: string): void;
        readBoolean(): boolean;
        readByte(): number;
        readUnsignedByte(): number;
        readShort(): number;
        readUnsignedShort(): number;
        readInt(): number;
        readUnsignedInt(): number;
        readFloat(): number;
        readDouble(): number;
        readMultiByte(length: number, charSet: string): string;
        readUTF(): string;
        readUTFBytes(length: number): string;
        flush(): void;
        writeObject(object: any): void;
        readObject(): any;
        internalGetSecurityErrorMessage(host: any, port: number): string;
        internalConnect(host: any, port: number): void;
        didFailureOccur(): boolean;
    }
}
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
declare module Shumway.flash.net {
    import Event = flash.events.Event;
    class URLLoader extends flash.events.EventDispatcher {
        constructor(request?: flash.net.URLRequest);
        _data: any;
        _dataFormat: string;
        _bytesLoaded: number;
        _bytesTotal: number;
        readonly data: any;
        dataFormat: string;
        readonly bytesLoaded: number;
        readonly bytesTotal: number;
        private _stream;
        private _httpResponseEventBound;
        _ignoreDecodeErrors: boolean;
        load(request: URLRequest): void;
        close(): void;
        complete(): void;
        addEventListener(type: string, listener: (event: Event) => void, useCapture?: boolean, priority?: number, useWeakReference?: boolean): void;
        private onStreamOpen(e);
        private onStreamComplete(e);
        private onStreamProgress(e);
        private onStreamIOError(e);
        private onStreamHTTPStatus(e);
        private onStreamHTTPResponseStatus(e);
        private onStreamSecurityError(e);
    }
}
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
declare module Shumway.flash.net {
    class URLRequest extends LegacyEntity {
        constructor(url?: string);
        _checkPolicyFile: boolean;
        private _url;
        private _data;
        private _method;
        private _contentType;
        private _requestHeaders;
        private _digest;
        url: string;
        data: any;
        method: string;
        contentType: string;
        requestHeaders: Array<any>;
        digest: string;
        _toFileRequest(): any;
    }
}
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
declare module Shumway.flash.net {
    class URLRequestHeader extends LegacyEntity {
        constructor(name?: string, value?: string);
        name: string;
        value: string;
    }
}
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
declare module Shumway.flash.net {
    class URLStream extends flash.events.EventDispatcher implements flash.utils.IDataInput {
        constructor();
        private _buffer;
        private _writePosition;
        private _session;
        private _connected;
        readonly connected: boolean;
        readonly bytesAvailable: number;
        objectEncoding: number;
        endian: string;
        readonly diskCacheEnabled: boolean;
        position: number;
        readonly length: number;
        load(request: flash.net.URLRequest): void;
        readBytes(bytes: flash.utils.ByteArray, offset?: number, length?: number): void;
        readBoolean(): boolean;
        readByte(): number;
        readUnsignedByte(): number;
        readShort(): number;
        readUnsignedShort(): number;
        readUnsignedInt(): number;
        readInt(): number;
        readFloat(): number;
        readDouble(): number;
        readMultiByte(length: number, charSet: string): string;
        readUTF(): string;
        readUTFBytes(length: number): string;
        close(): void;
        readObject(): any;
        stop(): void;
    }
}
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
declare module Shumway.flash.net {
    class URLVariables extends LegacyEntity {
        constructor(source?: string);
        _ignoreDecodingErrors: boolean;
        _inner: any;
        decode(source: string): void;
        toString(): string;
        axSetPublicProperty(name: string, value: any): void;
        axGetPublicProperty(name: string): any;
        axGetEnumerableKeys(): string[];
    }
}
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
declare module Shumway.flash.system {
    import Multiname = Shumway.flash.lang.Multiname;
    import NamespaceType = Shumway.flash.lang.NamespaceType;
    class ApplicationDomain extends LegacyEntity implements lang.IApplicationDomain {
        loadABC(file: Shumway.flash.lang.ABCFile): void;
        loadAndExecuteABC(file: Shumway.flash.lang.ABCFile): void;
        getClass(name: Multiname, namespaceType?: NamespaceType): LegacyClass;
        addClass(entry: {
            name: Multiname;
            value: LegacyClass;
        }): {
            name: Multiname;
            value: LegacyClass<any>;
        };
        _classes: Array<{
            name: Multiname;
            value: LegacyClass;
        }>;
        _parentDomain: ApplicationDomain;
        url: string;
        constructor(parentDomain?: any);
        static readonly currentDomain: flash.system.ApplicationDomain;
        static readonly MIN_DOMAIN_MEMORY_LENGTH: number;
        readonly parentDomain: flash.system.ApplicationDomain;
        domainMemory: flash.utils.ByteArray;
        getDefinition(name: string): Object;
        hasDefinition(name: string): boolean;
        private getDefinitionImpl(name);
        getQualifiedDefinitionNames(): ArrayLike<any>;
    }
}
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
declare module Shumway.flash.system {
    class Capabilities extends LegacyEntity {
        constructor();
        private static _hasAccessibility;
        private static _language;
        private static _manufacturer;
        private static _os;
        private static _playerType;
        private static _version;
        private static _screenDPI;
        static readonly isEmbeddedInAcrobat: boolean;
        static readonly hasEmbeddedVideo: boolean;
        static readonly hasAudio: boolean;
        static readonly avHardwareDisable: boolean;
        static readonly hasAccessibility: boolean;
        static readonly hasAudioEncoder: boolean;
        static readonly hasMP3: boolean;
        static readonly hasPrinting: boolean;
        static readonly hasScreenBroadcast: boolean;
        static readonly hasScreenPlayback: boolean;
        static readonly hasStreamingAudio: boolean;
        static readonly hasStreamingVideo: boolean;
        static readonly hasVideoEncoder: boolean;
        static readonly isDebugger: boolean;
        static readonly localFileReadDisable: boolean;
        static readonly language: string;
        static readonly manufacturer: string;
        static readonly os: string;
        static readonly cpuArchitecture: string;
        static readonly playerType: string;
        static readonly serverString: string;
        static readonly version: string;
        /**
         * This can be "color", "gray" or "bw" for black and white. I don't know when you'd have anything
         * other than "color".
         */
        static readonly screenColor: string;
        static readonly pixelAspectRatio: number;
        static readonly screenDPI: number;
        static readonly screenResolutionX: number;
        static readonly screenResolutionY: number;
        static readonly touchscreenType: string;
        static readonly hasIME: boolean;
        static readonly hasTLS: boolean;
        static readonly maxLevelIDC: string;
        static readonly supports32BitProcesses: boolean;
        static readonly supports64BitProcesses: boolean;
        static readonly _internal: number;
        static hasMultiChannelAudio(type: string): boolean;
    }
}
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
declare module Shumway.flash.system {
    interface IFSCommandListener {
        executeFSCommand(command: string, args: string): void;
    }
    function fscommand(sec: ISecurityDomain, command: string, args: string): void;
}
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
declare module Shumway.flash.system {
    enum ImageDecodingPolicy {
        ON_DEMAND = "onDemand",
        ON_LOAD = "onLoad",
    }
}
/**
 * Copyright 2015 Mozilla Foundation
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
declare module Shumway.flash.system {
    class LoaderContext extends LegacyEntity {
        private $BgcheckPolicyFile;
        private $BgapplicationDomain;
        private $BgsecurityDomain;
        private $BgallowCodeImport;
        private $BgrequestedContentParent;
        private $Bgparameters;
        private $BgimageDecodingPolicy;
        _avm1Context: any;
        constructor(checkPolicyFile?: boolean, applicationDomain?: flash.system.ApplicationDomain, securityDomain?: flash.system.SecurityDomain);
        readonly imageDecodingPolicy: string;
        readonly parameters: any;
        readonly requestedContentParent: flash.display.DisplayObjectContainer;
        readonly allowCodeImport: boolean;
        readonly securityDomain: flash.system.SecurityDomain;
        readonly applicationDomain: flash.system.ApplicationDomain;
        readonly checkPolicyFile: boolean;
    }
}
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
declare module Shumway.flash.system {
    class JPEGLoaderContext extends LoaderContext {
        constructor(deblockingFilter?: number, checkPolicyFile?: boolean, applicationDomain?: flash.system.ApplicationDomain, securityDomain?: flash.system.SecurityDomain);
        deblockingFilter: number;
    }
}
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
declare module Shumway.flash.system {
    class MessageChannel extends flash.events.EventDispatcher {
        constructor();
        readonly messageAvailable: boolean;
        readonly state: string;
        send(arg: any, queueLimit?: number): void;
        receive(blockUntilReceived?: boolean): any;
        close(): void;
    }
}
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
declare module Shumway.flash.system {
    enum MessageChannelState {
        OPEN = "open",
        CLOSING = "closing",
        CLOSED = "closed",
    }
}
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
declare module Shumway.flash.system {
    class Security extends LegacyEntity {
        constructor();
        static REMOTE: string;
        static LOCAL_WITH_FILE: string;
        static LOCAL_WITH_NETWORK: string;
        static LOCAL_TRUSTED: string;
        static APPLICATION: string;
        private static _exactSettings;
        private static _sandboxType;
        static exactSettings: boolean;
        static disableAVM1Loading: boolean;
        static readonly sandboxType: string;
        static readonly pageDomain: string;
        static allowDomain(): void;
        static allowInsecureDomain(): void;
        static loadPolicyFile(url: string): void;
        static showSettings(panel?: string): void;
        static duplicateSandboxBridgeInputArguments(toplevel: any, args: Array<any>): Array<any>;
        static duplicateSandboxBridgeOutputArgument(toplevel: any, arg: any): any;
    }
    const enum CrossDomainSWFLoadingWhitelistResult {
        /**
         * The requested domain belongs to the same domain as SWF's.
         */
        OwnDomain = 0,
        /**
         * The requested domain belongs to the other domain than SWF's.
         */
        Remote = 1,
        /**
         * The requested domain is not whitelisted.
         */
        Failed = 2,
    }
    interface ICrossDomainSWFLoadingWhitelist {
        addToSWFLoadingWhitelist(domain: string, insecure: boolean, ownDomain: boolean): void;
        checkDomainForSWFLoading(domain: string): CrossDomainSWFLoadingWhitelistResult;
    }
}
declare module Shumway.flash.system {
    interface ISecurityDomain {
        events: EventsNamespace;
        display: DisplayNamespace;
        geom: GeomNamespace;
        text: TextNamespace;
        system: SystemNamespace;
        filters: FiltersNamespace;
        media: MediaNamespace;
        net: NetNamespace;
        ui: UINamespace;
        player: any;
        createError(className: string, error: any, replacement1?: any, replacement2?: any, replacement3?: any, replacement4?: any): LegacyError;
    }
    class LegacyError extends Error {
        code: number;
        constructor(msg: string, code: number);
    }
    class SecurityDomain implements ISecurityDomain {
        constructor();
        player: any;
        events: EventsNamespace;
        utils: UtilsNamespace;
        display: DisplayNamespace;
        geom: GeomNamespace;
        text: TextNamespace;
        system: SystemNamespace;
        filters: FiltersNamespace;
        media: MediaNamespace;
        net: NetNamespace;
        ui: UINamespace;
        throwError(className: string, error: any, replacement1?: any, replacement2?: any, replacement3?: any, replacement4?: any): void;
        createError(className: string, error: any, replacement1?: any, replacement2?: any, replacement3?: any, replacement4?: any): LegacyError;
    }
}
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
declare module Shumway.flash.system {
    enum SecurityPanel {
        DEFAULT = "default",
        PRIVACY = "privacy",
        LOCAL_STORAGE = "localStorage",
        MICROPHONE = "microphone",
        CAMERA = "camera",
        DISPLAY = "display",
        SETTINGS_MANAGER = "settingsManager",
    }
}
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
declare module Shumway.flash.system {
    enum TouchscreenType {
        FINGER = "finger",
        STYLUS = "stylus",
        NONE = "none",
    }
}
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
declare module Shumway.flash.text {
    enum AntiAliasType {
        NORMAL = "normal",
        ADVANCED = "advanced",
    }
    namespace AntiAliasType {
        function fromNumber(n: number): string;
        function toNumber(value: string): number;
    }
}
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
declare module Shumway.flash.text {
    enum FontStyle {
        REGULAR = "regular",
        BOLD = "bold",
        ITALIC = "italic",
        BOLD_ITALIC = "boldItalic",
    }
}
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
declare module Shumway.flash.text {
    enum FontType {
        EMBEDDED = "embedded",
        EMBEDDED_CFF = "embeddedCFF",
        DEVICE = "device",
    }
}
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
declare module Shumway.flash.text {
    class Font extends LegacyEntity implements Shumway.Remoting.IRemotable {
        private _initializeFields();
        _symbol: FontSymbol;
        applySymbol(): void;
        constructor();
        _fontName: string;
        _fontFamily: string;
        _fontStyle: string;
        _fontType: string;
        _id: number;
        ascent: number;
        descent: number;
        leading: number;
        advances: number[];
        readonly fontName: string;
        readonly fontStyle: string;
        readonly fontType: string;
        hasGlyphs(str: string): boolean;
    }
    class FontSymbol extends Timeline.Symbol implements Timeline.EagerlyResolvedSymbol {
        name: string;
        bold: boolean;
        italic: boolean;
        codes: number[];
        originalSize: boolean;
        metrics: any;
        syncId: number;
        constructor(data: Timeline.SymbolData, sec: system.ISecurityDomain);
        static FromData(data: any, loaderInfo: display.LoaderInfo): FontSymbol;
        readonly resolveAssetCallback: any;
        private _unboundResolveAssetCallback(data);
    }
}
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
declare module Shumway.flash.text {
    enum GridFitType {
        NONE = "none",
        PIXEL = "pixel",
        SUBPIXEL = "subpixel",
    }
    namespace GridFitType {
        function fromNumber(n: number): string;
        function toNumber(value: string): number;
    }
}
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
declare module Shumway.flash.text {
    class StaticText extends flash.display.DisplayObject {
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        _symbol: TextSymbol;
        applySymbol(): void;
        preInit(): void;
        constructor();
        _canHaveTextContent(): boolean;
        _getTextContent(): Shumway.TextContent;
        _textContent: Shumway.TextContent;
        readonly text: string;
    }
}
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
declare module Shumway.flash.text {
    interface Style {
        color?: string;
        display?: string;
        fontFamily?: string;
        fontSize?: any;
        fontStyle?: string;
        fontWeight?: string;
        kerning?: any;
        leading?: any;
        letterSpacing?: any;
        marginLeft?: any;
        marginRight?: any;
        textAlign?: string;
        textDecoration?: string;
        textIndent?: any;
    }
    class StyleSheet extends flash.events.EventDispatcher {
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        private _rules;
        readonly styleNames: Array<string>;
        getStyle(styleName: string): Style;
        applyStyle(textFormat: TextFormat, styleName: string): TextFormat;
        setStyle(styleName: string, styleObject: Style): void;
        hasStyle(styleName: string): boolean;
        clear(): void;
        transform(formatObject: any): TextFormat;
        parseCSS(css: string): void;
    }
}
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
declare module Shumway.flash.text {
    enum TextDisplayMode {
        LCD = "lcd",
        CRT = "crt",
        DEFAULT = "default",
    }
}
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
declare module Shumway.flash.text {
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    class TextField extends flash.display.InteractiveObject {
        _symbol: TextSymbol;
        applySymbol(): void;
        preInit(): void;
        constructor();
        protected _initializeFields(): void;
        _setFillAndLineBoundsFromSymbol(symbol: Timeline.DisplaySymbol): void;
        _setFillAndLineBoundsFromWidthAndHeight(width: number, height: number): void;
        _canHaveTextContent(): boolean;
        _getTextContent(): Shumway.TextContent;
        _getContentBounds(includeStrokes?: boolean): Bounds;
        _containsPointDirectly(localX: number, localY: number, globalX: number, globalY: number): boolean;
        private _invalidateContent();
        _textContent: Shumway.TextContent;
        _lineMetricsData: DataBuffer;
        static isFontCompatible(fontName: string, fontStyle: string): boolean;
        _alwaysShowSelection: boolean;
        _antiAliasType: string;
        _autoSize: string;
        _background: boolean;
        _backgroundColor: number;
        _border: boolean;
        _borderColor: number;
        _bottomScrollV: number;
        _caretIndex: number;
        _condenseWhite: boolean;
        _embedFonts: boolean;
        _gridFitType: string;
        _htmlText: string;
        _length: number;
        _textInteractionMode: string;
        _maxChars: number;
        _maxScrollH: number;
        _maxScrollV: number;
        _mouseWheelEnabled: boolean;
        _multiline: boolean;
        _numLines: number;
        _displayAsPassword: boolean;
        _restrict: string;
        _scrollH: number;
        _scrollV: number;
        _selectable: boolean;
        _selectedText: string;
        _selectionBeginIndex: number;
        _selectionEndIndex: number;
        _sharpness: number;
        _styleSheet: flash.text.StyleSheet;
        _textColor: number;
        _textHeight: number;
        _textWidth: number;
        _thickness: number;
        _type: string;
        _wordWrap: boolean;
        _useRichTextClipboard: boolean;
        alwaysShowSelection: boolean;
        antiAliasType: string;
        autoSize: string;
        background: boolean;
        backgroundColor: number;
        border: boolean;
        borderColor: number;
        readonly bottomScrollV: number;
        readonly caretIndex: number;
        condenseWhite: boolean;
        defaultTextFormat: flash.text.TextFormat;
        embedFonts: boolean;
        gridFitType: string;
        htmlText: string;
        readonly length: number;
        readonly textInteractionMode: string;
        maxChars: number;
        readonly maxScrollH: number;
        readonly maxScrollV: number;
        mouseWheelEnabled: boolean;
        multiline: boolean;
        readonly numLines: number;
        displayAsPassword: boolean;
        restrict: string;
        scrollH: number;
        scrollV: number;
        selectable: boolean;
        readonly selectedText: string;
        readonly selectionBeginIndex: number;
        readonly selectionEndIndex: number;
        sharpness: number;
        styleSheet: flash.text.StyleSheet;
        text: string;
        textColor: number;
        readonly textHeight: number;
        readonly textWidth: number;
        thickness: number;
        type: string;
        wordWrap: boolean;
        useRichTextClipboard: boolean;
        copyRichText(): void;
        pasteRichText(richText: string): void;
        getXMLText(beginIndex: number, endIndex?: number): string;
        insertXMLText(beginIndex: number, endIndex: number, richText: String, pasting: Boolean): void;
        private _ensureLineMetrics();
        appendText(newText: string): void;
        getCharBoundaries(charIndex: number): flash.geom.Rectangle;
        getCharIndexAtPoint(x: number, y: number): number;
        getFirstCharInParagraph(charIndex: number): number;
        getLineIndexAtPoint(x: number, y: number): number;
        getLineIndexOfChar(charIndex: number): number;
        getLineLength(lineIndex: number): number;
        getLineMetrics(lineIndex: number): flash.text.TextLineMetrics;
        getLineOffset(lineIndex: number): number;
        getLineText(lineIndex: number): string;
        getParagraphLength(charIndex: number): number;
        /**
         * Returns a TextFormat object that contains the intersection of formatting information for the
         * range of text between |beginIndex| and |endIndex|.
         */
        getTextFormat(beginIndex?: number, endIndex?: number): flash.text.TextFormat;
        getTextRuns(beginIndex?: number, endIndex?: number): Array<any>;
        getRawText(): string;
        replaceSelectedText(value: string): void;
        replaceText(beginIndex: number, endIndex: number, newText: string): void;
        setSelection(beginIndex: number, endIndex: number): void;
        setTextFormat(format: flash.text.TextFormat, beginIndex?: number, endIndex?: number): void;
        getImageReference(id: string): flash.display.DisplayObject;
    }
    class TextSymbol extends Timeline.DisplaySymbol {
        color: number;
        size: number;
        face: string;
        bold: boolean;
        italic: boolean;
        align: string;
        leftMargin: number;
        rightMargin: number;
        indent: number;
        leading: number;
        multiline: boolean;
        wordWrap: boolean;
        embedFonts: boolean;
        selectable: boolean;
        border: boolean;
        initialText: string;
        html: boolean;
        displayAsPassword: boolean;
        type: string;
        maxChars: number;
        autoSize: string;
        variableName: string;
        textContent: Shumway.TextContent;
        constructor(data: Timeline.SymbolData, _sec: system.ISecurityDomain);
        static FromTextData(data: any, loaderInfo: flash.display.LoaderInfo): TextSymbol;
        /**
         * Turns raw DefineLabel tag data into an object that's consumable as a text symbol and then
         * passes that into `FromTextData`, returning the resulting TextSymbol.
         *
         * This has to be done outside the SWF parser because it relies on any used fonts being
         * available as symbols, which isn't the case in the SWF parser.
         */
        static FromLabelData(data: any, loaderInfo: flash.display.LoaderInfo): TextSymbol;
    }
}
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
declare module Shumway.flash.text {
    enum TextFieldAutoSize {
        NONE = "none",
        LEFT = "left",
        CENTER = "center",
        RIGHT = "right",
    }
    namespace TextFieldAutoSize {
        function fromNumber(n: number): string;
        function toNumber(value: string): number;
    }
}
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
declare module Shumway.flash.text {
    enum TextFieldType {
        INPUT = "input",
        DYNAMIC = "dynamic",
    }
}
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
declare module Shumway.flash.text {
    class TextFormat extends LegacyEntity {
        constructor(font?: string, size?: Object, color?: Object, bold?: Object, italic?: Object, underline?: Object, url?: string, target?: string, align?: string, leftMargin?: Object, rightMargin?: Object, indent?: Object, leading?: Object);
        private static measureTextField;
        private _align;
        private _blockIndent;
        private _bold;
        private _bullet;
        private _color;
        private _display;
        private _font;
        private _indent;
        private _italic;
        private _kerning;
        private _leading;
        private _leftMargin;
        private _letterSpacing;
        private _rightMargin;
        private _size;
        private _tabStops;
        private _target;
        private _underline;
        private _url;
        align: string;
        blockIndent: Object;
        bold: Object;
        bullet: Object;
        color: Object;
        display: string;
        font: string;
        readonly style: string;
        indent: Object;
        italic: Object;
        kerning: Object;
        leading: Object;
        leftMargin: Object;
        letterSpacing: Object;
        rightMargin: Object;
        size: Object;
        tabStops: ArrayLike<number>;
        target: string;
        underline: Object;
        url: string;
        /**
         * All integer values on TextFormat are typed as Object and coerced to ints using the following
         * "algorithm":
         * - if the supplied value is null or undefined, the field is set to null
         * - else if coercing to number results in NaN or the value is greater than MAX_INT, set to
         *   -0x80000000
         * - else, round the coerced value using half-even rounding
         */
        private static coerceNumber(value);
        /**
         * Boolean values are only stored as bools if they're not undefined or null. In that case,
         * they're stored as null.
         */
        private static coerceBoolean(value);
        clone(): TextFormat;
        equals(other: TextFormat): boolean;
        merge(other: TextFormat): void;
        intersect(other: TextFormat): void;
        transform(formatObject: Style): this;
    }
}
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
declare module Shumway.flash.text {
    enum TextFormatAlign {
        LEFT = "left",
        CENTER = "center",
        RIGHT = "right",
        JUSTIFY = "justify",
        START = "start",
        END = "end",
    }
    namespace TextFormatAlign {
        function fromNumber(n: number): string;
        function toNumber(value: string): number;
    }
}
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
declare module Shumway.flash.text {
    enum TextFormatDisplay {
        INLINE = "inline",
        BLOCK = "block",
    }
}
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
declare module Shumway.flash.text {
    enum TextInteractionMode {
        NORMAL = "normal",
        SELECTION = "selection",
    }
}
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
declare module Shumway.flash.text {
    class TextLineMetrics extends LegacyEntity {
        constructor(x: number, width: number, height: number, ascent: number, descent: number, leading: number);
        x: number;
        width: number;
        height: number;
        ascent: number;
        descent: number;
        leading: number;
    }
}
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
declare module Shumway.flash.text {
    class TextRun extends LegacyEntity {
        constructor(beginIndex: number, endIndex: number, textFormat: flash.text.TextFormat);
        _beginIndex: number;
        _endIndex: number;
        _textFormat: flash.text.TextFormat;
        beginIndex: number;
        endIndex: number;
        textFormat: TextFormat;
        clone(): TextRun;
        containsIndex(index: number): boolean;
        intersects(beginIndex: number, endIndex: number): boolean;
    }
}
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
declare module Shumway.flash.text {
    class TextSnapshot extends LegacyEntity {
        constructor();
        readonly charCount: number;
        findText(beginIndex: number, textToFind: string, caseSensitive: boolean): number;
        getSelected(beginIndex: number, endIndex: number): boolean;
        getSelectedText(includeLineEndings?: boolean): string;
        getText(beginIndex: number, endIndex: number, includeLineEndings?: boolean): string;
        getTextRunInfo(beginIndex: number, endIndex: number): ArrayLike<number>;
        hitTestTextNearPos(x: number, y: number, maxDistance?: number): number;
        setSelectColor(hexColor?: number): void;
        setSelected(beginIndex: number, endIndex: number, select: boolean): void;
    }
}
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
declare module Shumway.flash.trace {
    class Trace extends LegacyEntity {
        constructor();
        static OFF: number;
        static METHODS: number;
        static METHODS_WITH_ARGS: number;
        static METHODS_AND_LINES: number;
        static METHODS_AND_LINES_WITH_ARGS: number;
        static FILE: any;
        static LISTENER: any;
        static setLevel(l: number, target?: number): any;
        static getLevel(target?: number): number;
        static setListener(f: any): any;
        static getListener(): any;
    }
}
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
declare module Shumway.flash.ui {
    class ContextMenu extends flash.display.NativeMenu {
        constructor();
        static readonly isSupported: boolean;
        _builtInItems: flash.ui.ContextMenuBuiltInItems;
        _customItems: any[];
        _link: flash.net.URLRequest;
        _clipboardMenu: boolean;
        _clipboardItems: flash.ui.ContextMenuClipboardItems;
        builtInItems: flash.ui.ContextMenuBuiltInItems;
        customItems: Array<any>;
        link: flash.net.URLRequest;
        clipboardMenu: boolean;
        clipboardItems: flash.ui.ContextMenuClipboardItems;
        hideBuiltInItems(): void;
        clone(): ContextMenu;
        cloneLinkAndClipboardProperties(c: flash.ui.ContextMenu): void;
    }
}
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
declare module Shumway.flash.ui {
    class ContextMenuBuiltInItems extends LegacyEntity {
        constructor();
        private _save;
        private _zoom;
        private _quality;
        private _play;
        private _loop;
        private _rewind;
        private _forwardAndBack;
        private _print;
        save: boolean;
        zoom: boolean;
        quality: boolean;
        play: boolean;
        loop: boolean;
        rewind: boolean;
        forwardAndBack: boolean;
        print: boolean;
        clone(): ContextMenuBuiltInItems;
    }
}
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
declare module Shumway.flash.ui {
    class ContextMenuClipboardItems extends LegacyEntity {
        constructor();
        _cut: boolean;
        _copy: boolean;
        _paste: boolean;
        _clear: boolean;
        _selectAll: boolean;
        cut: boolean;
        copy: boolean;
        paste: boolean;
        clear: boolean;
        selectAll: boolean;
        clone(): ContextMenuClipboardItems;
    }
}
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
declare module Shumway.flash.ui {
    class ContextMenuItem extends flash.display.NativeMenuItem {
        constructor(caption: string, separatorBefore?: boolean, enabled?: boolean, visible?: boolean);
        clone: () => flash.ui.ContextMenuItem;
        _caption: string;
        _separatorBefore: boolean;
        _visible: boolean;
        _enabled: boolean;
        caption: string;
        separatorBefore: boolean;
        visible: boolean;
    }
}
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
declare module Shumway.flash.ui {
    class GameInput extends flash.events.EventDispatcher {
        constructor();
        readonly numDevices: number;
        readonly isSupported: boolean;
        static getDeviceAt(index: number): flash.ui.GameInputDevice;
    }
}
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
declare module Shumway.flash.ui {
    class GameInputControl extends flash.events.EventDispatcher {
        constructor();
        readonly numValues: number;
        readonly index: number;
        readonly relative: boolean;
        readonly type: string;
        readonly hand: string;
        readonly finger: string;
        readonly device: flash.ui.GameInputDevice;
        getValueAt(index?: number): number;
    }
}
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
declare module Shumway.flash.ui {
    enum GameInputControlType {
        MOVEMENT = "movement",
        ROTATION = "rotation",
        DIRECTION = "direction",
        ACCELERATION = "acceleration",
        BUTTON = "button",
        TRIGGER = "trigger",
    }
}
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
declare module Shumway.flash.ui {
    class GameInputDevice extends flash.events.EventDispatcher {
        constructor();
        static MAX_BUFFER_SIZE: number;
        readonly numControls: number;
        sampleInterval: number;
        enabled: boolean;
        readonly id: string;
        readonly name: string;
        getControlAt(i: number): flash.ui.GameInputControl;
        startCachingSamples(numSamples: number, controls: Array<any>): void;
        stopCachingSamples(): void;
        getCachedSamples(data: flash.utils.ByteArray, append?: boolean): number;
    }
}
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
declare module Shumway.flash.ui {
    enum GameInputFinger {
        THUMB = "thumb",
        INDEX = "index",
        MIDDLE = "middle",
        UNKNOWN = "unknown",
    }
}
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
declare module Shumway.flash.ui {
    enum GameInputHand {
        RIGHT = "right",
        LEFT = "left",
        UNKNOWN = "unknown",
    }
}
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
declare module Shumway.flash.ui {
    /**
     * Dispatches AS3 keyboard events to the focus event dispatcher.
     */
    class KeyboardEventDispatcher {
        private _lastKeyCode;
        private _captureKeyPress;
        private _charCodeMap;
        target: flash.events.EventDispatcher;
        /**
         * Converts DOM keyboard event data into AS3 keyboard events.
         */
        dispatchKeyboardEvent(event: KeyboardEventData): void;
    }
    interface KeyboardEventData {
        type: string;
        keyCode: number;
        charCode: number;
        location: number;
        ctrlKey: boolean;
        altKey: boolean;
        shiftKey: boolean;
    }
    class Keyboard extends LegacyEntity {
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static readonly capsLock: boolean;
        static readonly numLock: boolean;
        static readonly hasVirtualKeyboard: boolean;
        static readonly physicalKeyboardType: string;
        static isAccessible(): boolean;
    }
}
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
declare module Shumway.flash.ui {
    import InteractiveObject = flash.display.InteractiveObject;
    /**
     * Dispatches AS3 mouse events.
     */
    class MouseEventDispatcher {
        stage: flash.display.Stage;
        currentTarget: flash.display.InteractiveObject;
        /**
         * Finds the interactive object on which the event is dispatched.
         */
        private _findTarget(point, testingType);
        /**
         * Converts DOM mouse event data into AS3 mouse events.
         */
        private _dispatchMouseEvent(target, type, data, relatedObject?);
        /**
         * Handles the mouse event and returns the target on which the event was dispatched.
         */
        handleMouseEvent(data: MouseEventAndPointData): InteractiveObject;
    }
    const enum MouseButtonFlags {
        Left = 1,
        Middle = 2,
        Right = 4,
    }
    interface MouseEventAndPointData {
        type: string;
        point: flash.geom.Point;
        ctrlKey: boolean;
        altKey: boolean;
        shiftKey: boolean;
        buttons: MouseButtonFlags;
    }
    class Mouse extends LegacyEntity {
        constructor();
        static readonly supportsCursor: boolean;
        static cursor: string;
        static readonly supportsNativeCursor: boolean;
        static hide(): void;
        static show(): void;
        static registerCursor(name: string, cursor: flash.ui.MouseCursorData): void;
        static unregisterCursor(name: string): void;
    }
}
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
declare module Shumway.flash.ui {
    enum MouseCursor {
        AUTO = "auto",
        ARROW = "arrow",
        BUTTON = "button",
        HAND = "hand",
        IBEAM = "ibeam",
    }
    namespace MouseCursor {
        function fromNumber(n: number): string;
        function toNumber(value: string): number;
    }
}
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
declare module Shumway.flash.ui {
    class MouseCursorData extends LegacyEntity {
        constructor();
        data: Array<any>;
        hotSpot: flash.geom.Point;
        frameRate: number;
    }
}
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
declare module Shumway.flash.ui {
    class Multitouch extends LegacyEntity {
        constructor();
        static inputMode: string;
        static readonly supportsTouchEvents: boolean;
        static readonly supportsGestureEvents: boolean;
        static readonly supportedGestures: Array<any>;
        static readonly maxTouchPoints: number;
        static mapTouchToMouse: boolean;
    }
}
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
declare module Shumway.flash.ui {
    enum MultitouchInputMode {
        NONE = "none",
        GESTURE = "gesture",
        TOUCH_POINT = "touchPoint",
    }
}
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
declare module Shumway.flash.utils {
    enum Endian {
        BIG_ENDIAN = "bigEndian",
        LITTLE_ENDIAN = "littleEndian",
    }
}
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
declare module Shumway.flash.utils {
    interface IExternalizable {
        writeExternal: (output: flash.utils.IDataOutput) => void;
        readExternal: (input: flash.utils.IDataInput) => void;
    }
}
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
declare module Shumway.flash.utils {
    class Timer extends flash.events.EventDispatcher {
        /**
         * This lets you toggle timer event dispatching which is useful when trying to profile other
         * parts of the system.
         */
        static dispatchingEnabled: boolean;
        constructor(delay: number, repeatCount: number);
        _delay: number;
        _repeatCount: number;
        _iteration: number;
        _running: boolean;
        _interval: number;
        readonly running: boolean;
        delay: number;
        repeatCount: number;
        readonly currentCount: number;
        reset(): void;
        stop(): void;
        start(): void;
        private _tick();
    }
}
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
declare module Shumway.flash.utils {
    class SetIntervalTimer extends flash.utils.Timer {
        constructor(closure: Function, delay: number, repeats: boolean, rest: Array<any>);
        static intervalArray: Array<any>;
        static _clearInterval: (id: number) => void;
        reference: number;
        closure: Function;
        rest: Array<any>;
        onTimer: (event: flash.events.Event) => void;
    }
}
declare module Shumway.flash.system {
    import Event = events.Event;
    class EventsNamespace extends LegacyNamespace {
        constructor();
        EventDispatcher: LegacyClass<events.EventDispatcher>;
        Event: LegacyClass<Event>;
        ErrorEvent: LegacyClass<events.ErrorEvent>;
        AsyncErrorEvent: LegacyClass<events.AsyncErrorEvent>;
        ProgressEvent: LegacyClass<events.ProgressEvent>;
        StatusEvent: LegacyClass<events.StatusEvent>;
        GestureEvent: LegacyClass<events.GestureEvent>;
        KeyboardEvent: LegacyClass<events.KeyboardEvent>;
        MouseEvent: LegacyClass<events.MouseEvent>;
        TextEvent: LegacyClass<events.TextEvent>;
        TimerEvent: LegacyClass<events.TimerEvent>;
        TouchEvent: LegacyClass<events.TouchEvent>;
        UncaughtErrorEvents: LegacyClass<events.UncaughtErrorEvents>;
        NetStatusEvent: LegacyClass<events.NetStatusEvent>;
        HTTPStatusEvent: LegacyClass<events.HTTPStatusEvent>;
        IOErrorEvent: LegacyClass<events.IOErrorEvent>;
        _instances: MapObject<Event>;
        getInstance(type: string, bubbles?: boolean, cancelable?: boolean): Event;
        getBroadcastInstance(type: string, bubbles?: boolean, cancelable?: boolean): Event;
        broadcastEventDispatchQueue: events.BroadcastEventDispatchQueue;
    }
}
declare module Shumway.flash.system {
    class UtilsNamespace extends LegacyNamespace implements UtilsNamespace {
        constructor();
        ByteArray: ByteArrayClass;
    }
}
declare module Shumway.flash.system {
    class PerspectiveProjectionClass extends LegacyClass<geom.PerspectiveProjection> {
        FromDisplayObject(displayObject: display.DisplayObject): geom.PerspectiveProjection;
        clone(this_: geom.PerspectiveProjection): geom.PerspectiveProjection;
    }
    class Matrix3DClass extends LegacyClass<geom.Matrix3D> {
        FromArray(matrix: any): any;
    }
    class MatrixClass extends LegacyClass<geom.Matrix> {
        clone(this_: geom.Matrix): geom.Matrix;
        FromUntyped(object: any): geom.Matrix;
        FromDataBuffer(input: ArrayUtilities.DataBuffer): geom.Matrix;
    }
    class PointClass extends LegacyClass<geom.Point> {
        clone(this_: geom.Point): geom.Point;
        interpolate(p1: geom.Point, p2: geom.Point, f: number): geom.Point;
        distance(p1: geom.Point, p2: geom.Point): number;
        polar(length: number, angle: number): geom.Point;
    }
    class RectangleClass extends LegacyClass<geom.Rectangle> {
        FromBounds(bounds: Bounds): geom.Rectangle;
        clone(this_: geom.Rectangle): geom.Rectangle;
    }
    class ColorTransformClass extends LegacyClass<geom.ColorTransform> {
        clone(this_: geom.ColorTransform): geom.ColorTransform;
    }
    class GeomNamespace {
        constructor();
        Point: PointClass;
        Matrix: MatrixClass;
        Matrix3D: Matrix3DClass;
        PerspectiveProjection: PerspectiveProjectionClass;
        Rectangle: RectangleClass;
        ColorTransform: ColorTransformClass;
        Transform: LegacyClass<geom.Transform>;
        Vector3D: LegacyClass<geom.Vector3D>;
        /**
         * Temporary rectangle that is used to prevent allocation.
         */
        _temporaryRectangle: geom.Rectangle;
        FROZEN_IDENTITY_MATRIX: geom.Matrix;
        TEMP_MATRIX: geom.Matrix;
        FROZEN_IDENTITY_COLOR_TRANSFORM: geom.ColorTransform;
        TEMP_COLOR_TRANSFORM: geom.ColorTransform;
    }
}
declare module Shumway.flash.system {
    import Stage = display.Stage;
    import MovieClip = display.MovieClip;
    import IAdvancable = display.IAdvancable;
    import FrameNavigationModel = display.FrameNavigationModel;
    class DisplayNamespace extends LegacyNamespace {
        constructor();
        DisplayObject: LegacyClass<display.DisplayObject>;
        DisplayObjectContainer: LegacyClass<display.DisplayObjectContainer>;
        InteractiveObject: LegacyClass<display.InteractiveObject>;
        MovieClip: LegacyClass<display.MovieClip>;
        AVM1Movie: LegacyClass<display.AVM1Movie>;
        Stage: LegacyClass<display.Stage>;
        BitmapData: LegacyClass<display.BitmapData>;
        Graphics: LegacyClass<display.Graphics>;
        Bitmap: LegacyClass<display.Bitmap>;
        Sprite: LegacyClass<display.Sprite>;
        SimpleButton: LegacyClass<display.SimpleButton>;
        Loader: LoaderClass;
        FrameLabel: LegacyClass<display.FrameLabel>;
        LoaderInfo: LegacyClass<display.LoaderInfo>;
        Scene: LegacyClass<display.Scene>;
        MorphShape: LegacyClass<display.MorphShape>;
        Shape: LegacyClass<display.Shape>;
        _broadcastFrameEvent(type: string): void;
        _advancableInstances: WeakList<IAdvancable>;
        _runScripts: boolean;
        _stage: Stage;
        _instanceID: number;
        /**
         * DisplayObject#name is set to an initial value of 'instanceN', where N is auto-incremented.
         * This is true for all DisplayObjects except for Stage, so it happens in an overrideable
         * method.
         */
        displayObjectReset(): void;
        /**
         * Runs one full turn of the frame events cycle.
         *
         * Frame navigation methods on MovieClip can trigger nested frame events cycles. These nested
         * cycles do everything the outermost cycle does, except for broadcasting the ENTER_FRAME
         * event.
         *
         * If runScripts is true, no events are dispatched and Movieclip frame scripts are run. This
         * is true for nested cycles, too. (We keep static state for that.)
         */
        performFrameNavigation(mainLoop: boolean, runScripts: boolean): void;
        _callQueue: MovieClip[];
        frameNavigationModel: FrameNavigationModel;
        movieClipReset(): void;
        runFrameScripts(): void;
        runAvm1FrameScripts(): void;
    }
}
declare module Shumway.flash.system {
    import ApplicationDomain = system.ApplicationDomain;
    class SystemNamespace extends LegacyNamespace {
        constructor();
        _systemDomain: ApplicationDomain;
        _applicationDomain: ApplicationDomain;
        _currentDomain: ApplicationDomain;
        JPEGLoaderContext: LegacyClass<system.JPEGLoaderContext>;
        ApplicationDomain: LegacyClass<system.ApplicationDomain>;
        LoaderContext: LegacyClass<system.LoaderContext>;
    }
}
declare module Shumway.flash.system {
    import Font = text.Font;
    class TextNamespace extends LegacyNamespace {
        constructor();
        Font: LegacyClass<text.Font>;
        StaticText: LegacyClass<text.StaticText>;
        TextRun: LegacyClass<text.TextRun>;
        TextFormat: LegacyClass<text.TextFormat>;
        TextLineMetrics: LegacyClass<text.TextLineMetrics>;
        TextField: LegacyClass<text.TextField>;
        _fonts: Font[];
        _fontsBySymbolId: Shumway.MapObject<Font>;
        _fontsByName: Shumway.MapObject<Font>;
        private _deviceFontMetrics;
        private _getFontMetrics(name, style);
        resolveFontName(name: string): string;
        getBySymbolId(id: number): Font;
        getByNameAndStyle(name: string, style: string): Font;
        getDefaultFont(): Font;
        /**
         * Registers a font symbol as available in the system.
         *
         * Firefox decodes fonts synchronously, allowing us to do the decoding upon first actual use.
         * All we need to do here is let the system know about the family name and ID, so that both
         * TextFields/Labels referring to the font's symbol ID as well as HTML text specifying a font
         * face can resolve the font.
         *
         * For all other browsers, the decoding has been triggered by the Loader at this point.
         */
        registerFontSymbol(fontMapping: {
            name: string;
            style: string;
            id: number;
        }, loaderInfo: flash.display.LoaderInfo): void;
        resolveFontSymbol(loaderInfo: flash.display.LoaderInfo, id: number, syncId: number, key: string): Font;
        DEFAULT_FONT_SANS: string;
        DEFAULT_FONT_SERIF: string;
        DEFAULT_FONT_TYPEWRITER: string;
        DEVICE_FONT_METRICS_BUILTIN: {
            "_sans": number[];
            "_serif": number[];
            "_typewriter": number[];
        };
        DEVICE_FONT_METRICS_WIN: {
            __proto__: {
                "_sans": number[];
                "_serif": number[];
                "_typewriter": number[];
            };
            "Arial": number[];
            "Arial Baltic": number[];
            "Arial Black": number[];
            "Arial CE": number[];
            "Arial CYR": number[];
            "Arial Greek": number[];
            "Arial TUR": number[];
            "Comic Sans MS": number[];
            "Courier New": number[];
            "Courier New Baltic": number[];
            "Courier New CE": number[];
            "Courier New CYR": number[];
            "Courier New Greek": number[];
            "Courier New TUR": number[];
            "Estrangelo Edessa": number[];
            "Franklin Gothic Medium": number[];
            "Gautami": number[];
            "Georgia": number[];
            "Impact": number[];
            "Latha": number[];
            "Lucida Console": number[];
            "Lucida Sans Unicode": number[];
            "Mangal": number[];
            "Marlett": number[];
            "Microsoft Sans Serif": number[];
            "MV Boli": number[];
            "Palatino Linotype": number[];
            "Raavi": number[];
            "Shruti": number[];
            "Sylfaen": number[];
            "Symbol": number[];
            "Tahoma": number[];
            "Times New Roman": number[];
            "Times New Roman Baltic": number[];
            "Times New Roman CE": number[];
            "Times New Roman CYR": number[];
            "Times New Roman Greek": number[];
            "Times New Roman TUR": number[];
            "Trebuchet MS": number[];
            "Tunga": number[];
            "Verdana": number[];
            "Webdings": number[];
            "Wingdings": number[];
        };
        DEVICE_FONT_METRICS_MAC: {
            __proto__: {
                "_sans": number[];
                "_serif": number[];
                "_typewriter": number[];
            };
            "Al Bayan Bold": number[];
            "Al Bayan Plain": number[];
            "Al Nile": number[];
            "Al Nile Bold": number[];
            "Al Tarikh Regular": number[];
            "American Typewriter": number[];
            "American Typewriter Bold": number[];
            "American Typewriter Condensed": number[];
            "American Typewriter Condensed Bold": number[];
            "American Typewriter Condensed Light": number[];
            "American Typewriter Light": number[];
            "Andale Mono": number[];
            "Apple Braille": number[];
            "Apple Braille Outline 6 Dot": number[];
            "Apple Braille Outline 8 Dot": number[];
            "Apple Braille Pinpoint 6 Dot": number[];
            "Apple Braille Pinpoint 8 Dot": number[];
            "Apple Chancery": number[];
            "Apple Color Emoji": number[];
            "Apple SD Gothic Neo Bold": number[];
            "Apple SD Gothic Neo Heavy": number[];
            "Apple SD Gothic Neo Light": number[];
            "Apple SD Gothic Neo Medium": number[];
            "Apple SD Gothic Neo Regular": number[];
            "Apple SD Gothic Neo SemiBold": number[];
            "Apple SD Gothic Neo Thin": number[];
            "Apple SD Gothic Neo UltraLight": number[];
            "Apple SD GothicNeo ExtraBold": number[];
            "Apple Symbols": number[];
            "AppleGothic Regular": number[];
            "AppleMyungjo Regular": number[];
            "Arial": number[];
            "Arial Black": number[];
            "Arial Bold": number[];
            "Arial Bold Italic": number[];
            "Arial Hebrew": number[];
            "Arial Hebrew Bold": number[];
            "Arial Hebrew Light": number[];
            "Arial Hebrew Scholar": number[];
            "Arial Hebrew Scholar Bold": number[];
            "Arial Hebrew Scholar Light": number[];
            "Arial Italic": number[];
            "Arial Narrow": number[];
            "Arial Narrow Bold": number[];
            "Arial Narrow Bold Italic": number[];
            "Arial Narrow Italic": number[];
            "Arial Rounded MT Bold": number[];
            "Arial Unicode MS": number[];
            "Athelas Bold": number[];
            "Athelas Bold Italic": number[];
            "Athelas Italic": number[];
            "Athelas Regular": number[];
            "Avenir Black": number[];
            "Avenir Black Oblique": number[];
            "Avenir Book": number[];
            "Avenir Book Oblique": number[];
            "Avenir Heavy": number[];
            "Avenir Heavy Oblique": number[];
            "Avenir Light": number[];
            "Avenir Light Oblique": number[];
            "Avenir Medium": number[];
            "Avenir Medium Oblique": number[];
            "Avenir Next Bold": number[];
            "Avenir Next Bold Italic": number[];
            "Avenir Next Condensed Bold": number[];
            "Avenir Next Condensed Bold Italic": number[];
            "Avenir Next Condensed Demi Bold": number[];
            "Avenir Next Condensed Demi Bold Italic": number[];
            "Avenir Next Condensed Heavy": number[];
            "Avenir Next Condensed Heavy Italic": number[];
            "Avenir Next Condensed Italic": number[];
            "Avenir Next Condensed Medium": number[];
            "Avenir Next Condensed Medium Italic": number[];
            "Avenir Next Condensed Regular": number[];
            "Avenir Next Condensed Ultra Light": number[];
            "Avenir Next Condensed Ultra Light Italic": number[];
            "Avenir Next Demi Bold": number[];
            "Avenir Next Demi Bold Italic": number[];
            "Avenir Next Heavy": number[];
            "Avenir Next Heavy Italic": number[];
            "Avenir Next Italic": number[];
            "Avenir Next Medium": number[];
            "Avenir Next Medium Italic": number[];
            "Avenir Next Regular": number[];
            "Avenir Next Ultra Light": number[];
            "Avenir Next Ultra Light Italic": number[];
            "Avenir Oblique": number[];
            "Avenir Roman": number[];
            "Ayuthaya": number[];
            "Baghdad Regular": number[];
            "Bangla MN": number[];
            "Bangla MN Bold": number[];
            "Bangla Sangam MN": number[];
            "Bangla Sangam MN Bold": number[];
            "Baoli SC Regular": number[];
            "Baskerville": number[];
            "Baskerville Bold": number[];
            "Baskerville Bold Italic": number[];
            "Baskerville Italic": number[];
            "Baskerville SemiBold": number[];
            "Baskerville SemiBold Italic": number[];
            "Beirut Regular": number[];
            "Big Caslon Medium": number[];
            "Bodoni 72 Bold": number[];
            "Bodoni 72 Book": number[];
            "Bodoni 72 Book Italic": number[];
            "Bodoni 72 Oldstyle Bold": number[];
            "Bodoni 72 Oldstyle Book": number[];
            "Bodoni 72 Oldstyle Book Italic": number[];
            "Bodoni 72 Smallcaps Book": number[];
            "Bodoni Ornaments": number[];
            "Bradley Hand Bold": number[];
            "Brush Script MT Italic": number[];
            "Chalkboard": number[];
            "Chalkboard Bold": number[];
            "Chalkboard SE Bold": number[];
            "Chalkboard SE Light": number[];
            "Chalkboard SE Regular": number[];
            "Chalkduster": number[];
            "Charter Black": number[];
            "Charter Black Italic": number[];
            "Charter Bold": number[];
            "Charter Bold Italic": number[];
            "Charter Italic": number[];
            "Charter Roman": number[];
            "Cochin": number[];
            "Cochin Bold": number[];
            "Cochin Bold Italic": number[];
            "Cochin Italic": number[];
            "Comic Sans MS": number[];
            "Comic Sans MS Bold": number[];
            "Copperplate": number[];
            "Copperplate Bold": number[];
            "Copperplate Light": number[];
            "Corsiva Hebrew": number[];
            "Corsiva Hebrew Bold": number[];
            "Courier": number[];
            "Courier Bold": number[];
            "Courier Bold Oblique": number[];
            "Courier New": number[];
            "Courier New Bold": number[];
            "Courier New Bold Italic": number[];
            "Courier New Italic": number[];
            "Courier Oblique": number[];
            "Damascus Bold": number[];
            "Damascus Light": number[];
            "Damascus Medium": number[];
            "Damascus Regular": number[];
            "Damascus Semi Bold": number[];
            "DecoType Naskh Regular": number[];
            "Devanagari MT": number[];
            "Devanagari MT Bold": number[];
            "Devanagari Sangam MN": number[];
            "Devanagari Sangam MN Bold": number[];
            "Didot": number[];
            "Didot Bold": number[];
            "Didot Italic": number[];
            "DIN Alternate Bold": number[];
            "DIN Condensed Bold": number[];
            "Diwan Kufi Regular": number[];
            "Diwan Thuluth Regular": number[];
            "Euphemia UCAS": number[];
            "Euphemia UCAS Bold": number[];
            "Euphemia UCAS Italic": number[];
            "Farah Regular": number[];
            "Farisi Regular": number[];
            "Futura Condensed ExtraBold": number[];
            "Futura Condensed Medium": number[];
            "Futura Medium": number[];
            "Futura Medium Italic": number[];
            "GB18030 Bitmap": number[];
            "Geeza Pro Bold": number[];
            "Geeza Pro Regular": number[];
            "Geneva": number[];
            "Georgia": number[];
            "Georgia Bold": number[];
            "Georgia Bold Italic": number[];
            "Georgia Italic": number[];
            "Gill Sans": number[];
            "Gill Sans Bold": number[];
            "Gill Sans Bold Italic": number[];
            "Gill Sans Italic": number[];
            "Gill Sans Light": number[];
            "Gill Sans Light Italic": number[];
            "Gill Sans SemiBold": number[];
            "Gill Sans SemiBold Italic": number[];
            "Gill Sans UltraBold": number[];
            "Gujarati MT": number[];
            "Gujarati MT Bold": number[];
            "Gujarati Sangam MN": number[];
            "Gujarati Sangam MN Bold": number[];
            "GungSeo Regular": number[];
            "Gurmukhi MN": number[];
            "Gurmukhi MN Bold": number[];
            "Gurmukhi MT": number[];
            "Gurmukhi Sangam MN": number[];
            "Gurmukhi Sangam MN Bold": number[];
            "Hannotate SC Bold": number[];
            "Hannotate SC Regular": number[];
            "Hannotate TC Bold": number[];
            "Hannotate TC Regular": number[];
            "HanziPen SC Bold": number[];
            "HanziPen SC Regular": number[];
            "HanziPen TC Bold": number[];
            "HanziPen TC Regular": number[];
            "HeadLineA Regular": number[];
            "Heiti SC Light": number[];
            "Heiti SC Medium": number[];
            "Heiti TC Light": number[];
            "Heiti TC Medium": number[];
            "Helvetica": number[];
            "Helvetica Bold": number[];
            "Helvetica Bold Oblique": number[];
            "Helvetica Light": number[];
            "Helvetica Light Oblique": number[];
            "Helvetica Neue": number[];
            "Helvetica Neue Bold": number[];
            "Helvetica Neue Bold Italic": number[];
            "Helvetica Neue Condensed Black": number[];
            "Helvetica Neue Condensed Bold": number[];
            "Helvetica Neue Italic": number[];
            "Helvetica Neue Light": number[];
            "Helvetica Neue Light Italic": number[];
            "Helvetica Neue Medium": number[];
            "Helvetica Neue Medium Italic": number[];
            "Helvetica Neue Thin": number[];
            "Helvetica Neue Thin Italic": number[];
            "Helvetica Neue UltraLight": number[];
            "Helvetica Neue UltraLight Italic": number[];
            "Helvetica Oblique": number[];
            "Herculanum": number[];
            "Hiragino Kaku Gothic Pro W3": number[];
            "Hiragino Kaku Gothic Pro W6": number[];
            "Hiragino Kaku Gothic ProN W3": number[];
            "Hiragino Kaku Gothic ProN W6": number[];
            "Hiragino Kaku Gothic Std W8": number[];
            "Hiragino Kaku Gothic StdN W8": number[];
            "Hiragino Maru Gothic Pro W4": number[];
            "Hiragino Maru Gothic ProN W4": number[];
            "Hiragino Mincho Pro W3": number[];
            "Hiragino Mincho Pro W6": number[];
            "Hiragino Mincho ProN W3": number[];
            "Hiragino Mincho ProN W6": number[];
            "Hiragino Sans GB W3": number[];
            "Hiragino Sans GB W6": number[];
            "Hoefler Text": number[];
            "Hoefler Text Black": number[];
            "Hoefler Text Black Italic": number[];
            "Hoefler Text Italic": number[];
            "Hoefler Text Ornaments": number[];
            "Impact": number[];
            "InaiMathi": number[];
            "Iowan Old Style Black": number[];
            "Iowan Old Style Black Italic": number[];
            "Iowan Old Style Bold": number[];
            "Iowan Old Style Bold Italic": number[];
            "Iowan Old Style Italic": number[];
            "Iowan Old Style Roman": number[];
            "Iowan Old Style Titling": number[];
            "ITF Devanagari Bold": number[];
            "ITF Devanagari Book": number[];
            "ITF Devanagari Demi": number[];
            "ITF Devanagari Light": number[];
            "ITF Devanagari Medium": number[];
            "Kailasa Regular": number[];
            "Kaiti SC Black": number[];
            "Kaiti SC Bold": number[];
            "Kaiti SC Regular": number[];
            "Kaiti TC Bold": number[];
            "Kaiti TC Regular": number[];
            "Kannada MN": number[];
            "Kannada MN Bold": number[];
            "Kannada Sangam MN": number[];
            "Kannada Sangam MN Bold": number[];
            "Kefa Bold": number[];
            "Kefa Regular": number[];
            "Khmer MN": number[];
            "Khmer MN Bold": number[];
            "Khmer Sangam MN": number[];
            "Kohinoor Devanagari Bold": number[];
            "Kohinoor Devanagari Book": number[];
            "Kohinoor Devanagari Demi": number[];
            "Kohinoor Devanagari Light": number[];
            "Kohinoor Devanagari Medium": number[];
            "Kokonor Regular": number[];
            "Krungthep": number[];
            "KufiStandardGK Regular": number[];
            "Lantinghei SC Demibold": number[];
            "Lantinghei SC Extralight": number[];
            "Lantinghei SC Heavy": number[];
            "Lantinghei TC Demibold": number[];
            "Lantinghei TC Extralight": number[];
            "Lantinghei TC Heavy": number[];
            "Lao MN": number[];
            "Lao MN Bold": number[];
            "Lao Sangam MN": number[];
            "Libian SC Regular": number[];
            "LiHei Pro": number[];
            "LiSong Pro": number[];
            "Lucida Grande": number[];
            "Lucida Grande Bold": number[];
            "Luminari": number[];
            "Malayalam MN": number[];
            "Malayalam MN Bold": number[];
            "Malayalam Sangam MN": number[];
            "Malayalam Sangam MN Bold": number[];
            "Marion Bold": number[];
            "Marion Italic": number[];
            "Marion Regular": number[];
            "Marker Felt Thin": number[];
            "Marker Felt Wide": number[];
            "Menlo Bold": number[];
            "Menlo Bold Italic": number[];
            "Menlo Italic": number[];
            "Menlo Regular": number[];
            "Microsoft Sans Serif": number[];
            "Mishafi Gold Regular": number[];
            "Mishafi Regular": number[];
            "Monaco": number[];
            "Mshtakan": number[];
            "Mshtakan Bold": number[];
            "Mshtakan BoldOblique": number[];
            "Mshtakan Oblique": number[];
            "Muna Black": number[];
            "Muna Bold": number[];
            "Muna Regular": number[];
            "Myanmar MN": number[];
            "Myanmar MN Bold": number[];
            "Myanmar Sangam MN": number[];
            "Nadeem Regular": number[];
            "Nanum Brush Script": number[];
            "Nanum Pen Script": number[];
            "NanumGothic": number[];
            "NanumGothic Bold": number[];
            "NanumGothic ExtraBold": number[];
            "NanumMyeongjo": number[];
            "NanumMyeongjo Bold": number[];
            "NanumMyeongjo ExtraBold": number[];
            "New Peninim MT": number[];
            "New Peninim MT Bold": number[];
            "New Peninim MT Bold Inclined": number[];
            "New Peninim MT Inclined": number[];
            "Noteworthy Bold": number[];
            "Noteworthy Light": number[];
            "Optima Bold": number[];
            "Optima Bold Italic": number[];
            "Optima ExtraBlack": number[];
            "Optima Italic": number[];
            "Optima Regular": number[];
            "Oriya MN": number[];
            "Oriya MN Bold": number[];
            "Oriya Sangam MN": number[];
            "Oriya Sangam MN Bold": number[];
            "Osaka": number[];
            "Osaka-Mono": number[];
            "Palatino": number[];
            "Palatino Bold": number[];
            "Palatino Bold Italic": number[];
            "Palatino Italic": number[];
            "Papyrus": number[];
            "Papyrus Condensed": number[];
            "PCMyungjo Regular": number[];
            "Phosphate Inline": number[];
            "Phosphate Solid": number[];
            "PilGi Regular": number[];
            "Plantagenet Cherokee": number[];
            "PT Mono": number[];
            "PT Mono Bold": number[];
            "PT Sans": number[];
            "PT Sans Bold": number[];
            "PT Sans Bold Italic": number[];
            "PT Sans Caption": number[];
            "PT Sans Caption Bold": number[];
            "PT Sans Italic": number[];
            "PT Sans Narrow": number[];
            "PT Sans Narrow Bold": number[];
            "PT Serif": number[];
            "PT Serif Bold": number[];
            "PT Serif Bold Italic": number[];
            "PT Serif Caption": number[];
            "PT Serif Caption Italic": number[];
            "PT Serif Italic": number[];
            "Raanana": number[];
            "Raanana Bold": number[];
            "Sana Regular": number[];
            "Sathu": number[];
            "Savoye LET Plain CC.:1.0": number[];
            "Savoye LET Plain:1.0": number[];
            "Seravek": number[];
            "Seravek Bold": number[];
            "Seravek Bold Italic": number[];
            "Seravek ExtraLight": number[];
            "Seravek ExtraLight Italic": number[];
            "Seravek Italic": number[];
            "Seravek Light": number[];
            "Seravek Light Italic": number[];
            "Seravek Medium": number[];
            "Seravek Medium Italic": number[];
            "Shree Devanagari 714": number[];
            "Shree Devanagari 714 Bold": number[];
            "Shree Devanagari 714 Bold Italic": number[];
            "Shree Devanagari 714 Italic": number[];
            "SignPainter-HouseScript": number[];
            "Silom": number[];
            "Sinhala MN": number[];
            "Sinhala MN Bold": number[];
            "Sinhala Sangam MN": number[];
            "Sinhala Sangam MN Bold": number[];
            "Skia Black": number[];
            "Skia Black Condensed": number[];
            "Skia Black Extended": number[];
            "Skia Bold": number[];
            "Skia Condensed": number[];
            "Skia Extended": number[];
            "Skia Light": number[];
            "Skia Light Condensed": number[];
            "Skia Light Extended": number[];
            "Skia Regular": number[];
            "Snell Roundhand": number[];
            "Snell Roundhand Black": number[];
            "Snell Roundhand Bold": number[];
            "Songti SC Black": number[];
            "Songti SC Bold": number[];
            "Songti SC Light": number[];
            "Songti SC Regular": number[];
            "Songti TC Bold": number[];
            "Songti TC Light": number[];
            "Songti TC Regular": number[];
            "STFangsong": number[];
            "STHeiti": number[];
            "STIXGeneral-Bold": number[];
            "STIXGeneral-BoldItalic": number[];
            "STIXGeneral-Italic": number[];
            "STIXGeneral-Regular": number[];
            "STIXIntegralsD-Bold": number[];
            "STIXIntegralsD-Regular": number[];
            "STIXIntegralsSm-Bold": number[];
            "STIXIntegralsSm-Regular": number[];
            "STIXIntegralsUp-Bold": number[];
            "STIXIntegralsUp-Regular": number[];
            "STIXIntegralsUpD-Bold": number[];
            "STIXIntegralsUpD-Regular": number[];
            "STIXIntegralsUpSm-Bold": number[];
            "STIXIntegralsUpSm-Regular": number[];
            "STIXNonUnicode-Bold": number[];
            "STIXNonUnicode-BoldItalic": number[];
            "STIXNonUnicode-Italic": number[];
            "STIXNonUnicode-Regular": number[];
            "STIXSizeFiveSym-Regular": number[];
            "STIXSizeFourSym-Bold": number[];
            "STIXSizeFourSym-Regular": number[];
            "STIXSizeOneSym-Bold": number[];
            "STIXSizeOneSym-Regular": number[];
            "STIXSizeThreeSym-Bold": number[];
            "STIXSizeThreeSym-Regular": number[];
            "STIXSizeTwoSym-Bold": number[];
            "STIXSizeTwoSym-Regular": number[];
            "STIXVariants-Bold": number[];
            "STIXVariants-Regular": number[];
            "STKaiti": number[];
            "STSong": number[];
            "STXihei": number[];
            "Sukhumvit Set Bold": number[];
            "Sukhumvit Set Light": number[];
            "Sukhumvit Set Medium": number[];
            "Sukhumvit Set Semi Bold": number[];
            "Sukhumvit Set Text": number[];
            "Sukhumvit Set Thin": number[];
            "Superclarendon Black": number[];
            "Superclarendon Black Italic": number[];
            "Superclarendon Bold": number[];
            "Superclarendon Bold Italic": number[];
            "Superclarendon Italic": number[];
            "Superclarendon Light": number[];
            "Superclarendon Light Italic": number[];
            "Superclarendon Regular": number[];
            "Symbol": number[];
            "System Font Bold": number[];
            "System Font Bold Italic": number[];
            "System Font Heavy": number[];
            "System Font Italic": number[];
            "System Font Light": number[];
            "System Font Medium Italic P4": number[];
            "System Font Medium P4": number[];
            "System Font Regular": number[];
            "System Font Thin": number[];
            "System Font UltraLight": number[];
            "Tahoma": number[];
            "Tahoma Negreta": number[];
            "Tamil MN": number[];
            "Tamil MN Bold": number[];
            "Tamil Sangam MN": number[];
            "Tamil Sangam MN Bold": number[];
            "Telugu MN": number[];
            "Telugu MN Bold": number[];
            "Telugu Sangam MN": number[];
            "Telugu Sangam MN Bold": number[];
            "Thonburi": number[];
            "Thonburi Bold": number[];
            "Thonburi Light": number[];
            "Times Bold": number[];
            "Times Bold Italic": number[];
            "Times Italic": number[];
            "Times New Roman": number[];
            "Times New Roman Bold": number[];
            "Times New Roman Bold Italic": number[];
            "Times New Roman Italic": number[];
            "Times Roman": number[];
            "Trattatello": number[];
            "Trebuchet MS": number[];
            "Trebuchet MS Bold": number[];
            "Trebuchet MS Bold Italic": number[];
            "Trebuchet MS Italic": number[];
            "Verdana": number[];
            "Verdana Bold": number[];
            "Verdana Bold Italic": number[];
            "Verdana Italic": number[];
            "Waseem Light": number[];
            "Waseem Regular": number[];
            "Wawati SC Regular": number[];
            "Wawati TC Regular": number[];
            "Webdings": number[];
            "Weibei SC Bold": number[];
            "Weibei TC Bold": number[];
            "Wingdings": number[];
            "Wingdings 2": number[];
            "Wingdings 3": number[];
            "Xingkai SC Bold": number[];
            "Xingkai SC Light": number[];
            "Yuanti SC Bold": number[];
            "Yuanti SC Light": number[];
            "Yuanti SC Regular": number[];
            "YuGothic Bold": number[];
            "YuGothic Medium": number[];
            "YuMincho Demibold": number[];
            "YuMincho Medium": number[];
            "Yuppy SC Regular": number[];
            "Yuppy TC Regular": number[];
            "Zapf Dingbats": number[];
            "Zapfino": number[];
        };
        DEVICE_FONT_METRICS_LINUX: {
            __proto__: {
                "_sans": number[];
                "_serif": number[];
                "_typewriter": number[];
            };
            "KacstFarsi": number[];
            "Meera": number[];
            "FreeMono": number[];
            "Loma": number[];
            "Century Schoolbook L": number[];
            "KacstTitleL": number[];
            "Garuda": number[];
            "Rekha": number[];
            "Purisa": number[];
            "DejaVu Sans Mono": number[];
            "Vemana2000": number[];
            "KacstOffice": number[];
            "Umpush": number[];
            "OpenSymbol": number[];
            "Sawasdee": number[];
            "URW Palladio L": number[];
            "FreeSerif": number[];
            "KacstDigital": number[];
            "Ubuntu Condensed": number[];
            "mry_KacstQurn": number[];
            "URW Gothic L": number[];
            "Dingbats": number[];
            "URW Chancery L": number[];
            "Phetsarath OT": number[];
            "Tlwg Typist": number[];
            "KacstLetter": number[];
            "utkal": number[];
            "Norasi": number[];
            "KacstOne": number[];
            "Liberation Sans Narrow": number[];
            "Symbol": number[];
            "NanumMyeongjo": number[];
            "Untitled1": number[];
            "Lohit Gujarati": number[];
            "Liberation Mono": number[];
            "KacstArt": number[];
            "Mallige": number[];
            "Bitstream Charter": number[];
            "NanumGothic": number[];
            "Liberation Serif": number[];
            "Ubuntu": number[];
            "Courier 10 Pitch": number[];
            "Nimbus Sans L": number[];
            "TakaoPGothic": number[];
            "WenQuanYi Micro Hei Mono": number[];
            "DejaVu Sans": number[];
            "Kedage": number[];
            "Kinnari": number[];
            "TlwgMono": number[];
            "Standard Symbols L": number[];
            "Lohit Punjabi": number[];
            "Nimbus Mono L": number[];
            "Rachana": number[];
            "Waree": number[];
            "KacstPoster": number[];
            "Khmer OS": number[];
            "FreeSans": number[];
            "gargi": number[];
            "Nimbus Roman No9 L": number[];
            "DejaVu Serif": number[];
            "WenQuanYi Micro Hei": number[];
            "Ubuntu Light": number[];
            "TlwgTypewriter": number[];
            "KacstPen": number[];
            "Tlwg Typo": number[];
            "Mukti Narrow": number[];
            "Ubuntu Mono": number[];
            "Lohit Bengali": number[];
            "Liberation Sans": number[];
            "KacstDecorative": number[];
            "Khmer OS System": number[];
            "Saab": number[];
            "KacstTitle": number[];
            "Mukti Narrow Bold": number[];
            "Lohit Hindi": number[];
            "KacstQurn": number[];
            "URW Bookman L": number[];
            "KacstNaskh": number[];
            "KacstScreen": number[];
            "Pothana2000": number[];
            "Lohit Tamil": number[];
            "KacstBook": number[];
            "Sans": number[];
            "Times": number[];
            "Monospace": number[];
        };
    }
}
declare module Shumway.flash.system {
    class DropShadowFilterClass extends LegacyClass<filters.DropShadowFilter> {
        FromUntyped(obj: any): filters.DropShadowFilter;
    }
    class BlurFilterClass extends LegacyClass<filters.BlurFilter> {
        FromUntyped(obj: any): filters.BlurFilter;
    }
    class GlowFilterClass extends LegacyClass<filters.GlowFilter> {
        FromUntyped(obj: any): filters.GlowFilter;
    }
    class BevelFilterClass extends LegacyClass<filters.BevelFilter> {
        FromUntyped(obj: any): filters.BevelFilter;
    }
    class GradientGlowFilterClass extends LegacyClass<filters.GradientGlowFilter> {
        FromUntyped(obj: any): filters.GradientGlowFilter;
    }
    class ConvolutionFilterClass extends LegacyClass<filters.ConvolutionFilter> {
        FromUntyped(obj: any): filters.ConvolutionFilter;
    }
    class ColorMatrixFilterClass extends LegacyClass<filters.ColorMatrixFilter> {
        FromUntyped(obj: {
            matrix: number[];
        }): filters.ColorMatrixFilter;
    }
    class GradientBevelFilterClass extends LegacyClass<filters.GradientBevelFilter> {
        FromUntyped(obj: any): filters.GradientBevelFilter;
    }
    class FiltersNamespace extends LegacyNamespace {
        constructor();
        swfFilterTypes: Array<LegacyClass<filters.BitmapFilter>>;
        BitmapFilter: LegacyClass<filters.BitmapFilter>;
        DropShadowFilter: DropShadowFilterClass;
        BlurFilter: BlurFilterClass;
        GlowFilter: GlowFilterClass;
        BevelFilter: BevelFilterClass;
        GradientGlowFilter: GradientGlowFilterClass;
        ConvolutionFilter: ConvolutionFilterClass;
        ColorMatrixFilter: ColorMatrixFilterClass;
        GradientBevelFilter: GradientBevelFilterClass;
        DisplacementMapFilter: LegacyClass<filters.DisplacementMapFilter>;
    }
}
declare module Shumway.flash.system {
    class MediaNamespace {
        constructor();
        ID3Info: LegacyClass<media.ID3Info>;
        Sound: LegacyClass<media.Sound>;
        SoundChannel: LegacyClass<media.SoundChannel>;
        SoundTransform: LegacyClass<media.SoundTransform>;
        Video: LegacyClass<media.Video>;
    }
}
declare module Shumway.flash.system {
    class SharedObjectClass extends LegacyClass<net.SharedObject> {
        constructor();
    }
    class NetNamespace {
        constructor();
        URLRequestHeader: LegacyClass<net.URLRequestHeader>;
        URLVariables: LegacyClass<net.URLVariables>;
        URLStream: LegacyClass<net.URLStream>;
        URLRequest: LegacyClass<net.URLRequest>;
        SharedObject: SharedObjectClass;
        NetStreamInfo: LegacyClass<net.NetStreamInfo>;
    }
}
declare module Shumway.flash.system {
    class UINamespace extends LegacyNamespace {
        constructor();
        Mouse: MouseClass;
        ContextMenu: LegacyClass<ui.ContextMenu>;
        ContextMenuBuiltInItems: LegacyClass<ui.ContextMenuBuiltInItems>;
        ContextMenuClipboardItems: LegacyClass<ui.ContextMenuClipboardItems>;
    }
}
declare module Shumway.flash.system {
    import Loader = display.Loader;
    class LoaderClass extends system.LegacyClass<display.Loader> {
        constructor();
        init(): void;
        runtimeStartTime: number;
        _rootLoader: Loader;
        _loadQueue: Array<Loader>;
        _embeddedContentLoadCount: number;
        /**
         * Creates or returns the root Loader instance. The loader property of that instance's
         * LoaderInfo object is always null. Also, no OPEN event ever gets dispatched.
         */
        getRootLoader(): Loader;
        reset(): void;
        /**
         * In each turn of the event loop, Loader events are processed in two batches:
         * first INIT and COMPLETE events are dispatched for all active Loaders, then
         * OPEN and PROGRESS.
         *
         * A slightly weird result of this is that INIT and COMPLETE are dispatched at
         * least one turn later than the other events: INIT is dispatched after the
         * content has been created. That, in turn, happens under
         * `DisplayObject.performFrameNavigation` in reaction to enough data being
         * marked as available - which happens in the second batch of Loader event
         * processing.
         */
        processEvents(): void;
        processEarlyEvents(): void;
        processLateEvents(): void;
        CtorToken: {};
    }
}
declare module Shumway.flash.system {
    class MouseClass extends LegacyClass<ui.Mouse> {
        constructor();
        init(): void;
        draggableObject: display.Sprite;
        _currentPosition: geom.Point;
        _cursor: string;
        /**
         * Remembers the current mouse position.
         */
        updateCurrentPosition(value: flash.geom.Point): void;
    }
}
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
declare namespace Shumway.flash.system {
    function constructClassFromSymbol(symbol: Timeline.Symbol, axClass: LegacyClass): any;
}
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
interface CanvasRenderingContext2D {
    filter: string;
    globalColorMatrix: Shumway.GFX.ColorMatrix;
    flashStroke(path: Path2D, lineScaleMode: Shumway.LineScaleMode): void;
}
interface CanvasGradient {
    _template: any;
}
declare module Shumway.GFX {
    const enum TraceLevel {
        None = 0,
        Brief = 1,
        Verbose = 2,
    }
    let frameCounter: Metrics.Counter;
    let traceLevel: TraceLevel;
    let writer: IndentingWriter;
    function frameCount(name: any): void;
    let timelineBuffer: Tools.Profiler.TimelineBuffer;
    function enterTimeline(name: string, data?: any): void;
    function leaveTimeline(name?: string, data?: any): void;
    /**
     * Polyfill for missing |Path2D|. An instance of this class keeps a record of all drawing commands
     * ever called on it.
     */
    class Path {
        private _commands;
        private _commandPosition;
        private _data;
        private _dataPosition;
        private static _arrayBufferPool;
        /**
         * Takes a |Path2D| instance and a 2d context to replay the recorded drawing commands.
         */
        static _apply(path: Path, context: CanvasRenderingContext2D): void;
        constructor(arg: any);
        private _ensureCommandCapacity(length);
        private _ensureDataCapacity(length);
        private _writeCommand(command);
        private _writeData(a, b, c?, d?, e?, f?);
        closePath(): void;
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
        bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
        rect(x: number, y: number, width: number, height: number): void;
        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean): void;
        /**
         * Copies and transforms all drawing commands stored in |path|.
         */
        addPath(path: Path, transformation?: SVGMatrix): void;
    }
}
declare module Shumway.GFX {
    interface ISurface {
        w: number;
        h: number;
        allocate(w: number, h: number): ISurfaceRegion;
        free(surfaceRegion: ISurfaceRegion): void;
    }
    interface ISurfaceRegion {
        surface: ISurface;
        region: RegionAllocator.Region;
    }
    class ScreenShot {
        dataURL: string;
        w: number;
        h: number;
        pixelRatio: number;
        constructor(dataURL: string, w: number, h: number, pixelRatio: number);
    }
}
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
declare module Shumway {
    /**
     * Things that can be kept in linked lists.
     */
    interface ILinkedListNode {
        next: ILinkedListNode;
        previous: ILinkedListNode;
    }
    /**
     * Maintains a LRU doubly-linked list.
     */
    class LRUList<T extends ILinkedListNode> {
        private _head;
        private _tail;
        private _count;
        readonly count: number;
        /**
         * Gets the node at the front of the list. Returns |null| if the list is empty.
         */
        readonly head: T;
        constructor();
        private _unshift(node);
        private _remove(node);
        /**
         * Adds or moves a node to the front of the list.
         */
        use(node: T): void;
        /**
         * Removes a node from the front of the list.
         */
        pop(): T;
        /**
         * Visits each node in the list in the forward or reverse direction as long as
         * the callback returns |true|;
         */
        visit(callback: (x: T) => boolean, forward?: boolean): void;
    }
    function registerFallbackFont(): void;
}
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
declare module Shumway.GFX {
    let imageUpdateOption: any;
    let imageConvertOption: any;
    let stageOptions: any;
    let forcePaint: any;
    let ignoreViewport: any;
    let viewportLoupeDiameter: any;
    let disableClipping: any;
    let debugClipping: any;
    let hud: any;
    let clipDirtyRegions: any;
    let clipCanvas: any;
    let cull: any;
    let snapToDevicePixels: any;
    let imageSmoothing: any;
    let masking: any;
    let blending: any;
    let debugLayers: any;
    let filters: any;
    let cacheShapes: any;
    let cacheShapesMaxSize: any;
    let cacheShapesThreshold: any;
}
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
declare module Shumway.GFX.Geometry {
    function radianToDegrees(r: number): number;
    function degreesToRadian(d: number): number;
    class Point {
        x: number;
        y: number;
        constructor(x: number, y: number);
        setElements(x: number, y: number): Point;
        set(other: Point): Point;
        dot(other: Point): number;
        squaredLength(): number;
        distanceTo(other: Point): number;
        sub(other: Point): Point;
        mul(value: number): Point;
        clone(): Point;
        toString(digits?: number): string;
        inTriangle(a: Point, b: Point, c: Point): boolean;
        static createEmpty(): Point;
        static createEmptyPoints(count: number): Point[];
    }
    class Rectangle {
        static allocationCount: number;
        x: number;
        y: number;
        w: number;
        h: number;
        private static _temporary;
        private static _dirtyStack;
        constructor(x: number, y: number, w: number, h: number);
        setElements(x: number, y: number, w: number, h: number): void;
        set(other: Rectangle): void;
        contains(other: Rectangle): boolean;
        containsPoint(point: Point): boolean;
        isContained(others: Rectangle[]): boolean;
        isSmallerThan(other: Rectangle): boolean;
        isLargerThan(other: Rectangle): boolean;
        union(other: Rectangle): void;
        isEmpty(): boolean;
        setEmpty(): void;
        intersect(other: Rectangle): void;
        intersects(other: Rectangle): boolean;
        /**
         * Tests if this rectangle intersects the AABB of the given rectangle.
         */
        intersectsTransformedAABB(other: Rectangle, matrix: Matrix): boolean;
        intersectsTranslated(other: Rectangle, tx: number, ty: number): boolean;
        area(): number;
        clone(): Rectangle;
        static allocate(): Rectangle;
        free(): void;
        /**
         * Snaps the rectangle to pixel boundaries. The computed rectangle covers
         * the original rectangle.
         */
        snap(): Rectangle;
        scale(x: number, y: number): Rectangle;
        offset(x: number, y: number): Rectangle;
        resize(w: number, h: number): Rectangle;
        expand(w: number, h: number): Rectangle;
        getCenter(): Point;
        getAbsoluteBounds(): Rectangle;
        toString(digits?: number): string;
        static createEmpty(): Rectangle;
        static createSquare(size: number): Rectangle;
        /**
         * Creates the maximum rectangle representable by signed 16 bit integers.
         */
        static createMaxI16(): Rectangle;
        setMaxI16(): void;
        getCorners(points: Point[]): void;
    }
    class OBB {
        axes: Point[];
        corners: Point[];
        origins: number[];
        constructor(corners: Point[]);
        getBounds(): Rectangle;
        static getBounds(points: Array<Point>): Rectangle;
        /**
         * http://www.flipcode.com/archives/2D_OBB_Intersection.shtml
         */
        intersects(other: OBB): boolean;
        private intersectsOneWay(other);
    }
    /**
     * Used to write fast paths for common matrix types.
     */
    const enum MatrixType {
        Unknown = 0,
        Identity = 1,
        Translation = 2,
    }
    class Matrix {
        static allocationCount: number;
        private _data;
        private _type;
        private static _dirtyStack;
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
        private static _svg;
        constructor(a: number, b: number, c: number, d: number, tx: number, ty: number);
        private static _createSVGMatrix();
        setElements(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        set(other: Matrix): void;
        /**
         * Whether the transformed query rectangle is empty after this transform is applied to it.
         */
        emptyArea(query: Rectangle): boolean;
        /**
         * Whether the area of transformed query rectangle is infinite after this transform is applied to it.
         */
        infiniteArea(query: Rectangle): boolean;
        isEqual(other: Matrix): boolean;
        clone(): Matrix;
        static allocate(): Matrix;
        free(): void;
        transform(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix;
        transformRectangle(rectangle: Rectangle, points: Point[]): void;
        isTranslationOnly(): boolean;
        transformRectangleAABB(rectangle: Rectangle): void;
        scale(x: number, y: number): Matrix;
        scaleClone(x: number, y: number): Matrix;
        rotate(angle: number): Matrix;
        concat(other: Matrix): Matrix;
        concatClone(other: Matrix): Matrix;
        /**
         * this = other * this
         */
        preMultiply(other: Matrix): void;
        translate(x: number, y: number): Matrix;
        setIdentity(): void;
        isIdentity(): boolean;
        transformPoint(point: Point): void;
        transformPoints(points: Point[]): void;
        deltaTransformPoint(point: Point): void;
        inverse(result: Matrix): void;
        getTranslateX(): number;
        getTranslateY(): number;
        getScaleX(): number;
        getScaleY(): number;
        getScale(): number;
        getAbsoluteScaleX(): number;
        getAbsoluteScaleY(): number;
        getRotation(): number;
        isScaleOrRotation(): boolean;
        toString(digits?: number): string;
        toWebGLMatrix(): Float32Array;
        toCSSTransform(): string;
        static createIdentity(): Matrix;
        static multiply: (dst: Matrix, src: Matrix) => void;
        toSVGMatrix(): SVGMatrix;
        snap(): boolean;
        static createIdentitySVGMatrix(): SVGMatrix;
        static createSVGMatrixFromArray(array: number[]): SVGMatrix;
    }
    class DirtyRegion {
        private static tmpRectangle;
        private grid;
        private w;
        private h;
        private c;
        private r;
        private size;
        private sizeInBits;
        constructor(w: number, h: number, sizeInBits?: number);
        clear(): void;
        getBounds(): Rectangle;
        addDirtyRectangle(rectangle: Rectangle): void;
        gatherRegions(regions: Rectangle[]): void;
        gatherOptimizedRegions(regions: Rectangle[]): void;
        getDirtyRatio(): number;
        render(context: CanvasRenderingContext2D, options?: any): void;
    }
    module DirtyRegion {
        class Cell {
            region: Rectangle;
            bounds: Rectangle;
            constructor(region: Rectangle);
            clear(): void;
        }
    }
    class Tile {
        x: number;
        y: number;
        index: number;
        scale: number;
        bounds: Rectangle;
        cachedSurfaceRegion: ISurfaceRegion;
        color: Shumway.Color;
        private _obb;
        private static corners;
        getOBB(): OBB;
        constructor(index: number, x: number, y: number, w: number, h: number, scale: number);
    }
    /**
     * A grid data structure that lets you query tiles that intersect a transformed rectangle.
     */
    class TileCache {
        w: number;
        h: number;
        tileW: number;
        tileH: number;
        rows: number;
        scale: number;
        columns: number;
        tiles: Tile[];
        private static _points;
        constructor(w: number, h: number, tileW: number, tileH: number, scale: number);
        /**
         * Query tiles using a transformed rectangle.
         * TODO: Fine-tune these heuristics.
         */
        getTiles(query: Rectangle, transform: Matrix): Tile[];
        /**
         * Precise indicates that we want to do an exact OBB intersection.
         */
        private getFewTiles(query, transform, precise?);
        private getManyTiles(query, transform);
    }
    /**
     * Manages tile caches at different scales.
     */
    class RenderableTileCache {
        private _source;
        private _cacheLevels;
        private _tileSize;
        private _minUntiledSize;
        constructor(source: Renderable, tileSize: number, minUntiledSize: number);
        /**
         * Gets the tiles covered by the specified |query| rectangle and transformed by the given |transform| matrix.
         */
        private _getTilesAtScale(query, transform, scratchBounds);
        fetchTiles(query: Rectangle, transform: Matrix, scratchContext: CanvasRenderingContext2D, cacheImageCallback: (old: ISurfaceRegion, src: CanvasRenderingContext2D, srcBounds: Rectangle) => ISurfaceRegion): Tile[];
        private _getTileBounds(tiles);
        /**
         * This caches raster versions of the specified |uncachedTiles|. The tiles are generated using a scratch
         * canvas2D context (|scratchContext|) and then cached via |cacheImageCallback|. Ideally, we want to render
         * all tiles in one go, but they may not fit in the |scratchContext| in which case we need to render the
         * source shape several times.
         *
         * TODO: Find a good algorithm to do this since it's quite important that we don't repaint too many times.
         * Spending some time trying to figure out the *optimal* solution may pay-off since painting is soo expensive.
         */
        private _cacheTiles(scratchContext, uncachedTiles, cacheImageCallback, scratchBounds, maxRecursionDepth?);
    }
}
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
declare module Shumway.GFX {
    /**
     * Various 2D rectangular region allocators. These are used to manage
     * areas of surfaces, 2D Canvases or WebGL surfaces. Each allocator
     * implements the |IRegionAllocator| interface and must provied two
     * methods to allocate and free regions.
     *
     * CompactAllocator: Good for tightly packed surface atlases but becomes
     * fragmented easily. Allocation / freeing cost is high and should only
     * be used for long lived regions.
     *
     * GridAllocator: Very fast at allocation and freeing but is not very
     * tightly packed. Space is initially partitioned in equally sized grid
     * cells which may be much larger than the allocated regions. This should
     * be used for fixed size allocation regions.
     *
     * BucketAllocator: Manages a list of GridAllocators with different grid
     * sizes.
     */
    module RegionAllocator {
        class Region extends Geometry.Rectangle {
            /**
             * The allocator who allocated this region. Once this is assigned it will never
             * change, even if the region is freed.
             */
            allocator: IRegionAllocator;
            /**
             * Whether the region contains allocated data.
             */
            allocated: boolean;
        }
        interface IRegionAllocator {
            /**
             * Allocates a 2D region.
             */
            allocate(w: number, h: number): Region;
            /**
             * Frees the specified region.
             */
            free(region: Region): void;
        }
        /**
         * Simple 2D bin-packing algorithm that recursively partitions space along the x and y axis. The binary tree
         * can get quite deep so watch out of deep recursive calls. This algorithm works best when inserting items
         * that are sorted by width and height, from largest to smallest.
         */
        class CompactAllocator implements IRegionAllocator {
            /**
             * Try out randomizing the orientation of each subdivision, sometimes this can lead to better results.
             */
            static RANDOM_ORIENTATION: boolean;
            static MAX_DEPTH: number;
            private _root;
            constructor(w: number, h: number);
            allocate(w: number, h: number): Region;
            free(region: Region): void;
        }
        /**
         * Simple grid allocator. Starts off with an empty free list and allocates empty cells. Once a cell
         * is freed it's pushed into the free list. It gets poped off the next time a region is allocated.
         */
        class GridAllocator implements IRegionAllocator {
            private _sizeW;
            private _sizeH;
            private _rows;
            private _columns;
            private _freeList;
            private _index;
            private _total;
            constructor(w: number, h: number, sizeW: number, sizeH: number);
            allocate(w: number, h: number): Region;
            free(region: Region): void;
        }
        class GridCell extends RegionAllocator.Region {
            index: number;
            constructor(x: number, y: number, w: number, h: number);
        }
        class BucketCell extends RegionAllocator.Region {
            region: RegionAllocator.Region;
            constructor(x: number, y: number, w: number, h: number, region: any);
        }
        class BucketAllocator implements IRegionAllocator {
            private _w;
            private _h;
            private _filled;
            private _buckets;
            constructor(w: number, h: number);
            /**
             * Finds the first bucket that is large enough to hold the requested region. If no
             * such bucket exists, then allocates a new bucket if there is room otherwise
             * returns null;
             */
            allocate(w: number, h: number): Region;
            free(region: BucketCell): void;
        }
    }
    module SurfaceRegionAllocator {
        interface ISurfaceRegionAllocator {
            /**
             * Used surfaces.
             */
            surfaces: ISurface[];
            /**
             * Adds a surface to the pool of allocation surfaces.
             */
            addSurface(surface: ISurface): void;
            /**
             * Allocates a 2D region.
             */
            allocate(w: number, h: number, excludeSurface: ISurface): ISurfaceRegion;
            /**
             * Frees the specified region.
             */
            free(region: ISurfaceRegion): void;
        }
        class SimpleAllocator implements ISurfaceRegionAllocator {
            private _createSurface;
            private _surfaces;
            readonly surfaces: ISurface[];
            constructor(createSurface: (w: number, h: number) => ISurface);
            private _createNewSurface(w, h);
            addSurface(surface: ISurface): void;
            allocate(w: number, h: number, excludeSurface: ISurface): ISurfaceRegion;
            free(region: ISurfaceRegion): void;
        }
    }
}
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
declare module Shumway.GFX {
    import Rectangle = Geometry.Rectangle;
    import Matrix = Geometry.Matrix;
    import DirtyRegion = Geometry.DirtyRegion;
    import Filter = Shumway.GFX.Filter;
    enum BlendMode {
        Normal = 1,
        Layer = 2,
        Multiply = 3,
        Screen = 4,
        Lighten = 5,
        Darken = 6,
        Difference = 7,
        Add = 8,
        Subtract = 9,
        Invert = 10,
        Alpha = 11,
        Erase = 12,
        Overlay = 13,
        HardLight = 14,
    }
    const enum NodeFlags {
        None = 0,
        Visible = 1,
        Transparent = 2,
        /**
         * Whether this node acts as a mask for another node.
         */
        IsMask = 4,
        /**
         * Whether this node is marked to be cached as a bitmap. This isn't just a performance optimization,
         * but also affects the way masking is performed.
         */
        CacheAsBitmap = 16,
        /**
         * Whether this node's contents should be drawn snapped to pixel boundaries.
         * Only relevant for bitmaps.
         */
        PixelSnapping = 32,
        /**
         * Whether this node's contents should use higher quality image smoothing.
         * Only relevant for bitmaps.
         */
        ImageSmoothing = 64,
        /**
         * Whether source has dynamic content.
         */
        Dynamic = 256,
        /**
         * Whether the source's content can be scaled and drawn at a higher resolution.
         */
        Scalable = 512,
        /**
         * Whether the source's content should be tiled.
         */
        Tileable = 1024,
        /**
         * Whether this node's bounding box is automatically computed from its children. If this
         * flag is |false| then this node's bounding box can only be set via |setBounds|.
         */
        BoundsAutoCompute = 2048,
        /**
         * Whether this node needs to be repainted.
         */
        Dirty = 4096,
        /**
         * Whether this node's bounds is invalid and needs to be recomputed. Only nodes that have the
         * |BoundsAutoCompute| flag set can have this flag set.
         */
        InvalidBounds = 8192,
        /**
         * Whether this node's concatenated matrix is invalid. This happens whenever a node's ancestor
         * is moved in the node tree.
         */
        InvalidConcatenatedMatrix = 16384,
        /**
         * Whether this node's inverted concatenated matrix is invalid. This happens whenever a node's ancestor
         * is moved in the node tree.
         */
        InvalidInvertedConcatenatedMatrix = 32768,
        /**
         * Same as above, but for colors.
         */
        InvalidConcatenatedColorMatrix = 65536,
        /**
         * Flags to propagate upwards when a node is added or removed from a group.
         */
        UpOnAddedOrRemoved = 12288,
        /**
         * Flags to propagate downwards when a node is added or removed from a group.
         */
        DownOnAddedOrRemoved = 114688,
        /**
         * Flags to propagate upwards when a node is moved.
         */
        UpOnMoved = 12288,
        /**
         * Flags to propagate downwards when a node is moved.
         */
        DownOnMoved = 49152,
        /**
         * Flags to propagate upwards when a node's color matrix is changed.
         */
        UpOnColorMatrixChanged = 4096,
        /**
         * Flags to propagate downwards when a node's color matrix is changed.
         */
        DownOnColorMatrixChanged = 65536,
        /**
         * Flags to propagate upwards when a node is invalidated.
         */
        UpOnInvalidate = 12288,
        /**
         * Default node flags, however not all node types use these defaults.
         */
        Default = 59393,
    }
    /**
     * Scene graph object hierarchy. This enum makes it possible to write fast type checks.
     */
    const enum NodeType {
        Node = 1,
        Shape = 3,
        Group = 5,
        Stage = 13,
        Renderable = 33,
    }
    /**
     * Basic event types. Not much here.
     */
    const enum NodeEventType {
        None = 0,
        OnStageBoundsChanged = 1,
        RemovedFromStage = 2,
    }
    /**
     * Basic node visitor. Inherit from this if you want a more sophisticated visitor, for instance all
     * renderers extends this class.
     */
    class NodeVisitor {
        visitNode(node: Node, state: State): void;
        visitShape(node: Shape, state: State): void;
        visitGroup(node: Group, state: State): void;
        visitStage(node: Stage, state: State): void;
        visitRenderable(node: Renderable, state: State): void;
    }
    /**
     * Nodes that cache transformation state. These are used to thread state when traversing
     * the scene graph. Since they keep track of rendering state, they might as well become
     * scene graph nodes.
     */
    class State {
        constructor();
    }
    class PreRenderState extends State {
        depth: number;
        constructor();
    }
    /**
     * Helper visitor that checks and resets the dirty bit and calculates stack levels. If the root
     * node is dirty, then we have to repaint the entire node tree.
     */
    class PreRenderVisitor extends NodeVisitor {
        isDirty: boolean;
        private _dirtyRegion;
        private _depth;
        start(node: Group, dirtyRegion: DirtyRegion): void;
        visitGroup(node: Group, state: State): void;
        visitNode(node: Node, state: State): void;
    }
    /**
     * Debugging visitor.
     */
    class TracingNodeVisitor extends NodeVisitor {
        writer: IndentingWriter;
        constructor(writer: IndentingWriter);
        visitNode(node: Node, state: State): void;
        visitShape(node: Shape, state: State): void;
        visitGroup(node: Group, state: State): void;
        visitStage(node: Stage, state: State): void;
    }
    /**
     * Base class of all nodes in the scene graph.
     */
    class Node {
        /**
         * Temporary array of nodes to avoid allocations.
         */
        private static _path;
        /**
         * Used to give nodes unique ids.
         */
        private static _nextId;
        protected _id: number;
        readonly id: number;
        /**
         * Keep track of node type directly on the node so we don't have to use |instanceof| for type checks.
         */
        protected _type: NodeType;
        /**
         * All sorts of flags.
         */
        _flags: NodeFlags;
        /**
         * Index of this node in its parent's children list.
         */
        _index: number;
        /**
         * Parent node. This is |null| for the root node and for |Renderables| which have more than one parent.
         */
        _parent: Group;
        /**
         * Number of sibillings to clip.
         */
        protected _clip: number;
        /**
         * Layer info: blend modes, filters and such.
         */
        protected _layer: Layer;
        /**
         * Transform info: matrix, color matrix. Null transform is the identity.
         */
        protected _transform: Transform;
        /**
         * This nodes stack level.
         */
        depth: number;
        /**
         * Used to track changes
         */
        dirtyUpdateID: number;
        renderID: number;
        updateID: number;
        protected _eventListeners: {
            type: NodeEventType;
            listener: (node: Node, type?: NodeEventType) => void;
        }[];
        protected _dispatchEvent(type: NodeEventType): void;
        /**
         * Adds an event listener.
         */
        addEventListener(type: NodeEventType, listener: (node: Node, type?: NodeEventType) => void): void;
        /**
         * Removes an event listener.
         */
        removeEventListener(type: NodeEventType, listener: (node: Node, type?: NodeEventType) => void): void;
        /**
         * Property bag used to attach dynamic properties to this object.
         */
        protected _properties: {
            [name: string]: any;
        };
        readonly properties: {
            [name: string]: any;
        };
        /**
         * Bounds of the scene graph object. Bounds are computed automatically for non-leaf nodes
         * that have the |NodeFlags.BoundsAutoCompute| flag set.
         */
        protected _bounds: Rectangle;
        constructor();
        /**
         * Resets the Node to its initial state but preserves its identity.
         * It safe to call this on a child without disrupting ownership.
         */
        reset(): void;
        clip: number;
        readonly parent: Node;
        getTransformedBounds(target: Node): Rectangle;
        _markCurrentBoundsAsDirtyRegion(): void;
        getStage(withDirtyRegion?: boolean): Stage;
        /**
         * This shouldn't be used on any hot path becuse it allocates.
         */
        getChildren(clone?: boolean): Node[];
        getBounds(clone?: boolean): Rectangle;
        /**
         * Can only be set on nodes without the |NodeFlags.BoundsAutoCompute| flag set.
         */
        setBounds(value: Rectangle): void;
        clone(): Node;
        setFlags(flags: NodeFlags): void;
        hasFlags(flags: NodeFlags): boolean;
        hasAnyFlags(flags: NodeFlags): boolean;
        removeFlags(flags: NodeFlags): void;
        toggleFlags(flags: NodeFlags, on: boolean): void;
        /**
         * Propagates flags up the tree. Propagation stops if all flags are already set.
         */
        _propagateFlagsUp(flags: NodeFlags): void;
        /**
         * Propagates flags down the tree. Non-containers just set the flags on themselves.
         */
        _propagateFlagsDown(flags: NodeFlags): void;
        isAncestor(node: Node): boolean;
        /**
         * Return's a list of ancestors excluding the |last|, the return list is reused.
         */
        static _getAncestors(node: Node, last: Node): Node[];
        /**
         * Finds the closest ancestor with a given set of flags that are either turned on or off.
         */
        _findClosestAncestor(flags: NodeFlags, on: boolean): Node;
        /**
         * Type check.
         */
        isType(type: NodeType): boolean;
        /**
         * Subtype check.
         */
        isTypeOf(type: NodeType): boolean;
        isLeaf(): boolean;
        isLinear(): boolean;
        getTransformMatrix(clone?: boolean): Matrix;
        getTransform(): Transform;
        getLayer(): Layer;
        getLayerBounds(includeFilters: boolean): Rectangle;
        /**
         * Dispatch on node types.
         */
        visit(visitor: NodeVisitor, state: State): void;
        invalidate(): void;
        toString(bounds?: boolean): string;
    }
    /**
     * Nodes that contain other nodes.
     */
    class Group extends Node {
        protected _children: Node[];
        constructor();
        getChildren(clone?: boolean): Node[];
        childAt(index: number): Node;
        readonly child: Node;
        readonly groupChild: Group;
        /**
         * Adds a node and remove's it from its previous location if it has a parent and propagates
         * flags accordingly.
         */
        addChild(node: Node): void;
        /**
         * Removes a child at the given index and propagates flags accordingly.
         */
        removeChildAt(index: number): void;
        clearChildren(): void;
        /**
         * Override and propagate flags to all children.
         */
        _propagateFlagsDown(flags: NodeFlags): void;
        /**
         * Takes the union of all child bounds and caches the bounds locally.
         */
        getBounds(clone?: boolean): Rectangle;
        /**
         * Takes the union of all child bounds, optionaly including filter expansions.
         */
        getLayerBounds(includeFilters: boolean): Rectangle;
    }
    /**
     * Transform associated with a node. This helps to reduce the size of nodes.
     */
    class Transform {
        /**
         * Node that this transform belongs to.
         */
        protected _node: Node;
        /**
         * Transform matrix.
         */
        protected _matrix: Matrix;
        /**
         * Transform color matrix.
         */
        protected _colorMatrix: ColorMatrix;
        /**
         * Concatenated matrix. This is not frequently used.
         */
        protected _concatenatedMatrix: Matrix;
        /**
         * Inverted concatenated matrix. This is not frequently used.
         */
        protected _invertedConcatenatedMatrix: Matrix;
        /**
         * Concatenated color matrix. This is not frequently used.
         */
        protected _concatenatedColorMatrix: ColorMatrix;
        constructor(node: Node);
        /**
         * Set a node's transform matrix. You should never mutate the matrix object directly.
         */
        setMatrix(value: Matrix): void;
        setColorMatrix(value: ColorMatrix): void;
        getMatrix(clone?: boolean): Matrix;
        hasColorMatrix(): boolean;
        getColorMatrix(clone?: boolean): ColorMatrix;
        /**
         * Compute the concatenated transforms for this node and all of its ancestors since we're already doing
         * all the work.
         */
        getConcatenatedMatrix(clone?: boolean): Matrix;
        getInvertedConcatenatedMatrix(clone?: boolean): Matrix;
        toString(): string;
    }
    /**
     * Layer information associated with a node. This helps to reduce the size of nodes.
     */
    class Layer {
        protected _node: Node;
        protected _blendMode: BlendMode;
        protected _mask: Node;
        protected _filters: Filter[];
        constructor(node: Node);
        filters: Filter[];
        blendMode: BlendMode;
        mask: Node;
        toString(): string;
        expandBounds(bounds: Rectangle): void;
    }
    /**
     * Shapes are instantiations of Renderables.
     */
    class Shape extends Node {
        private _source;
        private _ratio;
        constructor(source: Renderable);
        getBounds(clone?: boolean): Rectangle;
        readonly source: Renderable;
        ratio: number;
        _propagateFlagsDown(flags: NodeFlags): void;
        getChildren(clone?: boolean): Node[];
    }
    import StageAlignFlags = Shumway.Remoting.StageAlignFlags;
    import StageScaleMode = Shumway.Remoting.StageScaleMode;
    class RendererOptions {
        debug: boolean;
        paintRenderable: boolean;
        paintBounds: boolean;
        paintDirtyRegion: boolean;
        paintFlashing: boolean;
        paintViewport: boolean;
        clear: boolean;
    }
    const enum Backend {
        Canvas2D = 0,
        WebGL = 1,
        Both = 2,
        DOM = 3,
        SVG = 4,
    }
    /**
     * Base class for all renderers.
     */
    class Renderer extends NodeVisitor {
        /**
         * Everything is clipped by the viewport.
         */
        protected _viewport: Rectangle;
        protected _options: RendererOptions;
        /**
         * We can render either into a canvas element or into a div element.
         */
        protected _container: HTMLDivElement | HTMLCanvasElement;
        protected _stage: Stage;
        protected _devicePixelRatio: number;
        constructor(container: HTMLDivElement | HTMLCanvasElement, stage: Stage, options: RendererOptions);
        viewport: Rectangle;
        render(): void;
        /**
         * Notify renderer that the viewport has changed.
         */
        resize(): void;
        /**
         * Captures a rectangular region of the easel as a dataURL as specified by |bounds|. |stageContent| indicates if the bounds
         * should be computed by looking at the bounds of the content of the easel rather than the easel itself.
         */
        screenShot(bounds: Rectangle, stageContent: boolean, disableHidpi: boolean): ScreenShot;
    }
    /**
     * Node container that handles Flash style alignment and scale modes.
     */
    class Stage extends Group {
        /**
         * This is supposed to keep track of dirty regions.
         */
        private _dirtyRegion;
        readonly dirtyRegion: DirtyRegion;
        private _align;
        private _scaleMode;
        /**
         * All stage content is added to his child node. This is so what we can set the align and scale
         * transform to all stage descendants but not affect the stage itself.
         */
        private _content;
        color: Color;
        private static DEFAULT_SCALE;
        private static DEFAULT_ALIGN;
        private _preVisitor;
        constructor(w: number, h: number, trackDirtyRegion?: boolean);
        setBounds(value: Rectangle): void;
        readonly content: Group;
        /**
         * Checks to see if we should render and if so, clears any relevant dirty flags. Returns
         * true if rendering should commence. Flag clearing is made optional here in case there
         * is any code that needs to check if rendering is about to happen.
         */
        readyToRender(): boolean;
        align: StageAlignFlags;
        scaleMode: StageScaleMode;
        /**
         * Figure out what the content transform shuold be given the current align and scale modes.
         */
        private _updateContentMatrix();
    }
}
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
declare module Shumway.GFX {
    import Rectangle = Geometry.Rectangle;
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import VideoPlaybackEvent = Shumway.Remoting.VideoPlaybackEvent;
    import VideoControlEvent = Shumway.Remoting.VideoControlEvent;
    /**
     * Represents some source renderable content.
     */
    class Renderable extends Node {
        /**
         * Back reference to nodes that use this renderable.
         */
        private _parents;
        /**
         * Back reference to renderables that use this renderable.
         */
        private _renderableParents;
        readonly parents: Shape[];
        addParent(frame: Shape): void;
        /**
         * Checks if this node will be reached by the renderer.
         */
        willRender(): boolean;
        addRenderableParent(renderable: Renderable): void;
        /**
         * Returns the first unrooted parent or creates a new parent if none was found.
         */
        wrap(): Shape;
        invalidate(): void;
        private _invalidateEventListeners;
        addInvalidateEventListener(listener: (renderable: Renderable) => void): void;
        getBounds(clone?: boolean): Shumway.GFX.Geometry.Rectangle;
        getChildren(clone?: boolean): Node[];
        _propagateFlagsUp(flags: NodeFlags): void;
        constructor();
        /**
         * Render source content in the specified |context| or add one or more paths to |clipPath| if specified.
         * If specified, the rectangular |cullBounds| can be used to cull parts of the shape for better performance.
         * If |paintStencil| is |true| then we must not create any alpha values, and also not paint any strokes.
         */
        render(context: CanvasRenderingContext2D, ratio: number, cullBounds?: Shumway.GFX.Geometry.Rectangle, clipPath?: Path2D, paintStencil?: boolean, fillAdditive?: boolean): void;
    }
    class CustomRenderable extends Renderable {
        constructor(bounds: Rectangle, render: (context: CanvasRenderingContext2D, ratio: number, cullBounds: Shumway.GFX.Geometry.Rectangle) => void);
    }
    interface IVideoPlaybackEventSerializer {
        sendVideoPlaybackEvent(assetId: number, eventType: VideoPlaybackEvent, data: any): void;
    }
    const enum RenderableVideoState {
        Idle = 1,
        Playing = 2,
        Paused = 3,
        Ended = 4,
    }
    class RenderableVideo extends Renderable {
        _flags: number;
        private _video;
        private _videoEventHandler;
        private _assetId;
        private _eventSerializer;
        private _lastTimeInvalidated;
        private _lastPausedTime;
        private _seekHappening;
        private _pauseHappening;
        private _isDOMElement;
        private _state;
        static _renderableVideos: RenderableVideo[];
        constructor(assetId: number, eventSerializer: IVideoPlaybackEventSerializer);
        readonly video: HTMLVideoElement;
        readonly state: RenderableVideoState;
        play(): void;
        pause(): void;
        private _handleVideoEvent(evt);
        private _notifyNetStream(eventType, data);
        processControlRequest(type: VideoControlEvent, data: any): any;
        checkForUpdate(): void;
        static checkForVideoUpdates(): void;
        render(context: CanvasRenderingContext2D, ratio: number, cullBounds: Rectangle): void;
    }
    class RenderableBitmap extends Renderable {
        _flags: number;
        _canvas: HTMLCanvasElement;
        _context: CanvasRenderingContext2D;
        _imageData: ImageData;
        private _sourceImage;
        private fillStyle;
        static FromDataBuffer(type: ImageType, dataBuffer: DataBuffer, bounds: Rectangle): RenderableBitmap;
        static FromNode(source: Node, matrix: Shumway.GFX.Geometry.Matrix, colorMatrix: Shumway.GFX.ColorMatrix, blendMode: number, clipRect: Rectangle): RenderableBitmap;
        /**
         * Returns a RenderableBitmap from an Image element, which it uses as its source.
         *
         * Takes `width` and `height` as arguments so it can deal with non-decoded images,
         * which will only get their data after asynchronous decoding has completed.
         */
        static FromImage(image: HTMLImageElement, width: number, height: number): RenderableBitmap;
        updateFromDataBuffer(type: ImageType, dataBuffer: DataBuffer): void;
        /**
         * Writes the image data into the given |output| data buffer.
         */
        readImageData(output: DataBuffer): void;
        constructor(source: any, bounds: Rectangle);
        render(context: CanvasRenderingContext2D, ratio: number, cullBounds: Rectangle): void;
        drawNode(source: Node, matrix: Shumway.GFX.Geometry.Matrix, colorMatrix: Shumway.GFX.ColorMatrix, blendMode: number, clip: Rectangle): void;
        mask(alphaValues: Uint8Array): void;
        private _initializeSourceCanvas(source);
        private _ensureSourceCanvas();
        private readonly imageData;
        readonly renderSource: any;
        private _renderFallback(context);
    }
    const enum PathType {
        Fill = 0,
        Stroke = 1,
        StrokeFill = 2,
    }
    class StyledPath {
        type: PathType;
        style: any;
        smoothImage: boolean;
        strokeProperties: StrokeProperties;
        path: Path2D;
        shareBorder: boolean;
        constructor(type: PathType, style: any, smoothImage: boolean, strokeProperties: StrokeProperties);
    }
    class StrokeProperties {
        thickness: number;
        scaleMode: LineScaleMode;
        capsStyle: string;
        jointsStyle: string;
        miterLimit: number;
        constructor(thickness: number, scaleMode: LineScaleMode, capsStyle: string, jointsStyle: string, miterLimit: number);
    }
    class RenderableShape extends Renderable {
        _flags: NodeFlags;
        private fillStyle;
        private _paths;
        protected _id: number;
        protected _pathData: ShapeData;
        protected _textures: RenderableBitmap[];
        protected static LINE_CAPS_STYLES: string[];
        protected static LINE_JOINTS_STYLES: string[];
        constructor(id: number, pathData: ShapeData, textures: RenderableBitmap[], bounds: Rectangle);
        update(pathData: ShapeData, textures: RenderableBitmap[], bounds: Rectangle): void;
        /**
         * If |clipPath| is not |null| then we must add all paths to |clipPath| instead of drawing to |context|.
         * We also cannot call |save| or |restore| because those functions reset the current clipping region.
         * It looks like Flash ignores strokes when clipping so we can also ignore stroke paths when computing
         * the clip region.
         *
         * If |paintStencil| is |true| then we must not create any alpha values, and also not paint
         * any strokes.
         */
        render(context: CanvasRenderingContext2D, ratio: number, cullBounds: Rectangle, clipPath?: Path2D, paintStencil?: boolean, fillAdditive?: boolean): void;
        protected _deserializePaths(data: ShapeData, context: CanvasRenderingContext2D, ratio: number, checkBorder?: boolean): StyledPath[];
        private _createPath(type, style, smoothImage, strokeProperties, x, y);
        private _readMatrix(data);
        private _readGradient(styles, context);
        private _readBitmap(styles, context);
        protected _renderFallback(context: CanvasRenderingContext2D): void;
    }
    class RenderableMorphShape extends RenderableShape {
        _flags: NodeFlags;
        private _morphPaths;
        protected _deserializePaths(data: ShapeData, context: CanvasRenderingContext2D, ratio: number): StyledPath[];
        private _createMorphPath(type, ratio, style, smoothImage, strokeProperties, x, y);
        private _readMorphMatrix(data, morphData, ratio);
        private _readMorphGradient(styles, morphStyles, ratio, context);
        private _readMorphBitmap(styles, morphStyles, ratio, context);
    }
    class TextLine {
        private static _measureContext;
        x: number;
        y: number;
        width: number;
        ascent: number;
        descent: number;
        leading: number;
        align: number;
        runs: TextRun[];
        private static _getMeasureContext();
        addRun(font: string, fillStyle: string, text: string, letterSpacing: number, underline: boolean): void;
        wrap(maxWidth: number): TextLine[];
        toString(): string;
    }
    class TextRun {
        font: string;
        fillStyle: string;
        text: string;
        width: number;
        letterSpacing: number;
        underline: boolean;
        constructor(font?: string, fillStyle?: string, text?: string, width?: number, letterSpacing?: number, underline?: boolean);
    }
    class RenderableText extends Renderable {
        _flags: number;
        private _textBounds;
        private _textRunData;
        private _plainText;
        private _backgroundColor;
        private _borderColor;
        private _matrix;
        private _coords;
        private _scrollV;
        private _scrollH;
        textRect: Rectangle;
        lines: TextLine[];
        constructor(bounds: any);
        setBounds(bounds: any): void;
        setContent(plainText: string, textRunData: DataBuffer, matrix: Shumway.GFX.Geometry.Matrix, coords: DataBuffer): void;
        setStyle(backgroundColor: number, borderColor: number, scrollV: number, scrollH: number): void;
        reflow(autoSize: number, wordWrap: boolean): void;
        private static absoluteBoundPoints;
        private static roundBoundPoints(points);
        render(context: CanvasRenderingContext2D): void;
        private _renderChars(context);
        private _renderLines(context);
    }
    class Label extends Renderable {
        _flags: NodeFlags;
        private _text;
        text: string;
        constructor(w: number, h: number);
        render(context: CanvasRenderingContext2D, ratio: number, cullBounds?: Rectangle): void;
    }
}
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
declare module Shumway.GFX {
    import Rectangle = Geometry.Rectangle;
    class Filter {
        expandBounds(bounds: Rectangle): void;
    }
    class BlurFilter extends Filter {
        blurX: number;
        blurY: number;
        quality: number;
        constructor(blurX: number, blurY: number, quality: number);
        expandBounds(bounds: Rectangle): void;
    }
    class DropshadowFilter extends Filter {
        alpha: number;
        angle: number;
        blurX: number;
        blurY: number;
        color: number;
        distance: number;
        hideObject: boolean;
        inner: boolean;
        knockout: boolean;
        quality: number;
        strength: number;
        constructor(alpha: number, angle: number, blurX: number, blurY: number, color: number, distance: number, hideObject: boolean, inner: boolean, knockout: boolean, quality: number, strength: number);
        expandBounds(bounds: Rectangle): void;
    }
    class GlowFilter extends Filter {
        alpha: number;
        blurX: number;
        blurY: number;
        color: number;
        inner: boolean;
        knockout: boolean;
        quality: number;
        strength: number;
        constructor(alpha: number, blurX: number, blurY: number, color: number, inner: boolean, knockout: boolean, quality: number, strength: number);
        expandBounds(bounds: Rectangle): void;
    }
    const enum ColorMatrixType {
        Unknown = 0,
        Identity = 1,
    }
    class ColorMatrix extends Filter {
        private _data;
        private _type;
        constructor(data: any);
        clone(): ColorMatrix;
        set(other: ColorMatrix): void;
        toWebGLMatrix(): Float32Array;
        asWebGLMatrix(): Float32Array;
        asWebGLVector(): Float32Array;
        isIdentity(): boolean;
        static createIdentity(): ColorMatrix;
        setMultipliersAndOffsets(redMultiplier: number, greenMultiplier: number, blueMultiplier: number, alphaMultiplier: number, redOffset: number, greenOffset: number, blueOffset: number, alphaOffset: number): void;
        transformRGBA(rgba: number): number;
        multiply(other: ColorMatrix): void;
        readonly alphaMultiplier: number;
        hasOnlyAlphaMultiplier(): boolean;
        equals(other: ColorMatrix): boolean;
        toSVGFilterMatrix(): string;
    }
}
interface CanvasGradient {
    setTransform: (matrix: SVGMatrix) => void;
}
interface CanvasRenderingContext2D {
    stackDepth: number;
    fill(path: Path2D, fillRule?: string): void;
    clip(path: Path2D, fillRule?: string): void;
    stroke(path: Path2D): void;
    imageSmoothingEnabled: boolean;
    mozImageSmoothingEnabled: boolean;
    msImageSmoothingEnabled: boolean;
    fillRule: string;
    mozFillRule: string;
    enterBuildingClippingRegion(): void;
    leaveBuildingClippingRegion(): void;
}
interface Path2D {
    addPath(path: Path2D, transform?: SVGMatrix): void;
}
declare module Shumway.GFX.Canvas2D {
    function notifyReleaseChanged(): void;
}
declare module Shumway.GFX.Canvas2D {
    import Rectangle = Shumway.GFX.Geometry.Rectangle;
    class Filters {
        /**
         * Reusable blur filter SVG element.
         */
        static _svgBlurFilter: Element;
        /**
         * Reusable dropshadow filter SVG element.
         */
        static _svgDropshadowFilterBlur: Element;
        static _svgDropshadowFilterFlood: Element;
        static _svgDropshadowFilterOffset: Element;
        static _svgDropshadowMergeNode: Element;
        /**
         * Reusable colormatrix filter SVG element.
         */
        static _svgColorMatrixFilter: Element;
        static _svgFiltersAreSupported: boolean;
        /**
         * Creates an SVG element and defines filters that are referenced in |canvas.filter| properties. We cannot
         * inline CSS filters because they don't expose independent blurX and blurY properties.
         * This only works in Firefox, and you have to set the 'canvas.filters.enabled' equal to |true|.
         */
        private static _prepareSVGFilters();
        static _applyFilter(ratio: number, context: CanvasRenderingContext2D, filter: Filter): void;
        static _removeFilter(context: CanvasRenderingContext2D): void;
        static _applyColorMatrix(context: CanvasRenderingContext2D, colorMatrix: ColorMatrix): void;
    }
    class Canvas2DSurfaceRegion implements ISurfaceRegion {
        surface: Canvas2DSurface;
        region: RegionAllocator.Region;
        w: number;
        h: number;
        /**
         * Draw image is really slow if the soruce and destination are the same. We use
         * a temporary canvas for all such copy operations.
         */
        private static _copyCanvasContext;
        constructor(surface: Canvas2DSurface, region: RegionAllocator.Region, w: number, h: number);
        free(): void;
        private static _ensureCopyCanvasSize(w, h);
        draw(source: Canvas2DSurfaceRegion, x: number, y: number, w: number, h: number, colorMatrix: ColorMatrix, blendMode: BlendMode, filters: Filter[], devicePixelRatio: number): void;
        readonly context: CanvasRenderingContext2D;
        resetTransform(): void;
        reset(): void;
        fill(fillStyle: any): void;
        clear(rectangle?: Rectangle): void;
        enterClip(rect?: Rectangle): void;
        exitClip(): void;
    }
    class SurfaceClipState {
        target: Canvas2DSurfaceRegion;
        rect: Rectangle;
        states: Array<RenderState>;
        constructor();
        enter(): void;
        leave(): void;
        applyClipPath(state: RenderState): void;
        closeClipPath(): void;
        startClipRect(rect: Rectangle): void;
        finishClipRect(): void;
    }
    class Canvas2DSurface implements ISurface {
        w: number;
        h: number;
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        private _regionAllocator;
        constructor(canvas: HTMLCanvasElement, regionAllocator?: RegionAllocator.IRegionAllocator);
        allocate(w: number, h: number): Canvas2DSurfaceRegion;
        free(surfaceRegion: Canvas2DSurfaceRegion): void;
        /**
         * CLIP STACK STATE !@#$ YOU CANVAS2D
         */
        clipStates: Array<SurfaceClipState>;
        clipStateNum: number;
        enterClip(region: Canvas2DSurfaceRegion, rect?: Rectangle): void;
        exitClip(): void;
        applyClipPath(state: RenderState): void;
        closeClipPath(): void;
    }
}
declare module Shumway.GFX {
    let PERF_SHAPE_MS: number;
    let PERF_LAYER_MS: number;
    let PERF_SHOW_SLOW: boolean;
    let ENABLE_LAYERS_CACHE: boolean;
}
declare module Shumway.GFX.Canvas2D {
    import Rectangle = Shumway.GFX.Geometry.Rectangle;
    import Matrix = Shumway.GFX.Geometry.Matrix;
    import BlendMode = Shumway.GFX.BlendMode;
    class MipMapLevel {
        surfaceRegion: ISurfaceRegion;
        scale: number;
        constructor(surfaceRegion: ISurfaceRegion, scale: number);
    }
    class MipMap {
        private _node;
        private _size;
        private _levels;
        private _renderer;
        private _surfaceRegionAllocator;
        constructor(renderer: Canvas2DRenderer, node: Node, surfaceRegionAllocator: SurfaceRegionAllocator.ISurfaceRegionAllocator, size: number);
        getLevel(matrix: Matrix): MipMapLevel;
    }
    const enum FillRule {
        NonZero = 0,
        EvenOdd = 1,
    }
    class Canvas2DRendererOptions extends RendererOptions {
        [key: string]: any;
        /**
         * Whether to force snapping matrices to device pixels.
         */
        snapToDevicePixels: boolean;
        /**
         * Whether to force image smoothing when drawing images.
         */
        imageSmoothing: boolean;
        /**
         * Whether to enable blending.
         */
        blending: boolean;
        /**
         * Whether to enable debugging of layers.
         */
        debugLayers: boolean;
        /**
         * Whether to enable masking.
         */
        masking: boolean;
        /**
         * Whether to enable filters.
         */
        filters: boolean;
        /**
         * Whether to cache shapes as images.
         */
        cacheShapes: boolean;
        /**
         * Turn off slow shapes
         */
        perfRender: boolean;
        /**
         * Shapes above this size are not cached.
         */
        cacheShapesMaxSize: number;
        /**
         * Number of times a shape is rendered before it's elligible for caching.
         */
        cacheShapesThreshold: number;
        /**
         * Enables alpha layer for the canvas context.
         */
        alpha: boolean;
    }
    const enum RenderFlags {
        None = 0,
        IgnoreNextLayer = 1,
        RenderMask = 2,
        IgnoreMask = 4,
        PaintStencil = 8,
        PaintClip = 16,
        IgnoreRenderable = 32,
        IgnoreNextRenderWithCache = 64,
        CacheShapes = 256,
        PaintFlashing = 512,
        PaintBounds = 1024,
        PaintDirtyRegion = 2048,
        ImageSmoothing = 4096,
        PixelSnapping = 8192,
        FillAdditive = 16384,
        PerfRender = 32768,
    }
    /**
     * Render state.
     */
    class RenderState extends State {
        static allocationCount: number;
        private static _dirtyStack;
        clip: Rectangle;
        clipList: Rectangle[];
        clipPath: Path2D;
        flags: RenderFlags;
        target: Canvas2DSurfaceRegion;
        matrix: Matrix;
        colorMatrix: ColorMatrix;
        options: Canvas2DRendererOptions;
        constructor(target: Canvas2DSurfaceRegion);
        set(state: RenderState): void;
        clone(): RenderState;
        static allocate(): RenderState;
        free(): void;
        transform(transform: Transform): RenderState;
        hasFlags(flags: RenderFlags): boolean;
        removeFlags(flags: RenderFlags): void;
        toggleFlags(flags: RenderFlags, on: boolean): void;
        beginClipPath(transform: Matrix): void;
        applyClipPath(): void;
        closeClipPath(): void;
    }
    /**
     * Stats for each rendered frame.
     */
    class FrameInfo {
        private _count;
        private _enterTime;
        shapes: number;
        groups: number;
        culledNodes: number;
        enter(state: RenderState): void;
        leave(): void;
    }
    class Canvas2DRenderer extends Renderer {
        protected _options: Canvas2DRendererOptions;
        context: CanvasRenderingContext2D;
        private _target;
        private static _initializedCaches;
        /**
         * Allocates temporary regions for performing image operations.
         */
        private static _surfaceCache;
        /**
         * Allocates shape cache regions.
         */
        private static _shapeCache;
        private _visited;
        /**
         * stores current number of frame
         */
        frameCounter: number;
        private _frameInfo;
        private _allocatedLayers;
        private _fontSize;
        /**
         * Stack of rendering layers. Stage video lives at the bottom of this stack.
         */
        private _layers;
        constructor(container: HTMLDivElement | HTMLCanvasElement, stage: Stage, options?: Canvas2DRendererOptions);
        private _addLayer(name);
        private readonly _backgroundVideoLayer;
        private _createTarget(canvas);
        /**
         * If the stage bounds have changed, we have to resize all of our layers, canvases and more ...
         */
        private _onStageBoundsChanged(canvas);
        private static _prepareSurfaceAllocators();
        /**
         * Main render function.
         */
        render(): void;
        gc(): void;
        renderNode(node: Node, clip: Rectangle, matrix: Matrix): void;
        renderNodeWithState(node: Node, state: RenderState): void;
        private _renderWithCache(node, state);
        private _intersectsClipList(node, state);
        visitGroup(node: Group, state: RenderState): void;
        private static _debugPoints;
        _renderDebugInfo(node: Node, state: RenderState): void;
        visitStage(node: Stage, state: RenderState): void;
        visitShape(node: Shape, state: RenderState): void;
        /**
         * We don't actually draw the video like normal renderables, although we could.
         * Instead, we add the video element underneeth the canvas at layer zero and set
         * the appropriate css transform to move it into place.
         */
        visitRenderableVideo(node: RenderableVideo, state: RenderState): void;
        visitRenderable(node: Renderable, state: RenderState, ratio?: number): void;
        markSlowNode(node: Renderable, state: RenderState, ms: number): void;
        _renderLayer(node: Node, state: RenderState): void;
        _renderLayerWithCache(node: Node, state: RenderState): void;
        _renderWithMask(node: Node, mask: Node, blendMode: BlendMode, stencil: boolean, state: RenderState): void;
        private _renderStageToTarget(target, node, clip);
        private _renderToTemporarySurface(node, bounds, state, clip, excludeSurface);
        private _renderToTemporarySurfaceEx(node, state, target, clip);
        private _allocateSurface(w, h, excludeSurface);
        screenShot(bounds: Rectangle, stageContent: boolean, disableHidpi: boolean): ScreenShot;
    }
}
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
declare module Shumway.GFX {
    import Point = Geometry.Point;
    import Rectangle = Geometry.Rectangle;
    import DisplayParameters = Shumway.Remoting.DisplayParameters;
    interface IState {
        onMouseUp(easel: Easel, event: MouseEvent): void;
        onMouseDown(easel: Easel, event: MouseEvent): void;
        onMouseMove(easel: Easel, event: MouseEvent): void;
        onMouseClick(easel: Easel, event: MouseEvent): void;
        onKeyUp(easel: Easel, event: KeyboardEvent): void;
        onKeyDown(easel: Easel, event: KeyboardEvent): void;
        onKeyPress(easel: Easel, event: KeyboardEvent): void;
    }
    class UIState implements IState {
        onMouseUp(easel: Easel, event: MouseEvent): void;
        onMouseDown(easel: Easel, event: MouseEvent): void;
        onMouseMove(easel: Easel, event: MouseEvent): void;
        onMouseWheel(easel: Easel, event: any): void;
        onMouseClick(easel: Easel, event: MouseEvent): void;
        onKeyUp(easel: Easel, event: KeyboardEvent): void;
        onKeyDown(easel: Easel, event: KeyboardEvent): void;
        onKeyPress(easel: Easel, event: KeyboardEvent): void;
    }
    class Easel {
        /**
         * Root stage node.
         */
        private _stage;
        /**
         * Node that holds the view transformation. This us used for zooming and panning in the easel.
         */
        private _worldView;
        /**
         * Node that holds the rest of the content in the display tree.
         */
        private _world;
        private _options;
        /**
         * Container div element that is managed by this easel. If the dimensions of this element change, then the dimensions of the root
         * stage also change.
         */
        private _container;
        private _renderer;
        private _disableHiDPI;
        private _state;
        private _persistentState;
        paused: boolean;
        viewport: Rectangle;
        transparent: boolean;
        private _selectedNodes;
        private _isRendering;
        private _rAF;
        private _eventListeners;
        private _fps;
        private _fullScreen;
        constructor(container: HTMLDivElement, disableHiDPI?: boolean, backgroundColor?: number);
        private _listenForContainerSizeChanges();
        private _onContainerSizeChanged();
        /**
         * Primitive event dispatching features.
         */
        addEventListener(type: string, listener: any): void;
        private _dispatchEvent(type);
        startRendering(): void;
        stopRendering(): void;
        state: UIState;
        cursor: string;
        private _render();
        render(): void;
        readonly world: Group;
        readonly worldView: Group;
        readonly stage: Stage;
        readonly options: Canvas2D.Canvas2DRendererOptions;
        getDisplayParameters(): DisplayParameters;
        toggleOption(name: string): void;
        getOption(name: string): any;
        getRatio(): number;
        private readonly _containerWidth;
        private readonly _containerHeight;
        queryNodeUnderMouse(event: MouseEvent): Node;
        selectNodeUnderMouse(event: MouseEvent): void;
        getMousePosition(event: MouseEvent, coordinateSpace: Node): Point;
        getMouseWorldPosition(event: MouseEvent): Point;
        private _onMouseDown(event);
        private _onMouseUp(event);
        private _onMouseMove(event);
        screenShot(bounds: Rectangle, stageContent: boolean, disableHidpi: boolean): ScreenShot;
    }
}
declare module Shumway.GFX {
    import Matrix = Shumway.GFX.Geometry.Matrix;
    const enum Layout {
        Simple = 0,
    }
    class TreeRendererOptions extends RendererOptions {
        layout: Layout;
    }
    class TreeRenderer extends Renderer {
        _options: TreeRendererOptions;
        _canvas: HTMLCanvasElement;
        _context: CanvasRenderingContext2D;
        layout: any;
        constructor(container: HTMLDivElement, stage: Stage, options?: TreeRendererOptions);
        private _listenForContainerSizeChanges();
        private _getRatio();
        private _onContainerSizeChanged();
        private readonly _containerWidth;
        private readonly _containerHeight;
        render(): void;
        _renderNodeSimple(context: CanvasRenderingContext2D, root: Node, transform: Matrix): void;
    }
}
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
declare module Shumway.Remoting.GFX {
    import Group = Shumway.GFX.Group;
    import Renderable = Shumway.GFX.Renderable;
    import RenderableBitmap = Shumway.GFX.RenderableBitmap;
    import RenderableVideo = Shumway.GFX.RenderableVideo;
    import IVideoPlaybackEventSerializer = Shumway.GFX.IVideoPlaybackEventSerializer;
    import RenderableText = Shumway.GFX.RenderableText;
    import Node = Shumway.GFX.Node;
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import Stage = Shumway.GFX.Stage;
    import Point = Shumway.GFX.Geometry.Point;
    import IDataInput = Shumway.ArrayUtilities.IDataInput;
    import IDataOutput = Shumway.ArrayUtilities.IDataOutput;
    class GFXChannelSerializer {
        output: IDataOutput;
        outputAssets: any[];
        writeMouseEvent(event: MouseEvent, point: Point): void;
        writeKeyboardEvent(event: KeyboardEvent): void;
        writeFocusEvent(type: FocusEventType): void;
    }
    class GFXChannelDeserializerContext implements IVideoPlaybackEventSerializer {
        stage: Stage;
        _nodes: Node[];
        private _assets;
        _easelHost: Shumway.GFX.EaselHost;
        readCounter: number;
        private _canvas;
        private _context;
        constructor(easelHost: Shumway.GFX.EaselHost, root: Group, transparent: boolean);
        _registerAsset(id: number, symbolId: number, asset: Renderable): void;
        _makeNode(id: number): Node;
        _getAsset(id: number): Renderable;
        _getBitmapAsset(id: number): RenderableBitmap;
        _getVideoAsset(id: number): RenderableVideo;
        _getTextAsset(id: number): RenderableText;
        registerFont(syncId: number, data: Uint8Array, resolve: (data: any) => void): void;
        registerImage(syncId: number, symbolId: number, imageType: ImageType, data: Uint8Array, alphaData: Uint8Array, resolve: (data: any) => void): void;
        registerVideo(syncId: number): void;
        /**
         * Creates an Image element to decode JPG|PNG|GIF data passed in as a buffer.
         *
         * The resulting image is stored as the drawing source of a new RenderableBitmap, which is
         * returned.
         * Once the image is loaded, the RenderableBitmap's bounds are updated and the provided
         * oncomplete callback is invoked with the image dimensions.
         */
        _decodeImage(type: ImageType, data: Uint8Array, alphaData: Uint8Array, oncomplete: (data: any) => void): RenderableBitmap;
        sendVideoPlaybackEvent(assetId: number, eventType: VideoPlaybackEvent, data: any): void;
    }
    class GFXChannelDeserializer {
        input: IDataInput;
        inputAssets: any[];
        output: DataBuffer;
        context: GFXChannelDeserializerContext;
        /**
         * Used to avoid extra allocation, don't ever leak a reference to this object.
         */
        private static _temporaryReadMatrix;
        /**
         * Used to avoid extra allocation, don't ever leak a reference to this object.
         */
        private static _temporaryReadRectangle;
        /**
         * Used to avoid extra allocation, don't ever leak a reference to this object.
         */
        private static _temporaryReadColorMatrix;
        private static _temporaryReadColorMatrixIdentity;
        read(): void;
        private _readMatrix();
        private _readRectangle();
        private _readColorMatrix();
        private _readAsset();
        private _readUpdateGraphics();
        private _readUpdateBitmapData();
        private _readUpdateTextContent();
        private _writeLineMetrics(line);
        private _readUpdateStage();
        private _readUpdateCurrentMouseTarget();
        private _readUpdateNetStream();
        private _readFilters(node);
        private _readUpdateFrame();
        private _readDrawToBitmap();
        private _readRequestBitmapData();
    }
}
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
declare module Shumway.GFX {
    import Easel = Shumway.GFX.Easel;
    import Stage = Shumway.GFX.Stage;
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import VideoControlEvent = Shumway.Remoting.VideoControlEvent;
    import VideoPlaybackEvent = Shumway.Remoting.VideoPlaybackEvent;
    import DisplayParameters = Shumway.Remoting.DisplayParameters;
    let ContextMenuButton: number;
    class EaselHost {
        private static _mouseEvents;
        private static _keyboardEvents;
        private _easel;
        private _group;
        private _context;
        private _content;
        private _fullscreen;
        constructor(easel: Easel);
        onSendUpdates(update: DataBuffer, asssets: Array<DataBuffer>): void;
        readonly easel: Easel;
        readonly stage: Stage;
        content: Group;
        cursor: string;
        fullscreen: boolean;
        private _mouseEventListener(event);
        private _keyboardEventListener(event);
        _addEventListeners(): void;
        private _sendFocusEvent(type);
        private _addFocusEventListeners();
        private _resizeEventListener();
        onDisplayParameters(params: DisplayParameters): void;
        processUpdates(updates: DataBuffer, assets: Array<DataBuffer>, output?: DataBuffer): void;
        processVideoControl(id: number, eventType: VideoControlEvent, data: any): any;
        processRegisterFont(syncId: number, data: Uint8Array, resolve: (data: any) => void): void;
        processRegisterImage(syncId: number, symbolId: number, imageType: ImageType, data: Uint8Array, alphaData: Uint8Array, resolve: (data: any) => void): void;
        processFSCommand(command: string, args: string): void;
        processFrame(): void;
        onVideoPlaybackEvent(id: number, eventType: VideoPlaybackEvent, data: any): void;
        sendVideoPlaybackEvent(id: number, eventType: VideoPlaybackEvent, data: any): void;
    }
}
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
declare module Shumway.GFX.Window {
    import Easel = Shumway.GFX.Easel;
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import VideoPlaybackEvent = Shumway.Remoting.VideoPlaybackEvent;
    import DisplayParameters = Shumway.Remoting.DisplayParameters;
    class WindowEaselHost extends EaselHost {
        private _peer;
        constructor(easel: Easel, peer: Shumway.Remoting.ITransportPeer);
        onSendUpdates(updates: DataBuffer, assets: Array<DataBuffer>): void;
        onDisplayParameters(params: DisplayParameters): void;
        onVideoPlaybackEvent(id: number, eventType: VideoPlaybackEvent, data: any): void;
        private _sendRegisterFontResponse(requestId, result);
        private _sendRegisterImageResponse(requestId, result);
        _onWindowMessage(data: any, async: boolean): any;
    }
}
/**
 * Copyright 2015 Mozilla Foundation
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
declare module Shumway.GFX.Test {
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    const enum MovieRecordType {
        None = 0,
        PlayerCommand = 1,
        PlayerCommandAsync = 2,
        Frame = 3,
        Font = 4,
        Image = 5,
        FSCommand = 6,
    }
    class MovieRecorder {
        private _recording;
        private _recordingStarted;
        private _stopped;
        private _maxRecordingSize;
        constructor(maxRecordingSize: number);
        stop(): void;
        getRecording(): Blob;
        dump(): void;
        private _createRecord(type, buffer);
        recordPlayerCommand(async: boolean, updates: Uint8Array, assets: any[]): void;
        recordFrame(): void;
        recordFont(syncId: number, data: Uint8Array): void;
        recordImage(syncId: number, symbolId: number, imageType: ImageType, data: Uint8Array, alphaData: Uint8Array): void;
        recordFSCommand(command: string, args: string): void;
    }
    class MovieRecordParser {
        private _buffer;
        currentTimestamp: number;
        currentType: MovieRecordType;
        currentData: DataBuffer;
        constructor(data: Uint8Array);
        readNextRecord(): MovieRecordType;
        parsePlayerCommand(): any;
        parseFSCommand(): any;
        parseFont(): any;
        parseImage(): any;
        dump(): void;
    }
}
/**
 * Copyright 2015 Mozilla Foundation
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
declare module Shumway.GFX.Test {
    import Easel = Shumway.GFX.Easel;
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import VideoPlaybackEvent = Shumway.Remoting.VideoPlaybackEvent;
    import DisplayParameters = Shumway.Remoting.DisplayParameters;
    class PlaybackEaselHost extends EaselHost {
        private _parser;
        private _lastTimestamp;
        ignoreTimestamps: boolean;
        alwaysRenderFrame: boolean;
        cpuTimeUpdates: number;
        cpuTimeRendering: number;
        onComplete: () => void;
        constructor(easel: Easel);
        readonly cpuTime: number;
        private playUrl(url);
        private playBytes(data);
        onSendUpdates(updates: DataBuffer, assets: Array<DataBuffer>): void;
        onDisplayParameters(params: DisplayParameters): void;
        onVideoPlaybackEvent(id: number, eventType: VideoPlaybackEvent, data: any): void;
        private _parseNext();
        private _runRecord();
        private _renderFrameJustAfterRAF();
    }
}
/**
 * Copyright 2015 Mozilla Foundation
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
declare module Shumway.GFX.Test {
    import WindowEaselHost = Shumway.GFX.Window.WindowEaselHost;
    class RecordingEaselHost extends WindowEaselHost {
        private _recorder;
        readonly recorder: MovieRecorder;
        constructor(easel: Easel, peer: Shumway.Remoting.ITransportPeer, recordingLimit?: number);
        _onWindowMessage(data: any, async: boolean): any;
    }
}
interface WebGLActiveInfo {
    location: any;
}
interface WebGLProgram extends WebGLObject {
    uniforms: any;
    attributes: any;
}
declare module Shumway.Player {
    let timelineBuffer: Tools.Profiler.TimelineBuffer;
    let counter: Metrics.Counter;
    let writer: IndentingWriter;
    function enterTimeline(name: string, data?: any): void;
    function leaveTimeline(name: string, data?: any): void;
}
declare module Shumway {
    let playerOptions: any;
    let frameEnabledOption: any;
    let timerEnabledOption: any;
    let pumpEnabledOption: any;
    let pumpRateOption: any;
    let frameRateOption: any;
    let tracePlayerOption: any;
    let traceMouseEventOption: any;
    let frameRateMultiplierOption: any;
    let dontSkipFramesOption: any;
    let playAllSymbolsOption: any;
    let playSymbolOption: any;
    let playSymbolFrameDurationOption: any;
    let playSymbolCountOption: any;
}
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
declare module Shumway {
    class FrameScheduler {
        private static STATS_TO_REMEMBER;
        private static MAX_DRAWS_TO_SKIP;
        private static INTERVAL_PADDING_MS;
        private static SPEED_ADJUST_RATE;
        private _drawStats;
        private _drawStatsSum;
        private _drawStarted;
        private _drawsSkipped;
        private _expectedNextFrameAt;
        private _onTime;
        private _trackDelta;
        private _delta;
        private _onTimeDelta;
        constructor();
        readonly shallSkipDraw: boolean;
        readonly nextFrameIn: number;
        readonly isOnTime: boolean;
        startFrame(frameRate: number): void;
        endFrame(): void;
        startDraw(): void;
        endDraw(): void;
        skipDraw(): void;
        setDelta(value: number): void;
        startTrackDelta(): void;
        endTrackDelta(): void;
    }
}
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
declare module Shumway.Remoting.Player {
    import flash = Shumway.flash;
    import Stage = flash.display.Stage;
    import Graphics = flash.display.Graphics;
    import NetStream = flash.net.NetStream;
    import BitmapData = flash.display.BitmapData;
    import DisplayObject = flash.display.DisplayObject;
    import Bounds = Shumway.Bounds;
    import IDataInput = Shumway.ArrayUtilities.IDataInput;
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    class PlayerChannelSerializer {
        /**
         * Output buffer that the serializer writes to.
         */
        output: DataBuffer;
        outputAssets: any[];
        phase: RemotingPhase;
        roots: DisplayObject[];
        constructor();
        remoteObjects(): void;
        remoteReferences(): void;
        writeEOF(): void;
        /**
         * Serializes dirty display objects starting at the specified root |displayObject| node.
         */
        writeDirtyDisplayObjects(displayObject: DisplayObject, clearDirtyDescendentsFlag: boolean): void;
        /**
         * Serializes dirty display objects starting at the specified root |displayObject| node.
         * Also serializes all layers
         */
        writeDirtyDisplayObjectsWithLayers(displayObject: DisplayObject): void;
        writeStage(stage: Stage): void;
        writeCurrentMouseTarget(stage: Stage, currentMouseTarget: flash.display.InteractiveObject): void;
        writeGraphics(graphics: Graphics): void;
        writeNetStream(netStream: NetStream, bounds: Bounds): void;
        writeDisplayObjectRoot(displayObject: DisplayObject): void;
        writeBitmapData(bitmapData: BitmapData): void;
        writeTextContent(textContent: Shumway.TextContent): void;
        /**
         * Writes the number of display objects this display object clips.
         */
        writeClippedObjectsCount(displayObject: DisplayObject): void;
        writeUpdateFrame(displayObject: DisplayObject): void;
        /**
         * Visit remotable child objects that are not otherwise visited.
         */
        writeDirtyAssets(displayObject: DisplayObject): void;
        writeDrawToBitmap(bitmapData: flash.display.BitmapData, source: Shumway.Remoting.IRemotable, matrix?: flash.geom.Matrix, colorTransform?: flash.geom.ColorTransform, blendMode?: string, clipRect?: flash.geom.Rectangle, smoothing?: boolean): void;
        private _writeMatrix(matrix);
        private _writeRectangle(bounds);
        private _writeAsset(asset);
        private _writeFilters(filters);
        private _writeColorTransform(colorTransform);
        writeRequestBitmapData(bitmapData: BitmapData): void;
    }
    interface FocusEventData {
        type: FocusEventType;
    }
    class PlayerChannelDeserializer {
        private sec;
        private input;
        private inputAssets;
        constructor(sec: flash.system.ISecurityDomain, input: IDataInput, inputAssets: any[]);
        read(): any;
        private _readFocusEvent();
        private _readMouseEvent();
        private _readKeyboardEvent();
    }
}
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
declare module Shumway.Player {
    import flash = Shumway.flash;
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import BitmapData = flash.display.BitmapData;
    import ISecurityDomain = flash.system.ISecurityDomain;
    import IBitmapDataSerializer = flash.display.IBitmapDataSerializer;
    import IAssetResolver = Timeline.IAssetResolver;
    import IFSCommandListener = flash.system.IFSCommandListener;
    import IVideoElementService = flash.net.IVideoElementService;
    import IRootElementService = flash.display.IRootElementService;
    import ICrossDomainSWFLoadingWhitelist = flash.system.ICrossDomainSWFLoadingWhitelist;
    import CrossDomainSWFLoadingWhitelistResult = flash.system.CrossDomainSWFLoadingWhitelistResult;
    import VideoControlEvent = Shumway.Remoting.VideoControlEvent;
    import VideoPlaybackEvent = Shumway.Remoting.VideoPlaybackEvent;
    import DisplayParameters = Shumway.Remoting.DisplayParameters;
    import IGFXService = Shumway.Remoting.IGFXService;
    import IGFXServiceObserver = Shumway.Remoting.IGFXServiceObserver;
    /**
     * Base class implementation of the IGFXServer. The different transports shall
     * inherit this class
     */
    class GFXServiceBase implements IGFXService {
        _observers: IGFXServiceObserver[];
        sec: ISecurityDomain;
        constructor(sec: ISecurityDomain);
        addObserver(observer: IGFXServiceObserver): void;
        removeObserver(observer: IGFXServiceObserver): void;
        update(updates: DataBuffer, assets: any[]): void;
        updateAndGet(updates: DataBuffer, assets: any[]): any;
        frame(): void;
        videoControl(id: number, eventType: VideoControlEvent, data: any): any;
        registerFont(syncId: number, data: Uint8Array): Promise<any>;
        registerImage(syncId: number, symbolId: number, imageType: ImageType, data: Uint8Array, alphaData: Uint8Array): Promise<any>;
        fscommand(command: string, args: string): void;
        processUpdates(updates: DataBuffer, assets: any[]): void;
        processDisplayParameters(displayParameters: DisplayParameters): void;
        processVideoEvent(id: number, eventType: VideoPlaybackEvent, data: any): void;
    }
    /**
     * Shumway Player
     *
     * This class brings everything together. Loads the swf, runs the event loop and
     * synchronizes the frame tree with the display list.
     */
    class Player implements IBitmapDataSerializer, IFSCommandListener, IVideoElementService, IAssetResolver, IRootElementService, ICrossDomainSWFLoadingWhitelist {
        sec: ISecurityDomain;
        _stage: flash.display.Stage;
        private _loader;
        private _loaderInfo;
        private _frameTimeout;
        private _eventLoopIsRunning;
        private _framesPlayed;
        readonly framesPlayed: number;
        private _writer;
        private _gfxService;
        private _gfxServiceObserver;
        /**
         * If set, overrides SWF file background color.
         */
        defaultStageColor: number;
        /**
         * Movie parameters, such as flashvars.
         */
        movieParams: MapObject<string>;
        /**
         * Initial stage alignment: l|r|t|tr|tl.
         */
        stageAlign: string;
        /**
         * Initial stage scaling: showall|noborder|exactfit|noscale.
         */
        stageScale: string;
        /**
         * Initial display parameters.
         */
        displayParameters: DisplayParameters;
        /**
         * Timestamp of initialization start of the player itself, including iframe creation.
         */
        initStartTime: number;
        /**
         * Time since the last time we've synchronized the display list.
         */
        private _lastPumpTime;
        /**
         * Page Visibility API visible state.
         */
        _isPageVisible: boolean;
        /**
         * Page focus state.
         */
        _hasFocus: boolean;
        /**
         * Stage current mouse target.
         */
        private _currentMouseTarget;
        /**
         * Indicates whether the |currentMouseTarget| has changed since the last time it was synchronized.
         */
        private _currentMouseTargetIsDirty;
        currentMouseTarget: flash.display.InteractiveObject;
        /**
         * Page URL that hosts SWF.
         */
        private _pageUrl;
        /**
         * SWF URL.
         */
        private _swfUrl;
        /**
         * Loader URL, can be different from SWF URL.
         */
        private _loaderUrl;
        constructor(sec: ISecurityDomain, gfxService: IGFXService);
        /**
         * Movie stage object.
         */
        readonly stage: flash.display.Stage;
        /**
         * Whether we can get away with rendering at a lower rate.
         */
        private _shouldThrottleDownRendering();
        /**
         * Whether we can get away with executing frames at a lower rate.
         */
        private _shouldThrottleDownFrameExecution();
        pageUrl: string;
        loaderUrl: string;
        readonly swfUrl: string;
        load(url: string, buffer?: ArrayBuffer): void;
        private createLoaderContext();
        private _pumpDisplayListUpdates();
        syncDisplayObject(displayObject: flash.display.DisplayObject, async: boolean): DataBuffer;
        requestBitmapData(bitmapData: BitmapData): DataBuffer;
        drawToBitmap(bitmapData: flash.display.BitmapData, source: Shumway.Remoting.IRemotable, matrix?: flash.geom.Matrix, colorTransform?: flash.geom.ColorTransform, blendMode?: string, clipRect?: flash.geom.Rectangle, smoothing?: boolean): void;
        registerEventListener(id: number, listener: (eventType: VideoPlaybackEvent, data: any) => void): void;
        notifyVideoControl(id: number, eventType: VideoControlEvent, data: any): any;
        executeFSCommand(command: string, args: string): void;
        requestRendering(): void;
        /**
         * Update the frame container with the latest changes from the display list.
         */
        private _pumpUpdates();
        private _leaveSyncLoop();
        private _getFrameInterval();
        private _enterEventLoop();
        private _leaveEventLoop();
        private _enterRootLoadingLoop();
        start(params: any): void;
        private _eventLoopTick();
        private _tracePlayer();
        registerFont(symbol: Timeline.EagerlyResolvedSymbol, data: Uint8Array): void;
        registerImage(symbol: Timeline.EagerlyResolvedSymbol, imageType: ImageType, data: Uint8Array, alphaData: Uint8Array): void;
        private _crossDomainSWFLoadingWhitelist;
        addToSWFLoadingWhitelist(domain: string, insecure: boolean, ownDomain: boolean): void;
        checkDomainForSWFLoading(domain: string): CrossDomainSWFLoadingWhitelistResult;
    }
}
/**
 * Copyright 2015 Mozilla Foundation
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
declare module Shumway.Player {
    class ShumwayComExternalInterface implements IExternalInterfaceService {
        private _externalCallback;
        readonly enabled: boolean;
        initJS(callback: (functionName: string, args: any[]) => any): void;
        registerCallback(functionName: string): void;
        unregisterCallback(functionName: string): void;
        eval(expression: string): any;
        call(request: string): any;
        getId(): string;
    }
    class ShumwayComFileLoadingService implements IFileLoadingService {
        private _baseUrl;
        private _nextSessionId;
        private _sessions;
        init(baseUrl: string): void;
        private _notifySession(session, args);
        createSession(): FileLoadingSession;
        resolveUrl(url: string): string;
        navigateTo(url: any, target: any): void;
    }
    class ShumwayComClipboardService implements IClipboardService {
        setClipboard(data: string): void;
    }
    class ShumwayComTelemetryService implements ITelemetryService {
        reportTelemetry(data: any): void;
    }
    class BrowserFileLoadingService implements IFileLoadingService {
        private _baseUrl;
        private _fileReadChunkSize;
        createSession(): {
            open: (request: any) => void;
            close: () => void;
        };
        init(baseUrl: string, fileReadChunkSize?: number): void;
        resolveUrl(url: string): string;
        navigateTo(url: string, target: string): void;
    }
    class ShumwayComResourcesLoadingService implements ISystemResourcesLoadingService {
        private _pendingPromises;
        constructor(preload: boolean);
        private _onSystemResourceCallback(id, data);
        load(id: SystemResourceId): Promise<any>;
    }
    class BrowserSystemResourcesLoadingService implements ISystemResourcesLoadingService {
        builtinPath: string;
        viewerPlayerglobalInfo: {
            abcs: string;
            catalog: string;
        };
        shellPath: string;
        constructor(builtinPath: string, viewerPlayerglobalInfo?: {
            abcs: string;
            catalog: string;
        }, shellPath?: string);
        load(id: SystemResourceId): Promise<any>;
        private _promiseFile(path, responseType);
    }
    class BaseLocalConnectionService implements ILocalConnectionService {
        protected _localConnections: any;
        createConnection(connectionName: string, receiver: ILocalConnectionReceiver): LocalConnectionConnectResult;
        closeConnection(connectionName: string, receiver: ILocalConnectionReceiver): LocalConnectionCloseResult;
        hasConnection(connectionName: string): boolean;
        _sendMessage(connectionName: string, methodName: string, argsBuffer: ArrayBuffer, sender: ILocalConnectionSender, senderDomain: string, senderIsSecure: boolean): any;
        send(connectionName: string, methodName: string, argsBuffer: ArrayBuffer, sender: ILocalConnectionSender, senderDomain: string, senderIsSecure: boolean): void;
        allowDomains(connectionName: string, receiver: ILocalConnectionReceiver, domains: string[], secure: boolean): void;
    }
    class ShumwayComLocalConnectionService extends BaseLocalConnectionService {
        createConnection(connectionName: string, receiver: ILocalConnectionReceiver): LocalConnectionConnectResult;
        closeConnection(connectionName: string, receiver: ILocalConnectionReceiver): LocalConnectionCloseResult;
        hasConnection(connectionName: string): boolean;
        _sendMessage(connectionName: string, methodName: string, argsBuffer: ArrayBuffer, sender: ILocalConnectionSender, senderDomain: string, senderIsSecure: boolean): void;
        allowDomains(connectionName: string, receiver: ILocalConnectionReceiver, domains: string[], secure: boolean): void;
    }
    class PlayerInternalLocalConnectionService extends BaseLocalConnectionService {
        createConnection(connectionName: string, receiver: ILocalConnectionReceiver): LocalConnectionConnectResult;
        closeConnection(connectionName: string, receiver: ILocalConnectionReceiver): LocalConnectionCloseResult;
        hasConnection(connectionName: string): boolean;
        _sendMessage(connectionName: string, methodName: string, argsBuffer: ArrayBuffer, sender: ILocalConnectionSender, senderURL: string): void;
    }
}
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
declare module Shumway.Player.Window {
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import VideoControlEvent = Shumway.Remoting.VideoControlEvent;
    class WindowGFXService extends GFXServiceBase {
        private _peer;
        private _assetDecodingRequests;
        constructor(sec: flash.system.ISecurityDomain, peer: Shumway.Remoting.ITransportPeer);
        update(updates: DataBuffer, assets: any[]): void;
        updateAndGet(updates: DataBuffer, assets: any[]): any;
        frame(): void;
        videoControl(id: number, eventType: VideoControlEvent, data: any): any;
        registerFont(syncId: number, data: Uint8Array): Promise<any>;
        registerImage(syncId: number, symbolId: number, imageType: ImageType, data: Uint8Array, alphaData: Uint8Array): Promise<any>;
        fscommand(command: string, args: string): void;
        private onWindowMessage(data);
    }
}

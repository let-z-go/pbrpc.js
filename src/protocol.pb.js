/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots.pbrpc_protocol || ($protobuf.roots.pbrpc_protocol = {});

/**
 * MessageType enum.
 * @exports MessageType
 * @enum {string}
 * @property {number} MESSAGE_REQUEST=0 MESSAGE_REQUEST value
 * @property {number} MESSAGE_RESPONSE=1 MESSAGE_RESPONSE value
 * @property {number} MESSAGE_HEARTBEAT=2 MESSAGE_HEARTBEAT value
 */
$root.MessageType = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "MESSAGE_REQUEST"] = 0;
    values[valuesById[1] = "MESSAGE_RESPONSE"] = 1;
    values[valuesById[2] = "MESSAGE_HEARTBEAT"] = 2;
    return values;
})();

$root.Greeting = (function() {

    /**
     * Properties of a Greeting.
     * @exports IGreeting
     * @interface IGreeting
     * @property {Greeting.IChannel|null} [channel] Greeting channel
     * @property {Uint8Array|null} [handshake] Greeting handshake
     */

    /**
     * Constructs a new Greeting.
     * @exports Greeting
     * @classdesc Represents a Greeting.
     * @implements IGreeting
     * @constructor
     * @param {IGreeting=} [properties] Properties to set
     */
    function Greeting(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Greeting channel.
     * @member {Greeting.IChannel|null|undefined} channel
     * @memberof Greeting
     * @instance
     */
    Greeting.prototype.channel = null;

    /**
     * Greeting handshake.
     * @member {Uint8Array} handshake
     * @memberof Greeting
     * @instance
     */
    Greeting.prototype.handshake = $util.newBuffer([]);

    /**
     * Creates a new Greeting instance using the specified properties.
     * @function create
     * @memberof Greeting
     * @static
     * @param {IGreeting=} [properties] Properties to set
     * @returns {Greeting} Greeting instance
     */
    Greeting.create = function create(properties) {
        return new Greeting(properties);
    };

    /**
     * Encodes the specified Greeting message. Does not implicitly {@link Greeting.verify|verify} messages.
     * @function encode
     * @memberof Greeting
     * @static
     * @param {IGreeting} message Greeting message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Greeting.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.channel != null && message.hasOwnProperty("channel"))
            $root.Greeting.Channel.encode(message.channel, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.handshake != null && message.hasOwnProperty("handshake"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.handshake);
        return writer;
    };

    /**
     * Encodes the specified Greeting message, length delimited. Does not implicitly {@link Greeting.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Greeting
     * @static
     * @param {IGreeting} message Greeting message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Greeting.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Greeting message from the specified reader or buffer.
     * @function decode
     * @memberof Greeting
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Greeting} Greeting
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Greeting.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Greeting();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.channel = $root.Greeting.Channel.decode(reader, reader.uint32());
                break;
            case 2:
                message.handshake = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Greeting message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Greeting
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Greeting} Greeting
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Greeting.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Greeting message.
     * @function verify
     * @memberof Greeting
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Greeting.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.channel != null && message.hasOwnProperty("channel")) {
            var error = $root.Greeting.Channel.verify(message.channel);
            if (error)
                return "channel." + error;
        }
        if (message.handshake != null && message.hasOwnProperty("handshake"))
            if (!(message.handshake && typeof message.handshake.length === "number" || $util.isString(message.handshake)))
                return "handshake: buffer expected";
        return null;
    };

    /**
     * Creates a Greeting message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Greeting
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Greeting} Greeting
     */
    Greeting.fromObject = function fromObject(object) {
        if (object instanceof $root.Greeting)
            return object;
        var message = new $root.Greeting();
        if (object.channel != null) {
            if (typeof object.channel !== "object")
                throw TypeError(".Greeting.channel: object expected");
            message.channel = $root.Greeting.Channel.fromObject(object.channel);
        }
        if (object.handshake != null)
            if (typeof object.handshake === "string")
                $util.base64.decode(object.handshake, message.handshake = $util.newBuffer($util.base64.length(object.handshake)), 0);
            else if (object.handshake.length)
                message.handshake = object.handshake;
        return message;
    };

    /**
     * Creates a plain object from a Greeting message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Greeting
     * @static
     * @param {Greeting} message Greeting
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Greeting.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.channel = null;
            if (options.bytes === String)
                object.handshake = "";
            else {
                object.handshake = [];
                if (options.bytes !== Array)
                    object.handshake = $util.newBuffer(object.handshake);
            }
        }
        if (message.channel != null && message.hasOwnProperty("channel"))
            object.channel = $root.Greeting.Channel.toObject(message.channel, options);
        if (message.handshake != null && message.hasOwnProperty("handshake"))
            object.handshake = options.bytes === String ? $util.base64.encode(message.handshake, 0, message.handshake.length) : options.bytes === Array ? Array.prototype.slice.call(message.handshake) : message.handshake;
        return object;
    };

    /**
     * Converts this Greeting to JSON.
     * @function toJSON
     * @memberof Greeting
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Greeting.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    Greeting.Channel = (function() {

        /**
         * Properties of a Channel.
         * @memberof Greeting
         * @interface IChannel
         * @property {Uint8Array|null} [id] Channel id
         * @property {number|null} [timeout] Channel timeout
         * @property {number|null} [incomingWindowSize] Channel incomingWindowSize
         * @property {number|null} [outgoingWindowSize] Channel outgoingWindowSize
         */

        /**
         * Constructs a new Channel.
         * @memberof Greeting
         * @classdesc Represents a Channel.
         * @implements IChannel
         * @constructor
         * @param {Greeting.IChannel=} [properties] Properties to set
         */
        function Channel(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Channel id.
         * @member {Uint8Array} id
         * @memberof Greeting.Channel
         * @instance
         */
        Channel.prototype.id = $util.newBuffer([]);

        /**
         * Channel timeout.
         * @member {number} timeout
         * @memberof Greeting.Channel
         * @instance
         */
        Channel.prototype.timeout = 0;

        /**
         * Channel incomingWindowSize.
         * @member {number} incomingWindowSize
         * @memberof Greeting.Channel
         * @instance
         */
        Channel.prototype.incomingWindowSize = 0;

        /**
         * Channel outgoingWindowSize.
         * @member {number} outgoingWindowSize
         * @memberof Greeting.Channel
         * @instance
         */
        Channel.prototype.outgoingWindowSize = 0;

        /**
         * Creates a new Channel instance using the specified properties.
         * @function create
         * @memberof Greeting.Channel
         * @static
         * @param {Greeting.IChannel=} [properties] Properties to set
         * @returns {Greeting.Channel} Channel instance
         */
        Channel.create = function create(properties) {
            return new Channel(properties);
        };

        /**
         * Encodes the specified Channel message. Does not implicitly {@link Greeting.Channel.verify|verify} messages.
         * @function encode
         * @memberof Greeting.Channel
         * @static
         * @param {Greeting.IChannel} message Channel message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Channel.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && message.hasOwnProperty("id"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.id);
            if (message.timeout != null && message.hasOwnProperty("timeout"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.timeout);
            if (message.incomingWindowSize != null && message.hasOwnProperty("incomingWindowSize"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.incomingWindowSize);
            if (message.outgoingWindowSize != null && message.hasOwnProperty("outgoingWindowSize"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.outgoingWindowSize);
            return writer;
        };

        /**
         * Encodes the specified Channel message, length delimited. Does not implicitly {@link Greeting.Channel.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Greeting.Channel
         * @static
         * @param {Greeting.IChannel} message Channel message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Channel.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Channel message from the specified reader or buffer.
         * @function decode
         * @memberof Greeting.Channel
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Greeting.Channel} Channel
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Channel.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Greeting.Channel();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.bytes();
                    break;
                case 2:
                    message.timeout = reader.int32();
                    break;
                case 3:
                    message.incomingWindowSize = reader.int32();
                    break;
                case 4:
                    message.outgoingWindowSize = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Channel message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Greeting.Channel
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Greeting.Channel} Channel
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Channel.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Channel message.
         * @function verify
         * @memberof Greeting.Channel
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Channel.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!(message.id && typeof message.id.length === "number" || $util.isString(message.id)))
                    return "id: buffer expected";
            if (message.timeout != null && message.hasOwnProperty("timeout"))
                if (!$util.isInteger(message.timeout))
                    return "timeout: integer expected";
            if (message.incomingWindowSize != null && message.hasOwnProperty("incomingWindowSize"))
                if (!$util.isInteger(message.incomingWindowSize))
                    return "incomingWindowSize: integer expected";
            if (message.outgoingWindowSize != null && message.hasOwnProperty("outgoingWindowSize"))
                if (!$util.isInteger(message.outgoingWindowSize))
                    return "outgoingWindowSize: integer expected";
            return null;
        };

        /**
         * Creates a Channel message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Greeting.Channel
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Greeting.Channel} Channel
         */
        Channel.fromObject = function fromObject(object) {
            if (object instanceof $root.Greeting.Channel)
                return object;
            var message = new $root.Greeting.Channel();
            if (object.id != null)
                if (typeof object.id === "string")
                    $util.base64.decode(object.id, message.id = $util.newBuffer($util.base64.length(object.id)), 0);
                else if (object.id.length)
                    message.id = object.id;
            if (object.timeout != null)
                message.timeout = object.timeout | 0;
            if (object.incomingWindowSize != null)
                message.incomingWindowSize = object.incomingWindowSize | 0;
            if (object.outgoingWindowSize != null)
                message.outgoingWindowSize = object.outgoingWindowSize | 0;
            return message;
        };

        /**
         * Creates a plain object from a Channel message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Greeting.Channel
         * @static
         * @param {Greeting.Channel} message Channel
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Channel.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.id = "";
                else {
                    object.id = [];
                    if (options.bytes !== Array)
                        object.id = $util.newBuffer(object.id);
                }
                object.timeout = 0;
                object.incomingWindowSize = 0;
                object.outgoingWindowSize = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = options.bytes === String ? $util.base64.encode(message.id, 0, message.id.length) : options.bytes === Array ? Array.prototype.slice.call(message.id) : message.id;
            if (message.timeout != null && message.hasOwnProperty("timeout"))
                object.timeout = message.timeout;
            if (message.incomingWindowSize != null && message.hasOwnProperty("incomingWindowSize"))
                object.incomingWindowSize = message.incomingWindowSize;
            if (message.outgoingWindowSize != null && message.hasOwnProperty("outgoingWindowSize"))
                object.outgoingWindowSize = message.outgoingWindowSize;
            return object;
        };

        /**
         * Converts this Channel to JSON.
         * @function toJSON
         * @memberof Greeting.Channel
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Channel.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Channel;
    })();

    return Greeting;
})();

$root.RequestHeader = (function() {

    /**
     * Properties of a RequestHeader.
     * @exports IRequestHeader
     * @interface IRequestHeader
     * @property {number|null} [sequenceNumber] RequestHeader sequenceNumber
     * @property {string|null} [serviceName] RequestHeader serviceName
     * @property {string|null} [methodName] RequestHeader methodName
     * @property {string|null} [fifoKey] RequestHeader fifoKey
     * @property {Object.<string,Uint8Array>|null} [extraData] RequestHeader extraData
     * @property {Uint8Array|null} [traceId] RequestHeader traceId
     * @property {number|null} [spanId] RequestHeader spanId
     */

    /**
     * Constructs a new RequestHeader.
     * @exports RequestHeader
     * @classdesc Represents a RequestHeader.
     * @implements IRequestHeader
     * @constructor
     * @param {IRequestHeader=} [properties] Properties to set
     */
    function RequestHeader(properties) {
        this.extraData = {};
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RequestHeader sequenceNumber.
     * @member {number} sequenceNumber
     * @memberof RequestHeader
     * @instance
     */
    RequestHeader.prototype.sequenceNumber = 0;

    /**
     * RequestHeader serviceName.
     * @member {string} serviceName
     * @memberof RequestHeader
     * @instance
     */
    RequestHeader.prototype.serviceName = "";

    /**
     * RequestHeader methodName.
     * @member {string} methodName
     * @memberof RequestHeader
     * @instance
     */
    RequestHeader.prototype.methodName = "";

    /**
     * RequestHeader fifoKey.
     * @member {string} fifoKey
     * @memberof RequestHeader
     * @instance
     */
    RequestHeader.prototype.fifoKey = "";

    /**
     * RequestHeader extraData.
     * @member {Object.<string,Uint8Array>} extraData
     * @memberof RequestHeader
     * @instance
     */
    RequestHeader.prototype.extraData = $util.emptyObject;

    /**
     * RequestHeader traceId.
     * @member {Uint8Array} traceId
     * @memberof RequestHeader
     * @instance
     */
    RequestHeader.prototype.traceId = $util.newBuffer([]);

    /**
     * RequestHeader spanId.
     * @member {number} spanId
     * @memberof RequestHeader
     * @instance
     */
    RequestHeader.prototype.spanId = 0;

    /**
     * Creates a new RequestHeader instance using the specified properties.
     * @function create
     * @memberof RequestHeader
     * @static
     * @param {IRequestHeader=} [properties] Properties to set
     * @returns {RequestHeader} RequestHeader instance
     */
    RequestHeader.create = function create(properties) {
        return new RequestHeader(properties);
    };

    /**
     * Encodes the specified RequestHeader message. Does not implicitly {@link RequestHeader.verify|verify} messages.
     * @function encode
     * @memberof RequestHeader
     * @static
     * @param {IRequestHeader} message RequestHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RequestHeader.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.sequenceNumber);
        if (message.serviceName != null && message.hasOwnProperty("serviceName"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.serviceName);
        if (message.methodName != null && message.hasOwnProperty("methodName"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.methodName);
        if (message.fifoKey != null && message.hasOwnProperty("fifoKey"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.fifoKey);
        if (message.extraData != null && message.hasOwnProperty("extraData"))
            for (var keys = Object.keys(message.extraData), i = 0; i < keys.length; ++i)
                writer.uint32(/* id 5, wireType 2 =*/42).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).bytes(message.extraData[keys[i]]).ldelim();
        if (message.traceId != null && message.hasOwnProperty("traceId"))
            writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.traceId);
        if (message.spanId != null && message.hasOwnProperty("spanId"))
            writer.uint32(/* id 7, wireType 0 =*/56).int32(message.spanId);
        return writer;
    };

    /**
     * Encodes the specified RequestHeader message, length delimited. Does not implicitly {@link RequestHeader.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RequestHeader
     * @static
     * @param {IRequestHeader} message RequestHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RequestHeader.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RequestHeader message from the specified reader or buffer.
     * @function decode
     * @memberof RequestHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RequestHeader} RequestHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RequestHeader.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RequestHeader(), key;
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.sequenceNumber = reader.int32();
                break;
            case 2:
                message.serviceName = reader.string();
                break;
            case 3:
                message.methodName = reader.string();
                break;
            case 4:
                message.fifoKey = reader.string();
                break;
            case 5:
                reader.skip().pos++;
                if (message.extraData === $util.emptyObject)
                    message.extraData = {};
                key = reader.string();
                reader.pos++;
                message.extraData[key] = reader.bytes();
                break;
            case 6:
                message.traceId = reader.bytes();
                break;
            case 7:
                message.spanId = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a RequestHeader message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RequestHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RequestHeader} RequestHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RequestHeader.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RequestHeader message.
     * @function verify
     * @memberof RequestHeader
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RequestHeader.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
            if (!$util.isInteger(message.sequenceNumber))
                return "sequenceNumber: integer expected";
        if (message.serviceName != null && message.hasOwnProperty("serviceName"))
            if (!$util.isString(message.serviceName))
                return "serviceName: string expected";
        if (message.methodName != null && message.hasOwnProperty("methodName"))
            if (!$util.isString(message.methodName))
                return "methodName: string expected";
        if (message.fifoKey != null && message.hasOwnProperty("fifoKey"))
            if (!$util.isString(message.fifoKey))
                return "fifoKey: string expected";
        if (message.extraData != null && message.hasOwnProperty("extraData")) {
            if (!$util.isObject(message.extraData))
                return "extraData: object expected";
            var key = Object.keys(message.extraData);
            for (var i = 0; i < key.length; ++i)
                if (!(message.extraData[key[i]] && typeof message.extraData[key[i]].length === "number" || $util.isString(message.extraData[key[i]])))
                    return "extraData: buffer{k:string} expected";
        }
        if (message.traceId != null && message.hasOwnProperty("traceId"))
            if (!(message.traceId && typeof message.traceId.length === "number" || $util.isString(message.traceId)))
                return "traceId: buffer expected";
        if (message.spanId != null && message.hasOwnProperty("spanId"))
            if (!$util.isInteger(message.spanId))
                return "spanId: integer expected";
        return null;
    };

    /**
     * Creates a RequestHeader message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RequestHeader
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RequestHeader} RequestHeader
     */
    RequestHeader.fromObject = function fromObject(object) {
        if (object instanceof $root.RequestHeader)
            return object;
        var message = new $root.RequestHeader();
        if (object.sequenceNumber != null)
            message.sequenceNumber = object.sequenceNumber | 0;
        if (object.serviceName != null)
            message.serviceName = String(object.serviceName);
        if (object.methodName != null)
            message.methodName = String(object.methodName);
        if (object.fifoKey != null)
            message.fifoKey = String(object.fifoKey);
        if (object.extraData) {
            if (typeof object.extraData !== "object")
                throw TypeError(".RequestHeader.extraData: object expected");
            message.extraData = {};
            for (var keys = Object.keys(object.extraData), i = 0; i < keys.length; ++i)
                if (typeof object.extraData[keys[i]] === "string")
                    $util.base64.decode(object.extraData[keys[i]], message.extraData[keys[i]] = $util.newBuffer($util.base64.length(object.extraData[keys[i]])), 0);
                else if (object.extraData[keys[i]].length)
                    message.extraData[keys[i]] = object.extraData[keys[i]];
        }
        if (object.traceId != null)
            if (typeof object.traceId === "string")
                $util.base64.decode(object.traceId, message.traceId = $util.newBuffer($util.base64.length(object.traceId)), 0);
            else if (object.traceId.length)
                message.traceId = object.traceId;
        if (object.spanId != null)
            message.spanId = object.spanId | 0;
        return message;
    };

    /**
     * Creates a plain object from a RequestHeader message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RequestHeader
     * @static
     * @param {RequestHeader} message RequestHeader
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RequestHeader.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.objects || options.defaults)
            object.extraData = {};
        if (options.defaults) {
            object.sequenceNumber = 0;
            object.serviceName = "";
            object.methodName = "";
            object.fifoKey = "";
            if (options.bytes === String)
                object.traceId = "";
            else {
                object.traceId = [];
                if (options.bytes !== Array)
                    object.traceId = $util.newBuffer(object.traceId);
            }
            object.spanId = 0;
        }
        if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
            object.sequenceNumber = message.sequenceNumber;
        if (message.serviceName != null && message.hasOwnProperty("serviceName"))
            object.serviceName = message.serviceName;
        if (message.methodName != null && message.hasOwnProperty("methodName"))
            object.methodName = message.methodName;
        if (message.fifoKey != null && message.hasOwnProperty("fifoKey"))
            object.fifoKey = message.fifoKey;
        var keys2;
        if (message.extraData && (keys2 = Object.keys(message.extraData)).length) {
            object.extraData = {};
            for (var j = 0; j < keys2.length; ++j)
                object.extraData[keys2[j]] = options.bytes === String ? $util.base64.encode(message.extraData[keys2[j]], 0, message.extraData[keys2[j]].length) : options.bytes === Array ? Array.prototype.slice.call(message.extraData[keys2[j]]) : message.extraData[keys2[j]];
        }
        if (message.traceId != null && message.hasOwnProperty("traceId"))
            object.traceId = options.bytes === String ? $util.base64.encode(message.traceId, 0, message.traceId.length) : options.bytes === Array ? Array.prototype.slice.call(message.traceId) : message.traceId;
        if (message.spanId != null && message.hasOwnProperty("spanId"))
            object.spanId = message.spanId;
        return object;
    };

    /**
     * Converts this RequestHeader to JSON.
     * @function toJSON
     * @memberof RequestHeader
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RequestHeader.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return RequestHeader;
})();

/**
 * ErrorCode enum.
 * @exports ErrorCode
 * @enum {string}
 * @property {number} ERROR_NO=0 ERROR_NO value
 * @property {number} ERROR_TOO_MANY_REQUESTS=1 ERROR_TOO_MANY_REQUESTS value
 * @property {number} ERROR_NOT_FOUND=2 ERROR_NOT_FOUND value
 * @property {number} ERROR_BAD_REQUEST=3 ERROR_BAD_REQUEST value
 * @property {number} ERROR_NOT_IMPLEMENTED=4 ERROR_NOT_IMPLEMENTED value
 * @property {number} ERROR_INTERNAL_SERVER=5 ERROR_INTERNAL_SERVER value
 * @property {number} ERROR_USER_DEFINED=10000 ERROR_USER_DEFINED value
 */
$root.ErrorCode = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "ERROR_NO"] = 0;
    values[valuesById[1] = "ERROR_TOO_MANY_REQUESTS"] = 1;
    values[valuesById[2] = "ERROR_NOT_FOUND"] = 2;
    values[valuesById[3] = "ERROR_BAD_REQUEST"] = 3;
    values[valuesById[4] = "ERROR_NOT_IMPLEMENTED"] = 4;
    values[valuesById[5] = "ERROR_INTERNAL_SERVER"] = 5;
    values[valuesById[10000] = "ERROR_USER_DEFINED"] = 10000;
    return values;
})();

$root.ResponseHeader = (function() {

    /**
     * Properties of a ResponseHeader.
     * @exports IResponseHeader
     * @interface IResponseHeader
     * @property {number|null} [sequenceNumber] ResponseHeader sequenceNumber
     * @property {number|null} [nextSpanId] ResponseHeader nextSpanId
     * @property {number|null} [errorCode] ResponseHeader errorCode
     * @property {string|null} [errorDesc] ResponseHeader errorDesc
     */

    /**
     * Constructs a new ResponseHeader.
     * @exports ResponseHeader
     * @classdesc Represents a ResponseHeader.
     * @implements IResponseHeader
     * @constructor
     * @param {IResponseHeader=} [properties] Properties to set
     */
    function ResponseHeader(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ResponseHeader sequenceNumber.
     * @member {number} sequenceNumber
     * @memberof ResponseHeader
     * @instance
     */
    ResponseHeader.prototype.sequenceNumber = 0;

    /**
     * ResponseHeader nextSpanId.
     * @member {number} nextSpanId
     * @memberof ResponseHeader
     * @instance
     */
    ResponseHeader.prototype.nextSpanId = 0;

    /**
     * ResponseHeader errorCode.
     * @member {number} errorCode
     * @memberof ResponseHeader
     * @instance
     */
    ResponseHeader.prototype.errorCode = 0;

    /**
     * ResponseHeader errorDesc.
     * @member {string} errorDesc
     * @memberof ResponseHeader
     * @instance
     */
    ResponseHeader.prototype.errorDesc = "";

    /**
     * Creates a new ResponseHeader instance using the specified properties.
     * @function create
     * @memberof ResponseHeader
     * @static
     * @param {IResponseHeader=} [properties] Properties to set
     * @returns {ResponseHeader} ResponseHeader instance
     */
    ResponseHeader.create = function create(properties) {
        return new ResponseHeader(properties);
    };

    /**
     * Encodes the specified ResponseHeader message. Does not implicitly {@link ResponseHeader.verify|verify} messages.
     * @function encode
     * @memberof ResponseHeader
     * @static
     * @param {IResponseHeader} message ResponseHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ResponseHeader.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.sequenceNumber);
        if (message.nextSpanId != null && message.hasOwnProperty("nextSpanId"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nextSpanId);
        if (message.errorCode != null && message.hasOwnProperty("errorCode"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.errorCode);
        if (message.errorDesc != null && message.hasOwnProperty("errorDesc"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.errorDesc);
        return writer;
    };

    /**
     * Encodes the specified ResponseHeader message, length delimited. Does not implicitly {@link ResponseHeader.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ResponseHeader
     * @static
     * @param {IResponseHeader} message ResponseHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ResponseHeader.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ResponseHeader message from the specified reader or buffer.
     * @function decode
     * @memberof ResponseHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ResponseHeader} ResponseHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ResponseHeader.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ResponseHeader();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.sequenceNumber = reader.int32();
                break;
            case 2:
                message.nextSpanId = reader.int32();
                break;
            case 3:
                message.errorCode = reader.int32();
                break;
            case 4:
                message.errorDesc = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ResponseHeader message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ResponseHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ResponseHeader} ResponseHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ResponseHeader.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ResponseHeader message.
     * @function verify
     * @memberof ResponseHeader
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ResponseHeader.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
            if (!$util.isInteger(message.sequenceNumber))
                return "sequenceNumber: integer expected";
        if (message.nextSpanId != null && message.hasOwnProperty("nextSpanId"))
            if (!$util.isInteger(message.nextSpanId))
                return "nextSpanId: integer expected";
        if (message.errorCode != null && message.hasOwnProperty("errorCode"))
            if (!$util.isInteger(message.errorCode))
                return "errorCode: integer expected";
        if (message.errorDesc != null && message.hasOwnProperty("errorDesc"))
            if (!$util.isString(message.errorDesc))
                return "errorDesc: string expected";
        return null;
    };

    /**
     * Creates a ResponseHeader message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ResponseHeader
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ResponseHeader} ResponseHeader
     */
    ResponseHeader.fromObject = function fromObject(object) {
        if (object instanceof $root.ResponseHeader)
            return object;
        var message = new $root.ResponseHeader();
        if (object.sequenceNumber != null)
            message.sequenceNumber = object.sequenceNumber | 0;
        if (object.nextSpanId != null)
            message.nextSpanId = object.nextSpanId | 0;
        if (object.errorCode != null)
            message.errorCode = object.errorCode | 0;
        if (object.errorDesc != null)
            message.errorDesc = String(object.errorDesc);
        return message;
    };

    /**
     * Creates a plain object from a ResponseHeader message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ResponseHeader
     * @static
     * @param {ResponseHeader} message ResponseHeader
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ResponseHeader.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.sequenceNumber = 0;
            object.nextSpanId = 0;
            object.errorCode = 0;
            object.errorDesc = "";
        }
        if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
            object.sequenceNumber = message.sequenceNumber;
        if (message.nextSpanId != null && message.hasOwnProperty("nextSpanId"))
            object.nextSpanId = message.nextSpanId;
        if (message.errorCode != null && message.hasOwnProperty("errorCode"))
            object.errorCode = message.errorCode;
        if (message.errorDesc != null && message.hasOwnProperty("errorDesc"))
            object.errorDesc = message.errorDesc;
        return object;
    };

    /**
     * Converts this ResponseHeader to JSON.
     * @function toJSON
     * @memberof ResponseHeader
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ResponseHeader.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ResponseHeader;
})();

$root.Heartbeat = (function() {

    /**
     * Properties of a Heartbeat.
     * @exports IHeartbeat
     * @interface IHeartbeat
     */

    /**
     * Constructs a new Heartbeat.
     * @exports Heartbeat
     * @classdesc Represents a Heartbeat.
     * @implements IHeartbeat
     * @constructor
     * @param {IHeartbeat=} [properties] Properties to set
     */
    function Heartbeat(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Creates a new Heartbeat instance using the specified properties.
     * @function create
     * @memberof Heartbeat
     * @static
     * @param {IHeartbeat=} [properties] Properties to set
     * @returns {Heartbeat} Heartbeat instance
     */
    Heartbeat.create = function create(properties) {
        return new Heartbeat(properties);
    };

    /**
     * Encodes the specified Heartbeat message. Does not implicitly {@link Heartbeat.verify|verify} messages.
     * @function encode
     * @memberof Heartbeat
     * @static
     * @param {IHeartbeat} message Heartbeat message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Heartbeat.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        return writer;
    };

    /**
     * Encodes the specified Heartbeat message, length delimited. Does not implicitly {@link Heartbeat.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Heartbeat
     * @static
     * @param {IHeartbeat} message Heartbeat message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Heartbeat.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Heartbeat message from the specified reader or buffer.
     * @function decode
     * @memberof Heartbeat
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Heartbeat} Heartbeat
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Heartbeat.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Heartbeat();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Heartbeat message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Heartbeat
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Heartbeat} Heartbeat
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Heartbeat.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Heartbeat message.
     * @function verify
     * @memberof Heartbeat
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Heartbeat.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        return null;
    };

    /**
     * Creates a Heartbeat message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Heartbeat
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Heartbeat} Heartbeat
     */
    Heartbeat.fromObject = function fromObject(object) {
        if (object instanceof $root.Heartbeat)
            return object;
        return new $root.Heartbeat();
    };

    /**
     * Creates a plain object from a Heartbeat message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Heartbeat
     * @static
     * @param {Heartbeat} message Heartbeat
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Heartbeat.toObject = function toObject() {
        return {};
    };

    /**
     * Converts this Heartbeat to JSON.
     * @function toJSON
     * @memberof Heartbeat
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Heartbeat.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Heartbeat;
})();

module.exports = $root;

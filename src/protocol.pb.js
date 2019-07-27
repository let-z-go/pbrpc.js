/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.pbrpc = (function() {

    /**
     * Namespace pbrpc.
     * @exports pbrpc
     * @namespace
     */
    var pbrpc = {};

    pbrpc.protocol = (function() {

        /**
         * Namespace protocol.
         * @memberof pbrpc
         * @namespace
         */
        var protocol = {};

        /**
         * MessageType enum.
         * @name pbrpc.protocol.MessageType
         * @enum {string}
         * @property {number} MESSAGE_REQUEST=0 MESSAGE_REQUEST value
         * @property {number} MESSAGE_RESPONSE=1 MESSAGE_RESPONSE value
         * @property {number} MESSAGE_HEARTBEAT=2 MESSAGE_HEARTBEAT value
         */
        protocol.MessageType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "MESSAGE_REQUEST"] = 0;
            values[valuesById[1] = "MESSAGE_RESPONSE"] = 1;
            values[valuesById[2] = "MESSAGE_HEARTBEAT"] = 2;
            return values;
        })();

        protocol.Greeting = (function() {

            /**
             * Properties of a Greeting.
             * @memberof pbrpc.protocol
             * @interface IGreeting
             * @property {pbrpc.protocol.Greeting.IChannel|null} [channel] Greeting channel
             * @property {Uint8Array|null} [handshake] Greeting handshake
             */

            /**
             * Constructs a new Greeting.
             * @memberof pbrpc.protocol
             * @classdesc Represents a Greeting.
             * @implements IGreeting
             * @constructor
             * @param {pbrpc.protocol.IGreeting=} [properties] Properties to set
             */
            function Greeting(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Greeting channel.
             * @member {pbrpc.protocol.Greeting.IChannel|null|undefined} channel
             * @memberof pbrpc.protocol.Greeting
             * @instance
             */
            Greeting.prototype.channel = null;

            /**
             * Greeting handshake.
             * @member {Uint8Array} handshake
             * @memberof pbrpc.protocol.Greeting
             * @instance
             */
            Greeting.prototype.handshake = $util.newBuffer([]);

            /**
             * Creates a new Greeting instance using the specified properties.
             * @function create
             * @memberof pbrpc.protocol.Greeting
             * @static
             * @param {pbrpc.protocol.IGreeting=} [properties] Properties to set
             * @returns {pbrpc.protocol.Greeting} Greeting instance
             */
            Greeting.create = function create(properties) {
                return new Greeting(properties);
            };

            /**
             * Encodes the specified Greeting message. Does not implicitly {@link pbrpc.protocol.Greeting.verify|verify} messages.
             * @function encode
             * @memberof pbrpc.protocol.Greeting
             * @static
             * @param {pbrpc.protocol.IGreeting} message Greeting message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Greeting.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.channel != null && message.hasOwnProperty("channel"))
                    $root.pbrpc.protocol.Greeting.Channel.encode(message.channel, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.handshake != null && message.hasOwnProperty("handshake"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.handshake);
                return writer;
            };

            /**
             * Encodes the specified Greeting message, length delimited. Does not implicitly {@link pbrpc.protocol.Greeting.verify|verify} messages.
             * @function encodeDelimited
             * @memberof pbrpc.protocol.Greeting
             * @static
             * @param {pbrpc.protocol.IGreeting} message Greeting message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Greeting.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Greeting message from the specified reader or buffer.
             * @function decode
             * @memberof pbrpc.protocol.Greeting
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {pbrpc.protocol.Greeting} Greeting
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Greeting.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.pbrpc.protocol.Greeting();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.channel = $root.pbrpc.protocol.Greeting.Channel.decode(reader, reader.uint32());
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
             * @memberof pbrpc.protocol.Greeting
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {pbrpc.protocol.Greeting} Greeting
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
             * @memberof pbrpc.protocol.Greeting
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Greeting.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.channel != null && message.hasOwnProperty("channel")) {
                    var error = $root.pbrpc.protocol.Greeting.Channel.verify(message.channel);
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
             * @memberof pbrpc.protocol.Greeting
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {pbrpc.protocol.Greeting} Greeting
             */
            Greeting.fromObject = function fromObject(object) {
                if (object instanceof $root.pbrpc.protocol.Greeting)
                    return object;
                var message = new $root.pbrpc.protocol.Greeting();
                if (object.channel != null) {
                    if (typeof object.channel !== "object")
                        throw TypeError(".pbrpc.protocol.Greeting.channel: object expected");
                    message.channel = $root.pbrpc.protocol.Greeting.Channel.fromObject(object.channel);
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
             * @memberof pbrpc.protocol.Greeting
             * @static
             * @param {pbrpc.protocol.Greeting} message Greeting
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
                    object.channel = $root.pbrpc.protocol.Greeting.Channel.toObject(message.channel, options);
                if (message.handshake != null && message.hasOwnProperty("handshake"))
                    object.handshake = options.bytes === String ? $util.base64.encode(message.handshake, 0, message.handshake.length) : options.bytes === Array ? Array.prototype.slice.call(message.handshake) : message.handshake;
                return object;
            };

            /**
             * Converts this Greeting to JSON.
             * @function toJSON
             * @memberof pbrpc.protocol.Greeting
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Greeting.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            Greeting.Channel = (function() {

                /**
                 * Properties of a Channel.
                 * @memberof pbrpc.protocol.Greeting
                 * @interface IChannel
                 * @property {Uint8Array|null} [id] Channel id
                 * @property {number|null} [timeout] Channel timeout
                 * @property {number|null} [incomingWindowSize] Channel incomingWindowSize
                 * @property {number|null} [outgoingWindowSize] Channel outgoingWindowSize
                 */

                /**
                 * Constructs a new Channel.
                 * @memberof pbrpc.protocol.Greeting
                 * @classdesc Represents a Channel.
                 * @implements IChannel
                 * @constructor
                 * @param {pbrpc.protocol.Greeting.IChannel=} [properties] Properties to set
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
                 * @memberof pbrpc.protocol.Greeting.Channel
                 * @instance
                 */
                Channel.prototype.id = $util.newBuffer([]);

                /**
                 * Channel timeout.
                 * @member {number} timeout
                 * @memberof pbrpc.protocol.Greeting.Channel
                 * @instance
                 */
                Channel.prototype.timeout = 0;

                /**
                 * Channel incomingWindowSize.
                 * @member {number} incomingWindowSize
                 * @memberof pbrpc.protocol.Greeting.Channel
                 * @instance
                 */
                Channel.prototype.incomingWindowSize = 0;

                /**
                 * Channel outgoingWindowSize.
                 * @member {number} outgoingWindowSize
                 * @memberof pbrpc.protocol.Greeting.Channel
                 * @instance
                 */
                Channel.prototype.outgoingWindowSize = 0;

                /**
                 * Creates a new Channel instance using the specified properties.
                 * @function create
                 * @memberof pbrpc.protocol.Greeting.Channel
                 * @static
                 * @param {pbrpc.protocol.Greeting.IChannel=} [properties] Properties to set
                 * @returns {pbrpc.protocol.Greeting.Channel} Channel instance
                 */
                Channel.create = function create(properties) {
                    return new Channel(properties);
                };

                /**
                 * Encodes the specified Channel message. Does not implicitly {@link pbrpc.protocol.Greeting.Channel.verify|verify} messages.
                 * @function encode
                 * @memberof pbrpc.protocol.Greeting.Channel
                 * @static
                 * @param {pbrpc.protocol.Greeting.IChannel} message Channel message or plain object to encode
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
                 * Encodes the specified Channel message, length delimited. Does not implicitly {@link pbrpc.protocol.Greeting.Channel.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof pbrpc.protocol.Greeting.Channel
                 * @static
                 * @param {pbrpc.protocol.Greeting.IChannel} message Channel message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Channel.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Channel message from the specified reader or buffer.
                 * @function decode
                 * @memberof pbrpc.protocol.Greeting.Channel
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {pbrpc.protocol.Greeting.Channel} Channel
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Channel.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.pbrpc.protocol.Greeting.Channel();
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
                 * @memberof pbrpc.protocol.Greeting.Channel
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {pbrpc.protocol.Greeting.Channel} Channel
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
                 * @memberof pbrpc.protocol.Greeting.Channel
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
                 * @memberof pbrpc.protocol.Greeting.Channel
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {pbrpc.protocol.Greeting.Channel} Channel
                 */
                Channel.fromObject = function fromObject(object) {
                    if (object instanceof $root.pbrpc.protocol.Greeting.Channel)
                        return object;
                    var message = new $root.pbrpc.protocol.Greeting.Channel();
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
                 * @memberof pbrpc.protocol.Greeting.Channel
                 * @static
                 * @param {pbrpc.protocol.Greeting.Channel} message Channel
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
                 * @memberof pbrpc.protocol.Greeting.Channel
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

        protocol.RequestHeader = (function() {

            /**
             * Properties of a RequestHeader.
             * @memberof pbrpc.protocol
             * @interface IRequestHeader
             * @property {number|null} [sequenceNumber] RequestHeader sequenceNumber
             * @property {Uint8Array|null} [id] RequestHeader id
             * @property {string|null} [serviceName] RequestHeader serviceName
             * @property {string|null} [methodName] RequestHeader methodName
             * @property {string|null} [resourceId] RequestHeader resourceId
             * @property {Object.<string,Uint8Array>|null} [extraData] RequestHeader extraData
             */

            /**
             * Constructs a new RequestHeader.
             * @memberof pbrpc.protocol
             * @classdesc Represents a RequestHeader.
             * @implements IRequestHeader
             * @constructor
             * @param {pbrpc.protocol.IRequestHeader=} [properties] Properties to set
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
             * @memberof pbrpc.protocol.RequestHeader
             * @instance
             */
            RequestHeader.prototype.sequenceNumber = 0;

            /**
             * RequestHeader id.
             * @member {Uint8Array} id
             * @memberof pbrpc.protocol.RequestHeader
             * @instance
             */
            RequestHeader.prototype.id = $util.newBuffer([]);

            /**
             * RequestHeader serviceName.
             * @member {string} serviceName
             * @memberof pbrpc.protocol.RequestHeader
             * @instance
             */
            RequestHeader.prototype.serviceName = "";

            /**
             * RequestHeader methodName.
             * @member {string} methodName
             * @memberof pbrpc.protocol.RequestHeader
             * @instance
             */
            RequestHeader.prototype.methodName = "";

            /**
             * RequestHeader resourceId.
             * @member {string} resourceId
             * @memberof pbrpc.protocol.RequestHeader
             * @instance
             */
            RequestHeader.prototype.resourceId = "";

            /**
             * RequestHeader extraData.
             * @member {Object.<string,Uint8Array>} extraData
             * @memberof pbrpc.protocol.RequestHeader
             * @instance
             */
            RequestHeader.prototype.extraData = $util.emptyObject;

            /**
             * Creates a new RequestHeader instance using the specified properties.
             * @function create
             * @memberof pbrpc.protocol.RequestHeader
             * @static
             * @param {pbrpc.protocol.IRequestHeader=} [properties] Properties to set
             * @returns {pbrpc.protocol.RequestHeader} RequestHeader instance
             */
            RequestHeader.create = function create(properties) {
                return new RequestHeader(properties);
            };

            /**
             * Encodes the specified RequestHeader message. Does not implicitly {@link pbrpc.protocol.RequestHeader.verify|verify} messages.
             * @function encode
             * @memberof pbrpc.protocol.RequestHeader
             * @static
             * @param {pbrpc.protocol.IRequestHeader} message RequestHeader message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RequestHeader.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.sequenceNumber);
                if (message.id != null && message.hasOwnProperty("id"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.id);
                if (message.serviceName != null && message.hasOwnProperty("serviceName"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.serviceName);
                if (message.methodName != null && message.hasOwnProperty("methodName"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.methodName);
                if (message.resourceId != null && message.hasOwnProperty("resourceId"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.resourceId);
                if (message.extraData != null && message.hasOwnProperty("extraData"))
                    for (var keys = Object.keys(message.extraData), i = 0; i < keys.length; ++i)
                        writer.uint32(/* id 6, wireType 2 =*/50).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).bytes(message.extraData[keys[i]]).ldelim();
                return writer;
            };

            /**
             * Encodes the specified RequestHeader message, length delimited. Does not implicitly {@link pbrpc.protocol.RequestHeader.verify|verify} messages.
             * @function encodeDelimited
             * @memberof pbrpc.protocol.RequestHeader
             * @static
             * @param {pbrpc.protocol.IRequestHeader} message RequestHeader message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RequestHeader.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RequestHeader message from the specified reader or buffer.
             * @function decode
             * @memberof pbrpc.protocol.RequestHeader
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {pbrpc.protocol.RequestHeader} RequestHeader
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RequestHeader.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.pbrpc.protocol.RequestHeader(), key;
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.sequenceNumber = reader.int32();
                        break;
                    case 2:
                        message.id = reader.bytes();
                        break;
                    case 3:
                        message.serviceName = reader.string();
                        break;
                    case 4:
                        message.methodName = reader.string();
                        break;
                    case 5:
                        message.resourceId = reader.string();
                        break;
                    case 6:
                        reader.skip().pos++;
                        if (message.extraData === $util.emptyObject)
                            message.extraData = {};
                        key = reader.string();
                        reader.pos++;
                        message.extraData[key] = reader.bytes();
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
             * @memberof pbrpc.protocol.RequestHeader
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {pbrpc.protocol.RequestHeader} RequestHeader
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
             * @memberof pbrpc.protocol.RequestHeader
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
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!(message.id && typeof message.id.length === "number" || $util.isString(message.id)))
                        return "id: buffer expected";
                if (message.serviceName != null && message.hasOwnProperty("serviceName"))
                    if (!$util.isString(message.serviceName))
                        return "serviceName: string expected";
                if (message.methodName != null && message.hasOwnProperty("methodName"))
                    if (!$util.isString(message.methodName))
                        return "methodName: string expected";
                if (message.resourceId != null && message.hasOwnProperty("resourceId"))
                    if (!$util.isString(message.resourceId))
                        return "resourceId: string expected";
                if (message.extraData != null && message.hasOwnProperty("extraData")) {
                    if (!$util.isObject(message.extraData))
                        return "extraData: object expected";
                    var key = Object.keys(message.extraData);
                    for (var i = 0; i < key.length; ++i)
                        if (!(message.extraData[key[i]] && typeof message.extraData[key[i]].length === "number" || $util.isString(message.extraData[key[i]])))
                            return "extraData: buffer{k:string} expected";
                }
                return null;
            };

            /**
             * Creates a RequestHeader message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof pbrpc.protocol.RequestHeader
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {pbrpc.protocol.RequestHeader} RequestHeader
             */
            RequestHeader.fromObject = function fromObject(object) {
                if (object instanceof $root.pbrpc.protocol.RequestHeader)
                    return object;
                var message = new $root.pbrpc.protocol.RequestHeader();
                if (object.sequenceNumber != null)
                    message.sequenceNumber = object.sequenceNumber | 0;
                if (object.id != null)
                    if (typeof object.id === "string")
                        $util.base64.decode(object.id, message.id = $util.newBuffer($util.base64.length(object.id)), 0);
                    else if (object.id.length)
                        message.id = object.id;
                if (object.serviceName != null)
                    message.serviceName = String(object.serviceName);
                if (object.methodName != null)
                    message.methodName = String(object.methodName);
                if (object.resourceId != null)
                    message.resourceId = String(object.resourceId);
                if (object.extraData) {
                    if (typeof object.extraData !== "object")
                        throw TypeError(".pbrpc.protocol.RequestHeader.extraData: object expected");
                    message.extraData = {};
                    for (var keys = Object.keys(object.extraData), i = 0; i < keys.length; ++i)
                        if (typeof object.extraData[keys[i]] === "string")
                            $util.base64.decode(object.extraData[keys[i]], message.extraData[keys[i]] = $util.newBuffer($util.base64.length(object.extraData[keys[i]])), 0);
                        else if (object.extraData[keys[i]].length)
                            message.extraData[keys[i]] = object.extraData[keys[i]];
                }
                return message;
            };

            /**
             * Creates a plain object from a RequestHeader message. Also converts values to other types if specified.
             * @function toObject
             * @memberof pbrpc.protocol.RequestHeader
             * @static
             * @param {pbrpc.protocol.RequestHeader} message RequestHeader
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
                    if (options.bytes === String)
                        object.id = "";
                    else {
                        object.id = [];
                        if (options.bytes !== Array)
                            object.id = $util.newBuffer(object.id);
                    }
                    object.serviceName = "";
                    object.methodName = "";
                    object.resourceId = "";
                }
                if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                    object.sequenceNumber = message.sequenceNumber;
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = options.bytes === String ? $util.base64.encode(message.id, 0, message.id.length) : options.bytes === Array ? Array.prototype.slice.call(message.id) : message.id;
                if (message.serviceName != null && message.hasOwnProperty("serviceName"))
                    object.serviceName = message.serviceName;
                if (message.methodName != null && message.hasOwnProperty("methodName"))
                    object.methodName = message.methodName;
                if (message.resourceId != null && message.hasOwnProperty("resourceId"))
                    object.resourceId = message.resourceId;
                var keys2;
                if (message.extraData && (keys2 = Object.keys(message.extraData)).length) {
                    object.extraData = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.extraData[keys2[j]] = options.bytes === String ? $util.base64.encode(message.extraData[keys2[j]], 0, message.extraData[keys2[j]].length) : options.bytes === Array ? Array.prototype.slice.call(message.extraData[keys2[j]]) : message.extraData[keys2[j]];
                }
                return object;
            };

            /**
             * Converts this RequestHeader to JSON.
             * @function toJSON
             * @memberof pbrpc.protocol.RequestHeader
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
         * @name pbrpc.protocol.ErrorCode
         * @enum {string}
         * @property {number} ERROR_NO=0 ERROR_NO value
         * @property {number} ERROR_TOO_MANY_REQUESTS=1 ERROR_TOO_MANY_REQUESTS value
         * @property {number} ERROR_NOT_FOUND=2 ERROR_NOT_FOUND value
         * @property {number} ERROR_BAD_REQUEST=3 ERROR_BAD_REQUEST value
         * @property {number} ERROR_NOT_IMPLEMENTED=4 ERROR_NOT_IMPLEMENTED value
         * @property {number} ERROR_INTERNAL_SERVER=5 ERROR_INTERNAL_SERVER value
         * @property {number} ERROR_USER_DEFINED=10000 ERROR_USER_DEFINED value
         */
        protocol.ErrorCode = (function() {
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

        protocol.ResponseHeader = (function() {

            /**
             * Properties of a ResponseHeader.
             * @memberof pbrpc.protocol
             * @interface IResponseHeader
             * @property {number|null} [sequenceNumber] ResponseHeader sequenceNumber
             * @property {number|null} [errorCode] ResponseHeader errorCode
             * @property {string|null} [errorDesc] ResponseHeader errorDesc
             */

            /**
             * Constructs a new ResponseHeader.
             * @memberof pbrpc.protocol
             * @classdesc Represents a ResponseHeader.
             * @implements IResponseHeader
             * @constructor
             * @param {pbrpc.protocol.IResponseHeader=} [properties] Properties to set
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
             * @memberof pbrpc.protocol.ResponseHeader
             * @instance
             */
            ResponseHeader.prototype.sequenceNumber = 0;

            /**
             * ResponseHeader errorCode.
             * @member {number} errorCode
             * @memberof pbrpc.protocol.ResponseHeader
             * @instance
             */
            ResponseHeader.prototype.errorCode = 0;

            /**
             * ResponseHeader errorDesc.
             * @member {string} errorDesc
             * @memberof pbrpc.protocol.ResponseHeader
             * @instance
             */
            ResponseHeader.prototype.errorDesc = "";

            /**
             * Creates a new ResponseHeader instance using the specified properties.
             * @function create
             * @memberof pbrpc.protocol.ResponseHeader
             * @static
             * @param {pbrpc.protocol.IResponseHeader=} [properties] Properties to set
             * @returns {pbrpc.protocol.ResponseHeader} ResponseHeader instance
             */
            ResponseHeader.create = function create(properties) {
                return new ResponseHeader(properties);
            };

            /**
             * Encodes the specified ResponseHeader message. Does not implicitly {@link pbrpc.protocol.ResponseHeader.verify|verify} messages.
             * @function encode
             * @memberof pbrpc.protocol.ResponseHeader
             * @static
             * @param {pbrpc.protocol.IResponseHeader} message ResponseHeader message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ResponseHeader.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.sequenceNumber);
                if (message.errorCode != null && message.hasOwnProperty("errorCode"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.errorCode);
                if (message.errorDesc != null && message.hasOwnProperty("errorDesc"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.errorDesc);
                return writer;
            };

            /**
             * Encodes the specified ResponseHeader message, length delimited. Does not implicitly {@link pbrpc.protocol.ResponseHeader.verify|verify} messages.
             * @function encodeDelimited
             * @memberof pbrpc.protocol.ResponseHeader
             * @static
             * @param {pbrpc.protocol.IResponseHeader} message ResponseHeader message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ResponseHeader.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ResponseHeader message from the specified reader or buffer.
             * @function decode
             * @memberof pbrpc.protocol.ResponseHeader
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {pbrpc.protocol.ResponseHeader} ResponseHeader
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ResponseHeader.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.pbrpc.protocol.ResponseHeader();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.sequenceNumber = reader.int32();
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
             * @memberof pbrpc.protocol.ResponseHeader
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {pbrpc.protocol.ResponseHeader} ResponseHeader
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
             * @memberof pbrpc.protocol.ResponseHeader
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
             * @memberof pbrpc.protocol.ResponseHeader
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {pbrpc.protocol.ResponseHeader} ResponseHeader
             */
            ResponseHeader.fromObject = function fromObject(object) {
                if (object instanceof $root.pbrpc.protocol.ResponseHeader)
                    return object;
                var message = new $root.pbrpc.protocol.ResponseHeader();
                if (object.sequenceNumber != null)
                    message.sequenceNumber = object.sequenceNumber | 0;
                if (object.errorCode != null)
                    message.errorCode = object.errorCode | 0;
                if (object.errorDesc != null)
                    message.errorDesc = String(object.errorDesc);
                return message;
            };

            /**
             * Creates a plain object from a ResponseHeader message. Also converts values to other types if specified.
             * @function toObject
             * @memberof pbrpc.protocol.ResponseHeader
             * @static
             * @param {pbrpc.protocol.ResponseHeader} message ResponseHeader
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ResponseHeader.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.sequenceNumber = 0;
                    object.errorCode = 0;
                    object.errorDesc = "";
                }
                if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                    object.sequenceNumber = message.sequenceNumber;
                if (message.errorCode != null && message.hasOwnProperty("errorCode"))
                    object.errorCode = message.errorCode;
                if (message.errorDesc != null && message.hasOwnProperty("errorDesc"))
                    object.errorDesc = message.errorDesc;
                return object;
            };

            /**
             * Converts this ResponseHeader to JSON.
             * @function toJSON
             * @memberof pbrpc.protocol.ResponseHeader
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ResponseHeader.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return ResponseHeader;
        })();

        protocol.Heartbeat = (function() {

            /**
             * Properties of a Heartbeat.
             * @memberof pbrpc.protocol
             * @interface IHeartbeat
             */

            /**
             * Constructs a new Heartbeat.
             * @memberof pbrpc.protocol
             * @classdesc Represents a Heartbeat.
             * @implements IHeartbeat
             * @constructor
             * @param {pbrpc.protocol.IHeartbeat=} [properties] Properties to set
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
             * @memberof pbrpc.protocol.Heartbeat
             * @static
             * @param {pbrpc.protocol.IHeartbeat=} [properties] Properties to set
             * @returns {pbrpc.protocol.Heartbeat} Heartbeat instance
             */
            Heartbeat.create = function create(properties) {
                return new Heartbeat(properties);
            };

            /**
             * Encodes the specified Heartbeat message. Does not implicitly {@link pbrpc.protocol.Heartbeat.verify|verify} messages.
             * @function encode
             * @memberof pbrpc.protocol.Heartbeat
             * @static
             * @param {pbrpc.protocol.IHeartbeat} message Heartbeat message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Heartbeat.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified Heartbeat message, length delimited. Does not implicitly {@link pbrpc.protocol.Heartbeat.verify|verify} messages.
             * @function encodeDelimited
             * @memberof pbrpc.protocol.Heartbeat
             * @static
             * @param {pbrpc.protocol.IHeartbeat} message Heartbeat message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Heartbeat.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Heartbeat message from the specified reader or buffer.
             * @function decode
             * @memberof pbrpc.protocol.Heartbeat
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {pbrpc.protocol.Heartbeat} Heartbeat
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Heartbeat.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.pbrpc.protocol.Heartbeat();
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
             * @memberof pbrpc.protocol.Heartbeat
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {pbrpc.protocol.Heartbeat} Heartbeat
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
             * @memberof pbrpc.protocol.Heartbeat
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
             * @memberof pbrpc.protocol.Heartbeat
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {pbrpc.protocol.Heartbeat} Heartbeat
             */
            Heartbeat.fromObject = function fromObject(object) {
                if (object instanceof $root.pbrpc.protocol.Heartbeat)
                    return object;
                return new $root.pbrpc.protocol.Heartbeat();
            };

            /**
             * Creates a plain object from a Heartbeat message. Also converts values to other types if specified.
             * @function toObject
             * @memberof pbrpc.protocol.Heartbeat
             * @static
             * @param {pbrpc.protocol.Heartbeat} message Heartbeat
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Heartbeat.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this Heartbeat to JSON.
             * @function toJSON
             * @memberof pbrpc.protocol.Heartbeat
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Heartbeat.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Heartbeat;
        })();

        return protocol;
    })();

    return pbrpc;
})();

module.exports = $root;

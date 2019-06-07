"use strict";

var protocol = require("./protocol.pb");

var UUID = require("./uuid").UUID;
var Transport = require("./transport").Transport;
var Queue = require("./queue").Queue;

var defaultChannelTimeout = 45000;
var minChannelWindowSize = 1;
var maxChannelWindowSize = 1 << 20;

var minChannelReconnectionDelay = 600;
var maxChannelReconnectionDelay = 15000;

var errorChannelBroken = -1;
var errorChannelClosed = -2;
var errorTooManyRequests = protocol.ErrorCode.ERROR_TOO_MANY_REQUESTS;
var errorNotFound = protocol.ErrorCode.ERROR_NOT_FOUND;
var errorBadRequest = protocol.ErrorCode.ERROR_BAD_REQUEST;
var errorNotImplemented = protocol.ErrorCode.ERROR_NOT_IMPLEMENTED;
var errorInternalServer = protocol.ErrorCode.ERROR_INTERNAL_SERVER;
var errorUserDefined = protocol.ErrorCode.ERROR_USER_DEFINED;

function Channel(serverAddress, handshaker) {
    if (handshaker == undefined) {
        handshaker = function(greeter) {
            greeter(new Uint8Array(0), function(handshake) {
                return true;
            });
        };
    }

    this.serverAddress = serverAddress;
    this.handshaker = handshaker;
    this.serviceHandlers = {};
    this.isConnected = false;
    this.autoReconnect = true;
    this.id = new UUID();
    this.timeout = defaultChannelTimeout;
    this.incomingWindowSize = maxChannelWindowSize;
    this.outgoingWindowSize = maxChannelWindowSize;
    this.nextSequenceNumber = 0;
    this.connect(0);
    this.heartbeatReadTimeout = null;
    this.heartbeatWriteTimeout = null;

    this.methodCalls = new Queue(minChannelWindowSize, function(methodCalls) {
        var resultReturns = this.resultReturns.removeNodes();
        this.sendMessages(methodCalls, resultReturns);
    }.bind(this));

    this.pendingMethodCalls = {};
    this.pendingResultReturnCount = 0;

    this.resultReturns = new Queue(0x7FFFFFFF, function(resultReturns) {
        var methodCalls = this.methodCalls.removeNodes();
        this.sendMessages(methodCalls, resultReturns);
    }.bind(this));
}

Channel.prototype.registerServiceHandler = function(serviceHandler) {
    this.serviceHandlers[serviceHandler.name] = serviceHandler;
};

Channel.prototype.close = function() {
    this.autoReconnect = false;
    this.transport.close();
};

Channel.prototype.callMethod = function(serviceName, methodName, resourceID, extraData, requestPayloadData, autoRetryMethodCall, callback) {
    var context = {
        serviceName: serviceName,
        methodName: methodName,
        resourceID: resourceID,
        extraData: extraData,
        traceID: UUID.v4(),
        spanParentID: 0,
        spanID: 1,
    };

    if (!this.isConnected && !this.autoReconnect) {
        var error = new MyError(errorChannelClosed);
        setTimeout(callback.bind(null, error, null), 0);
        return context;
    }

    if (callback == null) {
        callback = function(error, responsePayloadData) {};
    }

    this.methodCalls.appendNode({
        serviceName: context.serviceName,
        methodName: context.methodName,
        resourceID: context.resourceID,
        extraData: context.extraData,
        traceID: context.traceID,
        spanID: context.spanID,
        requestPayloadData: requestPayloadData,
        autoRetry: autoRetryMethodCall,
        callback: callback,
    });

    return context
};

Channel.prototype.connect = function(reconnectionDelay) {
    var greeter = function(handshake, greeterCallback2) {
        console.info("[pbrpc] connecting to [%s]...", this.serverAddress)
        var transport = new Transport(this.serverAddress);
        this.transport = transport;
        var greeterCallback = null;

        transport.onConnect = function() {
            var greeting = {
                channel: {
                    timeout: this.timeout,
                    incomingWindowSize: this.incomingWindowSize,
                    outgoingWindowSize: this.outgoingWindowSize,
                },

                handshake: handshake,
            };

            if (!this.id.isZero()) {
                greeting.channel.id = this.id.bytes;
            }

            var greetingData = protocol.Greeting.encode(greeting).finish();
            this.transport.write(greetingData);
            greeterCallback = greeterCallback2;
        }.bind(this);

        transport.onDisconnect = function() {
            if (this.autoReconnect) {
                if (this.isConnected) {
                    this.methodCalls.suspendNodeProcessor();
                    var methodCalls = [];
                    var completedMethodCallCount = 0;

                    Object.keys(this.pendingMethodCalls).forEach(function(sequenceNumber) {
                        var methodCall = this.pendingMethodCalls[sequenceNumber];

                        if (methodCall.autoRetry) {
                            methodCalls.push(methodCall);
                        } else {
                            var error = new MyError(errorChannelBroken);
                            setTimeout(methodCall.callback.bind(null, error, null), 0);
                            ++completedMethodCallCount;
                        }
                    }.bind(this));

                    methodCalls.sort(function (methodCall1, methodCall2) {
                        var x = methodCall1.sequenceNumber;
                        var y = methodCall2.sequenceNumber;
                        var z = Math.abs(x - y) & 0x40000000;
                        x ^= z;
                        y ^= z;
                        return x - y;
                    });

                    this.methodCalls.discardNodeRemovals(methodCalls);
                    this.methodCalls.commitNodeRemovals(completedMethodCallCount);
                }
            } else {
                var allMethodCalls = this.methodCalls.reset();

                allMethodCalls.forEach(function(methodCall) {
                    var error = new MyError(errorChannelClosed);
                    setTimeout(methodCall.callback.bind(null, error, null), 0);
                });

                Object.keys(this.pendingMethodCalls).forEach(function(sequenceNumber) {
                    var methodCall = this.pendingMethodCalls[sequenceNumber];
                    var error;

                    if (methodCall.autoRetry) {
                        error = new MyError(errorChannelClosed);
                    } else {
                        error = new MyError(errorChannelBroken);
                    }

                    setTimeout(methodCall.callback.bind(null, error, null), 0);
                }.bind(this));
            }

            if (this.isConnected) {
                clearTimeout(this.heartbeatReadTimeout);
                this.heartbeatReadTimeout = null;
                clearTimeout(this.heartbeatWriteTimeout);
                this.heartbeatWriteTimeout = null;
                this.pendingMethodCalls = {};
                this.pendingResultReturnCount = 0;
                this.resultReturns.suspendNodeProcessor();
                this.resultReturns = this.resultReturns.renew();
                console.info("[pbrpc] disconnected from [%s].", this.serverAddress)
                setTimeout(this.onDisconnect.bind(this, this.autoReconnect), 0);
            }

            if (this.autoReconnect) {
                if (this.isConnected) {
                    this.isConnected = false;
                    this.connect(0);
                } else {
                    if (reconnectionDelay == 0) {
                        reconnectionDelay = minChannelReconnectionDelay;
                    } else {
                        reconnectionDelay *= 2;

                        if (reconnectionDelay > maxChannelReconnectionDelay) {
                            reconnectionDelay = maxChannelReconnectionDelay;
                        }
                    }

                    var factor = 2/3 + (3/2 - 2/3) * Math.random();

                    setTimeout(function() {
                        this.connect(reconnectionDelay);
                    }.bind(this), factor * reconnectionDelay);
                }
            }
        }.bind(this);

        transport.onWrite = function(data) {
            if (this.isConnected) {
                this.receiveMessages(data);
            } else {
                var greeting = protocol.Greeting.decode(data[0]);

                if (!greeterCallback(greeting.handshake)) {
                    this.close();
                    return;
                }

                var outgoingWindowSize;

                if (this.id.isZero()) {
                    outgoingWindowSize = minChannelWindowSize;
                } else {
                    outgoingWindowSize = this.outgoingWindowSize;
                }

                this.id = UUID.fromBytes(greeting.channel.id);
                this.timeout = greeting.channel.timeout;
                this.incomingWindowSize = greeting.channel.incomingWindowSize;
                this.outgoingWindowSize = greeting.channel.outgoingWindowSize;
                this.methodCalls.commitNodeRemovals(this.outgoingWindowSize - outgoingWindowSize);
                this.methodCalls.resumeNodeProcessor();
                this.resultReturns.resumeNodeProcessor();
                this.receiveMessages([]);
                this.sendMessages([], []);
                this.isConnected = true;
                console.info("[pbrpc] connected to [%s]!", this.serverAddress)
                setTimeout(this.onConnect.bind(this), 0);
            }
        }.bind(this);
    }.bind(this);

    this.handshaker(greeter);
};

Channel.prototype.receiveMessages = function(data) {
    if (this.heartbeatReadTimeout != null) {
        clearTimeout(this.heartbeatReadTimeout);
        this.heartbeatReadTimeout = null;
    }

    var completedMethodCallCount = 0;

    data.forEach(function(data2) {
        var messageType = data2[0];
        var messageHeaderSize = (data2[1] << 8) | data2[2];
        var messageHeaderData = data2.subarray(3, 3 + messageHeaderSize);
        var messagePayloadData = data2.subarray(3 + messageHeaderSize);

        switch (messageType) {
        case protocol.MessageType.MESSAGE_REQUEST:
            var requestHeader = protocol.RequestHeader.decode(messageHeaderData);

            var context = {
                serviceName: requestHeader.serviceName,
                methodName: requestHeader.methodName,
                resourceID: requestHeader.resourceId,
                extraData: requestHeader.extraData,
                traceID: UUID.fromBytes(requestHeader.traceId),
                spanParentID: requestHeader.spanId,
                spanID: requestHeader.spanId + 1,
            };

            var serviceHandler = null;
            var methodHandler = null;
            var error = null;
            var error2;

            if (context.serviceName in this.serviceHandlers
                && (serviceHandler = this.serviceHandlers[context.serviceName], context.methodName in serviceHandler.methodTable)
                && (methodHandler = serviceHandler.methodTable[context.methodName], context.methodName in serviceHandler)) {
                ++this.pendingResultReturnCount;

                if (this.pendingResultReturnCount <= this.incomingWindowSize) {
                    var resultReturns = this.resultReturns;

                    try {
                        methodHandler.call(serviceHandler, this, context, messagePayloadData, function(error, responsePayloadData) {
                            var errorCode;
                            var errorDesc;

                            if (error == null) {
                                errorCode = null;
                                errorDesc = null;
                            } else {
                                if (error instanceof MyError) {
                                    errorCode = error.code;
                                    errorDesc = error.message;
                                    responsePayloadData = error.data;
                                } else {
                                    errorCode = errorInternalServer;
                                    errorDesc = errorDescs[errorInternalServer];
                                    responsePayloadData = new Uint8Array(0);
                                }
                            }

                            resultReturns.appendNode({
                                sequenceNumber: requestHeader.sequenceNumber,
                                nextSpanID: context.spanID + 2,
                                errorCode: errorCode,
                                errorDesc: errorDesc,
                                responsePayloadData: responsePayloadData,
                            });
                        }.bind(this));

                        break;
                    } catch (e) {
                        error = e;
                        error2 = new MyError(errorInternalServer);
                    }
                } else {
                    error2 = new MyError(errorTooManyRequests);
                }
            } else {
                if (serviceHandler != null && methodHandler != null) {
                    error2 = new MyError(errorNotImplemented);
                } else {
                    error2 = new MyError(errorNotFound);
                }
            }

            var onReturnResultByLocal = this.onCallMethodByRemote(context, {});

            if (onReturnResultByLocal != null) {
                if (error == null) {
                    error = error2;
                }

                onReturnResultByLocal(error, null);
            }

            this.resultReturns.appendNode({
                sequenceNumber: requestHeader.sequenceNumber,
                nextSpanID: context.spanID + 2,
                errorCode: error2.code,
                errorDesc: error2.message,
                responsePayloadData: error2.data,
            });

            break;
        case protocol.MessageType.MESSAGE_RESPONSE:
            var responseHeader = protocol.ResponseHeader.decode(messageHeaderData);

            if (responseHeader.sequenceNumber in this.pendingMethodCalls) {
                var methodCall = this.pendingMethodCalls[responseHeader.sequenceNumber];
                delete this.pendingMethodCalls[responseHeader.sequenceNumber];

                if (responseHeader.errorCode == 0) {
                    setTimeout(methodCall.callback.bind(null, null, messagePayloadData), 0);
                } else {
                    var errorData;

                    if (messagePayloadData.length == 0) {
                        errorData = null;
                    } else {
                        errorData = messagePayloadData;
                    }

                    var error = new MyError(responseHeader.errorCode, responseHeader.errorDesc, errorData);
                    setTimeout(methodCall.callback.bind(null, error, null), 0);
                }

                ++completedMethodCallCount;
            }

            break;
        case protocol.MessageType.MESSAGE_HEARTBEAT:
            protocol.Heartbeat.decode(messageHeaderData);
            this.onHeartbeatFromRemote()
            break;
        }
    }.bind(this));

    this.methodCalls.commitNodeRemovals(completedMethodCallCount);

    this.heartbeatReadTimeout = setTimeout(function() {
        if (this.heartbeatReadTimeout == null) {
            return;
        }

        this.transport.close();
    }.bind(this), 2 * this.getMinHeartbeatInterval());
};

Channel.prototype.sendMessages = function(methodCalls, resultReturns) {
    if (this.heartbeatWriteTimeout != null) {
        clearTimeout(this.heartbeatWriteTimeout);
        this.heartbeatWriteTimeout = null;
    }

    var buffers = [];

    methodCalls.forEach(function(methodCall) {
        methodCall.sequenceNumber = this.getSequenceNumber();

        var requestHeaderData = protocol.RequestHeader.encode({
            sequenceNumber: methodCall.sequenceNumber,
            serviceName: methodCall.serviceName,
            methodName: methodCall.methodName,
            resourceId: methodCall.resourceID,
            extraData: methodCall.extraData,
            traceId: methodCall.traceID.bytes,
            spanId: methodCall.spanID,
        }).finish();

        var buffer = new Uint8Array(3 + requestHeaderData.length + methodCall.requestPayloadData.length);
        buffer[0] = protocol.MessageType.MESSAGE_REQUEST;
        buffer[1] = requestHeaderData.length >> 8;
        buffer[2] = requestHeaderData.length & 0xFF;
        buffer.set(requestHeaderData, 3);
        buffer.set(methodCall.requestPayloadData, 3 + requestHeaderData.length);
        buffers.push(buffer);
    }.bind(this));

    resultReturns.forEach(function(resultReturn) {
        var responseHeaderData = protocol.ResponseHeader.encode({
            sequenceNumber: resultReturn.sequenceNumber,
            nextSpanId: resultReturn.nextSpanID,
            errorCode: resultReturn.errorCode,
            errorDesc: resultReturn.errorDesc,
        }).finish();

        var buffer = new Uint8Array(3 + responseHeaderData.length + resultReturn.responsePayloadData.length);
        buffer[0] = protocol.MessageType.MESSAGE_RESPONSE;
        buffer[1] = responseHeaderData.length >> 8;
        buffer[2] = responseHeaderData.length & 0xFF;
        buffer.set(responseHeaderData, 3);
        buffer.set(resultReturn.responsePayloadData, 3 + responseHeaderData.length);
        buffers.push(buffer);
    });

    this.transport.writeInBatch(buffers);

    methodCalls.forEach(function(methodCall) {
        this.pendingMethodCalls[methodCall.sequenceNumber] = methodCall;
    }.bind(this));

    this.pendingResultReturnCount -= resultReturns.length;

    this.heartbeatWriteTimeout = setTimeout(function() {
        if (this.heartbeatWriteTimeout == null) {
            return;
        }

        var heartbeatData = protocol.Heartbeat.encode({}).finish();
        var buffer = new Uint8Array(3 + heartbeatData.length);
        buffer[0] = protocol.MessageType.MESSAGE_HEARTBEAT;
        buffer[1] = heartbeatData.length >> 8;
        buffer[2] = heartbeatData.length & 0xFF;
        buffer.set(heartbeatData, 3);
        this.transport.write(buffer);
        this.onHeartbeatFromLocal()
        this.sendMessages([], []);
    }.bind(this), this.getMinHeartbeatInterval());
};

Channel.prototype.getMinHeartbeatInterval = function() {
    return this.timeout / 3;
};

Channel.prototype.getSequenceNumber = function() {
    var sequenceNumber = this.nextSequenceNumber;
    this.nextSequenceNumber = (this.nextSequenceNumber + 1) & 0x7FFFFFFF;
    return sequenceNumber;
};

Channel.prototype.onConnect = function() {};
Channel.prototype.onDisconnect = function(autoReconnect) {};

Channel.prototype.onHeartbeatFromLocal = function() {
        console.info("[pbrpc][C->S][Heartbeat] .");
};

Channel.prototype.onCallMethodByLocal = function(context, requestPayload) {
    var startTime = Date.now();

    return function(error, response) {
        var endTime = Date.now();
        var duration = (endTime - startTime) / 1000;

        if (error == null) {
            console.info(
                "[pbrpc][C->S][%s:%d][%s.%s:%s][%.3f] requestPayload=%o, response=%o",
                context.traceID.toString(),
                context.spanID,
                context.serviceName,
                context.methodName,
                context.resourceID,
                duration,
                requestPayload,
                response,
            );
        } else {
            var log;

            if (error.code < errorUserDefined) {
                log = console.error;
            } else {
                log = console.info;
            }

            log(
                "[pbrpc][C->S][%s:%d][%s.%s:%s][%.3f] requestPayload=%o, errorCode=%d, errorDesc=%s, errorData=%s",
                context.traceID.toString(),
                context.spanID,
                context.serviceName,
                context.methodName,
                context.resourceID,
                duration,
                requestPayload,
                error.code,
                JSON.stringify(error.message),
                JSON.stringify(String.fromCharCode.apply(null, error.data)),
            );
        }
    };
};

Channel.prototype.onHeartbeatFromRemote = function() {
        console.info("[pbrpc][S->C][Heartbeat] .");
};

Channel.prototype.onCallMethodByRemote = function(context, request) {
    var startTime = Date.now();

    return function(error, responsePayload) {
        var endTime = Date.now();
        var duration = (endTime - startTime) / 1000;

        if (error == null) {
            console.info(
                "[pbrpc][S->C][%s:%d][%s.%s:%s][%.3f] request=%o, responsePayload=%o",
                context.traceID.toString(),
                context.spanID,
                context.serviceName,
                context.methodName,
                context.resourceID,
                duration,
                request,
                responsePayload,
            );
        } else {
            if (error instanceof MyError) {
                var log;

                if (error.code < errorUserDefined) {
                    log = console.error;
                } else {
                    log = console.info;
                }

                log(
                    "[pbrpc][S->C][%s:%d][%s.%s:%s][%.3f] request=%o, errorCode=%d, errorDesc=%s, errorData=%s",
                    context.traceID.toString(),
                    context.spanID,
                    context.serviceName,
                    context.methodName,
                    context.resourceID,
                    duration,
                    request,
                    error.code,
                    JSON.stringify(error.message),
                    JSON.stringify(String.fromCharCode.apply(null, error.data)),
                );
            } else {
                console.error(
                    "[pbrpc][S->C][%s:%d][%s.%s:%s][%.3f] request=%o, errorCode=%d, errorDesc=%s, error=%o",
                    context.traceID.toString(),
                    context.spanID,
                    context.serviceName,
                    context.methodName,
                    context.resourceID,
                    duration,
                    request,
                    errorInternalServer,
                    JSON.stringify(errorDescs[errorInternalServer]),
                    error,
                );
            }
        }
    };
};

function MyError(code, desc, data) {
    if (desc == null) {
        if (code in errorDescs) {
            desc = errorDescs[code];
        } else {
            desc = "error " + code.toString();
        }
    }

    if (data == null) {
        data = new Uint8Array(0);
    }

    this.code = code;
    this.message = desc;
    this.data = data;
}

MyError.prototype = new Error();

var errorDescs = {
    [errorChannelBroken]: "channel broken",
    [errorChannelClosed]: "channel closed",
    [errorTooManyRequests]: "too many requests",
    [errorNotFound]: "not found",
    [errorBadRequest]: "bad request",
    [errorNotImplemented]: "not implemented",
    [errorInternalServer]: "internal server",
    [errorUserDefined]: "user defined",
};

function registerError(errorCode, errorDesc) {
    errorDescs[errorCode] = errorDesc;
}

module.exports = {
    errorChannelBroken: errorChannelBroken,
    errorChannelClosed: errorChannelClosed,
    errorTooManyRequests: errorTooManyRequests,
    errorNotFound: errorNotFound,
    errorBadRequest: errorBadRequest,
    errorNotImplemented: errorNotImplemented,
    errorInternalServer: errorInternalServer,
    errorUserDefined: errorUserDefined,

    Channel: Channel,
    Error: MyError,

    registerError: registerError,
};

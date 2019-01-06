"use strict";

var protocol = require("./protocol.pb");

var UUID = require("./uuid").UUID;
var Transport = require("./transport").Transport;
var Queue = require("./queue").Queue;

var defaultChannelTimeout = 15000;
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

Channel.prototype.callMethod = function(serviceName, methodName, requestPayloadData, autoRetryMethodCall, callback) {
    if (!this.isConnected && !this.autoReconnect) {
        setTimeout(callback.bind(null, errorChannelClosed, null), 0);
        return;
    }

    if (callback == null) {
        callback = function(errorCode, responsePayloadData) {};
    }

    this.methodCalls.appendNode({
        traceID: UUID.v4(),
        spanParentID: 0,
        spanID: 1,
        serviceName: serviceName,
        methodName: methodName,
        requestPayloadData: requestPayloadData,
        autoRetry: autoRetryMethodCall,
        callback: callback,
    });
};

Channel.prototype.connect = function(reconnectionDelay) {
    var transport = new Transport(this.serverAddress);
    this.transport = transport;
    var greeterCallback = null;

    transport.onConnect = function() {
        var greeter = function(handshake, greeterCallback2) {
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

        if (this.handshaker == undefined) {
            greeter(new Uint8Array(0), function(handshake) {
                return true;
            });
        } else {
            this.handshaker(greeter);
        }
    }.bind(this);

    transport.onDisconnect = function() {
        if (this.autoReconnect) {
            if (this.isConnected) {
                clearTimeout(this.heartbeatReadTimeout);
                this.heartbeatReadTimeout = null;
                clearTimeout(this.heartbeatWriteTimeout);
                this.heartbeatWriteTimeout = null;
                this.methodCalls.suspendNodeProcessor();
                var methodCalls = [];
                var completedMethodCallCount = 0;

                Object.keys(this.pendingMethodCalls).forEach(function(sequenceNumber) {
                    var methodCall = this.pendingMethodCalls[sequenceNumber];

                    if (methodCall.autoRetry) {
                        methodCalls.push(methodCall);
                    } else {
                        setTimeout(methodCall.callback.bind(null, errorChannelBroken, null), 0);
                        ++completedMethodCallCount;
                    }
                }.bind(this));

                this.methodCalls.discardNodeRemovals(methodCalls);
                this.methodCalls.commitNodeRemovals(completedMethodCallCount);
            }
        } else {
            var allMethodCalls = this.methodCalls.reset();

            allMethodCalls.forEach(function(methodCall) {
                setTimeout(methodCall.callback.bind(null, errorChannelClosed, null), 0);
            });

            Object.keys(this.pendingMethodCalls).forEach(function(sequenceNumber) {
                var methodCall = this.pendingMethodCalls[sequenceNumber];
                var errorCode;

                if (methodCall.autoRetry) {
                    errorCode = errorChannelClosed;
                } else {
                    errorCode = errorChannelBroken;
                }

                setTimeout(methodCall.callback.bind(null, errorCode, null), 0);
            }.bind(this));
        }

        if (this.isConnected) {
            this.pendingMethodCalls = {};
            this.pendingResultReturnCount = 0;
            this.resultReturns.suspendNodeProcessor();
            this.resultReturns = this.resultReturns.renew();
            this.onDisconnect(this.autoReconnect);
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

                setTimeout(function() {
                    this.connect(reconnectionDelay);
                }.bind(this), reconnectionDelay);
            }
        }
    }.bind(this);

    transport.onWrite = function(data) {
        if (this.isConnected) {
            this.receiveMessages(data);
        } else {
            var greeting = protocol.Greeting.decode(data[0]);

            if (!greeterCallback(greeting.handshake)) {
                this.autoReconnect = false;
                this.transport.close();
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
            this.onConnect();
        }
    }.bind(this);
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
            var serviceHandler = null;
            var methodHandler = null;
            var errorCode;

            if (requestHeader.serviceName in this.serviceHandlers
                && (serviceHandler = this.serviceHandlers[requestHeader.serviceName], requestHeader.methodName in serviceHandler.methodTable)
                && (methodHandler = serviceHandler.methodTable[requestHeader.methodName], requestHeader.methodName in serviceHandler)) {
                ++this.pendingResultReturnCount;

                if (this.pendingResultReturnCount <= this.incomingWindowSize) {
                    var resultReturns = this.resultReturns;

                    methodHandler.call(serviceHandler, this, messagePayloadData, function(errorCode, responsePayloadData) {
                        resultReturns.appendNode({
                            nextSpanID: requestHeader.SpanId + 1,
                            sequenceNumber: requestHeader.sequenceNumber,
                            errorCode: errorCode,
                            responsePayloadData: responsePayloadData,
                        });
                    }.bind(this));

                    break
                }

                errorCode = errorTooManyRequests;
            } else {
                if (serviceHandler != null && methodHandler != null) {
                    errorCode = errorNotImplemented;
                } else {
                    errorCode = errorNotFound;
                }
            }

            var onReturnResultByLocal = this.onCallMethodByRemote(requestHeader.serviceName, requestHeader.methodName, {});

            if (onReturnResultByLocal != null) {
                onReturnResultByLocal(errorCode, null);
            }

            this.resultReturns.appendNode({
                nextSpanID: requestHeader.SpanId + 1,
                sequenceNumber: requestHeader.sequenceNumber,
                errorCode: errorCode,
                responsePayloadData: null,
            });

            break;
        case protocol.MessageType.MESSAGE_RESPONSE:
            var responseHeader = protocol.ResponseHeader.decode(messageHeaderData);

            if (responseHeader.sequenceNumber in this.pendingMethodCalls) {
                var methodCall = this.pendingMethodCalls[responseHeader.sequenceNumber];
                delete this.pendingMethodCalls[responseHeader.sequenceNumber];

                if (responseHeader.errorCode == 0) {
                    setTimeout(methodCall.callback.bind(null, 0, messagePayloadData), 0);
                } else {
                    setTimeout(methodCall.callback.bind(null, responseHeader.errorCode, null), 0);
                }

                ++completedMethodCallCount;
            }

            break;
        case protocol.MessageType.MESSAGE_HEARTBEAT:
            protocol.Heartbeat.decode(messageHeaderData);
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
            traceId: methodCall.traceID.bytes,
            spanParentId: methodCall.spanParentID,
            spanId: methodCall.spanID,
            sequenceNumber: methodCall.sequenceNumber,
            serviceName: methodCall.serviceName,
            methodName: methodCall.methodName,
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
            nextSpanId: resultReturn.nextSpanID,
            sequenceNumber: resultReturn.sequenceNumber,
            errorCode: resultReturn.errorCode,
        }).finish();

        if (resultReturn.errorCode == 0) {
            var buffer = new Uint8Array(3 + responseHeaderData.length + resultReturn.responsePayloadData.length);
            buffer[0] = protocol.MessageType.MESSAGE_RESPONSE;
            buffer[1] = responseHeaderData.length >> 8;
            buffer[2] = responseHeaderData.length & 0xFF;
            buffer.set(responseHeaderData, 3);
            buffer.set(resultReturn.responsePayloadData, 3 + responseHeaderData.length);
            buffers.push(buffer);
        } else {
            var buffer = new Uint8Array(3 + responseHeaderData.length);
            buffer[0] = protocol.MessageType.MESSAGE_RESPONSE;
            buffer[1] = responseHeaderData.length >> 8;
            buffer[2] = responseHeaderData.length & 0xFF;
            buffer.set(responseHeaderData, 3);
            buffers.push(buffer);
        }
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
        this.sendMessages([], []);
    }.bind(this), this.getMinHeartbeatInterval());
};

Channel.prototype.getMinHeartbeatInterval = function() {
    return this.timeout / 3;
};

Channel.prototype.getSequenceNumber = function() {
    var sequenceNumber = this.nextSequenceNumber;
    this.nextSequenceNumber = (this.nextSequenceNumber + 1) & 0xFFFFFFF;
    return sequenceNumber;
};

Channel.prototype.onConnect = function() {};
Channel.prototype.onDisconnect = function(autoReconnect) {};
Channel.prototype.onCallMethodByLocal = function(serviceName, methodName, requestPayload) {};
Channel.prototype.onCallMethodByRemote = function(serviceName, methodName, request) {};

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
};

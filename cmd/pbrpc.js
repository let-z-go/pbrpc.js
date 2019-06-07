"use strict";

function generateStubs(object) {
    console.log(heredoc(function() {/*
// Code generated by pbrpc.js. DO NOT EDIT.

"use strict";

var protobuf = require("protobufjs/minimal");
var root;

if ("default" in protobuf.roots) {
    root = protobuf.roots.default;
} else {
    root = {};
    protobuf.roots.default = root;
}

var exports = {};
*/}));

    doGenerateStubs("", object);

    console.log(heredoc(function() {/*

module.exports = exports;
*/}));
}

function doGenerateStubs(objectPath, object) {
    if ("methods" in object) {
        var serviceFullName = objectPath.substr(1).replace(/Service$/, "");
        var serviceName = serviceFullName.substr(serviceFullName.lastIndexOf(".") + 1);
        var methods = object.methods;
        processService(serviceFullName, serviceName, methods);
    }

    if ("nested" in object) {
        Object.keys(object.nested).forEach(function(subObjectName) {
            var subObject = object.nested[subObjectName]
            doGenerateStubs(objectPath + "." + subObjectName, subObject);
        });
    }
}

function processService(serviceFullName, serviceName, methods) {
    generateServiceClient(serviceFullName, serviceName, methods);
    generateServiceHandler(serviceFullName, serviceName, methods);
}

function generateServiceClient(serviceFullName, serviceName, methods) {
    console.log(heredoc(function() {/*

function %sServiceClient(channel) {
    this.channel = channel;
    this.resourceID = null;
    this.extraData = null;
    this.autoRetry = false;
}

%sServiceClient.prototype.withResourceID = function(resourceID) {
    var other = new this.constructor(this.channel);
    other.resourceID = resourceID;
    other.extraData = this.extraData;
    other.autoRetry = this.autoRetry;
    return other;
};

%sServiceClient.prototype.withExtraData = function(extraData) {
    var other = new this.constructor(this.channel);
    other.resourceID = this.resourceID;
    other.extraData = extraData;
    other.autoRetry = this.autoRetry;
    return other;
};

%sServiceClient.prototype.withAutoRetry = function(autoRetry) {
    var other = new this.constructor(this.channel);
    other.resourceID = this.resourceID;
    other.extraData = this.extraData;
    other.autoRetry = autoRetry;
    return other;
};
*/}), serviceName, serviceName, serviceName, serviceName);

    Object.keys(methods).forEach(function(methodName) {
        var method = methods[methodName];

        console.log(heredoc(function() {/*

%sServiceClient.prototype.%s = function(request, callback) {
    var requestType = root.%s;
    var errorMessage = requestType.verify(request);

    if (errorMessage != null) {
        throw Error(errorMessage);
    }

    var requestPayload = requestType.fromObject(request);
    var requestPayloadData = requestType.encode(requestPayload).finish();
    var onReturnResultByRemote;

    var context = this.channel.callMethod("%s", "%s", this.resourceID, this.extraData, requestPayloadData, this.autoRetry, function(error, responsePayloadData) {
        var response;

        if (error == null) {
            var responseType = root.%s;
            var responsePayload = responseType.decode(responsePayloadData);
            response = responseType.toObject(responsePayload, {defaults: true});
        } else {
            response = null;
        }

        if (onReturnResultByRemote != null) {
            onReturnResultByRemote(error, response);
        }

        callback(error, response);
    });

    onReturnResultByRemote = this.channel.onCallMethodByLocal(context, requestPayload);
};
*/}), serviceName, methodName, method.requestType, serviceName, methodName, method.responseType);
    });

    console.log(heredoc(function() {/*

exports.%sServiceClient = %sServiceClient;
*/}), serviceName, serviceName);
}

function generateServiceHandler(serviceFullName, serviceName, methods) {
    console.log(heredoc(function() {/*

function %sServiceHandler() {
}

%sServiceHandler.prototype.name = "%s";

%sServiceHandler.prototype.methodTable = {
*/}), serviceName, serviceName, serviceName, serviceName);

    Object.keys(methods).forEach(function(methodName) {
        var method = methods[methodName];

        console.log(heredoc(function() {/*
    "%s": function(channel, context, requestPayloadData, responseWriter) {
        var requestType = root.%s;
        var requestPayload = requestType.decode(requestPayloadData);
        var request = requestType.toObject(requestPayload, {defaults: true});
        var onReturnResultByLocal = channel.onCallMethodByRemote(context, request);

        this.%s(request, function(error, response) {
            var responsePayloadData;

            if (error == null) {
                var responseType = root.%s;
                var errorMessage = responseType.verify(response);

                if (errorMessage != null) {
                    throw Error(errorMessage);
                }

                var responsePayload = responseType.fromObject(response);

                if (onReturnResultByLocal != null) {
                    onReturnResultByLocal(null, responsePayload);
                }

                responsePayloadData = responseType.encode(responsePayload).finish();
            } else {
                if (onReturnResultByLocal != null) {
                    onReturnResultByLocal(error, null);
                }

                responsePayloadData = null;
            }

            responseWriter(error, responsePayloadData);
        });
    },
*/}), methodName, method.requestType, methodName, method.responseType);
    });

    console.log(heredoc(function() {/*
};

exports.%sServiceHandler = %sServiceHandler;
*/}), serviceName, serviceName);
}

function heredoc(f) {
    var s = f.toString()
    var i = s.indexOf("/*\n")

    if (i < 0) {
        throw Error("invalid heredoc: " + s)
    }

    var j = s.lastIndexOf("\n*/")

    if (j < 0) {
        throw Error("invalid heredoc: " + s)
    }

    return s.slice(i + 3, j);
}

function main() {
    var buffer = "";

    process.stdin.on("data", function(data) {
        buffer += data;
    }).on("end", function() {
        var object = JSON.parse(buffer);
        generateStubs(object);
    }).setEncoding("utf8");
}

main();

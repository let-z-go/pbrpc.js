"use strict";

var packetHeaderSize = 4;
var maxWebSocketFramePayloadSize = 1 << 16;

function Transport(serverAddress) {
    var webSocket = new WebSocket(serverAddress);
    this.webSocket = webSocket;
    this.pendingMessageCountPlusOne = 1;

    webSocket.onopen = function(event) {
        this.onConnect();
    }.bind(this);

    webSocket.onclose = function(event) {
        --this.pendingMessageCountPlusOne;

        if (this.pendingMessageCountPlusOne == 0) {
            this.onDisconnect();
        }
    }.bind(this);

    webSocket.onerror = function(event) {
        this.onAbort();
    }.bind(this);

    var data = [];
    var dataSize = 0;

    var writeData = function(buffer) {
        data.push(buffer);
        dataSize += buffer.length;
    };

    var readData = function(buffer) {
        var i = 0;

        while (i < buffer.length) {
            var n = Math.min(buffer.length - i, data[0].length)
            buffer.set(data[0].subarray(0, n), i);
            i += n;

            if (n == data[0].length) {
                data.shift();
            } else {
                data[0] = data[0].subarray(n)
            }

            dataSize -= n;
        }
    };

    var packetPayloadSize = -1;

    webSocket.onmessage = function(event) {
        var fileReader = new FileReader();

        fileReader.onload = function(event) {
            writeData(new Uint8Array(event.target.result));
            var packetPayloads = [];

            for (;;) {
                if (packetPayloadSize < 0) {
                    if (dataSize < packetHeaderSize) {
                        break;
                    }

                    var packetHeader = new Uint8Array(packetHeaderSize);
                    readData(packetHeader);
                    packetPayloadSize = 0;

                    for (var i = 0; i < packetHeaderSize; ++i) {
                        packetPayloadSize = (packetPayloadSize << 8) | packetHeader[i];
                    }
                }

                if (dataSize < packetPayloadSize) {
                    break;
                }

                var packetPayload = new Uint8Array(packetPayloadSize);
                packetPayloadSize = -1;
                readData(packetPayload);
                packetPayloads.push(packetPayload);
            }

            if (packetPayloads.length >= 1) {
                this.onWrite(packetPayloads);
            }

            --this.pendingMessageCountPlusOne;

            if (this.pendingMessageCountPlusOne == 0) {
                this.onDisconnect();
            }
        }.bind(this);

        ++this.pendingMessageCountPlusOne;
        fileReader.readAsArrayBuffer(event.data);
    }.bind(this);
}

Transport.prototype.write = function(packetPayload) {
    var n = packetPayload.length;
    var packet = new Uint8Array(packetHeaderSize + n);

    for (var i = packetHeaderSize - 1; i >= 0; --i) {
        packet[i] = n & 0xFF;
        n >>>= 8;
    }

    packet.set(packetPayload, packetHeaderSize);
    var i = 0;

    while (true) {
        var j = i + maxWebSocketFramePayloadSize;

        if (j >= packet.length) {
            this.webSocket.send(packet.subarray(i));
            break
        }

        this.webSocket.send(packet.subarray(i, j));
        i = j;
    }
};

Transport.prototype.writeInBatch = function(packetPayloads) {
    if (packetPayloads.length == 0) {
        return;
    }

    var packetsSize = 0;

    packetPayloads.forEach(function(packetPayload) {
        packetsSize += packetHeaderSize + packetPayload.length;
    });

    var packets = new Uint8Array(packetsSize);
    var packet = packets;

    packetPayloads.forEach(function(packetPayload) {
        var n = packetPayload.length;

        for (var i = packetHeaderSize - 1; i >= 0; --i) {
            packet[i] = n & 0xFF;
            n >>>= 8;
        }

        packet.set(packetPayload, packetHeaderSize);
        packet = packet.subarray(packetHeaderSize + packetPayload.length);
    });

    var i = 0;

    while (true) {
        var j = i + maxWebSocketFramePayloadSize;

        if (j >= packets.length) {
            this.webSocket.send(packets.subarray(i));
            break
        }

        this.webSocket.send(packets.subarray(i, j));
        i = j;
    }
};

Transport.prototype.close = function() {
    this.webSocket.close();
};

Transport.prototype.onConnect = function() {};
Transport.prototype.onDisconnect = function() {};
Transport.prototype.onAbort = function() {};
Transport.prototype.onWrite = function(packetPayloads) {};

module.exports = {
    Transport: Transport,
};

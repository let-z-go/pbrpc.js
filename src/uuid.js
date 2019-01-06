"use strict";

function UUID() {
    this.bytes = new Uint8Array(16);
}

UUID.fromBytes = function(bytes) {
    var instance = new UUID();
    instance.bytes.set(bytes.subarray(0, 16));
    return instance;
};

UUID.v4 = function() {
    var bytes = new Uint8Array(16);

    for (var i in bytes) {
        bytes[i] = Math.floor(Math.random() * 256);
    }

    bytes[6] = (bytes[6] & 0x0F) | 0x40;
    bytes[8] = (bytes[8] & 0x3F) | 0x80;
    return UUID.fromBytes(bytes);
};

UUID.prototype.isZero = function() {
    var bytes = this.bytes;
    return (bytes[0x0] | bytes[0x1] | bytes[0x2] | bytes[0x3] |
            bytes[0x4] | bytes[0x5] | bytes[0x6] | bytes[0x7] |
            bytes[0x8] | bytes[0x9] | bytes[0xA] | bytes[0xB] |
            bytes[0xC] | bytes[0xD] | bytes[0xE] | bytes[0xF]) == 0;
};

UUID.prototype.toString = function() {
    var i = 0;
    var j = 0;
    var substrings = new Array(21);

    [4, 6, 8, 10, 16].forEach(function(n) {
        for (; j < n; ++j) {
            var byte = this.bytes[j];

            if (byte < 0x10) {
                substrings[i + j] = "0" + byte.toString(16);
            } else {
                substrings[i + j] = byte.toString(16);
            }
        }

        substrings[i + n] = "-";
        ++i;
    }.bind(this));

    substrings.length = 20;
    return substrings.join("");
};

module.exports = {
    UUID: UUID,
};

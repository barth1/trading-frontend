if (typeof Object.getOwnPropertyNames === 'undefined') {
    Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
        var buffer = [];
        var key;
        var commonProps = ['length', "name", "arguments", "caller", "prototype", "observe", "unobserve"];
        if (typeof object === 'undefined' || object === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        object = Object(object);
        for (key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                buffer.push(key);
            }
        }
        for (var i = 0, s = commonProps.length; i < s; i++) {
            if (commonProps[i] in object) buffer.push(commonProps[i]);
        }
        return buffer;
    };
}
if (!Array.prototype.some) {
    Array.prototype.some = function(fun) {
        'use strict';
        if (this === void 0 || this === null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function') {
            throw new TypeError();
        }
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t && fun.call(thisArg, t[i], i, t)) {
                return true;
            }
        }
        return false;
    };
    Array.prototype.some.toString = function() {};
}
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback, thisArg) {
        var T, k;
        if (this == null) {
            throw new TypeError('this is null or not defined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== "function") {
            throw new TypeError(callback + ' is not a function');
        }
        if (arguments.length > 1) {
            T = thisArg;
        }
        k = 0;
        while (k < len) {
            var kValue;
            if (k in O) {
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
}
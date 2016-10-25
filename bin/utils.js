"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var forceArray = exports.forceArray = function forceArray(array) {
    return Array.isArray(array) ? array : [array];
};

var getByKeys = exports.getByKeys = function getByKeys(object, keys) {
    return forceArray(keys).reduce(function (relevant, key) {
        return Object.assign(relevant, _defineProperty({}, key, object[key]));
    }, {});
};
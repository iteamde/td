'use strict';

var functionThread = require('function-thread');

/**
 * @type {Function}
 */
var thread = functionThread(function (input, resolve, reject) {
    var Promise = require('bluebird');
    var _ = require('lodash');
    var func;
    eval('func = ' + input.func);
    func(input.data, resolve, reject);
}, {
    usePool: true
});

/**
 * @param func
 * @param options
 * @return {Function}
 */
module.exports = function (func, options) {
    func = func.toString();
    return function (data) {
        return thread({
            func: func,
            data: data
        }, options);
    };
};

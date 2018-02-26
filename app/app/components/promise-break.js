'use strict';

/**
 * @param data
 * @constructor
 */
function PromiseBreak(data) {
    /**
     * @type {any}
     */
    this.data = data;
}

PromiseBreak.prototype = Object.create(Error.prototype);
PromiseBreak.prototype.constructor = PromiseBreak;

module.exports = PromiseBreak;

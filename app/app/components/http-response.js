'use strict';

/**
 * @param data
 * @param status
 * @constructor
 */
function HttpResponse(data, status) {
    /**
     * @type {any}
     */
    this.data = data;

    /**
     * @type {Number}
     */
    this.status = parseInt(status, 10) || 200;
}

HttpResponse.prototype = Object.create(Error.prototype);
HttpResponse.prototype.constructor = HttpResponse;

/**
 * @param res
 */
HttpResponse.prototype.json = function (res) {
    res.status(this.status).json(this.data);
};

/**
 * @param res
 */
HttpResponse.prototype.send = function (res) {
    res.status(this.status).send(this.data);
};

module.exports = HttpResponse;

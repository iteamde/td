'use strict';

const fs = require('fs');
const path = require('path');
const moment = require('moment');

/**
 * @param {string} type
 * @param {number} endTimeout
 * @returns {Stream}
 */
module.exports = function (type, endTimeout) {
    let logFilePath = path.resolve(__dirname, '../../logs', type, moment().format('YYYY-MM-DD_HH:mm:ss') + '.log');
    let stream = fs.createWriteStream(logFilePath);
    let setTimeoutId;

    if (endTimeout) {
        setTimeoutId = setTimeout(function () {
            stream.end();
            setTimeoutId = undefined;
        }, endTimeout);
    }

    /**
     * @param {string} line
     * @returns {Stream}
     */
    stream.writeLine = function (line) {
        if (setTimeoutId) {
            clearTimeout(setTimeoutId);
            setTimeoutId = setTimeout(function () {
                stream.end();
                setTimeoutId = undefined;
            }, endTimeout);
        }

        this.write(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]: ${line}\n`);
        return this;
    };

    /**
     * @param {string} line
     */
    stream.closeLogger = function (line) {
        if (line) {
            this.writeLine(line);
        }

        if (setTimeoutId) {
            clearTimeout(setTimeoutId);
            setTimeoutId = undefined;
        }

        this.end();
    };

    return stream;
};

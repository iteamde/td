'use strict';

const { compareTwoStrings } = require('string-similarity');
const prepareString = require('./prepare-string');

/**
 * @param {string} string1
 * @param {string} string2
 * @return {number|null}
 */
module.exports = function (string1, string2) {
    return compareTwoStrings(prepareString(string1), prepareString(string2));
};

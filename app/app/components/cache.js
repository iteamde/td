'use strict';

var NodeCache = require('node-cache');

module.exports = new NodeCache({
    stdTTL: 100,
    checkperiod: 120
});

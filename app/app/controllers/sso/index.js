'use strict';

module.exports = require('express').Router();

module.exports.use(require('./endpoint/redirect'));

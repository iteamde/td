'use strict';

var config = require('../../config').config;
var atpl = require('atpl');
var path = require('path');

module.exports = function (template, data) {
    return new Promise(function (resolve, reject) {
        atpl.renderFile(config.ATPL_TEMPLATE_PATH, template, data || {}, true, function (err, result) {
            err ? reject(err) : resolve(result);
        });
    });
};

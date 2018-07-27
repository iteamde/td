'use strict';

var config = require('../../config').config;
var orm = require('../components/orm/orm');
var ORM = require('sequelize');
var jsVm = require('../components/js-virtual-machine');
var ormModels = require('../models/orm-models');
var pythonShell = require('../components/python-shell');
var commonChartData = require('../components/common-chart-data');
var mailer = require('../components/mailer');
var moment = require('moment');
var translation = require('../components/translation');
var dateformat = require('dateformat');
var templateRender = require('../components/template-render');
var separateThread = require('../components/separate-thread');
var cache = require('../components/cache');
var knex = require('../components/knex');
var test = require('../components/similar-text/index');
var kueriApi = require('../components/kueri-api')({
    api_url: config.kueri.api_url,
    debug: true
});
var TextClassifier = require('../components/text-classifier/index');

/**
 * @param req
 * @param res
 */
module.exports = function (req, res) {
    kueriApi.updateDataSource().then(console.log).catch(console.error);
    res.send('OK!');
};

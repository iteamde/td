'use strict';

require('../../config/global');
var config = require('../../../config').config.sequelize;
var Sequelize = require('sequelize');

module.exports = new Sequelize(config.database, config.username, config.password, _.merge(config.options, {
    pool: {
        maxConnections: 3,
        minConnections: 0,
        maxIdleTime: 30000
    }
}));

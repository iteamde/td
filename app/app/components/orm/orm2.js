'use strict';
/* Reserve pool */

require('../../config/global');
var config = require('../../../config').config.sequelize;
var Sequelize = require('sequelize');

module.exports = new Sequelize(config.database, config.username, config.password, _.merge(config.options, {
    pool: {
        maxConnections: 1,
        minConnections: 1,
        maxIdleTime: 30000
    }
}));

'use strict';

var Promise = require('bluebird');
var fs = require('fs');

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: function (queryInterface, Sequelize) {
        return Promise
            .resolve()
            .then(function() {
                return fs.readFileSync(__dirname + '/sql/step-8.sql', 'utf-8');
            }).then(function (initialSchema) {
                return initialSchema.split(';;;;;');
            }).each(function (item) {
                item = item.trim();
                return '' != item ? queryInterface.sequelize.query(item) : Promise.resolve();
            });
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: function (queryInterface, Sequelize) {
        return Promise.resolve();
    }
};

'use strict';

var Promise = require('bluebird');

module.exports = {
    /**
     *
     * @param queryInterface
     * @param Sequelize
     */
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query('DELETE FROM `trendata_user` WHERE `trendata_user_id` != 1');
    },

    /**
     *
     * @param queryInterface
     * @param Sequelize
     */
    down: function (queryInterface, Sequelize) {
        return Promise.resolve();
    }
};

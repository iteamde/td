'use strict';

var Promise = require('bluebird');

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query('UPDATE `trendata_user` SET `trendata_user_firstname` = \'TrenData\', `trendata_user_lastname` = \'Admin\' WHERE `trendata_user_id` = 1;');
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query('UPDATE `trendata_user` SET `trendata_user_firstname` = \'John\', `trendata_user_lastname` = \'Kauf\' WHERE `trendata_user_id` = 1;');
    }
};

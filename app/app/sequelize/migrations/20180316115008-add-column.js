'use strict';

var Promise = require('bluebird');

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: (queryInterface, Sequelize) => {
        return Promise.each([
            'ALTER TABLE `trendata_bigdata_user` ADD `trendata_bigdata_user_reports_per_manager` int(10) unsigned NULL DEFAULT \'0\' AFTER `trendata_bigdata_user_manager_employee_id`',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_reports_per_manager` (`trendata_bigdata_user_reports_per_manager`)'
        ], function (item) {
            return queryInterface.sequelize.query(item);
        });
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: (queryInterface, Sequelize) => {

    }
};

'use strict';

var Promise = require('bluebird');

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            /**
             *
             */
            queryInterface.sequelize.query(
                'ALTER TABLE `trendata_chart` ADD `trendata_chart_is_kueri` tinyint(1) unsigned NOT NULL DEFAULT \'0\' AFTER `trendata_chart_default_chart_display_type`'
            ),

            /**
             *
             */
            queryInterface.sequelize.query(
                'CREATE TABLE `trendata_kueri_log` (' +
                '`trendata_kueri_log_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY, ' +
                '`trendata_kueri_log_token` varchar(255) NULL, ' +
                '`trendata_kueri_log_text` longtext NULL, ' +
                '`trendata_kueri_log_sql` longtext NULL, ' +
                '`created_at` datetime NOT NULL, ' +
                '`updated_at` datetime NOT NULL' +
                ') ENGINE=\'InnoDB\''
            ).then(function () {
                return queryInterface.sequelize.query('ALTER TABLE `trendata_kueri_log` ADD UNIQUE `trendata_kueri_log_token` (`trendata_kueri_log_token`)');
            })
        ]);
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.sequelize.query('ALTER TABLE `trendata_chart` DROP `trendata_chart_is_kueri`'),
            queryInterface.sequelize.query('DROP TABLE `trendata_kueri_log`')
        ]);
    }
};

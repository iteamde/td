'use strict';

var Promise = require('bluebird');

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: (queryInterface, Sequelize) => {
        return Promise.each([
            'SET NAMES utf8',
            'SET time_zone = \'+00:00\'',
            'SET foreign_key_checks = 0',
            'SET sql_mode = \'NO_AUTO_VALUE_ON_ZERO\'',

            'DROP TABLE IF EXISTS `trendata_bigdata_custom_field`',

            `CREATE TABLE \`trendata_bigdata_custom_field\` (
              \`trendata_bigdata_custom_field_id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
              \`trendata_bigdata_custom_field_name\` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
              \`created_at\` datetime DEFAULT NULL,
              \`updated_at\` datetime DEFAULT NULL,
              PRIMARY KEY (\`trendata_bigdata_custom_field_id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`,

            `DROP TABLE IF EXISTS \`trendata_bigdata_custom_field_value\``,

            `CREATE TABLE \`trendata_bigdata_custom_field_value\` (
              \`trendata_bigdata_custom_field_value_id\` int(10) NOT NULL AUTO_INCREMENT,
              \`trendata_bigdata_custom_field_id\` int(10) unsigned DEFAULT NULL,
              \`trendata_bigdata_user_id\` int(10) unsigned DEFAULT NULL,
              \`trendata_bigdata_custom_field_value_value\` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
              \`created_at\` datetime DEFAULT NULL,
              \`updated_at\` datetime DEFAULT NULL,
              PRIMARY KEY (\`trendata_bigdata_custom_field_value_id\`),
              KEY \`trendata_bigdata_custom_field_id\` (\`trendata_bigdata_custom_field_id\`),
              KEY \`trendata_bigdata_user_id\` (\`trendata_bigdata_user_id\`),
              CONSTRAINT \`trendata_bigdata_custom_field_value_ibfk_3\` FOREIGN KEY (\`trendata_bigdata_custom_field_id\`) REFERENCES \`trendata_bigdata_custom_field\` (\`trendata_bigdata_custom_field_id\`) ON DELETE CASCADE ON UPDATE CASCADE,
              CONSTRAINT \`trendata_bigdata_custom_field_value_ibfk_5\` FOREIGN KEY (\`trendata_bigdata_user_id\`) REFERENCES \`trendata_bigdata_user\` (\`trendata_bigdata_user_id\`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`,

            'ALTER TABLE `trendata_bigdata_custom_field_value` ADD INDEX `trendata_bigdata_custom_field_value_value` (`trendata_bigdata_custom_field_value_value`)',

            'ALTER TABLE `trendata_bigdata_user` CHANGE `trendata_bigdata_user_gender` `trendata_bigdata_user_gender` varchar(255) COLLATE \'utf8_unicode_ci\' NULL AFTER `trendata_bigdata_employee_type`',

            'CREATE OR REPLACE VIEW `trendata_bigdata_user_view` AS SELECT * FROM `trendata_bigdata_user`'
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

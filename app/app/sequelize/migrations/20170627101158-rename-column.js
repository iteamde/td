'use strict';

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query('ALTER TABLE `trendata_bigdata_hire_source` CHANGE `trendata_bigdata_hire_source_name_token` `trendata_bigdata_hire_source_name` varchar(255) COLLATE \'utf8_unicode_ci\' NOT NULL AFTER `trendata_bigdata_hire_source_id`');
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query('ALTER TABLE `trendata_bigdata_hire_source` CHANGE `trendata_bigdata_hire_source_name` `trendata_bigdata_hire_source_name_token` varchar(255) COLLATE \'utf8_unicode_ci\' NOT NULL AFTER `trendata_bigdata_hire_source_id`');
    }
};

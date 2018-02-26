'use strict';

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query('ALTER TABLE `trendata_sql_query` ADD `trendata_sql_query_module_path` varchar(255) COLLATE \'utf8_unicode_ci\' NULL AFTER `trendata_sql_query_custom_source`;');
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('trendata_sql_query', 'trendata_sql_query_module_path');
    }
};

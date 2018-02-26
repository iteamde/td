'use strict';

var Promise = require('bluebird');

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query('ALTER TABLE `trendata_dashboard_chart` CHANGE `trendata_dashboard_chart_order` `trendata_dashboard_chart_order` int(10) unsigned NULL AFTER `trendata_dashboard_chart_last_modified_by`, CHANGE `trendata_dashboard_chart_width` `trendata_dashboard_chart_width` decimal(10,0) NULL DEFAULT \'0\' AFTER `trendata_dashboard_chart_order`, CHANGE `trendata_dashboard_chart_height` `trendata_dashboard_chart_height` decimal(10,0) NULL DEFAULT \'0\' AFTER `trendata_dashboard_chart_width`');
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query('ALTER TABLE `trendata_dashboard_chart` CHANGE `trendata_dashboard_chart_order` `trendata_dashboard_chart_order` int(10) unsigned NOT NULL AFTER `trendata_dashboard_chart_last_modified_by`, CHANGE `trendata_dashboard_chart_width` `trendata_dashboard_chart_width` decimal(10,0) NOT NULL DEFAULT \'0\' AFTER `trendata_dashboard_chart_order`, CHANGE `trendata_dashboard_chart_height` `trendata_dashboard_chart_height` decimal(10,0) NOT NULL DEFAULT \'0\' AFTER `trendata_dashboard_chart_width`');
    }
};

'use strict';

module.exports = {

  /**
   * @param queryInterface
   * @param Sequelize
   */
  up: function (queryInterface, Sequelize) {
      return queryInterface.sequelize.query('ALTER TABLE `trendata_dashboard_chart` ADD `trendata_dashboard_chart_width` DECIMAL(10) NOT NULL DEFAULT "0" AFTER `trendata_dashboard_chart_order`, ADD `trendata_dashboard_chart_height` DECIMAL(10) NOT NULL DEFAULT "0" AFTER `trendata_dashboard_chart_width`;');
  },

  /**
   * @param queryInterface
   * @param Sequelize
   */
  down: function (queryInterface, Sequelize) {

  }
};

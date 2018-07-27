'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      'ALTER TABLE `trendata_dashboard_chart` ' +
      'ADD COLUMN `trendata_dashboard_chart_view` VARCHAR(255), ' +
      'ADD COLUMN `trendata_dashboard_chart_filters` TEXT, ' +
      'ADD COLUMN `trendata_dashboard_chart_time_span` VARCHAR(255), ' +
      'ADD COLUMN `trendata_dashboard_chart_vertical_axis` VARCHAR(255)'
    );
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};

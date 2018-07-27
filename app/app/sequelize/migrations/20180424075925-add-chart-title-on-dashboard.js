'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.sequelize.query(
          'ALTER TABLE `trendata_dashboard_chart` ' +
          'ADD COLUMN `trendata_dashboard_chart_title` VARCHAR(255), ' +
          'ADD COLUMN `trendata_dashboard_chart_description` TEXT'
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

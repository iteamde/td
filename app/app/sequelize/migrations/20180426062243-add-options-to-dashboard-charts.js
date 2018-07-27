'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
        'ALTER TABLE `trendata_dashboard_chart` ' +
        'ADD COLUMN `trendata_dashboard_chart_regression` INT(1), ' +
        'ADD COLUMN `trendata_dashboard_chart_hide_empty` INT(1)'
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

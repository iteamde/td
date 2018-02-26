'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('UPDATE `trendata_dashboard_chart` SET `trendata_dashboard_chart_width` = 2, `trendata_dashboard_chart_height` = 2, `x` = 0 WHERE `trendata_chart_id` IN (SELECT `trendata_chart_id` FROM `trendata_chart` WHERE `trendata_chart_type` = 2)');
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

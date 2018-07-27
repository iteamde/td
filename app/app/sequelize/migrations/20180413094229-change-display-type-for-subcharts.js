'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('UPDATE `trendata_chart` SET `trendata_chart_default_chart_display_type` = 6, `trendata_chart_type` = \'1\' WHERE `trendata_chart_type_id` IN (2, 3)');
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

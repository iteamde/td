'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.sequelize.query('UPDATE `trendata_chart` SET `trendata_chart_view` = \'total\' WHERE `trendata_chart_type_id` = 3'),
      queryInterface.sequelize.query('UPDATE `trendata_chart` SET `trendata_chart_view` = \'gender\' WHERE `trendata_chart_type_id` = 2')
    ])
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

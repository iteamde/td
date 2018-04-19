'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('ALTER TABLE `trendata_chart` ADD `trendata_chart_available_views` varchar(255)');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('trendata_chart', 'trendata_chart_available_views');
  }
};

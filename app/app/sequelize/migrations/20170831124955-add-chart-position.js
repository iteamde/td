'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('ALTER TABLE `trendata_dashboard_chart` ADD COLUMN `x` int, ADD COLUMN `y` int;');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('ALTER TABLE `trendata_dashboard_chart` DROP COLUMN `x`, DROP COLUMN `y`;');
  }
};

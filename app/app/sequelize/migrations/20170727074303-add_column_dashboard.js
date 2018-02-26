'use strict';

module.exports = {

  /**
   * @param queryInterface
   * @param Sequelize
   */
  up: function (queryInterface, Sequelize) {
      return queryInterface.sequelize.query('ALTER TABLE `trendata_dashboard` ADD `trendata_user_id` INT NOT NULL DEFAULT "0" AFTER `trendata_dashboard_id`;');
  },

  /**
   * @param queryInterface
   * @param Sequelize
   */
  down: function (queryInterface, Sequelize) {

  }
};

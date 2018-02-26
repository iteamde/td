'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.sequelize.query('INSERT INTO `trendata_setting` (`trendata_setting_id`, `trendata_setting_name`, `created_at`, `updated_at`) VALUES (NULL, \'connector_csv\', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);'),
      queryInterface.sequelize.query('ALTER TABLE `trendata_setting_value` CHANGE `trendata_setting_value` `trendata_setting_value` TEXT NOT NULL')
    ]);
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

'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.sequelize.query('INSERT INTO `trendata_metric_chart` (`trendata_metric_chart_id`, `trendata_metric_chart_created_by`, `trendata_metric_chart_last_modified_by`, `trendata_metric_chart_order`, `created_at`, `updated_at`, `trendata_metric_id`, `trendata_chart_id`) VALUES (NULL, NULL, NULL, \'0\', NOW(), NOW(), \'14\', \'102\')');
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

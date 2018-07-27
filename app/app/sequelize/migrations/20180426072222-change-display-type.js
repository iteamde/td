'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
        'INSERT INTO `trendata_chart_display_type` (' +
          '`trendata_chart_display_type_id` ,' +
          '`trendata_chart_display_type_created_by` ,' +
          '`trendata_chart_display_type_last_modified_by` ,' +
          '`trendata_chart_display_type_key` ,' +
          '`trendata_chart_display_type_title` ,' +
          '`trendata_chart_display_type_description` ,' +
          '`created_at` ,' +
          '`updated_at`' +
        ') VALUES (' +
          '11 , \'0\', \'0\', \'mscombi2d\',\'mscombi2d\', \'mscombi2d\', NOW(),  NOW()' +
        ')'
    ).then(function() {
      return queryInterface.sequelize.query('UPDATE `trendata_chart` SET `trendata_chart_default_chart_display_type` = 11 WHERE `trendata_chart_type_id` IN (2, 3)');
    });
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

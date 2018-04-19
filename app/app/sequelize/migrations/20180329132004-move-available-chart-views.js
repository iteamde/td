'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.sequelize.query('UPDATE `trendata_chart` SET `trendata_chart_available_views` = ? WHERE `trendata_chart_type_id` = 2', {
        replacements: [
          ['performance', 'city', 'state', 'country', 'department', 'division', 'cost center', 'gender', 'job level', 'commute distance'].join(',')
        ]
      }),
      queryInterface.sequelize.query('UPDATE `trendata_chart` SET `trendata_chart_available_views` = ? WHERE `trendata_chart_title_token` NOT IN (\'8736c65c-f63a-463b-a1d3-8769bd869555\', \'hires_vs_terminations\', \'average_age\', \'ethnic_diversity\', \'reports_per_manager\') AND `trendata_chart_type_id` = 3', {
        replacements: [
          ['total', 'performance', 'city', 'state', 'country', 'department', 'division', 'cost center', 'gender', 'job level', 'commute distance'].join(',')
        ]
      }),
      queryInterface.sequelize.query('UPDATE `trendata_chart` SET `trendata_chart_available_views` = ? WHERE `trendata_chart_title_token` IN (\'8736c65c-f63a-463b-a1d3-8769bd869555\', \'hires_vs_terminations\', \'average_age\', \'ethnic_diversity\', \'reports_per_manager\') AND `trendata_chart_type_id` = 3', {
        replacements: [
          'total'
        ]
      })
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

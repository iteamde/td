'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('trendata_bigdata_user', 'trendata_bigdata_nationality_country_id'),
      // queryInterface.removeColumn('trendata_bigdata_user', 'trendata_bigdata_gender_id'),
      queryInterface.removeColumn('trendata_bigdata_user', 'trendata_bigdata_hire_source_id'),
      // queryInterface.addColumn('trendata_bigdata_user', 'trendata_bigdata_user_gender', 'varchar(255)'),
      queryInterface.addColumn('trendata_bigdata_user', 'trendata_bigdata_hire_source', 'varchar(255)'),
      queryInterface.addColumn('trendata_bigdata_user', 'trendata_bigdata_user_education_history_level', 'varchar(255)'),
      queryInterface.addColumn('trendata_bigdata_user', 'trendata_bigdata_user_position_hire_date', 'date'),
      queryInterface.addColumn('trendata_bigdata_user', 'trendata_bigdata_user_position_termination_date', 'date'),
      queryInterface.addColumn('trendata_bigdata_user', 'trendata_bigdata_user_position_current_job_code', 'varchar(255)')
    ]).then(function() {
      return Promise.all([
        queryInterface.dropTable('trendata_bigdata_county'),
        // queryInterface.dropTable('trendata_bigdata_gender'),
        queryInterface.dropTable('trendata_bigdata_job'),
        queryInterface.dropTable('trendata_bigdata_hire_source'),
        queryInterface.dropTable('trendata_bigdata_user_education_history'),
        queryInterface.dropTable('trendata_bigdata_user_position'),
        queryInterface.dropTable('trendata_menu_permission'),
        queryInterface.dropTable('trendata_role_metric'),
        queryInterface.dropTable('trendata_user_address'),
        queryInterface.dropTable('trendata_user_role')
      ]);
    }).then(function() {
      return Promise.all([
        queryInterface.dropTable('trendata_role'),
        queryInterface.dropTable('trendata_menu'),
        queryInterface.dropTable('trendata_permission')
      ]);
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

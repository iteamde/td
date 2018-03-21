'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('trendata_bigdata_user', 'trendata_bigdata_user_address_address', 'varchar(255)'),
      queryInterface.addColumn('trendata_bigdata_user', 'trendata_bigdata_user_address_address_personal', 'varchar(255)'),
      queryInterface.addColumn('trendata_bigdata_user', 'trendata_bigdata_user_address_city', 'varchar(255)'),
      queryInterface.addColumn('trendata_bigdata_user', 'trendata_bigdata_user_address_city_personal', 'varchar(255)'),
      queryInterface.addColumn('trendata_bigdata_user', 'trendata_bigdata_user_address_state', 'varchar(255)'),
      queryInterface.addColumn('trendata_bigdata_user', 'trendata_bigdata_user_address_state_personal', 'varchar(255)'),
      queryInterface.addColumn('trendata_bigdata_user', 'trendata_bigdata_user_address_zipcode', 'varchar(255)'),
      queryInterface.addColumn('trendata_bigdata_user', 'trendata_bigdata_user_address_zipcode_personal', 'varchar(255)'),
      queryInterface.dropTable('trendata_bigdata_user_address')
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

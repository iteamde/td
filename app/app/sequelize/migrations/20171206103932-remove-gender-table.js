'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('ALTER TABLE `trendata_bigdata_user` DROP FOREIGN KEY `trendata_bigdata_user_ibfk_10`').then(function() {
      return queryInterface.renameColumn('trendata_bigdata_user', 'trendata_bigdata_gender_id', 'trendata_bigdata_user_gender').then(function() {
        return queryInterface.changeColumn('trendata_bigdata_user', 'trendata_bigdata_user_gender', {
          type: Sequelize.STRING(255),
          allowNull: false
        }).then(function() {
          return Promise.all([
            queryInterface.sequelize.query('UPDATE `trendata_bigdata_user` SET `trendata_bigdata_user_gender` = \'Male\' WHERE `trendata_bigdata_user_gender` = 1'),
            queryInterface.sequelize.query('UPDATE `trendata_bigdata_user` SET `trendata_bigdata_user_gender` = \'Female\' WHERE `trendata_bigdata_user_gender` = 2'),
            queryInterface.dropTable('trendata_bigdata_gender')
          ]);
        });
      });
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

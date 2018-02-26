'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('trendata_video', {
      trendata_video_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
      },
      trendata_video_url: {
          type: Sequelize.STRING(255),
          allowNull: false
      },
      trendata_video_video: {
          type: Sequelize.STRING(255),
          allowNull: false
      },
      created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
      }
  }, {
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
  })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('trendata_video');
  }
};

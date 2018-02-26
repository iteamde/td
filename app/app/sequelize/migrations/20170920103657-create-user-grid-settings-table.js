'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('trendata_users_grid_settings', {
        trendata_users_grid_settings_id: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        trendata_users_grid_settings_user_id: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false
        },
        trendata_users_grid_settings_chart_id: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false
        },
        trendata_users_grid_settings_fields: {
            type: Sequelize.STRING(255),
            allowNull: false,
            defaultValue: 'full name,location,manager,department'
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
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('trendata_users_grid_settings')
  }
};

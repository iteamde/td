'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('trendata_alert', {
      trendata_alert_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      trendata_alert_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      trendata_alert_type: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      trendata_alert_user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      trendata_alert_criteria: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      trendata_alert_chart_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      trendata_alert_chart_type_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      trendata_alert_chart_view: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      trendata_alert_chart_view_item: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      trendata_alert_trigger: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      trendata_alert_status: {
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 1
      },
      trendata_alert_filters: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      trendata_alert_condition: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      trendata_alert_value: {
        type: Sequelize.FLOAT(10, 2),
        allowNull: true
      },
      trendata_alert_points: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      trendata_alert_date: {
        type: Sequelize.STRING(255),
        allowNull: true
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
    return queryInterface.dropTable('trendata_alert');
  }
};

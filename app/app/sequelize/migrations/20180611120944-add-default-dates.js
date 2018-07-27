'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.sequelize.query('ALTER TABLE \`trendata_bigdata_country\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_bigdata_custom_field\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_bigdata_custom_field_value\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_bigdata_user\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_chart\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_chart_display_type\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_chart_tag\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_chart_type\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_connector_csv\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_country\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_dashboard\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_dashboard_chart\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_email_template\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_event\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_event_category\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_financial_data\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_language\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_login_details\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_metric\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_metric_chart\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_performance\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_sql_query\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_tag\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),

      queryInterface.sequelize.query('UPDATE \`trendata_translation\` SET \`created_at\` = CURRENT_TIMESTAMP, \`updated_at\` = CURRENT_TIMESTAMP').then(function() {
        return queryInterface.sequelize.query('ALTER TABLE \`trendata_translation\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
      }),

      queryInterface.sequelize.query('ALTER TABLE \`trendata_user\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_alert\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_setting\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_setting_value\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_users_grid_settings\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_video\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      queryInterface.sequelize.query('ALTER TABLE \`trendata_user_activity\` MODIFY COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  MODIFY COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
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

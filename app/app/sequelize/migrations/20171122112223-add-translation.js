'use strict';

/**
 * @param queryInterface
 * @param Sequelize
 * @param token
 * @param text
 * @param langId
 * @return {Promise}
 */
function addTranslation(queryInterface, Sequelize, token, text, langId) {
    return queryInterface.sequelize.query(
        'SELECT COUNT(*) AS `count` FROM `trendata_translation` WHERE `trendata_translation_token` = ? AND `trendata_language_id` = ?',
        {
            type: Sequelize.QueryTypes.SELECT,
            replacements: [
                token,
                langId
            ]
        }
    ).then(function (rows) {
        if (rows[0].count) {
            return;
        }

        return queryInterface.sequelize.query(
            'INSERT INTO ' +
            '`trendata_translation` ' +
            '(`trendata_translation_text`, `trendata_translation_token`, `created_at`, `updated_at`, `trendata_language_id`) ' +
            'VALUES ' +
            '(?, ?, now(), now(), ?)'
            , {
                replacements: [
                    text,
                    token,
                    langId
                ]
            });
    });
}

/**
 * @param queryInterface
 * @param token
 * @param langId
 * @return {Promise}
 */
function removeTranslation(queryInterface, token, langId) {
    return queryInterface.sequelize.query('DELETE FROM `trendata_translation` WHERE `trendata_translation_token` = ? AND `trendata_language_id` = ?', {
        replacements: [
            token,
            langId
        ]
    });
}

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      addTranslation(queryInterface, Sequelize, 'alerts', 'Alerts', 1),
      addTranslation(queryInterface, Sequelize, 'trigger', 'Trigger', 1),
      addTranslation(queryInterface, Sequelize, 'activate', 'Activate', 1),
      addTranslation(queryInterface, Sequelize, 'deactivate', 'Deactivate', 1),
      addTranslation(queryInterface, Sequelize, 'alert_name', 'Alert Name', 1),
      addTranslation(queryInterface, Sequelize, 'threshold_based', 'Threshold-Based', 1),
      addTranslation(queryInterface, Sequelize, 'periodic', 'Periodic', 1),
      addTranslation(queryInterface, Sequelize, 'criteria', 'Criteria', 1),
      addTranslation(queryInterface, Sequelize, 'notify_on', 'Notify On', 1),
      addTranslation(queryInterface, Sequelize, 'notify_when', 'Notify When', 1),
      addTranslation(queryInterface, Sequelize, 'manage_alerts', 'Manage Alerts', 1),
      addTranslation(queryInterface, Sequelize, 'exceed', 'Exceed', 1),
      addTranslation(queryInterface, Sequelize, 'equals', 'Equals', 1),
      addTranslation(queryInterface, Sequelize, 'below', 'Below', 1),
      addTranslation(queryInterface, Sequelize, 'start_of_week', 'Start of Week', 1),
      addTranslation(queryInterface, Sequelize, 'start_of_quarter', 'Start of Quarter', 1),
      addTranslation(queryInterface, Sequelize, 'start_of_month', 'Start of Month', 1),
      addTranslation(queryInterface, Sequelize, 'percentage_%', 'Percentage (%)', 1),
      addTranslation(queryInterface, Sequelize, 'value', 'Value', 1),
      addTranslation(queryInterface, Sequelize, 'percentage_difference_from_previous_month', 'Percentage difference from previous month', 1),
      addTranslation(queryInterface, Sequelize, 'custom', 'Custom', 1),
      addTranslation(queryInterface, Sequelize, 'alert_add_success', 'Alert created successfully', 1),
      addTranslation(queryInterface, Sequelize, 'delete_alert_confirm', 'Do you want to delete this alert?', 1),
      addTranslation(queryInterface, Sequelize, 'no_alerts', 'There are no alerts yet', 1),
      addTranslation(queryInterface, Sequelize, 'any', 'Any', 1)
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      removeTranslation(queryInterface, 'alerts', 1),
      removeTranslation(queryInterface, 'trigger', 1),
      removeTranslation(queryInterface, 'activate', 1),
      removeTranslation(queryInterface, 'deactivate', 1),
      removeTranslation(queryInterface, 'alert_name', 1),
      removeTranslation(queryInterface, 'threshold_based', 1),
      removeTranslation(queryInterface, 'periodic', 1),
      removeTranslation(queryInterface, 'criteria', 1),
      removeTranslation(queryInterface, 'notify_on', 1),
      removeTranslation(queryInterface, 'notify_when', 1),
      removeTranslation(queryInterface, 'manage_alerts', 1),
      removeTranslation(queryInterface, 'exceed', 1),
      removeTranslation(queryInterface, 'equals', 1),
      removeTranslation(queryInterface, 'below', 1),
      removeTranslation(queryInterface, 'start_of_week', 1),
      removeTranslation(queryInterface, 'start_of_quarter', 1),
      removeTranslation(queryInterface, 'start_of_month', 1),
      removeTranslation(queryInterface, 'percentage_%', 1),
      removeTranslation(queryInterface, 'value', 1),
      removeTranslation(queryInterface, 'percentage_difference_from_previous_month', 1),
      removeTranslation(queryInterface, 'custom', 1),
      removeTranslation(queryInterface, 'alert_add_success', 1),
      removeTranslation(queryInterface, 'delete_alert_confirm', 1),
      removeTranslation(queryInterface, 'no_alerts', 1),
      removeTranslation(queryInterface, 'any', 1)
    ]);
  }
};

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
      addTranslation(queryInterface, Sequelize, 'city', 'City', 1),
      addTranslation(queryInterface, Sequelize, 'state', 'State', 1),
      addTranslation(queryInterface, Sequelize, 'division', 'Division', 1),
      addTranslation(queryInterface, Sequelize, 'cost center', 'Cost Center', 1),
      addTranslation(queryInterface, Sequelize, 'gender', 'Gender', 1),
      addTranslation(queryInterface, Sequelize, 'job level', 'Job Level', 1),
      addTranslation(queryInterface, Sequelize, 'commute distance', 'Commute Distance', 1),
      addTranslation(queryInterface, Sequelize, 'total', 'Total', 1),
      addTranslation(queryInterface, Sequelize, 'Percentage (%)', 'Percentage (%)', 1),
      addTranslation(queryInterface, Sequelize, 'Values', 'Values', 1),
      addTranslation(queryInterface, Sequelize, 'Dollars ($)', 'Dollars ($)', 1)
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      removeTranslation(queryInterface, 'total', 1),
      removeTranslation(queryInterface, 'city', 1),
      removeTranslation(queryInterface, 'state', 1),
      removeTranslation(queryInterface, 'division', 1),
      removeTranslation(queryInterface, 'cost center', 1),
      removeTranslation(queryInterface, 'gender', 1),
      removeTranslation(queryInterface, 'job level', 1),
      removeTranslation(queryInterface, 'commute distance', 1),
      removeTranslation(queryInterface, 'Percentage (%)', 1),
      removeTranslation(queryInterface, 'Values', 1),
      removeTranslation(queryInterface, 'Dollars ($)', 1),
    ]);
  }
};

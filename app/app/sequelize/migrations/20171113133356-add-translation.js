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
      addTranslation(queryInterface, Sequelize, 'Gross Revenue', 'Gross Revenue', 1),
      addTranslation(queryInterface, Sequelize, 'Net Revenue', 'Net Revenue', 1),
      addTranslation(queryInterface, Sequelize, 'HR Costs', 'HR Costs', 1),
      addTranslation(queryInterface, Sequelize, 'HR Settlement', 'HR Settlement', 1),
      addTranslation(queryInterface, Sequelize, 'Cost of Benefits', 'Cost of Benefits', 1),
      addTranslation(queryInterface, Sequelize, 'Hiring Costs', 'Hiring Costs', 1),
      addTranslation(queryInterface, Sequelize, 'Termination Costs', 'Termination Costs', 1)
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      removeTranslation(queryInterface, 'Gross Revenue', 1),
      removeTranslation(queryInterface, 'Net Revenue', 1),
      removeTranslation(queryInterface, 'HR Costs', 1),
      removeTranslation(queryInterface, 'HR Settlement', 1),
      removeTranslation(queryInterface, 'Cost of Benefits', 1),
      removeTranslation(queryInterface, 'Hiring Costs', 1),
      removeTranslation(queryInterface, 'Termination Costs', 1)
    ]);
  }
};

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
      addTranslation(queryInterface, Sequelize, 'search_by_label', 'Search by Label', 1),
      addTranslation(queryInterface, Sequelize, 'show_more', 'Show More', 1),
      addTranslation(queryInterface, Sequelize, 'show_less', 'Show Less', 1)
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      removeTranslation(queryInterface, 'search_by_label', 1),
      removeTranslation(queryInterface, 'show_more', 1),
      removeTranslation(queryInterface, 'show_less', 1)
    ]);
  }
};

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
      addTranslation(queryInterface, Sequelize, 'fields_name_must_be_unique', 'Fields name must be unique', 1),
      addTranslation(queryInterface, Sequelize, 'fields_name_cant_be_empty', 'Field name can not be empty', 1),
      addTranslation(queryInterface, Sequelize, 'all_rows_were_successfully_inserted', 'All rows were successfully inserted', 1)
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      removeTranslation(queryInterface, 'fields_name_must_be_unique', 1),
      removeTranslation(queryInterface, 'fields_name_cant_be_empty', 1),
      removeTranslation(queryInterface, 'all_rows_were_successfully_inserted', 1)
    ]);
  }
};

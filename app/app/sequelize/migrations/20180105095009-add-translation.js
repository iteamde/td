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
      addTranslation(queryInterface, Sequelize, 'reorder', 'Reorder', 1),
      addTranslation(queryInterface, Sequelize, 'edit_field_name', 'Edit Field Name', 1),
      addTranslation(queryInterface, Sequelize, 'save_field_name', 'Save Field Name', 1),
      addTranslation(queryInterface, Sequelize, 'enable', 'Enable', 1),
      addTranslation(queryInterface, Sequelize, 'disable', 'Disable', 1)
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      removeTranslation(queryInterface, 'reorder', 1),
      removeTranslation(queryInterface, 'edit_field_name', 1),
      removeTranslation(queryInterface, 'save_field_name', 1),
      removeTranslation(queryInterface, 'enable', 1),
      removeTranslation(queryInterface, 'disable', 1)
    ]);
  }
};

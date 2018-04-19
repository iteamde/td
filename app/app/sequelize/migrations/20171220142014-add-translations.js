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
      addTranslation(queryInterface, Sequelize, 'performance', 'Performance', 1),
      addTranslation(queryInterface, Sequelize, 'add_new_row', 'Add New Row', 1),
      addTranslation(queryInterface, Sequelize, 'performance_deleted_successfully', 'Performance deleted successfully', 1),
      addTranslation(queryInterface, Sequelize, 'delete_performance_confirm', 'Do you want to delete this performance?', 1),
      addTranslation(queryInterface, Sequelize, 'edit_performance', 'Edit Performance', 1),
      addTranslation(queryInterface, Sequelize, 'delete_performance', 'Delete Performance', 1),
      addTranslation(queryInterface, Sequelize, 'numeric_score', 'Numeric Score', 1)
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      removeTranslation(queryInterface, 'performance', 1),
      removeTranslation(queryInterface, 'add_new_row', 1),
      removeTranslation(queryInterface, 'performance_deleted_successfully', 1),
      removeTranslation(queryInterface, 'delete_performance_confirm', 1),
      removeTranslation(queryInterface, 'edit_performance', 1),
      removeTranslation(queryInterface, 'delete_performance', 1),
      removeTranslation(queryInterface, 'numeric_score', 1)
    ]);
  }
};

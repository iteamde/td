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
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: function (queryInterface, Sequelize) {
        return addTranslation(queryInterface, Sequelize, 'vertical_axis', 'Vertical Axis', 1)
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: function (queryInterface, Sequelize) {
        return removeTranslation(queryInterface, 'vertical_axis', 1);
    }
};

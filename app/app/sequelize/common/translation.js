'use strict';

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     * @param token
     * @param text
     * @param langId
     * @returns {*}
     */
    add: function (queryInterface, Sequelize, token, text, langId) {
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
    },

    /**
     * @param queryInterface
     * @param token
     * @param langId
     * @returns {*}
     */
    remove: function (queryInterface, token, langId) {
        return queryInterface.sequelize.query('DELETE FROM `trendata_translation` WHERE `trendata_translation_token` = ? AND `trendata_language_id` = ?', {
            replacements: [
                token,
                langId
            ]
        });
    }
};

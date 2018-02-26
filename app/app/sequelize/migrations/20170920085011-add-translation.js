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
        return Promise.all([
            addTranslation(queryInterface, Sequelize, 'minimum_6_character', 'Minimum 6 character', 1),
            addTranslation(queryInterface, Sequelize, 'uppercase_and_lowercase_letter', 'Uppercase and lowercase letter', 1),
            addTranslation(queryInterface, Sequelize, 'a_number', 'A number', 1),
            addTranslation(queryInterface, Sequelize, 'passwords_doesn’t_match', 'Passwords doesn’t match', 1),
            addTranslation(queryInterface, Sequelize, 'password_must_contains’t_match', 'Password must contains', 1)
        ]);
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            removeTranslation(queryInterface, 'minimum_6_character', 1),
            removeTranslation(queryInterface, 'uppercase_and_lowercase_letter', 1),
            removeTranslation(queryInterface, 'a_number', 1),
            removeTranslation(queryInterface, 'passwords_doesn’t_match', 1),
            removeTranslation(queryInterface, 'password_must_contains’t_match', 1)
        ]);
    }
};

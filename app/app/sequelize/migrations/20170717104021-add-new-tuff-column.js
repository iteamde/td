'use strict';

var Promise = require('bluebird');

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
            queryInterface.sequelize.query('ALTER TABLE `trendata_bigdata_user` ADD `trendata_bigdata_user_division` varchar(255) COLLATE \'utf8_unicode_ci\' NULL AFTER `trendata_bigdata_user_department`, ADD `trendata_bigdata_user_cost_center` varchar(255) COLLATE \'utf8_unicode_ci\' NULL AFTER `trendata_bigdata_user_division`'),
            addTranslation(queryInterface, Sequelize, 'division_data_dictionary_field_name', 'Division', 1),
            addTranslation(queryInterface, Sequelize, 'division_data_dictionary_field_description', 'The name of the division to which the employee currently belongs', 1),
            addTranslation(queryInterface, Sequelize, 'cost_center_data_dictionary_field_name', 'Cost Center', 1),
            addTranslation(queryInterface, Sequelize, 'cost_center_data_dictionary_field_description', 'The name of the cost center to which the employee currently belongs', 1)
        ]);
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.sequelize.query('ALTER TABLE `trendata_bigdata_user` DROP `trendata_bigdata_user_division`, DROP `trendata_bigdata_user_cost_center`'),
            removeTranslation(queryInterface, 'division_data_dictionary_field_name', 1),
            removeTranslation(queryInterface, 'division_data_dictionary_field_description', 1),
            removeTranslation(queryInterface, 'cost_center_data_dictionary_field_name', 1),
            removeTranslation(queryInterface, 'cost_center_data_dictionary_field_description', 1)
        ]);
    }
};

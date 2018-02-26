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
            queryInterface.sequelize.query('UPDATE `trendata_chart` SET `trendata_chart_description_token` = \'cost_per_hire_chart_description\' WHERE `trendata_chart_id` = \'59\''),
            queryInterface.sequelize.query('UPDATE `trendata_chart` SET `trendata_chart_description_token` = \'absences_average_chart_description\' WHERE `trendata_chart_id` = \'73\''),
            queryInterface.sequelize.query('UPDATE `trendata_chart` SET `trendata_chart_description_token` = \'time_to_fill_chart_description\' WHERE `trendata_chart_id` = \'58\''),
            queryInterface.sequelize.query('UPDATE `trendata_chart` SET `trendata_chart_description_token` = \'number_of_employees_chart_description\' WHERE `trendata_chart_id` = \'61\''),
            queryInterface.sequelize.query('UPDATE `trendata_chart` SET `trendata_chart_description_token` = \'revenue_per_employee_chart_description\' WHERE `trendata_chart_id` = \'71\''),
            addTranslation(queryInterface, Sequelize, 'cost_per_hire_chart_description', 'This chart shows the average cost per hire for last month. Cost of hire can be tracked from the TUFF (per hire) or Financial Inputs page (monthly). The TUFF value overrides that in Financial Inputs.', 1),
            addTranslation(queryInterface, Sequelize, 'absences_average_chart_description', 'This chart shows the YTD absences average of active employees.', 1),
            addTranslation(queryInterface, Sequelize, 'time_to_fill_chart_description', 'This chart shows the time difference between posting a job and filling it for hires of last month.', 1),
            addTranslation(queryInterface, Sequelize, 'number_of_employees_chart_description', 'Active employees in the company.', 1),
            addTranslation(queryInterface, Sequelize, 'revenue_per_employee_chart_description', 'Dividing last month\'s gross revenue by number of active employees generate the Revenue per Employee. The gross revenue is populated from Financial Inputs page.', 1)
        ]);
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            removeTranslation(queryInterface, 'cost_per_hire_chart_description', 1),
            removeTranslation(queryInterface, 'absences_average_chart_description', 1),
            removeTranslation(queryInterface, 'time_to_fill_chart_description', 1),
            removeTranslation(queryInterface, 'number_of_employees_chart_description', 1),
            removeTranslation(queryInterface, 'revenue_per_employee_chart_description', 1)
        ]);
    }
};

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
     * @return {Promise.<*[]>}
     */
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.sequelize.query(
                'INSERT INTO `trendata_chart` (`trendata_chart_key`, `trendata_chart_created_by`, `trendata_chart_last_modified_by`, `trendata_chart_title_token`, `trendata_chart_description_token`, `trendata_chart_status`, `trendata_chart_position_x`, `trendata_chart_position_y`, `trendata_chart_width`, `trendata_chart_height`, `trendata_chart_type`, `trendata_chart_default_chart_display_type`, `created_at`, `updated_at`, `trendata_chart_type_id`, `trendata_chart_id_parent`) VALUES (\'\', 0, 0, \'hires_vs_terminations\', \'hires_vs_terminations_metric_description\', \'1\', 0, 0, 3, 4, \'1\', 6, \'2017-07-25 15:35:20\', \'2017-07-25 15:35:20\', 1, NULL)'
            ).spread(function (metadata) {
                return Promise.all([
                    queryInterface.sequelize.query(
                        'INSERT INTO `trendata_dashboard_chart` (`trendata_dashboard_chart_created_by`, `trendata_dashboard_chart_last_modified_by`, `trendata_dashboard_chart_order`, `created_at`, `updated_at`, `trendata_dashboard_id`, `trendata_chart_id`) VALUES (0, 0, 8, \'2017-07-25 15:37:10\', \'2017-07-25 12:47:55\', 1, ?)',
                        {
                            replacements: [
                                metadata.insertId
                            ]
                        }
                    ),
                    queryInterface.sequelize.query(
                        'INSERT INTO `trendata_sql_query` (`trendata_sql_query_template`, `trendata_sql_query_custom_source`, `trendata_sql_query_module_path`, `created_at`, `updated_at`, `trendata_chart_id`) VALUES (NULL, NULL, \'hires-vs-terminations/metric\', \'2017-07-25 15:39:27\', \'2017-07-25 15:39:27\', ?)',
                        {
                            replacements: [
                                metadata.insertId
                            ]
                        }
                    ),

                    queryInterface.sequelize.query(
                        'INSERT INTO `trendata_chart` (`trendata_chart_key`, `trendata_chart_created_by`, `trendata_chart_last_modified_by`, `trendata_chart_title_token`, `trendata_chart_description_token`, `trendata_chart_status`, `trendata_chart_position_x`, `trendata_chart_position_y`, `trendata_chart_width`, `trendata_chart_height`, `trendata_chart_type`, `trendata_chart_default_chart_display_type`, `created_at`, `updated_at`, `trendata_chart_type_id`, `trendata_chart_id_parent`) VALUES (\'\', 0, 0, \'\', \'\', \'1\', 0, 0, 3, 4, \'1\', 6, \'2017-07-25 15:35:20\', \'2017-07-25 15:35:20\', 2, ?)',
                        {
                            replacements: [
                                metadata.insertId
                            ]
                        }
                    ).spread(function (metadata) {
                        return queryInterface.sequelize.query(
                            'INSERT INTO `trendata_sql_query` (`trendata_sql_query_template`, `trendata_sql_query_custom_source`, `trendata_sql_query_module_path`, `created_at`, `updated_at`, `trendata_chart_id`) VALUES (NULL, NULL, \'hires-vs-terminations/drilldown\', \'2017-07-25 15:39:27\', \'2017-07-25 15:39:27\', ?)',
                            {
                                replacements: [
                                    metadata.insertId
                                ]
                            }
                        );
                    }),

                    queryInterface.sequelize.query(
                        'INSERT INTO `trendata_chart` (`trendata_chart_key`, `trendata_chart_created_by`, `trendata_chart_last_modified_by`, `trendata_chart_title_token`, `trendata_chart_description_token`, `trendata_chart_status`, `trendata_chart_position_x`, `trendata_chart_position_y`, `trendata_chart_width`, `trendata_chart_height`, `trendata_chart_type`, `trendata_chart_default_chart_display_type`, `created_at`, `updated_at`, `trendata_chart_type_id`, `trendata_chart_id_parent`) VALUES (\'\', 0, 0, \'\', \'\', \'1\', 0, 0, 3, 4, \'1\', 6, \'2017-07-25 15:35:20\', \'2017-07-25 15:35:20\', 3, ?)',
                        {
                            replacements: [
                                metadata.insertId
                            ]
                        }
                    ).spread(function (metadata) {
                        return queryInterface.sequelize.query(
                            'INSERT INTO `trendata_sql_query` (`trendata_sql_query_template`, `trendata_sql_query_custom_source`, `trendata_sql_query_module_path`, `created_at`, `updated_at`, `trendata_chart_id`) VALUES (NULL, NULL, \'hires-vs-terminations/analytics\', \'2017-07-25 15:39:27\', \'2017-07-25 15:39:27\', ?)',
                            {
                                replacements: [
                                    metadata.insertId
                                ]
                            }
                        );
                    })
                ]);
            }),
            addTranslation(queryInterface, Sequelize, 'hires_vs_terminations', 'Hires vs Terminations', 1),
            addTranslation(queryInterface, Sequelize, 'hires_vs_terminations_metric_description', 'This metric shows number of hires and terminations of the organization for last month', 1)
        ]);
    },

    /**
     * @param queryInterface
     * @param Sequelize
     * @return {Promise.<*[]>}
     */
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            removeTranslation(queryInterface, 'hires_vs_terminations', 1),
            removeTranslation(queryInterface, 'hires_vs_terminations_metric_description', 1)
        ]);
    }
};

'use strict';

var Promise = require('bluebird');

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query(
            'SELECT ' +
            '`trendata_chart_id` AS `id` ' +
            'FROM ' +
            '`trendata_chart` ' +
            'WHERE ' +
            '`trendata_chart_title_token` = ? ' +
            'AND ' +
            '`trendata_chart_description_token` = ? ' +
            'LIMIT 1',
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [
                    'reports_per_manager',
                    'reports_per_manager_metric_description'
                ]
            }
        ).then(function (rows) {
            if (!rows.length) {
                return;
            }

            return queryInterface.sequelize.query(
                'UPDATE ' +
                '`trendata_chart` ' +
                'SET ' +
                '`trendata_chart_type` = ? ' +
                'WHERE ' +
                '`trendata_chart_id` = ?',
                {
                    replacements: [
                        2,
                        rows[0].id
                    ]
                }
            );
        });
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query(
            'SELECT ' +
            '`trendata_chart_id` AS `id` ' +
            'FROM ' +
            '`trendata_chart` ' +
            'WHERE ' +
            '`trendata_chart_title_token` = ? ' +
            'AND ' +
            '`trendata_chart_description_token` = ? ' +
            'LIMIT 1',
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [
                    'reports_per_manager',
                    'reports_per_manager_metric_description'
                ]
            }
        ).then(function (rows) {
            if (!rows.length) {
                return;
            }

            return queryInterface.sequelize.query(
                'UPDATE ' +
                '`trendata_chart` ' +
                'SET ' +
                '`trendata_chart_type` = ? ' +
                'WHERE ' +
                '`trendata_chart_id` = ?',
                {
                    replacements: [
                        1,
                        rows[0].id
                    ]
                }
            );
        });
    }
};

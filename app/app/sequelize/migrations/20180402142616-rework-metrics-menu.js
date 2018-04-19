'use strict';

var Promise = require('bluebird');

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query('DELETE FROM `trendata_metric_chart`')
            .then(function() {
                return queryInterface.sequelize.query('DELETE FROM `trendata_metric`');
            }).then(function() {
                return queryInterface.sequelize.query(
                    'INSERT INTO `trendata_metric`' +
                    '(`trendata_metric_id`, `trendata_metric_title_token`, `trendata_metric_description_token`, `trendata_metric_icon`, `created_at`, `updated_at`) VALUES ' +
                    '(1, \'recruiting\', \'\', \'fa fa-binoculars\', NOW(), NOW()),' +
                    '(2, \'financial\', \'\', \'fa fa-usd\', NOW(), NOW()),' +
                    '(3, \'talent\', \'\', \'fa fa-street-view\', NOW(), NOW()),' +
                    '(4, \'organization\', \'\', \'fa fa-users\', NOW(), NOW())'
                );
            }).then(function() {
                return Promise.each([
                    'INSERT INTO `trendata_metric_chart` ' +
                    '(`trendata_metric_chart_order`, `trendata_metric_id`, `trendata_chart_id`, `created_at`, `updated_at`) VALUES ' +
                    '(1, 1, 59, NOW(), NOW()), ' +
                    '(2, 1, 55, NOW(), NOW()), ' +
                    '(3, 1, 58, NOW(), NOW()), ' +
                    '(1, 2, 60, NOW(), NOW()), ' +
                    '(2, 2, 17, NOW(), NOW()), ' +
                    '(3, 2, 71, NOW(), NOW()), ' +
                    '(1, 3, 29, NOW(), NOW()), ' +
                    '(2, 3, 74, NOW(), NOW()), ' +
                    '(3, 3, 75, NOW(), NOW()), ' +
                    '(1, 4, 7, NOW(), NOW()), ' +
                    '(2, 4, 96, NOW(), NOW()), ' +
                    '(3, 4, 30, NOW(), NOW()), ' +
                    '(4, 4, 61, NOW(), NOW()), ' +
                    '(5, 4, 105, NOW(), NOW()), ' +
                    '(6, 4, 102, NOW(), NOW()), ' +
                    '(7, 4, 99, NOW(), NOW()), ' +
                    '(8, 4, 73, NOW(), NOW())',

                    'UPDATE `trendata_chart` SET `trendata_chart_id` = 96 WHERE `trendata_chart_description_token` = \'hires_vs_terminations_metric_description\'',
                    'UPDATE `trendata_chart` SET `trendata_chart_id` = 105 WHERE `trendata_chart_description_token` = \'reports_per_manager_metric_description\'',
                    'UPDATE `trendata_chart` SET `trendata_chart_id` = 102 WHERE `trendata_chart_description_token` = \'ethnic_diversity_metric_description\'',
                    'UPDATE `trendata_chart` SET `trendata_chart_id` = 99 WHERE `trendata_chart_description_token` = \'average_age_metric_description\''
                ], function (sql) {
                    return queryInterface.sequelize.query(sql);
                });

                /*return Promise.all([
                  queryInterface.sequelize.query(
                    'INSERT INTO `trendata_metric_chart` ' +
                    '(`trendata_metric_chart_order`, `trendata_metric_id`, `trendata_chart_id`, `created_at`, `updated_at`) VALUES ' +
                    '(1, 1, 59, NOW(), NOW()), ' +
                    '(2, 1, 55, NOW(), NOW()), ' +
                    '(3, 1, 58, NOW(), NOW()), ' +
                    '(1, 2, 60, NOW(), NOW()), ' +
                    '(2, 2, 17, NOW(), NOW()), ' +
                    '(3, 2, 71, NOW(), NOW()), ' +
                    '(1, 3, 29, NOW(), NOW()), ' +
                    '(2, 3, 74, NOW(), NOW()), ' +
                    '(3, 3, 75, NOW(), NOW()), ' +
                    '(1, 4, 7, NOW(), NOW()), ' +
                    '(2, 4, 96, NOW(), NOW()), ' +
                    '(3, 4, 30, NOW(), NOW()), ' +
                    '(4, 4, 61, NOW(), NOW()), ' +
                    '(5, 4, 105, NOW(), NOW()), ' +
                    '(6, 4, 102, NOW(), NOW()), ' +
                    '(7, 4, 99, NOW(), NOW()), ' +
                    '(8, 4, 73, NOW(), NOW())'
                  ),
                  queryInterface.sequelize.query(
                    'UPDATE `trendata_chart` SET `trendata_chart_id` = 96 WHERE `trendata_chart_description_token` = \'hires_vs_terminations_metric_description\''
                  ),
                  queryInterface.sequelize.query(
                    'UPDATE `trendata_chart` SET `trendata_chart_id` = 105 WHERE `trendata_chart_description_token` = \'reports_per_manager_metric_description\''
                  ),
                  queryInterface.sequelize.query(
                    'UPDATE `trendata_chart` SET `trendata_chart_id` = 102 WHERE `trendata_chart_description_token` = \'ethnic_diversity_metric_description\''
                  ),
                  queryInterface.sequelize.query(
                    'UPDATE `trendata_chart` SET `trendata_chart_id` = 99 WHERE `trendata_chart_description_token` = \'average_age_metric_description\''
                  )
                ]);*/
            })
    },

    down: function (queryInterface, Sequelize) {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.dropTable('users');
        */
    }
};

'use strict';

var Promise = require('bluebird');

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query('INSERT INTO `trendata_metric_chart` (`trendata_metric_chart_id`, `trendata_metric_chart_created_by`, `trendata_metric_chart_last_modified_by`, `trendata_metric_chart_order`, `created_at`, `updated_at`, `trendata_metric_id`, `trendata_chart_id`) VALUES (NULL, NULL, NULL, 0, NOW(), NOW(), \'1\', \'96\')').then(function () {
            return queryInterface.sequelize.query('INSERT INTO `trendata_translation` (`trendata_translation_id`, `trendata_translation_text`, `trendata_translation_token`, `created_at`, `updated_at`, `trendata_language_id`) VALUES (NULL, \'Demographics\', \'demographics\', NOW(), NOW(), \'1\')');
        }).then(function () {
            queryInterface.sequelize.query('INSERT INTO `trendata_metric` (`trendata_metric_id`, `trendata_metric_created_by`, `trendata_metric_last_modified_by`, `trendata_metric_title_token`, `trendata_metric_description_token`, `trendata_metric_status`, `trendata_metric_icon`, `created_at`, `updated_at`) VALUES (NULL, NULL, NULL, \'demographics\', \'demographics\', \'1\', \'fa fa-users\', NOW(), NOW())')
        }).then(function () {
            queryInterface.sequelize.query('INSERT INTO `trendata_metric_chart` (`trendata_metric_chart_id`, `trendata_metric_chart_created_by`, `trendata_metric_chart_last_modified_by`, `trendata_metric_chart_order`, `created_at`, `updated_at`, `trendata_metric_id`, `trendata_chart_id`) VALUES (NULL, NULL, NULL, 0, NOW(), NOW(), \'14\', \'61\'), (NULL, NULL, NULL, \'0\', NOW(), NOW(), \'14\', \'99\')')
        });
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: function (queryInterface, Sequelize) {
        return Promise.resolve();
    }
};

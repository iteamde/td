'use strict';

var Promise = require('bluebird');

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: async (queryInterface, Sequelize) => {
        let chart = await queryInterface.sequelize.query(
            'SELECT * FROM `trendata_chart` WHERE `trendata_chart_description_token` = \'turnover_metric_description\' LIMIT 1',
            {
                type: Sequelize.QueryTypes.SELECT
            }
        ).then(function (rows) {
            if (rows.length) {
                return rows[0];
            }
        });

        if (!chart) {
            return;
        }

        return queryInterface.sequelize.query(
            'UPDATE `trendata_chart` SET `trendata_chart_available_views` = CONCAT(`trendata_chart_available_views`, \',separation type\') WHERE `trendata_chart_id_parent` = ? AND `trendata_chart_type_id` IN (2, 3)',
            {
                replacements: [
                    chart.trendata_chart_id
                ]
            }
        );
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: (queryInterface, Sequelize) => {

    }
};

'use strict';

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query(
            'UPDATE `trendata_translation` SET `trendata_translation_text` = ? WHERE `trendata_translation_token` = ? AND trendata_language_id = 1',
            {
                type: Sequelize.QueryTypes.UPDATE,
                replacements: [
                    'This chart shows the distribution of ethnicity for active employees.',
                    'ethnic_diversity_metric_description'
                ]
            }
        )
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: function (queryInterface, Sequelize) {

    }
};

'use strict';

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(`ALTER TABLE \`trendata_dashboard_chart\` CHANGE \`trendata_dashboard_chart_filters\` \`trendata_dashboard_chart_filters\` longtext COLLATE 'utf8_unicode_ci' NULL AFTER \`trendata_dashboard_chart_view\``);
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(`ALTER TABLE \`trendata_dashboard_chart\` CHANGE \`trendata_dashboard_chart_filters\` \`trendata_dashboard_chart_filters\` text COLLATE 'utf8_unicode_ci' NULL AFTER \`trendata_dashboard_chart_view\``);
    }
};

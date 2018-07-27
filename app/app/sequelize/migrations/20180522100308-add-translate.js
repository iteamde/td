'use strict';

var translation = require('../common/translation');

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: (queryInterface, Sequelize) => {
        return translation.add(queryInterface, Sequelize, 'chart_added_to_dashboard_successfully', 'Chart added to dashboard successfully', 1);
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: (queryInterface, Sequelize) => {
        return translation.remove(queryInterface, 'chart_added_to_dashboard_successfully', 1);
    }
};

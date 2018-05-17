'use strict';

var translation = require('../common/translation');

module.exports = {
  /**
   * @param queryInterface
   * @param Sequelize
   */
  up: (queryInterface, Sequelize) => {
    return translation.add(queryInterface, Sequelize, 'not_relevant_chart', 'Not relevant to the current query, Please select other charts', 1);
  },

  /**
   * @param queryInterface
   * @param Sequelize
   */
  down: (queryInterface, Sequelize) => {
    return translation.remove(queryInterface, 'not_relevant_chart', 1);
  }
};
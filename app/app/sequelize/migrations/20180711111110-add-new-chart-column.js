'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('ALTER TABLE `trendata_chart` ADD `nlp_search_query` VARCHAR(50) AFTER `trendata_chart_title_token`;');
  },

  down: (queryInterface, Sequelize) => {
   
  }
};
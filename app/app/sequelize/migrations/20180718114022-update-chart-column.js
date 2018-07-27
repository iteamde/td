'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('ALTER TABLE `trendata_chart` MODIFY COLUMN `nlp_search_query` VARCHAR(100);');
  },

  down: (queryInterface, Sequelize) => {
   
  }
};
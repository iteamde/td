'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.sequelize.query('UPDATE `trendata_translation` SET `trendata_translation_text` = \'Compensation\' WHERE `trendata_translation_token` = \'602ceaec98474415b8e8efe9b485b53d\' AND `trendata_language_id` = 1'),
      queryInterface.sequelize.query('UPDATE `trendata_translation` SET `trendata_translation_text` = \'Succession Planning\' WHERE `trendata_translation_token` = \'successors_identified\' AND `trendata_language_id` = 1')
    ])
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

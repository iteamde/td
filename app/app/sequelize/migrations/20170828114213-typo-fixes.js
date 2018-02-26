'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.sequelize.query(
          "UPDATE `trendata_translation` SET `trendata_translation_text` = 'Address of the employee''s residence' WHERE `trendata_translation_token` = 'address_personal_data_dictionary_field_description'",
          {
              type: Sequelize.QueryTypes.UPDATE
          }
      ),
      queryInterface.sequelize.query(
          "UPDATE `trendata_translation` SET `trendata_translation_text` = 'City of the employee''s residence' WHERE `trendata_translation_token` = 'city_personal_data_dictionary_field_description'",
          {
              type: Sequelize.QueryTypes.UPDATE
          }
      ),
      queryInterface.sequelize.query(
          "UPDATE `trendata_translation` SET `trendata_translation_text` = 'State of the employee''s residence' WHERE `trendata_translation_token` = 'state_personal_data_dictionary_field_description'",
          {
              type: Sequelize.QueryTypes.UPDATE
          }
      ),
    ]);
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

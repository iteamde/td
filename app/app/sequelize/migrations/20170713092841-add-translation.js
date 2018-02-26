'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query("INSERT INTO `trendata_translation` (`trendata_translation_id`, `trendata_translation_text`, `trendata_translation_token`, `created_at`, `updated_at`, `trendata_language_id`) VALUES (NULL, 'Cost per Hire', 'cost_per_hire_data_dictionary_field_name', NOW(), NOW(), '1'), (NULL, 'Value spent (in USD) to hire the employee.', 'cost_per_hire_data_dictionary_field_description', NOW(), NOW(), '1');");
  },

  down: function (queryInterface, Sequelize) {
    return Promise.resolve();
  }
};

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      CREATE TABLE \`trendata_nlp_sentence\` (
        \`trendata_nlp_sentence_id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
        \`trendata_nlp_sentence_query\` text COLLATE utf8_unicode_ci DEFAULT NULL,
        \`trendata_nlp_sentence_redirect\` text COLLATE utf8_unicode_ci DEFAULT NULL,
        \`created_at\` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        \`updated_at\` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`trendata_nlp_sentence_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci
  `);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('DROP TABLE `trendata_nlp_sentence`');
  }
};

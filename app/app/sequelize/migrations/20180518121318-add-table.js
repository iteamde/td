'use strict';

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(`
            CREATE TABLE \`trendata_kueri_log_detailed\` (
              \`trendata_kueri_log_detailed_id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
              \`trendata_user_id\` int(10) unsigned DEFAULT NULL,
              \`trendata_kueri_log_detailed_raw_string\` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
              \`trendata_kueri_log_detailed_interpreted_string\` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
              \`trendata_kueri_log_detailed_result_found\` enum('yes','no') COLLATE utf8_unicode_ci DEFAULT 'no',
              \`trendata_kueri_log_detailed_user_feedback\` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
              \`created_at\` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
              \`updated_at\` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (\`trendata_kueri_log_detailed_id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci
        `);
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query('DROP TABLE `trendata_kueri_log_detailed`');
    }
};

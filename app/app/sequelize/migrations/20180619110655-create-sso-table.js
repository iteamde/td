'use strict';

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(`
            CREATE TABLE \`trendata_sso\` (
              \`trendata_sso_id\` int(10) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
              \`trendata_user_id\` int(10) unsigned NULL,
              \`trendata_sso_token\` varchar(256) NULL,
              \`trendata_sso_redirect_url\` varchar(1024) NULL,
              \`created_at\` datetime NULL,
              \`updated_at\` datetime NULL
            ) ENGINE='InnoDB' COLLATE 'utf8_unicode_ci'
        `);
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query('DROP TABLE `trendata_sso`');
    }
};

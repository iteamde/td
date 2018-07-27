'use strict';

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query('ALTER TABLE `trendata_kueri_log_detailed` ADD `trendata_kueri_log_detailed_token` varchar(255) NOT NULL AFTER `trendata_kueri_log_detailed_id`');
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query('ALTER TABLE `trendata_kueri_log_detailed` DROP `trendata_kueri_log_detailed_token`');
    }
};

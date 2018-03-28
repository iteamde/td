'use strict';

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(
            'ALTER TABLE `trendata_bigdata_user` DROP INDEX `trendata_user_id`'
        ).then(function () {
            return queryInterface.sequelize.query(
                'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_hire_source` (`trendata_bigdata_hire_source`)'
            );
        }).then(function () {
            return queryInterface.sequelize.query(
                'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_position_hire_date` (`trendata_bigdata_user_position_hire_date`)'
            );
        }).then(function () {
            return queryInterface.sequelize.query(
                'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_position_termination_date` (`trendata_bigdata_user_position_termination_date`)'
            );
        }).then(function () {
            return queryInterface.sequelize.query(
                'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_address_city` (`trendata_bigdata_user_address_city`)'
            );
        }).then(function () {
            return queryInterface.sequelize.query(
                'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_address_state` (`trendata_bigdata_user_address_state`)'
            );
        });
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: (queryInterface, Sequelize) => {

    }
};

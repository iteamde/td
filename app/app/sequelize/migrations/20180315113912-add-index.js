'use strict';

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_manager_employee_id` (`trendata_bigdata_user_manager_employee_id`)'
        );
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: (queryInterface, Sequelize) => {

    }
};

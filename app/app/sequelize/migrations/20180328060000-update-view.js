'use strict';

var Promise = require('bluebird');

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(
            "CREATE OR REPLACE VIEW `trendata_bigdata_user_view` AS \n" +
            "SELECT \n" +
            "`tbu`.*, " +
            "(\n" +
                "SELECT \n" +
                "COUNT(*) \n" +
                "FROM \n" +
                "`trendata_bigdata_user` AS `tbu`\n" +
                "WHERE `tbu`.`trendata_bigdata_user_manager_employee_id` = `trendata_bigdata_user_employee_id`\n" +
            ") AS `reports_per_manager`," +
            "IF (((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, '%Y-%m-01') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, '%Y-%m-01')) OR (`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, '%Y-%m-01'))), 1, 0) AS `active`,\n" +
            "IF (((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, '%Y-%m-01') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, '%Y-%m-01')) OR (`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, '%Y-%m-01'))), 0, 1) AS `terminated`\n" +
            "FROM \n" +
            "`trendata_bigdata_user` AS `tbu`"
        );
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: (queryInterface, Sequelize) => {
        return Promise.resolve();
    }
};

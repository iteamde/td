'use strict';

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(
            'CREATE OR REPLACE VIEW `trendata_bigdata_user_view` AS ' +
            'SELECT ' +
            '`tbu`.*, ' +
            'IF (((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, \'%Y-%m-01\')) OR (`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, \'%Y-%m-01\'))), 1, 0) AS `active`, ' +
            'IF (((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, \'%Y-%m-01\')) OR (`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, \'%Y-%m-01\'))), 0, 1) AS `terminated` ' +
            'FROM ' +
            '`trendata_bigdata_user` AS `tbu`'
        );
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query('DROP VIEW `trendata_bigdata_user_view`');
    }
};

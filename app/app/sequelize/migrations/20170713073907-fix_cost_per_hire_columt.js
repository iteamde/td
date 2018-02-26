'use strict';

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query('ALTER TABLE `trendata_bigdata_user` CHANGE `trendata_bigdata_user_cost_per_hire` `trendata_bigdata_user_cost_per_hire` decimal(15,2) unsigned NULL AFTER `trendata_bigdata_user_rehire_date`');
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query('ALTER TABLE `trendata_bigdata_user` CHANGE `trendata_bigdata_user_cost_per_hire` `trendata_bigdata_user_cost_per_hire` int(10) unsigned NULL AFTER `trendata_bigdata_user_rehire_date`');
    }
};

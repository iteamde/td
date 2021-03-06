'use strict';

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query('ALTER TABLE `trendata_bigdata_user` ADD `trendata_bigdata_user_distance_to_work` int unsigned NULL');
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('trendata_bigdata_user', 'trendata_bigdata_user_distance_to_work');
    }
};

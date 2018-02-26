'use strict';

var Promise = require('bluebird');

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('trendata_bigdata_job_country').then(function () {
            return queryInterface.dropTable('trendata_bigdata_employee_type');
        }).then(function () {
            return queryInterface.dropTable('trendata_bigdata_job');
        }).then(function () {
            return queryInterface.dropTable('trendata_bigdata_jobtype');
        }).then(function () {
            return queryInterface.dropTable('trendata_bigdata_organizational_level');
        }).then(function () {
            return queryInterface.dropTable('trendata_bigdata_salary_range');
        });

        /*return Promise.each([
            queryInterface.dropTable('trendata_bigdata_job_country'),
            queryInterface.dropTable('trendata_bigdata_employee_type'),
            queryInterface.dropTable('trendata_bigdata_job'),
            queryInterface.dropTable('trendata_bigdata_jobtype'),
            queryInterface.dropTable('trendata_bigdata_organizational_level'),
            queryInterface.dropTable('trendata_bigdata_salary_range'),
        ]);*/
    },

    /**
     * @param queryInterface
     * @param Sequelize
     * @return {Promise.<T>}
     */
    down: function (queryInterface, Sequelize) {
        return Promise.resolve();
    }
};

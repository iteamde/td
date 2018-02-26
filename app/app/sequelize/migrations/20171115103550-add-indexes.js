'use strict';

const Promise = require('bluebird');

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: (queryInterface, Sequelize) => {
        Promise.all([
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_first_name` (`trendata_bigdata_user_first_name`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_middle_name` (`trendata_bigdata_user_middle_name`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_last_name` (`trendata_bigdata_user_last_name`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_email` (`trendata_bigdata_user_email`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_dob` (`trendata_bigdata_user_dob`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_department` (`trendata_bigdata_user_department`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_division` (`trendata_bigdata_user_division`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_cost_center` (`trendata_bigdata_user_cost_center`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_rehire_date` (`trendata_bigdata_user_rehire_date`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_cost_per_hire` (`trendata_bigdata_user_cost_per_hire`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_position_start_date` (`trendata_bigdata_user_position_start_date`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_previous_position_start_date` (`trendata_bigdata_user_previous_position_start_date`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_country` (`trendata_bigdata_user_country`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_country_personal` (`trendata_bigdata_user_country_personal`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_ethnicity` (`trendata_bigdata_user_ethnicity`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_job_level` (`trendata_bigdata_user_job_level`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_current_job_code` (`trendata_bigdata_user_current_job_code`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_industry_salary` (`trendata_bigdata_user_industry_salary`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_salary` (`trendata_bigdata_user_salary`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_salary_1_year_ago` (`trendata_bigdata_user_salary_1_year_ago`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_salary_2_year_ago` (`trendata_bigdata_user_salary_2_year_ago`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_salary_3_year_ago` (`trendata_bigdata_user_salary_3_year_ago`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_salary_4_year_ago` (`trendata_bigdata_user_salary_4_year_ago`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_performance_percentage_this_year` (`trendata_bigdata_user_performance_percentage_this_year`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_performance_percentage_1_year_ago` (`trendata_bigdata_user_performance_percentage_1_year_ago`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_performance_percentage_2_year_ago` (`trendata_bigdata_user_performance_percentage_2_year_ago`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_performance_percentage_3_year_ago` (`trendata_bigdata_user_performance_percentage_3_year_ago`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_performance_percentage_4_year_ago` (`trendata_bigdata_user_performance_percentage_4_year_ago`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_remote_employee` (`trendata_bigdata_user_remote_employee`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_voluntary_termination` (`trendata_bigdata_user_voluntary_termination`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_prof_development` (`trendata_bigdata_user_prof_development`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_posting_date` (`trendata_bigdata_user_posting_date`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_absences` (`trendata_bigdata_user_absences`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_successor` (`trendata_bigdata_user_successor`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_benefit_costs` (`trendata_bigdata_user_benefit_costs`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_benefit_costs_1_year_ago` (`trendata_bigdata_user_benefit_costs_1_year_ago`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_benefit_costs_2_year_ago` (`trendata_bigdata_user_benefit_costs_2_year_ago`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_benefit_costs_3_year_ago` (`trendata_bigdata_user_benefit_costs_3_year_ago`)',
            'ALTER TABLE `trendata_bigdata_user` ADD INDEX `trendata_bigdata_user_benefit_costs_4_year_ago` (`trendata_bigdata_user_benefit_costs_4_year_ago`)',
            'ALTER TABLE `trendata_bigdata_hire_source` ADD INDEX `trendata_bigdata_hire_source_name` (`trendata_bigdata_hire_source_name`)',
            'ALTER TABLE `trendata_bigdata_gender` ADD INDEX `trendata_bigdata_gender_name_token` (`trendata_bigdata_gender_name_token`)',
            'ALTER TABLE `trendata_bigdata_country` ADD INDEX `trendata_bigdata_country_name` (`trendata_bigdata_country_name`)',
            'ALTER TABLE `trendata_bigdata_user_education_history` ADD INDEX `trendata_bigdata_user_education_history_level` (`trendata_bigdata_user_education_history_level`)',

            'ALTER TABLE `trendata_bigdata_user_address`  ' +
            'ADD INDEX `trendata_bigdata_user_address_address` (`trendata_bigdata_user_address_address`),  ' +
            'ADD INDEX `trendata_bigdata_user_address_address_personal` (`trendata_bigdata_user_address_address_personal`),  ' +
            'ADD INDEX `trendata_bigdata_user_address_city` (`trendata_bigdata_user_address_city`),  ' +
            'ADD INDEX `trendata_bigdata_user_address_city_personal` (`trendata_bigdata_user_address_city_personal`),  ' +
            'ADD INDEX `trendata_bigdata_user_address_state` (`trendata_bigdata_user_address_state`),  ' +
            'ADD INDEX `trendata_bigdata_user_address_state_personal` (`trendata_bigdata_user_address_state_personal`),  ' +
            'ADD INDEX `trendata_bigdata_user_address_zipcode` (`trendata_bigdata_user_address_zipcode`),  ' +
            'ADD INDEX `trendata_bigdata_user_address_zipcode_personal` (`trendata_bigdata_user_address_zipcode_personal`)',

            'ALTER TABLE `trendata_bigdata_user_position` ' +
            'ADD INDEX `trendata_bigdata_user_position_hire_date` (`trendata_bigdata_user_position_hire_date`), ' +
            'ADD INDEX `trendata_bigdata_user_position_termination_date` (`trendata_bigdata_user_position_termination_date`), ' +
            'ADD INDEX `trendata_bigdata_user_position_current_job_code` (`trendata_bigdata_user_position_current_job_code`)'
        ]).map(function (item) {
            return queryInterface.sequelize.query(item);
        });
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.sequelize.query(
                'ALTER TABLE `trendata_bigdata_user` ' +
                'DROP INDEX `trendata_bigdata_user_first_name`, ' +
                'DROP INDEX `trendata_bigdata_user_middle_name`, ' +
                'DROP INDEX `trendata_bigdata_user_last_name`, ' +
                'DROP INDEX `trendata_bigdata_user_email`, ' +
                'DROP INDEX `trendata_bigdata_user_dob`, ' +
                'DROP INDEX `trendata_bigdata_user_department`, ' +
                'DROP INDEX `trendata_bigdata_user_division`, ' +
                'DROP INDEX `trendata_bigdata_user_cost_center`, ' +
                'DROP INDEX `trendata_bigdata_user_rehire_date`, ' +
                'DROP INDEX `trendata_bigdata_user_cost_per_hire`, ' +
                'DROP INDEX `trendata_bigdata_user_position_start_date`, ' +
                'DROP INDEX `trendata_bigdata_user_previous_position_start_date`, ' +
                'DROP INDEX `trendata_bigdata_user_country`, ' +
                'DROP INDEX `trendata_bigdata_user_country_personal`, ' +
                'DROP INDEX `trendata_bigdata_user_ethnicity`, ' +
                'DROP INDEX `trendata_bigdata_user_job_level`, ' +
                'DROP INDEX `trendata_bigdata_user_current_job_code`, ' +
                'DROP INDEX `trendata_bigdata_user_industry_salary`, ' +
                'DROP INDEX `trendata_bigdata_user_salary`, ' +
                'DROP INDEX `trendata_bigdata_user_salary_1_year_ago`, ' +
                'DROP INDEX `trendata_bigdata_user_salary_2_year_ago`, ' +
                'DROP INDEX `trendata_bigdata_user_salary_3_year_ago`, ' +
                'DROP INDEX `trendata_bigdata_user_salary_4_year_ago`, ' +
                'DROP INDEX `trendata_bigdata_user_performance_percentage_this_year`, ' +
                'DROP INDEX `trendata_bigdata_user_performance_percentage_1_year_ago`, ' +
                'DROP INDEX `trendata_bigdata_user_performance_percentage_2_year_ago`, ' +
                'DROP INDEX `trendata_bigdata_user_performance_percentage_3_year_ago`, ' +
                'DROP INDEX `trendata_bigdata_user_performance_percentage_4_year_ago`, ' +
                'DROP INDEX `trendata_bigdata_user_remote_employee`, ' +
                'DROP INDEX `trendata_bigdata_user_voluntary_termination`, ' +
                'DROP INDEX `trendata_bigdata_user_prof_development`, ' +
                'DROP INDEX `trendata_bigdata_user_posting_date`, ' +
                'DROP INDEX `trendata_bigdata_user_absences`, ' +
                'DROP INDEX `trendata_bigdata_user_successor`, ' +
                'DROP INDEX `trendata_bigdata_user_benefit_costs`, ' +
                'DROP INDEX `trendata_bigdata_user_benefit_costs_1_year_ago`, ' +
                'DROP INDEX `trendata_bigdata_user_benefit_costs_2_year_ago`, ' +
                'DROP INDEX `trendata_bigdata_user_benefit_costs_3_year_ago`, ' +
                'DROP INDEX `trendata_bigdata_user_benefit_costs_4_year_ago`;'
            ),

            queryInterface.sequelize.query(
                'ALTER TABLE `trendata_bigdata_hire_source` DROP INDEX `trendata_bigdata_hire_source_name`'
            ),

            queryInterface.sequelize.query(
                'ALTER TABLE `trendata_bigdata_gender` DROP INDEX `trendata_bigdata_gender_name_token`'
            ),

            queryInterface.sequelize.query(
                'ALTER TABLE `trendata_bigdata_country` DROP INDEX `trendata_bigdata_country_name`'
            ),

            queryInterface.sequelize.query(
                'ALTER TABLE `trendata_bigdata_user_education_history` DROP INDEX `trendata_bigdata_user_education_history_level`'
            ),

            queryInterface.sequelize.query(
                'ALTER TABLE `trendata_bigdata_user_address` ' +
                'DROP INDEX `trendata_bigdata_user_address_address`, ' +
                'DROP INDEX `trendata_bigdata_user_address_address_personal`, ' +
                'DROP INDEX `trendata_bigdata_user_address_city`, ' +
                'DROP INDEX `trendata_bigdata_user_address_city_personal`, ' +
                'DROP INDEX `trendata_bigdata_user_address_state`, ' +
                'DROP INDEX `trendata_bigdata_user_address_state_personal`, ' +
                'DROP INDEX `trendata_bigdata_user_address_zipcode`, ' +
                'DROP INDEX `trendata_bigdata_user_address_zipcode_personal`'
            ),

            queryInterface.sequelize.query(
                'ALTER TABLE `trendata_bigdata_user_position` ' +
                'DROP INDEX `trendata_bigdata_user_position_hire_date`, ' +
                'DROP INDEX `trendata_bigdata_user_position_termination_date`, ' +
                'DROP INDEX `trendata_bigdata_user_position_current_job_code`'
            )
        ]);
    }
};

'use strict';

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(
            'ALTER TABLE `trendata_bigdata_user` ADD `trendata_bigdata_user_reports_per_manager` int(11) NULL AFTER `trendata_bigdata_user_manager_employee_id`'
        ).then(function () {
            return queryInterface.sequelize.query(
                "CREATE OR REPLACE VIEW `trendata_bigdata_user_view` AS " +
                "SELECT " +
                "`tbu`.`trendata_bigdata_user_first_name` AS `first_name`," +
                "`tbu`.`trendata_bigdata_user_middle_name` AS `middle_name`," +
                "`tbu`.`trendata_bigdata_user_last_name` AS `last_name`," +
                "`tbu`.`trendata_bigdata_user_email` AS `email`," +
                "`tbu`.`trendata_bigdata_user_dob` AS `dob`," +
                "`tbu`.`trendata_bigdata_user_department` AS `department`," +
                "`tbu`.`trendata_bigdata_user_division` AS `division`," +
                "`tbu`.`trendata_bigdata_user_cost_center` AS `cost_center`," +
                "`tbu`.`trendata_bigdata_user_rehire_date` AS `rehire_date`," +
                "`tbu`.`trendata_bigdata_user_cost_per_hire` AS `cost_per_hire`," +
                "`tbu`.`trendata_bigdata_user_position_start_date` AS `position_start_date`," +
                "`tbu`.`trendata_bigdata_user_previous_position_start_date` AS `previous_position_start_date`," +
                "`tbu`.`trendata_bigdata_user_country` AS `country`," +
                "`tbu`.`trendata_bigdata_user_country_personal` AS `country_personal`," +
                "`tbu`.`trendata_bigdata_user_ethnicity` AS `ethnicity`," +
                "`tbu`.`trendata_bigdata_user_job_level` AS `job_level`," +
                "`tbu`.`trendata_bigdata_user_current_job_code` AS `current_job_code`," +
                "`tbu`.`trendata_bigdata_user_industry_salary` AS `industry_salary`," +
                "`tbu`.`trendata_bigdata_user_salary` AS `salary`," +
                "`tbu`.`trendata_bigdata_user_salary_1_year_ago` AS `salary_1_year_ago`," +
                "`tbu`.`trendata_bigdata_user_salary_2_year_ago` AS `salary_2_year_ago`," +
                "`tbu`.`trendata_bigdata_user_salary_3_year_ago` AS `salary_3_year_ago`," +
                "`tbu`.`trendata_bigdata_user_salary_4_year_ago` AS `salary_4_year_ago`," +
                "`tbu`.`trendata_bigdata_user_performance_percentage_this_year` AS `performance_percentage_this_year`," +
                "`tbu`.`trendata_bigdata_user_performance_percentage_1_year_ago` AS `performance_percentage_1_year_ago`," +
                "`tbu`.`trendata_bigdata_user_performance_percentage_2_year_ago` AS `performance_percentage_2_year_ago`," +
                "`tbu`.`trendata_bigdata_user_performance_percentage_3_year_ago` AS `performance_percentage_3_year_ago`," +
                "`tbu`.`trendata_bigdata_user_performance_percentage_4_year_ago` AS `performance_percentage_4_year_ago`," +
                "`tbu`.`trendata_bigdata_user_remote_employee` AS `remote_employee`," +
                "`tbu`.`trendata_bigdata_user_voluntary_termination` AS `voluntary_termination`," +
                "`tbu`.`trendata_bigdata_user_prof_development` AS `prof_development`," +
                "`tbu`.`trendata_bigdata_user_posting_date` AS `posting_date`," +
                "`tbu`.`trendata_bigdata_user_absences` AS `absences`," +
                "`tbu`.`trendata_bigdata_user_successor` AS `successor`," +
                "`tbu`.`trendata_bigdata_user_benefit_costs` AS `benefit_costs`," +
                "`tbu`.`trendata_bigdata_user_benefit_costs_1_year_ago` AS `benefit_costs_1_year_ago`," +
                "`tbu`.`trendata_bigdata_user_benefit_costs_2_year_ago` AS `benefit_costs_2_year_ago`," +
                "`tbu`.`trendata_bigdata_user_benefit_costs_3_year_ago` AS `benefit_costs_3_year_ago`," +
                "`tbu`.`trendata_bigdata_user_benefit_costs_4_year_ago` AS `benefit_costs_4_year_ago`," +
                "`tbu`.`trendata_bigdata_user_employee_id` AS `employee_id`," +
                "`tbu`.`trendata_bigdata_user_manager_employee_id` AS `manager_employee_id`," +
                "`tbu`.`trendata_bigdata_user_reports_per_manager` AS `reports_per_manager`," +
                "`tbu`.`trendata_bigdata_employee_type` AS `employee_type`," +
                "`tbu`.`trendata_bigdata_user_gender` AS `gender`," +
                "`tbu`.`trendata_bigdata_user_custom_fields` AS `custom_fields`," +
                "`tbu`.`trendata_bigdata_hire_source` AS `hire_source`," +
                "`tbu`.`trendata_bigdata_user_education_history_level` AS `education_history_level`," +
                "`tbu`.`trendata_bigdata_user_position_hire_date` AS `position_hire_date`," +
                "`tbu`.`trendata_bigdata_user_position_termination_date` AS `position_termination_date`," +
                "`tbu`.`trendata_bigdata_user_position_current_job_code` AS `position_current_job_code`," +
                "`tbu`.`trendata_bigdata_user_address_address` AS `address_address`," +
                "`tbu`.`trendata_bigdata_user_address_address_personal` AS `address_address_personal`," +
                "`tbu`.`trendata_bigdata_user_address_city` AS `address_city`," +
                "`tbu`.`trendata_bigdata_user_address_city_personal` AS `address_city_personal`," +
                "`tbu`.`trendata_bigdata_user_address_state` AS `address_state`," +
                "`tbu`.`trendata_bigdata_user_address_state_personal` AS `address_state_personal`," +
                "`tbu`.`trendata_bigdata_user_address_zipcode` AS `address_zipcode`," +
                "`tbu`.`trendata_bigdata_user_address_zipcode_personal` AS `address_zipcode_personal`," +
                "IF (`tbu`.`trendata_bigdata_user_successor` IS NOT NULL, 'Yes', 'No') AS `successors_identified`,  " +
                "IF (((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, '%Y-%m-01') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, '%Y-%m-01')) OR (`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, '%Y-%m-01'))), 1, 0) AS `active`, " +
                "IF (((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, '%Y-%m-01') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, '%Y-%m-01')) OR (`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, '%Y-%m-01'))), 0, 1) AS `terminated`, " +
                "DATEDIFF(`tbu`.`trendata_bigdata_user_position_hire_date`, `tbu`.`trendata_bigdata_user_posting_date`) AS `time_to_fill` " +
                "FROM " +
                "`trendata_bigdata_user` AS `tbu`"
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

'use strict';

var Promise = require('bluebird');
var os = require('os');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var knex = require('../../components/knex');
var pathToFile = path.join(os.tmpdir(), 'trendata-data-migration-' + __dirname.replace(/\//g, '-') + '.json');
var databaseName = require('../../../config').config.sequelize.database;

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: async (queryInterface, Sequelize) => {
        // Get list of tables
        let tables = await queryInterface.sequelize.query('SHOW TABLES', {
            type: Sequelize.QueryTypes.SELECT
        }).map(function (item) {
            return item['Tables_in_' + databaseName];
        });

        if (tables.indexOf('trendata_bigdata_user_position') === -1) {
            return;
        }

        let rows = await queryInterface.sequelize.query('SELECT `trendata_bigdata_user_custom_fields` FROM `trendata_bigdata_user` LIMIT 1', {
            type: Sequelize.QueryTypes.SELECT
        });

        if (!rows.length) {
            return;
        }

        let customFields = Object.keys(JSON.parse(rows[0].trendata_bigdata_user_custom_fields));

        let query = knex('trendata_bigdata_user AS tbu').select([
            'tbu.trendata_bigdata_user_first_name',
            'tbu.trendata_bigdata_user_middle_name',
            'tbu.trendata_bigdata_user_last_name',
            'tbu.trendata_bigdata_user_email',
            'tbu.trendata_bigdata_user_dob',
            'tbu.trendata_bigdata_user_department',
            'tbu.trendata_bigdata_user_division',
            'tbu.trendata_bigdata_user_cost_center',
            'tbu.trendata_bigdata_user_rehire_date',
            'tbu.trendata_bigdata_user_cost_per_hire',
            'tbu.trendata_bigdata_user_position_start_date',
            'tbu.trendata_bigdata_user_previous_position_start_date',
            'tbu.trendata_bigdata_user_country',
            'tbu.trendata_bigdata_user_country_personal',
            'tbu.trendata_bigdata_user_ethnicity',
            'tbu.trendata_bigdata_user_job_level',
            'tbu.trendata_bigdata_user_current_job_code',
            'tbu.trendata_bigdata_user_industry_salary',
            'tbu.trendata_bigdata_user_salary',
            'tbu.trendata_bigdata_user_salary_1_year_ago',
            'tbu.trendata_bigdata_user_salary_2_year_ago',
            'tbu.trendata_bigdata_user_salary_3_year_ago',
            'tbu.trendata_bigdata_user_salary_4_year_ago',
            'tbu.trendata_bigdata_user_performance_percentage_this_year',
            'tbu.trendata_bigdata_user_performance_percentage_1_year_ago',
            'tbu.trendata_bigdata_user_performance_percentage_2_year_ago',
            'tbu.trendata_bigdata_user_performance_percentage_3_year_ago',
            'tbu.trendata_bigdata_user_performance_percentage_4_year_ago',
            'tbu.trendata_bigdata_user_remote_employee',
            'tbu.trendata_bigdata_user_voluntary_termination',
            'tbu.trendata_bigdata_user_prof_development',
            'tbu.trendata_bigdata_user_posting_date',
            'tbu.trendata_bigdata_user_absences',
            'tbu.trendata_bigdata_user_successor',
            'tbu.trendata_bigdata_user_benefit_costs',
            'tbu.trendata_bigdata_user_benefit_costs_1_year_ago',
            'tbu.trendata_bigdata_user_benefit_costs_2_year_ago',
            'tbu.trendata_bigdata_user_benefit_costs_3_year_ago',
            'tbu.trendata_bigdata_user_benefit_costs_4_year_ago',
            'tbu.trendata_bigdata_user_employee_id',
            'tbu.trendata_bigdata_user_manager_employee_id',
            'tbu.trendata_bigdata_employee_type',

            'tbg.trendata_bigdata_gender_name_token AS trendata_bigdata_user_gender',
            'tbhs.trendata_bigdata_hire_source_name AS trendata_bigdata_hire_source',

            'tbua.trendata_bigdata_user_address_address',
            'tbua.trendata_bigdata_user_address_address_personal',
            'tbua.trendata_bigdata_user_address_city',
            'tbua.trendata_bigdata_user_address_city_personal',
            'tbua.trendata_bigdata_user_address_state',
            'tbua.trendata_bigdata_user_address_state_personal',
            'tbua.trendata_bigdata_user_address_zipcode',
            'tbua.trendata_bigdata_user_address_zipcode_personal',

            'tbueh.trendata_bigdata_user_education_history_level',

            'tbup.trendata_bigdata_user_position_hire_date',
            'tbup.trendata_bigdata_user_position_termination_date',
            'tbup.trendata_bigdata_user_position_current_job_code',
        ].concat(customFields.map(function (item) {
            return knex.raw('`tbu`.`trendata_bigdata_user_custom_fields`->>? AS ??', [
                '$.' + JSON.stringify(item),
                item
            ]);
        }))).innerJoin(
            'trendata_bigdata_gender AS tbg',
            'tbu.trendata_bigdata_gender_id',
            'tbg.trendata_bigdata_gender_id'
        ).innerJoin(
            'trendata_bigdata_hire_source AS tbhs',
            'tbu.trendata_bigdata_hire_source_id',
            'tbhs.trendata_bigdata_hire_source_id'
        ).innerJoin(
            'trendata_bigdata_user_address AS tbua',
            'tbu.trendata_bigdata_user_id',
            'tbua.trendata_bigdata_user_id'
        ).innerJoin(
            'trendata_bigdata_user_education_history AS tbueh',
            'tbu.trendata_bigdata_user_id',
            'tbueh.trendata_bigdata_user_id'
        ).innerJoin(
            'trendata_bigdata_user_position AS tbup',
            'tbu.trendata_bigdata_user_id',
            'tbup.trendata_bigdata_user_id'
        ).toString();

        let data = await queryInterface.sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT
        }).then(function (data) {
            return JSON.parse(JSON.stringify(data));
        }).map(function (item) {
            item.trendata_bigdata_user_dob = item.trendata_bigdata_user_dob ?
                item.trendata_bigdata_user_dob.substr(0, 10) : item.trendata_bigdata_user_dob;

            item.trendata_bigdata_user_rehire_date = item.trendata_bigdata_user_rehire_date ?
                item.trendata_bigdata_user_rehire_date.substr(0, 10) : item.trendata_bigdata_user_rehire_date;

            item.trendata_bigdata_user_posting_date = item.trendata_bigdata_user_posting_date ?
                item.trendata_bigdata_user_posting_date.substr(0, 10) : item.trendata_bigdata_user_posting_date;

            item.trendata_bigdata_user_position_hire_date = item.trendata_bigdata_user_position_hire_date ?
                item.trendata_bigdata_user_position_hire_date.substr(0, 10) : item.trendata_bigdata_user_position_hire_date;

            item.trendata_bigdata_user_position_termination_date = item.trendata_bigdata_user_position_termination_date ?
                item.trendata_bigdata_user_position_termination_date.substr(0, 10) : item.trendata_bigdata_user_position_termination_date;

            return item;
        });

        let fileData = {
            customFields,
            data
        };

        global._dataMigration = JSON.parse(JSON.stringify(fileData));

        // await fs.writeFileAsync(pathToFile, JSON.stringify(fileData));
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: (queryInterface, Sequelize) => {

    }
};

var orm = require('../orm/orm');
var ORM = require('sequelize');

module.exports = [
    {
        qwe: {
            "Custom field 1": "Value 1",
            "Custom field 2": "Value 2",
            "Custom field 3": "Value 3"
        },
        name: 'trendata_bigdata_user',
        header: [
            'First Name',
            'Middle Name',
            'Last Name',
            'Employee ID',
            'Email',
            'DOB',
            'Address (Business)',
            'City (Business)',
            'State (Business)',
            'Country (Business)',
            'Zip Code (Business)',

            'Address (Personal)',
            'City (Personal)',
            'State (Personal)',
            'Country (Personal)',
            'Zip Code (Personal)',

            'Education Level',
            'Hire Date',
            'Termination Date',
            'Job Level',
            'Current Job Code',
            'Manager Employee ID',

            'Employee Type',
            'Gender',
            'Ethnicity',
            'Department',
            'Division',
            'Cost Center',
            'Rehire Date',
            'Cost per Hire',
            'Position Start Date',
            'Previous Position Start Date',
            'Nationality Country',
            'Hire Source',

            'Industry Salary',
            'Employee Salary',
            'Employee Salary (1 year ago)',
            'Employee Salary (2 years ago)',
            'Employee Salary (3 years ago)',
            'Employee Salary (4 years ago)',
            'Performance Rating (this year)',
            'Performance Rating (1 year ago)',
            'Performance Rating (2 years ago)',
            'Performance Rating (3 years ago)',
            'Performance Rating (4 years ago)',

            'Remote Employee',
            'Separation Type',
            'Prof. Development',
            'Posting Date',

            'Absences',
            'Successor Employee ID',
            'Employee Benefit Costs',
            'Employee Benefit Cost (1 year ago)',
            'Employee Benefit Cost (2 years ago)',
            'Employee Benefit Cost (3 years ago)',
            'Employee Benefit Cost (4 years ago)'
        ],
        dataMapping: {
            table: 'trendata_bigdata_user',
            columns: {
                // Header => Column
                'First Name': 'trendata_bigdata_user_first_name',
                'Middle Name': 'trendata_bigdata_user_middle_name',
                'Last Name': 'trendata_bigdata_user_last_name',
                'Email': 'trendata_bigdata_user_email',
                'DOB': 'trendata_bigdata_user_dob',
                'Country (Business)': 'trendata_bigdata_user_country',
                'Country (Personal)': 'trendata_bigdata_user_country_personal',
                'Job Level': 'trendata_bigdata_user_job_level',
                'Employee ID': 'trendata_bigdata_user_employee_id',
                'Current Job Code': 'trendata_bigdata_user_current_job_code',
                'Manager Employee ID': 'trendata_bigdata_user_manager_employee_id',

                'Employee Type': 'trendata_bigdata_employee_type',
                'Gender': 'trendata_bigdata_user_gender',
                'Ethnicity': 'trendata_bigdata_user_ethnicity',
                'Department': 'trendata_bigdata_user_department',
                'Division': 'trendata_bigdata_user_division',
                'Cost Center': 'trendata_bigdata_user_cost_center',
                'Rehire Date': 'trendata_bigdata_user_rehire_date',
                'Cost per Hire': 'trendata_bigdata_user_cost_per_hire',
                'Position Start Date': 'trendata_bigdata_user_position_start_date',
                'Previous Position Start Date': 'trendata_bigdata_user_previous_position_start_date',
                'Hire Source': 'trendata_bigdata_hire_source',
                'Education Level': 'trendata_bigdata_user_education_history_level',

                'Hire Date': 'trendata_bigdata_user_position_hire_date',
                'Termination Date': 'trendata_bigdata_user_position_termination_date',

                'Industry Salary': 'trendata_bigdata_user_industry_salary',
                'Employee Salary': 'trendata_bigdata_user_salary',
                'Employee Salary (1 year ago)': 'trendata_bigdata_user_salary_1_year_ago',
                'Employee Salary (2 years ago)': 'trendata_bigdata_user_salary_2_year_ago',
                'Employee Salary (3 years ago)': 'trendata_bigdata_user_salary_3_year_ago',
                'Employee Salary (4 years ago)': 'trendata_bigdata_user_salary_4_year_ago',
                'Performance Rating (this year)': 'trendata_bigdata_user_performance_percentage_this_year',
                'Performance Rating (1 year ago)': 'trendata_bigdata_user_performance_percentage_1_year_ago',
                'Performance Rating (2 years ago)': 'trendata_bigdata_user_performance_percentage_2_year_ago',
                'Performance Rating (3 years ago)': 'trendata_bigdata_user_performance_percentage_3_year_ago',
                'Performance Rating (4 years ago)': 'trendata_bigdata_user_performance_percentage_4_year_ago',

                'Remote Employee': 'trendata_bigdata_user_remote_employee',
                'Separation Type': 'trendata_bigdata_user_voluntary_termination',
                'Prof. Development': 'trendata_bigdata_user_prof_development',
                'Posting Date': 'trendata_bigdata_user_posting_date',

                'Absences': 'trendata_bigdata_user_absences',
                'Successor Employee ID': 'trendata_bigdata_user_successor',
                'Employee Benefit Costs': 'trendata_bigdata_user_benefit_costs',
                'Employee Benefit Cost (1 year ago)': 'trendata_bigdata_user_benefit_costs_1_year_ago',
                'Employee Benefit Cost (2 years ago)': 'trendata_bigdata_user_benefit_costs_2_year_ago',
                'Employee Benefit Cost (3 years ago)': 'trendata_bigdata_user_benefit_costs_3_year_ago',
                'Employee Benefit Cost (4 years ago)': 'trendata_bigdata_user_benefit_costs_4_year_ago',

                'Address (Business)': 'trendata_bigdata_user_address_address',
                'City (Business)': 'trendata_bigdata_user_address_city',
                'State (Business)': 'trendata_bigdata_user_address_state',
                'Zip Code (Business)': 'trendata_bigdata_user_address_zipcode',

                'Address (Personal)': 'trendata_bigdata_user_address_address_personal',
                'City (Personal)': 'trendata_bigdata_user_address_city_personal',
                'State (Personal)': 'trendata_bigdata_user_address_state_personal',
                'Zip Code (Personal)': 'trendata_bigdata_user_address_zipcode_personal'
            },
            acceptedCustomFields: [
                'trendata_user_id'
            ]
        },
        rules: {
            'First Name': [
                'not_empty'
            ],
            'Middle Name': [],
            'Last Name': [
                'not_empty'
            ],
            'Employee ID': [],
            'Email': [
                'email'
            ],
            'DOB': [
                'not_empty',
                'date2'
            ],
            'Address (Business)': [],
            'City (Business)': [
                'not_empty'
            ],
            'State (Business)': [
                'not_empty'
            ],
            'Country (Business)': [
                'not_empty'
            ],
            'Zip Code (Business)': [
            ],

            'Address (Personal)': [],
            'City (Personal)': [
                // 'not_empty'
            ],
            'State (Personal)': [
                // 'not_empty'
            ],
            'Country (Personal)': [
                // 'not_empty'
            ],
            'Zip Code (Personal)': [
            ],

            'Education Level': [],
            'Hire Date': [
                'not_empty',
                'date2'
            ],
            'Termination Date': [
                'date2'
            ],
            'Job Level': [
                'not_empty'
            ],
            'Current Job Code': [
                'not_empty'
            ],
            'Manager Employee ID': [],

            'Employee Type': [
                'not_empty'/*,
                 function (value, column, line, errors) {
                 var available = [
                 'full-time',
                 'part-time',
                 'contractor'
                 ];

                 if ('' !== value && available.indexOf(value.trim().toLowerCase()) === -1) {
                 errors.push(this.createMessage(line, column, value, 'Employee Type is incorrect, available: Full-Time, Part-Time, Contractor'));
                 }
                 }*/
            ],
            'Gender': [
                'not_empty'
            ],
            'Ethnicity': [],
            'Department': [
                'not_empty'
            ],
            'Division': [],
            'Cost Center': [],
            'Rehire Date': [
                'date2'
            ],
            'Cost per Hire': [
                function (value, column, line, errors) {
                    value = value.trim();
                    if ('' === value) {
                        return;
                    }

                    if (! /^\${0,1}[\d\.\,]+$/g.test(value)) {
                        return errors.push(this.createMessage(line, column, value, 'Cost per Hire is incorrect'));
                    }


                    if ((value.match(/\./g) || []).length > 1) {
                        return errors.push(this.createMessage(line, column, value, 'Cost per Hire is incorrect'));
                    }
                }
            ],
            'Position Start Date': [
                'date2'
            ],
            'Previous Position Start Date': [
                'date2'
            ],
            'Nationality Country': [
                'not_empty'
            ],
            'Hire Source': [
                //'id'
            ],

            'Industry Salary': [
                // 'not_empty',
                // 'number'
            ],
            'Employee Salary': [
                //'number'
            ],
            'Employee Salary (1 year ago)': [
                //'number'
            ],
            'Employee Salary (2 years ago)': [
                //'number'
            ],
            'Employee Salary (3 years ago)': [
                //'number'
            ],
            'Employee Salary (4 years ago)': [
                //'number'
            ],
            'Performance Rating (this year)': [
                'number',
                function (value, column, line, errors) {
                    if ('' !== value && (value < 0 || value > 100)) {
                        errors.push(this.createMessage(line, column, value, 'The value must be between 0 and 100'));
                    }
                }
            ],
            'Performance Rating (1 year ago)': [
                'number',
                function (value, column, line, errors) {
                    if ('' !== value && (value < 0 || value > 100)) {
                        errors.push(this.createMessage(line, column, value, 'The value must be between 0 and 100'));
                    }
                }
            ],
            'Performance Rating (2 years ago)': [
                'number',
                function (value, column, line, errors) {
                    if ('' !== value && (value < 0 || value > 100)) {
                        errors.push(this.createMessage(line, column, value, 'The value must be between 0 and 100'));
                    }
                }
            ],
            'Performance Rating (3 years ago)': [
                'number',
                function (value, column, line, errors) {
                    if ('' !== value && (value < 0 || value > 100)) {
                        errors.push(this.createMessage(line, column, value, 'The value must be between 0 and 100'));
                    }
                }
            ],
            'Performance Rating (4 years ago)': [
                'number',
                function (value, column, line, errors) {
                    if ('' !== value && (value < 0 || value > 100)) {
                        errors.push(this.createMessage(line, column, value, 'The value must be between 0 and 100'));
                    }
                }
            ],

            'Remote Employee': [],
            'Separation Type': [],
            'Prof. Development': [],
            'Posting Date': [
                'date2'
            ],

            'Absences': [],
            'Successor Employee ID': [],
            'Employee Benefit Costs': [
                // 'number'
            ],
            'Employee Benefit Cost (1 year ago)': [
                // 'number'
            ],
            'Employee Benefit Cost (2 years ago)': [
                // 'number'
            ],
            'Employee Benefit Cost (3 years ago)': [
                // 'number'
            ],
            'Employee Benefit Cost (4 years ago)': [
                // 'number'
            ]
        },

        filters: {
            /**
             * @param value
             */
            'Industry Salary': function (value) {
                value = value.trim();
                if ('' === value) {
                    return null;
                }
                value = parseInt(value.replace(/[\$\,\s]/g, ''));
                return isNaN(value) ? null : value;
            },

            /**
             * @param value
             */
            'Employee Salary': function (value) {
                value = value.trim();
                if ('' === value) {
                    return 0;
                }
                value = parseInt(value.replace(/[\$\,\s]/g, ''));
                return isNaN(value) ? 0 : value;
            },

            /**
             * @param value
             */
            'Employee ID': function (value) {
                value = value.trim();
                return '' === value ? null : value;
            },

            /**
             * @param value
             */
            'Manager Employee ID': function (value) {
                value = value.trim();
                return '' === value ? null : value;
            },

            /**
             * @param value
             */
            'Employee Type': function (value) {
                value = value.trim();
                return '' === value ? null : value;

                /*return {
                 'full-time': 1,
                 'part-time': 2,
                 'contractor': 3
                 }[value.trim().toLowerCase()];*/
            },

            /**
             * @param value
             */
            'Gender': function (value) {
                value = value.trim().toLowerCase();
                return {
                    'male': 'Male',
                    'm' : 'Male',
                    'female': 'Female',
                    'f': 'Female'
                }[value] || value;
            },

            /**
             * @param value
             */
            'DOB': function (value) {
                var currYear = parseInt((new Date).getFullYear().toString().substr(2, 2));
                var match = value.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/) || value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
                var month = match[1];
                var day = match[2];
                var year = match[3];
                if (year < 100) {
                    year = (year > currYear) ? ('19' + year) : ('20' + year);
                }
                return year + '-' + month + '-' + day;
            },

            /**
             * @param value
             */
            'Hire Date': function (value) {
                var currYear = parseInt((new Date).getFullYear().toString().substr(2, 2));
                var match = value.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/) || value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
                var month = match[1];
                var day = match[2];
                var year = match[3];
                if (year < 100) {
                    year = (year > currYear) ? ('19' + year) : ('20' + year);
                }
                return year + '-' + month + '-' + day;
            },

            /**
             * @param value
             */
            'Termination Date': function (value) {
                value = value.trim();
                if ('' === value) {
                    return null;
                }
                var currYear = parseInt((new Date).getFullYear().toString().substr(2, 2));
                var match = value.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/) || value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
                var month = match[1];
                var day = match[2];
                var year = match[3];
                if (year < 100) {
                    year = (year > currYear) ? ('19' + year) : ('20' + year);
                }
                return year + '-' + month + '-' + day;
            },

            /**
             * @param value
             */
            'Division': function (value) {
                return value.trim();
            },

            /**
             * @param value
             */
            'Cost Center': function (value) {
                return value.trim();
            },

            /**
             * @param value
             */
            'Rehire Date': function (value) {
                value = value.trim();
                if ('' === value) {
                    return null;
                }
                var currYear = parseInt((new Date).getFullYear().toString().substr(2, 2));
                var match = value.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/) || value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
                var month = match[1];
                var day = match[2];
                var year = match[3];
                if (year < 100) {
                    year = (year > currYear) ? ('19' + year) : ('20' + year);
                }
                return year + '-' + month + '-' + day;
            },

            /**
             * @param value
             */
            'Cost per Hire': function (value) {
                value = value.trim().replace(/[\,\$]/g, '').replace(/^\.+|\.+$/g, '');
                return '' === value ? null : value;
            },

            /**
             * @param value
             */
            'Position Start Date': function (value) {
                value = value.trim();
                if ('' === value) {
                    return null;
                }

                var currYear = parseInt((new Date).getFullYear().toString().substr(2, 2));
                var match = value.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/) || value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
                var month = match[1];
                var day = match[2];
                var year = match[3];
                if (year < 100) {
                    year = (year > currYear) ? ('19' + year) : ('20' + year);
                }
                return year + '-' + month + '-' + day;
            },

            /**
             * @param value
             */
            'Previous Position Start Date': function (value) {
                value = value.trim();
                if ('' === value) {
                    return null;
                }
                var currYear = parseInt((new Date).getFullYear().toString().substr(2, 2));
                var match = value.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/) || value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
                var month = match[1];
                var day = match[2];
                var year = match[3];
                if (year < 100) {
                    year = (year > currYear) ? ('19' + year) : ('20' + year);
                }
                return year + '-' + month + '-' + day;
            },
            'Employee Salary (1 year ago)': function (value) {
                value = value.trim();
                if ('' === value) {
                    return 0;
                }
                value = parseInt(value.replace(/[\$\,\s]/g, ''));
                return isNaN(value) ? 0 : value;
            },
            'Employee Salary (2 years ago)': function (value) {
                value = value.trim();
                if ('' === value) {
                    return 0;
                }
                value = parseInt(value.replace(/[\$\,\s]/g, ''));
                return isNaN(value) ? 0 : value;
            },
            'Employee Salary (3 years ago)': function (value) {
                value = value.trim();
                if ('' === value) {
                    return 0;
                }
                value = parseInt(value.replace(/[\$\,\s]/g, ''));
                return isNaN(value) ? 0 : value;
            },
            'Employee Salary (4 years ago)': function (value) {
                value = value.trim();
                if ('' === value) {
                    return 0;
                }
                value = parseInt(value.replace(/[\$\,\s]/g, ''));
                return isNaN(value) ? 0 : value;
            },
            /**
             * @param value
             * @return {null|value}
             */
            'Performance Rating (this year)': function (value) {
                value = value.trim();
                if ('' === value ) {
                    return null;
                }
                value = parseFloat(value);
                return isNaN(value) ? 0 : value;
            },

            /**
             * @param value
             * @return {null|value}
             */
            'Performance Rating (1 year ago)': function (value) {
                value = value.trim();
                if ('' === value ) {
                    return null;
                }
                value = parseFloat(value);
                return isNaN(value) ? 0 : value;
            },

            /**
             * @param value
             * @return {null|value}
             */
            'Performance Rating (2 years ago)': function (value) {
                value = value.trim();
                if ('' === value ) {
                    return null;
                }
                value = parseFloat(value);
                return isNaN(value) ? 0 : value;
            },

            /**
             * @param value
             * @return {null|value}
             */
            'Performance Rating (3 years ago)': function (value) {
                value = value.trim();
                if ('' === value ) {
                    return null;
                }
                value = parseFloat(value);
                return isNaN(value) ? 0 : value;
            },

            /**
             * @param value
             * @return {null|value}
             */
            'Performance Rating (4 years ago)': function (value) {
                value = value.trim();
                if ('' === value ) {
                    return null;
                }
                value = parseFloat(value);
                return isNaN(value) ? 0 : value;
            },

            /**
             * @param value
             * @return {String}
             */
            'Remote Employee': function (value) {
                value = value.trim().toLowerCase();
                return '' === value ? null : value;
            },

            /**
             * @param value
             * @return {String}
             */
            'Separation Type': function (value) {
                value = value.trim();
                // return '' === value ? null : value;
                return value;
            },

            /**
             * @param value
             * @return {null}
             */
            'Absences': function (value) {
                value = value.trim();
                return '' === value ? null : value;
            },
            /**
             * @param value
             * @return {null}
             */
            'Successor Employee ID': function (value) {
                value = value.trim();
                return '' === value ? null : value;
            },
            /**
             * @param value
             * @return {null}
             */
            'Employee Benefit Costs': function (value) {
                value = value.trim();
                if ('' === value) {
                    return null;
                }
                value = parseInt(value.replace(/[\$\,\s]/g, ''));
                return isNaN(value) ? null : value;
            },
            /**
             * @param value
             * @return {null}
             */
            'Employee Benefit Cost (1 year ago)': function (value) {
                value = value.trim();
                if ('' === value) {
                    return null;
                }
                value = parseInt(value.replace(/[\$\,\s]/g, ''));
                return isNaN(value) ? null : value;
            },
            /**
             * @param value
             * @return {null}
             */
            'Employee Benefit Cost (2 years ago)': function (value) {
                value = value.trim();
                if ('' === value) {
                    return null;
                }
                value = parseInt(value.replace(/[\$\,\s]/g, ''));
                return isNaN(value) ? null : value;
            },
            /**
             * @param value
             * @return {null}
             */
            'Employee Benefit Cost (3 years ago)': function (value) {
                value = value.trim();
                if ('' === value) {
                    return null;
                }
                value = parseInt(value.replace(/[\$\,\s]/g, '').trim());
                return isNaN(value) ? null : value;
            },
            /**
             * @param value
             * @return {null}
             */
            'Employee Benefit Cost (4 years ago)': function (value) {
                value = value.trim();
                if ('' === value) {
                    return null;
                }
                value = parseInt(value.replace(/[\$\,\s]/g, '').trim());
                return isNaN(value) ? null : value;
            },
            /**
             * @param value
             */
            'Posting Date': function (value) {
                value = value.trim();
                if ('' === value) {
                    return null;
                }
                var currYear = parseInt((new Date).getFullYear().toString().substr(2, 2));
                var match = value.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/) || value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
                var month = match[1];
                var day = match[2];
                var year = match[3];
                if (year < 100) {
                    year = (year > currYear) ? ('19' + year) : ('20' + year);
                }
                return year + '-' + month + '-' + day;
            },
        }
    },
];

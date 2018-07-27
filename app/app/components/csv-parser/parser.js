'use strict';

var fs = require('fs');
var orm = require('../orm/orm-upload-csv');
var ORM = require('sequelize');
var parse = require('csv-parse');
var validator = require('./validator');
var filterValues = require('./filter-values');
var strToStream = require('string-to-stream');
var separateThread = require('../separate-thread');
var knex = require('../knex');
var config = require('../../../config').config;
require('../../config/global');

/**
 * @type {Function}
 */
/*var parserThread = separateThread(function (input, resolve, reject) {
    var fs = require('fs');
    var parse = require('csv-parse');
    var strToStream = require('string-to-stream');
    var stream = input.asString ? strToStream(input.fileOrData) : fs.createReadStream(input.fileOrData);

    stream.pipe(parse({
        delimiter: ','
    }, function (err, data) {
        if (err) {
            return reject(err);
        }

        if (!data.length) {
            return reject(new Error('Empty file'));
        }

        resolve({
            header: data.shift(),
            data: data
        });
    }));
});*/

function parserThread(input) {
    return new Promise(function (resolve, reject) {
        var fs = require('fs');
        var parse = require('csv-parse');
        var strToStream = require('string-to-stream');
        var stream = input.asString ? strToStream(input.fileOrData) : fs.createReadStream(input.fileOrData);

        stream.pipe(parse({
            delimiter: ','
        }, function (err, data) {
            if (err) {
                return reject(err);
            }

            if (!data.length) {
                return reject(new Error('Empty file'));
            }

            resolve({
                header: data.shift(),
                data: data
            });
        }));
    });
}

/**
 * @param inputFile
 * @returns {*}
 */
module.exports = {
    /**
     * @param fileOrData
     * @param asString
     * @return {*}
     */
    createStream: function (fileOrData, asString) {
        return asString ? strToStream(fileOrData) : fs.createReadStream(fileOrData);
    },

    /**
     * Parse CSV
     * @param fileOrData
     * @param asString
     * @return {*}
     */
    parse: function (fileOrData, asString) {
        return parserThread({
            fileOrData: fileOrData,
            asString: asString
        }).then(function (data) {
            return Promise.reduce(data.header, function (accum, item, index) {
                if (/^custom\s+/gi.test(item.trim())) {
                    accum.customFields.push(index);
                } else {
                    accum.staticFields.push(index);
                }

                return accum;
            }, {
                staticFields: [],
                customFields: []
            }).then(function (dataMapping) {
                dataMapping = dataMapping.staticFields.concat(dataMapping.customFields);

                return Promise.props({
                    /**
                     *
                     */
                    header: Promise.map(dataMapping, function (item) {
                        if (/^custom\s+/gi.test(data.header[item])) {
                            return data.header[item].substr(0, 64);
                        }

                        return data.header[item];
                    }),

                    /**
                     *
                     */
                    data: Promise.map(data.data, function (item) {
                        return Promise.map(dataMapping, function (_item) {
                            return item[_item];
                        });
                    })
                });
            });
        });
    },

    /**
     * @param fileOrData
     * @param parserName
     * @param asString
     * @param ignoreFilters
     * @return {Promise}
     */
    validate: function (fileOrData, parserName, asString, ignoreFilters) {
        return this.parse(fileOrData, asString).then(function (csv) {
            return validator.validate(csv, parserName, ignoreFilters);
        });
    },

    /**
     * @param fileOrData
     * @param parserName
     * @param customData
     * @param asString
     * @param ignoreFilters
     * @return {*}
     */
    saveToDatabase: function (fileOrData, parserName, customData, asString, ignoreFilters) {
        customData = customData || {};
        var _this = this;

        return this.parse(fileOrData, asString).then(function (csv) {
            return new Promise(function (resolve, reject) {
                validator.findParserByHeader(csv.header, parserName)
                    .then(function (_parser){
                        _parser = _parser.data;
                        if (! _parser) {
                            return reject(new Error('CSV file has an incorrect header. Please check CSV file header and try again.'));
                        }
                        return resolve(_parser);
                    });
            }).then(function (_parser) {
                return Promise.all([
                    filterValues(csv, _parser, ignoreFilters),
                    _parser
                ])
            });
        }).spread(function (csv, _parser) {
            var table = _parser.dataMapping.table;
            var columns = _parser.dataMapping.columns;

            if (!csv.data.length) {
                return Promise.resolve([]);
            }

            var mapping = [];
            var arrayOfHeaderColumns = [];
            var customFields;

            for (var columnName in columns) {
                arrayOfHeaderColumns.push(columns[columnName]);
                mapping.push(csv.header.indexOf(columnName));
            }

            return orm.transaction(function (t) {
                return Promise.each([
                    'SET foreign_key_checks = 0',
                    'TRUNCATE TABLE `trendata_bigdata_custom_field_value`',
                    //'TRUNCATE TABLE `trendata_bigdata_custom_field`',
                    'TRUNCATE TABLE `trendata_bigdata_user`'
                ], function (item) {
                    return orm.query(item, {
                        transaction: t
                    });
                }).then(function () {
                    return knex('INFORMATION_SCHEMA.COLUMNS')
                        .select('COLUMN_NAME')
                        .where({
                            TABLE_SCHEMA: config.sequelize.database,
                            TABLE_NAME: 'trendata_bigdata_user'
                        }).where(function (qb) {
                            qb.where(
                                'COLUMN_NAME',
                                'LIKE',
                                'custom_%'
                            ).orWhere(
                                'COLUMN_NAME',
                                'LIKE',
                                'custom %'
                            );
                        }).map(function (item) {
                            return item.COLUMN_NAME;
                        }).each(function (item) {
                            return knex.raw('ALTER TABLE `trendata_bigdata_user` DROP ??', [
                                item
                            ]);
                        }).then(function () {
                            return orm.query('TRUNCATE TABLE `trendata_bigdata_custom_field`', {
                                transaction: t
                            });
                        });
                }).then(function () {
                    var _customColumns = Object.keys(_this.getCustomFieldsByOneRow(csv.data[0], csv.header));

                    return Promise.each(_customColumns, function (item, index) {
                        return orm.query(knex.raw('ALTER TABLE `trendata_bigdata_user` ADD ?? varchar(255) COLLATE \'utf8_unicode_ci\' NULL', [
                            item
                        ]).toString(), {
                            transaction: t
                        }).then(function () {
                            if (index >= 15) {
                                // There are already 49 indexes in the table, so we can add only 15 indices
                                return;
                            }

                            return orm.query(knex.raw('ALTER TABLE `trendata_bigdata_user` ADD INDEX ?? (??)', [
                                item,
                                item
                            ]).toString(), {
                                transaction: t
                            });
                        });
                    }).then(function () {
                        return _customColumns;
                    });
                }).then(function (customFields) {
                    return Promise.each(customFields, function (item) {
                        return orm.query('INSERT INTO `trendata_bigdata_custom_field` (`trendata_bigdata_custom_field_name`) VALUES (?)', {
                            replacements: [item],
                            transaction: t
                        });
                    });
                }).then(function () {
                    return orm.query('SELECT * FROM `trendata_bigdata_custom_field`', {
                        type: ORM.QueryTypes.SELECT,
                        transaction: t
                    });
                }).reduce(function (accum, item) {
                    accum[item.trendata_bigdata_custom_field_name] = item.trendata_bigdata_custom_field_id;
                    return accum;
                }, {}).then(function (_customFields) {
                    customFields = _customFields;
                    var customFieldsSql =  '';

                    for (var customField in customFields) {
                        customFieldsSql += knex.raw(' ,`tbu`.?? ', [
                            customField
                        ]).toString();
                    }

                    var viewSql = "CREATE OR REPLACE VIEW `trendata_bigdata_user_view` AS " +
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
                        "`tbu`.`trendata_bigdata_user_distance_to_work` AS `commute_distance`," +
                        "IF (`tbu`.`trendata_bigdata_user_successor` IS NOT NULL, 'Yes', 'No') AS `successors_identified`,  " +
                        "IF (((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, '%Y-%m-01') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, '%Y-%m-01')) OR (`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, '%Y-%m-01'))), 1, 0) AS `active`, " +
                        "IF (((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, '%Y-%m-01') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, '%Y-%m-01')) OR (`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (-1 + 1) MONTH, '%Y-%m-01'))), 0, 1) AS `terminated`, " +
                        "DATEDIFF(`tbu`.`trendata_bigdata_user_position_hire_date`, `tbu`.`trendata_bigdata_user_posting_date`) AS `time_to_fill` " +
                        customFieldsSql +
                        "FROM " +
                        "`trendata_bigdata_user` AS `tbu`";

                    return orm.query(viewSql, {
                        transaction: t
                    });
                }).then(function () {
                    return Promise.map(csv.data, function (item) {
                        var result = {};

                        for (var i = 0; i < arrayOfHeaderColumns.length; ++i) {
                            result[arrayOfHeaderColumns[i]] = item[mapping[i]]
                        }

                        return Object.assign({}, result, _this.getCustomFieldsByOneRow(item, csv.header));
                    });
                }).then(function (result) {
                    return _.chunk(result, 1000);
                }).map(function (item) {
                    return orm.query(knex(table).insert(item).toString(), {
                        transaction: t
                    });
                }).then(function (data) {
                    /*return orm.query(knex(table).min('trendata_bigdata_user_id AS value').toString(), {
                        type: ORM.QueryTypes.SELECT,
                        transaction: t
                    }).then(function (rows) {
                        return rows[0].value;
                    });*/
                }).then(function (min) {
                    /*return Promise.reduce(csv.data, function (accum, item, index) {
                        var _customFields = _this.getCustomFieldsByOneRow(item, csv.header);

                        for (var _customField in _customFields) {
                            accum.push({
                                trendata_bigdata_custom_field_id: customFields[_customField],
                                trendata_bigdata_user_id: index + min,
                                trendata_bigdata_custom_field_value_value: _customFields[_customField]
                            });
                        }

                        return accum;
                    }, []).then(function (result) {
                        return _.chunk(result, 1000);
                    }).map(function (item) {
                        return orm.query(knex('trendata_bigdata_custom_field_value').insert(item).toString(), {
                            transaction: t
                        });
                    });*/
                });
            });
        });
    },

    /**
     * @param row
     * @param header
     * @param dataMapping
     * @param foreignKeyValue
     * @param t
     * @param customData
     * @param isRecursiveCall
     * @param customFields
     * @return {*}
     */
    saveOneRowToDatabase: function (row, header, dataMapping, foreignKeyValue, t, customData, isRecursiveCall, customFields) {
        var _this = this;

        var table       = dataMapping.table;
        var foreignKey  = dataMapping.foreignKey;
        var columns     = dataMapping.columns;
        var acceptedCustomFields = dataMapping.acceptedCustomFields;

        var insertColumns = [];
        var insertValues  = [];
        var insertPlaceholders = [];

        for (var customColumn in customData) {
            if (acceptedCustomFields.indexOf(customColumn) === -1) {
                continue;
            }

            if (customColumn.indexOf(':') === 0) {
                insertColumns.push('`' + customColumn.substr(1) + '`');
                insertValues.push(customData[customColumn]);
                insertPlaceholders.push('?');
            } else {
                insertColumns.push('`' + customColumn + '`');
                insertPlaceholders.push(customData[customColumn]);
            }
        }

        if (foreignKey && foreignKeyValue) {
            insertColumns.push('`' + foreignKey + '`');
            insertValues.push(foreignKeyValue);
            insertPlaceholders.push('?');
        }

        for (var headerName in columns) {
            insertColumns.push('`' + columns[headerName] + '`');
            insertValues.push(this.getValueByHeaderName(headerName, header, row));
            insertPlaceholders.push('?');
        }

        isRecursiveCall = true;

        var query = 'INSERT INTO `' + table + '` (' + insertColumns.join(',') + ') VALUES (' + insertPlaceholders.join(',') + ')';

        return orm.query(query, {
            replacements: insertValues,
            //transaction: t
        }).spread(function (metadata) {
            if (Object.keys(customFields).length) {
                var _customFields = _this.getCustomFieldsByOneRow(row, header);
                var query = 'INSERT INTO `trendata_bigdata_custom_field_value` (`trendata_bigdata_custom_field_id`, `trendata_bigdata_user_id`, `trendata_bigdata_custom_field_value_value`) VALUES ';
                var queryReplace = [];
                var insertrs = [];

                for (var field in customFields) {
                    insertrs.push('(?, ?, ?)');
                    queryReplace.push(
                        customFields[field],
                        metadata.insertId,
                        _customFields[field] || null
                    );
                }

                query += insertrs.join(', ');

                return orm.query(query, {
                    replacements: queryReplace,
                    //transaction: t
                });
            }
        });
    },

    /**
     * @param row
     * @param header
     */
    getCustomFieldsByOneRow: function (row, header) {
        return _.reduce(header, function (accum, headerName, index) {
            headerName = headerName.trim().replace(/\s+/g, '_').toLowerCase();

            if (/^custom_?.+?$/g.test(headerName)) {
                accum[headerName] = row[index];
            }

            return accum;
        }, {});
    },

    /**
     * @param key
     * @param header
     * @param row
     */
    getValueByHeaderName: function (key, header, row) {
        var index = header.indexOf(key);
        return index > -1 ? row[index] : null;
    }
};

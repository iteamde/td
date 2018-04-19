'use strict';

var orm = require('./orm/orm');
var ORM = require('sequelize');
var FinancialDataModel = require('../models/orm-models').FinancialData;
var jsVm = require('./js-virtual-machine');
var ormModels = require('../models/orm-models');
var pythonShell = require('./python-shell');
var dateFormat = require('dateformat');
var moment = require('moment');
var translation = require('./translation');
var separateThread = require('../components/separate-thread');
var cache = require('../components/cache');
var PromiseBreak = require('./promise-break');
var knex = require('./knex');
var sqlstring = require('sqlstring');

var makeAccessLevelSqlCacheObject = {

};
setInterval(function () {
    makeAccessLevelSqlCacheObject = {};
}, 300000);

/**
 *
 */
module.exports = {
    /**
     * @param {number} offsetStart
     * @param {number} offsetEnd
     * @param {Object} options
     * @return {Promise.<Array>}
     */
    makeTimeSpanOffsets: function (offsetStart, offsetEnd, options) {
        options = _.clone(options || {});

        offsetStart = parseInt(offsetStart, 10) || 0;
        offsetEnd = parseInt(offsetEnd, 10) || 0;
        var result = [];
        var momentObject;
        var tmp = {};
        var year;

        if (offsetEnd > offsetStart) {
            [offsetStart, offsetEnd] = [offsetEnd, offsetStart];
        }

        if (undefined === options.asYears) {
            options.asYears = (offsetStart - offsetEnd) > 11;
        }

        if (options.asYears) {
            for (var i = offsetStart; i >= offsetEnd; --i) {
                year = moment().subtract(i, 'months').format('YYYY');

                if (tmp[year]) {
                    tmp[year].push(i);
                } else {
                    tmp[year] = [i];
                }
            }

            for (var index in tmp) {
                result.push({
                    label: index,
                    year: parseInt(index, 10),
                    offsetStart: _.max(tmp[index]),
                    offsetEnd: _.min(tmp[index])
                });
            }

            return Promise.resolve(result);
        }

        for (var i = offsetStart; i >= offsetEnd; --i) {
            momentObject = moment().subtract(i, 'months');

            result.push({
                label: momentObject.format('MMMM'),
                year: parseInt(momentObject.format('YYYY'), 10),
                offsetStart: i,
                offsetEnd: i
            });
        }

        return Promise.resolve(result);
    },

    /**
     * @param verticalAxisType
     * @return {*}
     */
    verticalAxisTypeConverter: function (verticalAxisType) {
        verticalAxisType = verticalAxisType && verticalAxisType.toString().toLowerCase() || 'values';

        switch (verticalAxisType) {
            case 'dollars ($)':
                return {
                    /**
                     * @type string
                     */
                    type: 'dollar',

                    /**
                     * @type string
                     */
                    suffix: '$',

                    /**
                     * @param value
                     * @param maxValue
                     */
                    convert: function (value, maxValue) {
                        return _.round(parseFloat(value) || 0, 2);
                    }
                };
            case 'percentage (%)':
                return {
                    /**
                     * @type string
                     */
                    type: 'percent',

                    /**
                     * @type string
                     */
                    suffix: '%',

                    /**
                     * @param value
                     * @param maxValue
                     */
                    convert: function (value, maxValue) {
                        return _.round((parseFloat(value) || 0) * 100 / (parseFloat(maxValue) || 0), 2);
                    }
                };
            case 'values':
            default:
                return {
                    /**
                     * @type string
                     */
                    type: 'value',

                    /**
                     * @type string
                     */
                    suffix: '',

                    /**
                     * @param value
                     * @param maxValue
                     */
                    convert: function (value, maxValue) {
                        return _.round(parseFloat(value) || 0, 2);
                    }
                };
        }
    },

    /**
     * @param req
     */
    makeAccessLevelSql: function (req) {
        return Promise.resolve({
            query: ' (1 = 1) ',
            replacements: []
        });

        var cacheKey = 'user_' + req.user.trendata_user_id;

        if (makeAccessLevelSqlCacheObject[cacheKey]) {
            return Promise.resolve(makeAccessLevelSqlCacheObject[cacheKey]);
        }

        /**
         * @param employeeId
         * @param maxDepth
         */
        var findChildUsers = function (employeeId, maxDepth) {
            maxDepth = undefined === maxDepth ? 1000 : maxDepth;

            return orm.query(
                'SELECT ' +
                '`tbu`.`trendata_bigdata_user_employee_id` AS `employee_id`, ' +
                '`tbu`.`trendata_bigdata_user_manager_employee_id` AS `manager_employee_id` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'WHERE ' +
                '`tbu`.`trendata_bigdata_user_manager_employee_id` = ?',
                {
                    type: ORM.QueryTypes.SELECT,
                    replacements: [
                        employeeId
                    ]
                }
            ).then(function (rows) {
                if (--maxDepth <= 0) {
                    return rows;
                }

                return Promise.map(rows, function (item) {
                    return findChildUsers(item.employee_id, maxDepth);
                }).reduce(function (accum, item) {
                    return accum.concat(item);
                }, []).then(function (childRows) {
                    return rows.concat(childRows);
                });
            });
        };

        return orm.query(
            'SELECT ' +
            '`tbu`.`trendata_bigdata_user_employee_id` AS `employee_id` ' +
            'FROM ' +
            '`trendata_bigdata_user` AS `tbu` ' +
            'WHERE ' +
            '`tbu`.`trendata_bigdata_user_email` = ? ' +
            'LIMIT 1',
            {
                type: ORM.QueryTypes.SELECT,
                replacements: [
                    req.user && req.user.trendata_user_email || null
                ]
            }
        ).then(function (rows) {
            if (! rows.length) {
                return null;
            }

            return rows[0].employee_id;
        }).then(function (employeeId) {
            return findChildUsers(employeeId).then(function (users) {
                return _.uniqBy(users, 'manager_employee_id');
            }).map(function (item) {
                return item.manager_employee_id;
            }).then(function (managerEmployeeIds) {
                if (managerEmployeeIds.length) {
                    return {
                        query: ' (`tbu`.`trendata_bigdata_user_employee_id` = ? OR `tbu`.`trendata_bigdata_user_manager_employee_id` IN (?)) ',
                        replacements: [
                            employeeId,
                            managerEmployeeIds
                        ]
                    };
                }

                return {
                    query: ' (`tbu`.`trendata_bigdata_user_employee_id` = ?) ',
                    replacements: [
                        employeeId
                    ]
                };
            });
        }).tap(function (data) {
            makeAccessLevelSqlCacheObject[cacheKey] = data;
        });
    },

    /**
     *
     */
    getCustomFields: function () {
        return knex('trendata_bigdata_custom_field').map(function (item) {
            return item.trendata_bigdata_custom_field_name;
        });
    },

    /**
     * Make Filter Sql
     * @param filters
     * @return {{query: string, replacements: Array}}
     */
    makeFilterSqlByFilters: function(filters, customFields) {
        filters = _.clone(filters || {});
        var query = [];
        var replacements = [];
        var columns = {
            department: '`tbu`.`trendata_bigdata_user_department`',
            location: '`tbu`.`trendata_bigdata_user_country`', // Alias
            country: '`tbu`.`trendata_bigdata_user_country`',
            city: '`tbu`.`trendata_bigdata_user_address_city`',
            state: '`tbu`.`trendata_bigdata_user_address_state`',
            gender: '`tbu`.`trendata_bigdata_user_gender`',
            separationType: '`tbu`.`trendata_bigdata_user_voluntary_termination`',
            'separation type': '`tbu`.`trendata_bigdata_user_voluntary_termination`', // Alias
            division: '`tbu`.`trendata_bigdata_user_division`',
            'cost center': '`tbu`.`trendata_bigdata_user_cost_center`',
            'job level': '`tbu`.`trendata_bigdata_user_job_level`',
            'commute distance': '`tbu`.`trendata_bigdata_user_approximate_distance_to_work`',
            performance: '`tbu`.`trendata_bigdata_user_performance_percentage_this_year`'
        };

        _.reduce(customFields, function (accum, item) {
            accum[item] = '`tbu`.' + sqlstring.escapeId(item, true);
            return accum;
        }, columns);

        for (var filter in filters) {
            if (filters[filter]) {
                if (filters[filter].length) {
                    let condition = '';
                    let nullIndex = filters[filter].indexOf('null');
                    if (nullIndex > -1) {
                        condition = columns[filter] + ' IS NULL';
                        filters[filter].splice(nullIndex, 1);

                        if (filters[filter].length) {
                            condition = ' OR ' + condition;
                        }
                    }

                    if (filters[filter].length) {
                        condition = '(' + columns[filter] + ' IN (?)' + condition + ')';
                        replacements.push(filters[filter]);
                    }

                    query.push(condition);
                } else {
                    query.push('1 = 2');
                }
            }
        }

        return {
            query: ' (' + (query.length ? query.join(' AND ') : '1 = 1') + ') ',
            replacements: replacements
        };

        // return Promise.all([
        //     this.getAvailableFiltersForDrilldown(),
        //     this.getAvailableFiltersForAnalytics()
        // ]).spread(_.merge).then(function (availableFilters) {
        //     return Promise.resolve(customFields).reduce(function (accum, item) {
        //         accum[item] = '`tbu`.' + sqlstring.escapeId(item, true);
        //         return accum;
        //     }, columns).then(function (columns) {
        //         for (var filter in filters) {
        //             if (filters[filter]) {
        //                 var filterIntersect = _.intersection(availableFilters[filter] || [], filters[filter]);
        //
        //                 if (!filterIntersect.length) {
        //                     return {
        //                         query: ' (1 = 2) ',
        //                         replacements: []
        //                     };
        //                 } else if (filterIntersect.length === (availableFilters[filter] || []).length) {
        //                     continue;
        //                 }
        //
        //                 if (filterIntersect.length > ((availableFilters[filter] || []).length / 2)) {
        //                     query.push(columns[filter] + ' NOT IN (?)');
        //                     replacements.push(filterMap(_.difference(availableFilters[filter] || [], filterIntersect), filter));
        //                 } else {
        //                     query.push(columns[filter] + ' IN (?)');
        //                     replacements.push(filterMap(filterIntersect, filter));
        //                 }
        //             }
        //         }
        //
        //         return {
        //             query: ' (' + (query.length ? query.join(' AND ') : '1 = 1') + ') /*debug*/ ',
        //             replacements: replacements
        //         };
        //     });
        // });
    },

    /**
     * Get users grid settings
     * @param chartId
     * @return {Promise}
     */
     getUsersGridSettings: function(chartId, userId) {
        var query = 'SELECT ' +
            '`trendata_users_grid_settings_fields` AS `fields` ' +
            'FROM ' +
            '`trendata_users_grid_settings` ' +
            'WHERE ' +
            '`trendata_users_grid_settings_chart_id` = ? ' +
            'AND ' +
            '`trendata_users_grid_settings_user_id` = ?';

        var replacements = [
            chartId,
            userId
        ];

        return orm.query(query, {
            type: ORM.QueryTypes.SELECT,
            replacements: replacements
        }).spread(function(item) {
            if (item) {
                return item.fields.split(',');
            }

            if (chartId > 0) {
                return module.exports.getUsersGridSettings(0);
            }

            return null;
        });
     },

    /**
     * Create WHERE string for users grid
     * @param types
     * @param timeSpan
    */
    makeUsersFilter: function(timeSpan, types) {
        timeSpan = timeSpan || {
            start: 1,
            end: 1
        };

        return this.makeTimeSpanOffsets(timeSpan.start, timeSpan.end).reduce(function(result, timeSpanOffset, topIndex) {
            if (topIndex > 0)
                result.query += 'OR ';

            return _.reduce(types || ['active'], function(accum, type, index) {
                if (index > 0)
                    accum.query += 'OR ';

                switch(type) {
                    case 'terminated':
                        accum.query += '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL ' +
                            'AND ' +
                            '`tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ' +
                            'AND ' +
                            '`tbu`.`trendata_bigdata_user_position_termination_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ';
                        accum.replacements.push(-timeSpanOffset.offsetStart, -timeSpanOffset.offsetEnd);
                        break;
                    case 'hired':
                        accum.query += '(`tbu`.`trendata_bigdata_user_position_hire_date` IS NOT NULL ' +
                            'AND ' +
                            '`tbu`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ' +
                            'AND ' +
                            '`tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ';
                        accum.replacements.push(-timeSpanOffset.offsetStart, -timeSpanOffset.offsetEnd);
                        break;
                    default:
                        accum.query += '(((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                            'OR ' +
                            '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')))) ';
                        accum.replacements.push(-timeSpanOffset.offsetStart, -timeSpanOffset.offsetEnd, -timeSpanOffset.offsetStart);
                }

                return accum;
            }, result);
        }, {
            query: '',
            replacements: []
        });
    },

    /**
     * @param filterSql
     * @param accessLevelSql
     * @param pagination
     * @param chartId
     * @param usersFilter
     * @param customFields
     * @param userId
     * @param getAllPages
     * @return {*|Promise<T>}
     */
    getUsersOnPageByFilters: function(filterSql, accessLevelSql, pagination, chartId, usersFilter, customFields, userId, getAllPages) {
        return this.getUsersGridSettings(chartId, userId).then(function (columns) {
            var columnToDbFieldRelation = {
                'full name': 'CONCAT(`tbu`.`trendata_bigdata_user_first_name`, \' \', `tbu`.`trendata_bigdata_user_last_name`)',
                'full-name': 'CONCAT(`tbu`.`trendata_bigdata_user_first_name`, \' \', `tbu`.`trendata_bigdata_user_last_name`)', // Alias
                'full_name': 'CONCAT(`tbu`.`trendata_bigdata_user_first_name`, \' \', `tbu`.`trendata_bigdata_user_last_name`)', // Alias
                'employee id': '`tbu`.`trendata_bigdata_user_employee_id`',
                'location': '`tbu`.`trendata_bigdata_user_country`',
                'country': '`tbu`.`trendata_bigdata_user_country`',
                'manager': 'CONCAT(`tbu_inner`.`trendata_bigdata_user_first_name`, \' \', `tbu_inner`.`trendata_bigdata_user_last_name`)',
                'job level': '`tbu`.`trendata_bigdata_user_job_level`',
                'department': '`tbu`.`trendata_bigdata_user_department`',
                'division': '`tbu`.`trendata_bigdata_user_division`',
                'cost center': '`tbu`.`trendata_bigdata_user_cost_center`',
                'employee type': '`tbu`.`trendata_bigdata_employee_type`',
                'education level': '`tbu`.`trendata_bigdata_user_education_history_level`',
                'gender': '`tbu`.`trendata_bigdata_user_gender`',
                'hire date': 'DATE_FORMAT(`tbu`.`trendata_bigdata_user_position_hire_date`, "%M %e, %Y")',
                'termination date': 'DATE_FORMAT(`tbu`.`trendata_bigdata_user_position_termination_date`, "%M %e, %Y")',
                'current job code': '`tbu`.`trendata_bigdata_user_position_current_job_code`',
                'ethnicity': '`tbu`.`trendata_bigdata_user_ethnicity`',
                'position start date': 'DATE_FORMAT(`tbu`.`trendata_bigdata_user_position_start_date`, "%M %e, %Y")',
                'hire source': '`tbu`.`trendata_bigdata_hire_source`',
                'salary': '`tbu`.`trendata_bigdata_user_salary`',
                'prof. dev.': '`tbu`.`trendata_bigdata_user_prof_development`',
                'absences': '`tbu`.`trendata_bigdata_user_absences`',
                'benefit cost': '`tbu`.`trendata_bigdata_user_benefit_costs`',
                'performance': '`tbu`.`trendata_bigdata_user_performance_percentage_this_year`'
            };

            var defaultTableColumns = [
                'full name',
                'employee id',
                'location',
                'country',
                'manager',
                'job level',
                'department',
                'division',
                'cost center',
                'employee type',
                'education level',
                'gender',
                'hire date',
                'termination date',
                'current job code',
                'ethnicity',
                'position start date',
                'hire source',
                'salary',
                'prof. dev.',
                'absences',
                'benefit cost',
                'performance'
            ];

            _.each(customFields, field => {
                columnToDbFieldRelation[field] = '`tbu`.' + sqlstring.escapeId(field, true);
                defaultTableColumns.push(field);
            });

            var dateColumns = {
                'hire date': '`tbu`.`trendata_bigdata_user_position_hire_date`',
                'termination date': '`tbu`.`trendata_bigdata_user_position_termination_date`',
                'position start date': '`tbu`.`trendata_bigdata_user_position_start_date`'
            };

            pagination = pagination || {};

            var pageNumber = parseInt(pagination.page_number) || 1;
            pageNumber = pageNumber < 1 ? 1 : pageNumber;

            var pageSize = parseInt(pagination.page_size) || 10;
            pageSize = pageSize < 1 ? 10 : pageSize;

            var tableColumns = _.map(columns || pagination.table_columns || [
                'Full Name',
                'Location',
                'Manager',
                'Department'
            ], function (item) {
                return item && item.toString().toLowerCase();
            });

            tableColumns = _.intersection(defaultTableColumns, tableColumns);

            var sortColumn = dateColumns[pagination.sort_column] || columnToDbFieldRelation[pagination.sort_column && pagination.sort_column.toString().toLocaleLowerCase() || 'full name'] || '`tbu`.`full_name`';

            var sortType = {
                asc: 'ASC',
                desc: 'DESC'
            }[pagination.sort_type && pagination.sort_type.toString().toLocaleLowerCase() || 'asc'] || 'ASC';

            var selectString = _.reduce(tableColumns, function (accum, item) {
                accum.push(columnToDbFieldRelation[item] + ' AS ' + sqlstring.escapeId(item, true));
                return accum;
            }, []).join(', ');

            var query = 'SELECT ' +
                selectString +
                ' FROM `trendata_bigdata_user` AS `tbu` ' +
                'LEFT JOIN ' +
                '`trendata_bigdata_user` AS `tbu_inner` ' +
                'ON ' +
                '`tbu`.`trendata_bigdata_user_manager_employee_id` = `tbu_inner`.`trendata_bigdata_user_employee_id` ' +
                'WHERE ' +
                filterSql.query +
                ' AND ' +
                accessLevelSql.query +
                ' AND ' +
                '(' + usersFilter.query + ')';

            var replacements = filterSql.replacements.concat(accessLevelSql.replacements).concat(usersFilter.replacements);

            if (! getAllPages) {
                query += ' ORDER BY ' + sortColumn + ' ' + sortType + ' LIMIT ? OFFSET ?';
                replacements = replacements.concat([
                    pageSize,
                    (pageNumber - 1) * pageSize
                ]);
            }

            return orm.query(query, {
                type: ORM.QueryTypes.SELECT,
                replacements: replacements
            });
        });
    },

    /**
     * @param filterSql
     * @param accessLevelSql
     */
    getUsersCountByFilters: function(filterSql, accessLevelSql, usersFilter) {
        var query = 'SELECT ' +
            'COUNT(*) AS `count` ' +
            'FROM ' +
            '`trendata_bigdata_user` AS `tbu` ' +
            'WHERE ' +
            filterSql.query +
            ' AND ' +
            accessLevelSql.query +
            ' AND ' +
            '(' + usersFilter.query + ')';

        return orm.query(query, {
            type: ORM.QueryTypes.SELECT,
            replacements: filterSql.replacements.concat(accessLevelSql.replacements).concat(usersFilter.replacements)
        }).then(function (rows) {
            return rows[0].count || 0;
        });
    },

    /**
     * Get available filters
     * @return {Promise}
     */
    getAvailableFiltersForAnalytics: function() {
        var _this = this;

        return Promise.props({
            /**
             *
             */
            department: orm.query(
                'SELECT ' +
                '`tbu`.`trendata_bigdata_user_department` AS `department` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'GROUP BY ' +
                '`tbu`.`trendata_bigdata_user_department`',
                {
                    type: ORM.QueryTypes.SELECT
                }
            ).map(function (item) {
                return item.department;
            }),

            /**
             *
             */
            location: orm.query(
                'SELECT ' +
                '`tbu`.`trendata_bigdata_user_country` AS `location` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'GROUP BY ' +
                '`tbu`.`trendata_bigdata_user_country`',
                {
                    type: ORM.QueryTypes.SELECT
                }
            ).map(function (item) {
                return item.location;
            }),

            /**
             *
             */
            gender: orm.query(
                'SELECT ' +
                '`tbu`.`trendata_bigdata_user_gender` as `gender` ' +
                'FROM ' +
                '`trendata_bigdata_user` as `tbu` ' +
                'GROUP BY ' +
                '`tbu`.`trendata_bigdata_user_gender`',
                {
                    type: ORM.QueryTypes.SELECT
                }
            ).map(function(item) {
                return item.gender;
            }),

            /**
             *
             */
             'job level': orm.query(
                'SELECT ' +
                '`tbu`.`trendata_bigdata_user_job_level` AS `job_level` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'GROUP BY ' +
                '`tbu`.`trendata_bigdata_user_job_level`',
                {
                    type: ORM.QueryTypes.SELECT,
                    replacements: []
                }
            ).map(function (item) {
                return item.job_level;
            })
        }).then(function (filters) {
            return knex('trendata_bigdata_custom_field').reduce(function (accum, item) {
                return knex('trendata_bigdata_user')
                    .select(knex.raw('?? as `value`', [item.trendata_bigdata_custom_field_name]))
                    .groupByRaw('??', [item.trendata_bigdata_custom_field_name])
                    .map(function (item) {
                        return item.value;
                    }).then(function (values) {
                        accum[item.trendata_bigdata_custom_field_name] = values;
                        return accum;
                    });

                /*return knex('trendata_bigdata_custom_field_value')
                    .select('trendata_bigdata_custom_field_value_value AS value')
                    .where('trendata_bigdata_custom_field_id', item.trendata_bigdata_custom_field_id)
                    .groupBy('trendata_bigdata_custom_field_value_value')
                    .map(function (item) {
                        return item.value;
                    }).then(function (values) {
                        accum[item.trendata_bigdata_custom_field_name] = values;
                        return accum;
                    });*/
            }, filters);
        });
    },

    /**
     * Get available filters
     * @return {Promise}
     */
    getAvailableFiltersForDrilldown: function(customFields) {
        var _this = this;

        return Promise.props({
            /**
             *
             */
            department: orm.query(
                'SELECT ' +
                '`tbu`.`trendata_bigdata_user_department` AS `department` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'GROUP BY ' +
                '`tbu`.`trendata_bigdata_user_department`',
                {
                    type: ORM.QueryTypes.SELECT
                }
            ).map(function (item) {
                return item.department;
            }),

            /**
             *
             */
            division: orm.query(
                'SELECT `trendata_bigdata_user_division` ' +
                'FROM `trendata_bigdata_user` ' +
                'GROUP BY `trendata_bigdata_user_division`',
                {
                    type: ORM.QueryTypes.SELECT
                }
            ).map(function (item) {
                return item.trendata_bigdata_user_division;
            }),

            /**
             *
             */
            'cost center': orm.query(
                'SELECT `trendata_bigdata_user_cost_center` ' +
                'FROM `trendata_bigdata_user` ' +
                'GROUP BY `trendata_bigdata_user_cost_center`',
                {
                    type: ORM.QueryTypes.SELECT
                }
            ).map(function (item) {
                return item.trendata_bigdata_user_cost_center;
            }),

            /**
             *
             */
            gender: orm.query(
                'SELECT ' +
                '`tbu`.`trendata_bigdata_user_gender` as `gender` ' +
                'FROM ' +
                '`trendata_bigdata_user` as `tbu` ' +
                'GROUP BY ' +
                '`tbu`.`trendata_bigdata_user_gender`',
                {
                    type: ORM.QueryTypes.SELECT
                }
            ).map(function(item) {
                return item.gender;
            }),

            /**
             *
             */
            city: orm.query(
                'SELECT ' +
                '`tbu`.`trendata_bigdata_user_address_city` AS `city` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'GROUP BY ' +
                '`tbu`.`trendata_bigdata_user_address_city`',
                {
                    type: ORM.QueryTypes.SELECT
                }
            ).map(function (item) {
                return item.city;
            }),

            /**
             *
             */
            state: orm.query(
                'SELECT ' +
                '`tbu`.`trendata_bigdata_user_address_state` AS `state` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'GROUP BY ' +
                '`tbu`.`trendata_bigdata_user_address_state`',
                {
                    type: ORM.QueryTypes.SELECT
                }
            ).map(function (item) {
                return item.state;
            }),

            /**
             *
             */
            country: orm.query(
                'SELECT ' +
                '`tbu`.`trendata_bigdata_user_country` AS `country` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'GROUP BY ' +
                '`tbu`.`trendata_bigdata_user_country`',
                {
                    type: ORM.QueryTypes.SELECT
                }
            ).map(function (item) {
                return item.country;
            }),

            /**
             *
             */
            'job level': orm.query(
                'SELECT ' +
                '`tbu`.`trendata_bigdata_user_job_level` AS `job_level` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'GROUP BY ' +
                '`tbu`.`trendata_bigdata_user_job_level`',
                {
                    type: ORM.QueryTypes.SELECT
                    // replacements: []
                }
            ).map(function (item) {
                return item.job_level;
            }),

            /**
             *
             */
            'commute distance': orm.query(
                'SELECT ' +
                '`tbu`.`trendata_bigdata_user_approximate_distance_to_work` AS `commute_distance` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'GROUP BY ' +
                '`tbu`.`trendata_bigdata_user_approximate_distance_to_work` ' +
                'ORDER BY ' +
                'CONVERT(SUBSTR(`tbu`.`trendata_bigdata_user_approximate_distance_to_work`, 2), UNSIGNED INTEGER),' +
                '`tbu`.`trendata_bigdata_user_approximate_distance_to_work`',
                {
                    type: ORM.QueryTypes.SELECT
                    // replacements: []
                }
            ).map(function (item) {
                return item.commute_distance;
            }),

            /**
             *
             */
            performance: orm.query(
                'SELECT ' +
                '`tbu`.`trendata_bigdata_user_performance_percentage_this_year` AS `performance` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'GROUP BY ' +
                '`tbu`.`trendata_bigdata_user_performance_percentage_this_year`',
                {
                    type: ORM.QueryTypes.SELECT
                    // replacements: []
                }
            ).map(function (item) {
                return item.performance;
            })
        }).then(function (filters) {
            return knex('trendata_bigdata_custom_field').reduce(function (accum, item) {
                return knex('trendata_bigdata_user')
                    .select(knex.raw('?? as `value`', [item.trendata_bigdata_custom_field_name]))
                    .groupByRaw('??', [item.trendata_bigdata_custom_field_name])
                    .map(function (item) {
                        return item.value;
                    }).then(function (values) {
                        accum[item.trendata_bigdata_custom_field_name] = values;
                        return accum;
                    });

                /*return knex('trendata_bigdata_custom_field_value')
                    .select('trendata_bigdata_custom_field_value_value AS value')
                    .where('trendata_bigdata_custom_field_id', item.trendata_bigdata_custom_field_id)
                    .groupBy('trendata_bigdata_custom_field_value_value')
                    .map(function (item) {
                        return item.value;
                    }).then(function (values) {
                        accum[item.trendata_bigdata_custom_field_name] = values;
                        return accum;
                    });*/
            }, filters);
        });
    },

    /**
     * @param input
     * @return {Promise}
     */
    getTrendlineCurvePython: function (input) {
        return pythonShell('hp_f_v3.py', input).then(function (data) {
            return JSON.parse(data[0]);
        });
    },

    /**
     * @param req
     * @param filters
     */
    getAnalyticsSummary: function (req, filterSql, accessLevelSql, keepOrder) {
        var result = [
            {name: 'Avg. Salary'},
            {name: 'Remote Employees'},
            {name: 'HP in Prof Dev'},
            {name: 'Recruiting'},
            {name: 'Total Turnover'},
            {name: 'HP Turnover'},
            {name: 'Non-HP Turnover'},
            {name: 'Turnover Prod Loss % of Rev'},
            {name: 'Total Recruiting Cost'},
            {name: 'Turnover Productivity Loss'},
            {name: 'Number of Employees'},
            {name: 'Company Rev(Annualized)'}
        ];

        return Promise.resolve(_.rangeRight(1, 7)).map(function(i) {
            var month = moment().add(-i, 'month');
            var currentMonth = keepOrder ? 6 - i : month.format('MMMM');
            var currentYear = month.format('YYYY');
            var performanceColumn = month.isSame(moment(), 'year') ? '`tbu`.`trendata_bigdata_user_performance_percentage_this_year`' : '`tbu`.`trendata_bigdata_user_performance_percentage_1_year_ago`';

            return Promise.props({
                /**
                 *
                 */
                activeEmployees: (function() {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                        'OR ' +
                        '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                        'AND ' +
                        filterSql.query +
                        ' AND ' +
                        accessLevelSql.query;

                    var replacements = [
                        -i,
                        -i,
                        -i,
                        -i
                    ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                    return orm.query(query, {
                        type: ORM.QueryTypes.SELECT,
                        replacements: replacements
                    }).then(function(rows) {
                        return rows && rows[0] ? rows[0].count : 0;
                    });
                })(),

                /**
                 *
                 */
                averageSalary: (function() {
                    var salaryColumn = month.isSame(moment(), 'year') ? '`tbu`.`trendata_bigdata_user_salary`' : '`tbu`.`trendata_bigdata_user_salary_1_year_ago`';
                    var query = 'SELECT ' +
                        'AVG(' + salaryColumn + ') AS `avg`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                        'OR ' +
                        '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                        'AND ' +
                        salaryColumn + ' IS NOT NULL ' +
                        'AND ' +
                        filterSql.query +
                        ' AND ' +
                        accessLevelSql.query;

                    var replacements = [
                        -i,
                        -i,
                        -i,
                        -i
                    ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                    return orm.query(query, {
                        type: ORM.QueryTypes.SELECT,
                        replacements: replacements
                    }).then(function(rows) {
                        return rows && rows[0] ? rows[0].avg : 0;
                    });
                })(),

                /**
                 *
                 */
                remoteEmployees: (function() {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                        'OR ' +
                        '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_remote_employee` = \'yes\' ' +
                        'AND ' +
                        filterSql.query +
                        ' AND ' +
                        accessLevelSql.query;

                    var replacements = [
                        -i,
                        -i,
                        -i,
                        -i
                    ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                    return orm.query(query, {
                        type: ORM.QueryTypes.SELECT,
                        replacements: replacements
                    }).then(function(rows) {
                        return rows && rows[0] ? rows[0].count : 0;
                    });
                })(),

                /**
                 *
                 */
                profDevEmployees: (function() {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                        'OR ' +
                        '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_prof_development` = \'yes\' ' +
                        'AND ' +
                        filterSql.query +
                        ' AND ' +
                        accessLevelSql.query;

                    var replacements = [
                        -i,
                        -i,
                        -i,
                        -i
                    ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                    return orm.query(query, {
                        type: ORM.QueryTypes.SELECT,
                        replacements: replacements
                    }).then(function(rows) {
                        return rows && rows[0] ? rows[0].count : 0;
                    });
                })(),

                /**
                 *
                 */
                profDevHPEmployees: (function() {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                        'OR ' +
                        '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_prof_development` = \'yes\'' +
                        'AND ' +
                        performanceColumn + ' > 3 ' +
                        'AND ' +
                        filterSql.query +
                        ' AND ' +
                        accessLevelSql.query;

                    var replacements = [
                        -i,
                        -i,
                        -i,
                        -i
                    ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                    return orm.query(query, {
                        type: ORM.QueryTypes.SELECT,
                        replacements: replacements
                    }).then(function(rows) {
                        return rows && rows[0] ? rows[0].count : 0;
                    });
                })(),

                /**
                 *
                 */
                hpEmployees: (function() {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                        'OR ' +
                        '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                        'AND ' +
                        performanceColumn + ' > 3 ' +
                        'AND ' +
                        filterSql.query +
                        ' AND ' +
                        accessLevelSql.query;

                    var replacements = [
                        -i,
                        -i,
                        -i,
                        -i
                    ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                    return orm.query(query, {
                        type: ORM.QueryTypes.SELECT,
                        replacements: replacements
                    }).then(function(rows) {
                        return rows && rows[0] ? rows[0].count : 0;
                    });
                })(),

                /**
                 *
                 */
                hiredEmployees: (function() {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '`tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ' +
                        'AND ' +
                        filterSql.query +
                        ' AND ' +
                        accessLevelSql.query;

                    var replacements = [
                        -i,
                        -i,
                        -i
                    ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                    return orm.query(query, {
                        type: ORM.QueryTypes.SELECT,
                        replacements: replacements
                    }).then(function(rows) {
                        return rows && rows[0] ? rows[0].count : 0;
                    });
                })(),

                /**
                 *
                 */
                terminatedEmployees: (function() {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '`tbu`.`trendata_bigdata_user_position_termination_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ' +
                        'AND ' +
                        filterSql.query +
                        ' AND ' +
                        accessLevelSql.query;

                    var replacements = [
                        -i,
                        -i,
                        -i
                    ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                    return orm.query(query, {
                        type: ORM.QueryTypes.SELECT,
                        replacements: replacements
                    }).then(function(rows) {
                        return rows && rows[0] ? rows[0].count : 0;
                    });
                })(),

                /**
                 *
                 */
                hpTerminatedEmployees: (function() {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '`tbu`.`trendata_bigdata_user_position_termination_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ' +
                        'AND ' +
                        performanceColumn + ' > 3 ' +
                        'AND ' +
                        filterSql.query +
                        ' AND ' +
                        accessLevelSql.query;

                    var replacements = [
                        -i,
                        -i,
                        -i
                    ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                    return orm.query(query, {
                        type: ORM.QueryTypes.SELECT,
                        replacements: replacements
                    }).then(function(rows) {
                        return rows && rows[0] ? rows[0].count : 0;
                    });
                })(),

                /**
                 *
                 */
                nonHpTerminatedEmployees: (function() {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '`tbu`.`trendata_bigdata_user_position_termination_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ' +
                        'AND ' +
                        '(' + performanceColumn + ' < 4 OR ' + performanceColumn + ' IS NULL) ' +
                        'AND ' +
                        filterSql.query +
                        ' AND ' +
                        accessLevelSql.query;

                    var replacements = [
                        -i,
                        -i,
                        -i
                    ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                    return orm.query(query, {
                        type: ORM.QueryTypes.SELECT,
                        replacements: replacements
                    }).then(function(rows) {
                        return rows && rows[0] ? rows[0].count : 0;
                    });
                })(),

                /**
                 *
                 */
                nonHpEmployees: (function() {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                        'OR ' +
                        '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                        'AND ' +
                        '(' + performanceColumn + ' < 4 OR ' + performanceColumn + ' IS NULL)' +
                        'AND ' +
                        filterSql.query +
                        ' AND ' +
                        accessLevelSql.query;

                    var replacements = [
                        -i,
                        -i,
                        -i,
                        -i
                    ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                    return orm.query(query, {
                        type: ORM.QueryTypes.SELECT,
                        replacements: replacements
                    }).then(function(rows) {
                        return rows && rows[0] ? rows[0].count : 0;
                    });
                })(),

                /**
                 *
                 */
                recruitingCost: (function() {
                    var query = 'SELECT ' +
                        'SUM(`tbu`.`trendata_bigdata_user_cost_per_hire`) AS `sum`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '`tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_cost_per_hire` IS NOT NULL ' +
                        'AND ' +
                        filterSql.query +
                        ' AND ' +
                        accessLevelSql.query;

                    var replacements = [
                        -i,
                        -i,
                        -i
                    ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                    return orm.query(query, {
                        type: ORM.QueryTypes.SELECT,
                        replacements: replacements
                    }).then(function(rows) {
                        return rows && rows[0] ? rows[0].sum : 0;
                    });
                })(),

                /**
                 *
                 */
                financialInputs: FinancialDataModel.findAll({
                    where: {
                        trendata_financial_data_year: {
                            $gt: moment().format('YYYY') - 3
                        },
                        trendata_financial_data_created_by: req && req.parentUser && req.parentUser.trendata_user_id || 0
                    }
                }).then(function(data) {
                    var financialData = {
                        hiringCost: {},
                        grossRevenue: {}
                    };

                    _.each(data, function(item) {
                        var fromJson = JSON.parse(item.trendata_financial_data_json_data);
                        financialData.hiringCost[item.trendata_financial_data_year] = _.find(fromJson, {title: 'Hiring Costs'}).data;
                        financialData.grossRevenue[item.trendata_financial_data_year] = _.find(fromJson, {title: 'Gross Revenue'}).data;
                    });

                    return financialData;
                })
            }).then(function(data) {
                //Avg. Salary
                result[0][currentMonth] = _.round(data.averageSalary, 2);

                //Remote Employees
                result[1][currentMonth] = _.round(100 * data.remoteEmployees / data.activeEmployees, 2);

                //HP in Prof Dev
                result[2][currentMonth] = _.round(100 * data.profDevHPEmployees / data.hpEmployees, 2);

                //Recruiting
                result[3][currentMonth] = _.round(data.hiredEmployees, 2);

                //Total Turnover
                result[4][currentMonth] = _.round(100 * data.terminatedEmployees / (data.activeEmployees + data.terminatedEmployees), 2);

                //HP Turnover
                result[5][currentMonth] = _.round(100 * data.hpTerminatedEmployees / data.hpEmployees, 2);

                //Non-HP Turnover
                result[6][currentMonth] = _.round(100 * data.nonHpTerminatedEmployees / data.nonHpEmployees, 2);

                //Total Recruiting Cost
                result[8][currentMonth] = data.recruitingCost || (data.financialInputs.hiringCost && data.financialInputs.hiringCost[currentYear]  ? +data.financialInputs.hiringCost[currentYear][month.format('M') - 1].value : 0);

                //Number of Employees
                result[10][currentMonth] = _.round(data.activeEmployees, 2);

                //Turnover Productivity Loss
                result[9][currentMonth] = _.round(.75 * result[10][currentMonth] * result[5][currentMonth] * result[0][currentMonth], 2);

                //Company Rev(Annualized)
                result[11][currentMonth] = 0;
                for (var j = 0; j < 12; j++) {
                    var tmpMonth = moment().add(-(i+j), 'month');
                    result[11][currentMonth] += data.financialInputs.grossRevenue && data.financialInputs.grossRevenue[tmpMonth.format('YYYY')] ? +data.financialInputs.grossRevenue[tmpMonth.format('YYYY')][tmpMonth.format('M') - 1].value : 0;
                }

                //Turnover Prod Loss % of Rev
                result[7][currentMonth] = result[11][currentMonth] ? _.round(result[9][currentMonth] / result[11][currentMonth], 2) : 0;
            });
        }).then(function() {
            return result;
        });
    }
};
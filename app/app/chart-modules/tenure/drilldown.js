'use strict';

/**
 *
 */
var requestData = 'POST' === req.method ? req.body : {
    type: undefined,
    data: {
        /**
         * String: 'Location', 'Gender', 'Department'
         */
        chart_view: undefined,

        /**
         *
         */
        filters: {
            /**
             * String[]
             */
            department: undefined,

            /**
             * String[]
             */
            location: undefined,

            /**
             * String[]
             */
            gender: undefined
        },

        /**
         * Integer: page number
         */
        user_pagination: undefined
    }
};

requestData = _.merge({
    data: {
        chart_view: undefined,
        filters: {
            department: undefined,
            location: undefined,
            gender: undefined
        },
        user_pagination: undefined
    }
}, requestData);

/**
 * @type {Function}
 */
var calculateSubChartData = function (input) {
    var verticalAxisTypeConverter = input.verticalAxisTypeConverter;
    var filterSql = input.filterSql;
    var accessLevelSql = input.accessLevelSql;
    var column = input.column;
    var values = input.values;
    var i = 0;

    return Promise.map(values, function (item) {
        return orm.query(
            'SELECT ' +
            'COUNT(*) AS `total_count` ' +
            'FROM ' +
            '`trendata_bigdata_user` AS `tbu` ' +
            'WHERE ' +
            '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW(), \'%Y-%m-01\')) ' +
            'OR ' +
            '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\'))) ' +
            'AND ' +
            column + ' = ? ' +
            'AND ' +
            filterSql.query +
            ' AND ' +
            accessLevelSql.query,
            {
                type: ORM.QueryTypes.SELECT,
                replacements: [
                    item
                ].concat(filterSql.replacements).concat(accessLevelSql.replacements)
            }
        ).then(function(rows) {
            var totalCount = rows[0].total_count;
            if (null === totalCount || 1 > totalCount) {
                return {
                    label: item,
                    values: [0, 0, 0, 0, 0, 0]
                };
            }

            return Promise.all([
                /**
                 *
                 */
                orm.query(
                    'SELECT ' +
                    'COUNT(*) AS `filtered_count` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'WHERE ' +
                    '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW(), \'%Y-%m-01\')) ' +
                    'OR ' +
                    '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\'))) ' +
                    'AND ' +
                    column + ' = ? ' +
                    'AND ' +
                    'DATEDIFF(NOW(), IFNULL (`tbu`.`trendata_bigdata_user_rehire_date`, `tbu`.`trendata_bigdata_user_position_hire_date`)) <= 365 ' +
                    'AND ' +
                    filterSql.query +
                    ' AND ' +
                    accessLevelSql.query,
                    {
                        type: ORM.QueryTypes.SELECT,
                        replacements: [
                            item
                        ].concat(filterSql.replacements).concat(accessLevelSql.replacements)
                    }
                ).then(function(result) {
                    return verticalAxisTypeConverter.convert(result[0].filtered_count, totalCount);
                }),

                /**
                 *
                 */
                orm.query(
                    'SELECT ' +
                    'COUNT(*) AS `filtered_count` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'WHERE ' +
                    '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW(), \'%Y-%m-01\')) ' +
                    'OR ' +
                    '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\'))) ' +
                    'AND ' +
                    column + ' = ? ' +
                    'AND ' +
                    'DATEDIFF(NOW(), IFNULL (`tbu`.`trendata_bigdata_user_rehire_date`, `tbu`.`trendata_bigdata_user_position_hire_date`)) BETWEEN 366 AND (365 * 2)' +
                    'AND ' +
                    filterSql.query +
                    ' AND ' +
                    accessLevelSql.query,
                    {
                        type: ORM.QueryTypes.SELECT,
                        replacements: [
                            item
                        ].concat(filterSql.replacements).concat(accessLevelSql.replacements)
                    }
                ).then(function(result) {
                    return verticalAxisTypeConverter.convert(result[0].filtered_count, totalCount);
                }),

                /**
                 *
                 */
                orm.query(
                    'SELECT ' +
                    'COUNT(*) AS `filtered_count` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'WHERE ' +
                    '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW(), \'%Y-%m-01\')) ' +
                    'OR ' +
                    '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\'))) ' +
                    'AND ' +
                    column + ' = ? ' +
                    'AND ' +
                    'DATEDIFF(NOW(), IFNULL (`tbu`.`trendata_bigdata_user_rehire_date`, `tbu`.`trendata_bigdata_user_position_hire_date`)) BETWEEN (365 * 2 + 1) AND (365 * 5) ' +
                    'AND ' +
                    filterSql.query +
                    ' AND ' +
                    accessLevelSql.query,
                    {
                        type: ORM.QueryTypes.SELECT,
                        replacements: [
                            item
                        ].concat(filterSql.replacements).concat(accessLevelSql.replacements)
                    }
                ).then(function(result) {
                    return verticalAxisTypeConverter.convert(result[0].filtered_count, totalCount);
                }),

                /**
                 *
                 */
                orm.query(
                    'SELECT ' +
                    'COUNT(*) AS `filtered_count` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'WHERE ' +
                    '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW(), \'%Y-%m-01\')) ' +
                    'OR ' +
                    '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\'))) ' +
                    'AND ' +
                    column + ' = ? ' +
                    'AND ' +
                    'DATEDIFF(NOW(), IFNULL (`tbu`.`trendata_bigdata_user_rehire_date`, `tbu`.`trendata_bigdata_user_position_hire_date`)) BETWEEN (365 * 5 + 1) AND 3650 ' +
                    'AND ' +
                    filterSql.query +
                    ' AND ' +
                    accessLevelSql.query,
                    {
                        type: ORM.QueryTypes.SELECT,
                        replacements: [
                            item
                        ].concat(filterSql.replacements).concat(accessLevelSql.replacements)
                    }
                ).then(function(result) {
                    return verticalAxisTypeConverter.convert(result[0].filtered_count, totalCount);
                }),

                /**
                 *
                 */
                orm.query(
                    'SELECT ' +
                    'COUNT(*) AS `filtered_count` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'WHERE ' +
                    '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW(), \'%Y-%m-01\')) ' +
                    'OR ' +
                    '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\'))) ' +
                    'AND ' +
                    column + ' = ? ' +
                    'AND ' +
                    'DATEDIFF(NOW(), IFNULL (`tbu`.`trendata_bigdata_user_rehire_date`, `tbu`.`trendata_bigdata_user_position_hire_date`)) BETWEEN 3651 AND (365 * 20)' +
                    'AND ' +
                    filterSql.query +
                    ' AND ' +
                    accessLevelSql.query,
                    {
                        type: ORM.QueryTypes.SELECT,
                        replacements: [
                            item
                        ].concat(filterSql.replacements).concat(accessLevelSql.replacements)
                    }
                ).then(function(result) {
                    return verticalAxisTypeConverter.convert(result[0].filtered_count, totalCount);
                }),

                /**
                 *
                 */
                orm.query(
                    'SELECT ' +
                    'COUNT(*) AS `filtered_count` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'WHERE ' +
                    '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW(), \'%Y-%m-01\')) ' +
                    'OR ' +
                    '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\'))) ' +
                    'AND ' +
                    column + ' = ? ' +
                    'AND ' +
                    'DATEDIFF(NOW(), IFNULL (`tbu`.`trendata_bigdata_user_rehire_date`, `tbu`.`trendata_bigdata_user_position_hire_date`)) > 365 * 20 ' +
                    'AND ' +
                    filterSql.query +
                    ' AND ' +
                    accessLevelSql.query,
                    {
                        type: ORM.QueryTypes.SELECT,
                        replacements: [
                            item
                        ].concat(filterSql.replacements).concat(accessLevelSql.replacements)
                    }
                ).then(function(result) {
                    return verticalAxisTypeConverter.convert(result[0].filtered_count, totalCount);
                })
            ]).then(function(filteredValues) {
                return {
                    label: item,
                    values: filteredValues
                };
            })
        });
    }).reduce(function (accum, item) {
        accum.categories[0].category.push({
            label: item.label
        });

        for (var i = 0; i < item.values.length; ++i) {
            accum.dataset[i].data.push({
                value: item.values[i].toFixed(2)
            });
        }

        return accum;
    }, {
        categories: [
            {
                category: []
            }
        ],
        dataset: [
            {
                seriesname: '<1',
                data: []
            },
            {
                seriesname: '<2',
                data: []
            },
            {
                seriesname: '<5',
                data: []
            },
            {
                seriesname: '<10',
                data: []
            },
            {
                seriesname: '<20',
                data: []
            },
            {
                seriesname: '>20',
                data: []
            }
        ],
        numberSuffix: verticalAxisTypeConverter.suffix,
        paletteColors: '#33b297, #ee7774, #005075, #33b5e5, #73b234, #aa66cc, #b29234, #72eecf, #b23473'
    });
};

/**
 * Change filters or pagination
 * {
 *  type: 'change_filters',
 *  data: {
 *      chart_view: 'String',
 *      filters: {
 *          department: 'Array',
 *          location: 'Array',
 *          gender: 'Array'
 *      },
 *      user_pagination: 'Number'
 *  }
 * }
 */
switch (requestData.type) {
    // Pagination
    case 'change_page':
        commonChartData.getCustomFields(req).then(function(customFields) {
            return Promise.all([
                commonChartData.makeAccessLevelSql(req),
                commonChartData.makeFilterSqlByFilters(requestData.data.filters, customFields),
                commonChartData.makeUsersFilter(),
                customFields
            ]);
        }).spread(function (accessLevelSql, filterSql, usersFilter, customFields) {
            return Promise.props({
                users: commonChartData.getUsersOnPageByFilters(filterSql, accessLevelSql, requestData.data.user_pagination, selfId, usersFilter, customFields)
            });
        }).then(_resolve).catch(_reject);
        break;

    // Chart view
    case 'change_chart_view':
        commonChartData.getCustomFields(req).then(function(customFields) {
            return Promise.all([
                commonChartData.getAvailableFiltersForDrilldown(customFields),
                commonChartData.makeAccessLevelSql(req),
                commonChartData.makeFilterSqlByFilters(requestData.data.filters, customFields),
                commonChartData.verticalAxisTypeConverter(requestData.data.vertical_axis_type),
                customFields
            ]);
        }).spread(function (availableFilters, accessLevelSql, filterSql, verticalAxisTypeConverter, customFields) {
            return Promise.props({
                chart_data: new Promise(function (resolve, reject) {
                    var data = {};

                    _.reduce(customFields, function (accum, item) {
                        accum[item] = {
                            filterSql: filterSql,
                            column: '`tbu`.' + sqlstring.escapeId(item).replace(/`\.`/g, '.'),
                            title: _.chain(item.replace(/^custom\s+/gi, '')).words().map(_.capitalize).value().join(' '),
                            values: availableFilters[item],
                            accessLevelSql: accessLevelSql,
                            verticalAxisTypeConverter: verticalAxisTypeConverter
                        };
                        return accum;
                    }, data);

                    data.department = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_department`',
                        values: availableFilters.department,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.city = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_address_city`',
                        values: availableFilters.city,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.division = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_division`',
                        values: availableFilters.division,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data['cost center'] = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_cost_center`',
                        values: availableFilters['cost center'],
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.country = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_country`',
                        values: availableFilters.country,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.state = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_address_state`',
                        values: availableFilters.state,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data['job level'] = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_job_level`',
                        title: 'Job Level',
                        values: availableFilters['job level'],
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.performance = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_performance_percentage_this_year`',
                        title: 'State',
                        values: availableFilters.performance,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data['commute distance'] = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_approximate_distance_to_work`',
                        title: 'Commute Distance',
                        values: availableFilters['commute distance'],
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    resolve(data);
                }).then(function (data) {
                    var chartView = requestData.data.chart_view && requestData.data.chart_view.toLowerCase() || defaultChartView;

                    return calculateSubChartData(data[chartView] || {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_gender`',
                        values: availableFilters.gender,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    });
                })
            });
        }).then(_resolve).catch(_reject);
        break;

    // Init
    default:
        commonChartData.getCustomFields(req).then(function(customFields) {
            return Promise.all([
                commonChartData.getAvailableFiltersForDrilldown(customFields),
                commonChartData.makeAccessLevelSql(req),
                commonChartData.makeFilterSqlByFilters(requestData.data.filters, customFields),
                commonChartData.makeUsersFilter(),
                commonChartData.verticalAxisTypeConverter(requestData.data.vertical_axis_type),
                customFields
            ]);
        }).spread(function (availableFilters, accessLevelSql, filterSql, usersFilter, verticalAxisTypeConverter, customFields) {
            return Promise.props({
                /**
                 *
                 */
                chart_data: new Promise(function (resolve, reject) {
                    var data = {};

                    _.reduce(customFields, function (accum, item) {
                        accum[item] = {
                            filterSql: filterSql,
                            column: '`tbu`.' + sqlstring.escapeId(item, true),
                            title: _.chain(item.replace(/^custom\s+/gi, '')).words().map(_.capitalize).value().join(' '),
                            values: availableFilters[item],
                            accessLevelSql: accessLevelSql,
                            verticalAxisTypeConverter: verticalAxisTypeConverter
                        };
                        return accum;
                    }, data);

                    data.department = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_department`',
                        values: availableFilters.department,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.city = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_address_city`',
                        values: availableFilters.city,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.division = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_division`',
                        values: availableFilters.division,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data['cost center'] = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_cost_center`',
                        values: availableFilters['cost center'],
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.country = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_country`',
                        values: availableFilters.country,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.state = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_address_state`',
                        values: availableFilters.state,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data['job level'] = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_job_level`',
                        title: 'Job Level',
                        values: availableFilters['job level'],
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.performance = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_performance_percentage_this_year`',
                        title: 'State',
                        values: availableFilters.performance,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data['commute distance'] = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_approximate_distance_to_work`',
                        title: 'Commute Distance',
                        values: availableFilters['commute distance'],
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    resolve(data);
                }).then(function (data) {
                    var chartView = requestData.data.chart_view && requestData.data.chart_view.toLowerCase() || defaultChartView;

                    return calculateSubChartData(data[chartView] || {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_gender`',
                        values: availableFilters.gender,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    });
                }),

                /**
                 *
                 */
                users: commonChartData.getUsersOnPageByFilters(filterSql, accessLevelSql, requestData.data.user_pagination, selfId, usersFilter, customFields, req.user.trendata_user_id),

                /**
                 *
                 */
                users_count: commonChartData.getUsersCountByFilters(filterSql, accessLevelSql, usersFilter),

                /**
                 *
                 */
                available_chart_view: availableChartViews.split(',').concat(customFields),

                /**
                 *
                 */
                available_filters: availableFilters,

                /**
                 *
                 */
                available_vertical_axis_types: [
                    'Percentage (%)',
                    'Values',
                    'Dollars ($)'],

                /**
                 *
                 */
                 users_filter_data: {
                    timeSpan: undefined,
                    types: undefined
                },

                 /**
                 *
                 */
                 default_chart_view: defaultChartView
        });
    }).then(_resolve).catch(_reject);
}

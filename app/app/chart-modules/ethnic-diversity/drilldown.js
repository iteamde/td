'use strict';

/**
 *
 */
var requestData = 'POST' === req.method ? req.body : {
    type: undefined,
    data: {
        /**
         * String: 'Country', 'Gender', 'Department'
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
            country: undefined,

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

if (fromDashboard) {
    requestData = reqData;
}

requestData = _.merge({
    data: {
        chart_view: undefined,
        filters: {
            department: undefined,
            country: undefined,
            gender: undefined
        },
        user_pagination: undefined
    }
}, requestData);

/**
 * @type {Function}
 */
var sourceOfHireListByUserList = separateThread(function (users, resolve, reject) {
    Promise.reduce(users, function (accum, item) {
        if (accum.indexOf(item['hire source']) === -1) {
            accum.push(item['hire source']);
        }
        return accum;
    }, []).then(resolve).catch(reject);
});

/**
 * @type {Function}
 */
var calculateSubChartData = function(input) {
    var verticalAxisTypeConverter = input.verticalAxisTypeConverter;
    var filterSql = input.filterSql;
    var accessLevelSql = input.accessLevelSql;
    var column = input.column;
    var values = input.values;
    var title = input.title;
    var hireSources = input.hireSources;

    var initData = {
        categories: [
            {
                category: []
            }
        ],
        dataset: [],
        numberSuffix: verticalAxisTypeConverter.suffix
    };

    if (requestData.type === 'fromDashboard') {
        initData.numberPrefix = '';
    }

    _.each(hireSources, function(item) {
        initData.dataset.push({
            seriesname: item,
            data: []
        });
    });

    return Promise.map(values, function (item) {
        return orm.query(
            'SELECT ' +
            'COUNT(*) AS `filtered_count` ' +
            'FROM ' +
            '`trendata_bigdata_user` AS `tbu` ' +
            'WHERE ' +
            '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW(), \'%Y-%m-01\')) ' +
            'OR ' +
            '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\'))) ' +
            'AND ' +
            '`tbu`.`trendata_bigdata_user_ethnicity` IS NOT NULL ' +
            'AND ' +
            '`tbu`.`trendata_bigdata_user_ethnicity` != \'\' ' +
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
            var count = null === rows[0].filtered_count ? 0 : rows[0].filtered_count;
            return Promise.props({
                label: item,
                values: Promise.mapSeries(hireSources, function (source) {
                    return count > 0 ? orm.query(
                        'SELECT ' +
                        'COUNT(*) AS `source_count` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW(), \'%Y-%m-01\')) ' +
                        'OR ' +
                        '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\'))) ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_ethnicity` IS NOT NULL ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_ethnicity` != \'\' ' +
                        'AND ' +
                        column + ' = ? ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_ethnicity` = ? ' +
                        'AND ' +
                        filterSql.query +
                        ' AND ' +
                        accessLevelSql.query,
                        {
                            type: ORM.QueryTypes.SELECT,
                            replacements: [
                                item,
                                source
                            ].concat(filterSql.replacements).concat(accessLevelSql.replacements)
                        }
                    ).then(function(result) {
                        return verticalAxisTypeConverter.convert(result[0].source_count, count);
                    }) : 0;
                })
            });
        });
    }).reduce(function (accum, item) {
        if (requestData.data.hide_empty && ! _.some(item.values))
            return accum;

        accum.categories[0].category.push({
            label: item.label
        });

        _.each(item.values, function(value, index) {
            accum.dataset[index].data.push({
                value: value.toFixed(2)
            });
        });

        return accum;
    }, initData);
};


/**
 * Change filters or pagination
 * {
 *  type: 'change_filters',
 *  data: {
 *      chart_view: 'String',
 *      filters: {
 *          department: 'Array',
 *          country: 'Array',
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
                orm.query(
                    'SELECT ' +
                    '`tbu`.`trendata_bigdata_user_ethnicity` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'GROUP BY ' +
                    '`tbu`.`trendata_bigdata_user_ethnicity`',
                    {
                        type: ORM.QueryTypes.SELECT
                    }
                ).map(function(item) {
                    return item.trendata_bigdata_user_ethnicity;
                }),
                commonChartData.verticalAxisTypeConverter(requestData.data.vertical_axis_type),
                customFields
            ]);
        }).spread(function (availableFilters, accessLevelSql, filterSql, availableHireSources, verticalAxisTypeConverter, customFields) {
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
                            hireSources: availableHireSources,
                            verticalAxisTypeConverter: verticalAxisTypeConverter
                        };
                        return accum;
                    }, data);

                    data.department = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_department`',
                        title: 'Department',
                        values: availableFilters.department,
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.city = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_address_city`',
                        title: 'City',
                        values: availableFilters.city,
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.division = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_division`',
                        title: 'Division',
                        values: availableFilters.division,
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data['cost center'] = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_cost_center`',
                        title: 'Cost Center',
                        values: availableFilters['cost center'],
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.country = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_country`',
                        title: 'Job Level',
                        values: availableFilters.country,
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.state = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_address_state`',
                        title: 'State',
                        values: availableFilters.state,
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data['job level'] = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_job_level`',
                        title: 'State',
                        values: availableFilters['job level'],
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.performance = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_performance_percentage_this_year`',
                        title: 'Performance',
                        values: availableFilters.performance,
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data['commute distance'] = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_approximate_distance_to_work`',
                        title: 'Commute Distance',
                        values: availableFilters['commute distance'],
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    resolve(data);
                }).then(function (data) {
                    var chartView = requestData.data.chart_view && requestData.data.chart_view.toLowerCase() || defaultChartView;

                    return calculateSubChartData(data[chartView] || {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_gender`',
                        title: 'Gender',
                        values: availableFilters.gender,
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    });
                })
            });
        }).then(_resolve).catch(_reject);
        break;

    // For Dashboard
    case 'fromDashboard':
        commonChartData.getCustomFields(req).then(function(customFields) {
            return Promise.all([
                commonChartData.getAvailableFiltersForDrilldown(customFields),
                commonChartData.makeAccessLevelSql(req),
                commonChartData.makeFilterSqlByFilters(requestData.data.filters, customFields),
                orm.query(
                    'SELECT ' +
                    '`tbu`.`trendata_bigdata_user_ethnicity` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'GROUP BY ' +
                    '`tbu`.`trendata_bigdata_user_ethnicity`',
                    {
                        type: ORM.QueryTypes.SELECT
                    }
                ).map(function(item) {
                    return item.trendata_bigdata_user_ethnicity;
                }),
                commonChartData.verticalAxisTypeConverter(requestData.data.vertical_axis_type),
                customFields
            ]);
        }).spread(function (availableFilters, accessLevelSql, filterSql, availableHireSources, verticalAxisTypeConverter, customFields) {
            return new Promise(function (resolve, reject) {
                var data = {};

                _.reduce(customFields, function (accum, item) {
                    accum[item] = {
                        filterSql: filterSql,
                        column: '`tbu`.' + sqlstring.escapeId(item).replace(/`\.`/g, '.'),
                        title: _.chain(item.replace(/^custom\s+/gi, '')).words().map(_.capitalize).value().join(' '),
                        values: availableFilters[item],
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };
                    return accum;
                }, data);

                data.department = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_department`',
                    title: 'Department',
                    values: availableFilters.department,
                    accessLevelSql: accessLevelSql,
                    hireSources: availableHireSources,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data.city = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_address_city`',
                    title: 'City',
                    values: availableFilters.city,
                    accessLevelSql: accessLevelSql,
                    hireSources: availableHireSources,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data.division = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_division`',
                    title: 'Division',
                    values: availableFilters.division,
                    accessLevelSql: accessLevelSql,
                    hireSources: availableHireSources,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data['cost center'] = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_cost_center`',
                    title: 'Cost Center',
                    values: availableFilters['cost center'],
                    accessLevelSql: accessLevelSql,
                    hireSources: availableHireSources,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data.country = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_country`',
                    title: 'Job Level',
                    values: availableFilters.country,
                    accessLevelSql: accessLevelSql,
                    hireSources: availableHireSources,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data.state = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_address_state`',
                    title: 'State',
                    values: availableFilters.state,
                    accessLevelSql: accessLevelSql,
                    hireSources: availableHireSources,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data['job level'] = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_job_level`',
                    title: 'State',
                    values: availableFilters['job level'],
                    accessLevelSql: accessLevelSql,
                    hireSources: availableHireSources,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data.performance = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_performance_percentage_this_year`',
                    title: 'Performance',
                    values: availableFilters.performance,
                    accessLevelSql: accessLevelSql,
                    hireSources: availableHireSources,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data['commute distance'] = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_approximate_distance_to_work`',
                    title: 'Commute Distance',
                    values: availableFilters['commute distance'],
                    accessLevelSql: accessLevelSql,
                    hireSources: availableHireSources,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                resolve(data);
            }).then(function (data) {
                var chartView = requestData.data.chart_view && requestData.data.chart_view.toLowerCase();

                return calculateSubChartData(data[chartView] || {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_gender`',
                    title: 'Gender',
                    values: availableFilters.gender,
                    accessLevelSql: accessLevelSql,
                    hireSources: availableHireSources,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                });
            })
        }).then(_resolve).catch(_reject);
        break;

    // Init
    default:
        commonChartData.getCustomFields(req).then(function(customFields) {
            return Promise.all([
                commonChartData.getAvailableFiltersForDrilldown(customFields),
                commonChartData.makeAccessLevelSql(req),
                commonChartData.makeFilterSqlByFilters(requestData.data.filters, customFields),
                orm.query(
                    'SELECT ' +
                    '`tbu`.`trendata_bigdata_user_ethnicity` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'GROUP BY ' +
                    '`tbu`.`trendata_bigdata_user_ethnicity`',
                    {
                        type: ORM.QueryTypes.SELECT
                    }
                ).map(function(item) {
                    return item.trendata_bigdata_user_ethnicity;
                }),
                commonChartData.makeUsersFilter(),
                commonChartData.verticalAxisTypeConverter(requestData.data.vertical_axis_type),
                customFields
            ]);
        }).spread(function (availableFilters, accessLevelSql, filterSql, availableHireSources, usersFilter, verticalAxisTypeConverter, customFields) {
            return Promise.props({
                /**
                 *
                 */
                chart_data: new Promise(function (resolve, reject) {
                    var data = {};

                    _.reduce(customFields, function (accum, item) {
                        accum[item] = {
                            filterSql: filterSql,
                            column: '`tbu`.' + sqlstring.escapeId(item).replace(/`\.`/g, '.'),
                            title: _.chain(item.replace(/^custom\s+/gi, '')).words().map(_.capitalize).value().join(' '),
                            values: availableFilters[item],
                            accessLevelSql: accessLevelSql,
                            hireSources: availableHireSources,
                            verticalAxisTypeConverter: verticalAxisTypeConverter
                        };
                        return accum;
                    }, data);

                    data.department = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_department`',
                        title: 'Department',
                        values: availableFilters.department,
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.city = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_address_city`',
                        title: 'City',
                        values: availableFilters.city,
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.division = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_division`',
                        title: 'Division',
                        values: availableFilters.division,
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data['cost center'] = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_cost_center`',
                        title: 'Cost Center',
                        values: availableFilters['cost center'],
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.country = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_country`',
                        title: 'Job Level',
                        values: availableFilters.country,
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.state = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_address_state`',
                        title: 'State',
                        values: availableFilters.state,
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data['job level'] = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_job_level`',
                        title: 'State',
                        values: availableFilters['job level'],
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.performance = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_performance_percentage_this_year`',
                        title: 'State',
                        values: availableFilters.performance,
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data['commute distance'] = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_approximate_distance_to_work`',
                        title: 'Commute Distance',
                        values: availableFilters['commute distance'],
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    resolve(data);
                }).then(function (data) {
                    var chartView = requestData.data.chart_view && requestData.data.chart_view.toLowerCase() || defaultChartView;

                    return calculateSubChartData(data[chartView] || {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_gender`',
                        title: 'Gender',
                        values: availableFilters.gender,
                        accessLevelSql: accessLevelSql,
                        hireSources: availableHireSources,
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

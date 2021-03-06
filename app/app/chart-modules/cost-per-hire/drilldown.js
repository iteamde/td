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
 * @return {Promise}
 */
function hiringCostsValue() {
    var FinancialDataModel = ormModels.FinancialData;
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var lastYear = currentDate.getFullYear() - 1;
    var startIndex = currentDate.getMonth();
    var endIndex = 12 + currentDate.getMonth();

    return FinancialDataModel.findAll({
        where: {
            trendata_financial_data_year: [
                currentYear,
                lastYear
            ]
        },
        order: [
            ['trendata_financial_data_year', 'ASC']
        ]
    }).then(function (rows) {
        if (0 === rows.length) {
            return _.chain(24).range().fill(0).value();
        } else if (1 === rows.length && rows[0].trendata_financial_data_year == currentYear) {
            return Promise.resolve(rows[0]).then(function (item) {
                var data = _.map(JSON.parse(item.trendata_financial_data_json_data)[5].data, 'value');
                return _.chain(12).range().fill(0).value().concat(data);
            });
        } else if (1 === rows.length && rows[0].trendata_financial_data_year == lastYear) {
            return Promise.resolve(rows[0]).then(function (item) {
                var data = _.map(JSON.parse(item.trendata_financial_data_json_data)[5].data, 'value');
                return data.concat(_.chain(12).range().fill(0).value());
            });
        }

        return _.map(JSON.parse(rows[0].trendata_financial_data_json_data)[5].data, 'value')
            .concat(_.map(JSON.parse(rows[1].trendata_financial_data_json_data)[5].data, 'value'));
    }).then(function (values) {
        return _.map(values, Number).slice(startIndex, endIndex);
    }).then(function (data) {
        // Last month
        return data[11];
    });
}

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
    var hiringCost = input.hiringCost;
    var totalValue;

    return Promise.map(values, function (item) {
        return orm.query(
            'SELECT ' +
            'COUNT(*) AS `count`, ' +
            'ROUND(AVG(`tbu`.`trendata_bigdata_user_cost_per_hire`), 2) AS `average_cost_per_hire`, ' +
            'SUM(`tbu`.`trendata_bigdata_user_cost_per_hire`) AS `sum_cost_per_hire` ' +
            'FROM ' +
            '`trendata_bigdata_user` AS `tbu` ' +
            'WHERE ' +
            'DATE_FORMAT(`tbu`.`trendata_bigdata_user_position_hire_date`, \'%Y-%m\') = DATE_FORMAT(NOW() - INTERVAL 1 MONTH, \'%Y-%m\') ' +
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
            totalValue += +rows[0].average_cost_per_hire;

            return {
                label: item,
                value: (rows[0].count > 0 && ! rows[0].sum_cost_per_hire)
                    ? _.round(hiringCost / rows[0].count, 2)
                    : verticalAxisTypeConverter.convert(rows[0].average_cost_per_hire, rows[0].sum_cost_per_hire)
            };
        });
    }).reduce(function (accum, item) {
        accum.categories[0].category.push({
            label: item.label
        });
        accum.dataset[0].data.push({
            value: verticalAxisTypeConverter.convert(item.average_cost_per_hire, totalValue)
        });
        return accum;
    }, {
        categories: [
            {
                category: []
            }
        ],
        dataset: [
            {
                seriesname: title,
                data: []
            }
        ],
        numberSuffix: verticalAxisTypeConverter.suffix,
        paletteColors: '#0075c2'
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
                hiringCostsValue(),
                customFields
            ]);
        }).spread(function (availableFilters, accessLevelSql, filterSql, verticalAxisTypeConverter, hiringCost, customFields) {
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
                        title: 'Department',
                        values: availableFilters.department,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter,
                        hiringCost: hiringCost
                    };

                    data.city = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_address_city`',
                        title: 'City',
                        values: availableFilters.city,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter,
                        hiringCost: hiringCost
                    };

                    data.division = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_division`',
                        title: 'Division',
                        values: availableFilters.division,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter,
                        hiringCost: hiringCost
                    };

                    data['cost center'] = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_cost_center`',
                        title: 'Cost Center',
                        values: availableFilters['cost center'],
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter,
                        hiringCost: hiringCost
                    };

                    data.country = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_country`',
                        title: 'Country',
                        values: availableFilters.country,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter,
                        hiringCost: hiringCost
                    };

                    data.state = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_address_state`',
                        title: 'State',
                        values: availableFilters.state,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter,
                        hiringCost: hiringCost
                    };

                    data['job level'] = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_job_level`',
                        title: 'Job Level',
                        values: availableFilters['job level'],
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter,
                        hiringCost: hiringCost
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
                        title: 'Gender',
                        values: availableFilters.gender,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter,
                        hiringCost: hiringCost
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
                commonChartData.makeUsersFilter(null, ['hired']),
                commonChartData.verticalAxisTypeConverter(requestData.data.vertical_axis_type),
                hiringCostsValue(),
                customFields
            ]);
        }).spread(function (availableFilters, accessLevelSql, filterSql, usersFilter, verticalAxisTypeConverter, hiringCost, customFields) {
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
                        verticalAxisTypeConverter: verticalAxisTypeConverter,
                        hiringCost: hiringCost
                    };

                    data.city = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_address_city`',
                        title: 'City',
                        values: availableFilters.city,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter,
                        hiringCost: hiringCost
                    };

                    data.division = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_division`',
                        title: 'Division',
                        values: availableFilters.division,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter,
                        hiringCost: hiringCost
                    };

                    data['cost center'] = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_cost_center`',
                        title: 'Cost Center',
                        values: availableFilters['cost center'],
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter,
                        hiringCost: hiringCost
                    };

                    data.country = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_country`',
                        title: 'Country',
                        values: availableFilters.country,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter,
                        hiringCost: hiringCost
                    };

                    data.state = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_address_state`',
                        title: 'State',
                        values: availableFilters.state,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter,
                        hiringCost: hiringCost
                    };

                    data['job level'] = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_job_level`',
                        title: 'Job Level',
                        values: availableFilters['job level'],
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter,
                        hiringCost: hiringCost
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
                        title: 'Gender',
                        values: availableFilters.gender,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter,
                        hiringCost: hiringCost
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
                    types: ['hired']
                },

                 /**
                 *
                 */
                 default_chart_view: defaultChartView
        });
    }).then(_resolve).catch(_reject);
}

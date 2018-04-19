'use strict';

/**
 * @type {number}
 */
var usersPerPage = 10;

/**
 *
 */
var requestData = 'POST' === req.method ? req.body : {
    /**
     * @type {String}
     */
    type: undefined,

    /**
     * @type {Object}
     */
    data: {
        /**
         * @type {String} - 'Location', 'Gender', 'Department'
         */
        chart_view: undefined,

        /**
         *
         */
        filters: {
            /**
             * @type {String[]}
             */
            department: undefined,

            /**
             * @type {String[]}
             */
            location: undefined,

            /**
             * @type {String[]}
             */
            gender: undefined
        },

        /**
         * @type {Integer} - page number
         */
        user_pagination: {},

        /**
         * @type {Boolean}
         */
        regression_analysis: undefined,

        /**
         * @type {Boolean}
         */
        summary: true
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
        user_pagination: undefined,
        regression_analysis: undefined,
        summary: undefined
    }
}, requestData);

var timeSpan = requestData.data.time_span || {
    start: 12,
    end: null
};
if (! timeSpan.end)
    timeSpan.end = 1;

var userTypes = ['active', 'terminated'];

/**
 * @param chartView
 * @param filterSql
 * @param accessLevelSql
 * @param verticalAxisTypeConverter
 */
function analyticsByCustomFields(chartView, filterSql, accessLevelSql, verticalAxisTypeConverter) {
    return orm.query(
        'SELECT ' +
        '`tbu`.' + sqlstring.escapeId(chartView, true) + ' AS `value` ' +
        'FROM ' +
        '`trendata_bigdata_user` AS `tbu` ' +
        'GROUP BY ' +
        '`tbu`.' + sqlstring.escapeId(chartView, true),
        {
            type: ORM.QueryTypes.SELECT
        }
    ).map(function (item) {
        return item.value;
    }).reduce(function (accum, customValue) {
        return totalChartView(filterSql, accessLevelSql, verticalAxisTypeConverter, chartView, customValue).then(function (data) {
            var dataset = _.chain(data).get('dataset[0]').merge({seriesname: customValue}).value();

            if (accum) {
                accum.dataset.push(dataset);
                return accum;
            }

            data.paletteColors = '#33b297, #ee7774, #005075, #33b5e5, #73b234, #aa66cc, #b29234, #72eecf, #b23473';

            return _.chain(data).merge({dataset: [dataset]}).value();
        });
    }, null);
}

/**
 * @param filterSql
 * @param accessLevelSql
 * @param verticalAxisTypeConverter
 * @param customField
 * @param customValue
 */
function totalChartView(filterSql, accessLevelSql, verticalAxisTypeConverter, customField, customValue) {
    var range = [];
    timeSpan.start = parseInt(timeSpan.start, 10) || 0;
    timeSpan.end = parseInt(timeSpan.end, 10) || 0;

    if (timeSpan.start - timeSpan.end >= 12) {
        for (var i = timeSpan.start; i > timeSpan.end + +moment().subtract(timeSpan.end, 'month').format('M'); i -= 12)
            range.push(i);

        range.push(timeSpan.end);
    } else {
        range =_.rangeRight(timeSpan.end, timeSpan.start + 1);
    }

    return Promise.resolve(range).map(function (item, index) {
        if (timeSpan.start - timeSpan.end >= 12) {
            var startDate = index > 0 ?'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-01-01\') ': 'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ';
            var endDate = index < range.length -1 ?'LAST_DAY(DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-12-01\')) ': 'LAST_DAY(DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\')) ';
            var dateFormat = 'YYYY';
        } else {
            var startDate = 'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ';
            var endDate = 'LAST_DAY(NOW() + INTERVAL ? MONTH) ';
            var dateFormat = 'MMMM';
        }

        return Promise.props({
            /**
             *
             */
            term: (function () {
                var query = 'SELECT ' +
                    'COUNT(*) AS `count`, ' +
                    startDate + ' AS `month` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'WHERE ' +
                    '`tbu`.`trendata_bigdata_user_position_termination_date` >= ' + startDate +
                    'AND ' +
                    '`tbu`.`trendata_bigdata_user_position_termination_date` <= ' + endDate +
                    ' AND ' +
                    filterSql.query +
                    ' AND ' +
                    accessLevelSql.query;

                var replacements = [
                    -item,
                    -item,
                    -item
                ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                if (customField) {
                    query += ' AND `tbu`.' + sqlstring.escapeId(customField, true) + ' = ?';
                    replacements.push(customValue);
                }

                return orm.query(query, {
                    type: ORM.QueryTypes.SELECT,
                    replacements: replacements
                }).then(function (rows) {
                    return {
                        month_name: moment(rows[0].month).format(dateFormat),
                        count: rows[0].count
                    };
                });
            })(),

            /**
             *
             */
            activeOnStart: (function () {
                var query = 'SELECT ' +
                    'COUNT(*) AS `count`, ' +
                    startDate + ' AS `month` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'WHERE ' +
                    '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL ' +
                    'AND ' +
                    '`tbu`.`trendata_bigdata_user_position_hire_date` < ' + startDate +
                    'AND ' +
                    '`tbu`.`trendata_bigdata_user_position_termination_date` >= ' + startDate + ') ' +
                    'OR ' +
                    '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL ' +
                    'AND ' +
                    '`tbu`.`trendata_bigdata_user_position_hire_date` <= ' + startDate + ')) ' +
                    ' AND ' +
                    filterSql.query +
                    ' AND ' +
                    accessLevelSql.query;

                var replacements = [
                    -item,
                    -item,
                    -item,
                    -item
                ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                if (customField) {
                    query += ' AND `tbu`.' + sqlstring.escapeId(customField, true) + ' = ?';
                    replacements.push(customValue);
                }

                return orm.query(query, {
                    type: ORM.QueryTypes.SELECT,
                    replacements: replacements
                }).then(function (rows) {
                    return {
                        month_name: moment(rows[0].month).format(dateFormat),
                        count: rows[0].count
                    };
                });
            })(),

            /**
             *
             */
            activeOnEnd: (function () {
                var query = 'SELECT ' +
                    'COUNT(*) AS `count`, ' +
                    startDate + ' AS `month` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'WHERE ' +
                    '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL ' +
                    'AND ' +
                    '`tbu`.`trendata_bigdata_user_position_hire_date` < ' + endDate +
                    'AND ' +
                    '`tbu`.`trendata_bigdata_user_position_termination_date` >= ' + endDate + ') ' +
                    'OR ' +
                    '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL ' +
                    'AND ' +
                    '`tbu`.`trendata_bigdata_user_position_hire_date` <= ' + endDate + ')) ' +
                    ' AND ' +
                    filterSql.query +
                    ' AND ' +
                    accessLevelSql.query;

                var replacements = [
                    -item,
                    -item,
                    -item,
                    -item
                ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                if (customField) {
                    query += ' AND `tbu`.' + sqlstring.escapeId(customField, true) + ' = ?';
                    replacements.push(customValue);
                }

                return orm.query(query, {
                    type: ORM.QueryTypes.SELECT,
                    replacements: replacements
                }).then(function (rows) {
                    return {
                        month_name: moment(rows[0].month).format(dateFormat),
                        count: rows[0].count
                    };
                });
            })()
        }).then(function (data) {
            return {
                month_name: data.activeOnStart.month_name,
                value: verticalAxisTypeConverter.convert(data.term.count, data.term.count + (data.activeOnStart.count + data.activeOnEnd.count) / 2)
            };
        });
    }).reduce(function (accum, item) {
        accum.categories[0].category.push({
            label: item.month_name
        });
        accum.dataset[0].data.push({
            value: item.value
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
                seriesname: 'Total',
                data: []
            }
        ],
        numberSuffix: verticalAxisTypeConverter.suffix,
        paletteColors: '#0075c2'
    });
}

/**
 * @param filterSql
 * @param accessLevelSql
 * @param timeSpan
 * @param verticalAxisTypeConverter
 */
function byPerformanceChartView(filterSql, accessLevelSql, verticalAxisTypeConverter) {
    var range = [];
    timeSpan.start = parseInt(timeSpan.start, 10) || 0;
    timeSpan.end = parseInt(timeSpan.end, 10) || 0;

    if (timeSpan.start - timeSpan.end >= 12) {
        for (var i = timeSpan.start; i > timeSpan.end + +moment().subtract(timeSpan.end, 'month').format('M'); i -= 12)
            range.push(i);

        range.push(timeSpan.end);
    } else {
        range =_.rangeRight(timeSpan.end, timeSpan.start + 1);
    }

    return Promise.props({
        /**
         * High Performers
         */
        hp: Promise.resolve(range).map(function (item, index) {
            var yearDiff = moment().format('Y') - moment().subtract(item, 'month').format('Y');
            if (timeSpan.start - timeSpan.end >= 12) {
                var startDate = index > 0 ?'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-01-01\') ': 'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ';
                var endDate = index < range.length -1 ?'LAST_DAY(DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-12-01\')) ': 'LAST_DAY(DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\')) ';
                var dateFormat = 'YYYY';
            } else {
                var startDate = 'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ';
                var endDate = 'LAST_DAY(NOW() + INTERVAL ? MONTH) ';
                var dateFormat = 'MMMM';
            }

            switch (yearDiff) {
                case 4:
                    var performanceColumn = 'trendata_bigdata_user_performance_percentage_4_year_ago';
                    break;
                case 3:
                    var performanceColumn = 'trendata_bigdata_user_performance_percentage_3_year_ago';
                    break;
                case 2:
                    var performanceColumn = 'trendata_bigdata_user_performance_percentage_2_year_ago';
                    break;
                case 1:
                    var performanceColumn = 'trendata_bigdata_user_performance_percentage_1_year_ago';
                    break;
                case 0:
                default:
                    var performanceColumn = 'trendata_bigdata_user_performance_percentage_this_year';
            }

            return Promise.props({
                /**
                 *
                 */
                term: (function () {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        startDate + ' AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '`tbu`.`trendata_bigdata_user_position_termination_date` >= ' + startDate +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_termination_date` <= ' + endDate +
                        ' AND ' +
                        '`tbu`.`' + performanceColumn + '` >= 4 ' +
                        ' AND ' +
                        filterSql.query +
                        ' AND ' +
                        accessLevelSql.query;

                    var replacements = [
                        -item,
                        -item,
                        -item
                    ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                    return orm.query(query, {
                        type: ORM.QueryTypes.SELECT,
                        replacements: replacements
                    }).then(function (rows) {
                        return {
                            month_name: moment(rows[0].month).format(dateFormat),
                            count: rows[0].count
                        };
                    });
                })(),

                /**
                 *
                 */
                activeOnStart: (function () {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_hire_date` < ' + startDate +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_termination_date` >= ' + startDate + ') ' +
                        'OR ' +
                        '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_hire_date` <= ' + startDate + ')) ' +
                        'AND ' +
                        '`tbu`.`' + performanceColumn + '` >= 4 ' +
                        ' AND ' +
                        filterSql.query +
                        ' AND ' +
                        accessLevelSql.query;

                    var replacements = [
                        -item,
                        -item,
                        -item,
                        -item
                    ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                    return orm.query(query, {
                        type: ORM.QueryTypes.SELECT,
                        replacements: replacements
                    }).then(function (rows) {
                        return {
                            month_name: moment(rows[0].month).format(dateFormat),
                            count: rows[0].count
                        };
                    });
                })(),

                /**
                 *
                 */
                activeOnEnd: (function () {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_hire_date` < ' + endDate +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_termination_date` >= ' + endDate + ') ' +
                        'OR ' +
                        '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_hire_date` <= ' + endDate + ')) ' +
                        'AND ' +
                        '`tbu`.`' + performanceColumn + '` >= 4 ' +
                        ' AND ' +
                        filterSql.query +
                        ' AND ' +
                        accessLevelSql.query;

                    var replacements = [
                        -item,
                        -item,
                        -item,
                        -item
                    ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                    return orm.query(query, {
                        type: ORM.QueryTypes.SELECT,
                        replacements: replacements
                    }).then(function (rows) {
                        return {
                            month_name: moment(rows[0].month).format(dateFormat),
                            count: rows[0].count
                        };
                    });
                })()
            }).then(function (data) {
                return {
                    month_name: data.activeOnStart.month_name,
                    value: verticalAxisTypeConverter.convert(data.term.count, data.term.count + (data.activeOnStart.count + data.activeOnEnd.count) / 2)
                };
            });
        }),

        /**
         * Non-High Performers
         */
        nhp: Promise.resolve(range).map(function (item, index) {
            var yearDiff = moment().format('Y') - moment().subtract(item, 'month').format('Y');
            if (timeSpan.start - timeSpan.end >= 12) {
                var startDate = index > 0 ?'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-01-01\') ': 'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ';
                var endDate = index < range.length -1 ?'LAST_DAY(DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-12-01\')) ': 'LAST_DAY(DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\')) ';
                var dateFormat = 'YYYY';
            } else {
                var startDate = 'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ';
                var endDate = 'LAST_DAY(NOW() + INTERVAL ? MONTH) ';
                var dateFormat = 'MMMM';
            }

            switch (yearDiff) {
                case 4:
                    var performanceColumn = 'trendata_bigdata_user_performance_percentage_4_year_ago';
                    break;
                case 3:
                    var performanceColumn = 'trendata_bigdata_user_performance_percentage_3_year_ago';
                    break;
                case 2:
                    var performanceColumn = 'trendata_bigdata_user_performance_percentage_2_year_ago';
                    break;
                case 1:
                    var performanceColumn = 'trendata_bigdata_user_performance_percentage_1_year_ago';
                    break;
                case 0:
                default:
                    var performanceColumn = 'trendata_bigdata_user_performance_percentage_this_year';
            }

            return Promise.props({
                /**
                 *
                 */
                term: (function () {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        startDate + ' AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '`tbu`.`trendata_bigdata_user_position_termination_date` >= ' + startDate +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_termination_date` <= ' + endDate +
                        ' AND ' +
                        '(`tbu`.`' + performanceColumn + '` < 4 OR `tbu`.`' + performanceColumn + '` IS NULL) ' +
                        ' AND ' +
                        filterSql.query +
                        ' AND ' +
                        accessLevelSql.query;

                    var replacements = [
                        -item,
                        -item,
                        -item
                    ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                    return orm.query(query, {
                        type: ORM.QueryTypes.SELECT,
                        replacements: replacements
                    }).then(function (rows) {
                        return {
                            month_name: moment(rows[0].month).format(dateFormat),
                            count: rows[0].count
                        };
                    });
                })(),

                /**
                 *
                 */
                activeOnStart: (function () {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_hire_date` < ' + startDate +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_termination_date` >= ' + startDate + ') ' +
                        'OR ' +
                        '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_hire_date` <= ' + startDate + ')) ' +
                        'AND ' +
                        '(`tbu`.`' + performanceColumn + '` < 4 OR `tbu`.`' + performanceColumn + '` IS NULL) ' +
                        ' AND ' +
                        filterSql.query +
                        ' AND ' +
                        accessLevelSql.query;

                    var replacements = [
                        -item,
                        -item,
                        -item,
                        -item
                    ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                    return orm.query(query, {
                        type: ORM.QueryTypes.SELECT,
                        replacements: replacements
                    }).then(function (rows) {
                        return {
                            month_name: moment(rows[0].month).format(dateFormat),
                            count: rows[0].count
                        };
                    });
                })(),

                /**
                 *
                 */
                activeOnEnd: (function () {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_hire_date` < ' + endDate +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_termination_date` >= ' + endDate + ') ' +
                        'OR ' +
                        '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_hire_date` <= ' + endDate + ')) ' +
                        'AND ' +
                        '(`tbu`.`' + performanceColumn + '` < 4 OR `tbu`.`' + performanceColumn + '` IS NULL) ' +
                        ' AND ' +
                        filterSql.query +
                        ' AND ' +
                        accessLevelSql.query;

                    var replacements = [
                        -item,
                        -item,
                        -item,
                        -item
                    ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                    return orm.query(query, {
                        type: ORM.QueryTypes.SELECT,
                        replacements: replacements
                    }).then(function (rows) {
                        return {
                            month_name: moment(rows[0].month).format(dateFormat),
                            count: rows[0].count
                        };
                    });
                })()
            }).then(function (data) {
                return {
                    month_name: data.activeOnStart.month_name,
                    value: verticalAxisTypeConverter.convert(data.term.count, data.term.count + (data.activeOnStart.count + data.activeOnEnd.count) / 2)
                };
            });
        })
    }).then(function (data) {
        return Promise.reduce(data.hp, function (accum, item, index) {
            accum.categories[0].category.push({
                label: item.month_name
            });
            accum.dataset[0].data.push({
                value: item.value
            });
            accum.dataset[1].data.push({
                value: data.nhp[index].value
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
                    seriesname: 'High Performers',
                    data: []
                },
                {
                    seriesname: 'Non-High Performers',
                    data: []
                }
            ],
            numberSuffix: verticalAxisTypeConverter.suffix,
            paletteColors: null
        });
    });
}

/**
 * @param filterSql
 * @param accessLevelSql
 * @param verticalAxisTypeConverter
 * @return {Promise.<TResult>}
 */
function customChartView(filterSql, accessLevelSql, verticalAxisTypeConverter, customFields) {
    return commonChartData.getAvailableFiltersForDrilldown(customFields).then(function (availableFilters) {
        return Promise.resolve({}).then(function (data) {
            data.gender = {
                filters: requestData.data.filters,
                column: '`tbu`.`trendata_bigdata_user_gender`',
                title: 'Gender',
                values: availableFilters.gender
            };

            data.city = {
                filters: requestData.data.filters,
                column: '`tbu`.`trendata_bigdata_user_address_city`',
                title: 'City',
                values: availableFilters.city
            };

            data.department = {
                filters: requestData.data.filters,
                column: '`tbu`.`trendata_bigdata_user_department`',
                title: 'Department',
                values: availableFilters.department
            };

            data.division = {
                filters: requestData.data.filters,
                column: '`tbu`.`trendata_bigdata_user_division`',
                title: 'Division',
                values: availableFilters.division
            };

            data['cost center'] = {
                filters: requestData.data.filters,
                column: '`tbu`.`trendata_bigdata_user_cost_center`',
                title: 'Cost Center',
                values: availableFilters['cost center']
            };

            data.country = {
                filters: requestData.data.filters,
                column: '`tbu`.`trendata_bigdata_user_country`',
                title: 'Country',
                values: availableFilters.country
            };

            data.state = {
                filters: requestData.data.filters,
                column: '`tbu`.`trendata_bigdata_user_address_state`',
                title: 'State',
                values: availableFilters.state
            };

            data['job level'] = {
                filters: requestData.data.filters,
                column: '`tbu`.`trendata_bigdata_user_job_level`',
                title: 'Job Level',
                values: availableFilters['job level']
            };

            data['commute distance'] = {
                filters: requestData.data.filters,
                column: '`tbu`.`trendata_bigdata_user_approximate_distance_to_work`',
                title: 'Commute Distance',
                values: availableFilters['commute distance']
            };

            return data;
        }).then(function (data) {
            var chartView = requestData.data.chart_view && requestData.data.chart_view.toLowerCase() || defaultChartView;
            var range = [];
            timeSpan.start = parseInt(timeSpan.start, 10) || 0;
            timeSpan.end = parseInt(timeSpan.end, 10) || 0;

            if (timeSpan.start - timeSpan.end >= 12) {
                for (var i = timeSpan.start; i > timeSpan.end + +moment().subtract(timeSpan.end, 'month').format('M'); i -= 12)
                    range.push(i);

                range.push(timeSpan.end);
            } else {
                range =_.rangeRight(timeSpan.end, timeSpan.start + 1);
            }
            var initObject = {
                categories: [
                    {
                        category: []
                    }
                ],
                dataset: [],
                numberSuffix: verticalAxisTypeConverter.suffix,
                paletteColors: '#33b297, #ee7774, #005075, #33b5e5, #73b234, #aa66cc, #b29234, #72eecf, #b23473'
            };

            _.each(data[chartView].values, function(item) {
                initObject.dataset.push({
                    seriesname: item,
                    data: []
                });
            });

            return Promise.resolve(range).map(function (item, index) {
                if (timeSpan.start - timeSpan.end >= 12) {
                    var startDate = index > 0 ?'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-01-01\') ': 'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ';
                    var endDate = index < range.length -1 ?'LAST_DAY(DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-12-01\')) ': 'LAST_DAY(DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\')) ';
                    var dateFormat = 'YYYY';
                } else {
                    var startDate = 'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ';
                    var endDate = 'LAST_DAY(NOW() + INTERVAL ? MONTH) ';
                    var dateFormat = 'MMMM';
                }

                return Promise.map(data[chartView].values, function(filterValue) {
                    return Promise.props({
                        /**
                         *
                         */
                        term: (function () {
                            var query = 'SELECT ' +
                                'COUNT(*) AS `count`, ' +
                                startDate + ' AS `month` ' +
                                'FROM ' +
                                '`trendata_bigdata_user` AS `tbu` ' +
                                'WHERE ' +
                                '`tbu`.`trendata_bigdata_user_position_termination_date` >= ' + startDate +
                                'AND ' +
                                '`tbu`.`trendata_bigdata_user_position_termination_date` <= ' + endDate +
                                'AND ' +
                                data[chartView].column + ' = ? ' +
                                'AND ' +
                                filterSql.query +
                                ' AND ' +
                                accessLevelSql.query;

                            var replacements = [
                                -item,
                                -item,
                                -item,
                                filterValue
                            ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                            return orm.query(query, {
                                type: ORM.QueryTypes.SELECT,
                                replacements: replacements
                            }).then(function (rows) {
                                return {
                                    month_name: moment(rows[0].month).format(dateFormat),
                                    count: rows[0].count
                                };
                            });
                        })(),

                        /**
                         *
                         */
                        activeOnStart: (function () {
                            var query = 'SELECT ' +
                                'COUNT(*) AS `count`, ' +
                                startDate + ' AS `month` ' +
                                'FROM ' +
                                '`trendata_bigdata_user` AS `tbu` ' +
                                'WHERE ' +
                                '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL ' +
                                'AND ' +
                                '`tbu`.`trendata_bigdata_user_position_hire_date` < ' + startDate +
                                'AND ' +
                                '`tbu`.`trendata_bigdata_user_position_termination_date` >= ' + startDate + ') ' +
                                'OR ' +
                                '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL ' +
                                'AND ' +
                                '`tbu`.`trendata_bigdata_user_position_hire_date` <= ' + startDate + ')) ' +
                                'AND ' +
                                data[chartView].column + ' = ? ' +
                                'AND ' +
                                filterSql.query +
                                ' AND ' +
                                accessLevelSql.query;

                            var replacements = [
                                -item,
                                -item,
                                -item,
                                -item,
                                filterValue
                            ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                            return orm.query(query, {
                                type: ORM.QueryTypes.SELECT,
                                replacements: replacements
                            }).then(function (rows) {
                                return {
                                    month_name: moment(rows[0].month).format(dateFormat),
                                    count: rows[0].count
                                };
                            });
                        })(),

                        /**
                         *
                         */
                        activeOnEnd: (function () {
                            var query = 'SELECT ' +
                                'COUNT(*) AS `count`, ' +
                                startDate + ' AS `month` ' +
                                'FROM ' +
                                '`trendata_bigdata_user` AS `tbu` ' +
                                'WHERE ' +
                                '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL ' +
                                'AND ' +
                                '`tbu`.`trendata_bigdata_user_position_hire_date` < ' + endDate +
                                'AND ' +
                                '`tbu`.`trendata_bigdata_user_position_termination_date` >= ' + endDate + ') ' +
                                'OR ' +
                                '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL ' +
                                'AND ' +
                                '`tbu`.`trendata_bigdata_user_position_hire_date` <= ' + endDate + ')) ' +
                                'AND ' +
                                data[chartView].column + ' = ? ' +
                                'AND ' +
                                filterSql.query +
                                ' AND ' +
                                accessLevelSql.query;

                            var replacements = [
                                -item,
                                -item,
                                -item,
                                -item,
                                filterValue
                            ].concat(filterSql.replacements).concat(accessLevelSql.replacements);

                            return orm.query(query, {
                                type: ORM.QueryTypes.SELECT,
                                replacements: replacements
                            }).then(function (rows) {
                                return {
                                    month_name: moment(rows[0].month).format(dateFormat),
                                    count: rows[0].count
                                };
                            });
                        })()
                    }).then(function (data) {
                        return {
                            month_name: data.activeOnStart.month_name,
                            value: verticalAxisTypeConverter.convert(data.term.count, data.term.count + (data.activeOnStart.count + data.activeOnEnd.count) / 2)
                        };
                    });
                });
            }).reduce(function (accum, item, index) {
                accum.categories[0].category.push({
                    label: item[0].month_name
                });
                _.each(item, function(value, subIndex) {
                    accum.dataset[subIndex].data.push({
                        value: value.value
                    });
                });

                return accum;
            }, initObject);
        })
    });
}

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
 *      user_pagination: 'Number',
 *      regression_analysis: 'Boolean',
 *      summary: 'Boolean'
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
                commonChartData.makeUsersFilter(timeSpan, userTypes),
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
                commonChartData.makeAccessLevelSql(req),
                commonChartData.makeFilterSqlByFilters(requestData.data.filters, customFields),
                commonChartData.verticalAxisTypeConverter(requestData.data.vertical_axis_type),
                customFields
            ]);
        }).spread(function (accessLevelSql, filterSql, verticalAxisTypeConverter, customFields) {
            return Promise.props({
                chart_data: (function () {
                    var chartView = requestData.data.chart_view && requestData.data.chart_view.toLowerCase() || defaultChartView;

                    if (customFields.indexOf(chartView) !== -1) {
                        return analyticsByCustomFields(chartView, filterSql, accessLevelSql, verticalAxisTypeConverter);
                    }

                    switch (chartView) {
                        case 'performance':
                            return byPerformanceChartView(filterSql, accessLevelSql, verticalAxisTypeConverter);
                        case 'total':
                            return totalChartView(filterSql, accessLevelSql, verticalAxisTypeConverter);
                        default:
                            return customChartView(filterSql, accessLevelSql, verticalAxisTypeConverter, customFields);
                    }
                })().then(function (data) {
                    if (requestData.data.regression_analysis) {
                        return Promise.map(data.dataset[0].data, function (_item, _index) {
                            return Promise.reduce(data.dataset, function (accum, item, index) {
                                return accum + (data.dataset[index].data[_index].value || 0);
                            }, 0).then(function (sum) {
                                return sum / data.dataset.length;
                            });
                        }).then(function (values) {
                            return commonChartData.getTrendlineCurvePython(values);
                        }).map(function (item) {
                            return {
                                color: '#008ee4',
                                dashed: '0',
                                value: _.round(item, 2)
                            };
                        }).then(function (values) {
                            data.dataset.push({
                                data: values,
                                id: 'trendline',
                                renderAs: 'line',
                                showValues: '0'
                            });
                            return data;
                        });
                    }

                    return data;
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
                commonChartData.makeUsersFilter(timeSpan, ['active', 'terminated']),
                commonChartData.verticalAxisTypeConverter(requestData.data.vertical_axis_type),
                customFields
            ]);
        }).spread(function (availableFilters, accessLevelSql, filterSql, usersFilter, verticalAxisTypeConverter, customFields) {
            return Promise.props({
                /**
                 *
                 */
                chart_data: (function () {
                    var chartView = requestData.data.chart_view && requestData.data.chart_view.toLowerCase() || defaultChartView;

                    if (customFields.indexOf(chartView) !== -1) {
                        return analyticsByCustomFields(chartView, filterSql, accessLevelSql, verticalAxisTypeConverter);
                    }

                    switch (chartView) {
                        case 'performance':
                            return byPerformanceChartView(filterSql, accessLevelSql, verticalAxisTypeConverter);
                        case 'total':
                            return totalChartView(filterSql, accessLevelSql, verticalAxisTypeConverter);
                        default:
                            return customChartView(filterSql, accessLevelSql, verticalAxisTypeConverter, customFields);
                    }
                })().then(function (data) {
                    if (requestData.data.regression_analysis) {
                        return Promise.map(data.dataset[0].data, function (_item, _index) {
                            return Promise.reduce(data.dataset, function (accum, item, index) {
                                return accum + (data.dataset[index].data[_index].value || 0);
                            }, 0).then(function (sum) {
                                return sum / data.dataset.length;
                            });
                        }).then(function (values) {
                            return commonChartData.getTrendlineCurvePython(values);
                        }).map(function (item) {
                            return {
                                color: '#008ee4',
                                dashed: '0',
                                value: _.round(item, 2)
                            };
                        }).then(function (values) {
                            data.dataset.push({
                                data: values,
                                id: 'trendline',
                                renderAs: 'line',
                                showValues: '0'
                            });
                            return data;
                        });
                    }

                    return data;
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
                available_time_spans: ['1', '3', '5'],

                /**
                 *
                 */
                available_filters: availableFilters,

                /**
                 *
                 */
                available_vertical_axis_types: [
                    'Percentage (%)','Values',
                    'Dollars ($)'
                ],

                /**
                 *
                 */
                summary: commonChartData.getAnalyticsSummary(req, filterSql, accessLevelSql),

                /**
                 *
                 */
                 users_filter_data: {
                    timeSpan: timeSpan,
                    types: userTypes
                 },

                 /**
                 *
                 */
                 default_chart_view: defaultChartView
        });
    }).then(_resolve).catch(_reject);
}

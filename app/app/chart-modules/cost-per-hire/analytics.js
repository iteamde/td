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
        user_pagination: undefined,

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

if (fromDashboard) {
    requestData = reqData;
}

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

var userTypes = ['hired'];

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

            data.paletteColors = colors.getAll();

            return _.chain(data).merge({dataset: [dataset]}).value();
        });
    }, null);
}

/**
 * @return {Promise}
 */
function getHiringCostsValue() {
    var FinancialDataModel = ormModels.FinancialData;
    var currentMonth = moment().format('M');
    var currentYear = +moment().format('Y');
    var firstYear = +moment().subtract(timeSpan.start, 'month').format('Y');

    return FinancialDataModel.findAll({
        where: {
            trendata_financial_data_year: {
                $between: [firstYear, currentYear]
            }
        }
    }).then(function(data) {
        var result = [];

        for (var i = firstYear; i <= currentYear; i++) {
            var item;
            if (item = _.find(data, {trendata_financial_data_year: i})) {
                var fromJson = JSON.parse(item.trendata_financial_data_json_data);
                var hiringCosts = _.find(fromJson, {title: 'Hiring Costs'}).data;
                _.each(hiringCosts, function(monthHiringCosts) {
                    result.push(+monthHiringCosts.value);
                });
            } else {
                result = _.concat(result, _.range(0, 12, 0));
            }
        }

        return Promise.resolve(_.slice(result, currentMonth - 1, currentMonth - 13));
    });
}

/* ********************************************* Total chart view *************************************************** */

/**
 * @param filterSql
 * @param accessLevelSql
 * @param verticalAxisTypeConverter
 * @param customField
 * @param customValue
 */
function totalChartViewByUserColumn(filterSql, accessLevelSql, verticalAxisTypeConverter, customField, customValue) {
    return Promise.resolve(_.rangeRight(parseInt(timeSpan.end, 10) || 0, (parseInt(timeSpan.start, 10) || 0) + 1)).map(function (item) {
        return Promise.resolve().then(function () {
            var query = 'SELECT ' +
                'AVG(`tbu`.`trendata_bigdata_user_cost_per_hire`) AS `avg`, ' +
                'SUM(`tbu`.`trendata_bigdata_user_cost_per_hire`) AS `avg_sum`, ' +
                'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'WHERE ' +
                '(`tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') ' +
                'AND ' +
                '`tbu`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ) ' +
                'AND ' +
                '`tbu`.`trendata_bigdata_user_cost_per_hire` IS NOT NULL ' +
                'AND ' +
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
            });
        }).then(function (rows) {
            return {
                month_name: moment(rows[0].month).format('MMMM'),
                avg: rows[0].avg,
                avg_sum: rows[0].avg_sum
            };
        });
    });
}

/**
 * @param filterSql
 * @param accessLevelSql
 * @param verticalAxisTypeConverter
 * @param customField
 * @param customValue
 * @return {Promise.<TResult>}
 */
function totalChartViewByFinancialData(filterSql, accessLevelSql, verticalAxisTypeConverter, customField, customValue) {
    return getHiringCostsValue().then(function (costsValues) {
        return Promise.resolve(_.rangeRight(parseInt(timeSpan.end, 10) || 0, (parseInt(timeSpan.start, 10) || 0) + 1)).map(function (item, index) {
            return Promise.resolve().then(function () {
                var query = 'SELECT ' +
                    'COUNT(*) AS `avg`, ' +
                    'SUM(`tbu`.`trendata_bigdata_user_cost_per_hire`) AS `avg_sum`, ' +
                    'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'WHERE ' +
                    '(`tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') ' +
                    'AND ' +
                    '`tbu`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ) ' +
                    'AND ' +
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
                });
            }).then(function (rows) {
                return {
                    month_name: moment(rows[0].month).format('MMMM'),
                    avg: costsValues[index] / rows[0].avg,
                    avg_sum: rows[0].avg_sum
                };
            });
        });
    });
}

/**
 * @param filterSql
 * @param accessLevelSql
 * @param verticalAxisTypeConverter
 * @param customField
 * @param customValue
 */
function totalChartView(filterSql, accessLevelSql, verticalAxisTypeConverter, customField, customValue) {
    var startDate = moment().subtract(timeSpan.start, 'month');
    var monthsCount = 0;
    var initObject = {
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
    };

    if (requestData.type === 'fromDashboard') {
        initObject.numberPrefix = '';
    }

    return orm.query(
        'SELECT ' +
        'COUNT(*) AS `count` ' +
        'FROM ' +
        '`trendata_bigdata_user` AS `tbu` ' +
        'WHERE ' +
        '`tbu`.`trendata_bigdata_user_cost_per_hire` IS NOT NULL ' +
        'AND ' +
        accessLevelSql.query,
        {
            type: ORM.QueryTypes.SELECT,
            replacements: accessLevelSql.replacements
        }
    ).then(function (rows) {
        return rows[0].count
            ? totalChartViewByUserColumn(filterSql, accessLevelSql, verticalAxisTypeConverter, customField, customValue)
            : totalChartViewByFinancialData(filterSql, accessLevelSql, verticalAxisTypeConverter, customField, customValue);
    }).reduce(function (accum, item, index) {
        if (timeSpan.start - timeSpan.end >= 12) {
            var resultIndex = moment().subtract(timeSpan.start - index, 'month').format('YYYY') - startDate.format('YYYY');
                monthsCount++;

            if (accum.dataset[0].data[resultIndex]) {
                accum.dataset[0].data[resultIndex].value += verticalAxisTypeConverter.convert(item.avg, item.avg_sum);
            } else {
                accum.dataset[0].data[resultIndex] = {
                    value: verticalAxisTypeConverter.convert(item.avg, item.avg_sum)
                };

                if (accum.dataset[0].data[resultIndex - 1]) {
                    monthsCount--;
                    accum.categories[0].category[resultIndex - 1] = {
                        label: moment().subtract(timeSpan.start - index + 1, 'month').format('YYYY')
                    };
                    accum.dataset[0].data[resultIndex - 1].value = _.round(accum.dataset[0].data[resultIndex - 1].value / monthsCount, 2);
                    monthsCount = 1;
                }
            }

            if (index + timeSpan.end >= timeSpan.start) {
                accum.categories[0].category[resultIndex] = {
                    label: moment().subtract(timeSpan.end, 'month').format('YYYY')
                };
                accum.dataset[0].data[resultIndex].value = _.round(accum.dataset[0].data[resultIndex].value / monthsCount, 2);
            }
        } else {
            accum.categories[0].category.push({
                label: item.month_name
            });
            accum.dataset[0].data.push({
                value: verticalAxisTypeConverter.convert(item.avg, item.avg_sum)
            });
        }

        return accum;
    }, initObject);
}

/* ********************************************* By performance chart view ****************************************** */

/**
 * @param filterSql
 * @param accessLevelSql
 * @param verticalAxisTypeConverter
 */
function byPerformanceChartViewByUserColumn(filterSql, accessLevelSql, verticalAxisTypeConverter) {
    return Promise.props({
        /**
         * High Performers
         */
        hp: Promise.resolve(_.rangeRight(parseInt(timeSpan.end, 10) || 0, (parseInt(timeSpan.start, 10) || 0) + 1)).map(function (item) {
            var yearDiff = moment().format('Y') - moment().subtract(item, 'month').format('Y');
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

            return Promise.resolve().then(function () {
                var query = 'SELECT ' +
                    'AVG(`tbu`.`trendata_bigdata_user_cost_per_hire`) AS `avg`, ' +
                    'SUM(`tbu`.`trendata_bigdata_user_cost_per_hire`) AS `avg_sum`, ' +
                    'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'WHERE ' +
                    '(`tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') ' +
                    'AND ' +
                    '`tbu`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ) ' +
                    'AND ' +
                    '`tbu`.`trendata_bigdata_user_cost_per_hire` IS NOT NULL ' +
                    'AND ' +
                    '`tbu`.`' + performanceColumn + '` >= 4 ' +
                    'AND ' +
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
                });
            }).then(function (rows) {
                return {
                    month_name: moment(rows[0].month).format('MMMM'),
                    avg: rows[0].avg,
                    avg_sum: rows[0].avg_sum
                };
            });
        }),

        /**
         * Non-High Performers
         */
        nhp: Promise.resolve(_.rangeRight(parseInt(timeSpan.end, 10) || 0, (parseInt(timeSpan.start, 10) || 0) + 1)).map(function (item) {
            var yearDiff = moment().format('Y') - moment().subtract(item, 'month').format('Y');
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

            return Promise.resolve().then(function () {
                var query = 'SELECT ' +
                    'AVG(`tbu`.`trendata_bigdata_user_cost_per_hire`) AS `avg`, ' +
                    'SUM(`tbu`.`trendata_bigdata_user_cost_per_hire`) AS `avg_sum`, ' +
                    'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'WHERE ' +
                    '(`tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') ' +
                    'AND ' +
                    '`tbu`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ) ' +
                    'AND ' +
                    '`tbu`.`trendata_bigdata_user_cost_per_hire` IS NOT NULL ' +
                    'AND ' +
                    '(`tbu`.`' + performanceColumn + '` < 4 OR `tbu`.`' + performanceColumn + '` IS NULL) ' +
                    'AND ' +
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
                });
            }).then(function (rows) {
                return {
                    month_name: moment(rows[0].month).format('MMMM'),
                    avg: rows[0].avg,
                    avg_sum: rows[0].avg_sum
                };
            });
        })
    });
}

/**
 * @param filterSql
 * @param accessLevelSql
 * @param verticalAxisTypeConverter
 * @return {Promise.<TResult>}
 */
function byPerformanceChartViewByFinancialData(filterSql, accessLevelSql, verticalAxisTypeConverter) {
    return getHiringCostsValue().then(function (costsValues) {
        return Promise.props({
            /**
             * High Performers
             */
            hp: Promise.resolve(_.rangeRight(parseInt(timeSpan.end, 10) || 0, (parseInt(timeSpan.start, 10) || 0) + 1)).map(function (item, index) {
                var yearDiff = moment().format('Y') - moment().subtract(item, 'month').format('Y');
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

                return Promise.resolve().then(function () {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `avg`, ' +
                        'SUM(`tbu`.`trendata_bigdata_user_cost_per_hire`) AS `avg_sum`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '(`tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ) ' +
                        'AND ' +
                        '`tbu`.`' + performanceColumn + '` >= 4 ' +
                        'AND ' +
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
                    });
                }).then(function (rows) {
                    return {
                        month_name: moment(rows[0].month).format('MMMM'),
                        avg: costsValues[index] / rows[0].avg,
                        avg_sum: rows[0].avg_sum
                    };
                });
            }),

            /**
             * Non-High Performers
             */
            nhp: Promise.resolve(_.rangeRight(parseInt(timeSpan.end, 10) || 0, (parseInt(timeSpan.start, 10) || 0) + 1)).map(function (item, index) {
                var yearDiff = moment().format('Y') - moment().subtract(item, 'month').format('Y');
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

                return Promise.resolve().then(function () {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `avg`, ' +
                        'SUM(`tbu`.`trendata_bigdata_user_cost_per_hire`) AS `avg_sum`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '(`tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ) ' +
                        'AND ' +
                        '(`tbu`.`' + performanceColumn + '` < 4 OR `tbu`.`' + performanceColumn + '` IS NULL) ' +
                        'AND ' +
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
                    });
                }).then(function (rows) {
                    return {
                        month_name: moment(rows[0].month).format('MMMM'),
                        avg: costsValues[index] / rows[0].avg,
                        avg_sum: rows[0].avg_sum
                    };
                });
            })
        })
    });
}

/**
 * @param filterSql
 * @param accessLevelSql
 * @param verticalAxisTypeConverter
 */
function byPerformanceChartView(filterSql, accessLevelSql, verticalAxisTypeConverter) {
    var startDate = moment().subtract(timeSpan.start, 'month');
    var monthsCount = 0;
    var initObject = {
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
    };

    if (requestData.type === 'fromDashboard') {
        initObject.numberPrefix = '';
    }

    return orm.query(
        'SELECT ' +
        'COUNT(*) AS `count` ' +
        'FROM ' +
        '`trendata_bigdata_user` AS `tbu` ' +
        'WHERE ' +
        '`tbu`.`trendata_bigdata_user_cost_per_hire` IS NOT NULL ' +
        'AND ' +
        accessLevelSql.query,
        {
            type: ORM.QueryTypes.SELECT,
            replacements: accessLevelSql.replacements
        }
    ).then(function (rows) {
        return rows[0].count
            ? byPerformanceChartViewByUserColumn(filterSql, accessLevelSql, timeSpan, verticalAxisTypeConverter)
            : byPerformanceChartViewByFinancialData(filterSql, accessLevelSql, timeSpan, verticalAxisTypeConverter);
    }).then(function (data) {
        return Promise.reduce(data.hp, function (accum, item, index) {
            if (timeSpan.start - timeSpan.end >= 12) {
                    var resultIndex = moment().subtract(timeSpan.start - index, 'month').format('YYYY') - startDate.format('YYYY');
                    monthsCount++;

                if (accum.dataset[0].data[resultIndex]) {
                    accum.dataset[0].data[resultIndex].value += verticalAxisTypeConverter.convert(item.avg, item.avg_sum);
                    accum.dataset[1].data[resultIndex].value += verticalAxisTypeConverter.convert(data.nhp[index].avg, data.nhp[index].avg_sum);
                } else {
                    accum.dataset[0].data[resultIndex] = {
                        value: verticalAxisTypeConverter.convert(item.avg, item.avg_sum)
                    };
                    accum.dataset[1].data[resultIndex] = {
                        value: verticalAxisTypeConverter.convert(data.nhp[index].avg, data.nhp[index].avg_sum)
                    };

                    if (accum.dataset[0].data[resultIndex - 1]) {
                        monthsCount--;
                        accum.categories[0].category[resultIndex - 1] = {
                            label: moment().subtract(timeSpan.start - index + 1, 'month').format('YYYY')
                        };
                        accum.dataset[0].data[resultIndex - 1].value = _.round(accum.dataset[0].data[resultIndex - 1].value / monthsCount, 2);
                        accum.dataset[1].data[resultIndex - 1].value = _.round(accum.dataset[1].data[resultIndex - 1].value / monthsCount, 2);
                        monthsCount = 1;
                    }
                }

                if (index + timeSpan.end >= timeSpan.start) {
                    accum.categories[0].category[resultIndex] = {
                        label: moment().subtract(timeSpan.end).format('YYYY')
                    };
                    accum.dataset[0].data[resultIndex].value = _.round(accum.dataset[0].data[resultIndex].value / monthsCount, 2);
                    accum.dataset[1].data[resultIndex].value = _.round(accum.dataset[1].data[resultIndex].value / monthsCount, 2);
                }
            } else {
                accum.categories[0].category.push({
                    label: item.month_name
                });
                accum.dataset[0].data.push({
                    value: verticalAxisTypeConverter.convert(item.avg, item.avg_sum)
                });
                accum.dataset[1].data.push({
                    value: verticalAxisTypeConverter.convert(data.nhp[index].avg, data.nhp[index].avg_sum)
                });
            }

            return accum;
        }, initObject);
    });
}

/* ********************************************* Custom chart view ****************************************** */
/**
 * @param filterSql
 * @param accessLevelSql
 * @param verticalAxisTypeConverter
 * @return {Promise.<TResult>}
 */
function customChartViewByFinancialData(filterSql, accessLevelSql, verticalAxisTypeConverter, customFields) {
    return commonChartData.getAvailableFiltersForDrilldown(customFields).then(function (availableFilters) {
        return Promise.resolve({}).then(function (data) {
            data.city = {
                filters: requestData.data.filters,
                column: '`tbu`.`trendata_bigdata_user_address_city`',
                title: 'City',
                values: availableFilters.city
            };

            data.gender = {
                filters: requestData.data.filters,
                column: '`tbu`.`trendata_bigdata_user_gender`',
                title: 'Gender',
                values: availableFilters.gender
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
            var startDate = moment().subtract(timeSpan.start, 'month');
            var monthsCount = 0;
            var initObject = {
                categories: [
                    {
                        category: []
                    }
                ],
                dataset: [],
                paletteColors: colors.getAll(),
                numberSuffix: verticalAxisTypeConverter.suffix
            };

            if (requestData.type === 'fromDashboard') {
                initObject.numberPrefix = '';
            }

            _.each(data[chartView].values, function(item) {
                initObject.dataset.push({
                    seriesname: item,
                    data: []
                });
            });
            return getHiringCostsValue().then(function (costsValues) {
                return Promise.resolve(_.rangeRight(parseInt(timeSpan.end, 10) || 0, (parseInt(timeSpan.start, 10) || 0) + 1)).map(function (item, index) {
                    return Promise.map(data[chartView].values, function(filterValue) {
                        var query = 'SELECT ' +
                            'COUNT(*) AS `avg`, ' +
                            'SUM(`tbu`.`trendata_bigdata_user_cost_per_hire`) AS `avg_sum`, ' +
                            'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                            'FROM ' +
                            '`trendata_bigdata_user` AS `tbu` ' +
                            'WHERE ' +
                            '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                            'OR ' +
                            '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                            'AND ' +
                            data[chartView].column + ' = ? ' +
                            'AND ' +
                            '`tbu`.`trendata_bigdata_user_absences` IS NOT NULL ' +
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
                                month_name: moment(rows[0].month).format('MMMM'),
                                avg: costsValues[index] / rows[0].avg,
                                avg_sum: rows[0].avg_sum
                            };
                        });
                    });
                }).reduce(function (accum, item, index) {
                    if (timeSpan.start - timeSpan.end >= 12) {
                        var resultIndex = moment().subtract(timeSpan.start - index, 'month').format('YYYY') - startDate.format('YYYY');
                            monthsCount++;

                        if (accum.dataset[0].data[resultIndex]) {
                            _.each(item, function(value, subIndex) {
                                accum.dataset[subIndex].data[resultIndex].value += verticalAxisTypeConverter.convert(value.avg, value.avg_sum);
                            });
                            } else {
                                _.each(item, function(value, subIndex) {
                                    accum.dataset[subIndex].data[resultIndex] = {value: verticalAxisTypeConverter.convert(value.avg, value.avg_sum)};
                                });

                                if (accum.dataset[0].data[resultIndex - 1]) {
                                    monthsCount--;accum.categories[0].category[resultIndex - 1] = {
                                        label: moment().subtract( timeSpan.start - index + 1, 'month').format('YYYY')
                                    };
                                    _.each(item, function(value, subIndex) {
                                        accum.dataset[subIndex].data[resultIndex - 1].value = _.round(accum.dataset[subIndex].data[resultIndex - 1].value / monthsCount, 2);
                                    });
                                monthsCount = 1;
                            }
                                }

                                if (index +  timeSpan .end >= timeSpan.start) {
                                    accum.categories[0].category[resultIndex] = {
                                        label: moment().subtract(timeSpan.end, 'month').format('YYYY')
                                    };
                                    _.each(item, function(value, subIndex) {
                                        accum.dataset[subIndex].data[resultIndex].value = _.round(accum.dataset[subIndex].data[resultIndex].value / monthsCount, 2);

                                });
                            }
                        } else {
                            accum.categories[0].category.push({
                                label: item[0].month_name
                            });
                            _.each(item, function(value, subIndex) {
                                accum.dataset[subIndex].data.push({
                                    value: verticalAxisTypeConverter.convert(value.avg, value.avg_sum)
                                });
                            });
                        }

                    return accum;
                }, initObject);
            });
        })
    });
}

/**
 * @param filterSql
 * @param accessLevelSql
 * @param verticalAxisTypeConverter
 * @return {Promise.<TResult>}
 */
function customChartViewByUserColumn(filterSql, accessLevelSql, verticalAxisTypeConverter, customFields) {
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
            var startDate = moment().subtract(timeSpan.start, 'month');
            var monthsCount = 0;
            var initObject = {
                categories: [
                    {
                        category: []
                    }
                ],
                dataset: [],
                paletteColors: colors.getAll(),
                numberSuffix: verticalAxisTypeConverter.suffix
            };

            if (requestData.type === 'fromDashboard') {
                initObject.numberPrefix = '';
            }

            _.each(data[chartView].values, function(item) {
                initObject.dataset.push({
                    seriesname: item,
                    data: []
                });
            });

            return Promise.resolve(_.rangeRight(parseInt(timeSpan.end, 10) || 0, (parseInt(timeSpan.start, 10) || 0) + 1)).map(function (item) {
                return Promise.map(data[chartView].values, function(filterValue) {
                    var query = 'SELECT ' +
                        'AVG(`tbu`.`trendata_bigdata_user_cost_per_hire`) AS `avg`, ' +
                        'SUM(`tbu`.`trendata_bigdata_user_cost_per_hire`) AS `avg_sum`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'WHERE ' +
                        '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                        'OR ' +
                        '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                        'AND ' +
                        data[chartView].column + ' = ? ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_cost_per_hire` IS NOT NULL ' +
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
                            month_name: moment(rows[0].month).format('MMMM'),
                            avg: _.round(rows[0].avg, 2),
                            avg_sum: rows[0].avg_sum
                        };
                    });
                });
            }).reduce(function (accum, item, index) {
                if (timeSpan.start - timeSpan.end >= 12) {
                    var resultIndex = moment().subtract(timeSpan.start - index, 'month').format('YYYY') - startDate.format('YYYY');
                        monthsCount++;

                    if (accum.dataset[0].data[resultIndex]) {
                        _.each(item, function(value, subIndex) {
                            accum.dataset[subIndex].data[resultIndex].value += verticalAxisTypeConverter.convert(value.avg, value.avg_sum);
                        });
                        } else {
                            _.each(item, function(value, subIndex) {
                                accum.dataset[subIndex].data[resultIndex] = {value: verticalAxisTypeConverter.convert(value.avg, value.avg_sum)};
                            });

                            if (accum.dataset[0].data[resultIndex - 1]) {
                                monthsCount--;accum.categories[0].category[resultIndex - 1] = {
                                    label: moment().subtract( timeSpan.start - index + 1, 'month').format('YYYY')
                                };
                                _.each(item, function(value, subIndex) {
                                    accum.dataset[subIndex].data[resultIndex - 1].value = _.round(accum.dataset[subIndex].data[resultIndex - 1].value / monthsCount, 2);
                                });
                            monthsCount = 1;
                        }
                            }

                            if (index +  timeSpan .end >= timeSpan.start) {
                                accum.categories[0].category[resultIndex] = {
                                    label: moment().subtract(timeSpan.end, 'month').format('YYYY')
                                };
                                _.each(item, function(value, subIndex) {
                                    accum.dataset[subIndex].data[resultIndex].value = _.round(accum.dataset[subIndex].data[resultIndex].value / monthsCount, 2);

                            });
                        }
                    } else {
                        accum.categories[0].category.push({
                            label: item[0].month_name
                        });
                        _.each(item, function(value, subIndex) {
                            accum.dataset[subIndex].data.push({
                                value: verticalAxisTypeConverter.convert(value.avg, value.avg_sum)
                            });
                        });
                    }

                return accum;
            }, initObject);
        })
    });
}

/**
 * @param filterSql
 * @param accessLevelSql
 * @param verticalAxisTypeConverter
 */
function customChartView(filterSql, accessLevelSql, verticalAxisTypeConverter, customFields) {
    return orm.query(
        'SELECT ' +
        'COUNT(*) AS `count` ' +
        'FROM ' +
        '`trendata_bigdata_user` AS `tbu` ' +
        'WHERE ' +
        '`tbu`.`trendata_bigdata_user_cost_per_hire` IS NOT NULL ' +
        'AND ' +
        accessLevelSql.query,
        {
            type: ORM.QueryTypes.SELECT,
            replacements: accessLevelSql.replacements
        }
    ).then(function (rows) {
        return rows[0].count
            ? customChartViewByUserColumn(filterSql, accessLevelSql, verticalAxisTypeConverter, customFields)
            : customChartViewByFinancialData(filterSql, accessLevelSql, verticalAxisTypeConverter, customFields);
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
                commonChartData.makeUsersFilter(timeSpan),
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
                    var chartView = requestData.data.chart_view && requestData.data.chart_view.toLowerCase() || 'total';

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

    // For Dashboard
    case 'fromDashboard':
        commonChartData.getCustomFields(req).then(function(customFields) {
            return Promise.all([
                commonChartData.makeAccessLevelSql(req),
                commonChartData.makeFilterSqlByFilters(requestData.data.filters, customFields),
                commonChartData.verticalAxisTypeConverter(requestData.data.vertical_axis_type),
                customFields
            ]);
        }).spread(function (accessLevelSql, filterSql, verticalAxisTypeConverter, customFields) {
            return (function () {
                var chartView = requestData.data.chart_view && requestData.data.chart_view.toLowerCase() || 'total';

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
                commonChartData.makeUsersFilter(timeSpan, userTypes),
                commonChartData.verticalAxisTypeConverter(requestData.data.vertical_axis_type),
                customFields
            ]);
        }).spread(function (availableFilters, accessLevelSql, filterSql, usersFilter, verticalAxisTypeConverter, customFields) {
            return Promise.props({
                /**
                 *
                 */
                chart_data: (function () {
                    var chartView = requestData.data.chart_view && requestData.data.chart_view.toLowerCase() || 'total';

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

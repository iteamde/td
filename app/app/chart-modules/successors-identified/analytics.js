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
    type: 'change_filters',

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

/**
 * @param chartView
 * @param filterSql
 * @param accessLevelSql
 * @param timeSpan
 * @param verticalAxisTypeConverter
 */
function analyticsByCustomFields(chartView, filterSql, accessLevelSql, verticalAxisTypeConverter) {
    return orm.query(
        'SELECT ' +
        '`tbu`.`trendata_bigdata_user_custom_fields`->>? AS `value` ' +
        'FROM ' +
        '`trendata_bigdata_user` AS `tbu` ' +
        'GROUP BY ' +
        '`tbu`.`trendata_bigdata_user_custom_fields`->>?',
        {
            type: ORM.QueryTypes.SELECT,
            replacements: [
                '$.' + JSON.stringify(chartView),
                '$.' + JSON.stringify(chartView)
            ]
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
    var startDate = moment().subtract(timeSpan.start, 'month');
    var monthsCount = 0;

    return Promise.resolve(_.rangeRight(parseInt(timeSpan.end, 10) || 0, (parseInt(timeSpan.start, 10) || 0) + 1)).map(function (item) {
        return Promise.props({
            /**
             *
             */
            yes: (function () {
                var query = 'SELECT ' +
                    'COUNT(*) AS `count`, ' +
                    'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_user_position` AS `tbup` ' +
                    'ON ' +
                    '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_user_address` AS `tbua` ' +
                    'ON ' +
                    '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
                    'WHERE ' +
                    '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                    'OR ' +
                    '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                    'AND ' +
                    '`tbu`.`trendata_bigdata_user_successor` IS NOT NULL ' +
                    'AND ' +
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
                    query += ' AND `tbu`.`trendata_bigdata_user_custom_fields`->>\'$.' + JSON.stringify(customField).replace('\\', '\\\\').replace('\'', '\\\'') + '\' = ?';
                    replacements.push(customValue);
                }

                return orm.query(query, {
                    type: ORM.QueryTypes.SELECT,
                    replacements: replacements
                }).then(function (rows) {
                    return {
                        month_name: moment(rows[0].month).format('MMMM'),
                        count: rows[0].count
                    };
                })
            })(),

            /**
             * All users
             */
            all: (function () {
                var query = 'SELECT ' +
                    'COUNT(*) AS `count`, ' +
                    'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_user_position` AS `tbup` ' +
                    'ON ' +
                    '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_user_address` AS `tbua` ' +
                    'ON ' +
                    '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
                    'WHERE ' +
                    '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                    'OR ' +
                    '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                    'AND ' +
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
                    query += ' AND `tbu`.`trendata_bigdata_user_custom_fields`->>\'$.' + JSON.stringify(customField).replace('\\', '\\\\').replace('\'', '\\\'') + '\' = ?';
                    replacements.push(customValue);
                }

                return orm.query(query, {
                    type: ORM.QueryTypes.SELECT,
                    replacements: replacements
                }).then(function (rows) {
                    return {
                        month_name: moment(rows[0].month).format('MMMM'),
                        count: rows[0].count
                    };
                })
            })()
        }).then(function (data) {
            return {
                month_name: data.yes.month_name,
                value: verticalAxisTypeConverter.convert(data.yes.count, data.all.count)
            };
        });
    }).reduce(function (accum, item, index) {
        if (timeSpan.start - timeSpan.end >= 12) {
            var resultIndex = moment().subtract(timeSpan.start - index, 'month').format('YYYY') - startDate.format('YYYY');
                monthsCount++;

            if (accum.dataset[0].data[resultIndex]) {
                accum.dataset[0].data[resultIndex].value += item.value;
                } else {
                    accum.dataset[0].data[resultIndex] = {value: item.value};

                    if (accum.dataset[0].data[resultIndex - 1]) {
                        monthsCount--;accum.categories[0].category[resultIndex - 1] = {
                            label: moment().subtract( timeSpan.start - index + 1, 'month').format('YYYY')
                        };
                        accum.dataset[0].data[resultIndex - 1].value = _.round(accum.dataset[0].data[resultIndex - 1].value / monthsCount, 1);
                    monthsCount = 1;
                }
                    }

                    if (index +  timeSpan .end >= timeSpan.start) {
                        accum.categories[0].category[resultIndex] = {
                            label: moment().subtract(timeSpan.end, 'month').format('YYYY')
                        };
                        accum.dataset[0].data[resultIndex].value = _.round(accum.dataset[0].data[resultIndex].value / monthsCount, 1);

                }
            } else {
                accum.categories[0].category.push({
                    label: item.month_name
                });
                accum.dataset[0].data.push({
                    value: item.value
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
 * @param verticalAxisTypeConverter
 */
function byGenderChartView(filterSql, accessLevelSql, verticalAxisTypeConverter) {
    var startDate = moment().subtract(timeSpan.start, 'month');
    var monthsCount = 0;

    return Promise.props({
        /**
         * Male
         */
        male: Promise.resolve(_.rangeRight(parseInt(timeSpan.end, 10) || 0, (parseInt(timeSpan.start, 10) || 0) + 1)).map(function (item) {
            return Promise.props({
                /**
                 *
                 */
                yes: (function () {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'INNER JOIN ' +
                        '`trendata_bigdata_user_position` AS `tbup` ' +
                        'ON ' +
                        '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                        'INNER JOIN ' +
                        '`trendata_bigdata_user_address` AS `tbua` ' +
                        'ON ' +
                        '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
                        'WHERE ' +
                        '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                        'OR ' +
                        '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_successor` IS NOT NULL ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_gender_id` = 1 ' +
                        'AND ' +
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
                            month_name: moment(rows[0].month).format('MMMM'),
                            count: rows[0].count
                        };
                    })
                })(),

                /**
                 * All users
                 */
                all: (function () {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'INNER JOIN ' +
                        '`trendata_bigdata_user_position` AS `tbup` ' +
                        'ON ' +
                        '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                        'INNER JOIN ' +
                        '`trendata_bigdata_user_address` AS `tbua` ' +
                        'ON ' +
                        '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
                        'WHERE ' +
                        '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                        'OR ' +
                        '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_gender_id` = 1 ' +
                        'AND ' +
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
                            month_name: moment(rows[0].month).format('MMMM'),
                            count: rows[0].count
                        };
                    })
                })()
            }).then(function (data) {
                return {
                    month_name: data.yes.month_name,
                    value: verticalAxisTypeConverter.convert(data.yes.count, data.all.count)
                };
            });
        }),

        /**
         * Female
         */
        female: Promise.resolve(_.rangeRight(parseInt(timeSpan.end, 10) || 0, (parseInt(timeSpan.start, 10) || 0) + 1)).map(function (item) {
            return Promise.props({
                /**
                 *
                 */
                yes: (function () {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'INNER JOIN ' +
                        '`trendata_bigdata_user_position` AS `tbup` ' +
                        'ON ' +
                        '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                        'INNER JOIN ' +
                        '`trendata_bigdata_user_address` AS `tbua` ' +
                        'ON ' +
                        '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
                        'WHERE ' +
                        '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                        'OR ' +
                        '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_successor` IS NOT NULL ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_gender_id` = 2 ' +
                        'AND ' +
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
                            month_name: moment(rows[0].month).format('MMMM'),
                            count: rows[0].count
                        };
                    })
                })(),

                /**
                 * All users
                 */
                all: (function () {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'INNER JOIN ' +
                        '`trendata_bigdata_user_position` AS `tbup` ' +
                        'ON ' +
                        '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                        'INNER JOIN ' +
                        '`trendata_bigdata_user_address` AS `tbua` ' +
                        'ON ' +
                        '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
                        'WHERE ' +
                        '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                        'OR ' +
                        '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_gender_id` = 2 ' +
                        'AND ' +
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
                            month_name: moment(rows[0].month).format('MMMM'),
                            count: rows[0].count
                        };
                    })
                })()
            }).then(function (data) {
                return {
                    month_name: data.yes.month_name,
                    value: verticalAxisTypeConverter.convert(data.yes.count, data.all.count)
                };
            });
        })
    }).then(function (data) {
        return Promise.reduce(data.male, function (accum, item, index) {
            if (timeSpan.start - timeSpan.end >= 12) {
                var resultIndex = moment().subtract(timeSpan.start - index, 'month').format('YYYY') - startDate.format('YYYY');
                    monthsCount++;

                if (accum.dataset[0].data[resultIndex]) {
                    accum.dataset[0].data[resultIndex].value += item.value;
                    accum.dataset[1].data[resultIndex].value += data.female[index].value;
                    } else {
                        accum.dataset[0].data[resultIndex] = {value: item.value};
                        accum.dataset[1].data[resultIndex] = {value: data.female[index].value};

                        if (accum.dataset[0].data[resultIndex - 1]) {
                            monthsCount--;accum.categories[0].category[resultIndex - 1] = {
                                label: moment().subtract( timeSpan.start - index + 1, 'month').format('YYYY')
                            };
                            accum.dataset[0].data[resultIndex - 1].value = _.round(accum.dataset[0].data[resultIndex - 1].value / monthsCount, 1);
                            accum.dataset[1].data[resultIndex - 1].value = _.round(accum.dataset[1].data[resultIndex - 1].value / monthsCount, 1);
                        monthsCount = 1;
                    }
                        }

                        if (index +  timeSpan .end >= timeSpan.start) {
                            accum.categories[0].category[resultIndex] = {
                                label: moment().subtract(timeSpan.end, 'month').format('YYYY')
                            };
                            accum.dataset[0].data[resultIndex].value = _.round(accum.dataset[0].data[resultIndex].value / monthsCount, 1);
                            accum.dataset[1].data[resultIndex].value = _.round(accum.dataset[1].data[resultIndex].value / monthsCount, 1);

                    }
                } else {
                    accum.categories[0].category.push({
                        label: item.month_name
                    });
                    accum.dataset[0].data.push({
                        value: item.value
                    });
                    accum.dataset[1].data.push({
                        value: data.female[index].value
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
                    seriesname: 'Male',
                    data: []
                },
                {
                    seriesname: 'Female',
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
 */
function byPerformanceChartView(filterSql, accessLevelSql, verticalAxisTypeConverter) {
    var startDate = moment().subtract(timeSpan.start, 'month');
    var monthsCount = 0;

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

            return Promise.props({
                /**
                 *
                 */
                yes: (function () {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'INNER JOIN ' +
                        '`trendata_bigdata_user_position` AS `tbup` ' +
                        'ON ' +
                        '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                        'INNER JOIN ' +
                        '`trendata_bigdata_user_address` AS `tbua` ' +
                        'ON ' +
                        '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
                        'WHERE ' +
                        '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                        'OR ' +
                        '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_successor` IS NOT NULL ' +
                        'AND ' +
                        '`tbu`.`' + performanceColumn + '` >= 4 ' +
                        'AND ' +
                        '`tbu`.`' + performanceColumn + '` IS NOT NULL ' +
                        'AND ' +
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
                            month_name: moment(rows[0].month).format('MMMM'),
                            count: rows[0].count
                        };
                    });
                })(),

                /**
                 * All users
                 */
                all: (function () {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'INNER JOIN ' +
                        '`trendata_bigdata_user_position` AS `tbup` ' +
                        'ON ' +
                        '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                        'INNER JOIN ' +
                        '`trendata_bigdata_user_address` AS `tbua` ' +
                        'ON ' +
                        '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
                        'WHERE ' +
                        '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                        'OR ' +
                        '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                        'AND ' +
                        '`tbu`.`' + performanceColumn + '` >= 4 ' +
                        'AND ' +
                        '`tbu`.`' + performanceColumn + '` IS NOT NULL ' +
                        'AND ' +
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
                            month_name: moment(rows[0].month).format('MMMM'),
                            count: rows[0].count
                        };
                    });
                })()
            }).then(function (data) {
                return {
                    month_name: data.yes.month_name,
                    value: verticalAxisTypeConverter.convert(data.yes.count, data.all.count)
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

            return Promise.props({
                /**
                 *
                 */
                yes: (function () {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'INNER JOIN ' +
                        '`trendata_bigdata_user_position` AS `tbup` ' +
                        'ON ' +
                        '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                        'INNER JOIN ' +
                        '`trendata_bigdata_user_address` AS `tbua` ' +
                        'ON ' +
                        '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
                        'WHERE ' +
                        '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                        'OR ' +
                        '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                        'AND ' +
                        '`tbu`.`trendata_bigdata_user_successor` IS NOT NULL ' +
                        'AND ' +
                        '`tbu`.`' + performanceColumn + '` < 4 ' +
                        'AND ' +
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
                            month_name: moment(rows[0].month).format('MMMM'),
                            count: rows[0].count
                        };
                    });
                })(),

                /**
                 * All users
                 */
                all: (function () {
                    var query = 'SELECT ' +
                        'COUNT(*) AS `count`, ' +
                        'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'INNER JOIN ' +
                        '`trendata_bigdata_user_position` AS `tbup` ' +
                        'ON ' +
                        '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                        'INNER JOIN ' +
                        '`trendata_bigdata_user_address` AS `tbua` ' +
                        'ON ' +
                        '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
                        'WHERE ' +
                        '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                        'OR ' +
                        '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                        'AND ' +
                        '`tbu`.`' + performanceColumn + '` < 4 ' +
                        'AND ' +
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
                            month_name: moment(rows[0].month).format('MMMM'),
                            count: rows[0].count
                        };
                    });
                })()
            }).then(function (data) {
                return {
                    month_name: data.yes.month_name,
                    value: verticalAxisTypeConverter.convert(data.yes.count, data.all.count)
                };
            });
        })
    }).then(function (data) {
        return Promise.reduce(data.hp, function (accum, item, index) {
            if (timeSpan.start - timeSpan.end >= 12) {
                var resultIndex = moment().subtract(timeSpan.start - index, 'month').format('YYYY') - startDate.format('YYYY');
                    monthsCount++;

                if (accum.dataset[0].data[resultIndex]) {
                    accum.dataset[0].data[resultIndex].value += item.value;
                    accum.dataset[1].data[resultIndex].value += data.nhp[index].value;
                    } else {
                        accum.dataset[0].data[resultIndex] = {value: item.value};
                        accum.dataset[1].data[resultIndex] = {value: data.nhp[index].value};

                        if (accum.dataset[0].data[resultIndex - 1]) {
                            monthsCount--;accum.categories[0].category[resultIndex - 1] = {
                                label: moment().subtract( timeSpan.start - index + 1, 'month').format('YYYY')
                            };
                            accum.dataset[0].data[resultIndex - 1].value = _.round(accum.dataset[0].data[resultIndex - 1].value / monthsCount, 1);
                            accum.dataset[1].data[resultIndex - 1].value = _.round(accum.dataset[1].data[resultIndex - 1].value / monthsCount, 1);
                        monthsCount = 1;
                    }
                        }

                        if (index +  timeSpan .end >= timeSpan.start) {
                            accum.categories[0].category[resultIndex] = {
                                label: moment().subtract(timeSpan.end).format('YYYY')
                            };
                            accum.dataset[0].data[resultIndex].value = _.round(accum.dataset[0].data[resultIndex].value / monthsCount, 1);
                            accum.dataset[1].data[resultIndex].value = _.round(accum.dataset[1].data[resultIndex].value / monthsCount, 1);

                    }
                } else {
                    accum.categories[0].category.push({
                        label: item.month_name
                    });
                    accum.dataset[0].data.push({
                        value: _.round(item.value, 1)
                    });
                    accum.dataset[1].data.push({
                        value: _.round(data.nhp[index].value, 1)
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
function customChartView(filterSql, accessLevelSql, verticalAxisTypeConverter) {
    return commonChartData.getAvailableFiltersForDrilldown(req).then(function (availableFilters) {
        return Promise.resolve({}).then(function (data) {
            data.city = {
                filters: requestData.data.filters,
                column: '`tbua`.`trendata_bigdata_user_address_city`',
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
                column: '`tbua`.`trendata_bigdata_user_address_state`',
                title: 'State',
                values: availableFilters.state
            };

            data['job level'] = {
                filters: requestData.data.filters,
                column: '`tbu`.`trendata_bigdata_user_job_level`',
                title: 'Job Level',
                values: availableFilters['job level']
            };

            return data;
        }).then(function (data) {
            var chartView = requestData.data.chart_view && requestData.data.chart_view.toLowerCase();;
            var startDate = moment().subtract(timeSpan.start, 'month');
            var monthsCount = 0;
            var initObject = {
                categories: [
                    {
                        category: []
                    }
                ],
                numberSuffix: verticalAxisTypeConverter.suffix,
                dataset: [],
                paletteColors: '#33b297, #ee7774, #005075, #33b5e5, #73b234, #aa66cc, #b29234, #72eecf, #b23473'
            };

            _.each(data[chartView].values, function(item) {
                initObject.dataset.push({
                    seriesname: item,
                    data: []
                });
            });

            return Promise.resolve(_.rangeRight(parseInt(timeSpan.end, 10) || 0, (parseInt(timeSpan.start, 10) || 0) + 1)).map(function (item) {
                return Promise.map(data[chartView].values, function(filterValue) {
                    return Promise.props({
                        /**
                         *
                         */
                        yes: (function() {
                            var query = 'SELECT ' +
                                'COUNT(*) as `count`, ' +
                                'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                                'FROM ' +
                                '`trendata_bigdata_user` AS `tbu` ' +
                                'INNER JOIN ' +
                                '`trendata_bigdata_user_position` AS `tbup` ' +
                                'ON ' +
                                '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                                'INNER JOIN ' +
                                '`trendata_bigdata_user_address` AS `tbua` ' +
                                'ON ' +
                                '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
                                'WHERE ' +
                                '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                                'OR ' +
                                '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                                'AND ' +
                                '`tbu`.`trendata_bigdata_user_successor` IS NOT NULL ' +
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
                                    month_name: moment(rows[0].month).format('MMMM'),
                                    count: rows[0].count
                                };
                            });
                        })(),

                        /**
                         *
                         */
                        all: (function() {
                            var query = 'SELECT ' +
                                'COUNT(*) as `count`, ' +
                                'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
                                'FROM ' +
                                '`trendata_bigdata_user` AS `tbu` ' +
                                'INNER JOIN ' +
                                '`trendata_bigdata_user_position` AS `tbup` ' +
                                'ON ' +
                                '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                                'INNER JOIN ' +
                                '`trendata_bigdata_user_address` AS `tbua` ' +
                                'ON ' +
                                '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
                                'WHERE ' +
                                '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                                'OR ' +
                                '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
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
                                    month_name: moment(rows[0].month).format('MMMM'),
                                    count: rows[0].count
                                };
                            });
                        })()
                    }).then(function(data) {
                        return {
                            month_name: data.yes.month_name,
                            value: verticalAxisTypeConverter.convert(data.yes.count, data.all.count)
                        };
                    });
                });
            }).reduce(function (accum, item, index) {
                if (timeSpan.start - timeSpan.end >= 12) {
                    var resultIndex = moment().subtract(timeSpan.start - index, 'month').format('YYYY') - startDate.format('YYYY');
                        monthsCount++;

                    if (accum.dataset[0].data[resultIndex]) {
                        _.each(item, function(value, subIndex) {
                            accum.dataset[subIndex].data[resultIndex].value += value.value;
                        });
                        } else {
                            _.each(item, function(value, subIndex) {
                                accum.dataset[subIndex].data[resultIndex] = {value: value.value};
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
                                value: value.value
                            });
                        });
                    }

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
if ('change_filters' === requestData.type) {
    Promise.all([
        commonChartData.getAvailableFiltersForDrilldown(),
        commonChartData.makeAccessLevelSql(req),
        commonChartData.makeFilterSqlByFilters(requestData.data.filters),
        commonChartData.makeUsersFilter(timeSpan),
        commonChartData.verticalAxisTypeConverter(requestData.data.vertical_axis_type)
    ]).spread(function (availableFilters, accessLevelSql, filterSql, usersFilter, verticalAxisTypeConverter) {
        return Promise.props({
            /**
             *
             */
            chart_data: (function () {
                var chartView = requestData.data.chart_view && requestData.data.chart_view.toLowerCase() || 'total';

                return commonChartData.getCustomFields().then(function (customFields) {
                    if (customFields.indexOf(chartView) !== -1) {
                        return analyticsByCustomFields(chartView, filterSql, accessLevelSql, verticalAxisTypeConverter);
                    }

                switch (chartView) {
                    case 'gender':
                        return byGenderChartView(filterSql, accessLevelSql, verticalAxisTypeConverter);
                    case 'performance':
                        return byPerformanceChartView(filterSql, accessLevelSql, verticalAxisTypeConverter);
                    case 'total':
                        return totalChartView(filterSql, accessLevelSql, verticalAxisTypeConverter);
                    default:
                        return customChartView(filterSql, accessLevelSql, verticalAxisTypeConverter);
                }
            }).then(function (data) {
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
                            value: _.round(item, 1)
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
            })(),

            /**
             *
             */
            users: commonChartData.getUsersOnPageByFilters(filterSql, accessLevelSql, requestData.data.user_pagination, selfId, usersFilter),

            /**
             *
             */
            users_count: commonChartData.getUsersCountByFilters(filterSql, accessLevelSql, usersFilter),

            /**
             *
             */
            available_chart_view: commonChartData.getCustomFields(req).then(function (chartViews) {
                return ['Total', 'Performance', 'City', 'State', 'Country', 'Department', 'Division', 'Cost Center', 'Gender', 'Job Level'].concat(chartViews);
            }),

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
                'Values',
                'Percentage (%)',
                'Dollars ($)'
            ],

            /**
             *
             */
            summary: commonChartData.getAnalyticsSummary(req, filterSql, accessLevelSql)
        });
    }).then(_resolve).catch(_reject);
}

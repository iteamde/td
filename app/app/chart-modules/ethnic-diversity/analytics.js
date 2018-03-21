'use strict';

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
 *
 */
function getHireSources() {
    return orm.query(
        'SELECT ' +
        '`tbu`.`trendata_bigdata_user_ethnicity` ' +
        'FROM ' +
        '`trendata_bigdata_user` AS `tbu` ' +
        'GROUP BY ' +
        '`tbu`.`trendata_bigdata_user_ethnicity`'
    , {
        type: ORM.QueryTypes.SELECT
    }).map(function (item) {
        return {
            id: item.trendata_bigdata_user_ethnicity,
            label: item.trendata_bigdata_user_ethnicity
        };
    });
}

/**
 * @param hireSources
 * @param verticalAxisTypeConverter
 * @return {{categories: [null], dataset: Array, numberSuffix}}
 */
function getChartDataTemplate(hireSources, verticalAxisTypeConverter) {
    var templpate = {
        categories: [
            {
                category: []
            }
        ],
        dataset: [],
        numberSuffix: verticalAxisTypeConverter.suffix
    };

    for (var i in hireSources) {
        templpate.dataset.push({
            seriesname: hireSources[i].label,
            data: []
        });
    }

    return templpate;
}

/**
 * @param filterSql
 * @param accessLevelSql
 * @param verticalAxisTypeConverter
 */
function totalChartView(filterSql, accessLevelSql, verticalAxisTypeConverter) {
    var startDate = moment().subtract(timeSpan.start, 'month');
    var monthsCount = 0;

    return getHireSources().then(function (hireSources) {
        return {
            hireSources: hireSources,
            chartDataTemplate: getChartDataTemplate(hireSources, verticalAxisTypeConverter)
        };
    }).then(function (data) {
        return Promise.resolve(_.rangeRight(parseInt(timeSpan.end, 10) || 0, (parseInt(timeSpan.start, 10) || 0) + 1)).map(function (item) {
            return Promise.resolve().then(function () {
                var query = 'SELECT ' +
                    '* ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'WHERE ' +
                    '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                    'OR ' +
                    '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                    'AND ' +
                    '`tbu`.`trendata_bigdata_user_ethnicity` IS NOT NULL ' +
                    'AND ' +
                    '`tbu`.`trendata_bigdata_user_ethnicity` != \'\' ' +
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
                return Promise.props({
                    month_name: moment().add(-item, 'month').format('MMMM'),
                    values: Promise.map(data.hireSources, function (source) {
                        return verticalAxisTypeConverter.convert(_.sumBy(rows, function (user) {
                            return user.trendata_bigdata_user_ethnicity == source.id ? 1 : 0;
                        }), rows.length);
                    })
                });
            });
        }).reduce(function (accum, item, index) {
            if (timeSpan.start - timeSpan.end >= 12) {
                var resultIndex = moment().subtract(timeSpan.start - index, 'month').format('YYYY') - startDate.format('YYYY');
                monthsCount++;

                if (accum.dataset[0].data[resultIndex]) {
                    for (var i in item.values) {
                        accum.dataset[i].data[resultIndex].value += item.values[i];
                    }
                } else {
                    for (var i in item.values) {
                        accum.dataset[i].data[resultIndex] = {
                            value: item.values[i]
                        };
                    }

                    if (accum.dataset[0].data[resultIndex - 1]) {
                        monthsCount--;
                        accum.categories[0].category[resultIndex - 1] = {
                            label: moment().subtract(timeSpan.start - index + 1, 'month').format('YYYY')
                        };

                        for (var i in accum.dataset) {
                            accum.dataset[i].data[resultIndex - 1].value = accum.dataset[i].data[resultIndex - 1].value / monthsCount;
                        }
                        monthsCount = 1;
                    }
                }

                if (index + timeSpan.end >= timeSpan.start) {
                    accum.categories[0].category[resultIndex] = {
                        label: moment().subtract(timeSpan.end, 'month').format('YYYY')
                    };

                    for (var i in accum.dataset) {
                        accum.dataset[i].data[resultIndex].value = accum.dataset[i].data[resultIndex].value / monthsCount;
                    }
                }
            } else {
                accum.categories[0].category.push({
                    label: item.month_name
                });

                for (var i in item.values) {
                    accum.dataset[i].data.push({
                        value: item.values[i]
                    });
                }
            }

            return accum;
        }, data.chartDataTemplate).then(function (data) {
            if ('value' === verticalAxisTypeConverter.type || 'dollar' === verticalAxisTypeConverter.type) {
                var newData = {
                    categories: data.categories,
                    dataset: [],
                    numberSuffix: data.numberSuffix
                };

                for (var i = 0; i < data.dataset.length; ++i) {
                    var newDataset = {
                        seriesname: data.dataset[i].seriesname,
                        data: []
                    };

                    for (var j = 0; j < data.dataset[i].data.length; ++j) {
                        newDataset.data.push({
                            value: _.round(data.dataset[i].data[j].value, 0)
                        });
                    }

                    newData.dataset.push(newDataset);
                }

                return newData;
            }

            var newData = {
                categories: data.categories,
                dataset: [],
                numberSuffix: data.numberSuffix
            };

            for (var i = 0; i < data.dataset.length; ++i) {
                var newDataset = {
                    seriesname: data.dataset[i].seriesname,
                    data: []
                };

                for (var j = 0; j < data.dataset[i].data.length; ++j) {
                    newDataset.data.push({
                        value: _.round(data.dataset[i].data[j].value, 2)
                    });
                }

                newData.dataset.push(newDataset);
            }

            return newData;
        });
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
                chart_data: totalChartView(filterSql, accessLevelSql, verticalAxisTypeConverter).then(function (data) {
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
                commonChartData.makeUsersFilter(timeSpan),
                commonChartData.verticalAxisTypeConverter(requestData.data.vertical_axis_type)
            ]);
        }).spread(function (availableFilters, accessLevelSql, filterSql, usersFilter, verticalAxisTypeConverter, customFields) {
            return Promise.props({
                /**
                 *
                 */
                chart_data: totalChartView(filterSql, accessLevelSql, verticalAxisTypeConverter).then(function (data) {
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
                available_chart_view: ['Total'],

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
                    types: undefined
                 }
            });
        }).then(_resolve).catch(_reject);
}

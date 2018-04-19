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
 *
 */
function getHireSources() {
    return orm.query(
        'SELECT ' +
        '`tbu`.`trendata_bigdata_hire_source` AS `trendata_bigdata_hire_source` ' +
        'FROM ' +
        '`trendata_bigdata_user` AS `tbu` ' +
        'GROUP BY ' +
        '`tbu`.`trendata_bigdata_hire_source` ' +
        'ORDER BY ' +
        '`tbu`.`trendata_bigdata_hire_source`'
    , {
        type: ORM.QueryTypes.SELECT
    }).map(function (item) {
        return {
            label: item.trendata_bigdata_hire_source
        };
    });
}

/**
 * @param hireSources
 */
function getChartDataTemplate(hireSources, verticalAxisTypeConverter) {
    var templpate = {
        categories: [
            {
                category: []
            }
        ],
        dataset: [],
        numberSuffix: verticalAxisTypeConverter.suffix,
        paletteColors: '#33b297, #ee7774, #005075, #33b5e5, #73b234, #aa66cc, #b29234, #72eecf, #b23473'
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
    return getHireSources().then(function (hireSources) {
        return Promise.props({
            hireSources: hireSources,
            chartDataTemplate: getChartDataTemplate(hireSources, verticalAxisTypeConverter),
            timeSpanOffsets: commonChartData.makeTimeSpanOffsets(timeSpan.start, timeSpan.end)
        });
    }).then(function (commonData) {
        return Promise.map(commonData.timeSpanOffsets, function (timeSpanOffset) {
            return orm.query(
                'SELECT ' +
                '`tbu`.`trendata_bigdata_hire_source` AS `source`, ' +
                'COUNT(`tbu`.`trendata_bigdata_hire_source`) AS `count` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'WHERE ' +
                '`tbu`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ' +
                'AND ' +
                '`tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\') ' +
                ' AND ' +
                filterSql.query +
                ' AND ' +
                accessLevelSql.query +
                ' GROUP BY ' +
                '`tbu`.`trendata_bigdata_hire_source` ' +
                'ORDER BY ' +
                '`tbu`.`trendata_bigdata_hire_source`',
                {
                    type: ORM.QueryTypes.SELECT,
                    replacements: [
                        -timeSpanOffset.offsetStart,
                        -timeSpanOffset.offsetEnd
                    ].concat(filterSql.replacements).concat(accessLevelSql.replacements)
                }
            ).reduce(function (accum, item) {
                accum[item.source] = parseInt(item.count, 10);
                return accum;
            }, {});
        }).then(function (data) {
            var chartDataTemplate = commonData.chartDataTemplate;

            for (var datasetIndex = 0; datasetIndex < chartDataTemplate.dataset.length; ++datasetIndex) {
                for (var i = 0; i < data.length; ++i) {
                    chartDataTemplate.dataset[datasetIndex].data.push({
                        value: data[i][chartDataTemplate.dataset[datasetIndex].seriesname]
                    });
                }
            }

            for (var i = 0; i < commonData.timeSpanOffsets.length; ++i) {
                chartDataTemplate.categories[0].category.push({
                    label: commonData.timeSpanOffsets[i].label
                });
            }

            return chartDataTemplate;
        });
    }).then(function (data) {
        var valuesCount = data.dataset[0] ? data.dataset[0].data.length : 0;
        var total;

        for (var valuesIndex = 0; valuesIndex < valuesCount; ++valuesIndex) {
            total = _.sumBy(data.dataset, function (dataset) {
                return dataset.data[valuesIndex].value;
            });

            for (var datasetIndex = 0; datasetIndex < data.dataset.length; ++datasetIndex) {
                data.dataset[datasetIndex].data[valuesIndex].value = verticalAxisTypeConverter.convert(
                    data.dataset[datasetIndex].data[valuesIndex].value,
                    total
                );
            }
        }

        return data;
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
                commonChartData.makeUsersFilter(timeSpan, ['hired']),
                commonChartData.verticalAxisTypeConverter(requestData.data.vertical_axis_type),
                customFields
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
                available_chart_view: availableChartViews.split(','),

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
                 *
                 */
                 default_chart_view: 'total'
        });
    }).then(_resolve).catch(_reject);
}

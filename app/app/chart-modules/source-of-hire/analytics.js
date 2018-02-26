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
 *
 */
function getHireSources() {
    return orm.query(
        'SELECT ' +
        '`tbhs`.`trendata_bigdata_hire_source_id` AS `trendata_bigdata_hire_source_id`, ' +
        '`tbhs`.`trendata_bigdata_hire_source_name` AS `trendata_bigdata_hire_source_name` ' +
        'FROM ' +
        '`trendata_bigdata_user` AS `tbu` ' +
        'INNER JOIN ' +
        '`trendata_bigdata_hire_source` AS `tbhs` ' +
        'ON ' +
        '`tbu`.`trendata_bigdata_hire_source_id` = `tbhs`.`trendata_bigdata_hire_source_id` ' +
        'WHERE ' +
        '`tbu`.`trendata_user_id` = ? ' +
        'GROUP BY ' +
        '`tbu`.`trendata_bigdata_hire_source_id` ' +
        'ORDER BY ' +
        '`tbhs`.`trendata_bigdata_hire_source_name`'
    , {
        type: ORM.QueryTypes.SELECT,
        replacements: [
            req && req.parentUser && req.parentUser.trendata_user_id || 0
        ]
    }).map(function (item) {
        return {
            id: item.trendata_bigdata_hire_source_id,
            label: item.trendata_bigdata_hire_source_name
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
                '`tbhs`.`trendata_bigdata_hire_source_name` AS `source`, ' +
                'COUNT(`tbhs`.`trendata_bigdata_hire_source_name`) AS `count` ' +
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
                'INNER JOIN ' +
                '`trendata_bigdata_hire_source` AS `tbhs` ' +
                'ON ' +
                '`tbu`.`trendata_bigdata_hire_source_id` = `tbhs`.`trendata_bigdata_hire_source_id` ' +
                'WHERE ' +
                '`tbup`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ' +
                'AND ' +
                '`tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\') ' +
                ' AND ' +
                filterSql.query +
                ' AND ' +
                accessLevelSql.query +
                ' GROUP BY ' +
                '`tbhs`.`trendata_bigdata_hire_source_name` ' +
                'ORDER BY ' +
                '`tbhs`.`trendata_bigdata_hire_source_name`',
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
 * @param filterSql
 * @param accessLevelSql
 * @param verticalAxisTypeConverter
 */
function _totalChartView(filterSql, accessLevelSql, verticalAxisTypeConverter) {
    var startDate = moment().subtract(timeSpan.start, 'month');
    var monthsCount = 0;

    return getHireSources().then(function (hireSources) {
        return Promise.props({
            hireSources: hireSources,
            chartDataTemplate: getChartDataTemplate(hireSources, verticalAxisTypeConverter)
        });
    }).then(function (data) {
        return Promise.resolve(_.rangeRight(parseInt(timeSpan.end, 10) || 0, (parseInt(timeSpan.start, 10) || 0) + 1)).map(function (item) {
            return Promise.resolve().then(function () {
                var query = 'SELECT ' +
                    '* ' +
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
                    '(`tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') ' +
                    'AND ' +
                    '`tbup`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ) ' +
                    'AND ' +
                    filterSql.query +
                    ' AND ' +
                    accessLevelSql.query;

                var replacements = [
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
                            return user.trendata_bigdata_hire_source_id == source.id ? 1 : 0;
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
                        accum.dataset[i].data[resultIndex].value += item.values[i] || 0;
                    }
                } else {
                    for (var i in item.values) {
                        accum.dataset[i].data[resultIndex] = {value: item.values[i] || 0};
                    }

                    if (accum.dataset[0].data[resultIndex - 1]) {
                        monthsCount--;
                            accum.categories[0].category[resultIndex - 1] = {
                            label: moment().subtract( timeSpan.start - index + 1, 'month').format('YYYY')
                        };

                            if (verticalAxisTypeConverter.suffix === '%')for (var i in accum.dataset) {
                                accum.dataset[i].data[resultIndex - 1].value = _.round(accum.dataset[i].data[resultIndex - 1].value / monthsCount, 2);
                            }
                        monthsCount = 1;
                    }
                }

                if (index + timeSpan.end >= timeSpan.start) {
                    accum.categories[0].category[resultIndex] = {
                        label: moment().subtract(timeSpan.end, 'month').format('YYYY')
                    };

                            if (verticalAxisTypeConverter.suffix === '%')for (var i in accum.dataset) {
                                accum.dataset[i].data[resultIndex].value = _.round(accum.dataset[i].data[resultIndex].value / monthsCount, 2);

                    }
                }
            } else {
                accum.categories[0].category.push({
                    label: item.month_name
                });

                for (var i in item.values) {
                    accum.dataset[i].data.push({
                        value: +item.values[i]
                    });
                }
            }

            return accum;
        }, data.chartDataTemplate)
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
        commonChartData.makeUsersFilter(timeSpan, ['hired']),
        commonChartData.verticalAxisTypeConverter(requestData.data.vertical_axis_type)
    ]).spread(function (availableFilters, accessLevelSql, filterSql, usersFilter, verticalAxisTypeConverter) {
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
            users: commonChartData.getUsersOnPageByFilters(filterSql, accessLevelSql, requestData.data.user_pagination, selfId, usersFilter),

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

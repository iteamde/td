'use strict';

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
        user_pagination: {},
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
 * @param filterSql
 * @param accessLevelSql
 * @param verticalAxisTypeConverter
 */
function totalChartView(filterSql, accessLevelSql, verticalAxisTypeConverter) {
    var startDate = moment().subtract(timeSpan.start, 'month');
    var monthsCount = 0;

    return Promise.resolve(_.rangeRight(parseInt(timeSpan.end, 10) || 0, (parseInt(timeSpan.start, 10) || 0) + 1)).map(function (monthOffset) {
        return orm.query(
            'SELECT ' +
            'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month`, ' +
            'ROUND(DATEDIFF(CURDATE(), `tbu`.`trendata_bigdata_user_dob`) / 365.25, 2) AS `age` ' +
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
            accessLevelSql.query,
            {
                type: ORM.QueryTypes.SELECT,
                replacements: [
                    -monthOffset,
                    -monthOffset,
                    -monthOffset,
                    -monthOffset
                ].concat(filterSql.replacements).concat(accessLevelSql.replacements)
            }
        ).reduce(function (accum, item) {
            if (null === item.age) {
                return accum;
            }

            if (!accum.month_name) {
                accum.month_name = moment(item.month).format('MMMM');
            }

            if (item.age <= 25) {
                accum.less25++;
            } else if (item.age <= 35) {
                accum.less35++;
            } else if (item.age <= 45) {
                accum.less45++;
            } else if (item.age <= 55) {
                accum.less55++;
            } else if (item.age <= 65) {
                accum.less65++;
            } else {
                accum.more65++;
            }

            accum.total++;
            return accum;
        }, {
            less25: 0,
            less35: 0,
            less45: 0,
            less55: 0,
            less65: 0,
            more65: 0,
            total: 0,
            month_name: undefined
        }).then(function (data) {
            return {
                label: data.month_name,
                values: [
                    verticalAxisTypeConverter.convert(data.less25, data.total),
                    verticalAxisTypeConverter.convert(data.less35, data.total),
                    verticalAxisTypeConverter.convert(data.less45, data.total),
                    verticalAxisTypeConverter.convert(data.less55, data.total),
                    verticalAxisTypeConverter.convert(data.less65, data.total),
                    verticalAxisTypeConverter.convert(data.more65, data.total)
                ]
            };
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
                        accum.dataset[i].data[resultIndex] = {value: item.values[i]};
                    }

                    if (accum.dataset[0].data[resultIndex - 1]) {
                        monthsCount--;accum.categories[0].category[resultIndex - 1] = {
                            label: moment().subtract( timeSpan.start - index + 1, 'month').format('YYYY')
                        };

                        for (var i in accum.dataset) {
                            accum.dataset[i].data[resultIndex - 1].value = _.round(accum.dataset[i].data[resultIndex - 1].value / monthsCount, 2);
                        }
                    monthsCount = 1;
                }
                    }

                if (index + timeSpan.end >= timeSpan.start) {
                    accum.categories[0].category[resultIndex] = {
                        label: moment().subtract(timeSpan.end, 'month').format('YYYY')
                    };

                        for (var i in accum.dataset) {
                            accum.dataset[i].data[resultIndex].value = _.round(accum.dataset[i].data[resultIndex].value / monthsCount, 2);

                    }
                }
            } else {
                accum.categories[0].category.push({
                    label: item.label
                });

            for (var i = 0; i < item.values.length; ++i) {
                accum.dataset[i].data.push({
                    value: item.values[i]
                });
            }
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
                seriesname: '<25',
                data: []
            },
            {
                seriesname: '<35',
                data: []
            },
            {
                seriesname: '<45',
                data: []
            },
            {
                seriesname: '<55',
                data: []
            },
            {
                seriesname: '<65',
                data: []
            },
            {
                seriesname: '>65',
                data: []
            }
        ],
        numberSuffix: verticalAxisTypeConverter.suffix,
        paletteColors: '#33b297, #ee7774, #005075, #33b5e5, #73b234, #aa66cc, #b29234, #72eecf, #b23473'
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
 *      user_pagination: {},
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

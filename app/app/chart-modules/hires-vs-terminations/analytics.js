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
     */    data: {
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
         *
         */
        user_pagination: {
            /**
             * Integer
             */
            page_number: undefined,

            /**
             * Integer
             */
            page_size: undefined,

            /**
             * String
             */
            sort_column: undefined,

            /**
             * String
             */
            sort_type: undefined
        },

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
        user_pagination: {
            page_number: undefined,
            page_size: undefined,
            sort_column: undefined,
            sort_type: undefined
        },
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
 */
function totalChartView(filterSql, accessLevelSql, verticalAxisTypeConverter) {
    var startDate = moment().subtract(timeSpan.start, 'month');
    var monthsCount = 0;

    return Promise.resolve(_.rangeRight(parseInt(timeSpan.end, 10) || 0, (parseInt(timeSpan.start, 10) || 0) + 1)).map(function (monthOffset) {
        return orm.query(
            'SELECT ' +
            '\'hires\' AS `column`, ' +
            'COUNT(*) AS `count`, ' +
            'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
            'FROM ' +
            '`trendata_bigdata_user` AS `tbu` ' +
            'INNER JOIN ' +
            '`trendata_bigdata_user_position` AS `tbup` ' +
            'ON ' +
            '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
            'INNER JOIN ' +
            '`trendata_bigdata_gender` AS `tbg` ' +
            'ON ' +
            '`tbu`.`trendata_bigdata_gender_id` = `tbg`.`trendata_bigdata_gender_id` ' +
            'INNER JOIN ' +
            '`trendata_bigdata_user_address` AS `tbua` ' +
            'ON ' +
            '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
            'WHERE ' +
            '`tbup`.`trendata_bigdata_user_position_hire_date` IS NOT NULL ' +
            'AND ' +
            '`tbup`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ' +
            'AND ' +
            '`tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') ' +
            'AND ' +
            filterSql.query +
            ' AND ' +
            accessLevelSql.query +
            ' UNION ' +
            'SELECT ' +
            '\'terminations\' AS `column`, ' +
            'COUNT(*) AS `count`, ' +
            'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AS `month` ' +
            'FROM ' +
            '`trendata_bigdata_user` AS `tbu` ' +
            'INNER JOIN ' +
            '`trendata_bigdata_user_position` AS `tbup` ' +
            'ON ' +
            '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
            'INNER JOIN ' +
            '`trendata_bigdata_gender` AS `tbg` ' +
            'ON ' +
            '`tbu`.`trendata_bigdata_gender_id` = `tbg`.`trendata_bigdata_gender_id` ' +
            'INNER JOIN ' +
            '`trendata_bigdata_user_address` AS `tbua` ' +
            'ON ' +
            '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
            'WHERE ' +
            '`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL ' +
            'AND ' +
            '`tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ' +
            'AND ' +
            '`tbup`.`trendata_bigdata_user_position_termination_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') ' +
            'AND ' +
            filterSql.query +
            ' AND ' +
            accessLevelSql.query,
            {
                type: ORM.QueryTypes.SELECT,
                replacements: [
                        -monthOffset,
                        -monthOffset,
                        -monthOffset
                    ]
                    .concat(filterSql.replacements)
                    .concat(accessLevelSql.replacements)
                    .concat([
                        -monthOffset,
                        -monthOffset,
                        -monthOffset
                    ])
                    .concat(filterSql.replacements)
                    .concat(accessLevelSql.replacements)
                }
            ).then(function (rows) {
                return {
                    month_name: moment(rows[0].month).format('MMMM'),
                    hires: rows[0].count || 0,
                    terminations: rows[1].count || 0
                };
            });
        }).reduce(function (accum, item, index) {
            if (timeSpan.start - timeSpan.end >= 12) {
                var resultIndex = moment().subtract(timeSpan.start - index, 'month').format('YYYY') - startDate.format('YYYY');
                monthsCount++;

                if (accum.dataset[0].data[resultIndex]) {
                    accum.dataset[0].data[resultIndex].value += item.hires;
                    accum.dataset[1].data[resultIndex].value += item.terminations;
                } else {
                    accum.dataset[0].data[resultIndex] = {value: item.hires};
                    accum.dataset[1].data[resultIndex] = {value: item.terminations};

                    if (accum.dataset[0].data[resultIndex - 1]) {
                        monthsCount--;
                        accum.categories[0].category[resultIndex - 1] = {
                            label: moment().subtract(timeSpan.start - index + 1, 'month').format('YYYY')
                        };
                        accum.dataset[0].data[resultIndex - 1].value = _.round(accum.dataset[0].data[resultIndex - 1].value, 2);
                        accum.dataset[1].data[resultIndex - 1].value = _.round(accum.dataset[1].data[resultIndex - 1].value, 2);
                        monthsCount = 1;
                    }
                }

                if (index + timeSpan.end >= timeSpan.start) {
                    accum.categories[0].category[resultIndex] = {
                        label: moment().subtract(timeSpan.end, 'month').format('YYYY')
                    };
                    accum.dataset[0].data[resultIndex].value = _.round(accum.dataset[0].data[resultIndex].value, 2);
                    accum.dataset[1].data[resultIndex].value = _.round(accum.dataset[1].data[resultIndex].value, 2);
                }
            } else {
                accum.categories[0].category.push({
                    label: item.month_name
                });
                accum.dataset[0].data.push({
                    value: item.hires
                });
                accum.dataset[1].data.push({
                    value: item.terminations
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
                seriesname: 'Hires',
                data: []
            },
            {
                seriesname: 'Terminations',
                data: []
            }
        ],
        numberSuffix: verticalAxisTypeConverter.suffix
    }).then(function (data) {
        for (var i = 0; i < data.dataset[0].data.length; ++i) {
            var total = data.dataset[0].data[i].value + data.dataset[1].data[i].value;
            data.dataset[0].data[i].value = verticalAxisTypeConverter.convert(data.dataset[0].data[i].value, total);
            data.dataset[1].data[i].value = verticalAxisTypeConverter.convert(data.dataset[1].data[i].value, total);
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
 *      user_pagination: {
 *          page_number: 'Integer',
 *          page_size: 'Integer',
 *          sort_column: 'String',
 *          sort_type: 'String'
 *      },
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
        commonChartData.makeUsersFilter(timeSpan, ['hired', 'terminated']),
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

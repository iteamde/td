'use strict';

/**
 *
 */
var requestData = 'POST' === req.method ? req.body : {
    type: 'change_filters',
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
 * @param input
 */
function calculateSubChartData(input) {
    var verticalAxisTypeConverter = input.verticalAxisTypeConverter;
    var filterSql = input.filterSql;
    var accessLevelSql = input.accessLevelSql;
    var filterValues = input.values;
    var filterColumn = input.column;

    return Promise.map(filterValues, function (filterValue) {
        return orm.query(
            'SELECT ' +
            'ROUND(DATEDIFF(CURDATE(), `tbu`.`trendata_bigdata_user_dob`) / 365.25, 2) AS `age` ' +
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
            '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL 1 MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL 1 MONTH, \'%Y-%m-01\')) ' +
            'OR ' +
            '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL 1 MONTH, \'%Y-%m-01\'))) ' +
            'AND ' +
            filterColumn + ' = ? ' +
            'AND' +
            filterSql.query +
            ' AND ' +
            accessLevelSql.query
        , {
            type: ORM.QueryTypes.SELECT,
            replacements: [
                filterValue
            ].concat(filterSql.replacements).concat(accessLevelSql.replacements)
        }).reduce(function (accum, item) {
            if (null === item.age) {
                return accum;
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
            total: 0
        }).then(function (data) {
            return {
                label: filterValue,
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
    }).reduce(function (accum, item) {
        accum.categories[0].category.push({
            label: item.label
        });

        for (var i = 0; i < item.values.length; ++i) {
            accum.dataset[i].data.push({
                value: item.values[i]
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
 *      user_pagination: 'Number'
 *  }
 * }
 */
if ('change_filters' === requestData.type) {
    Promise.all([
        commonChartData.getAvailableFiltersForDrilldown(),
        commonChartData.makeAccessLevelSql(req),
        commonChartData.makeFilterSqlByFilters(requestData.data.filters),
        commonChartData.makeUsersFilter(),
        commonChartData.verticalAxisTypeConverter(requestData.data.vertical_axis_type)
    ]).spread(function (availableFilters, accessLevelSql, filterSql, usersFilter, verticalAxisTypeConverter) {
        return Promise.props({
            /**
             *
             */
            chart_data: commonChartData.getCustomFields().reduce(function (accum, item) {
                accum[item] = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_custom_fields`->>\'$.' + JSON.stringify(item).replace('\\', '\\\\').replace('\'', '\\\'') + '\'',
                    values: availableFilters[item],
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };
                return accum;
            }, {}).then(function (data) {
                data.department = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_department`',
                    values: availableFilters.department,
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data.city = {
                    filterSql: filterSql,
                    column: '`tbua`.`trendata_bigdata_user_address_city`',
                    values: availableFilters.city,
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                }

                data.division = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_division`',
                    values: availableFilters.division,
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data['cost center'] = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_cost_center`',
                    values: availableFilters['cost center'],
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data.country = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_country`',
                    values: availableFilters.country,
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data.state = {
                    filterSql: filterSql,
                    column: '`tbua`.`trendata_bigdata_user_address_state`',
                    values: availableFilters.state,
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data['job level'] = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_job_level`',
                    title: 'Job Level',
                    values: availableFilters['job level'],
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                return data;
            }).then(function (data) {
                var chartView = requestData.data.chart_view && requestData.data.chart_view.toLowerCase();

                return calculateSubChartData(data[chartView] || {
                    filterSql: filterSql,
                    column: '`tbg`.`trendata_bigdata_gender_name_token`',
                    values: availableFilters.gender,
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                });
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
            available_chart_view: commonChartData.getCustomFields().then(function (chartViews) {
                chartViews = chartViews.map(function (item) {
                    return _.chain(item).words().map(_.capitalize).value().join(' ');
                });
                return ['Gender', 'Department', 'City', 'State', 'Country', 'Division', 'Cost Center', 'Job Level'].concat(chartViews);
            }),

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
            ]
        });
    }).then(_resolve).catch(_reject);
}

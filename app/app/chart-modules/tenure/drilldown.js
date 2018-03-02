'use strict';

/**
 *
 */
var requestData = 'POST' === req.method ? req.body : {
    type: 'change_filters',
    data: {
        /**
         * String: 'Location', 'Gender', 'Department'
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
            location: undefined,

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
            location: undefined,
            gender: undefined
        },
        user_pagination: undefined
    }
}, requestData);

/**
 * @type {Function}
 */
var calculateSubChartData = function (input) {
    var verticalAxisTypeConverter = input.verticalAxisTypeConverter;
    var filterSql = input.filterSql;
    var accessLevelSql = input.accessLevelSql;
    var column = input.column;
    var values = input.values;
    var i = 0;

    return Promise.map(values, function (item) {
        return orm.query(
            'SELECT ' +
            'COUNT(*) AS `total_count` ' +
            'FROM ' +
            '`trendata_bigdata_user` AS `tbu` ' +
            'INNER JOIN ' +
            '`trendata_bigdata_user_position` AS `tbup` ' +
            'ON ' +
            '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
            'INNER JOIN ' +
            '`trendata_bigdata_gender` AS `tbg` ' +
            'ON ' +
            '`tbg`.`trendata_bigdata_gender_id` = `tbu`.`trendata_bigdata_gender_id` ' +
            'INNER JOIN ' +
            '`trendata_bigdata_user_address` AS `tbua` ' +
            'ON ' +
            '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
            'WHERE ' +
            '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW(), \'%Y-%m-01\')) ' +
            'OR ' +
            '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\'))) ' +
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
            var totalCount = rows[0].total_count;
            if (null === totalCount || 1 > totalCount) {
                return {
                    label: item,
                    values: [0, 0, 0, 0, 0, 0]
                };
            }

            return Promise.all([
                /**
                 *
                 */
                orm.query(
                    'SELECT ' +
                    'COUNT(*) AS `filtered_count` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_user_position` AS `tbup` ' +
                    'ON ' +
                    '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_gender` AS `tbg` ' +
                    'ON ' +
                    '`tbg`.`trendata_bigdata_gender_id` = `tbu`.`trendata_bigdata_gender_id` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_user_address` AS `tbua` ' +
                    'ON ' +
                    '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
                    'WHERE ' +
                    '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW(), \'%Y-%m-01\')) ' +
                    'OR ' +
                    '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\'))) ' +
                    'AND ' +
                    column + ' = ? ' +
                    'AND ' +
                    'DATEDIFF(NOW(), IFNULL (`tbu`.`trendata_bigdata_user_rehire_date`, `tbup`.`trendata_bigdata_user_position_hire_date`)) <= 365 ' +
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
                ).then(function(result) {
                    return verticalAxisTypeConverter.convert(result[0].filtered_count, totalCount);
                }),

                /**
                 *
                 */
                orm.query(
                    'SELECT ' +
                    'COUNT(*) AS `filtered_count` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_user_position` AS `tbup` ' +
                    'ON ' +
                    '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_gender` AS `tbg` ' +
                    'ON ' +
                    '`tbg`.`trendata_bigdata_gender_id` = `tbu`.`trendata_bigdata_gender_id` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_user_address` AS `tbua` ' +
                    'ON ' +
                    '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
                    'WHERE ' +
                    '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW(), \'%Y-%m-01\')) ' +
                    'OR ' +
                    '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\'))) ' +
                    'AND ' +
                    column + ' = ? ' +
                    'AND ' +
                    'DATEDIFF(NOW(), IFNULL (`tbu`.`trendata_bigdata_user_rehire_date`, `tbup`.`trendata_bigdata_user_position_hire_date`)) BETWEEN 366 AND (365 * 2)' +
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
                ).then(function(result) {
                    return verticalAxisTypeConverter.convert(result[0].filtered_count, totalCount);
                }),

                /**
                 *
                 */
                orm.query(
                    'SELECT ' +
                    'COUNT(*) AS `filtered_count` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_user_position` AS `tbup` ' +
                    'ON ' +
                    '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_gender` AS `tbg` ' +
                    'ON ' +
                    '`tbg`.`trendata_bigdata_gender_id` = `tbu`.`trendata_bigdata_gender_id` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_user_address` AS `tbua` ' +
                    'ON ' +
                    '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
                    'WHERE ' +
                    '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW(), \'%Y-%m-01\')) ' +
                    'OR ' +
                    '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\'))) ' +
                    'AND ' +
                    column + ' = ? ' +
                    'AND ' +
                    'DATEDIFF(NOW(), IFNULL (`tbu`.`trendata_bigdata_user_rehire_date`, `tbup`.`trendata_bigdata_user_position_hire_date`)) BETWEEN (365 * 2 + 1) AND (365 * 5) ' +
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
                ).then(function(result) {
                    return verticalAxisTypeConverter.convert(result[0].filtered_count, totalCount);
                }),

                /**
                 *
                 */
                orm.query(
                    'SELECT ' +
                    'COUNT(*) AS `filtered_count` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_user_position` AS `tbup` ' +
                    'ON ' +
                    '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_gender` AS `tbg` ' +
                    'ON ' +
                    '`tbg`.`trendata_bigdata_gender_id` = `tbu`.`trendata_bigdata_gender_id` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_user_address` AS `tbua` ' +
                    'ON ' +
                    '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
                    'WHERE ' +
                    '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW(), \'%Y-%m-01\')) ' +
                    'OR ' +
                    '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\'))) ' +
                    'AND ' +
                    column + ' = ? ' +
                    'AND ' +
                    'DATEDIFF(NOW(), IFNULL (`tbu`.`trendata_bigdata_user_rehire_date`, `tbup`.`trendata_bigdata_user_position_hire_date`)) BETWEEN (365 * 5 + 1) AND 3650 ' +
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
                ).then(function(result) {
                    return verticalAxisTypeConverter.convert(result[0].filtered_count, totalCount);
                }),

                /**
                 *
                 */
                orm.query(
                    'SELECT ' +
                    'COUNT(*) AS `filtered_count` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_user_position` AS `tbup` ' +
                    'ON ' +
                    '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_gender` AS `tbg` ' +
                    'ON ' +
                    '`tbg`.`trendata_bigdata_gender_id` = `tbu`.`trendata_bigdata_gender_id` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_user_address` AS `tbua` ' +
                    'ON ' +
                    '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
                    'WHERE ' +
                    '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW(), \'%Y-%m-01\')) ' +
                    'OR ' +
                    '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\'))) ' +
                    'AND ' +
                    column + ' = ? ' +
                    'AND ' +
                    'DATEDIFF(NOW(), IFNULL (`tbu`.`trendata_bigdata_user_rehire_date`, `tbup`.`trendata_bigdata_user_position_hire_date`)) BETWEEN 3651 AND (365 * 20)' +
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
                ).then(function(result) {
                    return verticalAxisTypeConverter.convert(result[0].filtered_count, totalCount);
                }),

                /**
                 *
                 */
                orm.query(
                    'SELECT ' +
                    'COUNT(*) AS `filtered_count` ' +
                    'FROM ' +
                    '`trendata_bigdata_user` AS `tbu` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_user_position` AS `tbup` ' +
                    'ON ' +
                    '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_gender` AS `tbg` ' +
                    'ON ' +
                    '`tbg`.`trendata_bigdata_gender_id` = `tbu`.`trendata_bigdata_gender_id` ' +
                    'INNER JOIN ' +
                    '`trendata_bigdata_user_address` AS `tbua` ' +
                    'ON ' +
                    '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
                    'WHERE ' +
                    '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW(), \'%Y-%m-01\')) ' +
                    'OR ' +
                    '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\'))) ' +
                    'AND ' +
                    column + ' = ? ' +
                    'AND ' +
                    'DATEDIFF(NOW(), IFNULL (`tbu`.`trendata_bigdata_user_rehire_date`, `tbup`.`trendata_bigdata_user_position_hire_date`)) > 365 * 20 ' +
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
                ).then(function(result) {
                    return verticalAxisTypeConverter.convert(result[0].filtered_count, totalCount);
                })
            ]).then(function(filteredValues) {
                return {
                    label: item,
                    values: filteredValues
                };
            })
        });
    }).reduce(function (accum, item) {
        accum.categories[0].category.push({
            label: item.label
        });

        for (var i = 0; i < item.values.length; ++i) {
            accum.dataset[i].data.push({
                value: item.values[i].toFixed(2)
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
                seriesname: '<1',
                data: []
            },
            {
                seriesname: '<2',
                data: []
            },
            {
                seriesname: '<5',
                data: []
            },
            {
                seriesname: '<10',
                data: []
            },
            {
                seriesname: '<20',
                data: []
            },
            {
                seriesname: '>20',
                data: []
            }
        ],
        numberSuffix: verticalAxisTypeConverter.suffix,
        paletteColors: '#33b297, #ee7774, #005075, #33b5e5, #73b234, #aa66cc, #b29234, #72eecf, #b23473'
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
                };

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

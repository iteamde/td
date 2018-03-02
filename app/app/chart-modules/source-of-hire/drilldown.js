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
var calculateSubChartData = function(input) {
    var verticalAxisTypeConverter = input.verticalAxisTypeConverter;
    var filterSql = input.filterSql;
    var accessLevelSql = input.accessLevelSql;
    var column = input.column;
    var values = input.values;
    var title = input.title;
    var hireSources = input.hireSources;

    var initData = {
        categories: [
            {
                category: []
            }
        ],
        dataset: [],
        numberSuffix: verticalAxisTypeConverter.suffix,
        paletteColors: '#33b297, #ee7774, #005075, #33b5e5, #73b234, #aa66cc, #b29234, #72eecf, #b23473'
    };

    _.each(hireSources, function(item) {
        initData.dataset.push({
            seriesname: item,
            data: []
        });
    });

    return Promise.map(values, function (item) {
        return orm.query(
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
            '`tbup`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() - INTERVAL 1 MONTH, \'%Y-%m-01\') ' +
            'AND ' +
            '`tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') ' +
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
            var count = null === rows[0].filtered_count ? 0 : rows[0].filtered_count;
            return Promise.props({
                label: item,
                values: Promise.mapSeries(hireSources, function (source) {
                    return count > 0 ? orm.query(
                        'SELECT ' +
                        'COUNT(*) AS `source_count` ' +
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
                        '`trendata_bigdata_hire_source` AS `tbhs` ' +
                        'ON ' +
                        '`tbu`.`trendata_bigdata_hire_source_id` = `tbhs`.`trendata_bigdata_hire_source_id` ' +
                        'INNER JOIN ' +
                        '`trendata_bigdata_user_address` AS `tbua` ' +
                        'ON ' +
                        '`tbua`.`trendata_bigdata_user_id` = `tbu`.`trendata_bigdata_user_id` ' +
                        'WHERE ' +
                        '`tbup`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() - INTERVAL 1 MONTH, \'%Y-%m-01\') ' +
                        'AND ' +
                        '`tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') ' +
                        'AND ' +
                        column + ' = ? ' +
                        'AND ' +
                        '`tbhs`.`trendata_bigdata_hire_source_name` = ? ' +
                        'AND ' +
                        filterSql.query +
                        ' AND ' +
                        accessLevelSql.query,
                        {
                            type: ORM.QueryTypes.SELECT,
                            replacements: [
                                item,
                                source
                            ].concat(filterSql.replacements).concat(accessLevelSql.replacements)
                        }
                    ).then(function(result) {
                        return verticalAxisTypeConverter.convert(result[0].source_count, count);
                    }) : 0;
                })
            });
        });
    }).reduce(function (accum, item) {
        accum.categories[0].category.push({
            label: item.label
        });

        _.each(item.values, function(value, index) {
            accum.dataset[index].data.push({
                value: value.toFixed(2)
            });
        });

        return accum;
    }, initData);
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
        orm.query(
            'SELECT ' +
            '`tbhs`.`trendata_bigdata_hire_source_name` ' +
            'FROM ' +
            '`trendata_bigdata_user` AS `tbu` ' +
            'INNER JOIN ' +
            '`trendata_bigdata_user_position` AS `tbup` ' +
            'ON ' +
            '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
            'INNER JOIN ' +
            '`trendata_bigdata_hire_source` AS `tbhs` ' +
            'ON ' +
            '`tbu`.`trendata_bigdata_hire_source_id` = `tbhs`.`trendata_bigdata_hire_source_id` ' +
            'WHERE ' +
            '`tbup`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() - INTERVAL 1 MONTH, \'%Y-%m-01\') ' +
            'AND ' +
            '`tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') ' +
            'GROUP BY ' +
            '`tbhs`.`trendata_bigdata_hire_source_name` ' +
            'ORDER BY ' + 
            '`tbhs`.`trendata_bigdata_hire_source_name`',
            {
                type: ORM.QueryTypes.SELECT
            }
        ).map(function(item) {
            return item.trendata_bigdata_hire_source_name;
        }),
        commonChartData.makeUsersFilter(null, ['hired']),
        commonChartData.verticalAxisTypeConverter(requestData.data.vertical_axis_type)
    ]).spread(function (availableFilters, accessLevelSql, filterSql, availableHireSources, usersFilter, verticalAxisTypeConverter) {
        return Promise.props({
            /**
             *
             */
            chart_data: commonChartData.getCustomFields().reduce(function (accum, item) {
                accum[item] = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_custom_fields`->>\'$.' + JSON.stringify(item).replace('\\', '\\\\').replace('\'', '\\\'') + '\'',
                    title: _.chain(item.replace(/^custom\s+/gi, '')).words().map(_.capitalize).value().join(' '),
                    values: availableFilters[item],
                    hireSources: availableHireSources,
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };
                return accum;
            }, {}).then(function (data) {
                data.department = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_department`',
                    title: 'Department',
                    values: availableFilters.department,
                    hireSources: availableHireSources,
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data.city = {
                    filterSql: filterSql,
                    column: '`tbua`.`trendata_bigdata_user_address_city`',
                    title: 'City',
                    values: availableFilters.city,
                    hireSources: availableHireSources,
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data.division = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_division`',
                    title: 'Division',
                    values: availableFilters.division,
                    hireSources: availableHireSources,
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data['cost center'] = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_cost_center`',
                    title: 'Cost Center',
                    values: availableFilters['cost center'],
                    hireSources: availableHireSources,
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data.country = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_country`',
                    title: 'Country',
                    values: availableFilters.country,
                    hireSources: availableHireSources,
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data.state = {
                    filterSql: filterSql,
                    column: '`tbua`.`trendata_bigdata_user_address_state`',
                    title: 'State',
                    values: availableFilters.state,
                    hireSources: availableHireSources,
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data['job level'] = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_job_level`',
                    title: 'Job Level',
                    values: availableFilters['job level'],
                    hireSources: availableHireSources,
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                return data;
            }).then(function (data) {
                var chartView = requestData.data.chart_view && requestData.data.chart_view.toLowerCase();

                return calculateSubChartData(data[chartView] || {
                    filterSql: filterSql,
                    column: '`tbg`.`trendata_bigdata_gender_name_token`',
                    title: 'Gender',
                    values: availableFilters.gender,
                    hireSources: availableHireSources,
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

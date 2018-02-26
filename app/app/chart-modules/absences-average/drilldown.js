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
 * @type {Function}
 */
var calculateSubChartData = function(input) {
    var verticalAxisTypeConverter = input.verticalAxisTypeConverter;
    var filterSql = input.filterSql;
    var accessLevelSql = input.accessLevelSql;
    var column = input.column;
    var values = input.values;
    var title = input.title;

    return Promise.map(values, function (item) {
        return Promise.all([
            /**
             *
             */
            orm.query(
                'SELECT ' +
                'ROUND(AVG(`tbu`.`trendata_bigdata_user_absences`), 2) AS `absences_average` ' +
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
            ).then(function (rows) {
                return null === rows[0].absences_average ? 0 : rows[0].absences_average;
            }),

            /**
             *
             */
            orm.query(
                'SELECT ' +
                'SUM(`tbu`.`trendata_bigdata_user_absences`) AS `absences_sum` ' +
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
            ).then(function (rows) {
                return null === rows[0].absences_sum ? 0 : rows[0].absences_sum;
            })
        ]).spread(function(value, total) {
            return {
                label: item,
                value: verticalAxisTypeConverter.convert(value, total)
            };
        });
    }).reduce(function (accum, item) {
        accum.categories[0].category.push({
            label: item.label
        });
        accum.dataset[0].data.push({
            value: item.value
        });
        return accum;
    }, {
        categories: [
            {
                category: []
            }
        ],
        dataset: [
            {
                seriesname: title,
                data: []
            }
        ],
        numberSuffix: verticalAxisTypeConverter.suffix,
        paletteColors: '#0075c2'
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
                    title: _.chain(item.replace(/^custom\s+/gi, '')).words().map(_.capitalize).value().join(' '),
                    values: availableFilters[item],
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
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data.city = {
                    filterSql: filterSql,
                    column: '`tbua`.`trendata_bigdata_user_address_city`',
                    title: 'City',
                    values: availableFilters.city,
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                }

                data.division = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_division`',
                    title: 'Division',
                    values: availableFilters.division,
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data['cost center'] = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_cost_center`',
                    title: 'Cost Center',
                    values: availableFilters['cost center'],
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data.country = {
                    filterSql: filterSql,
                    column: '`tbu`.`trendata_bigdata_user_country`',
                    title: 'Country',
                    values: availableFilters.country,
                    accessLevelSql: accessLevelSql,
                    verticalAxisTypeConverter: verticalAxisTypeConverter
                };

                data.state = {
                    filterSql: filterSql,
                    column: '`tbua`.`trendata_bigdata_user_address_state`',
                    title: 'State',
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
                    title: 'Gender',
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

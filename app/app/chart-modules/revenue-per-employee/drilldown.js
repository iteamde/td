'use strict';

/**
 * @return {Promise}
 */
function grossRevenueValue() {
    var FinancialDataModel = ormModels.FinancialData;
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var lastYear = currentDate.getFullYear() - 1;
    var startIndex = currentDate.getMonth();
    var endIndex = 12 + currentDate.getMonth();

    return FinancialDataModel.findAll({
        where: {
            trendata_financial_data_year: [
                currentYear,
                lastYear
            ],
            trendata_financial_data_created_by: req && req.parentUser && req.parentUser.trendata_user_id || 0
        },
        order: [
            ['trendata_financial_data_year', 'ASC']
        ]
    }).then(function (rows) {
        if (0 === rows.length) {
            return _.chain(24).range().fill(0).value();
        } else if (1 === rows.length && rows[0].trendata_financial_data_year == currentYear) {
            return Promise.resolve(rows[0]).then(function (item) {
                var data = _.map(JSON.parse(item.trendata_financial_data_json_data)[0].data, 'value');
                return _.chain(12).range().fill(0).value().concat(data);
            });
        } else if (1 === rows.length && rows[0].trendata_financial_data_year == lastYear) {
            return Promise.resolve(rows[0]).then(function (item) {
                var data = _.map(JSON.parse(item.trendata_financial_data_json_data)[0].data, 'value');
                return data.concat(_.chain(12).range().fill(0).value());
            });
        }

        return _.map(JSON.parse(rows[0].trendata_financial_data_json_data)[0].data, 'value')
            .concat(_.map(JSON.parse(rows[1].trendata_financial_data_json_data)[0].data, 'value'));
    }).then(function (values) {
        return _.map(values, Number).slice(startIndex, endIndex);
    }).then(function (data) {
        // Last month
        return data[11];
    });
}

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
    var grossRevenue = input.grossRevenue;
    var totalValue = 0;

    return Promise.map(values, function (item) {
        return orm.query(
            'SELECT ' +
            'COUNT(*) AS `count` ' +
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
            '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\')))' +
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
            totalValue += rows[0].count ? grossRevenue / rows[0].count : 0;

            return {
                label: item,
                value: rows[0].count ? grossRevenue / rows[0].count : 0
            };
        });
    }).reduce(function (accum, item) {
        accum.categories[0].category.push({
            label: item.label
        });
        accum.dataset[0].data.push({
            value: verticalAxisTypeConverter.convert(item.value, totalValue)
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
            chart_data: grossRevenueValue().then(function (grossRevenue) {
                return commonChartData.getCustomFields().reduce(function (accum, item) {
                    accum[item] = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_custom_fields`->>\'$.' + JSON.stringify(item).replace('\\', '\\\\').replace('\'', '\\\'') + '\'',
                        title: _.chain(item.replace(/^custom\s+/gi, '')).words().map(_.capitalize).value().join(' '),
                        values: availableFilters[item],
                        grossRevenue: grossRevenue,
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
                        grossRevenue: grossRevenue,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.city = {
                        filterSql: filterSql,
                        column: '`tbua`.`trendata_bigdata_user_address_city`',
                        title: 'City',
                        values: availableFilters.city,
                        grossRevenue: grossRevenue,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.division = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_division`',
                        title: 'Division',
                        values: availableFilters.division,
                        grossRevenue: grossRevenue,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data['cost center'] = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_cost_center`',
                        title: 'Cost Center',
                        values: availableFilters['cost center'],
                        grossRevenue: grossRevenue,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.country = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_country`',
                        title: 'Country',
                        values: availableFilters.country,
                        grossRevenue: grossRevenue,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data.state = {
                        filterSql: filterSql,
                        column: '`tbua`.`trendata_bigdata_user_address_state`',
                        title: 'State',
                        values: availableFilters.state,
                        grossRevenue: grossRevenue,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    };

                    data['job level'] = {
                        filterSql: filterSql,
                        column: '`tbu`.`trendata_bigdata_user_job_level`',
                        title: 'Job Level',
                        values: availableFilters['job level'],
                        grossRevenue: grossRevenue,
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
                        grossRevenue: grossRevenue,
                        accessLevelSql: accessLevelSql,
                        verticalAxisTypeConverter: verticalAxisTypeConverter
                    });
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

/**
 * @param date
 * @return {String}
 */
function getMonthNameByDate(date) {
    var monthNumber = date.split('-')[1];
    return {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December'
    }[monthNumber];
}

Promise.props({
    /**
     * Users
     */
    users: [],

    /**
     *
     */
    termAndActive: Promise.props({
        /**
         *
         */
        term: orm.query(
            'SELECT ' +
            'COUNT(*) AS `count` ' +
            'FROM ' +
            '`trendata_bigdata_user` AS `tbu` ' +
            'INNER JOIN ' +
            '`trendata_bigdata_user_position` AS `tbup` ' +
            'ON ' +
            '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
            'WHERE ' +
            '`tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() - INTERVAL 1 MONTH, \'%Y-%m-01\') ' +
            'AND ' +
            '`tbup`.`trendata_bigdata_user_position_termination_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') ' +
            'AND ' +
            '`tbu`.`trendata_user_id` = ?'
        , {
            type: ORM.QueryTypes.SELECT,
            replacements: [
                req && req.parentUser && req.parentUser.trendata_user_id || 0
            ]
        }).then(function (rows) {
            return rows[0].count;
        }),

        /**
         *
         */
        total: orm.query(
            'SELECT ' +
            'COUNT(*) AS `count` ' +
            'FROM ' +
            '`trendata_bigdata_user` AS `tbu` ' +
            'INNER JOIN ' +
            '`trendata_bigdata_user_position` AS `tbup` ' +
            'ON ' +
            '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
            'WHERE ' +
            '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL 1 MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL 1 MONTH, \'%Y-%m-01\')) ' +
            'OR ' +
            '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL 1 MONTH, \'%Y-%m-01\'))) ' +
            'AND ' +
            '`tbu`.`trendata_user_id` = ?'
        , {
            type: ORM.QueryTypes.SELECT,
            replacements: [
                req && req.parentUser && req.parentUser.trendata_user_id || 0
            ]
        }).then(function (rows) {
            return rows[0].count;
        })
    }).then(function (data) {
        return {
            "data": [
                {
                    "label": "Rest of Population",
                    "value": data.total
                },
                {
                    "label": "Termination",
                    "value": data.term
                }
            ]
        };
    }),

    /**
     * Summary tab
     */
    summary: Promise.all([
        /**
         * Avg. Salary
         */
        Promise.map(_.range(1, 7).reverse(), function (item) {
            return orm.query(
                'SELECT ' +
                'AVG(`tbu`.`trendata_bigdata_user_salary`) AS `avg`, ' +
                'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-%d\') AS `month` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'INNER JOIN ' +
                '`trendata_bigdata_user_position` AS `tbup` ' +
                'ON ' +
                '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                'WHERE ' +
                '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\')) ' +
                'OR ' +
                '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\'))) ' +
                'AND ' +
                '`tbu`.`trendata_user_id` = ?'
            , {
                type: ORM.QueryTypes.SELECT,
                replacements: [
                    -1 * item,
                    1 - item,
                    1 - item,
                    1 - item,
                    req && req.parentUser && req.parentUser.trendata_user_id || 0
                ]
            }).then(function (rows) {
                return {
                    month: rows[0].month,
                    avgSalary: parseInt(rows[0].avg) || 0
                };
            });
        }).reduce(function (accum, item) {
            accum[getMonthNameByDate(item.month)] = item.avgSalary;
            return accum;
        }, {
            name: 'Avg. Salary'
        }),

        /**
         * Number of Employees
         */
        Promise.map(_.range(1, 7).reverse(), function (item) {
            return orm.query(
                'SELECT ' +
                'COUNT(*) AS `count`, ' +
                'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-%d\') AS `month` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'INNER JOIN ' +
                '`trendata_bigdata_user_position` AS `tbup` ' +
                'ON ' +
                '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                'WHERE ' +
                '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\')) ' +
                'OR ' +
                '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\'))) ' +
                'AND ' +
                '`tbu`.`trendata_user_id` = ?'
            , {
                type: ORM.QueryTypes.SELECT,
                replacements: [
                    -1 * item,
                    1 - item,
                    1 - item,
                    1 - item,
                    req && req.parentUser && req.parentUser.trendata_user_id || 0
                ]
            }).then(function (rows) {
                return {
                    month: rows[0].month,
                    count: parseInt(rows[0].count) || 0
                };
            });
        }).reduce(function (accum, item) {
            accum[getMonthNameByDate(item.month)] = item.count;
            return accum;
        }, {
            name: 'Number of Employees'
        }),

        /**
         * Remote Employees
         */
        Promise.map(_.range(1, 7).reverse(), function (item) {
            return orm.query(
                'SELECT ' +
                'COUNT(*) AS `count`, ' +
                'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-%d\') AS `month` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'INNER JOIN ' +
                '`trendata_bigdata_user_position` AS `tbup` ' +
                'ON ' +
                '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                'WHERE ' +
                '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\')) ' +
                'OR ' +
                '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\'))) ' +
                'AND ' +
                '`tbu`.`trendata_bigdata_user_remote_employee` = \'yes\' ' +
                'AND ' +
                '`tbu`.`trendata_user_id` = ?'
            , {
                type: ORM.QueryTypes.SELECT,
                replacements: [
                    -1 * item,
                    1 - item,
                    1 - item,
                    1 - item,
                    req && req.parentUser && req.parentUser.trendata_user_id || 0
                ]
            }).then(function (rows) {
                return Promise.props({
                    month: rows[0].month,
                    value: Promise.props({
                        remote: rows[0].count,
                        total: orm.query(
                            'SELECT ' +
                            'COUNT(*) AS `count` ' +
                            'FROM ' +
                            '`trendata_bigdata_user` AS `tbu` ' +
                            'INNER JOIN ' +
                            '`trendata_bigdata_user_position` AS `tbup` ' +
                            'ON ' +
                            '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                            'WHERE ' +
                            '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\')) ' +
                            'OR ' +
                            '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\'))) ' +
                            'AND ' +
                            '`tbu`.`trendata_user_id` = ?'
                        , {
                            type: ORM.QueryTypes.SELECT,
                            replacements: [
                                1 - item,
                                1 - item,
                                1 - item,
                                req && req.parentUser && req.parentUser.trendata_user_id || 0
                            ]
                        }).then(function (rows) {
                            return rows[0].count;
                        })
                    })
                });
            });
        }).reduce(function (accum, item) {
            accum[getMonthNameByDate(item.month)] = ! item.value.total ? 0 : (Math.round((item.value.remote / item.value.total) * 10000) / 10000);
            return accum;
        }, {
            name: 'Remote Employees'
        }),

        /**
         * Total Turnover
         */
        Promise.map(_.range(1, 7).reverse(), function (item) {
            return orm.query(
                'SELECT ' +
                'COUNT(*) AS `count`, ' +
                'DATE_FORMAT(NOW() - INTERVAL ? MONTH, \'%Y-%m-%d\') AS `month` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'INNER JOIN ' +
                '`trendata_bigdata_user_position` AS `tbup` ' +
                'ON ' +
                '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                'WHERE ' +
                '`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL ' +
                'AND' +
                '`tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() - INTERVAL ? MONTH, \'%Y-%m-01\') ' +
                'AND ' +
                '`tbup`.`trendata_bigdata_user_position_termination_date` < DATE_FORMAT(NOW() - INTERVAL ? MONTH, \'%Y-%m-01\') ' +
                'AND ' +
                '`tbu`.`trendata_user_id` = ?'
            , {
                type: ORM.QueryTypes.SELECT,
                replacements: [
                    item,
                    item,
                    item - 1,
                    req && req.parentUser && req.parentUser.trendata_user_id || 0
                ]
            }).then(function (rows) {
                return Promise.props({
                    month: rows[0].month,
                    term: rows[0].count,
                    total: orm.query(
                        'SELECT ' +
                        'COUNT(*) AS `count` ' +
                        'FROM ' +
                        '`trendata_bigdata_user` AS `tbu` ' +
                        'INNER JOIN ' +
                        '`trendata_bigdata_user_position` AS `tbup` ' +
                        'ON ' +
                        '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                        'WHERE ' +
                        '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL 1 MONTH, \'%Y-%m-01\')) ' +
                        'OR ' +
                        '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW(), \'%Y-%m-01\'))) ' +
                        'AND ' +
                        '`tbu`.`trendata_user_id`=?'
                    , {
                        type: ORM.QueryTypes.SELECT,
                        replacements: [
                            req && req.parentUser && req.parentUser.trendata_user_id || 0
                        ]
                    }).then(function (rows) {
                        return rows[0].count;
                    })
                });
            });
        }).map(function (item) {
            item.total += item.term;
            return item;
        }).reduce(function (accum, item) {
            accum[getMonthNameByDate(item.month)] = ! item.total ? 0 : (Math.round((item.term / item.total) * 10000) / 10000);
            return accum;
        }, {
            name: 'Total Turnover'
        })
    ]),

    /**
     *
     */
    trendLine: 'POST' === req.method ? commonChartData.getTrendlineCurvePython(req.body) : [
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0],
        [7, 0],
        [8, 0],
        [9, 0],
        [10, 0],
        [11, 0],
        [12, 0]
    ]
}).then(_resolve).catch(_reject);

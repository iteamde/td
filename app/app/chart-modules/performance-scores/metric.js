'use strict';

commonChartData.makeAccessLevelSql(req).then(function (accessLevelSql) {
    return Promise.reduce([
        'trendata_bigdata_user_performance_percentage_this_year',
        'trendata_bigdata_user_performance_percentage_1_year_ago',
        'trendata_bigdata_user_performance_percentage_2_year_ago',
        'trendata_bigdata_user_performance_percentage_3_year_ago',
        'trendata_bigdata_user_performance_percentage_4_year_ago'
    ], function (accum, item) {
        return accum || orm.query(
            'SELECT ' +
            'COUNT(*) AS `count` ' +
            'FROM ' +
            '`trendata_bigdata_user` AS `tbu` ' +
            'WHERE ' +
            '`' + item + '` IS NOT NULL ' +
            'AND ' +
            accessLevelSql.query,
            {
                type: ORM.QueryTypes.SELECT,
                replacements: accessLevelSql.replacements
            }
        ).then(function (rows) {
            return rows[0].count ? item : null;
        });
    }, null).then(function (column) {
        if (! column) {
            return Promise.props({
                total: 1,
                data: [
                    {value: 0},
                    {value: 0},
                    {value: 0},
                    {value: 0},
                    {value: 0},
                    {value: 0}
                ]
            });
        }

        return orm.query(
            'SELECT ' +
            '`tbu`.`' + column + '` AS `performance` ' +
            'FROM ' +
            '`trendata_bigdata_user` AS `tbu` ' +
            'INNER JOIN ' +
            '`trendata_bigdata_user_position` AS `tbup` ' +
            'ON ' +
            '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
            'WHERE ' +
            '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\')) ' +
            'OR ' +
            '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\'))) ' +
            'AND ' +
            accessLevelSql.query,
            {
                type: ORM.QueryTypes.SELECT,
                replacements: [
                    -req.query.start || -1,
                    -req.query.end || -1,
                    -req.query.start || -1
                ].concat(accessLevelSql.replacements)
            }
        ).reduce(function (accum, item, index, length) {
            accum.total = length;
            var performance = parseInt(item.performance) || 0;

            if ([0, 1, 2, 3, 4, 5].indexOf(performance) === -1) {
                return accum;
            }

            accum.data[performance].value++;
            return accum;
        }, {
            total: 1,
            data: [
                {value: 0},
                {value: 0},
                {value: 0},
                {value: 0},
                {value: 0},
                {value: 0}
            ]
        });
    });
}).then(function (data) {
    return Promise.map(data.data, function (item) {
        return {
            value: Math.round((item.value / data.total) * 10000) / 100
        };
    });
}).then(function (data) {
    _resolve({
        slantLabels: '1',
        numberPrefix: '',
        numberSuffix: '%',
        numDivlines: '3',
        adjustDiv: '0',
        yAxisMinValue: '0',
        plotToolText:  "$seriesname " + "$label" + ", " + "$value" + "%",
        categories: [
            {
                category: [
                    {label: 'N/A'},
                    {label: '1'},
                    {label: '2'},
                    {label: '3'},
                    {label: '4'},
                    {label: '5'}
                ]
            }
        ],
        dataset: [
            {
                seriesname: 'Performance Score',
                data: data
            }
        ]
    });
}).catch(_reject);

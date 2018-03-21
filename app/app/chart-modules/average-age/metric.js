'use strict';

commonChartData.makeAccessLevelSql(req).then(function (accessLevelSql) {
    return orm.query(
        'SELECT ' +
        'ROUND(DATEDIFF(CURDATE(), `tbu`.`trendata_bigdata_user_dob`) / 365.25, 2) AS `age` ' +
        'FROM ' +
        '`trendata_bigdata_user` AS `tbu` ' +
        'WHERE ' +
        '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
        'OR ' +
        '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
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
    );
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
    _resolve({
        categories: [
            {
                category: [
                    {
                        label: '<25'
                    },
                    {
                        label: '<35'
                    },
                    {
                        label: '<45'
                    },
                    {
                        label: '<55'
                    },
                    {
                        label: '<65'
                    },
                    {
                        label: '>65'
                    }
                ]
            }
        ],
        dataset: [
            {
                seriesname: 'Age',
                data: [
                    {
                        value: _.round(data.less25 * 100 / data.total, 2)
                    },
                    {
                        value: _.round(data.less35 * 100 / data.total, 2)
                    },
                    {
                        value: _.round(data.less45 * 100 / data.total, 2)
                    },
                    {
                        value: _.round(data.less55 * 100 / data.total, 2)
                    },
                    {
                        value: _.round(data.less65 * 100 / data.total, 2)
                    },
                    {
                        value: _.round(data.more65 * 100 / data.total, 2)
                    }
                ]
            }
        ],
        numberPrefix: '',
        numberSuffix: '%',
        numDivlines: '3',
        adjustDiv: '0',
        yAxisMaxvalue: '4',
        slantLabels: '1',
        plotToolText:  "$seriesname " + "$label" + ", " + "$value" + "%"
    });
}).catch(_reject);

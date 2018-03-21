'use strict';

commonChartData.makeAccessLevelSql(req).then(function (accessLevelSql) {
    return orm.query(
        'SELECT ' +
        'DATEDIFF(CURDATE(), `tbu`.`trendata_bigdata_user_position_hire_date`) AS `hire_diff`, ' +
        'DATEDIFF(CURDATE(), `tbu`.`trendata_bigdata_user_rehire_date`) AS `rehire_diff` ' +
        'FROM ' +
        '`trendata_bigdata_user` AS `tbu` ' +
        'WHERE ' +
        '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\')) ' +
        'OR ' +
        '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\'))) ' +
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
}).reduce(function (accum, item, index, length) {
    if (! accum.total) {
        accum.total = length;
    }

    var diff = item.rehire_diff || item.hire_diff || null;

    if (null === diff) {
        return accum;
    }

    if (diff <= 365) {
        accum.less1++;
    } else if (diff <= 365 * 2) {
        accum.less2++;
    } else if (diff <= 365 * 5) {
        accum.less5++;
    } else if (diff <= 365 * 10) {
        accum.less10++;
    } else if (diff <= 365 * 20) {
        accum.less20++;
    } else {
        accum.more20++;
    }

    return accum;
}, {
    less1: 0,
    less2: 0,
    less5: 0,
    less10: 0,
    less20: 0,
    more20: 0,
    total: undefined
}).then(function (data) {
    _resolve({
        categories: [
            {
                category: [
                    {label: '<1'},
                    {label: '<2'},
                    {label: '<5'},
                    {label: '<10'},
                    {label: '<20'},
                    {label: '>20'}
                ]
            }
        ],
        dataset: [
            {
                seriesname: 'Tenure',
                data: [
                    {
                        value: Math.round((data.less1 / data.total) * 10000) / 100
                    },
                    {
                        value: Math.round((data.less2 / data.total) * 10000) / 100
                    },
                    {
                        value: Math.round((data.less5 / data.total) * 10000) / 100
                    },
                    {
                        value: Math.round((data.less10 / data.total) * 10000) / 100
                    },
                    {
                        value: Math.round((data.less20 / data.total) * 10000) / 100
                    },
                    {
                        value: Math.round((data.more20 / data.total) * 10000) / 100
                    }
                ]
            }
        ],
        numberPrefix: '',
        numberSuffix: '%',
        numDivlines: '3',
        adjustDiv: '0',
        slantLabels: '1',
        plotToolText:  "$seriesname " + "$label" + ", " + "$value" + "%"
    });
}).catch(_reject);

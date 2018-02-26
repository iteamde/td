'use strict';

commonChartData.makeAccessLevelSql(req).then(function (accessLevelSql) {
    return Promise.props({
        /**
         *
         */
        average_salary: orm.query(
            'SELECT ' +
            'ROUND(AVG(`tbu`.`trendata_bigdata_user_salary`), 0) as `average_salary` ' +
            'FROM `trendata_bigdata_user` AS `tbu` ' +
            'INNER JOIN ' +
            '`trendata_bigdata_user_position` AS `tbup` ' +
            'ON ' +
            '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
            'WHERE ' +
            '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\')) ' +
            'OR ' +
            '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\'))) ' +
            'AND ' +
            '`tbu`.`trendata_bigdata_user_salary` > 0 ' +
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
        ).then(function (rows) {
            return [
                {
                    value: rows[0].average_salary
                }
            ];
        }),

        /**
         *
         */
        industry_salary: orm.query(
            'SELECT ' +
            'ROUND(AVG(`tbu`.`trendata_bigdata_user_industry_salary`), 0) as `industry_salary` ' +
            'FROM `trendata_bigdata_user` AS `tbu` ' +
            'INNER JOIN ' +
            '`trendata_bigdata_user_position` AS `tbup` ' +
            'ON ' +
            '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
            'WHERE ' +
            '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\')) ' +
            'OR ' +
            '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\'))) ' +
            'AND ' +
            '`tbu`.`trendata_bigdata_user_industry_salary` > 0 ' +
            'AND ' +
            accessLevelSql.query,
            {
                type: ORM.QueryTypes.SELECT,
                replacements: [
                    -req.query.start || 0,
                    -req.query.end || 0,
                    -req.query.start || 0
                ].concat(accessLevelSql.replacements)
            }
        ).then(function (rows) {
            return [
                {
                    value: rows[0].industry_salary
                }
            ];
        })
    });
}).then(function (result) {
    _resolve({
        slantLabels: '1',
        numberPrefix: '$',
        numberSuffix: '',
        numDivlines: '3',
        adjustDiv: '0',
        categories: [
            {
                category: [
                    {label: 'Average'}
                ]
            }
        ],
        dataset: [
            {
                seriesname: 'Average Salary',
                data: result.average_salary
            },
            {
                seriesname: 'Industry Salary',
                data: result.industry_salary
            }
        ]
    });
}).catch(_reject);

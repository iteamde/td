'use strict';

commonChartData.makeAccessLevelSql(req).then(function (accessLevelSql) {
    var yearDiff = moment().format('Y') - moment().subtract(req.query.end, 'month').format('Y');
    switch (yearDiff) {
        case 4:
            var salaryColumn = '`tbu`.`trendata_bigdata_user_salary_4_year_ago`';
            break;
        case 3:
            var salaryColumn = '`tbu`.`trendata_bigdata_user_salary_3_year_ago`';
            break;
        case 2:
            var salaryColumn = '`tbu`.`trendata_bigdata_user_salary_2_year_ago`';
            break;
        case 1:
            var salaryColumn = '`tbu`.`trendata_bigdata_user_salary_1_year_ago`';
            break;
        case 0:
        default:
            var salaryColumn = '`tbu`.`trendata_bigdata_user_salary`';
    }

    return Promise.props({
        /**
         *
         */
        average_salary: orm.query(
            'SELECT ' +
            'ROUND(AVG(' + salaryColumn + '), 0) as `average_salary` ' +
            'FROM `trendata_bigdata_user` AS `tbu` ' +
            'WHERE ' +
            '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\')) ' +
            'OR ' +
            '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\'))) ' +
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
            'WHERE ' +
            '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\')) ' +
            'OR ' +
            '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\'))) ' +
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

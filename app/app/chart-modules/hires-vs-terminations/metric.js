'use strict';

commonChartData.makeAccessLevelSql(req).then(function (accessLevelSql) {
    return Promise.all([
        /**
         *
         */
        orm.query(
            'SELECT ' +
            'COUNT(*) AS `count` ' +
            'FROM ' +
            '`trendata_bigdata_user` AS `tbu` ' +
            'WHERE ' +
            '`tbu`.`trendata_bigdata_user_position_hire_date` IS NOT NULL ' +
            'AND ' +
            '`tbu`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ' +
            'AND ' +
            '`tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\') ' +
            'AND ' +
            accessLevelSql.query,
            {
                type: ORM.QueryTypes.SELECT,
                replacements: [
                    undefined === req.query.start ? -1 : -req.query.start,
                    undefined === req.query.end ? -1 : -req.query.end
                ].concat(accessLevelSql.replacements)
            }
        ).then(function (rows) {
            return rows[0].count || 0;
        }),

        /**
         *
         */
        orm.query(
            'SELECT ' +
            'COUNT(*) AS `count` ' +
            'FROM ' +
            '`trendata_bigdata_user` AS `tbu` ' +
            'WHERE ' +
            '`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL ' +
            'AND ' +
            '`tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ' +
            'AND ' +
            '`tbu`.`trendata_bigdata_user_position_termination_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\') ' +
            'AND ' +
            accessLevelSql.query,
            {
                type: ORM.QueryTypes.SELECT,
                replacements: [
                    undefined === req.query.start ? -1 : -req.query.start,
                    undefined === req.query.end ? -1 : -req.query.end
                ].concat(accessLevelSql.replacements)
            }
        ).then(function (rows) {
            return rows[0].count || 0
        })
    ]);
}).spread(function (hires, terminations) {
    return {
        categories: [
            {
                category: [
                    {
                        label: 'Total'
                    }
                ]
            }
        ],
        dataset: [
            {
                seriesname: 'Hires',
                data: [
                    {
                        value: hires
                    }
                ]
            },
            {
                seriesname: 'Terminations',
                data: [
                    {
                        value: terminations
                    }
                ]
            }
        ],
        numberPrefix: '',
        numberSuffix: ''
    };
}).then(_resolve).catch(_reject);

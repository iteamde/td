'use strict';

commonChartData.makeAccessLevelSql(req).then(function (accessLevelSql) {
    return orm.query(
        'SELECT ' +
        'ROUND(AVG(DATEDIFF(`tbup`.`trendata_bigdata_user_position_hire_date`, `tbu`.`trendata_bigdata_user_posting_date`)), 1) AS `avg` ' +
        'FROM ' +
        '`trendata_bigdata_user` AS `tbu` ' +
        'INNER JOIN ' +
        '`trendata_bigdata_user_position` AS `tbup` ' +
        'ON ' +
        '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
        'WHERE ' +
        '(`tbup`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ' +
        'AND ' +
        '`tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\')) ' +
        'AND ' +
        '`tbu`.`trendata_bigdata_user_posting_date` IS NOT NULL ' +
        'AND ' +
        accessLevelSql.query,
        {
            type: ORM.QueryTypes.SELECT,
            replacements: [
                undefined === req.query.start ? -1 : -req.query.start,
                undefined === req.query.end ? -1 : -req.query.end
            ].concat(accessLevelSql.replacements)
        }
    );
}).then(function (rows) {
    _resolve({
        data: [
            {
                label: '',
                value: null === rows[0].avg ? 'No data' : (rows[0].avg + ' days')
            }
        ]
    });
}).catch(_reject);

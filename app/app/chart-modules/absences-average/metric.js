'use strict';

commonChartData.makeAccessLevelSql(req).then(function (accessLevelSql) {
    return orm.query(
        'SELECT ' +
        'ROUND(AVG(`tbu`.`trendata_bigdata_user_absences`), 1) AS `absences_average` ' +
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
}).then(function (rows) {
    _resolve({
        data: [
            {
                label: '',
                value: null === rows[0].absences_average ? 'No data' : (rows[0].absences_average + ' days')
            }
        ]
    });
}).catch(_reject);

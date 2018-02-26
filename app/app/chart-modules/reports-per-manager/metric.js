'use strict';

commonChartData.makeAccessLevelSql(req).then(function (accessLevelSql) {
    return orm.query(
        'SELECT ' +
        'COUNT(`tbu`.`trendata_bigdata_user_manager_employee_id`) AS `count` ' +
        'FROM ' +
        '`trendata_bigdata_user` AS `tbu` ' +
        'INNER JOIN ' +
        '`trendata_bigdata_user_position` AS `tbup` ' +
        'ON ' +
        '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
        'INNER JOIN ' +
        '`trendata_bigdata_user` AS `mngr` ' +
        'ON ' +
        '`tbu`.`trendata_bigdata_user_manager_employee_id` = `mngr`.`trendata_bigdata_user_employee_id` ' +
        'WHERE ' +
        '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\')) ' +
        'OR ' +
        '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\'))) ' +
        'AND ' +
        accessLevelSql.query +
        'AND ' +
        '`tbu`.`trendata_bigdata_user_manager_employee_id` IS NOT NULL ' +
        'GROUP BY ' +
        '`tbu`.`trendata_bigdata_user_manager_employee_id`',
        {
            type: ORM.QueryTypes.SELECT,
            replacements: [
                -req.query.start || -1,
                -req.query.end || -1,
                -req.query.start || -1
            ].concat(accessLevelSql.replacements)
        }
    );
}).then(function (data) {
    _resolve({
        data: [{
            label: 'Reports',
            value: _.chain(data).meanBy('count').round(2).value()
        }],
        legendItemFontSize: '8',
    });
}).catch(_reject);

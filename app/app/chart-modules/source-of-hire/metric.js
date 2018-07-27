'use strict';

commonChartData.makeAccessLevelSql(req).then(function (accessLevelSql) {
    return orm.query(
        'SELECT ' +
        '`tbu`.`trendata_bigdata_hire_source` AS `source`, ' +
        'COUNT(`tbu`.`trendata_bigdata_hire_source`) AS `count` ' +
        'FROM ' +
        '`trendata_bigdata_user` AS `tbu` ' +
        'WHERE ' +
        '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\')) ' +
        'OR ' +
        '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\'))) ' +
        /*'`tbu`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ' +
        'AND ' +
        '`tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\') ' +*/
        'AND ' +
        accessLevelSql.query +
        ' GROUP BY ' +
        '`tbu`.`trendata_bigdata_hire_source` ' +
        'ORDER BY ' +
        '`tbu`.`trendata_bigdata_hire_source`',
        {
            type: ORM.QueryTypes.SELECT,
            replacements: [
                -req.query.start || -1,
                -req.query.end || -1,
                -req.query.start || -1
            ].concat(accessLevelSql.replacements)
        }
    );
}).map(function (item) {
    return Promise.props({
        label: item.source,
        value: item.count
    });
}).then(function (data) {
    _resolve({
        data: _.some(data, 'value') ? data : [],
        legendItemFontSize: '8',
        paletteColors: colors.getAll()
    });
}).catch(_reject);

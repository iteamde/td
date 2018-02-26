'use strict';

commonChartData.makeAccessLevelSql(req).then(function (accessLevelSql) {
    return orm.query(
        'SELECT ' +
        '`tbhs`.`trendata_bigdata_hire_source_name` AS `source`, ' +
        'COUNT(`tbhs`.`trendata_bigdata_hire_source_name`) AS `count` ' +
        'FROM ' +
        '`trendata_bigdata_user` AS `tbu` ' +
        'INNER JOIN ' +
        '`trendata_bigdata_user_position` AS `tbup` ' +
        'ON ' +
        '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
        'INNER JOIN ' +
        '`trendata_bigdata_hire_source` AS `tbhs` ' +
        'ON ' +
        '`tbu`.`trendata_bigdata_hire_source_id` = `tbhs`.`trendata_bigdata_hire_source_id` ' +
        'WHERE ' +
        '`tbup`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ' +
        'AND ' +
        '`tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\') ' +
        'AND ' +
        accessLevelSql.query +
        ' GROUP BY ' +
        '`tbhs`.`trendata_bigdata_hire_source_name` ' +
        'ORDER BY ' + 
        '`tbhs`.`trendata_bigdata_hire_source_name`',
        {
            type: ORM.QueryTypes.SELECT,
            replacements: [
                undefined === req.query.start ? -1 : -parseInt(req.query.start),
                undefined === req.query.end ? -1 : -parseInt(req.query.end)
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
        data: data,
        legendItemFontSize: '8',
        paletteColors: '#33b297, #ee7774, #005075, #33b5e5, #73b234, #aa66cc, #b29234, #72eecf, #b23473'
    });
}).catch(_reject);

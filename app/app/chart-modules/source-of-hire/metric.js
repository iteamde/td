'use strict';

commonChartData.makeAccessLevelSql(req).then(function (accessLevelSql) {
    return orm.query(
        'SELECT ' +
        '`tbu`.`trendata_bigdata_hire_source` AS `source`, ' +
        'COUNT(`tbu`.`trendata_bigdata_hire_source`) AS `count` ' +
        'FROM ' +
        '`trendata_bigdata_user` AS `tbu` ' +
        'WHERE ' +
        '`tbu`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ' +
        'AND ' +
        '`tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\') ' +
        'AND ' +
        accessLevelSql.query +
        ' GROUP BY ' +
        '`tbu`.`trendata_bigdata_hire_source` ' +
        'ORDER BY ' + 
        '`tbu`.`trendata_bigdata_hire_source`',
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

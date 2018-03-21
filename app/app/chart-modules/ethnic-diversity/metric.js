'use strict';

commonChartData.makeAccessLevelSql(req).then(function (accessLevelSql) {
    return Promise.resolve(_.rangeRight(parseInt(req.query.end || 1) || 0, (parseInt(req.query.start || 1) || 0) + 1)).map(function (item) {
        return Promise.resolve().then(function () {
            var query = 'SELECT ' +
                '`tbu`.`trendata_bigdata_user_ethnicity` AS `ethnicity`, ' +
                'COUNT(`tbu`.`trendata_bigdata_user_ethnicity`) AS `count` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'WHERE ' +
                '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                'OR ' +
                '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
                'AND ' +
                '`tbu`.`trendata_bigdata_user_ethnicity` IS NOT NULL ' +
                'AND ' +
                '`tbu`.`trendata_bigdata_user_ethnicity` != \'\' ' +
                ' AND ' +
                accessLevelSql.query +
                ' GROUP BY ' +
                '`tbu`.`trendata_bigdata_user_ethnicity`';

            var replacements = [
                -item,
                -item,
                -item
            ].concat(accessLevelSql.replacements);

            return orm.query(query, {
                type: ORM.QueryTypes.SELECT,
                replacements: replacements
            });
        });
    });
}).reduce(function (accum, item) {
    for (var i = 0; i < item.length; ++i) {
        if (accum[item[i].ethnicity]) {
            accum[item[i].ethnicity] += parseInt(item[i].count, 10);
        } else {
            accum[item[i].ethnicity] = parseInt(item[i].count, 10);
        }
    }

    return accum;
}, {}).then(function (data) {
    var result = [];

    for (var index in data) {
        result.push({
            label: index,
            value: data[index]
        });
    }

    return result;
}).then(function (data) {
    _resolve({
        data: data,
        legendItemFontSize: '8'
    });
}).catch(_reject);
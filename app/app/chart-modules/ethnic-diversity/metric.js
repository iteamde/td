'use strict';

commonChartData.makeAccessLevelSql(req).then(function (accessLevelSql) {
    return Promise.resolve(_.rangeRight(parseInt(req.query.end || 1) || 0, (parseInt(req.query.start || 1) || 0) + 1)).map(function (item) {
        return Promise.resolve().then(function () {
            var query = 'SELECT ' +
                '`tbu`.`trendata_bigdata_user_ethnicity` AS `ethnicity`, ' +
                'COUNT(`tbu`.`trendata_bigdata_user_ethnicity`) AS `count` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'INNER JOIN ' +
                '`trendata_bigdata_user_position` AS `tbup` ' +
                'ON ' +
                '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                'WHERE ' +
                '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\')) ' +
                'OR ' +
                '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (1 + ?) MONTH, \'%Y-%m-01\'))) ' +
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













/*
commonChartData.makeAccessLevelSql(req).then(function (accessLevelSql) {
    return orm.query(
        'SELECT ' +
        '`tbu`.`trendata_bigdata_user_ethnicity` AS `ethnicity`, ' +
        'COUNT(`tbu`.`trendata_bigdata_user_ethnicity`) AS `count` ' +
        'FROM ' +
        '`trendata_bigdata_user` AS `tbu` ' +
        'INNER JOIN ' +
        '`trendata_bigdata_user_position` AS `tbup` ' +
        'ON ' +
        '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
        'WHERE ' +
        '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\') AND `tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\')) ' +
        'OR ' +
        '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\'))) ' +
        'AND ' +
        accessLevelSql.query +
        'AND ' +
        '`tbu`.`trendata_bigdata_user_ethnicity` IS NOT NULL ' +
        'AND ' +
        '`tbu`.`trendata_bigdata_user_ethnicity` != \'\' ' +
        'GROUP BY ' +
        '`tbu`.`trendata_bigdata_user_ethnicity`',
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
    return {
        label: item.ethnicity,
        value: item.count
    };
}).then(function (data) {
    _resolve({
        data: data,
        legendItemFontSize: '8'
    });
}).catch(_reject);
*/

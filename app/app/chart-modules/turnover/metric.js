'use strict';

var startDate = 'DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ';
var endDate = 'LAST_DAY(NOW() + INTERVAL ? MONTH) ';
var dateFormat = 'MMMM';

commonChartData.makeAccessLevelSql(req).then(function (accessLevelSql) {
    return Promise.props({
        /**
         *
         */
        term: Promise.resolve().then(function() {
            return orm.query(
                'SELECT ' +
                'COUNT(*) AS `count` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'INNER JOIN ' +
                '`trendata_bigdata_user_position` AS `tbup` ' +
                'ON ' +
                '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                'WHERE ' +
                '`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL ' +
                'AND ' +
                '`tbup`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ' +
                'AND ' +
                '`tbup`.`trendata_bigdata_user_position_termination_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\') ' +
                'AND ' +
                accessLevelSql.query,
                {
                    type: ORM.QueryTypes.SELECT,
                    replacements: [
                        -req.query.start || -1,
                        -req.query.end || -1
                    ].concat(accessLevelSql.replacements)
                }
            ).then(function (rows) {
                return rows[0].count;
            });
        }),

        /**
         *
         */
        activeOnStart: Promise.resolve().then(function() {
            return orm.query(
                'SELECT ' +
                'COUNT(*) AS `count` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'INNER JOIN ' +
                '`trendata_bigdata_user_position` AS `tbup` ' +
                'ON ' +
                '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                'WHERE ' +
                '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL ' +
                'AND ' +
                '`tbup`.`trendata_bigdata_user_position_hire_date` < ' + startDate +
                'AND ' +
                '`tbup`.`trendata_bigdata_user_position_termination_date` >= ' + startDate + ') ' +
                'OR ' +
                '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL ' +
                'AND ' +
                '`tbup`.`trendata_bigdata_user_position_hire_date` < ' + startDate + ')) ' +
                ' AND ' +
                accessLevelSql.query,
                {
                    type: ORM.QueryTypes.SELECT,
                    replacements: [
                        -req.query.start || -1,
                        -req.query.start || -1,
                        -req.query.start || -1
                    ].concat(accessLevelSql.replacements)
                }
            ).then(function (rows) {
                return rows[0].count;
            });
        }),

        /**
         *
         */
        activeOnEnd: Promise.resolve().then(function() {
            return orm.query(
                'SELECT ' +
                'COUNT(*) AS `count` ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'INNER JOIN ' +
                '`trendata_bigdata_user_position` AS `tbup` ' +
                'ON ' +
                '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                'WHERE ' +
                '((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL ' +
                'AND ' +
                '`tbup`.`trendata_bigdata_user_position_hire_date` < ' + endDate +
                'AND ' +
                '`tbup`.`trendata_bigdata_user_position_termination_date` >= ' + endDate + ') ' +
                'OR ' +
                '(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL ' +
                'AND ' +
                '`tbup`.`trendata_bigdata_user_position_hire_date` < ' + endDate + ')) ' +
                ' AND ' +
                accessLevelSql.query,
                {
                    type: ORM.QueryTypes.SELECT,
                    replacements: [
                        -req.query.end || -1,
                        -req.query.end || -1,
                        -req.query.end || -1
                    ].concat(accessLevelSql.replacements)
                }
            ).then(function (rows) {
                return rows[0].count;
            });
        })
    });
}).then(function (data) {
    _resolve({
        decimals: '2',
        data: [
            {
                label: 'Rest of Population',
                value: (data.activeOnStart + data.activeOnEnd) / 2
            },
            {
                label: 'Termination',
                value: data.term
            }
        ]
    });
}).catch(_reject);

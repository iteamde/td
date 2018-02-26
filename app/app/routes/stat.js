var orm = require('../components/orm/orm');
var ORM = require('sequelize');
var ormModels = require('../models/orm-models');
var translation = require('../components/translation');
var templateRender = require('../components/template-render');

/**
 * @param req
 * @param res
 */
module.exports = function (req, res) {
    var UserActivityModel = ormModels.UserActivity;

    orm.query(
        'SELECT ' +
        'DATE_FORMAT(`created_at`, \'%Y-%m-%d\') AS `date` ' +
        'FROM ' +
        '`trendata_user_activity` ' +
        'GROUP BY ' +
        '`date`'
    , {
        type: ORM.QueryTypes.SELECT
    }).map(function (item) {
        return Promise.props({
            /**
             *
             */
            date: item.date,

            /**
             *
             */
            page_call_count: UserActivityModel.count({
                where: {
                    trendata_user_activity_type: 'page-call',
                    created_at: {
                        $gte: item.date + ' 00:00:00',
                        $lte: item.date + ' 23:59:59'
                    }
                }
            }),

            /**
             *
             */
            api_call_count: UserActivityModel.count({
                where: {
                    trendata_user_activity_type: 'api-call',
                    created_at: {
                        $gte: item.date + ' 00:00:00',
                        $lte: item.date + ' 23:59:59'
                    }
                }
            }),

            /**
             *
             */
            page_call_browsers: orm.query(
                'SELECT ' +
                'COUNT(*) AS `count`, ' +
                '`trendata_user_activity_browser` AS `browser` ' +
                'FROM ' +
                '`trendata_user_activity` ' +
                'WHERE ' +
                '`trendata_user_activity_type` = \'page-call\' ' +
                'AND ' +
                '`created_at` >= ? ' +
                'AND ' +
                '`created_at` <= ? ' +
                'GROUP BY ' +
                '`trendata_user_activity_browser`'
            , {
                type: ORM.QueryTypes.SELECT,
                replacements: [
                    item.date + ' 00:00:00',
                    item.date + ' 23:59:59'
                ]
            }),

            /**
             *
             */
            average_api_execution_time: orm.query(
                'SELECT ' +
                'ROUND(AVG(`trendata_user_api_execution_time`)) AS `avg` ' +
                'FROM ' +
                '`trendata_user_activity` ' +
                'WHERE ' +
                '`trendata_user_activity_type` = \'api-call\' ' +
                'AND ' +
                '`created_at` >= ? ' +
                'AND ' +
                '`created_at` <= ? ' +
                'GROUP BY ' +
                '`trendata_user_activity_browser`'
            , {
                type: ORM.QueryTypes.SELECT,
                replacements: [
                    item.date + ' 00:00:00',
                    item.date + ' 23:59:59'
                ]
            }).then(function (rows) {
                return rows[0] && rows[0].avg || 0;
            })
        });
    }).then(function (data) {
        return templateRender('stat-page.twig', {
            statList: data.reverse()
        });
    }).then(function (html) {
        res.send(html);
    }).catch(function (err) {
        res.status(500).send(err.stack);
    });
};

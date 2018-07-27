var fs = require('fs');
var path = require('path');
var ORM = require('sequelize');
var knex = require('../components/knex');
var translation = require('../components/translation');
var config = require('../../config').config;
var TagModel = require('../models/orm-models').Tag;
var MetricModel = require('../models/orm-models').Metric;
var SettingModel = require('../models/orm-models').Setting;
var LanguageModel = require('../models/orm-models').Language;
var DashboardModel = require('../models/orm-models').Dashboard;
var TranslationModel = require('../models/orm-models').Translation;
var SettingValueModel = require('../models/orm-models').SettingValue;
var cache = {};

setInterval(function () {
    cache = {};
}, 60000);

/**
 * @param req
 * @param res
 */
module.exports.getCommonData = function (req, res) {
    Promise.props({
        /**
         *
         */
        app_version: require('../../.version.json').version,

        /**
         *
         */
        is_client_logo: (function () {
            if ('is_client_logo' in cache) {
                return cache.is_client_logo;
            }
            return cache.is_client_logo = fs.existsSync(path.normalize(__dirname + '/../../public/content/images/logo/client_logo.png'));
        })(),

        /**
         *
         */
        tags: knex('trendata_tag').select('trendata_tag_id', 'trendata_tag_title'),

        /**
         *
         */
        settings: SettingModel.findAll({
            attributes: ['trendata_setting_name'],
            include: [
                {
                    model: SettingValueModel,
                    required: true
                }
            ]
        }).then(function(settings) {
            return _.reduce(settings, function(result, item) {
                result[item.trendata_setting_name] = _.map(item.SettingValues, 'trendata_setting_value');

                return result;
            }, {});
        }),

        // dashboards: DashboardModel.findAll({
        //     attributes: ['trendata_dashboard_id', 'created_at', 'trendata_dashboard_status', 'trendata_dashboard_icon', 'trendata_dashboard_title_token'],
        //     where: {
        //         trendata_dashboard_status: '1',
        //         trendata_user_id: req.user && req.user.trendata_user_id || 1
        //     }
        // }).then(function (item) {
        //     if (item.length > 0){
        //         return item;
        //     } else {
        //         return DashboardModel.findAll({
        //             where: {
        //                 trendata_dashboard_status: '1',
        //                 trendata_user_id: 0
        //             }
        //         }).then(function (item1) {
        //             return item1;
        //         });
        //     }
        // }).map(function (item) {
        //     return Promise.props({
        //         id:         item.trendata_dashboard_id,
        //         created_on: item.created_at,
        //         status:     item.trendata_dashboard_status,
        //         icon:       item.trendata_dashboard_icon,
        //         title:      TranslationModel.getTranslation(item.trendata_dashboard_title_token)
        //     });
        // }),

        /**
         *
         */
        metrics: MetricModel.findAll({
            attributes: ['trendata_metric_id', 'created_at', 'trendata_metric_status', 'trendata_metric_icon', 'trendata_metric_title_token'],
            where: {
                trendata_metric_status: '1'
            }
        }).map(function (item) {
            return Promise.props({
                id:         item.trendata_metric_id,
                //created_on: item.created_at,
                //status:     item.trendata_metric_status,
                icon:       item.trendata_metric_icon,
                title:      TranslationModel.getTranslation(item.trendata_metric_title_token)
            });
        }),

        translations: Promise.props({
            main: TranslationModel.findAll({
                include: [
                    {
                        model: LanguageModel,
                        required: true,
                        where: {
                            trendata_language_id: req.params.lngId || 1
                        }
                    }
                ]
            }),
            en: !req.params.lngId || 1 == req.params.lngId ? [] : TranslationModel.findAll({
                include: [
                    {
                        model: LanguageModel,
                        required: true,
                        where: {
                            trendata_language_id: 1
                        }
                    }
                ]
            })
        }).then(function (data) {
            return Promise.props({
                main: Promise.reduce(data.main, function (result, item) {
                    result[item.trendata_translation_token] = item.trendata_translation_text;
                    return result;
                }, {}),
                en: Promise.reduce(data.en, function (result, item) {
                    result[item.trendata_translation_token] = item.trendata_translation_text;
                    return result;
                }, {})
            });
        }).then(function(data) {
            return _.merge(data.en, data.main);
        }),

        /**
         * 'ondemand' or 'enterprise'
         */
        site_type: 'ondemand',

        /**
         * 
         */
        year: new Date().getFullYear()
    }).then(function (data) {
        res.json(data);
    }).catch(function (err) {
        res.status(500).send(err.stack);
    });
};

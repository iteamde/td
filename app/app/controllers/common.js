var fs = require('fs');
var path = require('path');
var config = require('../../config').config;
var TagModel = require('../models/orm-models').Tag;
var SettingModel = require('../models/orm-models').Setting;
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
        tags: TagModel.findAll({
            attributes: ['trendata_tag_id', 'trendata_tag_title'],
            where: {
                trendata_tag_status: '1'
            }
        }),

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

        /**
         * 'ondemand' or 'enterprise'
         */
        site_type: 'ondemand'
    }).then(function (data) {
        res.json(data);
    }).catch(function (err) {
        res.status(500).send(err.stack);
    });
};

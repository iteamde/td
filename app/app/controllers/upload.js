'use strict';

var config = require('../../config').config;
var kueriApi = require('../components/kueri-api')({
    api_url: config.kueri.api_url,
    debug: true
});
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var apiCallTrack = require('../components/api-call-track');
var dateformat = require('dateformat');
var orm = require('../components/orm/orm');
var ORM = require('sequelize');
var csvParser = require('../components/csv-parser/parser');
var ConnectorCsvModel = require('../models/orm-models').ConnectorCsv;
var HttpResponse = require('../components/http-response');
var cache = require('../components/cache');
var knex = require('../components/knex');
var alert = require('./alert');
var distance = require('google-distance');
var loggerStreamFactory = require('../components/logger-stream-factory');
var redirectChart = require('../components/redirect-charts');
distance.apiKey = 'AIzaSyDMqCW83bOviY-0PX7P2nkLAYqQIIUI3E0';

var addressFields = {
    personal: [
        'trendata_bigdata_user_address_address_personal',
        'trendata_bigdata_user_address_city_personal',
        'trendata_bigdata_user_address_state_personal',
        'trendata_bigdata_user_country_personal'
    ],
    business: [
        'trendata_bigdata_user_address_address',
        'trendata_bigdata_user_address_city',
        'trendata_bigdata_user_address_state',
        'trendata_bigdata_user_country'
    ]
};

var calculateDistance = function() {
    return orm.query('SELECT * FROM `trendata_bigdata_user`', {
        type: ORM.QueryTypes.SELECT,
    }).then(function(rows) {
        _.each(rows, function(user, i) {
            new Promise(function(resolve, reject) {
                var personalAddress = _.reduce(addressFields.personal, function(accum, field) {
                    return accum + ', ' + user[field];
                }, '');
                var businessAddress = _.reduce(addressFields.business, function(accum, field) {
                    return accum + ', ' + user[field];
                }, '');

                setTimeout(function() {
                    distance.get(
                        {
                            origin: personalAddress,
                            destination: businessAddress
                        },
                        function (err, data) {
                            if (err) return reject(err);

                            resolve(data);
                        });
                }, 10 * i);
            }).then(function(data) {
                let approximateDistance = '';
                let distanceInMiles = data.distanceValue * 0.621371;
                if (distanceInMiles < 1000)
                    approximateDistance = '< 1';
                else if (distanceInMiles < 2000)
                    approximateDistance = '< 2';
                else if (distanceInMiles < 5000)
                    approximateDistance = '< 5';
                else if (distanceInMiles < 10000)
                    approximateDistance = '< 10';
                else if (distanceInMiles < 20000)
                    approximateDistance = '< 20';
                else
                    approximateDistance = '> 20';

                orm.query('UPDATE `trendata_bigdata_user` SET `trendata_bigdata_user_distance_to_work` = ?, `trendata_bigdata_user_approximate_distance_to_work` = ? WHERE `trendata_bigdata_user_id` = ?', {
                    replacements: [distanceInMiles, approximateDistance, user.trendata_bigdata_user_id]
                });
            }).catch(function(err) {
                console.log('ERROR: ', err.message);
            });
        });
    });
};

/**
 * @param csvFileData
 * @param userId
 * @param userParentId
 * @param logger
 * @returns {*}
 */
function parseCsvFile(csvFileData, userId, userParentId, skipDistance, logger) {
    var lastCsvFile = 'last_tuff_users_csv_' + userParentId + '.csv';
    var archiveCsvFile = 'tuff_' + dateformat(new Date, 'yyyy-mm-dd_hh-MM-ss') + '.csv';

    logger.writeLine('[STEP 1 - Start]');
    return csvParser.validate(csvFileData, 'trendata_bigdata_user', true, true).then(function () {
        logger.writeLine('[STEP 1 - End]').writeLine('[STEP 2 - Start]');
        return csvParser.saveToDatabase(csvFileData, 'trendata_bigdata_user', {
            trendata_user_id: userParentId
        }, true);
    }).then(function () {
        logger.writeLine('[STEP 2 - End]').writeLine('[STEP 3 - Start]');

        if (! skipDistance) {
            logger.writeLine('[STEP 3]: Start calculateDistance()');
            calculateDistance().then(function () {
                logger.writeLine('[STEP 3]: End calculateDistance()');
            }).catch(function (err) {
                logger.writeLine('[STEP 3]: Error calculateDistance(): ' + err.message);
            });
        }

        var fullPath = path.resolve(config.connector_csv_files_dir, lastCsvFile);
        return new Promise(function (resolve, reject) {
            logger.writeLine('[STEP 3]: Start calculateDistance()');
            fs.writeFile(fullPath, csvFileData, function(err) {
                if (err) {
                    logger.writeLine('[STEP 3]: Error calculateDistance(): ' + err.message);
                    reject(err);
                } else {
                    logger.writeLine('[STEP 3]: End calculateDistance()');
                    resolve();
                }
            });
        });
    }).then(function () {
        logger.writeLine('[STEP 3 - End]').writeLine('[STEP 4 - Start]');
        return new Promise(function (resolve, reject) {
            fs.exists(path.resolve(config.connector_csv_files_archive_dir, userParentId.toString()), function (exists) {
                resolve(exists);
            });
        });
    }).then(function (exists) {
        logger.writeLine('[STEP 4 - End]').writeLine('[STEP 5 - Start]');
        if (! exists) {
            var fullPath = path.resolve(config.connector_csv_files_archive_dir, userParentId.toString());
            return new Promise(function (resolve, reject) {
                logger.writeLine('[STEP 5]: Start fs.mkdir()');
                fs.mkdir(fullPath, function(err) {
                    if (err) {
                        logger.writeLine('[STEP 5]: Error fs.mkdir(): ' + err.message);
                        reject(err);
                    } else {
                        logger.writeLine('[STEP 5]: End fs.mkdir()');
                        resolve();
                    }
                });
            });
        }
    }).then(function () {
        logger.writeLine('[STEP 5 - End]').writeLine('[STEP 6 - Start]');
        var fullPath = path.resolve(config.connector_csv_files_archive_dir, userParentId.toString(), archiveCsvFile);
        return new Promise(function (resolve, reject) {
            logger.writeLine('[STEP 6]: Start fs.writeFile()');
            fs.writeFile(fullPath, csvFileData, function(err) {
                if (err) {
                    logger.writeLine('[STEP 6]: Error fs.writeFile(): ' + err.message);
                    reject(err);
                } else {
                    logger.writeLine('[STEP 6]: End fs.writeFile()');
                    resolve();
                }
            });
        });
    }).then(function () {
        logger.writeLine('[STEP 6 - End]').writeLine('[STEP 7 - Start]');
        logger.writeLine('[STEP 7]: Start ConnectorCsvModel.findOrCreate()');
        return ConnectorCsvModel.findOrCreate({
            where: {
                trendata_user_id: userParentId,
                trendata_connector_csv_type: 'tuff',
                trendata_connector_csv_file_type: 'users'
            },
            defaults: {
                trendata_user_id: userParentId,
                trendata_connector_csv_type: 'tuff',
                trendata_connector_csv_file_type: 'users',
                trendata_connector_csv_filename: lastCsvFile
            }
        }).spread(function (instance, created) {
            logger.writeLine('[STEP 7]: End ConnectorCsvModel.findOrCreate()');
            if (! created) {
                logger.writeLine('[STEP 7]: Start instance.destroy()');
                return instance.destroy().then(function () {
                    logger.writeLine('[STEP 7]: End instance.destroy()').writeLine('[STEP 7]: Start ConnectorCsvModel.create()');
                    return ConnectorCsvModel.create({
                        trendata_user_id: userParentId,
                        trendata_connector_csv_type: 'tuff',
                        trendata_connector_csv_file_type: 'users',
                        trendata_connector_csv_filename: lastCsvFile
                    }).tap(function () {
                        logger.writeLine('[STEP 7]: End ConnectorCsvModel.create()');
                    });
                });
            }
        });
    }).then(function () {
        logger.writeLine('[STEP 7 - End]');
        kueriApi.updateDataSource();
        alert.checkAlerts(0);
        return {
            success: true,
            errors: []
        };
    }).catch(function (err) {
        logger.writeLine('Error parseCsvFile(): ' + err.message);
        return Promise.reject(err);
    });
}

module.exports = {
    /**
     * @param req
     * @param res
     */
    usersTuffCsvForm: async function(req, res) {
        var logger = loggerStreamFactory('upload-tuff', 1000 * 60 * 60);
        logger.writeLine('Start parsing CSV [usersTuffCsv()]');

        if(!req.file || 0 === req.file.size){
            logger.closeLogger('No file selected');
           return res.status(400).json({
                success: false,
                errors: [
                    'No file selected'
                ]
            });
        }

        var csvFileData = await fs.readFileAsync(req.file.path, 'utf8');
        var userId = 1;
        var userParentId = 1;
        cache.del('common-chart-data_getUsersList_' + userId);

        if (!csvFileData) {
            return res.status(400).json({
                success: false,
                errors: [
                    'No file selected'
                ]
            });
        }

        knex('trendata_setting').innerJoin(
            'trendata_setting_value',
            'trendata_setting.trendata_setting_id',
            'trendata_setting_value.trendata_setting_id'
        ).where({
            'trendata_setting.trendata_setting_name': 'api_auth_token',
            'trendata_setting_value.trendata_setting_value': req.body.token || ''
        }).limit(1).then(function (rows) {
            if (!rows.length) {
                return Promise.reject(newHttpResponse({
                    success: false,
                    errors: [
                        'Invalid token'
                    ]
                }, 400));
            }

            return parseCsvFile(csvFileData, userId, userParentId, req.body.skipDistance, logger);
        }).then( function (result) {
            if (result.success){
                return res.json(result);
            }

            res.status(400).json(result);
        }).catch(HttpResponse,function (err) {
            err.json(res);
        }).catch(function ( err){
            res.status(500).json({
                success: false,
                errors: [
                    'An error occurred while uploading the file'
                ]
            });
        });
    },

    /**
     * @param req
     * @param res
     */
    usersTuffCsv: function (req, res) {
        var logger = loggerStreamFactory('upload-tuff', 1000 * 60 * 60);
        logger.writeLine('Start parsing CSV [usersTuffCsv()]');
        var csvFileData = req.body.data;
        var filename = req.body.filename || '';
        var userId = req.parentUser.trendata_user_id;
        var userParentId = req.user.trendata_user_id;
        cache.del('common-chart-data_getUsersList_' + userId);

        if (!csvFileData) {
            logger.closeLogger('No file selected');
            return res.status(400).json({
                success: false,
                errors: [
                    'No file selected'
                ]
            });
        }

        if (!/\.csv$/gi.test(filename)) {
            logger.closeLogger('The file has an incorrect format');
            return res.status(400).json({
                success: false,
                errors: [
                     filename + ' - the file has an incorrect format'
                ]
            });
        }

        logger.writeLine('Start parseCsvFile() function');

        parseCsvFile(csvFileData, userId, userParentId, req.body.skipDistance, logger)
            .then(function (result) {
                if (result.errors && result.errors.length) {
                    throw result.errors;
                }

                logger.writeLine('parseCsvFile() success response');
                res.status(result.success ? 200 : 500).json(result);

                return redirectChart.createRedirectData().catch(console.error);
            })
            .catch(HttpResponse, function (err) {
                logger.writeLine(`parseCsvFile() HttpResponse catch, http status: ${err.status}, data: ${JSON.stringify(err.data)}`);
                err.json(res);
            })
            .catch(function (err) {
                res.status(500).json({
                    success: false,
                    errors: Array.isArray(err) && err || err.message && [err.message] || ['An error has occurred']
                });
            });
    }
};

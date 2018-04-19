var config = require('../../config').config;
var fs = require('fs');
var path = require('path');
var apiCallTrack = require('../components/api-call-track');
var dateformat = require('dateformat');
var orm = require('../components/orm/orm');
var ORM = require('sequelize');
var csvParser = require('../components/csv-parser/parser');
var ConnectorCsvModel = require('../models/orm-models').ConnectorCsv;
var HttpResponse = require('../components/http-response');
var cache = require('../components/cache');
var distance = require('google-distance');
distance.apiKey = 'AIzaSyDvrXInBinjB904T2O5TyEg0gTkDJ_1dmE';

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
    orm.query('SELECT * FROM `trendata_bigdata_user`', {
        type: ORM.QueryTypes.SELECT,
    }).then(function(rows) {
        _.each(rows, function(user) {
            new Promise(function(resolve, reject) {
                var personalAddress = _.reduce(addressFields.personal, function(accum, field) {
                    return accum + ', ' + user[field];
                }, '');
                var businessAddress = _.reduce(addressFields.business, function(accum, field) {
                    return accum + ', ' + user[field];
                }, '');

                distance.get(
                  {
                    origin: personalAddress,
                    destination: businessAddress
                  },
                  function(err, data) {
                    if (err) return reject(err);

                    resolve(data);
                });
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
                
            });
        });
    });
};

module.exports = {
    /**
     * @param req
     * @param res
     */
    usersTuffCsv: function (req, res) {
        cache.del('common-chart-data_getUsersList_' + req.user.trendata_user_id);

        apiCallTrack(function (trackApi) {
            if (! req.body.data) {
                trackApi(req);
                return res.status(400).json({
                    success: false,
                    errors: [
                        'No file selected'
                    ]
                });
            }

            var lastCsvFile = 'last_tuff_users_csv_' + req.parentUser.trendata_user_id + '.csv';
            var archiveCsvFile = 'tuff_' + dateformat(new Date, 'yyyy-mm-dd_hh-MM-ss') + '.csv';

            csvParser.validate(req.body.data, 'trendata_bigdata_user', true, true).then(function (errors) {console.log(errors.length);
                if (errors.length) {
                    throw new HttpResponse({
                        success: false,
                        errors: errors
                    }, 400);
                }
            }).then(function () {
                /*return orm.query('DELETE FROM `trendata_bigdata_user` WHERE `trendata_user_id`=?', {
                    replacements: [
                        req.parentUser.trendata_user_id
                    ]
                });*/
            }).then(function () {
                return csvParser.saveToDatabase(req.body.data, 'trendata_bigdata_user', {
                    trendata_user_id: req.parentUser.trendata_user_id
                }, true);
            }).then(function () {
                calculateDistance();
                var fullPath = path.resolve(config.connector_csv_files_dir, lastCsvFile);
                return new Promise(function (resolve, reject) {
                    fs.writeFile(fullPath, req.body.data, function(err) {
                        err ? reject(err) : resolve();
                    });
                });
            }).then(function () {
                return new Promise(function (resolve, reject) {
                    fs.exists(path.resolve(config.connector_csv_files_archive_dir, req.parentUser.trendata_user_id.toString()), function (exists) {
                        resolve(exists);
                    });
                });
            }).then(function (exists) {
                if (! exists) {
                    var fullPath = path.resolve(config.connector_csv_files_archive_dir, req.parentUser.trendata_user_id.toString());
                    return new Promise(function (resolve, reject) {
                        fs.mkdir(fullPath, function(err) {
                            err ? reject(err) : resolve();
                        });
                    });
                }
            }).then(function () {
                var fullPath = path.resolve(config.connector_csv_files_archive_dir, req.parentUser.trendata_user_id.toString(), archiveCsvFile);
                return new Promise(function (resolve, reject) {
                    fs.writeFile(fullPath, req.body.data, function(err) {
                        err ? reject(err) : resolve();
                    });
                });
            }).then(function () {
                return ConnectorCsvModel.findOrCreate({
                    where: {
                        trendata_user_id: req.parentUser.trendata_user_id,
                        trendata_connector_csv_type: 'tuff',
                        trendata_connector_csv_file_type: 'users'
                    },
                    defaults: {
                        trendata_user_id: req.parentUser.trendata_user_id,
                        trendata_connector_csv_type: 'tuff',
                        trendata_connector_csv_file_type: 'users',
                        trendata_connector_csv_filename: lastCsvFile
                    }
                }).spread(function (instance, created) {
                    if (! created) {
                        return instance.destroy().then(function () {
                            return ConnectorCsvModel.create({
                                trendata_user_id: req.parentUser.trendata_user_id,
                                trendata_connector_csv_type: 'tuff',
                                trendata_connector_csv_file_type: 'users',
                                trendata_connector_csv_filename: lastCsvFile
                            });
                        });
                    }
                });
            }).then(function () {
                trackApi(req);
                res.json({
                    success: true,
                    errors: []
                });
            }).catch(HttpResponse, function (err) {
                trackApi(req);
                err.json(res);
            }).catch(function (err) {
                trackApi(req, err);
                res.status(500).json({
                    success: false,
                    errors: [
                        err.message || err
                    ]
                });
            });
        });
    },

    /**
     * @param req
     * @param res
     */
    recruitmentTuffCsv: function (req, res) {
        apiCallTrack(function (trackApi) {
            csvParser.validate(req.body.data, 'trendata_bigdata_recruitment', true, true).then(function (errors) {
                if (errors.length) {
                    trackApi(req);
                    return res.status(400).json({
                        success: false,
                        errors: errors
                    });
                }

                return csvParser.saveToDatabase(req.body.data, 'trendata_bigdata_recruitment', {}, true).then(function () {
                    trackApi(req);
                    return res.json({
                        success: true,
                        errors: []
                    });
                });
            }).catch(function (err) {
                trackApi(req, err);
                res.status(500).json({
                    success: false,
                    errors: [
                        err.stack
                    ]
                });
            });
        });
    }
};

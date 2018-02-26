var config = require('../../config').config;
var fs = require('fs');
var path = require('path');
var apiCallTrack = require('../components/api-call-track');
var dateformat = require('dateformat');
var orm = require('../components/orm/orm');
var csvParser = require('../components/csv-parser/parser');
var ConnectorCsvModel = require('../models/orm-models').ConnectorCsv;
var HttpResponse = require('../components/http-response');
var cache = require('../components/cache');
var alert = require('./alert');

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

            csvParser.validate(req.body.data, 'trendata_bigdata_user', true, true).then(function (errors) {
                if (errors.length) {
                    throw new HttpResponse({
                        success: false,
                        errors: errors
                    }, 400);
                }
            }).then(function () {
                return orm.query('DELETE FROM `trendata_bigdata_user` WHERE `trendata_user_id`=?', {
                    replacements: [
                        req.parentUser.trendata_user_id
                    ]
                });
            }).then(function () {
                return csvParser.saveToDatabase(req.body.data, 'trendata_bigdata_user', {
                    trendata_user_id: req.parentUser.trendata_user_id
                }, true);
            }).then(function () {
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
                alert.checkAlerts(0);
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

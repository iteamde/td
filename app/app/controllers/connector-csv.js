var path = require('path');
var config = require('../../config').config;
var apiCallTrack = require('../components/api-call-track');
var SettingValue = require('../models/orm-models').SettingValue;
var ConnectorCsvModel = require('../models/orm-models').ConnectorCsv;

module.exports = {
    /**
     * @param req
     * @param res
     */
    getLastUploadedCsvFile: function (req, res) {
        apiCallTrack(function (trackApi) {
            ConnectorCsvModel.findOne({
                where: {
                    trendata_connector_csv_type: req.params.type,
                    trendata_connector_csv_file_type: req.params.file_type,
                    trendata_user_id: req.parentUser.trendata_user_id
                }
            }).then(function (file) {
                if (file) {
                    trackApi(req);
                    return res.download(
                        path.resolve(config.connector_csv_files_dir, file.trendata_connector_csv_filename),
                        'last_' + file.trendata_connector_csv_type + '_' + file.trendata_connector_csv_file_type + '.csv'
                    );
                }

                trackApi(req);
                res.status(404).send('Not found');
            }).catch(function (err) {
                trackApi(req, err);
                res.status(500).send(err.stack);
            });
        });
    },

    saveSettings: function(req, res) {
        var settingsJson = JSON.stringify(req.body);

        SettingValue.findOne({
            where: {
                trendata_setting_id: 3
            }
        }).then(function(response) {
            if (response)
                response.update({
                    trendata_setting_value: settingsJson
                }).then(function() {
                    res.send('success');
                });
            else
                SettingValue.create({
                    trendata_setting_id: 3,
                    trendata_setting_value: settingsJson
                }).then(function() {
                    res.send('success');
                });
        });
    },

    getSettings: function(req, res) {
        SettingValue.findOne({
            where: {
                trendata_setting_id: 3
            }
        }).then(function(response) {
            res.json(response && response.trendata_setting_value || null);
        });
    }
};
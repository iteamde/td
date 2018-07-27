var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var moment = require('moment');
var parser = require('babyparse');
var config = require('../../config').config;
var apiCallTrack = require('../components/api-call-track');
var commonChartData = require('../components/common-chart-data');
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
                    trendata_connector_csv_file_type: req.params.file_type
                },
                order: [
                    ['trendata_connector_csv_id', 'DESC']
                ]
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

    exportUsersToCsv: function(req, res) {
        commonChartData.getCustomFields().then(function(customFields) {
            return Promise.all([
                commonChartData.makeAccessLevelSql(req),
                commonChartData.makeFilterSqlByFilters(req.body.filters, customFields),
                commonChartData.makeUsersFilter(req.body.timeSpan, req.body.userTypes),
                customFields
            ]);
        }).spread(function(accessLevelSql, filterSql, usersFilter, customFields) {
            commonChartData.getUsersOnPageByFilters(filterSql, accessLevelSql, req.body.pagination, req.body.chartId, usersFilter, customFields, req.user.trendata_user_id, true).then(function(users) {
                var csv = parser.unparse(users);
                var file = 'users_' + new Date().getTime() + '.сsv';

                _.each(customFields, function(field) {
                    csv = csv.replace(field, field.slice(7));
                });

                fs.writeFile(path.resolve(config.connector_csv_files_dir, file), csv, function(err) {
                    if (err)
                        return res.status(500).send(err.stack);

                    return res.send(file);
                });
            });
        });
    },

    exportSummaryToCsv: function(req, res) {
        commonChartData.getCustomFields().then(function(customFields) {
            return Promise.all([
                commonChartData.makeAccessLevelSql(req),
                commonChartData.makeFilterSqlByFilters(req.body.filters, customFields),
            ])
        }).spread(function(filterSql, accessLevelSql) {
            Promise.resolve(commonChartData.getAnalyticsSummary(req, filterSql, accessLevelSql, true)).then(function(summary) {
                var data = _.map(summary, function(item) {
                    return [item.name].concat(_.chain(item)
                        .omit('name')
                        .values()
                        .value());
                });
                var fields = [''].concat(_.map(_.rangeRight(1, 7), function(i) {
                    return moment().add(-i, 'month').format('MMMM');
                }));

                var csv = parser.unparse({
                    fields: fields,
                    data: data
                });
                var file = 'summary_' + new Date().getTime() + '.csv';
                fs.writeFile(path.resolve(config.connector_csv_files_dir, file), csv, function(err) {
                    if (err)
                        return res.status(500).send(err.stack);

                    return res.send(file);
                });
            });
        });
    },

    downloadExportedFile: function(req, res) {
        var file = path.resolve(config.connector_csv_files_dir, req.params.file);
        res.download(file, req.params.downloadAs + '.csv');
        setTimeout(function() {
            fs.unlink(file, function () {});
        }, 60000)
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

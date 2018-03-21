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

/**
 * @return {Promise.<TResult>}
 */
function duplicationOfData() {
    var customFields;
    var customField;
    var customFieldsInsert;

    return Promise.all([
        knex('trendata_bigdata_custom_field').del(),
        knex('trendata_bigdata_user_total').del(),
    ]).then(function () {
        return knex('trendata_bigdata_user')
            .select([
                'trendata_bigdata_user.*',
                'trendata_bigdata_country.*',
                'trendata_bigdata_gender.*',
                'trendata_bigdata_hire_source.*',
                'trendata_bigdata_user_address.*',
                'trendata_bigdata_user_education_history.*',
                'trendata_bigdata_user_position.*',
            ])
            .innerJoin(
                'trendata_bigdata_country',
                'trendata_bigdata_user.trendata_bigdata_nationality_country_id',
                'trendata_bigdata_country.trendata_bigdata_country_id'
            )
            .innerJoin(
                'trendata_bigdata_gender',
                'trendata_bigdata_user.trendata_bigdata_gender_id',
                'trendata_bigdata_gender.trendata_bigdata_gender_id'
            )
            .innerJoin(
                'trendata_bigdata_hire_source',
                'trendata_bigdata_user.trendata_bigdata_hire_source_id',
                'trendata_bigdata_hire_source.trendata_bigdata_hire_source_id'
            )
            .innerJoin(
                'trendata_bigdata_user_address',
                'trendata_bigdata_user.trendata_bigdata_user_id',
                'trendata_bigdata_user_address.trendata_bigdata_user_id'
            )
            .innerJoin(
                'trendata_bigdata_user_education_history',
                'trendata_bigdata_user.trendata_bigdata_user_id',
                'trendata_bigdata_user_education_history.trendata_bigdata_user_education_history_id'
            )
            .innerJoin(
                'trendata_bigdata_user_position',
                'trendata_bigdata_user.trendata_bigdata_user_id',
                'trendata_bigdata_user_position.trendata_bigdata_user_position_id'
            );
    }).then(function (rows) {
        if (!rows.length) {
            return new Promise.reject(new PromiseBreak);
        }

        customFields = Object.keys(JSON.parse(rows[0].trendata_bigdata_user_custom_fields));

        if (customFields.length) {
            return knex('trendata_bigdata_custom_field')
                .insert(_.map(customFields, function (item) {
                    return {
                        trendata_bigdata_custom_field_name: item,
                        created_at: knex.raw('NOW()'),
                        updated_at: knex.raw('NOW()')
                    };
                }))
                .then(function () {
                    return knex('trendata_bigdata_custom_field');
                })
                .reduce(function (accum, item) {
                    accum[item.trendata_bigdata_custom_field_name] = item.trendata_bigdata_custom_field_id;
                    return accum;
                }, {}).then(function (_customFields) {
                    customFields = _customFields;
                    return rows;
                });
        }

        return rows;
    }).each(function (item) {
        delete item.created_at;
        delete item.updated_at;
        delete item.trendata_bigdata_country_id;
        delete item.trendata_bigdata_gender_id;
        delete item.trendata_bigdata_hire_source_id;
        delete item.trendata_bigdata_user_address_id;
        delete item.trendata_bigdata_user_education_history_id;
        delete item.trendata_bigdata_user_position_id;
        delete item.trendata_user_id;
        delete item.trendata_bigdata_gender_id;
        delete item.trendata_bigdata_nationality_country_id;
        delete item.trendata_bigdata_hire_source_id;
        customField = JSON.parse(item.trendata_bigdata_user_custom_fields);
        delete item.trendata_bigdata_user_custom_fields;
        item.created_at = knex.raw('NOW()');
        item.updated_at = knex.raw('NOW()');

        return knex('trendata_bigdata_user_total').insert(item).then(function (lastInsertId) {
            if (!Object.keys(customField).length) {
                return;
            }

            customFieldsInsert = [];

            for (var property in customField) {
                customFieldsInsert.push({
                    trendata_bigdata_custom_field_id: customFields[property],
                    trendata_bigdata_user_total_id: lastInsertId,
                    trendata_bigdata_custom_field_value_value: customField[property],
                    created_at: knex.raw('NOW()'),
                    updated_at: knex.raw('NOW()')
                });
            }

            return knex('trendata_bigdata_custom_field_value').insert(customFieldsInsert);
        });
    }).then(function () {
        var sql = 'CREATE OR REPLACE VIEW `trendata_bigdata_user_total_view` AS ';
        var join = [];
        var select = ['`trendata_bigdata_user_total`.*'];
        var selectBind = [];

        for (var _customField in customFields) {
            join.push(`
                LEFT JOIN 
                    \`trendata_bigdata_custom_field_value\` AS \`field_${join.length}\` 
                    ON 
                    (
                        \`field_${join.length}\`.\`trendata_bigdata_custom_field_id\` = ${customFields[_customField]} 
                        AND 
                        \`field_${join.length}\`.\`trendata_bigdata_user_total_id\` = \`trendata_bigdata_user_total\`.\`trendata_bigdata_user_id\`
                    )
            `);
            select.push(
                `\`field_${select.length}\`.\`trendata_bigdata_custom_field_value_value\` AS ??`
            );
            selectBind.push(_customField);
        }

        sql += ' SELECT ' + select.join(', ') + ' FROM `trendata_bigdata_user_total` ' + join.join(' ');

        console.log(sql);

        return knex.raw(sql, selectBind);
    }).catch(PromiseBreak, function () {/* ... */});
}

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

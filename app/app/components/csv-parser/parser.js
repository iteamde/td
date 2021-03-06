var fs = require('fs');
var orm = require('../orm/orm');
var ORM = require('sequelize');
var parse = require('csv-parse');
var validator = require('./validator');
var filterValues = require('./filter-values');
var strToStream = require('string-to-stream');
var separateThread = require('../separate-thread');
var knex = require('../knex');
require('../../config/global');

/**
 * @type {Function}
 */
/*var parserThread = separateThread(function (input, resolve, reject) {
    var fs = require('fs');
    var parse = require('csv-parse');
    var strToStream = require('string-to-stream');
    var stream = input.asString ? strToStream(input.fileOrData) : fs.createReadStream(input.fileOrData);

    stream.pipe(parse({
        delimiter: ','
    }, function (err, data) {
        if (err) {
            return reject(err);
        }

        if (!data.length) {
            return reject(new Error('Empty file'));
        }

        resolve({
            header: data.shift(),
            data: data
        });
    }));
});*/

function parserThread(input) {
    return new Promise(function (resolve, reject) {
        var fs = require('fs');
        var parse = require('csv-parse');
        var strToStream = require('string-to-stream');
        var stream = input.asString ? strToStream(input.fileOrData) : fs.createReadStream(input.fileOrData);

        stream.pipe(parse({
            delimiter: ','
        }, function (err, data) {
            if (err) {
                return reject(err);
            }

            if (!data.length) {
                return reject(new Error('Empty file'));
            }

            resolve({
                header: data.shift(),
                data: data
            });
        }));
    });
}

/**
 * @param inputFile
 * @returns {*}
 */
module.exports = {
    /**
     * @param fileOrData
     * @param asString
     * @return {*}
     */
    createStream: function (fileOrData, asString) {
        return asString ? strToStream(fileOrData) : fs.createReadStream(fileOrData);
    },

    /**
     * Parse CSV
     * @param fileOrData
     * @param asString
     * @return {*}
     */
    parse: function (fileOrData, asString) {
        return parserThread({
            fileOrData: fileOrData,
            asString: asString
        }).then(function (data) {
            return Promise.reduce(data.header, function (accum, item, index) {
                if (/^custom\s+/gi.test(item.trim())) {
                    accum.customFields.push(index);
                } else {
                    accum.staticFields.push(index);
                }

                return accum;
            }, {
                staticFields: [],
                customFields: []
            }).then(function (dataMapping) {
                dataMapping = dataMapping.staticFields.concat(dataMapping.customFields);

                return Promise.props({
                    /**
                     *
                     */
                    header: Promise.map(dataMapping, function (item) {
                        return data.header[item];
                    }),

                    /**
                     *
                     */
                    data: Promise.map(data.data, function (item) {
                        return Promise.map(dataMapping, function (_item) {
                            return item[_item];
                        });
                    })
                });
            });
        });
    },

    /**
     * @param fileOrData
     * @param parserName
     * @param asString
     * @param ignoreFilters
     * @return {Promise}
     */
    validate: function (fileOrData, parserName, asString, ignoreFilters) {
        return this.parse(fileOrData, asString).then(function (csv) {
            return validator.validate(csv, parserName, ignoreFilters);
        });
    },

    /**
     * @param fileOrData
     * @param parserName
     * @param customData
     * @param asString
     * @param ignoreFilters
     * @return {*}
     */
    saveToDatabase: function (fileOrData, parserName, customData, asString, ignoreFilters) {
        customData = customData || {};
        var _this = this;

        return this.parse(fileOrData, asString).then(function (csv) {
            return new Promise(function (resolve, reject) {
                validator.findParserByHeader(csv.header, parserName)
                    .then(function (_parser){
                        _parser = _parser.data;
                        if (! _parser) {
                            return reject(new Error('CSV file has an incorrect header. Please check CSV file header and try again.'));
                        }
                        return resolve(_parser);
                    });
            }).then(function (_parser) {
                return Promise.all([
                    filterValues(csv, _parser, ignoreFilters),
                    _parser
                ])
            });
        }).spread(function (csv, _parser) {
            var table = _parser.dataMapping.table;
            var columns = _parser.dataMapping.columns;

            if (!csv.data.length) {
                return Promise.resolve([]);
            }

            var mapping = [];
            var arrayOfHeaderColumns = [];
            var customFields;

            for (var columnName in columns) {
                arrayOfHeaderColumns.push(columns[columnName]);
                mapping.push(csv.header.indexOf(columnName));
            }

            return orm.transaction(function (t) {
                return Promise.each([
                    'SET foreign_key_checks = 0',
                    'TRUNCATE TABLE `trendata_bigdata_custom_field_value`',
                    //'TRUNCATE TABLE `trendata_bigdata_custom_field`',
                    'TRUNCATE TABLE `trendata_bigdata_user`'
                ], function (item) {
                    return orm.query(item, {
                        transaction: t
                    });
                }).then(function () {
                    return orm.query('SELECT * FROM `trendata_bigdata_custom_field`', {
                        type: ORM.QueryTypes.SELECT,
                        transaction: t
                    }).then(function (rows) {
                        return Promise.each(rows, function (item) {
                            return orm.query(knex.raw('ALTER TABLE `trendata_bigdata_user` DROP ??', [
                                item.trendata_bigdata_custom_field_name + ''
                            ]).toString(), {
                                transaction: t
                            });
                        });
                    }).then(function () {
                        return orm.query('TRUNCATE TABLE `trendata_bigdata_custom_field`', {
                            transaction: t
                        });
                    });
                }).then(function () {
                    var _customColumns = Object.keys(_this.getCustomFieldsByOneRow(csv.data[0], csv.header));

                    return Promise.each(_customColumns, function (item) {
                        return orm.query(knex.raw('ALTER TABLE `trendata_bigdata_user` ADD ?? varchar(255) COLLATE \'utf8_unicode_ci\' NULL', [
                            item
                        ]).toString(), {
                            transaction: t
                        }).then(function () {
                            return orm.query(knex.raw('ALTER TABLE `trendata_bigdata_user` ADD INDEX ?? (??)', [
                                item,
                                item
                            ]).toString(), {
                                transaction: t
                            });
                        });
                    }).then(function () {
                        return _customColumns;
                    });
                }).then(function (customFields) {
                    return Promise.each(customFields, function (item) {
                        return orm.query('INSERT INTO `trendata_bigdata_custom_field` (`trendata_bigdata_custom_field_name`) VALUES (?)', {
                            replacements: [item],
                            transaction: t
                        });
                    });
                }).then(function () {
                    return orm.query('SELECT * FROM `trendata_bigdata_custom_field`', {
                        type: ORM.QueryTypes.SELECT,
                        transaction: t
                    });
                }).reduce(function (accum, item) {
                    accum[item.trendata_bigdata_custom_field_name] = item.trendata_bigdata_custom_field_id;
                    return accum;
                }, {}).then(function (_customFields) {
                    customFields = _customFields;

                    /*var sql = 'CREATE OR REPLACE VIEW `trendata_bigdata_user` AS ';
                    var join = [];
                    var select = ['`trendata_bigdata_user`.*'];
                    var selectBind = [];

                    for (var _customField in customFields) {
                        join.push(`
                            LEFT JOIN
                                \`trendata_bigdata_custom_field_value\` AS \`field_${join.length}\`
                                ON
                                (
                                    \`field_${join.length}\`.\`trendata_bigdata_custom_field_id\` = ${customFields[_customField]}
                                    AND
                                    \`field_${join.length}\`.\`trendata_bigdata_user_id\` = \`trendata_bigdata_user\`.\`trendata_bigdata_user_id\`
                                )
                        `);
                        select.push(
                            `\`field_${select.length - 1}\`.\`trendata_bigdata_custom_field_value_value\` AS ??`
                        );
                        selectBind.push(_customField);
                    }

                    sql += ' SELECT ' + select.join(', ') + ' FROM `trendata_bigdata_user` ' + join.join(' ');

                    console.log(sql);

                    return orm.query(knex.raw(sql, selectBind).toString(), {
                        transaction: t
                    });*/
                }).then(function () {
                    return Promise.map(csv.data, function (item) {
                        var result = {};

                        for (var i = 0; i < arrayOfHeaderColumns.length; ++i) {
                            result[arrayOfHeaderColumns[i]] = item[mapping[i]]
                        }


                        return Object.assign({}, result, _this.getCustomFieldsByOneRow(item, csv.header));
                    });
                }).then(function (result) {
                    return _.chunk(result, 1000);
                }).map(function (item) {
                    return orm.query(knex(table).insert(item).toString(), {
                        transaction: t
                    });
                }).then(function (data) {
                    /*return orm.query(knex(table).min('trendata_bigdata_user_id AS value').toString(), {
                        type: ORM.QueryTypes.SELECT,
                        transaction: t
                    }).then(function (rows) {
                        return rows[0].value;
                    });*/
                }).then(function (min) {
                    /*return Promise.reduce(csv.data, function (accum, item, index) {
                        var _customFields = _this.getCustomFieldsByOneRow(item, csv.header);

                        for (var _customField in _customFields) {
                            accum.push({
                                trendata_bigdata_custom_field_id: customFields[_customField],
                                trendata_bigdata_user_id: index + min,
                                trendata_bigdata_custom_field_value_value: _customFields[_customField]
                            });
                        }

                        return accum;
                    }, []).then(function (result) {
                        return _.chunk(result, 1000);
                    }).map(function (item) {
                        return orm.query(knex('trendata_bigdata_custom_field_value').insert(item).toString(), {
                            transaction: t
                        });
                    });*/
                });
            });
        });
    },

    /**
     * @param row
     * @param header
     * @param dataMapping
     * @param foreignKeyValue
     * @param t
     * @param customData
     * @param isRecursiveCall
     * @param customFields
     * @return {*}
     */
    saveOneRowToDatabase: function (row, header, dataMapping, foreignKeyValue, t, customData, isRecursiveCall, customFields) {
        var _this = this;

        var table       = dataMapping.table;
        var foreignKey  = dataMapping.foreignKey;
        var columns     = dataMapping.columns;
        var acceptedCustomFields = dataMapping.acceptedCustomFields;

        var insertColumns = [];
        var insertValues  = [];
        var insertPlaceholders = [];

        for (var customColumn in customData) {
            if (acceptedCustomFields.indexOf(customColumn) === -1) {
                continue;
            }

            if (customColumn.indexOf(':') === 0) {
                insertColumns.push('`' + customColumn.substr(1) + '`');
                insertValues.push(customData[customColumn]);
                insertPlaceholders.push('?');
            } else {
                insertColumns.push('`' + customColumn + '`');
                insertPlaceholders.push(customData[customColumn]);
            }
        }

        if (foreignKey && foreignKeyValue) {
            insertColumns.push('`' + foreignKey + '`');
            insertValues.push(foreignKeyValue);
            insertPlaceholders.push('?');
        }

        for (var headerName in columns) {
            insertColumns.push('`' + columns[headerName] + '`');
            insertValues.push(this.getValueByHeaderName(headerName, header, row));
            insertPlaceholders.push('?');
        }

        isRecursiveCall = true;

        var query = 'INSERT INTO `' + table + '` (' + insertColumns.join(',') + ') VALUES (' + insertPlaceholders.join(',') + ')';

        return orm.query(query, {
            replacements: insertValues,
            //transaction: t
        }).spread(function (metadata) {
            if (Object.keys(customFields).length) {
                var _customFields = _this.getCustomFieldsByOneRow(row, header);
                var query = 'INSERT INTO `trendata_bigdata_custom_field_value` (`trendata_bigdata_custom_field_id`, `trendata_bigdata_user_id`, `trendata_bigdata_custom_field_value_value`) VALUES ';
                var queryReplace = [];
                var insertrs = [];

                for (var field in customFields) {
                    insertrs.push('(?, ?, ?)');
                    queryReplace.push(
                        customFields[field],
                        metadata.insertId,
                        _customFields[field] || null
                    );
                }

                query += insertrs.join(', ');

                return orm.query(query, {
                    replacements: queryReplace,
                    //transaction: t
                });
            }
        });
    },

    /**
     * @param row
     * @param header
     */
    getCustomFieldsByOneRow: function (row, header) {
        return _.reduce(header, function (accum, headerName, index) {
            headerName = headerName.replace(/\s+/g, ' ').toLowerCase();

            if (headerName.length > 64) {
                return accum;
            }

            if (/^custom\s+?.+?$/g.test(headerName)) {
                accum[headerName] = row[index];
            }

            return accum;
        }, {});
    },

    /**
     * @param key
     * @param header
     * @param row
     */
    getValueByHeaderName: function (key, header, row) {
        var index = header.indexOf(key);
        return index > -1 ? row[index] : null;
    }
};

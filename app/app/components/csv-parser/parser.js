var fs = require('fs');
var orm = require('../orm/orm');
var parse = require('csv-parse');
var validator = require('./validator');
var filterValues = require('./filter-values');
var strToStream = require('string-to-stream');
var separateThread = require('../separate-thread');
require('../../config/global');

/**
 * @type {Function}
 */
var parserThread = separateThread(function (input, resolve, reject) {
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
            return orm.transaction(function (t) {
                if (typeof _parser.customSave === 'function') {
                    return Promise.each(csv.data, function (row) {
                        return _parser.customSave(row, csv.header, orm, t);
                    });
                }

                return Promise.each(csv.data, function (row) {
                    return _this.saveOneRowToDatabase(row, csv.header, _parser.dataMapping, null, t, customData, false);
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
     * @return {Function|*}
     */
    saveOneRowToDatabase: function (row, header, dataMapping, foreignKeyValue, t, customData, isRecursiveCall) {
        var _this = this;

        var table       = dataMapping.table;
        var foreignKey  = dataMapping.foreignKey;
        var columns     = dataMapping.columns;
        var slave       = dataMapping.slave;
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

        if (! isRecursiveCall) {
            isRecursiveCall = true;
            var customFields = _this.getCustomFieldsByOneRow(row, header);

            if (Object.keys(customFields).length > 20) {
                return Promise.reject(new Error('CSV file must contain no more than 20 custom fields'));
            }

            insertColumns.push('`trendata_bigdata_user_custom_fields`');
            insertPlaceholders.push('JSON_MERGE(?, \'{}\')');
            insertValues.push(JSON.stringify(customFields));
        }

        var query = 'INSERT INTO `' + table + '` (' + insertColumns.join(',') + ') VALUES (' + insertPlaceholders.join(',') + ')';

        return orm.query(query, {
            replacements: insertValues,
            transaction: t
        }).spread(function (metadata) {
            if (slave.length) {
                return Promise.each(slave, function (item) {
                    return _this.saveOneRowToDatabase(row, header, item, metadata.insertId, t, customData, isRecursiveCall);
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

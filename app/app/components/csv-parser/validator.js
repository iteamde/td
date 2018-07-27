var _ = require('lodash');
var filterValues = require('./filter-values');
var TranslationModel = require('./../../models/orm-models').Translation;
var SettingValue = require('./../../models/orm-models').SettingValue;

module.exports = {
    /**
     * 
     */
    defaultRules: {
        /**
         * @param value
         * @param column
         * @param line
         * @param errors
         */
        not_empty: function (value, column, line, errors) {
            if ('' == value) {
                errors.push(this.createMessage(line, column, value, 'Empty value'));
            }
        },

        /**
         * @param value
         * @param column
         * @param line
         * @param errors
         * @returns {*}
         */
        email: function (value, column, line, errors) {
            if ('' != value && ! /^[^\@]+\@[^\@]+\.[^\@]{2,}$/g.test(value)) {
                errors.push(this.createMessage(line, column, value, 'Email format is incorrect'));
            }
        },

        /**
         * @param value
         * @param column
         * @param line
         * @param errors
         */
        number: function (value, column, line, errors) {
            if ('' != value && ! /^(\d*\.)?\d+$/g.test(value)) {
                errors.push(this.createMessage(line, column, value, 'Number format is incorrect'));
            }
        },

        /**
         * @param value
         * @param column
         * @param line
         * @param errors
         */
        bool_0_or_1: function (value, column, line, errors) {
            if ('' != value && ! /^[01]{1}$/g.test(value)) {
                errors.push(this.createMessage(line, column, value, 'Must contain 0 or 1'));
            }
        },

        /**
         * @param value
         * @param column
         * @param line
         * @param errors
         */
        date: function (value, column, line, errors) {
            if ('' != value &&  ! /^\d{4}-\d{1,2}-\d{1,2}$/g.test(value)) {
                errors.push(this.createMessage(line, column, value, 'Date has an incorrect format. Correct format: YYYY-MM-DD'));
            }
        },

        /**
         * @param value
         * @param column
         * @param line
         * @param errors
         */
        date2: function (value, column, line, errors) {
            if ('' != value) {
                if (! /^\d{1,2}-\d{1,2}-(\d{2}|\d{4})$|^\d{1,2}\/\d{1,2}\/(\d{2}|\d{4})$/g.test(value)) {
                    errors.push(this.createMessage(line, column, value, 'Date has an incorrect format. Correct format: MM-DD-YY(YY) or MM/DD/YY(YY)'));
                    return;
                }
                var match = value.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/) || value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
                var month = parseInt(match[1]);
                var day = parseInt(match[2]);

                if (month < 1 || month > 12) {
                    errors.push(this.createMessage(line, column, value, 'Month has an incorrect value'));
                }

                if (day < 1 || day > 31) {
                    errors.push(this.createMessage(line, column, value, 'Day has an incorrect value'));
                }
            }
        },

        /**
         * @param value
         * @param column
         * @param line
         * @param errors
         */
        zip_code: function (value, column, line, errors) {

        }
    },

    /**
     *
     */
    parserList: require('./parser-list'),

    /**
     * @param csv = {
     *  header: ['column1', 'column3', 'column3'],
     *  data: [
     *      ['val1', 'val2', 'val3'],
     *      ['val4', 'val5', 'val6'],
     *      ['val7', 'val8', 'val9']
     *  ]
     * }
     * @param parserName
     * @param ignoreFilters
     */
    validate: function (csv, parserName, ignoreFilters) {
        var errors = [];
        var _this = this;

        return new Promise(function (resolve, reject) {
            _this.findParserByHeader(csv.header, parserName)
                .then(function (_parser){
                    if (_parser.err.length) {
                        return reject(_parser.err);
                    }
                    _parser = _parser.data;
                    if (! _parser) {
                        return reject(new Error('CSV file has an incorrect header. Please check CSV file header and try again.'));
                    }

                    filterValues(csv, _parser, ignoreFilters).then(function (csv) {
                        return Promise.each(csv.data, function (row, rowIndex) {
                            return Promise.each(row, function (value, valueIndex) {
                                return _this.validateOneItem(_parser, value, csv.header[valueIndex], rowIndex + 1, errors);
                            });
                        }).then(function () {
                            if (errors.length) {
                                return reject(errors);
                            }

                            resolve();
                        });
                    });
                });
        });
    },

    /**
     * @param parser
     * @param value
     * @param column
     * @param line
     * @param errors
     */
    validateOneItem: function (parser, value, column, line, errors) {
        var rules = parser.rules;
        var _this = this;

        if (undefined === rules[column]) {
            // errors.push(_this.createMessage(line, column, value, 'Rule not found'));
            return;
        }

        rules = rules[column];
        return Promise.each(rules, function (rule) {
            if (typeof rule === 'string') {
                if (undefined === _this.defaultRules[rule]) {
                    errors.push(_this.createMessage(line, column, value, 'Default rule "' + rule + '" not found'));
                    return;
                }
                rule = _this.defaultRules[rule];
            }

            if (typeof rule !== 'function') {
                errors.push(_this.createMessage(line, column, value, 'Rule is not a function [' + (typeof rule) + ']'));
                return;
            }

            return rule.bind(_this)(value, column, line, errors);
        });
    },

    /**
     * @param header
     * @param parserName
     * @returns {*}
     */
    findParserByHeader: function (header, parserName) {
        var _this = this;
        
        header = _.map(header, function (item) {
            return typeof item === 'string' ? item.trim() : item;
        });

        header = _.filter(header, function (item) {
            return !/^Custom\s+.+$/gi.test(item);
        });

        header = JSON.stringify(header);

        var parserListData = this.parserList[0];
        var flag = false;
        var errorObj = [];
        var parserListTmp = this.parserList;
        return SettingValue.findOne({
            where: {
                trendata_setting_id: 3
            }
        }).then(function(parserSettings) {
            if (parserSettings) {
                parserListData.header = _.chain(JSON.parse(parserSettings.trendata_setting_value))
                    .filter('use')
                    .map('title')
                    .value();
            }

            return new Promise.each(parserListTmp, function (item, index) {
                if (
                    header === JSON.stringify(item.header) &&
                    (parserName === item.name || (!parserName))
                ) {
                    parserListData = item;
                }
            }).then(function () {
                if (parserListData) {
                    var headerArr = JSON.parse(header);
                    var missedColumns = _.difference(parserListData.header, headerArr);
                    var redundantColumns = _.difference(headerArr, parserListData.header);

                    if (missedColumns.length) {
                        errorObj.push('Missed columns: ' + missedColumns.join(', '));
                    }

                    if (redundantColumns.length) {
                        errorObj.push('Redundant columns: ' + redundantColumns.join(', '));
                    }

                    if (errorObj.length) {
                        return {'err': errorObj, 'data': parserListData};
                    }

                    return new Promise.each(parserListData.header, function (item, index) {
                        if (!headerArr[index] || item.toLowerCase() !== headerArr[index].toLowerCase()) {
                            flag = true;
                            for (var i = 0; i < headerArr.length; i++) {
                                if (item.toLowerCase() === headerArr[i].toLowerCase()) {
                                    flag = false;
                                    errorObj.push('"' + item + '" found at ' + _this.numerToXLColumn(i) + " instead of " + _this.numerToXLColumn(index));
                                    break;
                                }
                            }
                            if (flag) {
                                errorObj.push('"' + item + '" is missing from column ' + _this.numerToXLColumn(index));
                            }
                        }
                    }).then(function () {
                        if (parserSettings) {
                            parserListData.header = _.chain(JSON.parse(parserSettings.trendata_setting_value))
                                .filter('use')
                                .map('name')
                                .value();
                        }

                        return {'err' : errorObj, 'data' : parserListData};
                    })
                } else {
                    return {'err' : [], 'data' : parserListData};
                }
            }).catch(function (err) {
                return {'err' : [], 'data' : false};
            });
        });
    },

    numerToXLColumn: function (number)
    {
        return number>25? String.fromCharCode(64 + number/26) + String.fromCharCode(65 + number%26) : String.fromCharCode(65 + number%26);
    },

    /**
     * @param line
     * @param column
     * @param value
     * @param msg
     * @returns {string}
     */
    createMessage: function (line, column, value, msg) {
        return '[' + line + ']' + column + ': ' + msg;
    }
};

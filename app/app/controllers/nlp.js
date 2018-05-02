'use strict';

var kueriAuthToken;
var dataSourceId = 11;
var pregMatchAll = require('../components/preg-match-all');
var HttpResponse = require('../components/http-response');
var PromiseBreak = require('../components/promise-break');
var config = require('../../config').config;
var apiCallTrack = require('../components/api-call-track');
var ormModels = require('../models/orm-models');
var orm = require('../components/orm/orm');
var ORM = require('sequelize');
var uuidv4 = require('uuid/v4');
var knex = require('../components/knex');
var kueri = require('../components/kueri-api')({
    api_url: config.kueri.api_url,
    debug: true
});

setInterval(function () {
    kueriAuthToken = undefined;
}, 60000);

/**
 * @type {Object}
 */
var nlpQueryAliases = {
    'salary_1_year_ago': 'salary 1 year ago',
    'salary_2_year_ago': 'salary 2 year ago',
    'salary_3_year_ago': 'salary 3 year ago',
    'salary_4_year_ago': 'salary 4 year ago'
};

/**
 * @param {string} text
 * @return {string}
 */
function convertTextForNlp(text) {
    text = (text + '').trim().replace(/\s+/g, ' ').toLowerCase();

    for (var property in nlpQueryAliases) {
        text = text.replace(nlpQueryAliases[property], property);
    }

    return text;
}

/**
 * @param {string} text
 * @return {string}
 */
function convertTextFromNlp(text) {
    text = (text + '').trim().replace(/\s+/g, ' ').toLowerCase();

    for (var property in nlpQueryAliases) {
        text = text.replace(property, nlpQueryAliases[property]);
    }

    return text;
}

/**
 * @param {Object} item
 * @return {Object}
 */
var convertRow = function(item) {
    var result = {};
    var newIndex;

    for (var index in item) {
        newIndex = index.toLowerCase().replace('pq_as_trendata_bigdata_', '').replace('pq_as_', '').replace(/\_/g, ' ');

        if (/\s+link$/g.test(newIndex)) {
            continue;
        }

        if (/^count[0-9]+$/ig.test(newIndex)) {
            newIndex = 'count';
        }

        if (/^address\s{1}/ig.test(newIndex)) {
            newIndex = newIndex.replace('address ', '');
        }

        if (/^position\s{1}/ig.test(newIndex)) {
            newIndex = newIndex.replace('position ', '');
        }

        result[newIndex] = item[index];
    }

    return result;
};

/**
 * @param {string} text
 * @return {string}
 */
function escapeHtml(text) {
    if (typeof text !== 'string') {
        return text;
    }

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * @return {Promise}
 */
function _getAuthToken() {
    return kueriAuthToken ? Promise.resolve(kueriAuthToken) : orm.query(
        'SELECT ' +
        '* ' +
        'FROM ' +
        '`trendata_setting` AS `ts` ' +
        'INNER JOIN ' +
        '`trendata_setting_value` AS `tsv` ' +
        'ON ' +
        '`ts`.`trendata_setting_id` = `tsv`.`trendata_setting_id` ' +
        'WHERE ' +
        '`ts`.`trendata_setting_name` IN (?)',
        {
            type: ORM.QueryTypes.SELECT,
            replacements: [
                ['kueri_username', 'kueri_password']
            ]
        }
    ).reduce(function (accum, item) {
        accum[item.trendata_setting_name] = item.trendata_setting_value;
        return accum;
    }, {}).then(function (kueriConfig) {
        return kueri.serverLogin({
            login: kueriConfig.kueri_username,
            password: kueriConfig.kueri_password
        });
    }).then(function (data) {
        return 'ok' === data.status ? data.token : Promise.reject(new Error(data.error.message));
    }).then(function (token) {
        return kueriAuthToken = token;
    });
}

/**
 * @param text
 * @return {Promise.<TResult>}
 */
function serverGetKeywordSuggestions(text) {
    return _getAuthToken().then(function (authToken) {
        return kueri.serverGetKeywordSuggestions({
            auth_token: authToken,
            database_id: dataSourceId,
            query: escapeHtml(text),
            query_id: 1
        });
    }).then(function (data) {
        return 'ok' === data.status ? (data.suggests || []) : Promise.reject(new Error(data.error.message));
    });
}

/**
 * @param data
 * @param kueriLog
 * @return {Promise}
 */
function nlpChartDataTable(data, kueriLog) {
    var chartData = {
        "chart": {
            "caption": kueriLog.trendata_kueri_log_text,
            "captionFontSize": "14",
            "subcaptionFontSize": "14",
            "subcaptionFontBold": "0",
            "paletteColors": "#f8bd19,#008ee4,#33bdda,#e44a00,#6baa01,#583e78",
            "bgcolor": "#ffffff",
            "showBorder": "0",
            "showShadow": "0",
            "showCanvasBorder": "0",
            "usePlotGradientColor": "0",
            "legendBorderAlpha": "0",
            "legendShadow": "0",
            "showAxisLines": "0",
            "showAlternateHGridColor": "0",
            "divlineThickness": "1",
            "divLineIsDashed": "1",
            "divLineDashLen": "1",
            "divLineGapLen": "1",
            "xAxisName": "",
            "showValues": "0",
            "captionAlignment": "center",
            "theme": "tren"
        },
        "categories": [
            {
                "category": []
            }
        ],
        "dataset": [
            {
                "seriesname": "Cost Per Hire",
                "data": []
            },
            {
                "seriesname": "Industry Salary",
                "data": []
            },
            {
                "seriesname": "Salary",
                "data": []
            },
            {
                "seriesname": "Salary 1 Year Ago",
                "data": []
            },
            {
                "seriesname": "Salary 2 Year Ago",
                "data": []
            },
            {
                "seriesname": "Salary 3 Year Ago",
                "data": []
            },
            {
                "seriesname": "Salary 4 Year Ago",
                "data": []
            },
            {
                "seriesname": "Performance Percentage This Year",
                "data": []
            },
            {
                "seriesname": "Performance Percentage 1 Year Ago",
                "data": []
            },
            {
                "seriesname": "Performance Percentage 2 Year Ago",
                "data": []
            },
            {
                "seriesname": "Performance Percentage 3 Year Ago",
                "data": []
            },
            {
                "seriesname": "Performance Percentage 4 Year Ago",
                "data": []
            },
            {
                "seriesname": "Absences",
                "data": []
            },
            {
                "seriesname": "Benefit Costs",
                "data": []
            },
            {
                "seriesname": "Benefit Costs 1 Year Ago",
                "data": []
            },
            {
                "seriesname": "Benefit Costs 2 Year Ago",
                "data": []
            },
            {
                "seriesname": "Benefit Costs 3 Year Ago",
                "data": []
            },
            {
                "seriesname": "Benefit Costs 4 Year Ago",
                "data": []
            }
        ]
    };

    return Promise.each(data, function (row) {
        chartData.categories[0].category.push({
            label: row['first name'] + '',
            stepSkipped: false,
            appliedSmartLabel: true
        });

        chartData.dataset[0].data.push({
            value: Number(row['cost per hire']) || 0
        });

        chartData.dataset[1].data.push({
            value: Number(row['industry salary']) || 0
        });

        chartData.dataset[2].data.push({
            value: Number(row['salary']) || 0
        });

        chartData.dataset[3].data.push({
            value: Number(row['salary 1 year ago']) || 0
        });

        chartData.dataset[4].data.push({
            value: Number(row['salary 2 year ago']) || 0
        });

        chartData.dataset[5].data.push({
            value: Number(row['salary 3 year ago']) || 0
        });

        chartData.dataset[6].data.push({
            value: Number(row['salary 4 year ago']) || 0
        });

        chartData.dataset[7].data.push({
            value: Number(row['performance percentage this year']) || 0
        });

        chartData.dataset[8].data.push({
            value: Number(row['performance percentage 1 year ago']) || 0
        });

        chartData.dataset[9].data.push({
            value: Number(row['performance percentage 2 year ago']) || 0
        });

        chartData.dataset[10].data.push({
            value: Number(row['performance percentage 3 year ago']) || 0
        });

        chartData.dataset[11].data.push({
            value: Number(row['performance percentage 4 year ago']) || 0
        });

        chartData.dataset[12].data.push({
            value: Number(row['absences']) || 0
        });

        chartData.dataset[13].data.push({
            value: Number(row['benefit costs']) || 0
        });

        chartData.dataset[14].data.push({
            value: Number(row['benefit costs 1 year ago']) || 0
        });

        chartData.dataset[15].data.push({
            value: Number(row['benefit costs 2 year ago']) || 0
        });

        chartData.dataset[16].data.push({
            value: Number(row['benefit costs 3 year ago']) || 0
        });

        chartData.dataset[17].data.push({
            value: Number(row['benefit costs 4 year ago']) || 0
        });
    }).then(function () {
        return chartData;
    });
}

/**
 * @param data
 * @param kueriLog
 * @return {Promise}
 */
function nlpChartDataGroup(data, kueriLog) {
    var labelIndex;

    for (var index in data[0]) {
        if ('count' !== index) {
            labelIndex = index;
            break;
        }
    }

    var chartData = {
        "chart": {
            "caption": kueriLog.trendata_kueri_log_text,
            "captionFontSize": "14",
            "subcaptionFontSize": "14",
            "subcaptionFontBold": "0",
            "paletteColors": "#f8bd19,#008ee4,#33bdda,#e44a00,#6baa01,#583e78",
            "bgcolor": "#ffffff",
            "showBorder": "0",
            "showShadow": "0",
            "showCanvasBorder": "0",
            "usePlotGradientColor": "0",
            "legendBorderAlpha": "0",
            "legendShadow": "0",
            "showAxisLines": "0",
            "showAlternateHGridColor": "0",
            "divlineThickness": "1",
            "divLineIsDashed": "1",
            "divLineDashLen": "1",
            "divLineGapLen": "1",
            "xAxisName": "",
            "showValues": "0",
            "captionAlignment": "center",
            "theme": "tren"
        },
        "categories": [
            {
                "category": []
            }
        ],
        "dataset": [
            {
                "seriesname": "",
                "data": []
            }
        ]
    };

    chartData.dataset[0].seriesname = kueriLog.trendata_kueri_log_sql.split('FROM')[0].toUpperCase();

    if (chartData.dataset[0].seriesname.indexOf('AVG(') > -1) {
        chartData.dataset[0].seriesname = 'Avg';
    } else if (chartData.dataset[0].seriesname.indexOf('SUM(') > -1) {
        chartData.dataset[0].seriesname = 'Sum';
    } else if (chartData.dataset[0].seriesname.indexOf('MIN(') > -1) {
        chartData.dataset[0].seriesname = 'Min';
    } else if (chartData.dataset[0].seriesname.indexOf('MAX(') > -1) {
        chartData.dataset[0].seriesname = 'Max';
    } else {
        chartData.dataset[0].seriesname = 'Count';
    }

    return Promise.each(data, function (row) {
        chartData.categories[0].category.push({
            label: row[labelIndex] + '',
            stepSkipped: false,
            appliedSmartLabel: true
        });

        chartData.dataset[0].data.push({
            value: row.count
        });
    }).then(function () {
        return chartData;
    });
}

/**
 * @param data
 * @param kueriLog
 * @return {Promise.<TResult>}
 */
function nlpChartDataCount(data, kueriLog) {
    var label = kueriLog.trendata_kueri_log_sql.split('FROM')[0].toUpperCase();

    if (label.indexOf('AVG(') > -1) {
        label = 'Avg';
    } else if (label.indexOf('SUM(') > -1) {
        label = 'Sum';
    } else if (label.indexOf('MIN(') > -1) {
        label = 'Min';
    } else if (label.indexOf('MAX(') > -1) {
        label = 'Max';
    } else {
        label = 'Count';
    }

    return Promise.resolve({
        "chart": {
            "caption": kueriLog.trendata_kueri_log_text,
            "numberprefix": "",
            "rotatevalues": "0",
            "palettecolors": "#0075c2",
            "captionAlignment": "center",
            "theme": "tren"
        },
        "data": [
            {
                "label": label,
                "value": data[0].count
            }
        ]
    });
}

/**
 * @param {Array} rows
 * @return {string}
 */
function getChartTypeByNlpResult(rows) {
    if (!rows.length) {
        return 'count';
    }

    var item = convertRow(rows[0]);

    if (Object.keys(item).length === 1 && 1 === rows.length) {
        return 'count';
    } else if (Object.keys(item).length === 2 && 'count' in item) {
        return 'group';
    }

    return 'table';
}



module.exports = {
    /**
     * @param req
     * @param res
     */
    autocomplete: function (req, res) {
        serverGetKeywordSuggestions(req.body.text).map(function (item) {
            return convertTextFromNlp(item.c);
        }).then(function (suggests) {
            res.json(suggests);
        }).catch(function (err) {
            res.status(500).send(err.stack);
        });
    },

    /**
     * @param req
     * @param res
     */
    request: function (req, res) {
        var availableMestricStyles = [];
        var loggingText;
        var token = uuidv4();
        var limit = parseInt(req.body.page_size, 10) || 25;
        var offset = (parseInt(req.body.page_number, 10) || 1) - 1;
        offset = offset < 0 ? 0 : offset;

        serverGetKeywordSuggestions(convertTextForNlp(req.body.text)).reduce(function (accum, item) {
            if ('' !== accum) {
                return accum;
            }

            return 'QUERY' === item.t ? item.c : '';
        }, '').then(function (text) {
            return '' === text ? req.body.text : text;
        }).then(function (text) {
            loggingText = text;
            
            return _getAuthToken().then(function (authToken) {
                return kueri.serverGetSql({
                    auth_token: authToken,
                    database_id: dataSourceId,
                    query: escapeHtml(convertTextForNlp(text))
                });
            });
        }).then(function (data) {
            if ('ok' !== data.status && 3 === (data.error && data.error.id)) {
                return Promise.reject(new HttpResponse({
                    result: [],
                    total_count: 0
                }, 200));
            }

            if ('ok' !== data.status) {
                return Promise.reject(new HttpResponse(data.error.message, 400));
            }

            return data.queries[0].q.replace(/nlpdatasource\./g, '');
        }).then(function (sql) {
            return knex('trendata_kueri_log').insert({
                trendata_kueri_log_token: token,
                trendata_kueri_log_text: req.body.text,
                trendata_kueri_log_sql: sql,
                created_at: knex.raw('NOW()'),
                updated_at: knex.raw('NOW()')
            }).then(function () {
                return {
                    token: token,
                    sql: sql
                };
            });
        }).then(function (data) {
            var functionLabel = data.sql.split('FROM')[0].toUpperCase();

            if (functionLabel.indexOf('AVG(') > -1) {
                functionLabel = 'avg';
            } else if (functionLabel.indexOf('SUM(') > -1) {
                functionLabel = 'sum';
            } else if (functionLabel.indexOf('MIN(') > -1) {
                functionLabel = 'min';
            } else if (functionLabel.indexOf('MAX(') > -1) {
                functionLabel = 'max';
            } else {
                functionLabel = 'count';
            }

            return orm.transaction(function (t) {
                return orm.query('SET sql_mode=(SELECT REPLACE(@@sql_mode,\'ONLY_FULL_GROUP_BY\',\'\'))', {
                    transaction: t,
                }).then(function () {
                    var resultType;

                    return orm.query('SELECT `table`.* FROM (' + data.sql + ') AS `table` LIMIT ? OFFSET ?', {
                        type: ORM.QueryTypes.SELECT,
                        transaction: t,
                        replacements: [
                            limit,
                            offset * limit
                        ]
                    }).map(convertRow).map(function (item) {
                        var result = {};

                        for (var index in item) {
                            result[index.replace('user ', '')] = item[index];
                        }

                        return result;
                    }).tap(function (rows) {
                        availableMestricStyles = {
                            count: ['single-number', 'bar'],
                            group: ['donut', 'bar'],
                            table: ['bar']
                        }[resultType = getChartTypeByNlpResult(rows)];
                    }).map(function (item) {
                        if ('count' !== functionLabel && 'count' in item) {
                            item[functionLabel] = item.count;
                            delete item.count;
                        }

                        return item;
                    }).then(function (rows) {
                        if ('count' !== resultType) {
                            return rows;
                        }

                        var sql = data.sql.split(/FROM/gi)[1].replace(/GROUP\s+BY\s+NULL/gi, '');
                        sql = 'SELECT * FROM ' + sql;

                        return orm.query('SELECT `table`.* FROM (' + sql + ') AS `table` LIMIT ? OFFSET ?', {
                            type: ORM.QueryTypes.SELECT,
                            transaction: t,
                            replacements: [
                                limit,
                                offset * limit
                            ]
                        }).map(convertRow).map(function (item) {
                            var result = {};

                            for (var index in item) {
                                result[index.replace('user ', '')] = item[index];
                            }

                            return result;
                        }).map(function (item) {
                            if ('count' !== functionLabel && 'count' in item) {
                                item[functionLabel] = item.count;
                                delete item.count;
                            }

                            return item;
                        });
                    }).then(function (result) {
                        return Promise.props({
                            /**
                             *
                             */
                            result: result,

                            /**
                             *
                             */
                            total_count: (function () {
                                var sql = data.sql;

                                if ('count' === resultType) {
                                    sql = data.sql.split(/FROM|GROUP/gi)[1];
                                    sql = 'SELECT * FROM ' + sql;
                                }

                                return orm.query('SELECT COUNT(*) AS `count` FROM (' + sql + ') AS `table`', {
                                    type: ORM.QueryTypes.SELECT,
                                    transaction: t
                                }).then(function (rows) {
                                    return Number(rows[0].count) || 0;
                                });
                            })(),

                            /**
                             *
                             */
                            token: data.token,

                            /**
                             *
                             */
                            available_mestric_styles: availableMestricStyles
                        });
                    });
                });
            });
        }).then(function (result) {
            kueri.nlpQueryLogging(loggingText).catch(function (err) {
                console.error('[' + new Date().toLocaleString() + ']: ============================== nlpQueryLogging() error ==============================');
                console.error(err);
                console.error("\n");
            });
            res.json(result);
        }).catch(HttpResponse, function (err) {
            res.status(err.status).json({
                result: [],
                total_count: 0,
                err_message: err.data
            });
        }).catch(function (err) {
            res.status(500).send(err.stack);
        });
    },

    /**
     * @param req
     * @param res
     */
    getChartData: function (req, res) {
        var kueriLogToken = req.body.token || null;

        if (!kueriLogToken) {
            return res.status(400).json({
                success: false,
                message: 'Empty token'
            });
        }

        knex('trendata_kueri_log')
            .where('trendata_kueri_log_token', kueriLogToken)
            .limit(1)
            .then(function (rows) {
                if (!rows.length) {
                    return Promise.reject(new HttpResponse({
                        success: false,
                        message: 'Token not found'
                    }, 404));
                }

                return rows[0];
            }).then(function (kueriLog) {
                return Promise.all([
                    kueriLog,
                    orm.transaction(function (t) {
                        return orm.query('SET sql_mode=(SELECT REPLACE(@@sql_mode,\'ONLY_FULL_GROUP_BY\',\'\'))', {
                            transaction: t,
                        }).then(function () {
                            return orm.query(kueriLog.trendata_kueri_log_sql, {
                                type: ORM.QueryTypes.SELECT,
                                transaction: t,
                            });
                        });
                    }).then(function (rows) {
                        if (rows.length < 1000) {
                            return rows;
                        }

                        var step = parseInt(rows.length / 1000, 10);
                        
                        return Promise.reduce(rows, function (accum, item, index) {
                            if (index % step === 0) {
                                accum.push(item);
                            }

                            return accum;
                        }, []);
                    })
                ]);
            }).spread(function (kueriLog, rows) {
                return Promise.all([
                    kueriLog,
                    Promise.map(rows, convertRow)
                ]);
            }).spread(function (kueriLog, rows) {
                if (!rows.length) {
                    return Promise.reject(new HttpResponse({}, 400));
                }

                return [
                    kueriLog,
                    {
                        rows: rows,
                        type: getChartTypeByNlpResult(rows)
                    }
                ];
            }).spread(function (kueriLog, data) {
                var chartData;

                switch (data.type) {
                    case 'count':
                        chartData = nlpChartDataCount(data.rows, kueriLog);
                        break;
                    case 'group':
                        chartData = nlpChartDataGroup(data.rows, kueriLog);
                        break;
                    case 'table':
                    default:
                        chartData = nlpChartDataTable(data.rows, kueriLog);
                }

                return Promise.props({
                    chart_data: chartData,
                    width: 12,
                    height: 6,
                    type: 'group',
                    default_chart_display_type: {
                        count: 'column2d',
                        group: 'zoomlinedy',
                        table: 'zoomlinedy'
                    }[data.type] || 'zoomlinedy'
                });
            }).then(function (data) {
                res.json(data);
            }).catch(HttpResponse, function (err) {
                err.json(res);
            }).catch(function (err) {
                res.status(500).send(err.stack);
            });
    },

    /**
     * @param req
     * @param res
     */
    addToDashboard: function (req, res) {
        var chartType = ['single-number', 'donut', 'bar'].indexOf(req.body.chart_type) > -1 ? req.body.chart_type : 'bar';
        var chartLabel = req.body.chart_title;
        var token = req.body.token;
        var dashboardId = req.body.dashboard_id;
        var pickFields = req.body.fields && req.body.fields.map(function (item) {
            return (item + '').toLowerCase();
        });

        if (!token || !dashboardId) {
            return res.status(400).json({
                status: 'error',
                message: 'Empty token or dashboard_id'
            });
        }

        ormModels.Dashboard.count({
            where: {
                trendata_dashboard_id: dashboardId
            }
        }).then(function (count) {
            if (!count) {
                return Promise.reject(new HttpResponse({
                    status: 'error',
                    message: 'Dashboard not found'
                }, 404));
            }
        }).then(function () {
            return knex('trendata_kueri_log')
                .where('trendata_kueri_log_token', token)
                .limit(1)
                .select();
        }).then(function (rows) {
            if (!rows.length) {
                return Promise.reject(new HttpResponse({
                    status: 'error',
                    message: 'Kueri request not found'
                }, 404));
            }

            return rows[0];
        }).then(function (kueriLog) {
            return ormModels.Chart.count({
                where: {
                    trendata_chart_title_token: (chartLabel || kueriLog.trendata_kueri_log_text)
                }
            }).then(function (count) {
                if (count) {
                    return Promise.reject(new HttpResponse({
                        success: false,
                        message: 'NLP chart "' + (chartLabel || kueriLog.trendata_kueri_log_text) + '" already exists'
                    }, 400));
                }

                return orm.query(kueriLog.trendata_kueri_log_sql, {
                    type: ORM.QueryTypes.SELECT
                });
            }).map(convertRow).then(function (rows) {
                if (!rows.length) {
                    return Promise.reject(new HttpResponse({}));
                }

                return [
                    kueriLog,
                    getChartTypeByNlpResult(rows)
                ];
            });
        }).spread(function (kueriLog, type) {
            var availableTypes = {
                count: ['single-number', 'bar'],
                group: ['donut', 'bar'],
                table: ['bar']
            }[type];
            var queryString = JSON.stringify(chartLabel || kueriLog.trendata_kueri_log_text);
            var iterator = convertRow.toString();
            var customSource = `_data = _.map(_data, ${iterator});\n\n`;

            if (availableTypes.indexOf(chartType) === -1) {
                return Promise.reject(new HttpResponse({
                    status: 'error',
                    message: 'Incorrect chart type'
                }, 400));
            }

            if ('count' === type && 'single-number' === chartType) { // +
                customSource += `
                    _resolve({
                        data: [
                            {
                                label: ${queryString},
                                value: _data[0] && _data[0].count || 0
                            }
                        ]
                    });
                `;
            } else if ('count' === type && 'bar' === chartType) { // +
                customSource += `
                    _resolve({
                        categories: [
                            {
                                category: [
                                    {
                                        label: 'Value'
                                    }
                                ]
                            }
                        ],
                        dataset: [
                            {
                                seriesname: 'Value',
                                data: [
                                    {
                                        value: _data[0] && _data[0].count || 0
                                    }
                                ]
                            }
                        ]
                    });
                `;
            } else if ('group' === type && 'donut' === chartType) { // +
                customSource += `_resolve({
                    data: _.map(_data, function (item) {
                        var result = {};

                        for (var index in item) {
                            if ('count' === index) {
                                result.value = item[index];
                            } else {
                                result.label = item[index];
                            }
                        }

                        return result;
                    }),
                    decimals: '1'
                });`;
            } else if ('group' === type && 'bar' === chartType) {
                // ...
                customSource += `_resolve({ 
                    data: _.map(_data, function (item) {
                        var result = {};

                        for (var index in item) {
                            if ('count' === index) {
                                result.value = item[index];
                            } else {
                                result.label = item[index];
                            }
                        }

                        return result;
                    }),
                    decimals: '1'
                });`;
            } else /*if ('table' === type && 'bar' === chartType)*/ {
                customSource += `
                    var getChartData = ${nlpChartDataTable};
                    
                    Promise.resolve(_data).then(function (rows) {
                        if (rows.length < 1000) {
                            return rows;
                        }

                        var step = parseInt(rows.length / 1000, 10);
                        
                        return Promise.reduce(rows, function (accum, item, index) {
                            if (index % step === 0) {
                                accum.push(item);
                            }

                            return accum;
                        }, []);
                    }).then(function (rows) {
                        return getChartData(
                            rows, 
                            {
                                trendata_kueri_log_text: ${JSON.stringify(chartLabel || kueriLog.trendata_kueri_log_text)}
                            }
                        );
                    }).then(_resolve).catch(_reject);
                `;
            }

            return ormModels.Chart.create({
                trendata_chart_key: '',
                trendata_chart_created_by: req.user.trendata_user_id,
                trendata_chart_last_modified_by: req.user.trendata_user_id,
                trendata_chart_title_token: chartLabel || kueriLog.trendata_kueri_log_text,
                trendata_chart_description_token: chartLabel || kueriLog.trendata_kueri_log_text,
                trendata_chart_type: 'single-number' === chartType ? '2' : '1',
                trendata_chart_default_chart_display_type: {
                    'count': {
                        'single-number': 4,
                        'bar': 6
                    },
                    'group': {
                        'bar': 10,
                        'donut': 2
                    },
                    'table': {
                        'bar': 1
                    }
                }[type][chartType],
                trendata_chart_is_kueri: 1,
                trendata_chart_type_id: 1,
                trendata_chart_id_parent: null
            }).then(function (chart) {
                return ormModels.DashboardChart.create({
                    trendata_dashboard_chart_created_by: req.user.trendata_user_id,
                    trendata_dashboard_chart_last_modified_by: req.user.trendata_user_id,
                    trendata_dashboard_chart_order: 0,
                    trendata_dashboard_id: dashboardId,
                    trendata_chart_id: chart.trendata_chart_id,
                    x: 0,
                    y: 0
                }).then(function () {
                    return ormModels.SqlQuery.create({
                        trendata_sql_query_template: kueriLog.trendata_kueri_log_sql,
                        trendata_sql_query_custom_source: customSource,
                        trendata_sql_query_module_path: null,
                        trendata_chart_id: chart.trendata_chart_id
                    });
                });
            });
        }).then(function () {
            res.json({
                status: 'success'
            });
        }).catch(HttpResponse, function (err) {
            err.json(res);
        }).catch(function (err) {
            res.status(500).send(err.stack);
        });
    }
};

'use strict';
``
var kueriAuthToken;
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
var rp = require('request-promise');
var moment = require('moment');
var querystring = require('querystring');
var stringSimilarity = require('../components/similar-text/index');
var kueri = require('../components/kueri-api')({
    api_url: config.kueri.api_url,
    debug: true
});

/**
 * @param {Array} result
 * @param {string} query
 * @returns {Array}
 */
function kueriResultMapper(result, query) {
    if (stringSimilarity.compareTwoStrings('show top 5 employees by salary', query) > 0.9) {
        return result.map(function (item) {
            return {
                'count': item.salary,
                'first name': item['first name']
            };
        });
    }

    return result;
}

/**
 * @param {string} query
 * @returns {boolean}
 */
function showChartOnNlpPage(query) {
    return stringSimilarity.compareTwoStrings('show top 5 employees by salary', query) > 0.9 || false;
}

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
 * @param {string} str
 * @returns {string}
 */
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

/**
 * @param {string} text
 * @return {string}
 */
function convertTextForNlp(text) {
    text = (text + '').trim().replace(/\s+/g, ' ');

    for (var property in nlpQueryAliases) {
        text = text.replace(new RegExp(escapeRegExp(nlpQueryAliases[property]), 'gi'), property);
    }

    return text;
}

/**
 * @param {string} text
 * @return {string}
 */
function convertTextFromNlp(text) {
    text = (text + '').trim().replace(/\s+/g, ' ');

    for (var property in nlpQueryAliases) {
        text = text.replace(new RegExp(escapeRegExp(property), 'gi'), nlpQueryAliases[property]);
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
        } else if (/^count[0-9]+$/ig.test(newIndex)) {
            newIndex = 'count';
        } else if (/^address\s{1}/ig.test(newIndex)) {
            newIndex = newIndex.replace('address ', '');
        } else if (/^position\s{1}/ig.test(newIndex)) {
            newIndex = newIndex.replace('position ', '');
        } else if (newIndex === 'performance percentage this year') {
            newIndex = 'performance';
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
    return Promise.all([
        _getAuthToken(),
        kueri.getDataSourceId()
    ]).spread(function (authToken, dataSourceId) {
        return kueri.serverGetKeywordSuggestions({
            auth_token: authToken,
            database_id: dataSourceId,
            query: escapeHtml(text),
            query_id: parseInt(Date.now() / 1000, 10)
        });
    }).then(function (data) {
        return 'ok' === data.status ? (data.suggests || []) : Promise.reject(new Error(data.error.message));
    });
}

/**
 * @param text
 * @return {Array}
 */
function convertQuery(query) {
    let array = _.map(query, function(item) {
        return item.trendata_nlp_sentence_query;
    });

    return array;
}

/**
 * @param data
 * @param kueriLog
 * @param chartView
 * @returns {Promise}
 */
function nlpChartDataTable(data, kueriLog, chartView) {
    var relations = {
        'Cost Per Hire': 'cost per hire',
        'Industry Salary': 'industry salary',
        'Salary': 'salary',
        'Salary 1 Year Ago': 'salary 1 year ago',
        'Salary 2 Year Ago': 'salary 2 year ago',
        'Salary 3 Year Ago': 'salary 3 year ago',
        'Salary 4 Year Ago': 'salary 4 year ago',
        'Performance Percentage This Year': 'performance percentage this year',
        'Performance Percentage 1 Year Ago': 'performance percentage 1 year ago',
        'Performance Percentage 2 Year Ago': 'performance percentage 2 year ago',
        'Performance Percentage 3 Year Ago': 'performance percentage 3 year ago',
        'Performance Percentage 4 Year Ago': 'performance percentage 4 year ago',
        'Absences': 'absences',
        'Benefit Costs': 'benefit costs',
        'Benefit Costs 1 Year Ago': 'benefit costs 1 year ago',
        'Benefit Costs 2 Year Ago': 'benefit costs 2 year ago',
        'Benefit Costs 3 Year Ago': 'benefit costs 3 year ago',
        'Benefit Costs 4 Year Ago': 'benefit costs 4 year ago',
    };

    chartView = relations[chartView] && chartView || 'Cost Per Hire';

    var chartData = {
        "chart": {
            "caption": kueriLog.trendata_kueri_log_text,
            "captionFontSize": "14",
            "subcaptionFontSize": "14",
            "subcaptionFontBold": "0",
            "paletteColors": "#0075c2,#f8bd19,#008ee4,#33bdda,#e44a00,#6baa01,#583e78",
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
            "theme": "tren",
            "numberprefix": ""
        },
        "categories": [
            {
                "category": []
            }
        ],
        "dataset": [
            {
                "seriesname": chartView,
                "data": []
            }
        ]
    };

    if (!data.length) {
        return chartData;
    }

    var count2 = data.length;
    data = _.chunk(data, parseInt(data.length / 500, 10) || 1);

    return Promise.each(data, function (rows) {
        chartData.categories[0].category.push({
            label: rows[0]['first name'] || '',
            stepSkipped: false,
            appliedSmartLabel: true
        });

        chartData.dataset[0].data.push({
            value: _.meanBy(rows, function (item) {
                return Number(item[relations[chartView]]) || 0;
            })
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
function nlpChartDataGroup(data, kueriLog, replaces) {
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
            "paletteColors": "#0075c2,#f8bd19,#008ee4,#33bdda,#e44a00,#6baa01,#583e78",
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
            "theme": "tren",
            "numberprefix": ""
        },
        "categories": [
            {
                "category": []
            }
        ],
        "dataset": []
    };

    return Promise.each(data, function (row) {
        chartData.categories[0].category.push({
            label: row[labelIndex] + '',
            stepSkipped: false,
            appliedSmartLabel: true
        });

        var multipleGroups = true;
        if (_.keys(row).length < 3) {
            multipleGroups = false;
            var seriesname = kueriLog.trendata_kueri_log_sql.split('FROM')[0].toUpperCase();

            if (seriesname.indexOf('AVG(') > -1) {
                seriesname = 'Avg';
            } else if (seriesname.indexOf('SUM(') > -1) {
                seriesname = 'Sum';
            } else if (seriesname.indexOf('MIN(') > -1) {
                seriesname = 'Min';
            } else if (seriesname.indexOf('MAX(') > -1) {
                seriesname = 'Max';
            } else {
                seriesname = 'Count';
            }
        }

        var i = 0;
        _.each(row, function(value, key) {
            if (/^(avg|sum|count)\d*$/.test(key)) {
                if (!chartData.dataset[i]) {
                    chartData.dataset[i] = {
                        "seriesname": multipleGroups ? (replaces[key] || key) : seriesname,
                        "data": []
                    }
                }

                chartData.dataset[i].data.push({
                    value: value
                });
                i++;
            }
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
    } else if (Object.keys(item).length > 1 && ('count' in item || 'sum1' in item)) {
        return 'group';
    }

    return 'table';
}

function getUsers(query) {
    let orderIndex = query.indexOf('ORDER');
    let lastIndex = query.indexOf('GROUP') > -1 ? query.indexOf('GROUP') : orderIndex;
    let whereIndex = query.indexOf('WHERE');
    let where = '';
    if (whereIndex !== -1) {
        where = query.substring(whereIndex, lastIndex > -1 ? lastIndex : undefined);
    }

    let userColumns = {
        'first_name': 'first name',
        'last_name': 'last name',
        'department': 'department',
        'job_level': 'job level',
        'employee_type': 'employee type',
        'country': 'country',
        'address_city': 'city',
        'address_state': 'state',
        'division': 'division',
        'cost_center': 'cost center',
        'education_history_level': 'education level',
        'gender': 'gender',
        'position_hire_date': 'hire date',
        'position_termination_date': 'termination date',
        'current_job_code': 'current job code',
        'ethnicity': 'ethnicity',
        'position_start_date': 'position start date',
        'hire_source': 'hire source',
        'salary': 'salary',
        'prof_development': 'prof. dev.',
        'absences': 'absences',
        'benefit_costs': 'benefit cost',
        'performance_percentage_this_year': 'performance'
    };
    let orderColumn = 'first_name';
    let orderDirection = 'asc';

    if (orderIndex > -1) {
        let orderTmp = query.substring(orderIndex + 9).toLowerCase().split(' ');
        orderColumn = orderTmp[0].replace('pq_as_', '').replace('trendata_bigdata_user_view.', '').trim();
        if (! userColumns[orderColumn])
            orderColumn = 'first_name';
        orderDirection = orderTmp[1].indexOf('desc') === 0 ? 'desc' : 'asc';
    }

    let usersQuery = 'SELECT `first_name` as \'first name\', ' +
        '`last_name` as \'last name\', ' +
        '`department` as \'department\', ' +
        '`job_level` as \'job level\', ' +
        '`employee_type` as \'employee type\', ' +
        '`country` as \'country\', ' +
        '`address_city` as \'city\', ' +
        '`address_state` as \'state\', ' +
        '`division` as \'division\', ' +
        '`cost_center` as \'cost center\', ' +
        '`education_history_level` as \'education level\', ' +
        '`gender` as \'gender\', ' +
        'DATE_FORMAT(`position_hire_date`, "%M %e, %Y") as \'hire date\', ' +
        'DATE_FORMAT(`position_termination_date`, "%M %e, %Y") as \'termination date\', ' +
        '`current_job_code` as \'current job code\', ' +
        '`ethnicity` as \'ethnicity\', ' +
        'DATE_FORMAT(`position_start_date`, "%M %e, %Y") as \'position start date\', ' +
        '`hire_source` as \'hire source\', ' +
        '`salary` as \'salary\', ' +
        '`prof_development` as \'prof. dev.\', ' +
        '`absences` as \'absences\', ' +
        '`benefit_costs` as \'benefit cost\', ' +
        '`performance_percentage_this_year` as \'performance\' ' +
        'FROM `trendata_bigdata_user_view` ' +
        where +
        ' ORDER BY ' + orderColumn + ' ' + orderDirection;


    return Promise.props({
        users: orm.query(usersQuery, {
            type: ORM.QueryTypes.SELECT
        }),
        sortColumn: userColumns[orderColumn],
        sortDirection: orderDirection
    });
}

module.exports = {
    /**
     * @param req
     * @param res
     */
    nlpFeedback: function (req, res) {
        var token = req.body.token;
        var feedback = req.body.feedback;

        if (feedback && typeof feedback === 'boolean') {
            feedback = 'Yes';
        } else if (!feedback && typeof feedback === 'boolean') {
            feedback = 'No';
        } else if (typeof feedback !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Incorrect feedback'
            });
        }

        if (!token || !feedback) {
            return res.status(400).json({
                success: false,
                message: 'Empty data'
            });
        }

        knex('trendata_kueri_log_detailed').where({
            trendata_kueri_log_detailed_token: token
        }).limit(1).then(function (rows) {
            if (!rows.length) {
                return Promise.reject(new HttpResponse({
                    success: false,
                    message: 'Log not found'
                }, 404));
            }

            return rows[0];
        }).then(function (log) {
            return knex('trendata_kueri_log_detailed').where({
                trendata_kueri_log_detailed_token: token
            }).update({
                trendata_kueri_log_detailed_user_feedback: feedback
            }).then(function () {
                return log;
            });
        }).then(function (log) {
            var data = Buffer.from(JSON.stringify({
                user_id: log.trendata_user_id,
                raw: log.trendata_kueri_log_detailed_raw_string,
                interpreted: log.trendata_kueri_log_detailed_interpreted_string,
                result_found: log.trendata_kueri_log_detailed_result_found,
                feedback: feedback,
                time: moment().format('YYYY-MM-DD HH:mm:ss')
            })).toString('base64');

            var url = 'https://internal.trendata.com/nlplog/?' + querystring.stringify({
                request_id: token,
                data: data,
                client: config.SERVER_NAME + '.trendata.com'
            });

            rp(url).catch(console.error);
        }).then(function () {
            res.json({
                success: true
            });
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
    autocomplete: function (req, res) {
        serverGetKeywordSuggestions(req.body.text)
            .map(function (item) {
                return convertTextFromNlp(item.c);
            })
            .then(function (suggests) {
                return knex('trendata_nlp_sentence')
                    .where('trendata_nlp_sentence_query', 'like', `%${req.body.text}%`)
                    .then(function(data) {
                        let queryData = convertQuery(data) || [];
                        res.json([...queryData, ...suggests]);
                    });
            })
            .catch(function (err) {
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

            return ('QUERY' === item.t || 'OTHER_USER_ASKED' === item.t) ? item.c : '';
        }, '').then(function (text) {
            return '' === text ? req.body.text : text;
        }).then(function (text) {
            loggingText = text;

            return Promise.all([
                _getAuthToken(),
                kueri.getDataSourceId()
            ]).spread(function (authToken, dataSourceId) {
                return kueri.serverGetSql({
                    auth_token: authToken,
                    database_id: dataSourceId,
                    query: escapeHtml(convertTextForNlp(text))
                });
            });
        }).then(function (data) {
            if ('ok' !== data.status && 3 === (data.error && data.error.id)) {
                kueri.nlpQueryLoggingDetailed(token, req.body.text, req.body.text, 'no', req.user.trendata_user_id);
                return Promise.reject(new HttpResponse({
                    result: [],
                    total_count: 0
                }, 200));
            }

            if ('ok' !== data.status) {
                return Promise.reject(new HttpResponse(data.error.message, 400));
            }

            var match = data.queries[0].q.match(/FROM\s(.+?)\.trendata_bigdata_user_view/);

            if (match && match[1]) {
                return data.queries[0].q.replace(new RegExp(match[1] + '\\.', 'g'), '');
            }

            return data.queries[0].q;
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
                            table: ['single-number', 'bar']
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

                        var sql = data.sql.split(/\s+FROM\s+/gi)[1].replace(/\s+GROUP\s+BY\s+NULL/gi, ' ');
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
                                    sql = data.sql.split(/\s+FROM\s+|\s+GROUP\s+/gi)[1];
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
            result.showChart = showChartOnNlpPage(req.body.text);
            return result;
        }).then(function (result) {
            kueri.nlpQueryLoggingDetailed(token, req.body.text, loggingText, result.result.length ? 'yes' : 'no', req.user.trendata_user_id);
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
        var chartView = req.body.chart_view || 'Cost Per Hire';
        var _replaces = {};
        var multipleGroupMetricStyles = []

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
                            let groups = kueriLog.trendata_kueri_log_sql.match(/count\(if.*?PQ_AS_SUM\d*/gi);
                            if (groups && groups.length > 1) {
                                _.each(groups, group => {
                                    let groupValue = group.match(/=.*\,1\,null/gi);
                                    let sumValue = group.match(/pq_as_sum\d*/gi);
                                    _replaces[sumValue[0].substring(6).toLowerCase()] = groupValue[0].substring(3, groupValue[0].length - 8);
                                });
                                multipleGroupMetricStyles = ['bar'];
                            }
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
                return [
                    kueriLog,
                    kueriResultMapper(rows, kueriLog.trendata_kueri_log_text)
                ];
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
                        chartData = nlpChartDataGroup(data.rows, kueriLog, _replaces);
                        break;
                    case 'table':
                    default:
                        chartData = nlpChartDataTable(data.rows, kueriLog, chartView);
                }
                return Promise.props({
                    chart_data: chartData,
                    users: getUsers(kueriLog.trendata_kueri_log_sql),
                    width: 12,
                    height: 6,
                    type: data.type,
                    multipleGroupMetricStyles: multipleGroupMetricStyles,
                    default_chart_display_type: {
                        count: 'column2d',
                        group: 'scrollcolumn2d',
                        table: 'scrollcolumn2d'
                    }[data.type] || 'scrollcolumn2d'
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
        var chartView = req.body.chart_view || 'Cost Per Hire';
        var token = req.body.token;
        var dashboardId = req.body.dashboard_id;
        var description = req.body.description;
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
                var singleValueCount = rows.length?rows.length:0;
                return [
                    kueriLog,
                    getChartTypeByNlpResult(rows),
                    singleValueCount
                ];
            });
        }).spread(function (kueriLog, type, singleValueCount) {
            var availableTypes = {
                count: ['single-number', 'bar'],
                group: ['donut', 'bar'],
                table: ['single-number', 'bar']
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
            } else if ('table' === type && 'single-number' === chartType) { // +
                customSource += `
                    _resolve({
                        data: [
                            {
                                label: ${queryString},
                                value: ${singleValueCount}
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
            } else if ('table' === type && 'bar' === chartType) {
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
                                        value: ${singleValueCount}
                                    }
                                ]
                            }
                        ]
                    });
                `;
            } else {
                customSource += `
                    var getChartData = ${nlpChartDataTable};

                    Promise.resolve(_data).then(function (rows) {
                        if (rows.length < 1000) {
                            return rows;
                        }

                        //var step = parseInt(rows.length / 1000, 10);
                        var step = 1;

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
                            },
                            ${JSON.stringify(chartView)}
                        );
                    }).then(_resolve).catch(_reject);
                `;
            }

            return ormModels.Chart.create({
                trendata_chart_key: '',
                trendata_chart_created_by: req.user.trendata_user_id,
                trendata_chart_last_modified_by: req.user.trendata_user_id,
                trendata_chart_title_token: chartLabel || kueriLog.trendata_kueri_log_text,
                nlp_search_query: req.body.search_query,
                trendata_chart_description_token: description || kueriLog.trendata_kueri_log_text,
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
                        'bar': 10
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
    },
    /**
     * @param req
     * @param res
     */
    checkChart: function (req, res) {
        knex('trendata_nlp_sentence')
            .where('trendata_nlp_sentence_query', req.body.query.toLowerCase().trim())
            .then(function(data) {
                if (data && data.length) {
                    res.json({data: data[0].trendata_nlp_sentence_redirect});
                } else {
                    res.json({data: null});
                }
            })
            .catch(HttpResponse, function (err) {
                err.json(res);
            })
            .catch(function (err) {
                res.status(500).send(err.stack);
            });
    }
};

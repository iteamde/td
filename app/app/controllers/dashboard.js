/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var sendResponse = require('../libs/utils').sendResponse;
var authorization = require('../components/auth-middleware');
var HttpResponse = require('../components/http-response');
var dashboardModel = require('../models/dashboard');
var commonModel = require('../models/common');
var db = require('../config/db');
var http_status = require('../config/constant').HTTP_STATUS;
var async = require('async');
require('../config/global');
var util = require('util');
var dateFormat = require('dateformat');
var loadChartModuleSrc = require('../components/load-chart-module-src');
var knex = require('../components/knex');

var user_language_id = require('../config/constant').user_language_id;
var metricCharts = require('../../resources/json/metric');
var dashboardChart = require('../../resources/json/dashboard');

var knex = require('../components/knex');
var orm = require('../components/orm/orm');
var ORM = require('sequelize');
var jsVm = require('../components/js-virtual-machine');
var commonChartData = require('../components/common-chart-data');
var translation = require('../components/translation');
var apiCallTrack = require('../components/api-call-track');
var separateThread = require('../components/separate-thread');

var ChartModel = require('../models/orm-models').Chart;
var DashboardModel = require('../models/orm-models').Dashboard;
var ChartDisplayTypeModel = require('../models/orm-models').ChartDisplayType;
var TranslationModel = require('../models/orm-models').Translation;
var DashboardChartModel = require('../models/orm-models').DashboardChart;
var SqlQueryModel = require('../models/orm-models').SqlQuery;
var ConnectorCsvModel = require('../models/orm-models').ConnectorCsv;
var UserActivityModel = require('../models/orm-models').UserActivity;

var colors = require('./../components/colors');

module.exports.getDashboardList = getDashboardList;
module.exports.getDashboardCharts = getDashboardCharts;
module.exports.attachChart = attachChart;
module.exports.setChartsOrder = setChartsOrder;
module.exports.removeChart = removeChart;
module.exports.setChartSize = setChartSize;

/**
 * Return Dashboard List
 * @param req
 * @param res
 */
function getDashboardList(req, res) {
    apiCallTrack(function (trackApi) {
        DashboardModel.findAll({
            where: {
                trendata_dashboard_status: '1',
                trendata_user_id: req.user.trendata_user_id
            }
        }).then(function (item) {
            if (item.length > 0){
                return item;
            } else {
                return DashboardModel.findAll({
                    where: {
                        trendata_dashboard_status: '1',
                        trendata_user_id: 0
                    }
                }).then(function (item1) {
                    return item1;
                });
            }
        }).map(function (item) {
            return Promise.props({
                id:         item.trendata_dashboard_id,
                created_on: item.created_at,
                status:     item.trendata_dashboard_status,
                icon:       item.trendata_dashboard_icon,
                title:      TranslationModel.getTranslation(item.trendata_dashboard_title_token)
            });
        }).then(function (rows) {
            trackApi(req);
            res.json(rows);
        }).catch(function (err) {
            trackApi(req, err);
            res.status(500).send(err.stack);
        });
    });
}

/**
 * this api function returns the charts list or Dashboard
 * @Parameter dashboard_id
 */
function getDashboardCharts(req, res) {
    var _replaces = {}
    apiCallTrack(function (trackApi) {
        if (req.query.dashboard_id && req.query.dashboard_id !== global.user_default_dashboard_id) {
            var dashboardId = req.query.dashboard_id;
            var userId = req.user.trendata_user_id;
        } else {
            var dashboardId = global.user_default_dashboard_id;
            var userId = 0;
        }

        DashboardChartModel.findAll({
            include: [
                {
                    model: ChartModel,
                    required: true,
                    where: {
                        trendata_chart_status: '1'
                    },
                    include: [
                        {
                            model: ChartDisplayTypeModel,
                            required: true
                        },
                        {
                            model: SqlQueryModel,
                            required: false
                        }
                    ]
                },
                {
                    model: DashboardModel,
                    required: true,
                    where: {
                        trendata_dashboard_id: dashboardId,
                        trendata_user_id: userId,
                        trendata_dashboard_status: '1'
                    }
                }
            ],
            order: [
                ['trendata_dashboard_chart_order', 'ASC']
            ]
        }).reduce(function (accumulator, item) {
            item = item.dataValues;
            return Promise.props({
                id: item.trendata_dashboard_chart_id,
                chart_id: item.Chart.trendata_chart_id,
                parent_id: item.Chart.trendata_chart_id_parent,
                created_on: item.Chart.created_at,
                status: item.Chart.trendata_chart_status,
                nlp_query: item.Chart.nlp_search_query,
                default_chart_display_type: item.Chart.ChartDisplayType.trendata_chart_display_type_key,
                x: item.x,
                y: item.y,
                width: item.trendata_dashboard_chart_width || item.Chart.trendata_chart_width,
                height: item.trendata_dashboard_chart_height || item.Chart.trendata_chart_height,
                set_height: item.trendata_dashboard_chart_height,
                set_width: item.trendata_dashboard_chart_width,
                chart_type: item.Chart.trendata_chart_type,
                chart_view: item.trendata_dashboard_chart_view,
                filters: item.trendata_dashboard_chart_filters,
                time_span: item.trendata_dashboard_chart_time_span,
                vertical_axis: item.trendata_dashboard_chart_vertical_axis,
                regression_analysis: item.trendata_dashboard_chart_regression,
                hide_empty: item.trendata_dashboard_chart_hide_empty,
                title: item.Chart.trendata_chart_is_kueri ? item.Chart.trendata_chart_title_token : (item.trendata_dashboard_chart_title || TranslationModel.getTranslation(item.Chart.trendata_chart_title_token)),
                description: item.Chart.trendata_chart_is_kueri ? item.Chart.trendata_chart_description_token : (item.trendata_dashboard_chart_description || TranslationModel.getTranslation(item.Chart.trendata_chart_description_token)),
                is_kueri: item.Chart.trendata_chart_is_kueri,
                sql_template: item.Chart.SqlQuery
            }).then(function (data) {
                var chart_key = item.Chart.trendata_chart_key;
                var sqlTemplate = data.sql_template;
                data.sql_template = undefined;

                var context = {
                    orm: orm,
                    ORM: ORM,
                    ormModels: require('../models/orm-models'),
                    Date: Date,
                    JSON: JSON,
                    req: req,
                    commonChartData: commonChartData,
                    Error: Error,
                    _: _,
                    translation: translation,
                    separateThread: separateThread,
                    moment: require('moment'),
                    selfId: data.chart_id,
                    knex: require('../components/knex'),
                    sqlstring: require('sqlstring'),
                    reqData: {
                        data: {
                            chart_view: data.chart_view,
                            filters: data.filters && JSON.parse(data.filters),
                            vertical_axis_type: data.vertical_axis,
                            time_span: data.time_span && JSON.parse(data.time_span),
                            regression_analysis: data.regression_analysis,
                            hide_empty: data.hide_empty,
                        },
                        type: 'fromDashboard'
                    },
                    fromDashboard: true,
                    colors: colors,
                };

                if (sqlTemplate && sqlTemplate.trendata_sql_query_template && (sqlTemplate.trendata_sql_query_custom_source || sqlTemplate.trendata_sql_query_module_path)) {
                    if (data.is_kueri) {
                        data.chart_data = orm.transaction(function (t) {
                            return orm.query('SET sql_mode=(SELECT REPLACE(@@sql_mode,\'ONLY_FULL_GROUP_BY\',\'\'))', {
                                transaction: t,
                            }).then(function () {
                                return orm.query(sqlTemplate.trendata_sql_query_template, {
                                    type: ORM.QueryTypes.SELECT,
                                    transaction: t
                                });
                            }).then(function (rows) {
                                if (sqlTemplate.trendata_sql_query_module_path) {
                                    return loadChartModuleSrc(sqlTemplate.trendata_sql_query_module_path).then(function (code) {
                                        return jsVm(code, rows, {
                                            contextProps: context
                                        });
                                    });
                                }
                                let groups = sqlTemplate.trendata_sql_query_template.match(/count\(if.*?PQ_AS_SUM\d*/gi);
                                if (groups && groups.length > 1) {
                                    _.each(groups, group => {
                                        let groupValue = group.match(/=.*\,1\,null/gi);
                                        let sumValue = group.match(/pq_as_sum\d*/gi);
                                        _replaces[sumValue[0].substring(6).toLowerCase()] = groupValue[0].substring(3, groupValue[0].length - 8);
                                    });
                                    return chartDataGroup = nlpChartDataGroup(rows, sqlTemplate.trendata_sql_query_template, _replaces);
                                }else{
                                    return jsVm(sqlTemplate.trendata_sql_query_custom_source, rows, {
                                        contextProps: context
                                    });
                                }
                            });
                        });
                    } else {
                        data.chart_data = orm.query(sqlTemplate.trendata_sql_query_template, {
                            type: ORM.QueryTypes.SELECT
                        }).then(function (rows) {
                            if (sqlTemplate.trendata_sql_query_module_path) {
                                return loadChartModuleSrc(sqlTemplate.trendata_sql_query_module_path).then(function (code) {
                                    return jsVm(code, rows, {
                                        contextProps: context
                                    });
                                });
                            }

                            return jsVm(sqlTemplate.trendata_sql_query_custom_source, rows, {
                                contextProps: context
                            });
                        });
                    }
                } else if (sqlTemplate && (sqlTemplate.trendata_sql_query_custom_source || sqlTemplate.trendata_sql_query_module_path)) {
                    data.chart_data = Promise.resolve().then(function () {
                        if (sqlTemplate.trendata_sql_query_module_path) {
                            return loadChartModuleSrc(sqlTemplate.trendata_sql_query_module_path).then(function (code) {
                                return jsVm(code, undefined, {
                                    contextProps: context
                                });
                            });
                        }

                        return jsVm(sqlTemplate.trendata_sql_query_custom_source, undefined, {
                            contextProps: context
                        });
                    });
                } else if (dashboardChart[chart_key]) {
                    data.chart_data = dashboardChart[chart_key].chart_charts[0];
                }

                delete data.created_on;
                delete data.chart_view;
                delete data.filters;
                delete data.vertical_axis;
                delete data.time_span;
                delete data.regression_analysis;
                delete data.hide_empty;
                return Promise.props(data);
            }).then(function (data) {
                // console.log(data)
                switch (data.chart_type) {
                    case '1':
                        /**
                         * Add Fusion chart decimal point in Charts data
                         * Since we need this in all charts, so instead of adding in DB, add here
                         */
                        if(data.chart_data && data.chart_data.dataset) {
                            if(data.default_chart_display_type !== 'doughnut2d'){
                                data.default_chart_display_type = 'scrollcolumn2d';
                            }
                        }
                        if(data.chart_data && data.chart_data.data) { // doughnut2d charts
                            data.chart_data.decimals = '1';
                        }
                        accumulator.charts.push(data);
                        break;
                    case '2':
                        accumulator.value_box.push(data);
                        break;
                    case '3':
                        accumulator.table.push(data);
                        break;
                    default:
                    // ...
                }

                return accumulator;
            });
        }, {
            charts: [],
            value_box: [],
            table: []
        }).then(function (result) {
            return knex('trendata_connector_csv')
                .where({
                    trendata_connector_csv_type: 'tuff',
                    trendata_connector_csv_file_type: 'users'
                })
                .orderBy('trendata_connector_csv_id', 'desc')
                .limit(1)
                .then(function (rows) {
                    if (!rows.length) {
                        return null;
                    }

                    return dateFormat(rows[0].created_at, 'mmmm d, yyyy');
                }).then(function (date) {
                    result.tuff_users_last_uploaded_date = date;
                    return result;
                });
        }).then(function (result) {
            trackApi(req);
            res.json(result);
        }).catch(function (err) {
            trackApi(req, err);
            res.status(500).send(err.stack);
        });
    });
}

/**
 * @param req
 * @param res
 */
function attachChart(req, res) {
    apiCallTrack(function (trackApi) {
        var chartId = req.body.chart_id;
        var dashboardId = req.body.dashboard_id || 1;

        commonChartData.getAvailableFiltersForDrilldown().then(function (availableFilters) {
            var tmpFilters;

            for (var availableFilter in availableFilters) {
                if (req.body.filters && req.body.filters[availableFilter]) {
                    req.body.filters[availableFilter] = _.map(req.body.filters[availableFilter], function (item) {
                        return 'null' === item ? null : item;
                    });

                    tmpFilters = _.intersection(
                        _.map(req.body.filters[availableFilter], String),
                        _.map(availableFilters[availableFilter], String)
                    );

                    if (tmpFilters.length === availableFilters[availableFilter].length) {
                        req.body.filters[availableFilter] = undefined;
                    }
                }
            }
        }).then(function () {
            var filtersJson;

            try {
                filtersJson = req.body.filters && JSON.stringify(req.body.filters) || null;
                filtersJson = '{}' === filtersJson ? null : filtersJson;
            } catch (e) {
                filtersJson = null;
            }

            return DashboardChartModel.create({
                trendata_dashboard_id: dashboardId,
                trendata_chart_id: chartId,
                trendata_dashboard_chart_title: req.body.chart_title || null,
                trendata_dashboard_chart_description: req.body.chart_description || null,
                trendata_dashboard_chart_view: req.body.chart_view || null,
                trendata_dashboard_chart_filters: filtersJson,
                trendata_dashboard_chart_time_span: req.body.time_span && JSON.stringify(req.body.time_span) || null,
                trendata_dashboard_chart_vertical_axis: req.body.vertical_axis || null,
                trendata_dashboard_chart_regression: req.body.regression || null,
                trendata_dashboard_chart_hide_empty: req.body.hide_empty || null,
                trendata_dashboard_chart_order: 0
            });
        }).then(function () {
            trackApi(req);
            res.json({
                status: 'success',
                created: true
            });
        }).catch(HttpResponse, function (err) {
            err.json(res);
        }).catch(function (err) {
            trackApi(req, err);
            res.status(400).json({
                err: err,
                trace: err.stack
            });
        });
    });
}

/**
 * @param req
 * @param res
 */
function removeChart(req, res) {
    var dashboardChartId = parseInt(req.body.id, 10) || 0;

    knex('trendata_dashboard_chart')
        .where('trendata_dashboard_chart_id', dashboardChartId)
        .limit(1)
        .then(function (rows) {
            if (!rows.length) {
                return Promise.reject(new HttpResponse({
                    success: false,
                    message: 'Chart not found'
                }, 400));
            }

            return rows[0];
        }).then(function (dashboardChart) {
            return knex('trendata_dashboard_chart').where('trendata_dashboard_chart_id', dashboardChartId).del().then(function () {
                return dashboardChart.trendata_chart_id;
            });
        }).then(function (chartId) {
            return knex('trendata_chart').where('trendata_chart_id', chartId).limit(1).then(function (rows) {
                if (!rows.length) {
                    return Promise.reject(new HttpResponse({
                        success: true
                    }));
                }

                return rows[0];
            });
        }).then(function (chart) {
            if (chart.trendata_chart_is_kueri) {
                return knex('trendata_sql_query').where('trendata_chart_id', chart.trendata_chart_id).del().then(function () {
                    return knex('trendata_chart').where('trendata_chart_id', chart.trendata_chart_id).del();
                });
            }
        }).then(function () {
            res.json({
                success: true
            });
        }).catch(HttpResponse, function (err) {
            err.json(res);
        }).catch(function (err) {
            res.status(500).send(err.stack);
        });
}

/**
 * @param req
 * @param res
 */
 function setChartsOrder(req, res) {
    apiCallTrack(function (trackApi) {
        Promise.resolve(req.body).map(function(chart) {
            DashboardChartModel.update({
               x: +chart.chartX,
               y: +chart.chartY,
               trendata_dashboard_chart_width: +chart.chartWidth,
               trendata_dashboard_chart_height: +chart.chartHeight
            }, {
                where: {
                   trendata_dashboard_chart_id:  +chart.id
                }
            });
        }).then(function() {
            trackApi(req);
            res.json({
                status: 'success'
            });
        }).catch(function(err) {
            trackApi(req, err);
            res.status(500).send(err.stack);
        });
    });
 }


/**
 * @param req
 * @param res
 */
function setChartSize(req, res) {
    apiCallTrack(function (trackApi) {
        Promise.resolve(req.body).then(function(chart) {
            DashboardChartModel.update({
               trendata_dashboard_chart_width: +chart.chartWidth,
               trendata_dashboard_chart_height: +chart.chartHeight
            }, {
                where: {
                   trendata_dashboard_chart_id:  +chart.id
                }
            });
        }).then(function() {
            trackApi(req);
            res.json({
                status: 'success'
            });
        }).catch(function(err) {
            trackApi(req, err);
            res.status(500).send(err.stack);
        });
    });
}


/**
 * @param data
 * @param kueriLog
 * @return {Promise}
 */
function nlpChartDataGroup(data, kueriLog, replaces) {
   var dataArray = []
    _.each(data, function (row) {
        var obj = {}
        _.each(row, function (value, key) {
            var keys = key.split('PQ_AS_')[1].toLowerCase()
            obj[keys] = value
        })
        dataArray.push(obj)
    })

    var chartData = {
        "dataset": [], 
        "categories": [
            {
                "category": []
            }]
        }
    var labelIndex;

    for (var index in dataArray[0]) {
        if ('count' !== index) {
            labelIndex = index;
            break;
        }
    }

    return Promise.each(dataArray, function (row) {
        chartData.categories[0].category.push({
            label: row[labelIndex] + '',
            stepSkipped: false,
            appliedSmartLabel: true
        });

        var multipleGroups = true;
        if (_.keys(row).length < 3) {
            multipleGroups = false;
            var seriesname = kueriLog.split('FROM')[0].toUpperCase();

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
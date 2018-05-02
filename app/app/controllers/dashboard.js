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

var user_language_id = require('../config/constant').user_language_id;
var metricCharts = require('../../resources/json/metric');
var dashboardChart = require('../../resources/json/dashboard');

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
                id: item.Chart.trendata_chart_id,
                created_on: item.Chart.created_at,
                status: item.Chart.trendata_chart_status,
                default_chart_display_type: item.Chart.ChartDisplayType.trendata_chart_display_type_key,
                x: item.x,
                y: item.y,
                width: item.trendata_dashboard_chart_width || item.Chart.trendata_chart_width,
                height: item.trendata_dashboard_chart_height || item.Chart.trendata_chart_height,
                set_height: item.trendata_dashboard_chart_height,
                set_width: item.trendata_dashboard_chart_width,
                chart_type: item.Chart.trendata_chart_type,
                title: item.Chart.trendata_chart_is_kueri ? item.Chart.trendata_chart_title_token : TranslationModel.getTranslation(item.Chart.trendata_chart_title_token),
                description: item.Chart.trendata_chart_is_kueri ? item.Chart.trendata_chart_description_token : TranslationModel.getTranslation(item.Chart.trendata_chart_description_token),
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
                    req: req,
                    commonChartData: commonChartData,
                    Error: Error,
                    _: _,
                    translation: translation,
                    separateThread: separateThread,
                    moment: require('moment')
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

                                return jsVm(sqlTemplate.trendata_sql_query_custom_source, rows, {
                                    contextProps: context
                                });
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

                return Promise.props(data);
            }).then(function (data) {
                switch(data.chart_type){
                    case '1':
                        /**
                         * Add Fusion chart decimal point in Charts data
                         * Since we need this in all charts, so instead of adding in DB, add here
                         */
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
            return ConnectorCsvModel.findOne({
                where: {
                    trendata_connector_csv_type: 'tuff',
                    trendata_connector_csv_file_type: 'users',
                    trendata_user_id: req.parentUser.trendata_user_id
                }
            }).then(function (lastFile) {
                if (lastFile) {
                    return dateFormat(lastFile.updated_at, 'mmmm d, yyyy');
                }
                return null;
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

        DashboardChartModel.findOne({
            include: [
                {
                    model: ChartModel,
                    required: true,
                    where: {
                        'trendata_chart_id': chartId
                    }
                },
                {
                    model: DashboardModel,
                    required: true,
                    where: {
                        'trendata_dashboard_id': dashboardId
                    }
                }
            ]
        }).then(function (dashboardChart) {
            if (dashboardChart) {
                throw new HttpResponse({
                    status: 'success',
                    created: false
                });
            }

            return Promise.props({
                chart: ChartModel.findById(chartId),
                dashboard: DashboardModel.findById(dashboardId)
            });
        }).then(function (data) {
            if (! data.chart || ! data.dashboard) {
                throw new HttpResponse({
                    message: 'Chart or Dashboard not found'
                }, 400);
            }

            data.dashboardChart = DashboardChartModel.create({
                trendata_dashboard_chart_order: 0
            });

            return Promise.props(data);
        }).then(function (data) {
            return Promise.all([
                data.dashboardChart.setChart(data.chart),
                data.dashboardChart.setDashboard(data.dashboard)
            ]);
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
    apiCallTrack(function (trackApi) {
        var chartId = req.body.chart_id;
        var dashboardId = req.body.dashboard_id || 1;

        DashboardChartModel.count({
            where: {
                trendata_dashboard_id: dashboardId,
                trendata_chart_id: chartId
            }
        }).then(function (count) {
            if (!count) {
                return Promise.reject(new HttpResponse({
                    success: false,
                    message: 'Chart not found'
                }, 404));
            }

            return DashboardChartModel.destroy({
                where: {
                    trendata_dashboard_id: dashboardId,
                    trendata_chart_id: chartId
                }
            })
        }).then(function () {
            return ChartModel.findByPrimary(chartId).then(function (chart) {
                console.log(chart.trendata_chart_is_kueri, typeof chart.trendata_chart_is_kueri);

                if (chart.trendata_chart_is_kueri) {
                    return chart.destroy();
                }
            });
        }).then(function (rows) {
            trackApi(req);
            res.json({
                status: 'success',
                chart_id: chartId,
                dashboard_id: dashboardId
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
 function setChartsOrder(req, res) {
    apiCallTrack(function (trackApi) {
        var dashboardId = req.params.id;
        Promise.resolve(req.body).map(function(chart) {
            DashboardChartModel.update({
               x: +chart.chartX,
               y: +chart.chartY,
               trendata_dashboard_chart_width: +chart.chartWidth,
               trendata_dashboard_chart_height: +chart.chartHeight
            }, {
                where: {
                   trendata_dashboard_id: dashboardId,
                   trendata_chart_id: +chart.chartId
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
        var dashboardId = req.params.id;
        Promise.resolve(req.body).then(function(chart) {
            DashboardChartModel.update({
               trendata_dashboard_chart_width: +chart.chartWidth,
               trendata_dashboard_chart_height: +chart.chartHeight
            }, {
                where: {
                   trendata_dashboard_id: dashboardId,
                   trendata_chart_id: +chart.chartId
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
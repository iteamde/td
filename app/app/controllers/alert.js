require('../config/global');
var jsVm = require('../components/js-virtual-machine');
var commonChartData = require('../components/common-chart-data');
var loadChartModuleSrc = require('../components/load-chart-module-src');
var translation = require('../components/translation');
var separateThread = require('../components/separate-thread');
var AlertModel = require('../models/orm-models').Alert;
var ChartModel = require('../models/orm-models').Chart;
var UserModel = require('../models/orm-models').User;
var SqlQueryModel = require('../models/orm-models').SqlQuery;
var apiCallTrack = require('../components/api-call-track');
var mailer = require('../components/mailer');
var orm = require('../components/orm/orm');
var ORM = require('sequelize');
var moment = require('moment');

module.exports = {
    getAlertsList: getAlertsList,
    createAlert: createAlert,
    deleteAlert: deleteAlert,
    setAlertStatus: setAlertStatus,
    checkAlerts: checkAlerts
}

function getAlertsList(req, res) {
    apiCallTrack(function (trackApi) {
        AlertModel.findAll({
            where: {
                trendata_alert_user_id: req.user.trendata_user_id
            }
        }).map(function(alert) {
            return {
                id: alert.trendata_alert_id,
                name: alert.trendata_alert_name,
                trigger: alert.trendata_alert_trigger,
                filters: alert.trendata_alert_filters,
                status: alert.trendata_alert_status
            };
        }).then(function(rows) {
            trackApi(req);
            res.json(rows);
        }).catch(function (err) {
            trackApi(req, err);
            res.status(500).json(err.stack);
        });
    });
};

function createAlert(req, res) {
    apiCallTrack(function (trackApi) {
        AlertModel.create({
            trendata_alert_name: req.body.name,
            trendata_alert_type: req.body.type,
            trendata_alert_user_id: req.user.trendata_user_id,
            trendata_alert_criteria: req.body.criteria,
            trendata_alert_chart_id: req.body.chartId,
            trendata_alert_chart_type_id: req.body.chartType,
            trendata_alert_chart_view: req.body.chartView,
            trendata_alert_chart_view_item: req.body.chartViewItem,
            trendata_alert_trigger: req.body.trigger,
            trendata_alert_filters: req.body.filters ? JSON.stringify(req.body.filters) : null,
            trendata_alert_condition: req.body.condition,
            trendata_alert_value: req.body.value,
            trendata_alert_points: req.body.points,
            trendata_alert_date: req.body.date,
        }).then(function(alert) {
            trackApi(req);
            res.json({
                id: alert.trendata_alert_id,
                name: alert.trendata_alert_name,
                trigger: alert.trendata_alert_trigger,
                filters: alert.trendata_alert_filters,
                status: alert.trendata_alert_status
            });
        }).catch(function(err) {
            trackApi(req, err);
            res.status(500).json(err.stack);
        });
    });
};

function deleteAlert(req, res) {
    apiCallTrack(function (trackApi) {
        AlertModel.destroy({
            where: {
                trendata_alert_id: req.body.id
            }
        }).then(function() {
            trackApi(req);
            res.send(req.body.id.toString());
        }).catch(function(err) {
            trackApi(req, err);
            res.status(500).json(err.stack);
        });
    });
};

function setAlertStatus(req, res) {
    apiCallTrack(function(trackApi) {
        AlertModel.update({
            trendata_alert_status: req.body.status
        }, {
            where: {
                trendata_alert_id: req.body.id
            }
        }).then(function(alert) {
            trackApi(req);
            res.json({
                status: req.body.status
            });
        }).catch(function(err) {
            trackApi(req, err);
            res.status(500).json(err.stack);
        });
    });
};

function checkAlerts(type, date) {
    return AlertModel.findAll({
        where: {
            trendata_alert_type: type,
            trendata_alert_status: 1,
            trendata_alert_date: type == 0 ? null : date
        }
    }).each(function(alert) {
        getChartData(alert).then(function(data) {
            var criteria = alert.trendata_alert_criteria || 'Total';
            var value = 0;
            if (data[criteria] && data[criteria].length) {
                value = alert.trendata_alert_points < 2 ? data[criteria][0] : Math.abs(data[criteria][0] - data[criteria][1]);
            }

            if (alert.trendata_alert_type == 1) {
                sendMail(alert, criteria, value);
                return;
            }

            switch (alert.trendata_alert_condition) {
                case '>':
                    if (value > alert.trendata_alert_value)
                        sendMail(alert, criteria, value);
                    break;
                case '<':
                    if (value < alert.trendata_alert_value)
                        sendMail(alert, criteria, value);
                    break;
                case '=':
                    if (value == alert.trendata_alert_value)
                        sendMail(alert, criteria, value);
                    break;
            }
        });
    });
};

function getChartData(alert) {
    switch (alert.trendata_alert_chart_type_id) {
        case 1:
            return getMetricChartData(alert.trendata_alert_chart_id);
        case 2:
            return getDrilldownChartData(alert.trendata_alert_chart_id, alert.trendata_alert_points, alert.trendata_alert_chart_view, alert.trendata_alert_chart_view_item, alert.trendata_alert_filters);
        default:
            return getAnalyticsChartData(alert.trendata_alert_chart_id, alert.trendata_alert_points, alert.trendata_alert_filters);
    }
}

function getMetricChartData(chartId) {
    var req = {
        method: 'GET',
        query: {
            end: -1
        },
        parentUser: {
            trendata_user_id: 1
        }
    };

    return ChartModel.findOne({
        where: {
            trendata_chart_id: chartId
        },
        include: [{
            model: SqlQueryModel,
            require: false
        }]
    }).then(function(chart) {
        var sqlTemplate = chart.SqlQuery;

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
            moment: require('moment'),
            knex: require('../components/knex'),
            fromDashboard: false
        };

        if (sqlTemplate && (sqlTemplate.trendata_sql_query_custom_source || sqlTemplate.trendata_sql_query_module_path)) {
            return Promise.resolve().then(function () {
                if (sqlTemplate.trendata_sql_query_module_path) {
                    return loadChartModuleSrc(sqlTemplate.trendata_sql_query_module_path).then(function (code) {
                        return jsVm(code, undefined, {
                            contextProps: context
                        }).then(function(item) {
                            if (item.data) { //value_box OR doughnut2d
                                if (item.data.length > 1) { //percentage for doughnut2d
                                    let sum = _.sumBy(item.data, 'value');

                                    return Promise.reduce(item.data, function(accum, data) {
                                        accum[data.label] = [_.round(100 * data.value / sum, 1)];

                                        return accum;
                                    }, {});
                                } else { //value_box
                                    return Promise.resolve({
                                        Total: [item.data.length ? item.data[0].value.toString().replace(/[^0-9.]+/g, '') : 0] //trim
                                    });
                                }
                            } else { // scrollcolumn2d
                                if (item.dataset.length > 1) {
                                    return Promise.reduce(item.dataset, function(accum, dataset) {
                                        accum[dataset.seriesname] = [dataset.data[0].value];

                                        return accum;
                                    }, {});
                                } else {
                                    return Promise.reduce(item.categories[0].category, function(accum, category, index) {
                                        accum[category.label] = [item.dataset[0].data[index].value];

                                        return accum;
                                    }, {});
                                }
                            }
                        });
                    });
                }

                return jsVm(sqlTemplate.trendata_sql_query_custom_source, undefined, {
                    contextProps: context
                });
            });
        }
    });
}


function getDrilldownChartData(chartId, points, chartView, chartViewItem, filters) {
    var req = {
        method: 'POST',
        body: {
            type: 'change_chart_view',
            data: {
                chart_view: chartView,
                filters: JSON.parse(filters),
                user_pagination: undefined,
                regression_analysis: undefined,
                summary: false,
                vertical_axis_type: points == 1 ? 'values' : 'percentage (%)'
            }
        },
        parentUser: {
            trendata_user_id: 1
        }
    };

    return ChartModel.findOne({
        where: {
            trendata_chart_id_parent: chartId,
            trendata_chart_type_id: 2
        },
        include: [{
            model: SqlQueryModel,
            require: false
        }]
    }).then(function(chart) {
        var sqlTemplate = chart.SqlQuery;

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
            moment: require('moment'),
            knex: require('../components/knex'),
            sqlstring: require('sqlstring'),
            selfId: chart.trendata_chart_id,
            fromDashboard: false
        };

        if (sqlTemplate && (sqlTemplate.trendata_sql_query_custom_source || sqlTemplate.trendata_sql_query_module_path)) {
            return Promise.resolve().then(function () {
                if (sqlTemplate.trendata_sql_query_module_path) {
                    return loadChartModuleSrc(sqlTemplate.trendata_sql_query_module_path).then(function (code) {
                        return jsVm(code, undefined, {
                            contextProps: context
                        }).then(function(item) {
                            let index = _.findIndex(item.chart_data.categories[0].category, {label: chartViewItem});
                            return Promise.reduce(item.chart_data.dataset, function(accum, dataset) {
                                accum[dataset.seriesname] = [_.map(dataset.data, 'value')[index]];

                                return accum;
                            }, {});
                        });
                    });
                }

                return jsVm(sqlTemplate.trendata_sql_query_custom_source, undefined, {
                    contextProps: context
                });
            });
        }
    });
}

function getAnalyticsChartData(chartId, points, filters) {
    var req = {
        method: 'POST',
        body: {
            type: 'change_chart_view',
            data: {
                chart_view: undefined,
                filters: JSON.parse(filters),
                user_pagination: undefined,
                regression_analysis: undefined,
                summary: false,
                time_span: {
                    start: points == 2 ? 2 : 1, //set 2 if need prev month
                    end: 1
                },
                vertical_axis_type: points == 1 ? 'values' : 'percentage (%)'
            }
        },
        parentUser: {
            trendata_user_id: 1
        }
    };

    return ChartModel.findOne({
        where: {
            trendata_chart_id_parent: chartId,
            trendata_chart_type_id: 3
        },
        include: [{
            model: SqlQueryModel,
            require: false
        }]
    }).then(function(chart) {
        var sqlTemplate = chart.SqlQuery;

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
            moment: require('moment'),
            knex: require('../components/knex'),
            sqlstring: require('sqlstring'),
            selfId: chart.trendata_chart_id,
            fromDashboard: false
        };

        if (sqlTemplate && (sqlTemplate.trendata_sql_query_custom_source || sqlTemplate.trendata_sql_query_module_path)) {
            return Promise.resolve().then(function () {
                if (sqlTemplate.trendata_sql_query_module_path) {
                    return loadChartModuleSrc(sqlTemplate.trendata_sql_query_module_path).then(function (code) {
                        return jsVm(code, undefined, {
                            contextProps: context
                        }).then(function(item) {
                            return Promise.reduce(item.chart_data.dataset, function(accum, dataset) {
                                let values = _.map(dataset.data, 'value');
                                accum[dataset.seriesname] = [values.pop(), values.pop()];

                                return accum;
                            }, {});
                        });
                    });
                }

                return jsVm(sqlTemplate.trendata_sql_query_custom_source, undefined, {
                    contextProps: context
                });
            });
        }
    });
}

function sendMail(alert, criteria, value) {
    UserModel.findOne({
        where: {
            trendata_user_id: alert.trendata_alert_user_id
        }
    }).then(function(user) {
        let metricName =  alert.trendata_alert_trigger.match(/^<b>[\w ]*/);
        let today = moment().format('MM/DD/YYYY');
        let hostName = 'https://' + HOST;
        let mailText = '<p>Dear ' + user.trendata_user_firstname + ',</p>' +
            '<p>TrenData Alert: "' + alert.trendata_alert_name + '" shows ' +
            value + ' on ' + today + '.</p>' +
            '<p>To view more details, login to <a href="' + hostName + '">' + hostName + '</a></p>' +
            '<p>Regards,<br>TrenData Administration</p>';
        mailer({
            to: user.trendata_user_email,
            subject: 'Alert - ' + alert.trendata_alert_trigger.replace(/<b>/g, '').replace(/<\/b>/g, ''),
            html: mailText
        });
    });
}
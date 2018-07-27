var loadChartModuleSrc = require('../components/load-chart-module-src');
var orm = require('../components/orm/orm');
var ORM = require('sequelize');
var jsVm = require('../components/js-virtual-machine');
var pythonShell = require('../components/python-shell');
var commonChartData = require('../components/common-chart-data');
var translation = require('../components/translation');
var apiCallTrack = require('../components/api-call-track');
var separateThread = require('../components/separate-thread');
var HttpResponse = require('../components/http-response');
var ChartModel = require('../models/orm-models').Chart;
var DashboardChartModel = require('../models/orm-models').DashboardChart;
var SqlQueryModel = require('../models/orm-models').SqlQuery;
var ChartTypeModel = require('../models/orm-models').ChartType;
var TranslationModel = require('../models/orm-models').Translation;
var ChartDisplayTypeModel = require('../models/orm-models').ChartDisplayType;
var colors = require('./../components/colors');

module.exports = {
    /**
     * @param req
     * @param res
     */
    getSubChart: function (req, res) {
        apiCallTrack(function (trackApi) {
            var type = req.params.type;
            var chartId = req.params.id;
            var dashboardChartId = req.params.dashboardChartId || null;

            Promise.all([
                ChartModel.findOne({
                    where: {
                        trendata_chart_id_parent: chartId
                    },
                    include: [
                        {
                            model: ChartTypeModel,
                            required: true,
                            where: {
                                trendata_chart_type_name: type
                            },
                            attributes: []
                        },
                        {
                            model: ChartDisplayTypeModel,
                            required: true
                        },
                        {
                            model: SqlQueryModel,
                            required: false
                        }
                    ]
                }),
                dashboardChartId ? DashboardChartModel.findOne({
                    where: {
                        trendata_dashboard_chart_id: dashboardChartId
                    }
                }) : null
            ]).spread(function (chart, dashboardChart) {
                return {
                    id:             chart.trendata_chart_id,
                    created_on:     chart.created_at,
                    status:         chart.trendata_chart_status,
                    default_chart_display_type: chart.ChartDisplayType.trendata_chart_display_type_key,
                    position_x:     chart.trendata_chart_position_x,
                    position_y:     chart.trendata_chart_position_y,
                    width:          chart.trendata_chart_width,
                    height:         chart.trendata_chart_height,
                    chart_type:     chart.trendata_chart_type,
                    available_views: chart.trendata_chart_available_views,
                    title:          dashboardChart && dashboardChart.trendata_dashboard_chart_title || TranslationModel.getTranslation(chart.trendata_chart_title_token),
                    description:    dashboardChart && dashboardChart.trendata_dashboard_chart_description || TranslationModel.getTranslation(chart.trendata_chart_description_token),
                    sql_template:   chart.SqlQuery,
                    from_dashboard: !!dashboardChart,
                    chart_view:     dashboardChart && dashboardChart.trendata_dashboard_chart_view || chart.trendata_chart_view,
                    filters:        dashboardChart && dashboardChart.trendata_dashboard_chart_filters || undefined,
                    time_span:      dashboardChart && dashboardChart.trendata_dashboard_chart_time_span || undefined,
                    vertical_axis_type: dashboardChart && dashboardChart.trendata_dashboard_chart_vertical_axis || undefined,
                    regression_analysis: dashboardChart && dashboardChart.trendata_dashboard_chart_regression || undefined,
                    hide_empty:     dashboardChart && dashboardChart.trendata_dashboard_chart_hide_empty || undefined
                };
            }).then(function (data) {
                var sqlTemplate = data.sql_template;
                delete data.sql_template;

                var context = {
                    orm: orm,
                    ORM: ORM,
                    ormModels: require('../models/orm-models'),
                    Date: Date,
                    JSON: JSON,
                    req: req,
                    pythonShell: pythonShell,
                    commonChartData: commonChartData,
                    Error: Error,
                    _: _,
                    translation: translation,
                    separateThread: separateThread,
                    moment: require('moment'),
                    selfId: data.id,
                    defaultChartView: data.chart_view,
                    availableChartViews: data.available_views,
                    knex: require('../components/knex'),
                    sqlstring: require('sqlstring'),
                    fromDashboard: data.from_dashboard,
                    reqData: data.from_dashboard && {
                        data: {
                            chart_view: data.chart_view,
                            filters: data.filters && JSON.parse(data.filters),
                            vertical_axis_type: data.vertical_axis_type,
                            time_span: data.time_span && JSON.parse(data.time_span),
                            regression_analysis: data.regression_analysis,
                            hide_empty: data.hide_empty,
                        }
                    },
                    colors: colors,
                };

                if (sqlTemplate && sqlTemplate.trendata_sql_query_template && (sqlTemplate.trendata_sql_query_custom_source || sqlTemplate.trendata_sql_query_module_path)) {
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
                }

                return Promise.props(data);
            }).then(function (data) {
                trackApi(req);
                res.json(data);
            }).catch(HttpResponse, function (err) {
                trackApi(req);
                err.json(res);
            }).catch(function (err) {
                trackApi(req, err);
                res.status(500).send(err.stack);
            });
        });
    }
};

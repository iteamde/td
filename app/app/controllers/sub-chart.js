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
var SqlQueryModel = require('../models/orm-models').SqlQuery;
var ChartTypeModel = require('../models/orm-models').ChartType;
var TranslationModel = require('../models/orm-models').Translation;
var ChartDisplayTypeModel = require('../models/orm-models').ChartDisplayType;

module.exports = {
    /**
     * @param req
     * @param res
     */
    getSubChart: function (req, res) {
        apiCallTrack(function (trackApi) {
            var type = req.params.type;
            var chartId = req.params.id;

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
            }).then(function (chart) {
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
                    title:          TranslationModel.getTranslation(chart.trendata_chart_title_token),
                    description:    TranslationModel.getTranslation(chart.trendata_chart_description_token),
                    sql_template:   chart.SqlQuery,
                    chart_view:     chart.trendata_chart_view,
                    available_views: chart.trendata_chart_available_views
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
                    sqlstring: require('sqlstring')
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

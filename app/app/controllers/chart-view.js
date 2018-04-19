var apiCallTrack = require('../components/api-call-track');
var commonChartData = require('../components/common-chart-data');
var ChartModel = require('../models/orm-models').Chart;
var ChartTypeModel = require('../models/orm-models').ChartType;
var TranslationModel = require('../models/orm-models').Translation;

module.exports = {
    getChartViews: function(req, res) {
        apiCallTrack(function (trackApi) {
            commonChartData.getCustomFields().then(function (customFields) {
                ChartModel.findAll({
                    where: {
                        trendata_chart_id_parent: null
                    },
                    include: [
                        {
                            model: ChartModel,
                            as: 'ChildCharts',
                            required: false,
                            include: [
                                {
                                    model: ChartTypeModel,
                                    required: true,
                                    where: {

                                    }
                                }
                            ]
                        }
                    ]
                }).map(function(chart) {
                    let drilldown = _.find(chart.ChildCharts, function(subchart) {
                        return subchart.ChartType.trendata_chart_type_name === 'drilldown'
                    });
                    let analytics = _.find(chart.ChildCharts, function(subchart) {
                        return subchart.ChartType.trendata_chart_type_name === 'analytics'
                    });

                    let availableDrilldownViews = drilldown && drilldown.trendata_chart_available_views ? drilldown.trendata_chart_available_views.split(',') : ['gender'];
                    availableDrilldownViews = availableDrilldownViews.concat(customFields);

                    let availableAnalyticsViews = analytics && analytics.trendata_chart_available_views ? analytics.trendata_chart_available_views.split(',') : ['total'];
                    if (availableAnalyticsViews.length > 1)
                        availableAnalyticsViews = availableAnalyticsViews.concat(customFields);

                    return {
                        id: chart.trendata_chart_id,
                        title: chart.trendata_chart_title_token,
                        drilldownView: drilldown && drilldown.trendata_chart_view || 'gender',
                        analyticsView: analytics && analytics.trendata_chart_view || 'total',
                        availableDrilldownViews: availableDrilldownViews,
                        availableAnalyticsViews: availableAnalyticsViews,
                    };
                }).then(function (rows) {
                    trackApi(req);
                    res.json(rows);
                }).catch(function (err) {
                    trackApi(req, err);
                    res.status(500).send(err.stack);
                });
            });
        });
    },

    // getAvailableChartViews: function(req, res) {
    //     apiCallTrack(function(trackApi) {
    //         commonChartData.getCustomFields().then(function (chartViews) {
    //             trackApi(req);
    //             res.json(['performance', 'city', 'state', 'country', 'department', 'division', 'cost center', 'gender', 'job level'].concat(chartViews));
    //         }).catch(function(err) {
    //             trackApi(req, err);
    //             res.status(500).send(err.stack);
    //         });
    //     });
    // },

    updateChartViews: function(req, res) {
        apiCallTrack(function(trackApi) {
            Promise.each(req.body, function(chart) {
                return Promise.all([
                    ChartModel.update({
                        trendata_chart_view: chart.analyticsView
                    }, {
                        where: {
                            trendata_chart_id_parent: chart.id,
                            trendata_chart_type_id: 3 //Analytics
                        }
                    }),
                    ChartModel.update({
                        trendata_chart_view: chart.drilldownView
                    }, {
                        where: {
                            trendata_chart_id_parent: chart.id,
                            trendata_chart_type_id: 2 //Drilldown
                        }
                    })
                ]);
            }).then(function() {
                trackApi(req);
                res.send('success');
            }).catch(function(err) {
                trackApi(req, err);
                res.status(500).send(err.stach);
            });
        });
    }
}
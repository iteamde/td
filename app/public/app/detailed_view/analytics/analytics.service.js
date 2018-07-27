(function () {

    'use strict';

    angular
        .module('app.analytics')
        .factory('analyticsService', analyticsService);

    analyticsService.$inject = ['BASE_URL', '$http', 'commonService'];

    function analyticsService(BASE_URL, $http, commonService) {

        return {
            getCharts: getCharts,
            getCurvePoints: getCurvePoints,
            createFilter: createFilter,
            changeChart: changeChart,
            exportUsersToCsv: exportUsersToCsv,
            exportSummaryToCsv: exportSummaryToCsv,
            getMonths: getMonths,
            addToDashboard: addToDashboard
        };

        function getCharts(id, dashboartChartId) {
            var apiUrl = BASE_URL + "sub-chart/analytics/" + id;
            if (dashboartChartId)
                apiUrl += '/' + dashboartChartId;

            return $http.get(apiUrl);
        }

        function getCurvePoints(id, data) {
            var apiUrl = BASE_URL + "sub-chart/analytics/" + id;
            return $http.post(apiUrl, data);
        }

        function changeChart(options) {
            var apiUrl = BASE_URL + "sub-chart/analytics/" + options.id;
            var req = {
                type: options.type,
                data: {
                    chart_view: options.view,
                    time_span: options.time_span,
                    vertical_axis_type: options.axis,
                    filters: {},
                    user_pagination: options.user_pagination,
                    regression_analysis: options.regression
                }
            };

            angular.extend(req.data.filters, extendReq(options.filter));
            return $http.post(apiUrl, req);
        }


        function createFilter(filters, _filters) {
            var obj = {};

            _.each(filters, function (value, key) {
                obj[key] = {};
                obj[key].values = {};
                obj[key].all = true;
                _.each(value, function(v) {
                    obj[key].values[v] = _filters && _filters[key] ? _filters[key].indexOf(v === null ? 'null' : v.toString()) > -1 : true;
                    if (! obj[key].values[v])
                        obj[key].all = false;
                })
            });

            return obj;
        }

        function extendReq(filter) {
            var serverFilter = {};

            _.each(filter, function (value, name) {
                var keys = _.keys(value.values);

                serverFilter[name] = _.filter(keys, function (key) {
                    return value.values[key];
                });
            });

            return serverFilter;
        }

        function exportUsersToCsv(filters, pagination, usersFilter, chartId) {
            return commonService.exportUsersToCsv(extendReq(filters), pagination, usersFilter, chartId);
        }

        function exportSummaryToCsv(filters) {
            return commonService.exportSummaryToCsv(extendReq(filters));
        }

        function getMonths(index) {
            return moment().subtract(index, 'month').format('MMMM');
        }

        function addToDashboard(options) {
            var req = {
                chart_id: options.chart_id,
                dashboard_id: options.dashboard_id,
                chart_title: options.chart_title,
                chart_description: options.chart_description,
                chart_view: options.chart_view,
                time_span: options.time_span,
                vertical_axis: options.vertical_axis,
                regression: options.regression,
                filters: {}
            }
            angular.extend(req.filters, extendReq(options.filters));

            return commonService.addToDashboard(req);
        }
    }
})();
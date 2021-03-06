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
            getMonths: getMonths
        };

        function getCharts(id) {
            var apiUrl = BASE_URL + "sub-chart/analytics/" + id;
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


        function createFilter(filters) {
            var obj = {};

            _.each(filters, function (value, key) {
                obj[key] = {};
                obj[key].values = {};
                obj[key].all = true;
                _.each(value, function(v) {
                    obj[key].values[v] = true;
                })
            });

            return obj;
        }

        function extendReq(filter) {
            var serverFilter = {};

            _.each(filter, function (value, name) {
                var keys = _.keys(value.values);

                if (keys.length === 1 && keys[0] === 'null')
                    return;

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
    }
})();
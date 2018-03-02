(function () {

    'use strict';

    angular
        .module('app.analytics')
        .factory('analyticsService', analyticsService);

    analyticsService.$inject = ['BASE_URL', '$http'];

    function analyticsService(BASE_URL, $http) {

        return {
            getCharts: getCharts,
            getCurvePoints: getCurvePoints,
            createFilter: createFilter,
            changeChart: changeChart,
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
                type: 'change_filters',
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

                serverFilter[name] = _.filter(keys, function (key) {
                    return value.values[key];
                })
            });

            return serverFilter;
        }

        function getMonths(index) {
            return moment().subtract(index, 'month').format('MMMM');
        }
    }
})();
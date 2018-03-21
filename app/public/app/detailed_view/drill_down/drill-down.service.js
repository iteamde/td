(function () {

    'use strict';

    angular
        .module('app.drillDown')
        .factory('drillDownService', drillDownService);

    drillDownService.$inject = ['BASE_URL', '$http', 'commonService'];

    function drillDownService(BASE_URL, $http, commonService) {

        return {
            getCharts: getCharts,
            changeChart: changeChart,
            createFilter: createFilter,
            changePage: changePage,
            exportUsersToCsv: exportUsersToCsv
        };

        function getCharts(id) {
            var apiUrl = BASE_URL + "sub-chart/drilldown/" + id;
            return $http.get(apiUrl);
        }

        function changeChart(options) {

            var apiUrl = BASE_URL + "sub-chart/drilldown/" + options.id;
            var req = {
                type: options.type,
                data: {
                    chart_view: options.view,
                    vertical_axis_type: options.axis,
                    filters: {},
                    user_pagination: options.user_pagination
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
                })
            });

            return serverFilter;
        }

        function changePage(id, filter, page) {
            var apiUrl = BASE_URL + "sub-chart/drilldown/" + id;
            var req = {
                type: 'change_pagination',
                data: {
                    filters: {},
                    user_pagination: page
                }
            };

            angular.extend(req.data.filters, extendReq(filter));

            return $http.post(apiUrl, req);
        }

        function exportUsersToCsv(filters, pagination, usersFilter, chartId) {
            return commonService.exportUsersToCsv(extendReq(filters), pagination, usersFilter, chartId);
        }
    }
})();
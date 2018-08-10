(function () {

    'use strict';

    angular
        .module('app.drillDownSurveys')
        .factory('drillDownServiceSurveys', drillDownServiceSurveys);

    drillDownServiceSurveys.$inject = ['BASE_URL', '$http', 'commonService'];

    function drillDownServiceSurveys(BASE_URL, $http, commonService) {

        return {
            getCharts: getCharts,
            changeChart: changeChart,
            createFilter: createFilter,
            changePage: changePage,
            exportUsersToCsv: exportUsersToCsv,
            addToDashboard: addToDashboard
        };

        function getCharts(id, dashboartChartId) {
            var apiUrl = BASE_URL + "sub-chart/drilldown/" + id;
            if (dashboartChartId)
                apiUrl += '/' + dashboartChartId;

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

        function addToDashboard(options) {
            var req = {
                chart_id: options.chart_id,
                dashboard_id: options.dashboard_id,
                chart_title: options.chart_title,
                chart_description: options.chart_description,
                chart_view: options.chart_view,
                time_span: options.time_span,
                vertical_axis: options.vertical_axis,
                hide_empty: options.hide_empty,
                filters: {}
            }
            angular.extend(req.filters, extendReq(options.filters));

            return commonService.addToDashboard(req);
        }
    }
})();
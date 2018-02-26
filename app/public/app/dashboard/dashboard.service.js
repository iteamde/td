(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .factory('dashboardService', dashboardService);

    dashboardService.$inject = ['BASE_URL', '$http'];

    function dashboardService(BASE_URL, $http) {

        var service = {
            getDashboardCharts: getDashboardCharts,
            setChartsOrder: setChartsOrder,
            setChartSize: setChartSize,
            removeChart: removeChart
        };

        return service;

        function getDashboardCharts(dashboard_id, period) {
            var apiUrl = BASE_URL + "dashboard/dashboardCharts";
            return $http.get(apiUrl, {
                params: {
                    dashboard_id: dashboard_id,
                    start: period && period.start || null,
                    end: period && period.end || null
                }
            });
        }

        function setChartsOrder(data, dashboard_id) {
            var apiUrl = BASE_URL + "dashboard/set-charts-order/" + dashboard_id;
            return $http.post(apiUrl, data);
        }

        function setChartSize(data, dashboard_id) {
            var apiUrl = BASE_URL + "dashboard/set-chart-size/" + dashboard_id;
            return $http.post(apiUrl, data);
        }

        function removeChart(dashboard_id, chart_id) {
            var apiUrl = BASE_URL + "dashboard/remove-chart";
            return $http.post(apiUrl, {
                dashboard_id: dashboard_id,
                chart_id: chart_id
            });
        }
    }
})();
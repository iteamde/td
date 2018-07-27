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

        function setChartsOrder(data) {
            var apiUrl = BASE_URL + "dashboard/set-charts-order";
            return $http.post(apiUrl, data);
        }

        function setChartSize(data) {
            var apiUrl = BASE_URL + "dashboard/set-chart-size";
            return $http.post(apiUrl, data);
        }

        function removeChart(id) {
            var apiUrl = BASE_URL + "dashboard/remove-chart";
            return $http.post(apiUrl, {
                id: id
            });
        }
    }
})();
(function () {

    'use strict';

    angular
        .module('app.metric')
        .factory('metricService', metricService);

    metricService.$inject = ['BASE_URL', '$http'];

    function metricService(BASE_URL, $http) {

        return {
            getMetricCharts: getMetricCharts,
            setChartsOrder: setChartsOrder,
            addToDashboard: addToDashboard
        };

        function getMetricCharts(metric_id) {
            var apiUrl = BASE_URL + "metrics/metriccharts";
            return $http.get(apiUrl, {
                params: {metric_id: metric_id}
            });
        }

        function setChartsOrder(data, metric_id) {
            var apiUrl = BASE_URL + "metrics/set-charts-order/" + metric_id;
            return $http.post(apiUrl, data);
        }

        function addToDashboard(data) {
            var apiUrl = BASE_URL + "dashboard/attach-chart";
            return $http.post(apiUrl, data);
        }


    }
})();
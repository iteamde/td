(function () {

    'use strict';

    angular
        .module('app.default_chart_view')
        .factory('defaultChartVieweService', defaultChartVieweService);

    defaultChartVieweService.$inject = ['BASE_URL', '$http'];

    function defaultChartVieweService(BASE_URL, $http) {
        return {
            getChartViews: function() {
                var apiUrl = BASE_URL + 'default_chart_view';
                return $http.get(apiUrl);
            },

            updateChartView: function(data) {
                var apiUrl = BASE_URL + 'update_chart_view';
                return $http.post(apiUrl, data);
            }
        };
    }
})();
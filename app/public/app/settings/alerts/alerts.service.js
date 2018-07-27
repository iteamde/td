(function () {

    'use strict';

    angular
        .module('app.alerts')
        .factory('alertsService', alertsService);

    alertsService.$inject = ['BASE_URL', '$http', '$uibModal'];

    function alertsService(BASE_URL, $http, $uibModal) {

        return {
            createAlert: createAlert,
            getAlerts: getAlerts,
            deleteAlert: deleteAlert,
            setAlertStatus: setAlertStatus,
            openModal: openModal
        };

        function createAlert(alert) {
            var apiUrl = BASE_URL + 'alert/create-alert';
            return $http.post(apiUrl, alert);
        }

        function getAlerts() {
            var apiUrl = BASE_URL + 'alert/alertlist';
            return $http.get(apiUrl);
        }

        function deleteAlert(id) {
            var apiUrl = BASE_URL + 'alert/delete-alert';
            return $http.post(apiUrl, { id: id });
        }

        function setAlertStatus(id, status) {
            var apiUrl = BASE_URL + 'alert/set-status',
                alert = { id: id, status: status };

            return $http.post(apiUrl, alert);
        }

        function openModal($scope, chartId, chart, chartType, filters, chartView) {
            var dataset = [];
            var chartViewItems = [];

            switch (chartType) {
                case 1:
                    switch (chart.default_chart_display_type) {
                        case 'doughnut2d':
                            dataset = _.map(chart.chart_data.data, 'label');
                            break;
                        case 'scrollcolumn2d':
                            dataset = chart.chart_data.dataset.length > 1 ?
                                _.map(chart.chart_data.dataset, 'seriesname') :
                                _.map(chart.chart_data.categories[0].category, 'label');
                            break;
                    }
                    break;
                case 2:
                    dataset = _.map(chart.chart_data.dataset, 'seriesname');
                    chartViewItems = _.map(chart.chart_data.categories[0].category, 'label');
                    break;
                case 3:
                    dataset = _.map(chart.chart_data.dataset, 'seriesname');
            }
            
            if (! _.compact(dataset).length)
                dataset = ['Total'];

            var modalInstance = {
                animation: false,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/settings/alerts/alerts-modal/alerts.modal.view.html',
                controller: 'ModalAlertsController',
                controllerAs: 'vm',
                size: 'lg',
                scope: $scope,
                resolve: {
                    chartId: function() { return chartId; },
                    chartType: function() { return chartType; },
                    title: function() { return chart.title; },
                    dataset: function () { return dataset; },
                    filters: function () { return filters; },
                    chartView: function() { return chartView; },
                    chartViewItems: function() { return chartViewItems; }
                }
            };

            $uibModal.open(modalInstance);
        }

    }

})();
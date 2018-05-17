(function () {

    'use strict';

    angular
        .module('app.nlpSearch')
        .controller('NlpModalAddToDashboard', NlpModalAddToDashboard);

    NlpModalAddToDashboard.$inject = ['$scope', 'config', 'nlpSearchService', 'commonService', 'TOOLTIP_MESSAGES', '$uibModalInstance'];

    function NlpModalAddToDashboard($scope, config, nlpSearchService, commonService, TOOLTIP_MESSAGES, $uibModalInstance) {

        $scope.addToDashboard = addToDashboard;
        $scope.metricStyles = config.metrics;
        $scope.metricStylesAll =  ['donut', 'bar', 'single-number'];

        $scope.request = {
            chart_view: config.chartView,
            chart_type: config.metrics[0],
            chart_title: config.title,
            description: '',
            token: config.token,
            fields : config.columns,
            dashboard_id: 1
        };

        function addToDashboard() {
            nlpSearchService.addToDashboard($scope.request)
             .success(addToDashboardSuccess)
             .error(addToDashboardError)
        }

        function addToDashboardSuccess() {
            commonService.notification(TOOLTIP_MESSAGES.TILES.ADD_TO_DASHBOARD_NOTY, "success");
            $uibModalInstance.close();
        }

        function addToDashboardError(err) {
            commonService.notification(err.message, "error");
        }

    }
})();
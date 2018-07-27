(function () {

    'use strict';

    angular
        .module('app.nlpSearch')
        .controller('NlpModalAddToDashboard', NlpModalAddToDashboard);

    NlpModalAddToDashboard.$inject = ['$scope', 'config', 'nlpSearchService', 'commonService', 'TOOLTIP_MESSAGES', '$uibModalInstance', '$rootScope'];

    function NlpModalAddToDashboard($scope, config, nlpSearchService, commonService, TOOLTIP_MESSAGES, $uibModalInstance, $rootScope) {

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
            search_query: config.search_query,
            dashboard_id: $rootScope.dashboardId
        };

        function addToDashboard() {
            nlpSearchService.addToDashboard($scope.request)
             .success(addToDashboardSuccess)
             .error(addToDashboardError)
        }

        function addToDashboardSuccess() {
            commonService.notification($scope.getTranslation('chart_added_successfully'), 'success');
            $uibModalInstance.close();
        }

        function addToDashboardError(err) {
            commonService.notification(err.message, 'error');
        }

    }
})();
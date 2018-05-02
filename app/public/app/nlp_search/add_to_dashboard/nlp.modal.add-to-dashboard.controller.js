(function () {

    'use strict';

    angular
        .module('app.nlpSearch')
        .controller('NlpModalAddToDashboard', NlpModalAddToDashboard);

    NlpModalAddToDashboard.$inject = ['$scope', 'token', 'metricStyles', 'checkedColumns', 'nlpSearchService', 'commonService', 'TOOLTIP_MESSAGES', '$uibModalInstance'];

    function NlpModalAddToDashboard($scope, token, metricStyles, checkedColumns, nlpSearchService, commonService, TOOLTIP_MESSAGES, $uibModalInstance) {

        $scope.addToDashboard = addToDashboard;
        $scope.metricStyles = metricStyles;

        $scope.request = {
            chart_type: metricStyles[0],
            chart_title: '',
            token: token,
            fields : checkedColumns,
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
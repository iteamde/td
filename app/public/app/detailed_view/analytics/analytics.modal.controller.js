(function() {
    'use strict';

    angular
        .module('app.analytics')
        .controller('AnalyticsModalController', AnalyticsModalController);

    AnalyticsModalController.$inject = ['$scope', 'analyticsService', 'commonService', 'addToDashboardOptions', 'exception'];
    function AnalyticsModalController($scope, analyticsService, commonService, addToDashboardOptions, exception) {
        var vm = this;
        vm.options = addToDashboardOptions;

        vm.addToDashboard = function() {
            if (! vm.options.chart_title)
                return;

            analyticsService.addToDashboard(vm.options)
                .success(addToDashboardComplete)
                .catch(serviceError);
        };

        function addToDashboardComplete() {
            $scope.$close();
            commonService.notification($scope.getTranslation('chart_added_successfully'), "success");
        }

        function serviceError(error) {
            exception.catcher('XHR Failed for Analytics')(error);
        }
    }
})();
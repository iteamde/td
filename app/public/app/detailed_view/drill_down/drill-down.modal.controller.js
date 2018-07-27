(function() {
    'use strict';

    angular
        .module('app.drillDown')
        .controller('DrillDownModalController', DrillDownModalController);

    DrillDownModalController.$inject = ['$scope', 'drillDownService', 'commonService', 'addToDashboardOptions', 'exception'];
    function DrillDownModalController($scope, drillDownService, commonService, addToDashboardOptions, exception) {
        var vm = this;
        vm.options = addToDashboardOptions;

        vm.addToDashboard = function() {
            if (! vm.options.chart_title)
                return;

            drillDownService.addToDashboard(vm.options)
                .success(addToDashboardComplete)
                .catch(serviceError);
        };

        function addToDashboardComplete() {
            $scope.$close();
            commonService.notification($scope.getTranslation('chart_added_successfully'), "success");
        }

        function serviceError(error) {
            exception.catcher('XHR Failed for DrillDown')(error);
        }
    }
})();
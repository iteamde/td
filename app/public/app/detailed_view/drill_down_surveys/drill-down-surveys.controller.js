(function () {

    'use strict';

    angular
        .module('app.drillDownSurveys')
        .controller('DrillDownSurveysController', DrillDownSurveysController);

    DrillDownSurveysController.$inject = ['$scope', '$stateParams', 'mockDataService', '$localStorage', 'commonService'];

    function DrillDownSurveysController($scope, $stateParams, mockDataService, $localStorage, commonService) {

        var vm = this;

        vm.isForSurveys = $stateParams.id === '100' ? true : false;
        vm.isGridItemReady = true;

        vm.surveyWidget = mockDataService.getSurveysChart();

        vm.addToDashboard = addToDashboard;

        function addToDashboard() {
            if (!$localStorage.addChart) {
                $localStorage.addChart = true;
                commonService.notification($scope.getTranslation('chart_added_successfully'), "success");
            } else {
                commonService.notification($scope.getTranslation('Chart is already added'), "warning");

            }

        }

    }
})();
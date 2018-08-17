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
        vm.mockUsers = [
            {full_name: 'Aaron Milde', highly_disengaged: 1, Disengaged: 0, Engaged: 0, highly_engaged: 0, no_response: 0},
            {full_name: 'Aaron Pettyjohn', highly_disengaged: 0, Disengaged: 1, Engaged: 0, highly_engaged: 0, no_response: 0},
            {full_name: 'Adam Hesser', highly_disengaged: 0, Disengaged: 0, Engaged: 1, highly_engaged: 0, no_response: 0},
            {full_name: 'A. Joseph Lanser', highly_disengaged: 0, Disengaged: 1, Engaged: 0, highly_engaged: 0, no_response: 0},
            {full_name: 'Aaron Pettyjohn', highly_disengaged: 0, Disengaged: 0, Engaged: 0, highly_engaged: 0, no_response: 1},
            {full_name: 'Robert Milde', highly_disengaged: 1, Disengaged: 0, Engaged: 0, highly_engaged: 0, no_response: 0},
            {full_name: 'Inna Pettyjohn', highly_disengaged: 0, Disengaged: 1, Engaged: 0, highly_engaged: 0, no_response: 0},
            {full_name: 'Adam Gates', highly_disengaged: 0, Disengaged: 0, Engaged: 1, highly_engaged: 0, no_response: 0},
            {full_name: 'Morze Lanser', highly_disengaged: 0, Disengaged: 1, Engaged: 0, highly_engaged: 0, no_response: 0},
            {full_name: 'Ivan Gruda', highly_disengaged: 0, Disengaged: 0, Engaged: 0, highly_engaged: 1, no_response: 0}
        ];

        vm.addToDashboard = addToDashboard;
        vm.cut = cut;

        function addToDashboard() {
            if (!$localStorage.addChart1) {
                $localStorage.addChart1 = true;
                commonService.notification($scope.getTranslation('chart_added_successfully'), 'success');
            } else {
                commonService.notification($scope.getTranslation('Chart is already added'), 'warning');
            }
        }

        function cut(str) {
            return str.replace('_', ' ');
        }

    }
})();
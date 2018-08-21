(function () {

    'use strict';

    angular
        .module('app.drillDownSurveys')
        .controller('AnalyticsSurveysController', AnalyticsSurveysController);

    AnalyticsSurveysController.$inject = ['$scope', '$stateParams', 'mockDataService', '$localStorage', 'commonService', 'analyticsService'];

    function AnalyticsSurveysController($scope, $stateParams, mockDataService, $localStorage, commonService, analyticsService) {

        var vm = this;
        vm.isForSurveys = $stateParams.id === '100' ? true : false;
        vm.isGridItemReady = false;
        vm.surveyWidget = mockDataService.getSurveysChart();

        vm.addToDashboard = addToDashboard;
        vm.cut = cut;
        vm.setActive = setActive;
        vm.updateChart = updateChart;
        vm.changeChartComplete = changeChartComplete;
        $scope.totalUsers = 0;
        vm.view = '';
        vm.activeTab = 0;
        vm.chartViews = [];


        activate();

        function activate() {
            analyticsService.getCharts('29')
                .success(getChartsComplete);
        }

        function getChartsComplete(res) {
            res.chart_data.available_chart_view.forEach(function (item, index, arr) {
                arr[index] = item.replace(/custom/gi, '');
                arr[index] = item.replace(/_/gi, ' ');
            });
            vm.chartViews = res.chart_data.available_chart_view;
            vm.view = vm.chartViews[0];
            vm.surveyWidget[0].chart_data.categories = res.chart_data.chart_data.categories;
            vm.surveyWidget[0].chart_data.dataset = res.chart_data.chart_data.dataset;

            $scope.totalUsers = res.chart_data.users_count;
            $scope.users = res.chart_data.users;
            $scope.customFields = _.chain(res.chart_data.available_filters)
                .keys()
                .filter(function (field) {
                    return field.indexOf('custom') === 0;
                })
                .map(function (field) {
                    return field.slice(7);
                })
                .value();

            vm.isGridItemReady = true;
        }

        function updateChart() {
            var options = {
                id: '29',
                type: 'change_chart_view',
                view: vm.view,
                axis: 'Values',
                filter: '',
                user_pagination: ''
            };

            analyticsService.changeChart(options)
                .success(changeChartComplete);
        }


        function changeChartComplete(res) {
            vm.surveyWidget[0].chart_data.categories = res.chart_data.chart_data.categories;
            vm.surveyWidget[0].chart_data.dataset = res.chart_data.chart_data.dataset;
        }


        $scope.resizeChart = function (tab) {
            vm.setActive(vm.activeTab === tab ? 0 : tab);
        };

        function setActive(index) {
            vm.activeTab = vm.activeTab === index ? 0 : index;
        }

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
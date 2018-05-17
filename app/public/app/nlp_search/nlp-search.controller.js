(function () {

    'use strict';

    angular
        .module('app.nlpSearch')
        .controller('NlpSearchController', NlpSearchController);

    NlpSearchController.$inject = ['$scope', 'nlpSearchService', '$stateParams', '$uibModal'];

    function NlpSearchController($scope, nlpSearchService, $stateParams, $uibModal) {

        var vm = this;

        vm.isChartRendered = false;
        vm.submit = submit;
        vm.addToDashboard = addToDashboard;
        $scope.getTranslation = $scope.$parent.getTranslation;
        vm.getQueries = nlpSearchService.getAutocompleteResults;
        vm.onItemAdded = onItemAdded;
        vm.manageColumns = manageColumns;
        vm.addToDashboard = addToDashboard;
        vm.getChartData = getChartData;
        vm.error = '';
        vm.request = {
            text: '',
            page_number: 1,
            page_size: 25
        };

        vm.chartViews = [
            'Cost Per Hire',
            'Industry Salary',
            'Salary',
            'Salary 1 Year Ago',
            'Salary 2 Year Ago',
            'Salary 3 Year Ago',
            'Salary 4 Year Ago',
            'Performance Percentage This Year',
            'Performance Percentage 1 Year Ago',
            'Performance Percentage 2 Year Ago',
            'Performance Percentage 3 Year Ago',
            'Performance Percentage 4 Year Ago',
            'Absences',
            'Benefit Costs',
            'Benefit Costs 1 Year Ago',
            'Benefit Costs 2 Year Ago',
            'Benefit Costs 3 Year Ago',
            'Benefit Costs 4 Year Ago'
        ];

        vm.chartView = vm.chartViews[0];

        if ($stateParams.query) {
            vm.request.text = $stateParams.query;
            vm.submit(vm.request);
        }

        $scope.$on('columnsChanged', function (e, data) {
            e.stopPropagation();
            vm.checkedColumns = data;
        });

        function submit(request) {
            vm.isChartRendered = false;
            vm.error = '';
            vm.queryResults = [];
            vm.total = 0;
            $scope.widgets = [];

            $stateParams.query = request.text;

            nlpSearchService.getSearchResults(request)
                .success(getSearchResultSuccess)
                .error(getSearchResultError);
        }

        function getSearchResultSuccess(res) {
            handleResponse(res);
            getChartData();
        }

        function handleResponse(res) {
            vm.token = res.token;
            vm.queryResults = res.result;
            vm.total = res.total_count;
            vm.gridColumns = _.keys(vm.queryResults[0]);
            vm.metricStyles = res.available_mestric_styles;
            vm.checkedColumns = vm.checkedColumns || _.take(vm.gridColumns, 7);
        }

        function getChartData() {
            var request = {token: vm.token, chart_view: vm.chartView};
            nlpSearchService.getChartData(request)
                .success(getChartDataSuccess);
        }

        function getSearchResultError(res) {
            vm.error = res.err_message;
        }

        function getChartDataSuccess(res) {
            vm.isTable = res.type == 'table';
            $scope.widgets = [res];
        }

        function addToDashboard() {
            $uibModal.open({
                animation: false,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/nlp_search/add_to_dashboard/nlp.modal.add-to-dashboard.view.html',
                controller: 'NlpModalAddToDashboard',
                controllerAs: 'vm',
                size: 'lg',
                scope: $scope,
                resolve: {
                    config : function () {
                        return {
                            title: $stateParams.query,
                            token: vm.token,
                            metrics: vm.metricStyles,
                            columns: vm.checkedColumns,
                            chartView: vm.chartView
                        };
                    }
                }
            });
        }

        function manageColumns() {

            $uibModal.open({
                animation: false,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/nlp_search/manage-columns/nlp.modal.manage-columns.view.html',
                controller: 'NlpModalManageColumnsController',
                controllerAs: 'vm',
                scope: $scope,
                resolve: {
                    columns: function () {
                        return getColumnKeys(vm.queryResults[0]);
                    },
                    checkedColumns: function () {
                        return vm.checkedColumns;
                    }
                }
            })
        }

        function onItemAdded() {
            $scope.isGridItemReady = true;
        }

        function getColumnKeys(obj) {
            return _.without(_.keys(obj), '$$hashKey');
        }

        function setChartStatus(){
            vm.isChartRendered = true;
            $scope.$apply();
        }

        vm.$onInit = function() {
            FusionCharts.addEventListener('rendered', setChartStatus);
        }


        vm.$onDestroy = function() {
            FusionCharts.removeEventListener('rendered', setChartStatus);
        };

    }
})();




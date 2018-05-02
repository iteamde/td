(function () {

    'use strict';

    angular
        .module('app.nlpSearch')
        .controller('NlpSearchController', NlpSearchController);

    NlpSearchController.$inject = ['$scope', 'nlpSearchService', '$stateParams', '$uibModal'];

    function NlpSearchController($scope, nlpSearchService, $stateParams, $uibModal) {

        var vm = this;

        vm.submit = submit;
        vm.addToDashboard = addToDashboard;
        $scope.getTranslation = $scope.$parent.getTranslation;
        vm.getQueries = nlpSearchService.getAutocompleteResults;
        vm.onItemAdded = onItemAdded;
        vm.manageColumns = manageColumns;
        vm.addToDashboard = addToDashboard;
        vm.error = '';
        vm.request = {
            text: '',
            page_number: 1,
            page_size: 25
        };

        if ($stateParams.query) {
            vm.request.text = $stateParams.query;
            vm.submit(vm.request);
        }

        $scope.$on('columnsChanged', function (e, data) {
            e.stopPropagation();
            vm.checkedColumns = data;
        });

        function submit(request) {
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
            vm.token = res.token;
            vm.queryResults = res.result;
            vm.total = res.total_count;
            vm.gridColumns = _.keys(vm.queryResults[0]);
            vm.metricStyles = res.available_mestric_styles;
            vm.checkedColumns = vm.checkedColumns || _.take(vm.gridColumns, 7);

            nlpSearchService.getChartData(res.token)
                .success(getChartDataSuccess);
        }

        function getSearchResultError(res) {
            vm.error = res.err_message;
        }

        function getChartDataSuccess(res) {
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
                    token : function () {
                        return vm.token;
                    },
                    metricStyles: function () {
                        return vm.metricStyles;
                    },
                    checkedColumns: function () {
                        return vm.checkedColumns
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
    }
})();




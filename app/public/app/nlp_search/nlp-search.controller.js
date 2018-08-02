(function () {

    'use strict';

    angular
        .module('app.nlpSearch')
        .controller('NlpSearchController', NlpSearchController);

    NlpSearchController.$inject = ['$scope', 'nlpSearchService', '$stateParams', '$uibModal', '$timeout', '$location', '$localStorage', 'commonService'];

    function NlpSearchController($scope, nlpSearchService, $stateParams, $uibModal, $timeout, $location, $localStorage, commonService) {

        var vm = this;

        vm.showView = false;
        vm.isChartRendered = true;
        vm.submit = submit;
        vm.addToDashboard = addToDashboard;
        vm.exportUsersToCsv = exportUsersToCsv;
        $scope.getTranslation = $scope.$parent.getTranslation;
        vm.getQueries = nlpSearchService.getAutocompleteResults;
        vm.onItemAdded = onItemAdded;
        vm.manageColumns = manageColumns;
        vm.addToDashboard = addToDashboard;
        vm.getChartData = getChartData;
        vm.feedBack = feedBack;
        vm.sortUsers = sortUsers;
        vm.error = '';
        vm.withoutFeedbackClick = false;
        vm.users = [];
        vm.pagination = {
            page_number: 1,
            page_size: 10,
            sort_column: 'first name',
            sort_type: 'asc',
            table_columns:  vm.checkedColumns

        };
        vm.request = {
            text: ''
        };
        vm.questionIndex = 1;
        vm.lookingForText = "";
        vm.checkedColumns = [
            'first name',
            'last name',
            'department',
            'job level',
            'employee type'
        ];
        var dateColumns = [
            'hire date',
            'termination date',
            'position start date'
        ];
        vm.columns = [
            'first name',
            'last name',
            'department',
            'job level',
            'employee type',
            'country',
            'city',
            'state',
            'division',
            'cost center',
            'education level',
            'gender',
            'hire date',
            'termination date',
            'current job code',
            'ethnicity',
            'position start date',
            'hire source',
            'salary',
            'prof. dev.',
            'absences',
            'benefit cost',
            'performance'
        ];
        vm.isChartView = true;
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
        } else {
            vm.showView = true;
        }

        $scope.$on('columnsChanged', function (e, data) {
            e.stopPropagation();
            vm.checkedColumns = data;
        });



        function exportUsersToCsv() {
            console.log('csv');
            commonService.exportUsersToCsv(null, {
                page_number: 1,
                page_size: 10,
                sort_column: 'first name',
                sort_type: 'asc',
                table_columns:  ["full name", "location", "manager", "department", "education level"]

            }, {timeSpan:{start: 12, end: null, title: "1 year"}}, null);
        }



        function submit(request) {
            if (vm.withoutFeedbackClick) {
                vm.feedBack('');
            }

            nlpSearchService.checkChart({query: request.text})
                .success(function(res) {
                    checkExistChart(res, request);
                })
                .error(getSearchResultError);
        }

        function checkExistChart (res, request) {
            var dataRedirect = {};

            if (res.data && res.data != null) {
                dataRedirect = JSON.parse(res.data);

                $localStorage.filters = dataRedirect.filters;
                $localStorage.chartFilters = dataRedirect["chart_filter"];
                $localStorage.chartView = dataRedirect["chart_view"];
                $localStorage.verticalAxis = dataRedirect["vertical-axis"];
                $localStorage.highest = dataRedirect["highest"];

                $location.url(dataRedirect.type + '/' + dataRedirect.chart);
            } else {
                vm.showView = true;
                getSearch(request);
            }
        }

        function getSearch (request) {
            vm.lookingForText = "";
            vm.withoutFeedbackClick = false;
            vm.isChartRendered = false;
            vm.error = '';
            vm.queryResults = [];
            vm.total = 0;
            vm.questionIndex = 0;
            $scope.widgets = [];
            $location.path('/nlp-search/' + request.text);

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
            var gridColumns = _.keys(vm.queryResults[0]);
            vm.metricStyles = res.available_mestric_styles;

            // To check count key for display graph
            vm.isChartView = _.some(gridColumns, function(key) {
                return /^(avg|sum|count)\d*$/.test(key);
            }) || res.showChart;
            vm.checkedColumns = [
                'first name',
                'last name',
                'department',
                'job level',
                'employee type'
            ];
            if (vm.isChartView) {
                var chartViewColumn = _.intersection(vm.columns, gridColumns);
                vm.checkedColumns = vm.checkedColumns.concat(chartViewColumn);
            }
        }

        function getChartData() {
            var request = {token: vm.token, chart_view: vm.chartView};
            nlpSearchService.getChartData(request)
                .success(getChartDataSuccess)
                .catch(getSearchResultError);
        }

        function getSearchResultError(res) {
            vm.error = res.err_message;
            vm.users = [];
            vm.isChartRendered = true;
        }

        function getChartDataSuccess(res) {
            vm.isTable = res.type === 'table';
            vm.users = res.users.users;
            vm.pagination.sort_column = res.users.sortColumn;
            vm.pagination.sort_type = res.users.sortDirection;
            if (vm.columns.indexOf(res.users.sortColumn) > -1 && vm.checkedColumns.indexOf(res.users.sortColumn) < 0) {
                vm.checkedColumns.push(res.users.sortColumn);
            }
            if(res.multipleGroupMetricStyles && res.multipleGroupMetricStyles.length >0){
                vm.metricStyles = res.multipleGroupMetricStyles;
            }
            $scope.widgets = [res];
            vm.isChartRendered = true;
            vm.defaultColumns = [
                'first name',
                'last name',
                'department',
                'job level',
                'employee type'
            ];
            if(vm.defaultColumns.indexOf(res.users.sortColumn) === -1){
                vm.total = vm.queryResults[0][vm.pagination.sort_column];
            }else{
                vm.total = res.chart_data.data?res.chart_data.data[0].value:vm.total;
            }
            $timeout(function () {
                vm.questionIndex = 1;
            }, 500)
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
                            chartView: vm.chartView,
                            search_query: vm.request.text
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
                        return vm.columns;
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

        function sortUsers(key) {
            if (vm.pagination.sort_column === key) {
                vm.pagination.sort_type = vm.pagination.sort_type === 'asc' ? 'desc' : 'asc';
            }

            vm.pagination.sort_column = key;
            vm.users = _.orderBy(vm.users, function(user) {
                return dateColumns.indexOf(key) < 0 ? user[key] : new Date(user[key]);
            }, vm.pagination.sort_type);
        }

        //TODO CREATE VALID FUNCTIONALITY WITH FLOW, API ,TOASTR MSG ETC.
        function feedBack(feedback) {
            if(feedback === ''){
                feedback = 'No'
            }
            var request = {
                feedback: feedback,
                token: vm.token
            };
            vm.questionIndex = 0;
            if (feedback) {
                return  nlpSearchService.feedBack(request)
            } else {
                vm.withoutFeedbackClick = true;
                vm.questionIndex = 2;
            }
        }

    }
})();




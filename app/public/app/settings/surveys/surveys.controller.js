(function () {

    'use strict';

    angular
        .module('app.surveys')
        .controller('SurveysController', SurveysController);

    SurveysController.$inject = ['$scope'];

    function SurveysController($scope) {

        var vm = this;


        vm.recipient = 'All Employees';
        vm.recipients = ['All Employees', 'Entry', 'Intermediate', 'Senior', 'Lead', 'Manager', 'Director', 'Executive'];

        setupGrid();

        function setupGrid() {
            $scope.numRows = 10;
            $scope.maxSize = 5;
            $scope.gridOptions = {
                maxSize: $scope.maxSize,
                paginationPageSize: $scope.numRows,
                enablePaginationControls: false,
                paginationCurrentPage: 1,
                enableCellEdit: false,
                columnDefs: [
                    {
                        name: $scope.getTranslation('question'),
                        field: 'name',
                        enableColumnMenu: false
                    },
                    {
                        name: $scope.getTranslation('actions'),
                        enableColumnMenu: false,
                        enableSorting: false,
                        cellTemplate: '<div class="ui-grid-cell-contents flex-cell"><button type="button" class="btn btn-xs action-edit" title="{{ grid.appScope.getTranslation(\'add_question\') }}" ng-click="grid.appScope.vm.editToken(row)"> <i class="fa fa-plus-circle"></i></button><!--<button type="button" class="btn btn-xs action-edit" title="{{ grid.appScope.getTranslation(\'remove_question\') }}" ng-click="grid.appScope.vm.editToken(row)"> <i class="fa fa-minus-circle"></i></button>--></div>'
                    }
                ]
            };
        }

        $scope.gridOptions.data = [
            {name: 'Do you like being Remote Employee?'},
            {name: 'Do you consider yourself underpaid'},
            {name: 'Does your workload make your consider leaving?'},
            {name: 'Are the new hires qualified?'}
        ]

    }

})();
(function () {

    'use strict';

    angular
        .module('app.languages')
        .controller('LanguagesController', LanguagesController);

    LanguagesController.$inject = ['$scope', '$uibModal', 'noty', 'PaginationService', 'BASE_URL', 'mockDataService'];

    function LanguagesController($scope, $uibModal, noty, PaginationService, BASE_URL, mockDataService) {

        var vm = this;
        vm.editToken = editToken;

        PaginationService.configure({
            peerPage: 10,
            urlPrefix: BASE_URL
        });
        vm.userPagination = PaginationService.make('user/userlist').dataResolver();
        vm.defaultSearch = 'chart';

        setupGrid();
        configGrid(mockDataService.getTranslate());

        function setupGrid() {
            $scope.numRows = 10;
            $scope.maxSize = 5;
            $scope.gridOptions = {
                maxSize: $scope.maxSize,
                paginationPageSize: $scope.numRows,
                enablePaginationControls: false,
                paginationCurrentPage: 1,
                enableCellEdit: false,
                onRegisterApi: function(gridApi) { //register grid data first within the gridOptions
                    $scope.gridApi = gridApi;
                },
                columnDefs: [
                    {
                        name: $scope.getTranslation('token_name'),
                        field: 'token_name',
                        enableColumnMenu: false
                    },
                    {
                        name: $scope.getTranslation('token_translation'),
                        enableColumnMenu: false,
                        field: 'token_translation'
                    },
                    {
                        name: $scope.getTranslation('type'),
                        enableColumnMenu: false,
                        field: 'type'
                    },
                    {
                        name: $scope.getTranslation('actions'),
                        enableColumnMenu: false,
                        enableSorting: false,
                        cellTemplate: '<div class="ui-grid-cell-contents flex-cell"><button type="button" class="btn btn-xs action-edit" title={{ getTranslation(\'edit_user\') }}ng-click="grid.appScope.vm.editToken(row)"> <i class="fa fa-pencil"></i></button></div>'
                    }
                ]
            };
        }

        $scope.$watch('vm.userPagination.data', function () {
            $scope.gridOptions.data = mockDataService.getTranslate().data[vm.userPagination.currentPage];
            $scope.gridApi.selection.clearSelectedRows();
        });

        function configGrid(tableData) {

            // add pending grid configuration;
            $scope.gridBoxData = tableData.data[vm.userPagination.currentPage];
            $scope.gridOptions.data = tableData.data[vm.userPagination.currentPage];
            $scope.gridOptions.totalItems = $scope.gridOptions.data[vm.userPagination.currentPage].length;
            $scope.gridOptions.minRowsToShow = $scope.gridOptions.data[vm.userPagination.currentPage].length < $scope.numRows ? $scope.gridOptions.data[vm.userPagination.currentPage].length : $scope.numRows;
        }

        function editToken(row) {

            var modalInstance = $uibModal.open({
                animation: false,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/settings/languages/languages.modal.edit-token.view.html',
                controller: 'ModalEditTokenController',
                controllerAs: 'vm',
                backdrop: 'static',
                scope: $scope,
                resolve: {
                    row: function () {
                        return row;
                    }
                }
            });
        }

    }

})();
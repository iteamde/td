(function () {

    'use strict';

    angular
        .module('app.core')
        .controller('GridController', GridController);

    GridController.$inject = ['$scope', '$uibModal'];

    function GridController($scope, $uibModal) {
        $scope.contentInitialized = false;
        $scope.getTranslation = $scope.$parent.getTranslation;
        $scope.sorting = {
            'full name': null,
            'employee id': null,
            'location': null,
            'manager': null,
            'job level': null,
            'department': null,
            'division': null,
            'cost center': null,
            'employee type': null,
            'education level': null,
            'gender': null,
            'hire date': null,
            'termination date': null,
            'current job code': null,
            'ethnicity': null,
            'position start date': null,
            'hire source': null,
            'salary': null,
            'prof. dev.': null,
            'absences': null,
            'benefit cost': null,
            'performance': null
        };

        $scope.pagination = {
            page_size: 10,
            page_number: 1,
            sort_column: '',
            sort_type: '',
            table_columns: ['full name', 'location', 'manager', 'department']
        };

        $scope.$watch('pagination', function () {
            if ($scope.contentInitialized) {
                $scope.$emit('paginationChange', $scope.pagination);
            }
            $scope.contentInitialized = true;
        }, true);

        $scope.$on('columnsChanged', function(e, columns) {
            e.stopPropagation();
            $scope.pagination.table_columns = columns;
        });

        $scope.sort = function(field) {
            if ($scope.pagination.sort_column != field)
                $scope.sorting[field] = null;

            $scope.pagination.sort_column = field;

            $scope.pagination.sort_type = $scope.sorting[field] == 'ASC' ?
                $scope.sorting[field] = 'DESC' :
                $scope.sorting[field] == 'DESC' ?
                    $scope.sorting[field] = null :
                    $scope.sorting[field] = 'ASC';

        };

        $scope.cutCustom = function(field) {
            var changeToUnderscore =  function(str){
                var newStr = str.replace(/ /g, "_");
                return newStr;
            }
            return field.indexOf('custom') === 0 ? field.slice(7) : changeToUnderscore(field);
        }

        $scope.manageColumns = function() {
            var keys = _.keys($scope.$ctrl.users[0]);
            keys.pop();
            $scope.pagination.table_columns = keys;

            $uibModal.open({
                animation: false,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/core/common-components/grid/manage-columns/grid.modal.manage-columns.view.html',
                controller: 'ModalManageColumnsController',
                controllerAs: 'vm',
                scope: $scope,
                resolve: {
                    columns: function() {
                        return _.keys($scope.sorting);
                    },
                    checkedColumns: function () {
                        return angular.copy($scope.pagination.table_columns);
                    },
                    chartId: function() {
                        return $scope.$ctrl.chartId;
                    },
                    customFields: function() {
                        return _.map($scope.$ctrl.customFields, function(field) {
                            return 'custom ' + field;
                        });
                    }
                }
            })
        }
    }
})();
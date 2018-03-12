(function () {

    'use strict';

    angular
        .module('app.core')
        .controller('ModalManageColumnsController', ModalManageColumnsController);

    ModalManageColumnsController.$inject = ['$scope', 'columns', 'checkedColumns', 'chartId', 'customFields', 'BASE_URL', '$http', 'analyticsService','$stateParams'];

    function ModalManageColumnsController($scope, columns, checkedColumns, chartId, customFields, BASE_URL, $http, analyticsService, $stateParams) {
        $scope.columns = _.concat(columns, customFields);
        $scope.checkedColumns = _.intersection(checkedColumns, $scope.columns);
        $scope.uncheckedColumns = _.difference($scope.columns, checkedColumns);

        $scope.save = function() {
            var apiUrl = BASE_URL + 'user/user-grid-settings';
            $http.post(apiUrl, {
                chartId: chartId,
                fields: $scope.checkedColumns,
                forAllCharts: $scope.forAllCharts
            }).then(function(resp) {
                $scope.$emit('columnsChanged', $scope.checkedColumns);
                
                analyticsService.getCharts($stateParams.id)
                .success(function(res){$scope.$ctrl.users=res.chart_data.users});
                console.log($scope.$ctrl.users);
                console.log($stateParams.id);
                $scope.$close();

               
            });
        }

        $scope.moveToChecked = function() {
            if (!$scope.toChecked.length)
                return;

            $scope.uncheckedColumns = _.difference($scope.uncheckedColumns, $scope.toChecked);
            $scope.checkedColumns = _.concat($scope.checkedColumns, $scope.toChecked);
            $scope.toChecked = [];
        }

        $scope.moveToUnchecked = function() {
            if (!$scope.toUnchecked.length)
                return;

            $scope.checkedColumns = _.difference($scope.checkedColumns, $scope.toUnchecked);
            $scope.uncheckedColumns = _.concat($scope.uncheckedColumns, $scope.toUnchecked);
            $scope.toUnchecked = [];
        }
    }

})();
(function () {

    'use strict';

    angular
        .module('app.core')
        .controller('ModalManageColumnsController', ModalManageColumnsController);

    ModalManageColumnsController.$inject = ['$scope', 'columns', 'checkedColumns', 'chartId', 'customFields', 'BASE_URL', '$http'];

    function ModalManageColumnsController($scope, columns, checkedColumns, chartId, customFields, BASE_URL, $http) {
        $scope.toChecked = [];
        $scope.toUnchecked = [];
        $scope.columns = _.concat(columns, customFields);
        $scope.checkedColumns = _.map(_.intersection(checkedColumns, $scope.columns), function(item) {
            return {
                value: item,
                dragging: false,
                selected: false
            };
        });
        $scope.uncheckedColumns = _.map(_.difference($scope.columns, checkedColumns), function(item) {
            return {
                value: item,
                dragging: false,
                selected: false
            };
        });

        $scope.save = function() {
            var apiUrl = BASE_URL + 'user/user-grid-settings';
            var checkedColumnsNew = _.map($scope.checkedColumns, 'value');
            $http.post(apiUrl, {
                chartId: chartId,
                fields: checkedColumnsNew,
                forAllCharts: $scope.forAllCharts
            }).then(function(resp) {
                $scope.$emit('columnsChanged', checkedColumnsNew);
                $scope.$close();
            });
        };

        $scope.moveToChecked = function() {
            var toChecked = _.filter($scope.uncheckedColumns, 'selected');
            if (! toChecked.length)
                return;

            $scope.uncheckedColumns = _.difference($scope.uncheckedColumns, toChecked);
            $scope.checkedColumns = _.concat($scope.checkedColumns, toChecked);
        };

        $scope.moveToUnchecked = function() {
            var toUnchecked = _.filter($scope.checkedColumns, 'selected');
            if (! toUnchecked.length)
                return;

            $scope.checkedColumns = _.difference($scope.checkedColumns, toUnchecked);
            $scope.uncheckedColumns = _.concat($scope.uncheckedColumns, toUnchecked);
        };

        $scope.selectColumn = function($event, column, list) {
            if (! $event.ctrlKey) {
                _.each(list, function(item) {
                    item.selected = false;
                });
            }
            column.selected = ! column.selected;
        };
    }

})();
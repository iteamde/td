(function () {

    'use strict';

    angular
        .module('app.nlpSearch')
        .controller('NlpModalManageColumnsController', NlpModalManageColumnsController);

    NlpModalManageColumnsController.$inject = ['$scope', 'columns', 'checkedColumns', '$uibModalInstance'];

    function NlpModalManageColumnsController($scope, columns, checkedColumns, $uibModalInstance) {
        $scope.checkedColumns = checkedColumns;
        $scope.columns = columns;
        $scope.uncheckedColumns = _.difference(columns, checkedColumns);

        $scope.moveToChecked = moveToChecked;
        $scope.moveToUnchecked = moveToUnchecked;
        $scope.save = save;

        function moveToChecked() {
            if (! $scope.toChecked.length)
                return;

            $scope.uncheckedColumns = _.difference($scope.uncheckedColumns, $scope.toChecked);
            $scope.checkedColumns = _.concat($scope.checkedColumns, $scope.toChecked);
            $scope.toChecked = [];
        }

        function moveToUnchecked() {
            if (! $scope.toUnchecked.length)
                return;

            $scope.checkedColumns = _.difference($scope.checkedColumns, $scope.toUnchecked);
            $scope.uncheckedColumns = _.concat($scope.uncheckedColumns, $scope.toUnchecked);
            $scope.toUnchecked = [];
        }

        function save() {
            $scope.$emit('columnsChanged', $scope.checkedColumns);
            $uibModalInstance.close();
        }
    }

})();
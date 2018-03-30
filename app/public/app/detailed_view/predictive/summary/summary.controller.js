(function () {

    'use strict';

    angular
        .module('app.predictive')
        .controller('SummaryController', SummaryController);

    SummaryController.$inject = ['$scope','Summary', 'predictiveService'];

    function SummaryController($scope, Summary, predictiveService) {

        this.toggleModeling = toggleModeling;
        this.getCells = getCells;
        this.updateOnChange = updateOnChange;
        this.isPercent = isPercent;
        this.resetGrid = resetGrid;

        $scope.getTranslation = $scope.$parent.getTranslation;
        $scope.summary = new Summary(this.data);
        this.modelingMode = false;
        this.months = getMonths();

        $scope.$watch('$ctrl.data', function () {
            $scope.$emit('summaryChanged', $scope.summary.getChartValues());
        }, true);

        function getCells(index) {
            var obj = {};

            for (var i = -1; i <= 5; i++) {
                var month = moment().add(i, 'month').format('MMMM');

                obj[month] = this.data[index][month];
            }

            return obj;
        }

        function getMonths() {
            var arr = [];

            for (var i = -1; i <= 5; i++) {
                var month = moment().add(i, 'month').format('MMMM');

                arr.push(month);
            }

            return arr;
        }

        function toggleModeling() {
            this.modelingMode = !this.modelingMode;
        }

        function updateOnChange(row, col) {
            console.log(row, col)
            $scope.summary.recountPredictive(row, col);
        }

        function resetGrid() {
            predictiveService.resetGrid(this, $scope);
        }

        function isPercent(name) {
            var arr = ['Remote Employees', 'HP in Prof Dev', 'Total Turnover', 'HP Turnover', 'Non-HP Turnover', 'Turnover Prod Loss % of Rev'];
            return _.includes(arr, name);
        }
    }
})();
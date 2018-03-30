(function () {
    'use strict';

    angular
        .module('app.financialData')
        .controller('FinancialDataController', FinancialDataController);

    FinancialDataController.$inject = ['$scope', '$uibModal', 'noty', '$http', 'BASE_URL', 'commonService'];

    function FinancialDataController($scope, $uibModal, noty, $http, BASE_URL, commonService) {
        var vm = this;

        /**
         * @type {*[]}
         */
        var dataTemplate = [
            {
                "title": $scope.getTranslation('gross_revenue'),
                "data": [{"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}]
            },
            {
                "title": $scope.getTranslation('net_revenue'),
                "data": [{"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}]
            },
            {
                "title": $scope.getTranslation('hr_costs'),
                "data": [{"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}]
            },
            {
                "title": $scope.getTranslation('hr_settlement'),
                "data": [{"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}]
            },
            {
                "title": $scope.getTranslation('cost_of_benefits'),
                "data": [{"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}]
            },
            {
                "title": $scope.getTranslation('hiring_costs'),
                "data": [{"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}]
            },
            {
                "title": $scope.getTranslation('termination_costs'),
                "data": [{"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}]
            }
        ];

        /**
         * @type {string[]}
         */
        $scope.months = ["jan", "feb", "mar", "apr", "may", "june", "july", "aug", "sep", "oct", "nov", "dec"];

        /**
         * @type {string}
         */
        $scope.selectedYear = ((new Date().getFullYear()) - 1).toString();

        /**
         *
         */
        $scope.$watch('selectedYear', function () {
            $scope.loadData();
        });

        /**
         * @type {*}
         */
        $scope.oldData = angular.copy(dataTemplate);

        /**
         * @type {*}
         */
        $scope.data = angular.copy(dataTemplate);

        /**
         *
         */
        $scope.loadData = function () {
            $http.get(BASE_URL + 'financial-data/load-by-year/' + $scope.selectedYear)
            .then(function (response) {
                $scope.data = response.data;
                $scope.saveOldData();
            }).catch(function () {
                console.log('Load default data [' + $scope.selectedYear + ']');
                $scope.data = angular.copy(dataTemplate);
                $scope.saveOldData();
            });
        };

        /**
         *
         */
        $scope.saveData = function () {
            $http({
                url: BASE_URL + 'financial-data/save-by-year/' + $scope.selectedYear,
                method: 'POST',
                data: $scope.data
            }).then(function (response) {
                commonService.notification($scope.getTranslation('financial-data-saved'), 'success');
                $scope.saveOldData();
            }).catch(function () {
                console.log('Error save data');
            });
        };

        /**
         *
         */
        $scope.saveOldData = function () {
            $scope.oldData = angular.copy($scope.data);
        };

        /**
         *
         */
        $scope.resetData = function () {
            $scope.data = angular.copy($scope.oldData);
        };
    }
})();

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
                "title": "Gross Revenue",
                "data": [{"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}]
            },
            {
                "title": "Net Revenue",
                "data": [{"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}]
            },
            {
                "title": "HR Costs",
                "data": [{"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}]
            },
            {
                "title": "HR Settlement",
                "data": [{"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}]
            },
            {
                "title": "Cost of Benefits",
                "data": [{"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}]
            },
            {
                "title": "Hiring Costs",
                "data": [{"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}]
            },
            {
                "title": "Termination Costs",
                "data": [{"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}, {"value": ""}]
            }
        ];

        /**
         * @type {string[]}
         */
        $scope.months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

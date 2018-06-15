(function () {
    'use strict';

    angular
        .module('app.financialData')
        .controller('FinancialDataController', FinancialDataController);

    FinancialDataController.$inject = ['$transitions', '$rootScope', '$scope','$document', '$uibModal', 'noty', '$http', 'BASE_URL', 'commonService'];

    function FinancialDataController($transitions, $rootScope, $scope, $document, $uibModal, noty, $http, BASE_URL, commonService) {
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
                $scope.isDataSaved = true;
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


        /**
         *  Prevent router change when data is unsaved
         *  TODO: find better way, it cause an error message in console (bu it don't crush app)
         */
        $transitions.onStart({}, function (trans) {
            if (!$scope.isDataSaved) {
                commonService.notyConfirm($scope.getTranslation('Your changes have not been saved yet. Do you want to leave without finishing?'), 'warning');
                return false;
            }
        });

        /**
         *  Part of code to prevent the loss of unsaved data
         *  watch for variables in common service (button action on prompt noty )
         */
        $scope.$watch(function(){
            return commonService.showWarnMess;
        }, function(newValue){
            $scope.disableBtn = newValue;
        });

        $scope.$watch(function(){
            return commonService.notSaved;
        }, function(newValue){
            $scope.isDataSaved= newValue;
        });

        $scope.makeChanges = function(){
            $scope.isDataSaved = false;
        };

        $scope.warnMessage = function(e) {
            if(!$scope.isDataSaved){
                e.preventDefault();
                commonService.notyConfirm($scope.getTranslation('Your changes have not been saved yet. Do you want to leave without finishing?'), 'warning');
            }
        };




        };
})();

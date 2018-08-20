(function () {

    'use strict';

    angular
        .module('app.connector')
        .controller('SurveysModalUploadController', SurveysModalUploadController);

    SurveysModalUploadController.$inject = ['$scope', 'modalUploadService', 'commonService', 'exception', '$timeout', '$rootScope'];

    function SurveysModalUploadController($scope, modalUploadService, commonService, exception, $timeout, $rootScope) {

        var vm = this;
        vm.fileName ='';
        vm.saveSurvey = saveSurvey;

        $scope.$on('fileUploadSuccess', function (e, data) {
            e.stopPropagation();
            angular.extend(vm, data);
        });

        function saveSurvey() {
            $scope.$emit('showSpinner', true);
            $scope.$close();
        }


    }
})();
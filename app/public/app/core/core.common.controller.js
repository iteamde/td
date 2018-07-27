(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('CommonController', CommonController);

    CommonController.$inject = ['$scope', '$rootScope', 'commonService'];

    function CommonController($scope, $rootScope, commonService) {
        $scope.translations = {};
        $scope.commonData = {};
        $scope.isSidebarOpen = false;

        $scope.getTranslation = getTranslation;
        $scope.getCommonData = getCommonData;


        $rootScope.$on('sidebar-toggle-menu', function () {
            $scope.isSidebarOpen = !$scope.isSidebarOpen;
        });

        function getCommonData(property) {
            if (property) {
                return undefined === $scope.commonData[property] ? '' : $scope.commonData[property];
            }
            return $scope.commonData;
        }

        function getTranslation(token) {
            return undefined === $scope.translations[token] ? token : $scope.translations[token];
        }

        commonService.getCommonData()
            .success(function (data) {
                $scope.commonData = data;
                $scope.translations = data.translations;
            });
    }
})();

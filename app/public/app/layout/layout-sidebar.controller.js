(function () {

    'use strict';

    angular
        .module('app.layout')
        .controller('LayoutSidebarController', LayoutSidebarController);

    LayoutSidebarController.$inject = ['$scope', '$rootScope', 'layoutService', 'exception', '$window'];

    function LayoutSidebarController($scope, $rootScope, layoutService, exception, $window) {
        var vm;
        vm = this;
        console.log("LAYAOUT SIDEBAR INIT");

        vm.dashboardMenu = null;
        vm.metricMenu    = null;
        vm.translations  = {};

        /**
         * @param token
         * @param data
         * @returns {*}
         */
        vm.getTranslation = function (token, data) {
            data = data || {};

            if (undefined === vm.translations[token]) {
                return token;
            }

            var msg = vm.translations[token];

            for (var item in data) {
                msg = msg.replace('{' + item + '}', data[item]);
            }

            return msg;
        };

        $scope.$on('resize::resize', layoutService.updateSidebarHeight);
        $scope.$on('scroll::scroll', layoutService.updateSidebarHeight);

        activate();

        function activate() {
            // Load dashboard menu
            layoutService.getDashboardMenu()
                .success(getDashboardMenuComplete)
                .catch(serviceError);
        }


        function getDashboardMenuComplete(data) {
            vm.dashboardMenu = data;
            $rootScope.dashboardId = data.length ? data[0].id : undefined;
            layoutService.getMetricMenu()
                .success(getMetricMenuComplete)
                .catch(serviceError);

        }

        function getMetricMenuComplete(data) {
            vm.metricMenu = data;

            // activate first dashboard

        }

        function serviceError(error) {
            exception.catcher('XHR Failed for login')(error);
        }

    }


})();

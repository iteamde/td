(function () {

    'use strict';

    angular
        .module('app.layout')
        .controller('LayoutSidebarController', LayoutSidebarController);

    LayoutSidebarController.$inject = ['$scope', '$rootScope', 'layoutService', 'exception'];

    function LayoutSidebarController($scope, $rootScope, layoutService, exception) {
        var vm = this;

        vm.dashboardMenu = null;
        vm.metricMenu    = null;
        vm.subMenuIsOpen = false;
        vm.translations  = {};
        vm.isActive = isActive;
        vm.showSubMenu = showSubMenu;
        vm.dashboardMenu = $scope.commonData.dashboards;
        vm.metricMenu = $scope.commonData.metrics;
        $rootScope.dashboardId = $scope.commonData.dashboards.length ? $scope.commonData.dashboards[0].id : undefined;

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

        function isActive(state) {
            var tabs = ['layout.user', 'layout.financialData', 'layout.connector', 'layout.surveys', 'layout.alerts'];
            return {active: _.includes(tabs, state)}
        }

        function showSubMenu() {
            vm.subMenuIsOpen = !vm.subMenuIsOpen;
        }

        function serviceError(error) {
            exception.catcher('XHR Failed for login')(error);
        }

    }
})();

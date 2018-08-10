(function () {

    'use strict';

    angular
        .module('app.layout')
        .controller('LayoutSidebarController', LayoutSidebarController);

    LayoutSidebarController.$inject = ['$scope', '$rootScope', 'layoutService', 'exception'];

    function LayoutSidebarController($scope, $rootScope, layoutService, exception) {
        var vm = this;

        vm.subMenuIsOpen = false;
        vm.translations  = {};
        vm.isActive = isActive;
        vm.showSubMenu = showSubMenu;

        $scope.$watchCollection('commonData', function () {
            vm.metricMenu = $scope.commonData.metrics;

            // TODO: delete down string when Survey will doesn`t need anymore
            if(vm.metricMenu)
                vm.metricMenu = vm.metricMenu.concat([{id:100, icon:'fa fa-check',  title:'Surveys'}]);
        });

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
            if (data && data.length) {
                $rootScope.dashboardId = data[0].id || 1;
            }

            vm.dashboardMenu = data;
            $rootScope.dashboardId = data && data.length ? data[0].id : undefined;

            // layoutService.getMetricMenu()
            //     .success(getMetricMenuComplete)
            //     .catch(serviceError);
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

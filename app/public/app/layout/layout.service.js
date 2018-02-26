(function () {

    'use strict';

    angular
        .module('app.layout')
        .factory('layoutService', layoutService);

    layoutService.$inject = ['BASE_URL', '$http'];

    function layoutService(BASE_URL, $http) {
        return {
            getDashboardMenu: getDashboardMenu,
            getMetricMenu: getMetricMenu,
            updateSidebarHeight: updateSidebarHeight
        };

        function getDashboardMenu() {
            var apiUrl = BASE_URL + "dashboard/dashboardlist";
            return $http.get(apiUrl);
        }

        /**
         * @returns {*}
         */
        function getMetricMenu() {
            var apiUrl = BASE_URL + "metrics/metriclist";
            return $http.get(apiUrl);
        }

        // sidebar full height function gets recall on scroll and resize events
        function updateSidebarHeight() {
            var windowHeight, documentHeight, sidebar, sidebarHeight, container, containerHeight, toApplyHeight;

            sidebar = angular.element(".side-menu");
            container = angular.element(".content-page");

            // first reset it
            sidebar.css("min-height", 'auto');

            sidebarHeight = sidebar.height();
            containerHeight = container.height();

            // add header height to sidebar
            sidebarHeight = sidebarHeight + 50;

            //windowHeight = angular.element($window).height();
            //documentHeight = angular.element(document).height();
            //console.log(windowHeight, sidebarHeight, containerHeight);

            if (containerHeight > sidebarHeight) {
                sidebar.css("min-height", containerHeight - 50);
            }
        }
    }
})();

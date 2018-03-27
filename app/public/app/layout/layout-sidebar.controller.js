(function () {

    'use strict';

    angular
        .module('app.layout')
        .controller('LayoutSidebarController', LayoutSidebarController);

    LayoutSidebarController.$inject = ['$scope', '$rootScope', 'layoutService', 'exception', '$window'];

    function LayoutSidebarController($scope, $rootScope, layoutService, exception, $window) {
        var vm;
        vm = this;

        vm.dashboardMenu = null;
        vm.metricMenu    = null;
        vm.translations  = {};

        /**
         * @param token
         * @param data
         * @returns {*}
         */

        vm.subMenuIsOpen=false;
        vm.isSidebarOpen =false;

        vm.serverObject ={
            recruting: [{title:'Cost per Hire', icon: 'fa fa-table'},
                {title:'Source of Hire', icon: 'fa fa-table'},{title:'Time to Fill',icon: 'fa fa-table'}],
            financial: [{title:'Compensation', icon: 'fa fa-table'},
                {title:'Benefit Costs', icon: 'fa fa-table'},{title:'Revenue per Employee',icon: 'fa fa-table'}],
            talent: [{title:'Performance Scores', icon: 'fa fa-table'},
                {title:'Professional Development', icon: 'fa fa-table'},{title:'Succession Planning',icon: 'fa fa-table'}],
            organization: [{title:'Turnover', icon: 'fa fa-table'},
                {title:'Hires vs. Terminations', icon: 'fa fa-table'},{title:'Tenure',icon: 'fa fa-table'},{title:' Number of Employees',icon: 'fa fa-table'},
                {title:'Reports per Manager',icon: 'fa fa-table'},{title:'Ethnic Diversity',icon: 'fa fa-table'},{title:'Average Age',icon: 'fa fa-table'},
                {title:'Absence',icon: 'fa fa-table'}]
        }

        $rootScope.$on('sidebar-toggle-one', function () {
           vm.isSidebarOpen = !vm.isSidebarOpen;
         })
         
        vm.showSubMenu= function(){
            vm.subMenuIsOpen=!vm.subMenuIsOpen;
        }
        
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

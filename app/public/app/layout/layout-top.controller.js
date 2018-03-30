(function () {

    'use strict';

    angular
        .module('app.layout')
        .controller('LayoutTopController', LayoutTopController)
        .filter('capitalize', function() {
            return function(input) {
                return input[0].toUpperCase() + input.slice(1);
            };
        });

    LayoutTopController.$inject = ['$scope', 'layoutService', 'exception', 'authService', 'TOOLTIP_MESSAGES', 'capitalizeFilter', '$rootScope'];

    function LayoutTopController($scope, layoutService, exception, authService, TOOLTIP_MESSAGES, $rootScope) {

        var vm = this;

        vm.getDate = getDate;
        vm.getHomeUrl = getHomeUrl;
        vm.user = authService.currentUser();

        vm.TOOLTIP_MESSAGES = TOOLTIP_MESSAGES.LAYOUT;

        vm.logout = logout;
        vm.toggleSidebarClick = toggleSidebarClick;

        function toggleSidebarClick() {
            $scope.$emit('sidebar-toggle-menu');
        }

        function getDate() {
            return moment().format('MMMM D, YYYY');
        }

        function getHomeUrl() {
            var dashboardItem = angular.element('#sidebar-menu li:first a')[0];
            var url = dashboardItem ? dashboardItem.href : (location.host + '/#/dashboard/');

            return url;
        }

        function serviceError(error) {
            exception.catcher($scope.getTranslation('xhr_failed_for_login'))(error);
        }

        function logout() {
            authService.logout()
                .success(authService.logoutSuccess)
                .catch(logoutError);
        }

        function logoutError(err){
            noty.show({
                text: err.data.message,
                type: 'error'
            });
        }

        setTimeout(function() {
            console.log($rootScope.dashboardId);
        }, 5000);
    }
})();
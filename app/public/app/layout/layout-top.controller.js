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

    LayoutTopController.$inject = ['layoutService', 'exception', 'authService', 'TOOLTIP_MESSAGES', 'capitalizeFilter', '$rootScope', '$scope'];

    function LayoutTopController(layoutService, exception, authService, TOOLTIP_MESSAGES, $rootScope, $scope) {

        var vm;
        vm = this;

        vm.getDate = getDate;
        vm.user = authService.currentUser();

        vm.TOOLTIP_MESSAGES = TOOLTIP_MESSAGES.LAYOUT;

        vm.logout = logout;

        vm.toggleSidebarClick = toggleSidebarClick;
        

        function toggleSidebarClick() {
            $scope.$emit('sidebar-toggle-one');
        }

        function getDate() {
            return moment().format('MMMM D, YYYY');
        }

        function serviceError(error) {
            exception.catcher('XHR Failed for login')(error);
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
    }
})();
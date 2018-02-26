(function () {
    'use strict';
    angular
        .module('app.login')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'login',
                config: {
                    name: 'login',
                    url: '/login',
                    templateUrl: 'app/auth/login/login.view.html',
                    controller: 'LoginController as vm'
                }
            }
        ];
    }
})();

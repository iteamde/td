(function () {
    'use strict';
    angular
        .module('app.reset')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'reset',
                config: {
                    name: 'reset',
                    url: '/reset/:token',
                    templateUrl: 'app/auth/reset/reset.view.html',
                    controller: 'ResetController as vm'
                }
            }
        ];
    }
})();

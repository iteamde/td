(function () {
    'use strict';

    angular
        .module('app.user')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.user',
                config: {
                    name: 'user',
                    url: 'user',
                    views: {
                        'container@layout': {
                            templateUrl: 'app/settings/user/user.view.html',
                            controller: 'UserController as vm'
                        }
                    }
                }
            }
        ];
    }
})();

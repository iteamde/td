(function () {
    'use strict';

    angular
        .module('app.profile')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.profile',
                config: {
                    name: 'profile',
                    url: 'profile',
                    views: {
                        'container@layout': 'profile'
                    }

                }
            }
        ];
    }

})();
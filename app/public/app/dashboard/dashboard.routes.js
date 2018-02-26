(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.dashboard',
                config: {
                    name: 'dashboard',
                    url: 'dashboard/:id',
                    views: {
                        'container@layout': {
                            templateUrl: 'app/dashboard/dashboard.view.html',
                            controller: 'DashboardController as vm'
                        }
                    }
                }
            }
        ];
    }
})();

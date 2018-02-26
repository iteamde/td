(function () {
    'use strict';

    angular
        .module('app.alerts')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.alerts',
                config: {
                    name: 'alerts',
                    url: 'alerts',
                    views: {
                        'container@layout': {
                            templateUrl: 'app/settings/alerts/alerts.view.html',
                            controller: 'AlertsController as vm'
                        }
                    }


                }
            }
        ];
    }

})();
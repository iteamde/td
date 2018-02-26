(function () {
    'use strict';

    angular
        .module('app.event')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.event',
                config: {
                    name: 'event',
                    url: 'event',
                    views: {
                        'container@layout': {
                            templateUrl: 'app/settings/event/event.view.html',
                            controller: 'EventController as vm'
                        }
                    }
                }
            }
        ];
    }
})();

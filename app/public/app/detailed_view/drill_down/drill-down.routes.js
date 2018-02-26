(function () {
    'use strict';

    angular
        .module('app.drillDown')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.drillDown',
                config: {
                    name: 'drillDown',
                    url: 'drill-down/:id',
                    views: {
                        'container@layout': {
                            templateUrl: 'app/detailed_view/drill_down/drill-down.view.html',
                            controller: 'DrillDownController as vm'
                        }
                    }
                }
            }
        ];
    }
})();

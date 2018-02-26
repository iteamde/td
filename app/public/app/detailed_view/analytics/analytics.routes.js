(function () {
    'use strict';

    angular
        .module('app.analytics')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.analytics',
                config: {
                    name: 'analytics',
                    url: 'analytics/:id',
                    views: {
                        'container@layout': {
                            templateUrl: 'app/detailed_view/analytics/analytics.view.html',
                            controller: 'AnalyticsController as vm'

                        }
                    }


                }
            }
        ];
    }

})();
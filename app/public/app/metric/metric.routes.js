(function () {
    'use strict';

    angular
        .module('app.metric')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.metric',
                config: {
                    name: 'metric',
                    url: 'metric/:id',
                    views: {
                        'container@layout': {
                            templateUrl: 'app/metric/metric.view.html',
                            controller: 'MetricController as vm'

                        }
                    }


                }
            }
        ];
    }

})();
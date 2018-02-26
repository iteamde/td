(function () {
    'use strict';

    angular
        .module('app.predictive')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {

        data.$inject = ['analyticsService', '$stateParams'];
        events.$inject = ['eventService'];

        return [
            {
                state: 'layout.predictive',
                config: {
                    name: 'predictive',
                    url: 'predictive/:id',
                    views: {
                        'container@layout': {
                            templateUrl: 'app/detailed_view/predictive/predictive.view.html',
                            controller: 'PredictiveController as vm'
                        }
                    },
                    resolve: {
                        data: data,
                        events: events
                    }
                }
            }
        ];

        function data (analyticsService, $stateParams) {
            return analyticsService.getCharts($stateParams.id).then(function (res) {
                return res.data
            });
        }

        function events (eventService) {
            return eventService.getEvents().then(function (res) {
                return res.data
            });
        }
    }

})();
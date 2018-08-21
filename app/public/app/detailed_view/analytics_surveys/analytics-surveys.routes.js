(function () {
    'use strict';

    angular
        .module('app.drillDownSurveys')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.analyticsSurveys',
                config: {
                    name: 'analyticsSurveys',
                    url: 'analytics-surveys/:id',
                    views: {
                        'container@layout': {
                            templateUrl: 'app/detailed_view/analytics_surveys/analytics-surveys.view.html',
                            controller: 'AnalyticsSurveysController as vm'
                        }
                    }
                }
            }
        ];
    }
})();

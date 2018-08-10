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
                state: 'layout.drillDownSurveys',
                config: {
                    name: 'drillDownSurveys',
                    url: 'drill-down-surveys/:id',
                    views: {
                        'container@layout': {
                            templateUrl: 'app/detailed_view/drill_down_surveys/drill-down-surveys.view.html',
                            controller: 'DrillDownSurveysController as vm'
                        }
                    }
                }
            }
        ];
    }
})();

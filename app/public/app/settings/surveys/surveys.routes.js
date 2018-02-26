(function () {
    'use strict';

    angular
        .module('app.surveys')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.surveys',
                config: {
                    name: 'surveys',
                    url: 'surveys',
                    views: {
                        'container@layout': {
                            templateUrl: 'app/settings/surveys/surveys.view.html',
                            controller: 'SurveysController as vm'
                        }
                    }


                }
            }
        ];
    }

})();
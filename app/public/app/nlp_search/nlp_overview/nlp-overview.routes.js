(function () {
    'use strict';

    angular
        .module('app.nlpSearch')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.nlpOverview',
                config: {
                    url: 'nlp-overview',
                    name: 'nlp-overview',
                    views: {
                        'container@layout': {
                            templateUrl: 'app/nlp_search/nlp_overview/nlp-overview.view.html'
                        }
                    }
                }
            }
        ];
    }

})();
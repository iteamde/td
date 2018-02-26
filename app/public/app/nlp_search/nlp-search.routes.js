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
                state: 'layout.nlpSearch',
                config: {
                    name: 'nlp-search',
                    url: 'nlp-search/:query',
                    views: {
                        'container@layout': 'nlpSearch'
                    }

                }
            }
        ];
    }

})();
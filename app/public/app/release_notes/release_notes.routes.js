(function () {
    'use strict';

    angular
        .module('app.release_notes')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.release_notes',
                config: {
                    name: 'release_notes',
                    url: 'release_notes',
                    views: {
                        'container@layout': {
                            templateUrl: 'release_notes.html'
                        }
                    }
                }
            }
        ];
    }

})();
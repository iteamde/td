(function () {
    'use strict';

    angular
        .module('app.languages')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.languages',
                config: {
                    name: 'languages',
                    url: 'languages',
                    views: {
                        'container@layout': {
                            templateUrl: 'app/settings/languages/languages.view.html',
                            controller: 'LanguagesController as vm'
                        }
                    }


                }
            }
        ];
    }

})();
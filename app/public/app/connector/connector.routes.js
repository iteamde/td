(function () {
    'use strict';

    angular
        .module('app.connector')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.connector',
                config: {
                    name: 'connector',
                    url: 'connector',
                    views: {
                        'container@layout': {
                            templateUrl: 'app/connector/connector.view.html',
                            controller: 'ConnectorController as vm'

                        }
                    }


                }
            }
        ];
    }

})();
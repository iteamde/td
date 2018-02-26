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
                state: 'layout.connector.detailed',
                config: {
                    name: 'connector.detailed',
                    url: '/:id',
                    views: {
                        'container@layout': {
                            templateUrl: 'app/connector/detailed/connector-detailed.view.html',
                            controller: 'ConnectorDetailedController as vm'
                        }
                    }
                }
            }
        ];
    }

})();
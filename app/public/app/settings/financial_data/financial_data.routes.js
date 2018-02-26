(function () {
    'use strict';

    angular
        .module('app.financialData')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.financialData',
                config: {
                    name: 'financialData',
                    url: 'financial-data',
                    views: {
                        'container@layout': {
                            templateUrl: 'app/settings/financial_data/financial_data.view.html',
                            controller: 'FinancialDataController as vm'

                        }
                    }


                }
            }
        ];
    }

})();
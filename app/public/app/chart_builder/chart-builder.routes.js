(function () {
    'use strict';

    angular
        .module('app.chartBuilder')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.chartBuilder',
                config: {
                    name: 'chartBuilder',
                    url: 'chart-builder',
                    views: {
                        'container@layout': {
                            templateUrl: 'app/chart_builder/chart-builder.view.html',
                            controller: 'ChartBuilderController as vm'
                        }
                    }
                }
            }
        ];
    }

})();
(function () {
    'use strict';

    angular
        .module('app.default_chart_view')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
       return [
           {
               state: 'layout.site_settings.default_chart_view',
               config: {
                   name: 'default_chart_view',
                   parent: 'layout.site_settings',
                   url: '/default_chart_view',
                   templateUrl: 'app/site_settings/default_chart_view/default_chart_view.view.html',
                   controller: 'DefaultChartViewController as vm',
                   resolve: {
                    charts: function() {
                      
                    }
                   }
               }
            }
       ];
   }

})();
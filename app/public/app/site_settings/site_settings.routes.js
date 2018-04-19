(function () {
    'use strict';

    angular
        .module('app.site_settings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];


    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.site_settings',
                config: {
                    name: 'site_settings',
                    url: 'site_settings',
                    views: {
                        'container@layout': {
                            templateUrl: 'app/site_settings/site_settings.view.html',
                            controller: 'SiteSettingsController as vm'
                        }
                    }
                }
            }
        ];
    }
})();

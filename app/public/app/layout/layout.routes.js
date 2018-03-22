(function () {
    'use strict';

    angular
        .module('app.layout')
        .run(appRun);

    appRun.$inject = ['routerHelper', '$http'];

    /* @ngInject */
    function appRun(routerHelper, $http) {
        routerHelper.configureStates(getStates($http));
    }

    function getStates($http) {
        return [
            {
                state: 'layout',
                config: {
                    abstract: true,
                    parent: 'main',
                    name: 'layout',
                    url: '/',
/*                    children:[{
                        url: 'login',
                        templateUrl: 'app/auth/login/login.view.html',
                        controller: 'LoginController as vm'
                    }],*/
                    views: {
                        '@': {
                            templateUrl: 'app/layout/layout.view.html',
                            //controller: 'IndexCtrl'
                        },
                        'top@layout': {
                            templateUrl: 'app/layout/layout.top.view.html',
                            controller: 'LayoutTopController as vm'
                        },
                        'sidebar@layout': {
                            templateUrl: 'app/layout/layout.sidebar.view.html',
                            controller: 'LayoutSidebarController as vm'
                        },
                        'video@layout': {
                            templateUrl: 'app/layout/layout.video.view.html',
                            controller: 'LayoutVideoController as vm'
                        },
                        'share@layout': {
                            templateUrl: 'app/layout/layout.share.view.html',
                            controller: 'LayoutShareController as vm'
                        }
                        //'container@layout': {templateUrl: 'app/layout/layout.view.html'},
                    }
                }
            }
        ];
    }
})();

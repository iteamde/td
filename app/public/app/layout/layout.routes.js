(function () {
    'use strict';

    angular
        .module('app.layout')
        .run(appRun);

    appRun.$inject = ['routerHelper'];


    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout',
                config: {

                    name: 'layout',
                    url: '/',
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

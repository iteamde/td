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
        console.log($http);
        return [
            {
                state: 'layout',
                config: {
                    abstract: true,
                    resolve:{
                        // Use the resource to fetch data from the server
                        config: function(){
                            return $http.get(('https://qa1512.dev.trendata.com/api/' + 'common/load-common-data'))
                                .then(function (res) {
                                    console.log("I AM HERE RESOLVE", res)
                                })
                        }

                    },
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

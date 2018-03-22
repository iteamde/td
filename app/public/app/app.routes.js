(function () {
    'use strict';
    angular
        .module('app')
        .run(appRun);

    appRun.$inject = ['routerHelper', '$http'];

    /!* @ngInject *!/
    function appRun(routerHelper, $http) {
        routerHelper.configureStates(getStates($http));
    }

    function getStates($http) {
        return [
            {
                state: 'main',
                config: {
                    name: 'main',
                    abstract: true,
                    template: '<div class="root-ui-view" ui-view></div>',
                    resolve:{
                        // Use the resource to fetch data from the server
                        config: function(){
                            return $http.get(('https://qa1512.dev.trendata.com/api/' + 'common/load-common-data'))
                                .then(function (res) {
                                    console.log("I AM HERE RESOLVE", res)
                                })
                        }
                    },
                }
            }
        ];
    }
})();


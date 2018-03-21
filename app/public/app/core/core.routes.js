(function () {
    'use strict';

    angular
        .module('app.core')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {

        getCommonData.$inject = ['commonService'];

        return [
            {
                state: 'core',
                config: {
                    name: 'core',
                    url: '/*',
                    controller: 'CommonController',
                    template: '',
                    resolve: {
                        commonData: getCommonData
                    }
                }
            }
        ];

        function getCommonData(commonService) {
            console.log(1)
            return commonService.getCommonData()
                .then(function (res) {
                    console.log(res)
                })
        }
    }
})();

/*
(function () {
    'use strict';

    angular
        .module('app.core')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /!* @ngInject *!/
    function appRun(routerHelper) {
        console.log('app runned here 11');
        routerHelper.configureStates(getStates());
    }

    function getStates() {

        getCommonData.$inject = ['commonService'];

        return [
            {
                state: 'core',
                abstract: true,
                config: {

                    resolve: {
                        commonData: getCommonData
                    }
                }
            }
        ];

        function getCommonData(commonService) {
            console.log(1);
            return commonService.getCommonData()
                .then(function (res) {
                    console.log("I AM HERE RESOLVE", res)
                })
        }
    }
})();*/

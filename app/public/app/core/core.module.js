(function () {
    'use strict';

    angular.module('app.core', [
        /*
         * Angular modules
         */
        'ngAnimate', /*'ngTouch','ngRoute',*/ 'ui.router', 'ngSanitize', 'ngCookies', 'angular-loading-bar',
        /*
         * Our reusable cross app code modules
         */
        'ui.bootstrap',
        'blocks.exception', 'blocks.logger', 'blocks.router',/* 'ng-fusioncharts',*/
        /*
         * 3rd Party modules
         */
        'ngStorage', /*'ngplus',*/ 'pascalprecht.translate', 'tmh.dynamicLocale', 'ngValidate', 'notyModule', 'dndLists'
    ]);

})();






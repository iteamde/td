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
        'ui.grid', 'ui.grid.pagination', 'ui.grid.autoResize', 'ui.grid.selection', 'ui.grid.edit', 'ui.grid.rowEdit',
        'ui.bootstrap',
        'blocks.exception', 'blocks.logger', 'blocks.router',/* 'ng-fusioncharts',*/
        /*
         * 3rd Party modules
         */
        'ngStorage', /*'ngplus',*/ 'pascalprecht.translate', 'tmh.dynamicLocale', 'ngValidate', 'notyModule'
    ]);
})();






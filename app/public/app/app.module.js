(function () {
    'use strict';

    angular.module('app', [
        /*
         * Order is not important. Angular makes a
         * pass to register all of the modules listed
         * and then when app.dashboard tries to use app.data,
         * its components are available.
         */

        /*
         * Everybody has access to these.
         * We could place these under every feature area,
         * but this is easier to maintain.
         */
        'app.core',
        //'app.widgets',

        /*
         * Feature areas
         */
        //'app.avengers',
        //'app.dashboard',
        //'app.layout'
        'app.login',
        'app.reset',
        'app.layout',
        'app.dashboard',
        'app.metric',
        'app.user',
        'app.event',
        'app.financialData',
        'app.chartBuilder',
        'app.analytics',
        'app.predictive',
        'app.connector',
        'app.drillDown',
        'app.drillDownSurveys',
        'app.analyticsSurveys',
        'app.nlpSearch',
        'app.profile',
        'app.languages',
        'app.surveys',
        'app.release_notes',
        'app.alerts',
        'app.site_settings',
        'app.default_chart_view'
    ]);


    // pass $state to rootscope to access them anywhere in app
    // https://github.com/angular-ui/ui-router/wiki/quick-reference#statecurrent
    //angular.module("app").run(function ($rootScope, $state, $stateParams) {
    //    $rootScope.$state = $state;
    //    $rootScope.$stateParams = $stateParams;
    //});
})();

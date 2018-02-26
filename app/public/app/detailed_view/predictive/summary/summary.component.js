(function () {

    'use strict';

    angular
        .module('app.predictive')
        .component('predictiveSummary', {
            bindings: {
                data: '<'
            },
            templateUrl: 'app/detailed_view/predictive/summary/summary.component.html',
            controller: 'SummaryController'
        });

})();
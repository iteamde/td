(function () {

    'use strict';

    angular
        .module('app.core')
        .component('commonGrid', {
            bindings: {
                users: '<',
                totalUsers: '<',
                chartId: '<',
                customFields: '<'
            },
            templateUrl: 'app/core/common-components/grid/grid.component.html',
            controller: 'GridController'
        });
})();
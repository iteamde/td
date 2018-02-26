(function () {

    'use strict';

    angular
        .module('app.core')
        .component('usersGrid', {
            bindings: {
                users: '=',
                inactive: '<'
            },
            templateUrl: 'app/core/common-components/users-grid/users-grid.component.html',
            controller: 'UsersGridController'
        });
})();
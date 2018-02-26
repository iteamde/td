(function () {

    'use strict';

    angular
        .module('app.layout')
        .component('searchBar', {
            templateUrl : 'app/layout/search_bar/search-bar.component.html',
            controller: 'SearchBarController as vm'
        });

})();
(function () {

    'use strict';

    angular
        .module("app.core")
        .filter("capitalizeFilter", capitalizeFilter);
    
    function capitalizeFilter() {
        return function (word) {
            return (!!word) ? word.charAt(0).toUpperCase() + word.substr(1).toLowerCase() : '';
        };
    }
})();

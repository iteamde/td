(function () {

    'use strict';

    angular
        .module("app.core")
        .filter("capitalizeFilter", capitalizeFilter);
    
    function capitalizeFilter() {
        return function (word) {
            return (!!word) ? word.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()}) : '';
        };
    }
})();

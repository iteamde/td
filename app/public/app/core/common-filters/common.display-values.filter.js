(function () {

    'use strict';

    angular
        .module("app.core")
        .filter("displayValuesFilter", displayValuesFilter);
    
    function displayValuesFilter() {

        return function (value, isPercent) {
            return isPercent ? (value/* * 100*/).toFixed(2) + "%" : value.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };
    }
})();

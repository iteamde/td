(function () {

    'use strict';

    angular
        .module("app.core")
        .filter("filterDisplayValues", filterDisplayValues);

    function filterDisplayValues() {

        return function (value) {
            if (value === null)
                return 0;

            return value < 1 && value > 0 ? (value * 100).toFixed(2) + "%" : value.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };
    }
})();

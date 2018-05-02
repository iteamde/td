(function () {

    'use strict';

    angular
        .module("app.core")
        .filter("filterObjectKeysByArray", filterObjectKeysByArray);
    
    function filterObjectKeysByArray() {

        return function (obj, array) {
            return _.pick(obj, array)
        }
    }
})();

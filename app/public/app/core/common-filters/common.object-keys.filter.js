(function () {

    'use strict';

    angular
        .module("app.core")
        .filter("filterObjectKeys", filterObjectKeys);
    
    function filterObjectKeys() {

        return function (obj, filterBy) {

            filterBy = filterBy.toLowerCase();

            return _.filter(_.keys(obj), function(key) {
                return _.includes(key.toLowerCase(), filterBy);
            });

        };
    }
})();

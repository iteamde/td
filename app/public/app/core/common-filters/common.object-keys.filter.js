(function () {

    'use strict';

    angular
        .module("app.core")
        .filter("filterObjectKeys", filterObjectKeys);
    
    function filterObjectKeys() {

        return function (obj, filterBy) {

            var keys = _.keys(obj);

            if (!filterBy) return keys;

            filterBy = filterBy.toLowerCase();

            return _.filter(keys, function(key) {
                return _.includes(key.toLowerCase(), filterBy);
            });

        };
    }
})();

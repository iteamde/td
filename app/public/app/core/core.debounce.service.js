//TODO: Delete after predictive replaced to server-side
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('debounceService', debounceService);

    debounceService.$inject = ['$q', '$timeout'];

    function debounceService($q, $timeout) {

        return function (func, wait, immediate) {

            var deffered = $q.defer(),
                timeout;

            return function () {
                var context = this, args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate) {
                        deffered.resolve(func.apply(context, args));
                        deffered = $q.defer();
                    }
                };
                var callNow = immediate && !timeout;
                if (timeout) {
                    $timeout.cancel(timeout);
                }
                timeout= $timeout(later, wait);
                if (callNow) {
                    deffered.resolve(func.apply(context, args));
                    deffered = $q.defer();
                }
                return deffered.promise;
            }

        }
    }
})();
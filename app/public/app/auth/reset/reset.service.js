(function () {

    'use strict';

    angular
        .module('app.reset')
        .factory('resetService', resetService);

    resetService.$inject = ['$http', 'BASE_URL'];

    function resetService($http, BASE_URL) {

        var service = {
            resetPassword:resetPassword
        };

        return service;

        function resetPassword(apiData) {
            var apiUrl = BASE_URL + "reset-password/"+ apiData.token;
            return $http.post(apiUrl, apiData);
        }
    }
})();
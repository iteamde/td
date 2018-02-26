(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('pageService', pageService);

    pageService.$inject = ['BASE_URL', '$http'];

    function pageService(BASE_URL, $http) {

        return {
            sendPages: sendPages
        };

        function sendPages(data) {
            var url = BASE_URL + 'track-user-activity';
            return $http.post(url, data);
        }
    }

})();
(function () {

    'use strict';

    angular
        .module('app.profile')
        .factory('profileService', profileService);

    profileService.$inject = ['BASE_URL', '$http', 'noty'];

    function profileService(BASE_URL, $http, noty) {

        return {
            getSearchResults: getSearchResults,
            getUser: getUser,
            updateUser: updateUser
        };

        function getSearchResults(userId) {
            var apiUrl = BASE_URL + "/dashboard/profile:id";
            return $http.get(apiUrl, {
                params: {id: userId}
            });
        }

        function getUser(userId) {
            var apiUrl = BASE_URL + 'user/get-user/' + userId;
            return $http.get(apiUrl);
        }

        function updateUser(user) {
            var apiUrl = BASE_URL + 'user/edituser/';
            return $http.post(apiUrl, user);
        }
    }
})();
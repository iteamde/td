(function () {

    'use strict';

    angular
        .module('app.login')
        .factory('authService', authService);

    authService.$inject = ['$http', '$location', 'exception', 'BASE_URL', '$window', '$localStorage', '$rootScope'];

    function authService($http, $location, exception, BASE_URL, $window, $localStorage, $rootScope) {

        var service = {
            currentUser: currentUser,
            saveToken: saveToken,
            getToken: getToken,
            isAdmin: isAdmin,
            isLoggedIn: isLoggedIn,
            login: login,
            logout: logout,
            logoutSuccess: logoutSuccess,
            forgotPassword:forgotPassword,
            changePassword:changePassword
        };

        return service;


        function login(user) {
            var apiUrl = BASE_URL + "login";
            return $http.post(apiUrl, user);
        }

        function logout() {
            return $http.get(BASE_URL + "/logout");
        }

        function logoutSuccess() {
            delete $localStorage.trentoken;
            delete $localStorage.isAdmin;
            $location.url('/login');
        }

        function saveToken(token) {
            $localStorage.trentoken = token;
        }

        function getToken() {
            return $localStorage.trentoken;
        }

        function isAdmin(value) {
            $localStorage.isAdmin = value;
            $rootScope.isAdmin = $localStorage.isAdmin;
        }

        function isLoggedIn() {
            var token = getToken();

            if (token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        }

        function currentUser() {
            var user;

            if (isLoggedIn()) {
                var token = getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                user = {
                    id: payload._id,
                    email: payload.email,
                    name: payload.name,
                    firstname: payload.firstname,
                    lastname: payload.lastname
                };
            }

            return user;
        }

        function forgotPassword(email) {
            var apiData = {
                "email": email
            }
            var apiUrl = BASE_URL + "forgot-password";
            return $http.post(apiUrl, apiData);
        }

        function changePassword(data) {
            var apiUrl = BASE_URL + "change-password";
            return $http.post(apiUrl, data);
        }
    }
})();
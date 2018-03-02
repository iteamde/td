(function () {

    'use strict';

    angular
        .module('app.user')
        .factory('userService', userService);

    userService.$inject = ['BASE_URL', '$http'];

    function userService(BASE_URL, $http) {

        var service = {
            getUserList: getUserList,   
            addUser:addUser,
            deleteUser:deleteUser,
            suspendUser:suspendUser,
            editUser:editUser,
            activateUser:activateUser,
            resetPassword: resetPassword
        };

        return service;

        function getUserList() {
            var apiUrl = BASE_URL + "user/userlist";
            console.log(apiUrl);
            return $http.get(apiUrl);
        }


        function deleteUser(data) {
            var apiUrl = BASE_URL + "user/deleteUser";
            return $http.post(apiUrl,data);
        }

        function activateUser(data) {
            var apiUrl = BASE_URL + "user/activateUser";
            return $http.post(apiUrl,data);
        }

        function suspendUser(data) {
            var apiUrl = BASE_URL + "user/suspendUser";
            return $http.post(apiUrl,data);
        }
        
        function addUser(user) {
            var apiUrl = BASE_URL + "user/addnewuser";
            return $http.post(apiUrl, user);
        }

        function editUser(user) {
            var apiUrl = BASE_URL + "user/editUser";
            return $http.post(apiUrl, user);
        }

        function resetPassword(email) {
            var apiUrl = BASE_URL + "forgot-password";
            return $http.post(apiUrl, {email: email});
        }


    }
})();
(function () {

    'use strict';

    angular
        .module('app.connector')
        .factory('modalUploadService', modalUploadService);

    modalUploadService.$inject = ['$http', 'BASE_URL'];

    function modalUploadService($http, BASE_URL) {

        return {
            uploadFile: uploadFile
        };

        function uploadFile(filename, data, skipDistance) {
            return $http.post(BASE_URL + 'upload/users-tuff-csv', {
                filename: filename,
                data: data,
                skipDistance: skipDistance || false
            });
        };
    }
})();
(function () {

    'use strict';

    angular
        .module('app.nlpSearch')
        .factory('nlpSearchService', nlpSearchService);

    nlpSearchService.$inject = ['BASE_URL', '$http'];

    function nlpSearchService(BASE_URL, $http) {

        var service = {
            getSearchResults: getSearchResults
        };

        return service;

        function getSearchResults(tags) {
            var apiUrl = BASE_URL + "/nlp-search/by-tags";
            return $http.post(apiUrl, {
                tags: tags
            }).then(function(res) {
                return res.data;
            });
        }
    }
})();
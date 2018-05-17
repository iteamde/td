(function () {

    'use strict';

    angular
        .module('app.nlpSearch')
        .factory('nlpSearchService', nlpSearchService);

    nlpSearchService.$inject = ['BASE_URL', '$http'];

    function nlpSearchService(BASE_URL, $http) {

        return {
            getSearchResults: getSearchResults,
            getAutocompleteResults: getAutocompleteResults,
            addToDashboard: addToDashboard,
            getChartData: getChartData
        };

        function getAutocompleteResults(text) {
            var apiUrl = BASE_URL + "nlp/autocomplete",
                loadingBarIgnore = {ignoreLoadingBar: true},
                data = { text: text};

            return $http.post(apiUrl, data, loadingBarIgnore)
                .then(function(res) {
                    return res.data;
                });
        }

        function getSearchResults(data) {
            var apiUrl = BASE_URL + "nlp/request";
            return $http.post(apiUrl, data);
        }

        function addToDashboard(request) {
            var apiUrl = BASE_URL + "nlp/add-to-dashboard";

            return $http.post(apiUrl, request);
        }

        function getChartData(data) {
            var apiUrl = BASE_URL + "nlp/get-chart-data";

            return $http.post(apiUrl, data);
        }
    }
})();
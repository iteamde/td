(function () {

    'use strict';

    angular
        .module('app.layout')
        .controller('SearchBarController', SearchBarController);

    SearchBarController.$inject = ['$scope', '$location', 'nlpSearchService'];

    function SearchBarController ($scope, $location, nlpSearchService) {

        var vm = this;

        vm.submit = submit;
        $scope.getTranslation = $scope.$parent.getTranslation;
        vm.getQueries = nlpSearchService.getAutocompleteResults;

        vm.text = '';

        function submit(text) {
            $location.path('/nlp-search/' + (text || vm.text));
            vm.text = '';
        }

    }

})();
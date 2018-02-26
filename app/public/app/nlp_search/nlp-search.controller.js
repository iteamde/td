(function () {

    'use strict';

    angular
        .module('app.nlpSearch')
        .controller('NlpSearchController', NlpSearchController);

    NlpSearchController.$inject = ['$scope', 'nlpSearchService', '$stateParams'];

    function NlpSearchController($scope, nlpSearchService, $stateParams) {

        var vm = this;

        vm.submit = submit;
        $scope.getTranslation = $scope.$parent.getTranslation;
        vm.match = match;
        vm.addToString = addToString;
        vm.onChange = onChange;
        vm.tags = {};
        vm.queries = [];

        init();

        function init(data) {
            var data = $scope.$parent.getCommonData('tags');
            _.each(data, function(obj) {
                vm.tags[obj.trendata_tag_title] = obj.trendata_tag_id;
                vm.queries.push(obj.trendata_tag_title);
            });

            if ($stateParams.query) {
                vm.selected = $stateParams.query;
                vm.submit();
            }
        }

        vm.selected = '';
        vm.prevQuery = '';

        function submit() {
            if (! vm.selected) {
                return vm.queryResults = false;
            }

            var selectedTags = vm.selected.split(' ');
            var queryTags = _.reduce(selectedTags, function(result, tag) {
                if (vm.tags[tag])
                    result.push(vm.tags[tag]);

                return result;
            }, []);

            nlpSearchService.getSearchResults(queryTags)
                .then(function(charts) {
                    vm.queryResults = charts.length > 0 ? charts : false;
                });
        }

        function addToString(item) {
            var lastIndex = vm.lastQuery.lastIndexOf(" ");
            vm.lastQuery = vm.lastQuery.substr(0, lastIndex) + " ";
            vm.selected = vm.lastQuery + item + " ";
        }

        function match(str) {
            var lastWord = getLastWord(str);
            return _.filter(vm.queries, function (query) {
                return lastWord.length > 2 ? _.includes(query, lastWord) : false;
            })
        }

        function getLastWord (str) {
            if (str.lastIndexOf(" ") > -1) {
                return str.substr(str.lastIndexOf(" ") + 1);
            }
            return str;
        }

        function onChange() {
            vm.lastQuery = angular.copy(vm.selected);
        }
    }
})();

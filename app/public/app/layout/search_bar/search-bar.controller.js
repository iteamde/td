(function () {

    'use strict';

    angular
        .module('app.layout')
        .controller('SearchBarController', SearchBarController);

    SearchBarController.$inject = ['$scope', '$location'];

    function SearchBarController ($scope, $location) {

        var vm = this;

        vm.search = null;
        vm.submit = submit;
        $scope.getTranslation = $scope.$parent.getTranslation;
        vm.match = match;
        vm.addToString = addToString;
        vm.onChange = onChange;
        vm.tags = {};
        vm.queries = [];

        init();

        function init() {
            var data = $scope.$parent.getCommonData('tags');
            _.each(data, function(obj) {
                vm.tags[obj.trendata_tag_title] = obj.trendata_tag_id;
                vm.queries.push(obj.trendata_tag_title);
            });
        }

        vm.selected = '';
        vm.prevQuery = '';

        function submit() {
            $location.path('/nlp-search/' + vm.selected);
            vm.selected = '';
        }

        function addToString(item) {
            var lastIndex = vm.lastQuery.lastIndexOf(" ");
            vm.lastQuery = vm.lastQuery.substr(0, lastIndex) + " ";
            vm.selected = vm.lastQuery + item + " ";
        }

        function match(str) {
            var lastWord = getLastWord(str);
            return _.filter(vm.queries, function (query) {
                return lastWord.length > 2 ? _.includes(query, lastWord.toLowerCase()) : false;
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
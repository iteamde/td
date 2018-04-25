(function () {

    'use strict';

    angular
        .module('app.nlpSearch')
        .controller('NlpSearchController', NlpSearchController);

    NlpSearchController.$inject = ['$scope', 'nlpSearchService', '$stateParams'];

    function NlpSearchController($scope, nlpSearchService, $stateParams) {


        console.log($stateParams.query);

        var vm = this;

        vm.submit = submit;
        $scope.getTranslation = $scope.$parent.getTranslation;
        vm.match = match;
        vm.addToString = addToString;
        vm.onChange = onChange;
        vm.tags = {};
        vm.queries = [];


        //scrollcolumn2d, doughnut2d
       vm.fake =  {
            "id": 55,
            "created_on": "2018-04-12T10:24:05.000Z",
            "status": "1",
            "default_chart_display_type": "doughnut2d",
            "position_x": 0,
            "position_y": 0,
            "width": 300,
            "height": 400,
            "chart_type": "2",
            "title": "Source of hire",
            "description": "This metric shows the percent of employees hired during the month that came as a result of the respective named job source.",
            "chart_data": {
                "data": [{
                    "label": "Job Boards",
                    "value": 2
                }, {
                    "label": "Job Fair",
                    "value": 7
                }, {
                    "label": "LinkedIn",
                    "value": 1
                }],
                "legendItemFontSize": "8",
                "paletteColors": "#33b297, #ee7774, #005075, #33b5e5, #73b234, #aa66cc, #b29234, #72eecf, #b23473",
                "decimals": "1"
            }

        }

        vm.fake1 = {
            "id": 60,
            "created_on": "2017-02-01T12:26:03.000Z",
            "status": "1",
            "default_chart_display_type": "scrollcolumn2d",
            "position_x": 0,
            "position_y": 0,
            "width": 3,
            "height": 4,
            "chart_type": "1",
            "title": "Average Salary",
            "description": "This metrics shows the average total salary for the organization versus the compiled industry average salary based on applied industry data.",
            "chart_data": {
                "slantLabels": "1",
                "numberPrefix": "$",
                "numberSuffix": "",
                "numDivlines": "3",
                "adjustDiv": "0",
                "categories": [{
                    "category": [{
                        "label": "Average"
                    }]
                }],
                "dataset": [{
                    "seriesname": "Average Salary",
                    "data": [{
                        "value": 118920
                    }]
                }, {
                    "seriesname": "Industry Salary",
                    "data": [{
                        "value": 127536
                    }]
                }]
            }
        };


        if($stateParams.query === 'Show average salary increase'){
            vm.mockData = vm.fake;
        } else {
            vm.mockData = vm.fake1;
        }



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

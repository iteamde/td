(function () {

    'use strict';

    angular
        .module('app.chartBuilder')
        .controller('ChartBuilderController', ChartBuilderController);

    ChartBuilderController.$inject = ['$scope'];

    function ChartBuilderController($scope) {
        var vm;

        vm = this;
        $scope.tabs = [
            {
                "heading": $scope.getTranslation('step1_select_metrics'),
                "active": true,
                "template": "app/chart_builder/partial.tab-step-1.html"
            },
            {
                "heading": $scope.getTranslation('step2_chart_type'),
                "active": false,
                "template": "app/chart_builder/partial.tab-step-2.html"
            },
            {
                "heading": $scope.getTranslation('step3_review'),
                "active": false,
                "template": "app/chart_builder/partial.tab-step-3.html"
            }
        ];

        vm.people = [
            {name: 'Adam', email: 'adam@email.com', age: 12, country: 'United States'},
            {name: 'Amalie', email: 'amalie@email.com', age: 12, country: 'Argentina'},
            {name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina'},
            {name: 'Adrian', email: 'adrian@email.com', age: 21, country: 'Ecuador'},
            {name: 'Wladimir', email: 'wladimir@email.com', age: 30, country: 'Ecuador'},
            {name: 'Samantha', email: 'samantha@email.com', age: 30, country: 'United States'},
            {name: 'Nicole', email: 'nicole@email.com', age: 43, country: 'Colombia'},
            {name: 'Natasha', email: 'natasha@email.com', age: 54, country: 'Ecuador'},
            {name: 'Michael', email: 'michael@email.com', age: 15, country: 'Colombia'},
            {name: 'Nicolás', email: 'nicolas@email.com', age: 43, country: 'Colombia'}
        ];

        vm.attributes = [
            {id: 1, name: "Male", value: $scope.getTranslation('male')},
            {id: 2, name: "Female", value: $scope.getTranslation('female')}
        ];
        vm.dimensions = [
            {id: 1, value: $scope.getTranslation('years')},
            {id: 2, value: $scope.getTranslation('months')}
        ];
        //vm.selectedAttributes = vm.attributes[0];
        //vm.selectedDimension = vm.dimensions[0];

        vm.title = "Chart Title";
        vm.description = "Here must be chart description";

        vm.onTabClick = onTabClick;

        vm.chartOptions = [
            {
                title: 'Bar Chart',
                icon_class: "lnr icon-bar-chart",
                text: $scope.getTranslation('bar_chart'),
                chartType: "scrollcolumn2d",
                active: false
            },
            {
                title: 'Line Chart',
                icon_class: "lnr icon-line-chart",
                text: $scope.getTranslation('line_chart'),
                chartType: "scrollline2d",
                active: false
            },

            {
                title: 'Stack Chart',
                icon_class: "lnr icon-stacked-bar",
                text: $scope.getTranslation('stack_chart'),
                chartType: "scrollstackedcolumn2d",
                active: false
            },
            {
                title: 'Pie Chart',
                icon_class: "lnr icon-pie-chart",
                text: $scope.getTranslation('pie_chart'),
                chartType: "pie2d",
                active: false
            },
            {
                title: "Table View",
                icon_class: "lnr icon-table-view",
                text: "Table View",
                chartType: "pie2d",
                active: false
            },
            {
                title: "Combo Line",
                icon_class: "lnr icon-combo-line",
                text: "Combo Line",
                chartType: "pie2d",
                active: false
            },
            {
                title: "Value Box",
                icon_class: "lnr icon-value-chart",
                text: "Value Box",
                chartType: "pie2d",
                active: false
            }
        ];
        vm.activeChartOption = vm.chartOptions[0];
        vm.selectChartOption = selectChartOption;

        // chart data source
        vm.dataSource = {
            "chart": {
                //"caption": "Revenue split by product category",
                //"subCaption": "For current year",
                //"xAxisname": "Quarter",
                //"yAxisName": "Revenues (In USD)",
                "showSum": "0",
                "numberPrefix": "$",
                "theme": "tren"
            },

            "categories": [{
                "category": [{
                    "label": "Q1"
                }, {
                    "label": "Q2"
                }, {
                    "label": "Q3"
                }, {
                    "label": "Q4"
                }, {
                    "label": "Q5"
                }, {
                    "label": "Q6"
                }, {
                    "label": "Q7"
                }, {
                    "label": "Q8"
                }, {
                    "label": "Q9"
                }, {
                    "label": "Q10"
                }, {
                    "label": "Q11"
                }, {
                    "label": "Q12"
                }]
            }],

            "dataset": [{
                "seriesname": "Male",
                "data": [{
                    "value": "11000"
                }, {
                    "value": "15000"
                }, {
                    "value": "13500"
                }, {
                    "value": "15000"
                }, {
                    "value": "11000"
                }, {
                    "value": "15000"
                }, {
                    "value": "13500"
                }, {
                    "value": "15000"
                }, {
                    "value": "11000"
                }, {
                    "value": "15000"
                }, {
                    "value": "13500"
                }, {
                    "value": "15000"
                }]
            }, {
                "seriesname": "Female",
                "data": [{
                    "value": "11400"
                }, {
                    "value": "14800"
                }, {
                    "value": "8300"
                }, {
                    "value": "11800"
                }, {
                    "value": "11400"
                }, {
                    "value": "14800"
                }, {
                    "value": "8300"
                }, {
                    "value": "11800"
                }, {
                    "value": "11400"
                }, {
                    "value": "14800"
                }, {
                    "value": "8300"
                }, {
                    "value": "11800"
                }]
            }]
        };


        function selectChartOption(option) {
            vm.activeChartOption = option;
        }

        function onTabClick(index) {


            switch (index) {
                case 0:
                    vm.progressValue = 33;
                    break;

                case 1:
                    vm.progressValue = 66;
                    break;

                case 2:
                    vm.progressValue = 100;
                    break;
            }


            if (index === 2) {
                vm.isGridItemReady = true;
            }
        }


        // date picker configs
      /*  $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };
*/
        $scope.open = function ($event) {
            $scope.status.opened = true;
        };

        $scope.setDate = function (year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1,
            minMode: 'year'
        };

        $scope.formats = ['yyyy'];
        $scope.format = $scope.formats[0];


        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        $scope.popup1 = {
            opened: false
        };

        // To date picker
        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };

        $scope.popup2 = {
            opened: false
        };

    }


    angular
        .module('app.chartBuilder')
        .filter('propsFilter', function () {
            return function (items, props) {
                var out = [];

                if (angular.isArray(items)) {
                    var keys = Object.keys(props);

                    items.forEach(function (item) {
                        var itemMatches = false;

                        for (var i = 0; i < keys.length; i++) {
                            var prop = keys[i];
                            var text = props[prop].toLowerCase();
                            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                                itemMatches = true;
                                break;
                            }
                        }

                        if (itemMatches) {
                            out.push(item);
                        }
                    });
                } else {
                    // Let the output be the input untouched
                    out = items;
                }

                return out;
            };
        });


})();
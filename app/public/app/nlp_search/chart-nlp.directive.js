(function () {

    'use strict';

    angular.module('app.nlpSearch')
        .directive('addChartNlp', addChartNlp);

    addChartNlp.$inject = ['$compile', 'commonService'];
    function addChartNlp($compile, commonService) {
        return {
            restrict: 'A',
            //transclude: true,
            scope: {status: '='},
            link: function ($scope, $element, $attrs) {
                var chartFrag, chartEl;

                // // watch for status to change on chart item added even
                // $scope.$watch('status', function (newVal, oldVal) {
                //     if (newVal) {

                chartFrag = '<fusioncharts type="{{vm.mockData.default_chart_display_type}}" id="' + $attrs.id + '"  dataFormat="json"  width="100%"  height="300"  datasource="{{vm.mockData.chart_data}}"> </fusioncharts>';
                $element.parent().append(chartFrag);

                // access inserted element and compile it to render the chart
                chartEl = $element.parent().find('fusioncharts');
                $compile(chartEl)($scope.$parent);

                //$scope.$destroy();
                $element.remove();
                //     }
                // }, true);

            }
        };
    }
})();

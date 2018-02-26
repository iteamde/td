(function () {

    'use strict';

    angular.module('app.dashboard')
        .directive('addChart99', addChart);

    addChart.$inject = ['$compile'];
    function addChart($compile) {
        return {
            restrict: 'A',
            //transclude: true,
            scope: {status: '='},
            link: function ($scope, $element, $attrs) {
                var chartFrag, chartEl;

                // watch for status to change on chart item added even
                $scope.$watch('status', function (newVal, oldVal) {
                    if (newVal) {


                        setChartWidthHeight($element.closest('.grid-stack-item '), $scope.$parent.w);

                        chartFrag = '<fusioncharts type="{{w.chartConfig.type}}"  dataFormat="json"  width="{{w.chartWidth}}"  height="{{w.chartHeight}}"  datasource="{{w.chartConfig.dataSource}}"> </fusioncharts>';
                        $element.parent().append(chartFrag);

                        // access inserted element and compile it to render the chart
                        chartEl = $element.parent().find('fusioncharts');
                        $compile(chartEl)($scope.$parent);

                        //$scope.$destroy();
                        $element.remove();
                    }
                }, true);

                // method to set width and height to chart according to container
                function setChartWidthHeight(chart, widget) {

                    var header, headerHeight, chartHeight, width, height;

                    header = chart.find('.chart-header');
                    headerHeight = header.outerHeight(true);
                    chartHeight = chart.height();

                    width = chart.width();
                    height = parseInt((chartHeight - headerHeight), 10);

                    // remove padding on chart inside wrapper
                    height = (height - 47);
                    width = (width - 47);

                    //console.log(chartHeight, headerHeight, width, height);

                    widget.chartWidth = width;
                    widget.chartHeight = height;

                }

            }
        };
    }

})();
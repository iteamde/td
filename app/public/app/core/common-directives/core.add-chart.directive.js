(function () {

    'use strict';

    angular.module('app.core')
        .directive('addChart', addChart);

    addChart.$inject = ['$compile', 'commonService'];
    function addChart($compile, commonService) {
        return {
            restrict: 'A',
            //transclude: true,
            scope: {
                status: '=',
                isChartRendered: '='
            },
            link: function ( $scope, $element, $attrs) {
                var chartFrag, chartEl;

                // watch for status to change on chart item added even
                $scope.$watch('status', function (newVal, oldVal) {
                    if (newVal) {

                        commonService.setChartWidthHeight($element.closest('.grid-stack-item '), $scope.$parent.w);

                        chartFrag = '<fusioncharts   type="{{w.default_chart_display_type}}" id="' + $attrs.id + '"  dataFormat="json"  width="{{w.chartWidth}}"  height="{{w.chartHeight}}"  datasource="{{w.chart_data}}"> </fusioncharts>';
                        $element.parent().append(chartFrag);

                        // access inserted element and compile it to render the chart
                        chartEl = $element.parent().find('fusioncharts');
                        $compile(chartEl)($scope.$parent);

                        FusionCharts.addEventListener("rendered", function (eventObject) {
                            $scope.$emit('chartIsReady');

                        });

                        //$scope.$destroy();
                        $element.remove();

                    }
                }, true);
            }
        };
    }
})();

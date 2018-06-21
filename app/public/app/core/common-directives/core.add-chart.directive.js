(function () {

    'use strict';

    angular.module('app.core')
        .directive('addChart', addChart);

    addChart.$inject = ['$compile', 'commonService', '$document'];
    function addChart($compile, commonService, $document) {
        return {
            restrict: 'A',
            //transclude: true,
            scope: {status: '='},
            link: function ($scope, $element, $attrs) {
                var chartFrag, chartEl;
                // watch for status to change on chart item added even
                $scope.$watch('status', function (newVal, oldVal) {
                    if (newVal) {


                        commonService.setChartWidthHeight($element.closest('.grid-stack-item '), $scope.$parent.w);

                        chartFrag = '<fusioncharts type="{{w.default_chart_display_type}}" id="' + $attrs.id + '"  dataFormat="json"  width="{{w.chartWidth}}"  height="{{w.chartHeight}}"  datasource="{{w.chart_data}}"> </fusioncharts>';
                        $element.parent().append(chartFrag);

                        // access inserted element and compile it to render the chart
                        chartEl = $element.parent().find('fusioncharts');
                        $compile(chartEl)($scope.$parent);

                        //$scope.$destroy();
                        $element.remove();
                    }
                }, true)


                $element.parent().bind('mousemove', function () {
                    // the check is required due to prevent effect of mousemove on chart while it is in process of rendering
                    if($scope.$parent.w.chart_data.chart.showToolTip === '0') {
                        $scope.$parent.w.chart_data.chart.showToolTip = '1';
                        $scope.$apply();
                    }
                });

                $element.parent().bind('contextmenu', function () {
                    $scope.$parent.w.chart_data.chart.showToolTip = '0';
                    $scope.$apply();
                });

                $document.bind('keydown', function () {
                    $scope.$parent.w.chart_data.chart.showToolTip = '0';
                    $scope.$apply();
                });

                $scope.$on('$destroy', function () {
                    $document.unbind('keydown');
                    $element.parent().unbind('contextmenu');
                    $element.parent().unbind('mousemove');
                });

            }


        };
    }
})();

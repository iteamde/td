(function () {
    'use strict';

    angular
        .module('app.metric')
        .controller('MetricController', MetricController);

    MetricController.$inject = [
        '$scope',
        '$rootScope',
        '$window',
        'TILE_MIN_WIDTH',
        'TILE_MIN_HEIGHT',
        'exception',
        '$stateParams',
        'metricService',
        'commonService',
        'ALLOWED_CHART_TYPES',
        'TOOLTIP_MESSAGES'];

    function MetricController($scope, $rootScope, $window, TILE_MIN_WIDTH, TILE_MIN_HEIGHT, exception, $stateParams, metricService, commonService, ALLOWED_CHART_TYPES, TOOLTIP_MESSAGES) {

        var vm = this;

        // charts setting defined in core constants
        vm.TILE_MIN_WIDTH = TILE_MIN_WIDTH;
        vm.TILE_MIN_HEIGHT = TILE_MIN_HEIGHT;

        vm.TOOLTIP_TILES_MESSAGES = TOOLTIP_MESSAGES.TILES;
        vm.ALLOWED_CHART_TYPES = ALLOWED_CHART_TYPES;

        vm.exportChart = commonService.exportChart;
        vm.changeChartType = commonService.changeChartType;
        vm.addToDashboard = addToDashboard;
        vm.shareChart = commonService.shareChart;

        activate();

        //commonService.setupGrid($scope);

        // show charts handler all the time.
        $scope.labelBoxOptions = {
            alwaysShowResizeHandle: true,
            disableResize: true
        };
        $scope.options = {alwaysShowResizeHandle: true};

        // Chart Events: on chart add to inform chart directive
        $scope.isChartResizing = false;
        $scope.onItemAdded = commonService.onItemAdded($scope);
        $scope.onResizeStart = commonService.onResizeStart($scope);
        $scope.onResizeStop = commonService.onResizeStop($scope);
        $scope.onWindowResize = commonService.onWindowResize($scope);
        $scope.onDragStop = setChartsOrder;

        function activate() {
            metricService.getMetricCharts($stateParams.id)
                .success(getMetricChartsComplete)
                .catch(serviceError);
        }


        function getMetricChartsComplete(data) {
            
            /**
            * HIDE "Quality of Hires" Metric From Source Of Hire Page for now
            */
            if ($stateParams.id == 3) {
                data.charts = _.filter(data.charts, function(chart){ return chart.id != 41; });
            }


            $scope.widgets = data.charts;
            vm.valueBox = data.value_box;

            // get column width
            commonService.getColumnWidth(vm.valueBox, $window);

            // change charts theme
            commonService.changeFusionTheme(data.charts);


            if (data.table.length > 0) {
                commonService.configGrid(data.table[0]);
            }

        }

        function setChartsOrder() {

            //sortByOrder lodash
            var sortByID = _
                .chain($scope.widgets)
                .sortBy('x')
                .sortBy('y')
                .map(function (chart) {
                    return chart.id;
                })
                .value();

            metricService.setChartsOrder(sortByID, $stateParams.id)
                .success(function() {console.log('sorted')})
                .catch(serviceError);
        }

        function serviceError(error) {
            exception.catcher('XHR Failed for metric')(error);
        }

        function addToDashboard(id) {
            metricService.addToDashboard({
                chart_id: id,
                dashboard_id: $rootScope.dashboardId
            })
            .success(addToDashboardComplete)
            .catch(serviceError);
        }

        function addToDashboardComplete() {
            commonService.notification(vm.TOOLTIP_TILES_MESSAGES.ADD_TO_DASHBOARD_NOTY, "success");
        }

    }


})();
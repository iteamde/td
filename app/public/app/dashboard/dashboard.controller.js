(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$rootScope','$scope', '$window', 'TILE_MIN_WIDTH', 'TILE_MIN_HEIGHT', 'exception', '$stateParams', 'dashboardService', 'commonService', 'videoService', '$uibModal'];

    function DashboardController($rootScope, $scope, $window, TILE_MIN_WIDTH, TILE_MIN_HEIGHT, exception, $stateParams, dashboardService, commonService, videoService, $uibModal) {

        var vm;

        vm = this;
        vm.selectedPeriod = '';

        setTimeout(function() {
            activate();
        });
        commonService.setupGrid($scope);

        vm.exportChart = commonService.exportChart;
        vm.changeChartType = commonService.changeChartType;
        vm.removeChart = removeChart;
        vm.playVideo = playVideo;
        vm.lastUploadedBg = lastUploadedBg;
        vm.shareChart = commonService.shareChart;
        vm.choosePeriod = choosePeriod;

        // charts setting defined in core constants
        vm.TILE_MIN_WIDTH = TILE_MIN_WIDTH;
        vm.TILE_MIN_HEIGHT = TILE_MIN_HEIGHT;

        // show charts handler all the time.
        $scope.labelBoxOptions = {alwaysShowResizeHandle: true};
        $scope.options = {alwaysShowResizeHandle: true};

        // Chart Events: on chart add to inform chart directive
        $scope.isChartResizing = false;
        $scope.onItemAdded = commonService.onItemAdded($scope);
        $scope.onResizeStart = commonService.onResizeStart($scope);
        $scope.onResizeStart = commonService.onResizeStart($scope);
        $scope.onResizeStop = commonService.onResizeStop($scope, setChartsOrder);
        $scope.onWindowResize = commonService.onWindowResize($scope);
        $scope.setChartsOrder = setChartsOrder;
        $scope.videoUrl;

        function activate() {
            vm.dashboard_id = $stateParams.id || $rootScope.dashboardId;
            dashboardService.getDashboardCharts(vm.dashboard_id)
                .success(getDashboardChartsComplete)
                .catch(serviceError);
        }

        function getDashboardChartsComplete(data) {
            console.log(data);
            vm.valueBox = data.value_box;
            vm.lastUploaded = data.tuff_users_last_uploaded_date;

            // change charts theme
            commonService.changeFusionTheme(data.charts);

            commonService.charts ? $scope.widgets = data.charts.concat(commonService.charts) : $scope.widgets = data.charts;

            if (data.table.length > 0) {
                commonService.configGrid(data.table[0]);
            }

            videoService.getVideo()
                .success(function(video) {
                    if (video)
                        $scope.videoUrl = video.trendata_video_video;
                });
            lastUploadedBg()
        }

        $scope.$on('periodChanged', function(e, period) {
            dashboardService.getDashboardCharts(vm.dashboard_id, period)
                .success(function(data) {
                    vm.valueBox = data.value_box;
                    commonService.changeFusionTheme(data.charts);
                    $scope.widgets = commonService.charts ? data.charts.concat(commonService.charts) : data.charts;
                    if (period.start === period.end) {
                        vm.selectedPeriod = moment().subtract(period.start, 'month').format('MMMM YYYY');
                    } else {
                        vm.selectedPeriod = moment().subtract(period.start, 'month').format('MMMM YYYY') + ' - ' + moment().subtract(period.end, 'month').format('MMMM YYYY')
                    }
                })
                .catch(serviceError);
        });

        function setChartsOrder(charts) {
            var sortedCharts = _.map(_.orderBy(charts, ['x', 'y'], ['asc', 'asc']), function (chart) {
                    return {
                        chartId : chart.id,
                        chartHeight : chart.height,
                        chartWidth : chart.width,
                        chartX: chart.x,
                        chartY: chart.y
                    };
                });

            dashboardService.setChartsOrder(sortedCharts, vm.dashboard_id)
                .catch(serviceError);
        }

        function serviceError(error) {
            exception.catcher($scope.getTranslation('xhr_failed_for_dashboard'))(error);
        }

        function removeChart(chartId) {
            dashboardService.removeChart(vm.dashboard_id, chartId)
                .success(function() {
                    $window.location.reload();
                })
                .catch(serviceError);
        }

        $scope.checkAutopos = function(charts) {
            return _.every(charts, function(chart) {
                return !chart.x && !chart.y;
            });
        }

        function playVideo() {
            videoService.playVideo($scope.videoUrl);
        }

        function lastUploadedBg() {
            var days = moment().diff(moment(vm.lastUploaded), 'days');
            return  days <= 30 ? '#33B297' : days <= 60 ? '#FFA300' : '#FF0700';
        }

        function choosePeriod() {
            $uibModal.open({
                animation: false,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/dashboard/metric-history/dashboard.metric-history.view.html',
                controller: 'ModalMetricHistoryController',
                controllerAs: 'vm',
                scope: $scope,
                resolve: {
                    periods: function() {
                        var months = _.map(_.range(1, 13), function(i) {
                            return  {
                                start: i,
                                end: i,
                                title: moment().subtract(i, 'month').format('MMMM YYYY')
                            };
                        });

                        return _.concat(months, [
                            {
                                start: moment().format('M') - 1,
                                end: 1,
                                title: 'YTD'
                            },
                            {
                                start: null,
                                end: null,
                                title: 'Custom'
                            },
                            {
                                start: 12,
                                end: 1,
                                title: '1 year'
                            },
                            {
                                start: 36,
                                end: 1,
                                title: '3 years'
                            },
                            {
                                start: 60,
                                end: 1,
                                title: '5 years'
                            },
                        ]);
                    }
                }
            });
        }
    }
})();

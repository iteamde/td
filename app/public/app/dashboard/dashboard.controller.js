(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = [
        '$rootScope',
        '$scope',
        '$window',
        'TILE_MIN_WIDTH',
        'TILE_MIN_HEIGHT',
        'exception',
        '$stateParams',
        'dashboardService',
        'commonService',
        'videoService',
        'alertsService',
        '$uibModal',
        'mockDataService',
        '$localStorage',
        'drillDownService',
        'analyticsService'
    ];

    function DashboardController(
        $rootScope,
        $scope,
        $window,
        TILE_MIN_WIDTH,
        TILE_MIN_HEIGHT,
        exception,
        $stateParams,
        dashboardService,
        commonService,
        videoService,
        alertsService,
        $uibModal,
        mockDataService,
        $localStorage,
        drillDownService,
        analyticsService) {

        var vm;
        var rel = '?rel=0';
        vm = this;
        vm.selectedPeriod = '';

        setTimeout(function () {
            activate();
        });

        vm.exportChart = commonService.exportChart;
        vm.changeChartType = commonService.changeChartType;
        vm.removeChart = removeChart;
        vm.playVideo = playVideo;
        vm.lastUploadedBg = lastUploadedBg;
        vm.openAlertsModal = openAlertsModal;
        vm.choosePeriod = choosePeriod;
        vm.isTable = isTable;

        // charts setting defined in core constants
        vm.TILE_MIN_WIDTH = TILE_MIN_WIDTH;
        vm.TILE_MIN_HEIGHT = TILE_MIN_HEIGHT;

        // show charts handler all the time.
        $scope.labelBoxOptions = {
            alwaysShowResizeHandle: true
        };
        $scope.options = {
            alwaysShowResizeHandle: true
        };

        // Chart Events: on chart add to inform chart directive
        $scope.isChartResizing = false;
        $scope.onItemAdded = commonService.onItemAdded($scope);
        $scope.onResizeStart = commonService.onResizeStart($scope);
        $scope.onResizeStart = commonService.onResizeStart($scope);
        $scope.onResizeStop = commonService.onResizeStop($scope, setChartsOrder);
        $scope.onWindowResize = commonService.onWindowResize($scope);
        $scope.setChartsOrder = setChartsOrder;
        $scope.checkAutopos = checkAutopos;
        $scope.videoUrl;
        $scope.limit = 1;

        FusionCharts.addEventListener("loaded", function () {
            $scope.limit= $scope.limit + 3;
        });
        function activate() {
            vm.dashboard_id = $stateParams.id || $rootScope.dashboardId;
            dashboardService.getDashboardCharts(vm.dashboard_id)
                .success(getDashboardChartsComplete)
                .catch(serviceError);

        }

        vm.shareChart = function(index, title) {
            var date = 'for ' + moment().subtract(1, 'month').format('MMMM YYYY');
            if (vm.selectedPeriod) {
                date = vm.selectedPeriod.indexOf('-') < 0
                    ? 'for ' + vm.selectedPeriod
                    : 'since ' + vm.selectedPeriod.split('-')[0];
            }

            commonService.shareChart(index, title, 'Metric', date);
        };

        function getDashboardChartsComplete(data) {
            vm.valueBox = data.value_box;
            vm.lastUploaded = data.tuff_users_last_uploaded_date;

            // change charts theme
            commonService.changeFusionTheme(data.charts);

            commonService.charts ? $scope.widgets = data.charts.concat(commonService.charts) : $scope.widgets = data.charts;

            $scope.widgets.sort(function (a,b) {
                return a.chart_data.dataset && b.chart_data.dataset && (a.chart_data.dataset[0].data.length - b.chart_data.dataset[0].data.length);
            });

            videoService.getVideo()
                .success(function (video) {
                    if (video)
                        $scope.videoUrl = video.trendata_video_video + rel;
                });

            // TODO: delete when Survey will doesn`t need anymore
            if($localStorage.addChart) {
                var surveysChart = mockDataService.getSurveysChart()[0];
                surveysChart.mockType = 0;
                surveysChart.default_chart_display_type = "doughnut2d";
                surveysChart.chart_data.paletteColors = '#33b297, #ee7774, #005075, #33B5E5, #AA66CC, #00002a, #00892a, #7a7730, #ddff2a';
                $scope.widgets.push(surveysChart);
            }
            // TODO: delete when Survey will doesn`t need anymore
            var localstorageKeys = Object.keys($localStorage);
            localstorageKeys.forEach(function(item){
                var mockChart = mockDataService.getSurveysChart()[0];
                var options = {};
                var str ='';

                if(item.includes('addChartDDS')) {
                    mockChart.mock =item;
                     str = item.replace('addChartDDS', '');
                     options = {
                        id: '29',
                        type: 'change_chart_view',
                        view: str,
                        axis: 'Values',
                        filter: '',
                        user_pagination: ''
                    };
                    drillDownService.changeChart(options)
                        .success(changeChartCompleteDD);
                }
                if(item.includes('addChartAS')) {
                    mockChart.mock =item;
                     str = item.replace('addChartAS', '');
                     options = {
                        id: '29',
                        type: 'change_chart_view',
                        view: str,
                        axis: 'Values',
                        filter: '',
                        user_pagination: ''
                    };
                    analyticsService.changeChart(options)
                        .success(changeChartCompleteDD);
                }

                function changeChartCompleteDD(res){
                    mockChart.chart_data.dataset = res.chart_data.chart_data.categories;
                    mockChart.chart_data.categories = res.chart_data.chart_data.categories;
                    mockChart.chart_data.dataset = res.chart_data.chart_data.dataset;
                    $scope.widgets.push(mockChart);
                }

            });



            lastUploadedBg()
        }

        $scope.$on('periodChanged', function (e, period) {
            dashboardService.getDashboardCharts(vm.dashboard_id, period)
                .success(function (data) {
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
                        id : chart.id,
                        chartHeight : chart.height,
                        chartWidth : chart.width,
                        chartX: chart.x,
                        chartY: chart.y
                    };
                });

            dashboardService.setChartsOrder(sortedCharts)
                .catch(serviceError);
        }

        function serviceError(error) {
            exception.catcher('XHR Failed for dashboard')(error);
        }

        function removeChart(id) {
            dashboardService.removeChart(id)
                .success(function () {
                    $window.location.reload();
                })
                .catch(serviceError);
        }

         function checkAutopos(charts) {
            return _.every(charts, function(chart) {
                return !chart.x && !chart.y;
            });
        }

        function playVideo() {
            videoService.playVideo($scope.videoUrl);
        }

        function lastUploadedBg() {
            var days = moment().diff(moment(new Date(vm.lastUploaded)), 'days');
            return days <= 30 ? '#33B297' : days <= 60 ? '#FFA300' : '#FF0700';
        }

        function isTable(chart) {
            return chart.default_chart_display_type == 'table';
        }

        function openAlertsModal(chart) {
            alertsService.openModal($scope, chart.chart_id, chart, 1);
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
                    periods: function () {
                        var months = _.map(_.range(1, 13), function (i) {
                            return {
                                start: i,
                                end: i,
                                title: moment().subtract(i, 'month').format('MMMM YYYY')
                            };
                        });

                        return _.concat(months, [{
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

        // TODO: delete when Survey will doesn`t need anymore
        vm.removeSurveysChart = function(index, chart){

            if(!chart.mockType) delete $localStorage.addChart;
            if($localStorage.hasOwnProperty(chart.mock)) delete $localStorage[chart.mock]
            $scope.widgets.splice(index,1);
        }


    }
})();
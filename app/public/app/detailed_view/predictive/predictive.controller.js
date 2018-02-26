(function () {

    'use strict';

    angular
        .module('app.predictive')
        .controller('PredictiveController', PredictiveController);

    PredictiveController.$inject = ['$scope', '$q', 'data', 'events', '$stateParams', 'exception', 'predictiveService', 'mockDataService', 'commonService', 'commonChartService', 'debounceService', 'PREDICTIVE_CHART_CORRECTION', 'videoService'];

    function PredictiveController($scope, $q, data, events, $stateParams, exception, predictiveService, mockDataService, commonService, commonChartService, debounceService, PREDICTIVE_CHART_CORRECTION, videoService) {

        var vm = this;

        vm.toggleCheckbox = toggleCheckbox;
        vm.update = update;
        vm.saveToDashboard = saveToDashboard;
        vm.toggleAnnotations = toggleAnnotations;
        vm.setValue = setValue;
        vm.resetGrid = resetGrid;
        vm.showMoreLess = showMoreLess;
        vm.playVideo = playVideo;
        vm.createToken = commonService.createToken;

        vm.activeTab = 0;
        vm.activeGrid = 0;
        vm.yearRange = ['1 year'];
        vm.chartView = ['Total', 'By Performance'];
        
        vm.showSpinner = true;
        vm.showData = false;
        vm.isLoading = false;
        
        $scope.summaryValues = [];
        $scope.videoUrl;

        // grid configuration
        commonService.chartConfig($scope, vm);

        activate();

        function activate() {
            $scope.widgets = mockDataService.widgets();
            $scope.widgets[0].title = data.title;

            $scope.eventsArr = events;

            $scope.widgets[0].default_chart_display_type = "mscombi2d";

            $scope.summary = data.chart_data.summary;

            //Individual Tab Grid
            $scope.users = data.chart_data.users;
            $scope.totalUsers = data.chart_data.users_count;
            $scope.chartId = data.id;
            $scope.customFields = _.chain(data.chart_data.available_filters)
                .keys()
                .filter(function(field) {
                    return field.indexOf('custom') === 0;
                })
                .map(function(field) {
                    return field.slice(7);
                })
                .value();

            $scope.gridFilter = commonChartService.createFilter($scope.data);
            _.each($scope.gridFilter, function(val, key) {
                showMoreLess(val);
            });
            $scope.curveDebounce = debounceService(predictiveService.getCurvePoints, 1000, false);

            //commonService.updateGrid($scope, $scope.data);
            
            vm.showSpinner = false;
            vm.showData = true;

            videoService.getVideo()
                .success(function(video) {
                    if (video)
                        $scope.videoUrl = video.trendata_video_video;
                });
        }

        $scope.$on('summaryChanged', function(event, values) {
            event.stopPropagation();
            $scope.chartData = values;
            $scope.summaryValues = values;
            changeChart(values);
        });

        function toggleCheckbox(filter) {

            _.forIn(filter.values, function(value, key) {
                filter.values[key] = filter.all;
            });
            if(filter.all)
                showMoreLess(filter);
            else{
                filter.loadMore = false;
                filter.loadLess = false;
            }
            update();
        }

        function showMoreLess(filter, count) {
            var max = 15;
            if (typeof count != 'undefined') {
                var ind = 0;
                _.each(filter.values, function(val, key) {
                    filter.values[key] = true;
                    ind++;
                });
                if(ind > max){
                    filter.loadMore = false;
                    filter.loadLess = true;
                }else{
                    filter.loadMore = false;
                    filter.loadLess = false;
                }
            } else {
                var ind = 0;
                _.each(filter.values, function(val, key) {
                    filter.values[key] = (ind >= max)?false:true;
                    ind++;
                });
                if(ind > max){
                    filter.loadMore = true;
                    filter.loadLess = false;
                }else{
                    filter.loadMore = false;
                    filter.loadLess = false;
                }
            }
        }
        
        function update() {
            vm.isLoading = true;
            //create mediator (chart, every grid tab)
            commonService.updateGrid($scope, $scope.data);
            //$scope.barData = _.find($scope.summaryGrid.dataToArray(), {name: $scope.widgets[0].chartView});

            $scope.widgets[0].trendline ? curvePoints() : changeChart($scope.summaryValues);

            toggleAnnotations();
        }

        function curvePoints() {

            $scope.defaultBarData = _.find($scope.chartData, {name: 'Total Turnover'});

            if ($scope.widgets[0].trendline) {
                var debounce = $scope.curveDebounce($stateParams.id, $scope.barData || $scope.defaultBarData);

                debounce.then(curvePointsSuccess)
                        .catch(serviceError);
            }
        }

        function curvePointsSuccess(res) {
            $scope.defaultTrendline = $scope.defaultTrendline || res.data.chart_data.trendLine;
            changeChart($scope.chartData, res.data.chart_data.trendLine);
        }

        function resetGrid() {
            predictiveService.resetGrid($scope);
        }

        function toggleAnnotations() {
            $scope.widgets[0].chart_data.annotations = annotations();
        }

        function setValue(name, value) {
            vm[name] = value;
        }

        function saveToDashboard() {
            commonService.saveToDashboard($scope.widgets[0]);
        }

        function serviceError(error) {
            exception.catcher('XHR Failed for Predictive View')(error);
            vm.isLoading = false;
        }

        function changeChart(chartValues, trendLine) {
            commonChartService.changeRange($scope.widgets[0], chartValues, getSettings(), trendLine ? trendLine : '', $scope.strategy);
            vm.isLoading = false;
        }

        function getSettings() {
            return commonChartService.getPredictiveSettings($scope.widgets[0].chartView, $scope.widgets[0].range);
        }

        function annotations() {
            return $scope.widgets[0].annotation ? commonChartService.createAnnotations($scope.eventsArr, PREDICTIVE_CHART_CORRECTION, $scope.widgets[0].range, 'predictive'): [];
        }

        $scope.resizeChart = function(tab) {
            vm.setValue('activeTab', vm.activeTab === tab ? 0 : tab);
            angular.element('.grid-stack-item-content').addClass('resizing');

            var chart = FusionCharts.items[_.keys(FusionCharts.items)[0]];
            setTimeout(function() {
                var height = angular.element('.grid-stack-item-content').height() - angular.element('.chart-header').height();
                chart.resizeTo(chart.width, height - 35);
                angular.element('.grid-stack-item-content').removeClass('resizing');
            }, 0);
        }

        function playVideo() {
            videoService.playVideo($scope.videoUrl);
        }
    }
})();
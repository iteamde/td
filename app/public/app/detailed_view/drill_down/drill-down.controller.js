(function () {

    'use strict';

    angular
        .module('app.drillDown')
        .controller('DrillDownController', DrillDownController);

    DrillDownController.$inject = [
        '$scope',
        'exception',
        '$stateParams',
        'drillDownService',
        'mockDataService',
        'commonService',
        'videoService',
        'alertsService'
    ];

    function DrillDownController($scope,
                                 exception,
                                 $stateParams,
                                 drillDownService,
                                 mockDataService,
                                 commonService,
                                 videoService,
                                 alertsService) {

        var vm = this;
        var originalChartData,
            filteredChartData;

        vm.toggleCheckbox = toggleCheckbox;
        vm.updateChart = updateChart;
        vm.saveToDashboard = saveToDashboard;
        vm.setActive = setActive;
        vm.showMoreLess = showMoreLess;
        vm.showMoreLessLink = showMoreLessLink;
        vm.filteredValues = _.pickBy;
        vm.getFilterName = getFilterName;
        vm.playVideo = playVideo;
        vm.shareChart = commonService.shareChart;
        vm.hideEmptyValues = hideEmptyValues;
        vm.createToken = commonService.createToken;
        vm.openAlertsModal = openAlertsModal;

        vm.activeTab = 0;
        vm.showCustom = 0;

        vm.showSpinner = true;
        vm.showData = false;
        vm.maxFiltersCount = 15;
        vm.isLoading = false;

        $scope.pagination = {};
        $scope.videoUrl;
        $scope.hideEmpty = true;

        // grid configuration
            commonService.chartConfig($scope, vm);

        activate();

        function activate() {
            drillDownService.getCharts($stateParams.id)
                .success(getChartsComplete)
                .catch(serviceError);
        }

        function getChartsComplete(res) {
            $scope.widgets = mockDataService.widgets();
            $scope.widgets[0].default_chart_display_type = "mscombi2d";
            $scope.widgets[0].title = res.title;
            $scope.chartViews = res.chart_data.available_chart_view;
            $scope.verticalAxis = res.chart_data.available_vertical_axis_types;
            
            $scope.filters = drillDownService.createFilter(res.chart_data.available_filters);
            _.each($scope.filters, function(val, key) {
                showMoreLess(val);
            });

            vm.axis = $scope.verticalAxis[1];
            vm.view = $scope.chartViews[0];
            $scope.users = res.chart_data.users;
            $scope.totalUsers = res.chart_data.users_count;
            $scope.chartId = res.id;
            $scope.customFields = _.chain(res.chart_data.available_filters)
                .keys()
                .filter(function(field) {
                    return field.indexOf('custom') === 0;
                })
                .map(function(field) {
                    return field.slice(7);
                })
                .value();

            $scope.pagination.totalItems = $scope.gridOptions.maxSize = res.chart_data.users_count;
            angular.extend($scope.widgets[0].chart_data, res.chart_data.chart_data);
            originalChartData = _.cloneDeep($scope.widgets[0].chart_data);
            vm.showSpinner = false;
            vm.showData = true;

            videoService.getVideo()
                .success(function(video) {
                    if (video)
                        $scope.videoUrl = video.trendata_video_video;
                });
        }

        function serviceError(error) {
            vm.isLoading = false;
            exception.catcher('XHR Failed for DrillDown')(error);
        }

        function toggleCheckbox(filter, value) {
            if (value != undefined) {
                _.each(filter.values, function(val, key) {
                    filter.values[key] = value;
                });
                if(value)
                    showMoreLess(filter);
                else{
                    filter.loadMore = false;
                    filter.loadLess = false;
                }
            } else {
                filter.all = _.every(filter.values, function (val) {
                    return val;
                });
            }

            if ($scope.pagination)
                $scope.pagination.page_number = 1;

            updateChart();
        }
        
        function showMoreLess(filter, expand) {
            filter.expanded = expand;
        }

        $scope.$on('paginationChange', function (event, pagination) {
            event.stopPropagation();
            $scope.pagination = pagination;
            updateChart();
        });

        function updateChart() {
            vm.isLoading = true;

            var options = {
                id: $stateParams.id,
                view: vm.view,
                axis: vm.axis,
                filter: $scope.filters,
                user_pagination: $scope.pagination
            };

            drillDownService.changeChart(options)
                .success(changeChartComplete)
                .catch(serviceError);
        }

        function changeChartComplete(res) {
            $scope.users = res.chart_data.users;
            $scope.totalUsers = res.chart_data.users_count;
            angular.extend($scope.widgets[0].chart_data, res.chart_data.chart_data);
            originalChartData = _.cloneDeep($scope.widgets[0].chart_data);
            if ($scope.hideEmpty) {
                hideEmptyValues($scope.hideEmpty);
            }

            vm.isLoading = false;
        }

        function saveToDashboard() {
            commonService.saveToDashboard($scope.widgets[0]);
        }

        function setActive(index) {
            vm.activeTab = vm.activeTab === index ? 0 : index;
        }

        $scope.resizeChart = function(tab) {
            vm.setActive(vm.activeTab === tab ? 0 : tab);
        }

        function showMoreLessLink(values) {
            return _.keys(_.filter(values)).length > vm.maxFiltersCount;
        }

        function getFilterName(filterName) {
            return filterName && filterName.replace(/^custom\s+/gi, '') || '';
        }

        function playVideo() {
            videoService.playVideo($scope.videoUrl);
        }

        function hideEmptyValues(hideEmpty) {
            $scope.hideEmpty = hideEmpty;
            if (hideEmpty) {
                filteredChartData = _.cloneDeep(originalChartData);
                var indexToRemove = _.map(filteredChartData.categories[0].category, function(category, index) {
                    return _.some(filteredChartData.dataset, function(dataset) {
                        return +dataset.data[index].value;
                    });
                });

                filteredChartData.categories[0].category = _.filter(filteredChartData.categories[0].category, function(item, index) {
                    return indexToRemove[index];
                });
                _.each(filteredChartData.dataset, function(dataset) {
                    dataset.data = _.filter(dataset.data, function(item, index) {
                        return indexToRemove[index];
                    });
                });
                $scope.widgets[0].chart_data = _.cloneDeep(filteredChartData);
            } else {
                $scope.widgets[0].chart_data = _.cloneDeep(originalChartData);
            }
        }

        function openAlertsModal() {
            alertsService.openModal($scope, $stateParams.id, $scope.widgets[0], 2, $scope.filters, vm.view);
        }
    }
})();
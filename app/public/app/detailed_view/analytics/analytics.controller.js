(function () {

    'use strict';

    angular
        .module('app.analytics')
        .controller('AnalyticsController', AnalyticsController);

    AnalyticsController.$inject = [
        '$scope',
        '$q',
        'analyticsService',
        'exception',
        '$stateParams',
        'mockDataService',
        'commonService',
        'commonChartService',
        'eventService',
        'ANALYTICS_CHART_CORRECTION',
        'videoService'
    ];

    function AnalyticsController($scope,
                                 $q,
                                 analyticsService,
                                 exception,
                                 $stateParams,
                                 mockDataService,
                                 commonService,
                                 commonChartService,
                                 eventService,
                                 ANALYTICS_CHART_CORRECTION,
                                 videoService) {

        var vm = this;

        vm.toggleCheckbox = toggleCheckbox;
        vm.updateChart = updateChart;
        vm.saveToDashboard = saveToDashboard;
        vm.toggleAnnotations = toggleAnnotations;
        vm.setValue = setValue;
        vm.showMoreLess = showMoreLess;
        vm.showMoreLessLink = showMoreLessLink;
        vm.filteredValues = _.pickBy;
        vm.getFilterName = getFilterName;
        vm.playVideo = playVideo;
        vm.shareChart = commonService.shareChart;
        $scope.exportUsersToCsv = function() {
            analyticsService.exportUsersToCsv($scope.filters, $scope.pagination, vm.usersFilterData, $scope.chartId);
        };
        $scope.exportSummaryToCsv = function() {
            analyticsService.exportSummaryToCsv($scope.filters);
        };
        vm.getMonths = analyticsService.getMonths;
        vm.createToken = commonService.createToken;

        // grid configuration
        commonService.chartConfig($scope, vm);
        $scope.videoUrl;

        activate();

        function activate() {
            var chart = analyticsService.getCharts($stateParams.id),
                events = eventService.getEvents();

            $q.all([chart, events])
                .then(getChartsComplete)
                .catch(serviceError);
        }
        vm.activeTab = 0;
        vm.activeGrid = 0;
        vm.regression = false;
        vm.annotation = false;
        vm.usersFilterData = null;

        vm.showSpinner = true;
        vm.showData = false;
        vm.maxFiltersCount = 15;
        vm.isLoading = false;
        vm.timeSpans = [];
        vm.errorMessage = '';
        vm.customTimeSpan = {
            start: false,
            end: false
        };
        vm.showCustom = 0;

        vm.open = {
            start: false,
            end: false
        };

        vm.datePickerOptions = {
            formatYear: 'yyyy',
            maxDate: moment().subtract(1, 'month'),
            minDate: null,
            minMode: 'month'
        };

        function getChartsComplete(res) {
            // charts
            $scope.widgets = mockDataService.widgets();
            $scope.widgets[0].title = res[0].data.title;

            $scope.widgets[0].default_chart_display_type = "mscombi2d";

            $scope.eventsArr = res[1].data;

            $scope.chartViews = res[0].data.chart_data.available_chart_view.map(function(item) {
                return item.toLowerCase();
            });
            vm.timeSpans = _.map(res[0].data.chart_data.available_time_spans, function(item) {
                return {
                    start: item > 1 ? (item - 1) * 12 + +moment().format('M') - 1 : item * 12,
                    end: null,
                    title: item + ' year' + (item > 1 ? 's' : '')
                };
            });
            vm.timeSpans.push({
                start: null,
                end: null,
                title: 'Custom'
            });
            $scope.verticalAxis = res[0].data.chart_data.available_vertical_axis_types;

            vm.axis = $scope.verticalAxis[1];
            vm.view = $scope.chartViews.indexOf(res[0].data.chart_data.default_chart_view) > -1 ? res[0].data.chart_data.default_chart_view : 'total';
            vm.timeSpan = vm.timeSpans[0];

            $scope.users = res[0].data.chart_data.users;
            $scope.totalUsers = res[0].data.chart_data.users_count;
            $scope.chartId = res[0].data.id;
            vm.usersFilterData = res[0].data.chart_data.users_filter_data;
            $scope.customFields = _.chain(res[0].data.chart_data.available_filters)
                .keys()
                .filter(function(field) {
                    return field.indexOf('custom') === 0;
                })
                .map(function(field) {
                    return field.slice(7);
                })
                .value();

            $scope.filters = analyticsService.createFilter(res[0].data.chart_data.available_filters);
            _.each($scope.filters, function(val, key) {
                showMoreLess(val);
            });

            vm.summary = res[0].data.chart_data.summary;

            angular.extend($scope.widgets[0].chart_data, res[0].data.chart_data.chart_data);
            
            vm.showSpinner = false;
            vm.showData = true;

            videoService.getVideo()
                .success(function(video) {
                    if (video)
                        $scope.videoUrl = video.trendata_video_video;
                });
        }

        function serviceError(error) {
            exception.catcher('XHR Failed for Analytics')(error);
            vm.isLoading = false;
        }

        function toggleCheckbox(filter, value) {
            if (value !== undefined) {
                _.each(filter.values, function(val, key) {
                    filter.values[key] = value;
                });

                if (value)
                    showMoreLess(filter);
                else
                    filter.expanded = false;

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
            updateChart('change_page');
        });

        function updateChart(type) {
            if (vm.timeSpan.start === null) {
                return;
            }
            vm.isLoading = true;

            var options = {
                id: $stateParams.id,
                type: type,
                view: vm.view,
                axis: vm.axis,
                time_span: vm.timeSpan,
                filter: $scope.filters,
                user_pagination: $scope.pagination,
                regression: vm.regression
            };

            analyticsService.changeChart(options)
                .success(changeChartComplete)
                .catch(serviceError);
        }

        function changeChartComplete(res) {
            if (res.chart_data.users) {
                $scope.users = res.chart_data.users;
            }

            if (res.chart_data.users_count || res.chart_data.users_count === 0) {
                $scope.totalUsers = res.chart_data.users_count;
            }

            if (res.chart_data.summary) {
                vm.summary = res.chart_data.summary;
            }

            if (res.chart_data.chart_data) {
                angular.extend($scope.widgets[0].chart_data, res.chart_data.chart_data);
            }

            toggleAnnotations();
            vm.isLoading = false;
        }

        function toggleAnnotations() {
            var annotations = vm.annotation ? commonChartService.createAnnotations($scope.eventsArr, ANALYTICS_CHART_CORRECTION, vm.timeSpan.title.charAt(0)): [];
            $scope.widgets[0].chart_data.annotations = annotations;
        }

        function setValue(name, index) {
            vm[name] = index;console.log(vm[name]);
        }

        function saveToDashboard() {
            commonService.saveToDashboard($scope.widgets[0]);
        }

        $scope.resizeChart = function(tab) {
            vm.setValue('activeTab', vm.activeTab === tab ? 0 : tab);
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

        vm.checkDates = function(period) {
            if (! period.start || ! period.end) {
                vm.errorMessage = 'All fields are required.';
                return false;
            }

            if (period.start > period.end) {
                vm.errorMessage = 'Start date should be before End date.';
                return false;
            }

            vm.timeSpan.start = moment().diff(moment(period.start), 'month');
            vm.timeSpan.end = moment().diff(moment(period.end), 'month');

            vm.updateChart();
        }

        vm.toggleDatePicker = function(key) {
            vm.open[key] = !vm.open[key];
        }
    }
})();
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
        '$rootScope',
        '$uibModal',
        '$location',
        'alertsService', '$localStorage'
    ];

    function DrillDownController($scope,
        exception,
        $stateParams,
        drillDownService,
        mockDataService,
        commonService,
        videoService,
        $rootScope,
        $uibModal,
        $location,
        alertsService, $localStorage) {

        var vm = this;
        var rel = '?rel=0';
        var originalChartData;
        var filteredChartData;

        vm.generalFilters = $localStorage.filters;
        vm.chartFilters = $localStorage.chartFilters;
        vm.chartView = $localStorage.chartView;
        vm.verticalAxis = $localStorage.verticalAxis;
        vm.highest = $localStorage.highest;

        delete $localStorage.filters;
        delete $localStorage.chartFilters;
        delete $localStorage.chartView;
        delete $localStorage.verticalAxis;
        delete $localStorage.highest;

        vm.toggleCheckbox = toggleCheckbox;
        vm.updateChart = updateChart;
        vm.setActive = setActive;
        vm.showMoreLess = showMoreLess;
        vm.showMoreLessLink = showMoreLessLink;
        vm.filteredValues = _.pickBy;
        vm.getFilterName = getFilterName;
        vm.playVideo = playVideo;
        vm.hideEmptyValues = hideEmptyValues;
        vm.showModal = showModal;
        vm.toggled = toggled;

        $scope.exportUsersToCsv = function () {
            drillDownService.exportUsersToCsv($scope.filters, $scope.pagination, vm.usersFilterData, $scope.chartId);
        };

        vm.createToken = commonService.createToken;
        vm.openAlertsModal = openAlertsModal;

        vm.activeTab = 0;
        vm.showCustom = 0;
        vm.usersFilterData = null;

        vm.showSpinner = true;
        vm.showData = false;
        vm.maxFiltersCount = 15;
        vm.isLoading = false;

        $scope.pagination = {};
        $scope.videoUrl;
        $scope.hideEmpty = true;
        vm.dcid = $location.search().dcid;

        // grid configuration
        commonService.chartConfig($scope, vm);

        activate();

        function activate() {
            drillDownService.getCharts($stateParams.id, vm.dcid)
                .success(getChartsComplete)
                .catch(serviceError);
        }

        vm.shareChart = function(index, title) {
            var date = 'for ' + moment().subtract(1, 'month').format('MMMM YYYY');

            commonService.shareChart(index, title, 'Drilldown', date);
        };

        function getChartsComplete(res) {
            $scope.widgets = mockDataService.widgets();
            $scope.widgets[0].default_chart_display_type = "mscombi2d";
            $scope.widgets[0].title = res.title;
            $scope.chartViews = res.chart_data.available_chart_view;
            $scope.verticalAxis = res.chart_data.available_vertical_axis_types;
            var _filters = res.filters && JSON.parse(res.filters) || null;
            $scope.filters = drillDownService.createFilter(res.chart_data.available_filters, _filters);

            if (vm.generalFilters) {
                _.each(vm.generalFilters, function(filter, type) {
                    if ($scope.filters[type].values) {
                        $scope.filters[type].all = false;
                        $scope.filters[type].values = _.mapValues($scope.filters[type].values, function(val, key) {
                            if (typeof filter == String) {
                                return filter == key;
                            } else {
                                return filter.indexOf(key) !== -1;
                            }
                        });
                    }
                });
            }

            _.each($scope.filters, function(val) {
                showMoreLess(val);
            });

            vm.axis = res.vertical_axis_type || $scope.verticalAxis[1];

            if (vm.verticalAxis) {
                vm.axis = vm.verticalAxis;
            }

            vm.view = $scope.chartViews.indexOf(res.chart_view) > -1 ? res.chart_view : $scope.chartViews.indexOf(res.chart_data.default_chart_view) > -1 ? res.chart_data.default_chart_view : 'gender';

            if (vm.chartView && vm.chartView.length) {
                vm.view = vm.chartView;
            }

            $scope.hideEmpty = res.from_dashboard ? !!res.hide_empty : true;
            $scope.users = res.chart_data.users;
            $scope.totalUsers = res.chart_data.users_count;
            $scope.chartId = res.id;
            vm.usersFilterData = res.chart_data.users_filter_data;
            $scope.customFields = _.chain(res.chart_data.available_filters)
                .keys()
                .filter(function (field) {
                    return field.indexOf('custom') === 0;
                })
                .map(function (field) {
                    return field.slice(7);
                })
                .value();

            $scope.pagination.totalItems = res.chart_data.users_count;
            angular.extend($scope.widgets[0].chart_data, res.chart_data.chart_data);
            translateLegends();
            originalChartData = _.cloneDeep($scope.widgets[0].chart_data);
            vm.showSpinner = false;
            vm.showData = true;

            videoService.getVideo()
                .success(function (video) {
                    if (video)
                        $scope.videoUrl = video.trendata_video_video + rel;
                });

            updateChart();
        }

        function serviceError(error) {
            vm.isLoading = false;
            exception.catcher('XHR Failed for DrillDown')(error);
        }

        function toggleCheckbox(filter, value) {
            if (value != undefined) {
                _.each(filter.values, function (val, key) {
                    filter.values[key] = value;
                });
                if (value)
                    showMoreLess(filter);
                else {
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
            updateChart('change_page');
        });

        function updateChart(type) {
            vm.isLoading = true;

            var options = {
                id: $stateParams.id,
                type: type,
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
            var newArray = [];
            var maxVal = 0;
            var valIndex = 0;

            if (res.chart_data.users) {
                $scope.users = res.chart_data.users;
            }

            if (res.chart_data.users_count || res.chart_data.users_count === 0) {
                $scope.totalUsers = res.chart_data.users_count;
            }

            if (res.chart_data.chart_data) {
                if (vm.highest) {
                    maxVal = _.maxBy(res.chart_data.chart_data.dataset[0].data, function(item) { return item.value; });
                    valIndex = res.chart_data.chart_data.dataset[0].data.indexOf(maxVal);

                    res.chart_data.chart_data.dataset[0].data = [maxVal];
                    res.chart_data.chart_data.categories[0].category = [res.chart_data.chart_data.categories[0].category[valIndex]];
                }

                if (vm.chartFilters && vm.chartFilters.length) {
                    res.chart_data.chart_data = _.mapValues(res.chart_data.chart_data, function(item, key) {
                        if (key == 'dataset') {
                            _.each(item, function(val) {
                                if (vm.chartFilters.indexOf(val.seriesname) !== -1) {
                                    newArray.push(val);
                                }
                            });

                            item = newArray;
                        }

                        return item;
                    });

                    vm.chartFilters = null;
                }

                angular.extend($scope.widgets[0].chart_data, res.chart_data.chart_data);
                translateLegends();
            }

            originalChartData = _.cloneDeep($scope.widgets[0].chart_data);
            if ($scope.hideEmpty) {
                hideEmptyValues($scope.hideEmpty);
            }

            vm.isLoading = false;
        }

        function setActive(index) {
            vm.activeTab = vm.activeTab === index ? 0 : index;
        }

        $scope.resizeChart = function (tab) {
            vm.setActive(vm.activeTab === tab ? 0 : tab);
        };

        function showMoreLessLink(values) {
            return _.keys(_.filter(values)).length > vm.maxFiltersCount;
        }

        function getFilterName(filterName) {
            return filterName.indexOf('custom') !== 0 ?
                $scope.getTranslation(filterName) :
                filterName.replace(/^custom_/gi, '').replace(/_/g, ' ');
        }

        function playVideo() {
            videoService.playVideo($scope.videoUrl);
        }

        function hideEmptyValues(hideEmpty) {
            $scope.hideEmpty = hideEmpty;
            if (hideEmpty) {
                filteredChartData = _.cloneDeep(originalChartData);
                var indexToRemove = _.map(filteredChartData.categories[0].category, function (category, index) {
                    return _.some(filteredChartData.dataset, function (dataset) {
                        return +dataset.data[index].value;
                    });
                });

                filteredChartData.categories[0].category = _.filter(filteredChartData.categories[0].category, function (item, index) {
                    return indexToRemove[index];
                });
                _.each(filteredChartData.dataset, function (dataset) {
                    dataset.data = _.filter(dataset.data, function (item, index) {
                        return indexToRemove[index];
                    });
                });
                $scope.widgets[0].chart_data = _.cloneDeep(filteredChartData);
            } else {
                $scope.widgets[0].chart_data = _.cloneDeep(originalChartData);
            }
        }

        function showModal() {
            $uibModal.open({
                animation: false,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/detailed_view/drill_down/drill-down.modal.view.html',
                controller: 'DrillDownModalController',
                controllerAs: 'vm',
                scope: $scope,
                resolve: {
                    addToDashboardOptions: function() {
                        return {
                            chart_id: $scope.chartId,
                            dashboard_id: $rootScope.dashboardId,
                            chart_title: $scope.widgets[0].title,
                            chart_view: vm.view,
                            filters: $scope.filters,
                            vertical_axis: vm.axis,
                            time_span: vm.timeSpan,
                            hide_empty: $scope.hideEmpty
                        };
                    }
                }
            })
        }

        function openAlertsModal() {
            alertsService.openModal($scope, $stateParams.id, $scope.widgets[0], 2, $scope.filters, vm.view);
        }

        function translateLegends() {
            _.each($scope.widgets[0].chart_data.dataset, function(item) {
                item.seriesname = item.seriesname ? $scope.getTranslation(item.seriesname.toLowerCase()) : $scope.getTranslation('blank');
            });
        }

        function toggled() {
            $scope.$broadcast('scroll-menu');
        }
    }
})();
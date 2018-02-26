(function () {

    'use strict';

    angular
        .module('app.dashboard')
        .controller('ModalAlertsController', ModalAlertsController);

    ModalAlertsController.$inject = ['$scope', 'alertsService', 'chartId', 'filters', 'dataset', 'title', 'chartType', 'chartView', 'chartViewItems', 'commonService'];

    function ModalAlertsController($scope, alertsService, chartId, filters, dataset, title, chartType, chartView, chartViewItems, commonService) {

        var vm = this;

        vm.createAlert = createAlert;
        vm.toggleDatePicker = toggleDatePicker;
        vm.showMoreLess = showMoreLess;
        vm.showMoreLessLink = showMoreLessLink;
        vm.filteredValues = _.pickBy;
        vm.fieldValid = fieldValid;

        vm.dataset = dataset;
        vm.filters = filters;
        vm.chartViewItems = chartViewItems;
        vm.customDate = null;
        vm.maxFiltersCount = 10;

        vm.periods = {
            week: $scope.getTranslation('start_of_week'),
            month: $scope.getTranslation('start_of_month'),
            quarter: $scope.getTranslation('start_of_quarter'),
            custom: $scope.getTranslation('custom')
        };
        vm.conditions = {
            '>': $scope.getTranslation('exceed'),
            '=': $scope.getTranslation('equals'),
            '<': $scope.getTranslation('below')
        };
        vm.points = [
            $scope.getTranslation('percentage_%'),
            $scope.getTranslation('value')
        ];
        if (chartType != 2)
            vm.points.push($scope.getTranslation('percentage_difference_from_previous_month'));

        vm.selected = {
            name: null,
            type: 0,
            criteria: dataset[0],
            chartId: chartId,
            chartType: chartType,
            condition: '>',
            points: '1',
            date: 'week',
            filters: null,
            chartView: chartView || null,
            chartViewItem: chartViewItems[0] || null
        };

        function createAlert() {
            vm.selected.filters = _.reduce(filters, function(accum, item, key) {
                if (item.all)
                    return accum;

                accum[key] = _.map(item.values, function(value, key) {
                    if (value)
                        return key;
                });
                accum[key] = _.compact(accum[key]);

                return accum;
            }, {});
            if (_.isEmpty(vm.selected.filters))
                vm.selected.filters = null;

            vm.selected.trigger = '<b>' + title + ':</b> ' + vm.selected.criteria;
            if (vm.selected.chartViewItem)
                vm.selected.trigger += ' in ' + vm.selected.chartViewItem;
            vm.selected.trigger += ' (';
            if (vm.selected.type == 0) {
                vm.selected.trigger += 'when ' + vm.conditions[vm.selected.condition] + ' ' + vm.selected.value;
                vm.selected.trigger += vm.selected.points == 1 ? '' : '%';
                vm.selected.trigger += vm.selected.points == 2 ? ' difference from previous month' : '';

                vm.selected.date = null;
            } else {
                var customDate = vm.selected.date === 'custom' ? moment(vm.customDate) : null;

                vm.selected.trigger += customDate ? customDate.format('D MMM, YYYY') : vm.periods[vm.selected.date];
                if (customDate)
                    vm.selected.date = customDate.startOf('day').utc().format('X');

                vm.selected.condition = null;
                vm.selected.value = null;
                vm.selected.points = null;
            }
            vm.selected.trigger += ')';

            alertsService.createAlert(vm.selected)
                .then(createAlertSuccess)
                .catch(createAlertFail);
        }

        function createAlertSuccess() {
            commonService.notification($scope.getTranslation('alert_add_success'), 'success');
            $scope.$close();
        }

        function createAlertFail(error) {
            commonService.notification('Unable to process.', 'error');
            exception.catcher('Unable to process')(error);
        }

        function toggleDatePicker() {
            vm.opened = !vm.opened;
        }

        function showMoreLess(filter, expand) {
            filter.expanded = expand;
        }

        function showMoreLessLink(values) {
            return _.keys(_.filter(values)).length > vm.maxFiltersCount;
        }

        function fieldValid(field) {
            return field.$invalid && field.$touched;
        }
    }

})();
(function () {

    'use strict';

    angular
        .module('app.dashboard')
        .controller('ModalMetricHistoryController', ModalMetricHistoryController);

    ModalMetricHistoryController.$inject = ['$scope', 'periods'];

    function ModalMetricHistoryController($scope, periods) {
        var vm = this;
        vm.period = periods[0];
        vm.periods = periods;
        vm.showCustomDatepicker = false;
        vm.open = {
            start: false,
            end: false
        };

        vm.datePickerOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: null,
            minMode: 'month'
        };

        vm.selectPeriod = function() {
            if (vm.period.start === null) {
                vm.showCustomDatepicker = true;
            } else {
                $scope.$emit('periodChanged', vm.period);
                $scope.$close();
            }
        }

        vm.toggleDatePicker = function(key) {
            vm.open[key] = !vm.open[key];
        }

        vm.checkDates = function(period) {
            if (! period.start || ! period.end) {
                vm.errorMessage = $scope.getTranslation('all_fields_are_required');
                return false;
            }

            if (period.start > period.end) {
                vm.errorMessage = $scope.getTranslation('start_date_should_be_before_end_date');
                return false;
            }

            period.start = moment().diff(moment(period.start), 'month');
            period.end = moment().diff(moment(period.end), 'month');

            vm.selectPeriod();
        }
    }

})();
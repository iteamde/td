(function () {

    'use strict';

    angular
        .module('app.event')
        .controller('EventModalController', EventModalController);

    EventModalController.$inject = ['$scope','category_id','eventService','index','eventTypes', 'commonService', 'eventModalService'];
    function EventModalController($scope , category_id, eventService,index, eventTypes, commonService, eventModalService) {

        var vm = this;

        vm.fieldValid = fieldValid;
        vm.addNewEvent = addNewEvent;
        vm.toggleDatePicker = toggleDatePicker;

        vm.addEventFields = {
            title:'',
            description: '',
            start_date: '',
            end_date: '',
            category_id: category_id,
            is_public: 1
        };

        vm.datePickerOptions = {
            formatYear: 'yyyy',
            maxDate: new Date(2020, 5, 22),
            minDate: null/*new Date()*/,
            startingDay: 1
        };

        function toggleDatePicker(index) {
            vm['opened' + index] = !vm['opened' + index];
        }

        function addNewEvent(form, inputData) {
            var start_date = moment(inputData.start_date).format('YYYY-MM-DD');
            var end_date = moment(inputData.end_date).format('YYYY-MM-DD');
            if (start_date > end_date) {
                commonService.notification('Invalid Date.', 'error');
                return false;
            }


            if (form.$valid) {
                inputData.start_date = start_date;
                inputData.end_date = end_date;

                eventService
                    .createEvent(inputData)
                    .success(addEventSuccess)
                    .error(addEventFailure)
                    .catch(addEventError);
            }
        }

        function fieldValid(form, fieldName) {
            return form[fieldName].$invalid && form[fieldName].$touched || form.$submitted && form[fieldName].$invalid;
        }

        function addEventFailure() {
            commonService.notification('Unable to process.', 'error');
        }

        function addEventSuccess(data) {
            commonService.notification($scope.getTranslation('event_add_success'), 'success');
            eventTypes[index].events.push(data);
            $scope.$close();
        }

        function addEventError(error) {
            commonService.notification('Unable to process.', 'error');
            exception.catcher('Unable to process')(error);
        }

    }


})();
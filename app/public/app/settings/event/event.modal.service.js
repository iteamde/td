(function () {

    'use strict';

    angular
        .module('app.event')
        .factory('eventModalService', eventModalService);

    eventModalService.$inject = ['commonService', 'eventService', 'exception', 'noty'];

    function eventModalService(commonService, eventService, exception, noty) {

        return {
            addNewEvent: addNewEvent,
            fieldValid: fieldValid
        };

        function addNewEvent(form, inputData) {

            var start_date = moment(inputData.start_date).format('YYYY-MM-DD HH:mm:ss');
            var end_date = moment(inputData.end_date).format('YYYY-MM-DD HH:mm:ss');
            if(start_date>end_date)
            {
                noty.show({
                    text: 'Invalid Date',
                    type: 'error'
                });
                return false;
2            }
            if (form.$valid) {

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
            //eventTypes[index].events.push(data);
            //1$uibModalInstance.close();
            commonService.notification('Event added successfully.', 'success');
            $uibModalInstance.$close();
        }

        function addEventError(error) {
            commonService.notification('Unable to process.', 'error');
            exception.catcher('Unable to process')(error);
        }
    }


})();
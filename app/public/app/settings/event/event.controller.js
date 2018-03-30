(function () {

    'use strict';

    angular
        .module('app.event')
        .controller('EventController', EventController);

    EventController.$inject = ['$scope', 'exception', '$uibModal', 'noty', 'eventService', 'authService'];

    function EventController($scope, exception, $uibModal, noty, eventService, authService) {


        var vm = this;

        activate();

        vm.addNewEvent = addNewEvent;
        vm.deleteEvent = deleteEvent;
        vm.checkPermissions = checkPermissions;
        vm.eventTypes = [];
        //vm.addNewCategory = addNewCategory;

        function activate() {
            eventService.getEvents()
                .success(getEventsComplete)
                .catch(serviceError);
        }
        function getEventsComplete(data) {
            vm.eventTypes = data;
        }

        function serviceError(error) {
            exception.catcher($scope.getTranslation('xhr_failed_for_login'))(error);
        }

        function addNewEvent(category_id,index) {

            var modalInstance = $uibModal.open({
                animation: false,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/settings/event/event.modal.view.html',
                controller: 'EventModalController',
                controllerAs: 'vm',
                scope: $scope,
                resolve: {
                    category_id: function () {
                        return category_id;
                    },
                    index:function(){
                        return index;
                    },
                    eventTypes:function(){
                        return vm.eventTypes;
                    }

                }
            });
        }

        function deleteEvent(eventId, eventTypeIndex, eventIndex) {
            noty.closeAll();
            noty.show({
              text: $scope.getTranslation('delete_event_confirm'),
              buttons: [
                {
                    addClass: 'btn btn-warning',
                    text: 'Cancel',
                    onClick: function($noty) {
                        $noty.close();
                      }
                },
                {
                    addClass: 'btn btn-success',
                    text: 'Ok',
                    onClick: function($noty) {
                        vm.currentEvent = {
                            typeIndex: eventTypeIndex,
                            eventIndex: eventIndex
                        };

                        eventService.deleteEvent(eventId)
                            .success(successEventDeletion)
                            .catch(serviceError);

                        $noty.close();
                    }
                }
              ]
            });
        }

        function successEventDeletion(response) {
            if (response.status === 'success') {
                var res = vm.eventTypes[vm.currentEvent.typeIndex].events.splice(vm.currentEvent.eventIndex, 1);
                vm.currentEvent = null;
            }
        }

        function checkPermissions(event) {
            var user = authService.currentUser();

            return event.created_by === user.id;
        }
    }

})();
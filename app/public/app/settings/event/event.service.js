(function () {

    'use strict';

    angular
        .module('app.event')
        .factory('eventService', eventService);

    eventService.$inject = ['BASE_URL', '$http'];

    function eventService(BASE_URL, $http) {

        return {
            getEvents: getEvents,
            createEvent:createEvent,
            deleteEvent: deleteEvent
        };

        function getEvents() {
            var apiUrl = BASE_URL + "events/eventlist";
            return $http.get(apiUrl);
        }

        function createEvent(event) {
            var apiUrl = BASE_URL + "events/createevent";
            return $http.post(apiUrl, event);
        }

        function deleteEvent(eventId) {
            var apiUrl = BASE_URL + "events/remove-event/" + eventId;
            return $http.delete(apiUrl);
        }
    }
})();
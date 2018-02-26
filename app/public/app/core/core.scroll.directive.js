/*
(function () {

    'use strict';


    angular
        .module('app.core')
        .directive('scroll', scroll);


    scroll.$inject = ['$window'];

    function scroll($window) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;


        function link(scope, element, attrs) {
            var wait = 0;

            attrs.$observe('scroll', function (newWait) {
                wait = $window.parseInt(newWait || 0);
            });

            function onScroll(e) {
                // Namespacing events with name of directive + event to avoid collisions
                scope.$broadcast('scroll::scroll');
            }

            function cleanUp() {
                angular.element($window).off('scroll', onScroll);
            }


            angular.element($window).on('scroll', $window._.debounce(function () {
                onScroll();
            }, wait));

            scope.$on('$destroy', cleanUp);
        }
    }
})();
*/

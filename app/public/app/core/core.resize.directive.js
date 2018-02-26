(function () {

    'use strict';

    angular
        .module('app.core')
        .directive('resize', resize);

    resize.$inject = ['$window'];

    function resize($window) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            var wait = 0;

            attrs.$observe('resize', function (newWait) {
                wait = $window.parseInt(newWait || 0);
            });

            function onResize(e) {
                // Namespacing events with name of directive + event to avoid collisions
                scope.$broadcast('resize::resize');
            }

            function cleanUp() {
                angular.element($window).off('resize', onResize);
            }


            angular.element($window).on('resize', $window._.debounce(function () {
                onResize();
            }, wait));

            scope.$on('$destroy', cleanUp);
        }
    }
})();

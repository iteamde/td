(function () {

    'use strict';

    angular
        .module('app.metric')
        .directive('addGridDimensions', addGridDimensions);

    addGridDimensions.$inject = ['$timeout'];
    function addGridDimensions($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {


                var width;

                // custom event to track resize event
                $scope.$on('resize::resize', function () {
                    $timeout(function () {
                        $scope.$apply();

                        width = $element.closest('.chart').width();
                        $element.css('width', width);

                        console.log(width);
                        //console.log($element.closest('.chart'));
                    });

                });

            }
        };
    }

})();
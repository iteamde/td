(function () {
    'use strict'

    angular.module('app.core')
        .directive('modelViewFormat', modelViewFormat);

    function modelViewFormat() {
        return {
            restrict: 'A',
            scope: {},
            require: 'ngModel',
            link: function ($scope, $el, $attrs, ngModel) {

                if ($attrs.modelViewFormat == "true") {

                    ngModel.$formatters.push(function (value) {
                        return Math.round(value * 100) / 100;
                    })
                } else {

                    ngModel.$formatters.push(function (value) {
                        return Math.round(value);
                    });

                }

            }
        }
    }
})();
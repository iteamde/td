(function () {
    "use strict";

    angular.module("app.financialData")
        .directive('yearDrop', function () {

            return {

                link: function (scope, element, attrs, $scope) {

                    console.log("directive", scope.warnMess);

                    scope.years = getYears(+attrs.offset, +attrs.range);
                    scope.selectedYear = scope.years[scope.years.length - 1];

                },
                template: '<select ng-disabled="disableBtn" class="form-control select-control-blue"  ng-model="selectedYear" ng-options="y for y in years"></select>'
            };


            function getYears(offset, range) {
                var currentYear = ((new Date().getFullYear()) - range);
                var years = [];
                for (var i = 0; i < range + 1; i++) {
                    years.push(currentYear + offset + i);
                }
                return years;
            }
        });
})();

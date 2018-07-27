(function() {

    angular.module('app.core')
        .directive('infiniteScroll', infiniteScroll);

    infiniteScroll.$inject = [];

    function infiniteScroll() {

        return {
            restrict: "A",
            link: linkFn
        };

        function linkFn($scope, $el) {
            var el = $el[0];
            $scope.addItems =  10;
            el.onscroll = function() {
                if (isBottom()) {
                    $scope.addItems += 5;
                    $scope.$apply();
                }
            };
            function isBottom() {
                return el.scrollTop >= (el.scrollHeight - el.offsetHeight);
            }
        }

    }
})();
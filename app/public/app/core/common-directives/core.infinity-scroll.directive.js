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
                // console.log("scroled");
                // console.log(isBottom(),el.scrollTop,el.scrollHeight,el.offsetHeight );
                if (isBottom()) {
                    $scope.addItems += 5;
                    $scope.$apply();
                    //console.log("Bottom");
                }
            };
            function isBottom() {
                return el.scrollTop >= (el.scrollHeight - el.offsetHeight);
            }
        }

    }
})();
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
            $scope.addItems = 20;
            $scope.itemsCount = Object.keys($scope.filter.values).length;
            $scope.cellHeight = 24;

            $scope.$on('scroll-menu', function() {
                if($(el).parent().hasClass( "open-add" )) {
                    $scope.itemsCount < 500 ?
                        $scope.addItems = $scope.itemsCount :
                        $scope.addItems = Math.ceil($scope.itemsCount / 50);
                }
            });

            el.onscroll = function(e) {

                if (isBottom()) {
                    $scope.addItems += 10;
                    $scope.$apply();
                }
            };
            function isBottom() {
                return el.scrollTop >= (el.scrollHeight - el.offsetHeight);
            }
        }

    }
})();
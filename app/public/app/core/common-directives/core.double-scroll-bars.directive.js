(function () {
    'use strict';

    angular.module('app.core')
        .directive('doubleScrollBars', doubleScrollBars);

    function doubleScrollBars() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                var anchor = element.find('[data-anchor]');

                element.wrapInner("<div class='wrapper2'></div>");

                // contains the element with a real scrollbar
                element.prepend("<div class='wrapper1'><div class='div1'></div></div>");

                var $wrapper1 = element.find('.wrapper1'),
                    $div1 = element.find('.div1'),
                    $wrapper2 = element.find('.wrapper2');

                // force our virtual scrollbar to work the way we want.
                $wrapper1.css({
                    width: "100%",
                    border: "none 0px rgba(0, 0, 0, 0)",
                    overflowX: "auto",
                    overflowY: "hidden",
                    height: "20px"
                });

                $div1.css({
                    height: "20px"
                });

                $wrapper2.css({
                    width: "100%",
                    overflowX: "auto",
                    overflowY: "hidden"
                });

                function updateScroll() {
                    // use .width() or .outerWidth()
                    $div1.outerWidth(anchor.outerWidth());

                    // sync the real scrollbar with the virtual one.
                    $wrapper1.scroll(function () {
                        $wrapper2.scrollLeft($wrapper1.scrollLeft());
                    });

                    // sync the virtual scrollbar with the real one.
                    $wrapper2.scroll(function () {
                        $wrapper1.scrollLeft($wrapper2.scrollLeft());
                    });
                }

                function getAnchorWidth() {
                    return anchor.outerWidth();
                }

                scope.$watch(getAnchorWidth, function () {
                    updateScroll();
                });

            }
        };
    }
})();
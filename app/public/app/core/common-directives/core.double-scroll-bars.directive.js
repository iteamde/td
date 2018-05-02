(function () {
    'use strict';

    angular.module('app.core')
        .directive('doubleScrollBars', doubleScrollBars);

    doubleScrollBars.$inject = ['$interval'];

    function doubleScrollBars($interval) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                // ng-repeat delays the actual width of the element.
                // this listens for the change and updates the scroll bar
                function widthListener() {
                    if (anchor.outerWidth() != lastWidth)
                        updateScroll();
                }

                function updateScroll() {
                    // for whatever reason this gradually takes away 1 pixel when it sets the width.
                    // del +1 to anchor.width() --> bug with increase of width in Chrome
                    // change method .width() to .outerWidth() --> bug with decrease of width in EE

                    // add $div2.outerWidth(element.outerWidth()) to return the width when become smaller
                    $div2.outerWidth(element.outerWidth()); //TODO: refactor  return from many to several columns in table

                    $div2.outerWidth(anchor.outerWidth());

                    // make the scroll bars the same width
                    $div1.outerWidth($div2.outerWidth());

                    // sync the real scrollbar with the virtual one.
                    $wrapper1.scroll(function () {
                        $wrapper2.scrollLeft($wrapper1.scrollLeft());
                    });

                    // sync the virtual scrollbar with the real one.
                    $wrapper2.scroll(function () {
                        $wrapper1.scrollLeft($wrapper2.scrollLeft());
                    });
                }

                var anchor = element.find('[data-anchor]'),
                    lastWidth = anchor.outerWidth(),
                    listener;

                // so that when you go to a new link it stops listening
                element.on('remove', function () {
                    $interval.cancel(listener);
                });

                // creates the top virtual scrollbar
                element.wrapInner("<div class='div2' />");
                element.wrapInner("<div class='wrapper2' />");

                // contains the element with a real scrollbar
                element.prepend("<div class='wrapper1'><div class='div1'></div></div>");

                var $wrapper1 = element.find('.wrapper1'),
                    $div1 = element.find('.div1'),
                    $wrapper2 = element.find('.wrapper2'),
                    $div2 = element.find('.div2');

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

                listener = $interval(function () {
                    widthListener();
                }, 650);

                updateScroll();
            }
        };
    }
})();
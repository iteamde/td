(function () {

    'use strict';


    /* recommended */
    angular
        .module('app.core')
        .directive('jqToggleSidebar', jqToggleSidebar);

    function jqToggleSidebar() {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;


        function link(scope, element, attrs) {
            /* */

            var toggleTriggerEl;

            toggleTriggerEl = element.find(".open-left");

            toggleTriggerEl.click(function (e) {
                e.stopPropagation();
                $("#wrapper").toggleClass("enlarged");
                $("#wrapper").addClass("forced");

                if ($("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left")) {
                    $("body").removeClass("fixed-left").addClass("fixed-left-void");
                } else if (!$("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left-void")) {
                    $("body").removeClass("fixed-left-void").addClass("fixed-left");
                }
                if ($("#wrapper").hasClass("enlarged")) {
                    $(".left ul").removeAttr("style");
                } else {
                    $(".subdrop").siblings("ul:first").show();
                }
                //toggle_slimscroll(".slimscrollleft");
                $("body").trigger("resize");
            });


            // LEFT SIDE MAIN NAVIGATION
            $("#sidebar-menu a").on('click', function (e) {
                if (!$("#wrapper").hasClass("enlarged")) {

                    if ($(this).parent().hasClass("has_sub")) {
                        e.preventDefault();
                    } else {
                        return;
                    }

                    if (!$(this).hasClass("subdrop")) {
                        // hide any open menus and remove all other classes
                        $("ul", $(this).parents("ul:first")).slideUp(350);
                        $("a", $(this).parents("ul:first")).removeClass("subdrop");
                        $("#sidebar-menu .pull-right i").removeClass("fa-angle-up").addClass("fa-angle-down");

                        // open our new menu and add the open class
                        $(this).next("ul").slideDown(350);
                        $(this).addClass("subdrop");
                        $(".pull-right i", $(this).parents(".has_sub:last")).removeClass("fa-angle-down").addClass("fa-angle-up");
                        $(".pull-right i", $(this).siblings("ul")).removeClass("fa-angle-up").addClass("fa-angle-down");
                    } else if ($(this).hasClass("subdrop")) {
                        $(this).removeClass("subdrop");
                        $(this).next("ul").slideUp(350);
                        $(".pull-right i", $(this).parent()).removeClass("fa-angle-up").addClass("fa-angle-down");
                        //$(".pull-right i",$(this).parents("ul:eq(1)")).removeClass("fa-chevron-down").addClass("fa-chevron-left");
                    }
                }
            });

            // NAVIGATION HIGHLIGHT & OPEN PARENT
            $("#sidebar-menu ul li.has_sub a.active").parents("li:last").children("a:first").addClass("active").trigger("click");
        }
    }
})();

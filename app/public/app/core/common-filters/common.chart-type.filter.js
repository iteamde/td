(function () {

    'use strict';

    angular
        .module("app.core")
        .filter("filterChartTypes", filterChartTypes);
    
    function filterChartTypes() {

        return function (items, widgetChartType) {

            var arrayToReturn, typeArray;

            typeArray = items.map(function(a) {return a.type;});
            arrayToReturn = [];


            if (typeArray.indexOf(widgetChartType) === -1) {
                return arrayToReturn;
            }
            for (var i = 0; i < items.length; i++) {
                if (items[i] != widgetChartType) {
                    arrayToReturn.push(items[i]);
                }
            }
            return arrayToReturn;
        };
    }
})();

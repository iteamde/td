(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('commonChartService', commonChartService);

    commonChartService.$inject = ['$window', 'COLORS', 'TRENDLINE_START_SETTINGS',  'DEFAULT_ANNOTATION', 'GRID_FILTER_MODEL', 'ANNOTATIONS_HEX_RANGE', 'COLUMN2D_WITH_$', 'COLUMN2D_PERCENT', 'MSCOLUMN2D_WITH_PERCENT', 'MSCOLUMN2D_WITH_CURRENCY'];

    function commonChartService($window, COLORS, TRENDLINE_START_SETTINGS,  DEFAULT_ANNOTATION, GRID_FILTER_MODEL, ANNOTATIONS_HEX_RANGE, COLUMN2D_WITH_$, COLUMN2D_PERCENT, MSCOLUMN2D_WITH_PERCENT, MSCOLUMN2D_WITH_CURRENCY) {

        return {
            changeRange: changeRange,
            makeChartData: makeChartData,
            createFilter: createFilter,
            createAnnotations: createAnnotations,
            getPredictiveSettings: getPredictiveSettings
        };

        function makeChartData (settings) {

            var obj = {};
            obj.categories = [];
            obj.dataset = [];
            obj.chart = changeChartTheme(settings.type);

            var objDeep1 = {};
            objDeep1.category = [];

            for (var i = settings.from; i < settings.to; i++) {

                var objDeep2 = {};

                //TODO: SOLVE BUG WITH MONTHS
                objDeep2.label = settings.range === 'month' ? moment().add(i - 1, 'month').format('MMMM') : moment().year() + i;
                objDeep1.category.push(objDeep2);
            }

            obj.categories.push(objDeep1);

            //trendline chart settings
            if (settings.trendline) {
                settings.seriesname.push(TRENDLINE_START_SETTINGS)
            }

            _.each(settings.seriesname, function (val, index) {

                obj.dataset[index] = {};
                obj.dataset[index].data = [];

                //trend line
                if (val.id == TRENDLINE_START_SETTINGS.id) {

                    angular.extend(obj.dataset[index], val);

                    makeTrendLine(obj.dataset[index].data, settings);

                } else {

                    obj.dataset[index].seriesname = val.name;

                    for (var i = settings.from, k = 0; i < settings.to; i++, k++) {

                        var objDeep2 = {};

                        objDeep2.color = i > 0 ? COLORS.PREDICTIVE_COLORS[index] : '';
                        objDeep2.value = val.values ? val.values[k] : Math.floor(Math.random() * 10);

                        obj.dataset[index].data.push(objDeep2);

                    }
                }
            });

            return obj;
        }

        function makeTrendLine(objArr, settings) {

            //Logarithmic regression for trend line
            /*var defaultRegression = [[1, 6.5], [2, 9], [3, 10], [4, 12], [5, 13], [6, 14], [7, 15], [8, 17], [9, 19], [10, 19.5], [11, 19.6], [12, 19.8]],
                regressionCases = formatCurve(settings.curve) || defaultRegression,
                regressionResult = regression('logarithmic', regressionCases);*/
            settings.curve = formatCurve(settings.curve, settings.type);
            for (var i = settings.from, j = 0; i < settings.to; i++, j++) {

                var objDeep = {};

                objDeep.value = settings.curve[j];
                objDeep.dashed = i < 0 ? "0" : "1";
                objDeep.color = i < 0 ? COLORS.CHART_TRENDLINE : COLORS.CHART_PREDICTIVE_DATE;
                objArr.push(objDeep);
            }

        }

        function formatCurve(arr, type) {
            return _.map(arr, function(value) {
                return type == 'soloPercent' || type == 'multiPercent' ? Math.round(value * 100) / 100 + '%' : Math.round(value * 100) / 100;
            })
        }

        function createFilter(users, desire) {

            var model = angular.copy(GRID_FILTER_MODEL);

            _.each(users, function(user) {
                _.each(_.keys(model), function (key) {
                    if (user[key] && !(user[key] in model[key].values)) {
                        model[key].values[user[key]] = true;
                    }
                })
            });

            return model;
        }

        function changeRange(chart, values, settings, curve, seriesname) {

            if (settings.pairKeys) {

                if (seriesname) {
                    settings.seriesname = seriesname;
                } else {
                    extendSettings(settings, values);
                }

            }

            if (curve) {
                settings.curve = curve;
            }

            settings.trendline = chart.trendline;

            angular.extend(chart.chart_data, makeChartData(settings));
        }

        function extendSettings(settings, values) {

            _.each(settings.pairKeys, function (pair) {

                var chartData = _.find(values, {name: pair[0]}),
                    chartSetting = _.find(settings.seriesname, {name: pair[1]});

                chartSetting.values =  _.map(chartData.data, function (value) {
                    return Math.round(value * 100) / 100;
                });

            });
        }

        function getPredictiveSettings(chartView, range) {

            var obj = {
                'Total': {
                    '1 year' : {pairKeys: [["Total Turnover", "Total Turnover"]], type: "soloPercent", range: 'month', from: -5 , to: 7, seriesname: [{name: "Total Turnover"}]},
                    '3 years': {range: 'year' , type: "soloPercent", from: -1 , to: 2, seriesname: [{name: "Total Turnover"}]},
                    '5 years': {range: 'year' , type: "soloPercent", from: -2 , to: 3, seriesname: [{name: "Total Turnover"}]}
                },
                'By Desire': {
                    '1 year' : {range: 'month', type: "multi", from: -5 , to: 7, seriesname: [{name: "Voluntary"}, {name: "Involuntary"}]},
                    '3 years': {range: 'year' , type: "multi", from: -1 , to: 2, seriesname: [{name: "Voluntary"}, {name: "Involuntary"}]},
                    '5 years': {range: 'year' , type: "multi", from: -2 , to: 3, seriesname: [{name: "Voluntary"}, {name: "Involuntary"}]}
                },
                'By Gender': {
                    '1 year' : {range: 'month', type: "multi", from: -5 , to: 7, seriesname: [{name: "Male"}, {name: "Female"}]},
                    '3 years': {range: 'year' , type: "multi", from: -1 , to: 2, seriesname: [{name: "Male"}, {name: "Female"}]},
                    '5 years': {range: 'year' , type: "multi", from: -2 , to: 3, seriesname: [{name: "Male"}, {name: "Female"}]}
                },
                'Performance': {
                    '1 year' : {pairKeys: [[ "HP Turnover", "High Performers"], [ "Non-HP Turnover", "Non-High Performers"]], range: 'month', type: "multiPercent", from: -5 , to: 7, seriesname: [{name: "High Performers"}, {name: "Non-High Performers"}]},
                    '3 years': {range: 'year' , type: "multiPercent", from: -1 , to: 2, seriesname: [{name: "High Performers"}, {name: "Non-High Performers"}]},
                    '5 years': {range: 'year' , type: "multiPercent", from: -2 , to: 3, seriesname: [{name: "High Performers"}, {name: "Non-High Performers"}]}
                },
                "Turnover Prod Loss % of Rev": {
                    '1 year' : {pairKeys: [["Turnover Prod Loss % of Rev", "Turnover Prod Loss % of Rev"]], range: 'month', type: "soloPercent", from: -5 , to: 7, seriesname: [{name: "Turnover Prod Loss % of Rev"}]},
                    '3 years': {range: 'year' , type: "soloPercent", from: -1 , to: 2, seriesname: [{name: "Turnover Prod Loss % of Rev"}]},
                    '5 years': {range: 'year' , type: "soloPercent", from: -2 , to: 3, seriesname: [{name: "Turnover Prod Loss % of Rev"}]}
                }
            };

            return obj[chartView][range];
        }

        function createAnnotations(arr, correction, range, type) {

            var annotations = DEFAULT_ANNOTATION;
            var correction = range == 1 ? moment().month() : 0;

            var newObj = {},
                grid = {
                    7: [],
                    22: [],
                    37: [],
                    52: [],
                    67: []
                },
                maxRange = range == 1 ? 11 : range - 1,
                rangeBar = range == 1 ? 'month' : 'year';

            newObj.items = [];

            _.each(isActualEvents(arr, type, range), function (event) {

                var startOn = moment(event.start_on),
                    endOn = moment(event.end_on);

                var eventDuration = moment(event.end_on.slice(0, -3)).diff(moment(event.start_on.slice(0, -3)), rangeBar), // slice(0, -3) for format purposes - we need just YYYY-MM
                    start, end;

                if (range == 1) {
                    console.log(startOn, endOn, correction);
                    start = moment(event.start_on).subtract(correction, rangeBar)[rangeBar]();
                    end = moment(event.end_on).subtract(correction, rangeBar)[rangeBar]();
                } else {
                    start = maxRange - (moment()[rangeBar]() - startOn[rangeBar]());
                    end = maxRange - (moment()[rangeBar]() - endOn[rangeBar]());

                    if (start < 0) {
                        start = 0;
                    }
                    if (end > maxRange) {
                        end = maxRange
                    }
                }

/*


                if (moment().add(correction - moment()[rangeBar]() - maxRange, rangeBar).isAfter(moment(event.start_on))) {
                    start = 0;
                }

                if (moment().add(correction - moment()[rangeBar](), rangeBar).isBefore(moment(event.end_on)))
                    end = maxRange;
*/

                if (start > end) {
                    if (moment(event.end_on).isAfter(moment().subtract(1, rangeBar))) {
                        end = maxRange;
                        eventDuration = end - start;
                    } else {
                        start = 0;
                        eventDuration = end;
                    }
                }

                //if event start and event end is more then chart display period
                if (moment(event.start_on).subtract(correction, rangeBar).isBefore(moment().subtract(13, rangeBar)) && moment(event.end_on).isAfter(moment().subtract(1, rangeBar))) {
                    start = 0;
                    end = eventDuration = maxRange;
                }

                var row = rowForEvent(grid, start, end);

                newObj.items = newObj.items.concat(annotationsArr(Number(row), startOn, endOn, maxRange, start, end, event));

            });

            annotations.groups = [newObj];

            return annotations;

        }

        function annotationsArr(row, startOn, endOn, maxRange, start, end, event) {

            var startText = Math.ceil((start + end) / 2);

            var arr = [
                {
                    "type": "line",
                    "x":"$dataset.0.set." + start + ".STARTX",
                    "y": "$chartStartY + " + row,
                    "tox": "$xaxis.label." + end + ".ENDX",
                    "thickness": "14",
                    "fillcolor": getLightColor(),
                    "tooltext": event.title + "<br><br>" + (event.description || "No description for event")
                },
                {
                    "type": "text",
                    "color": "#333333",
                    "label": event.title,
                    "fontSize": "10",
                    "bold": "1",
                    "x": "$xaxis.label." + startText + ".CENTERX",
                    "y": "$chartStartY + " + (row - 1),
                    "tooltext": event.title + "<br><br>" + (event.description || "No description for event")
                }
            ];

            if ((end - start) % 2 !== 0){
                arr[1].x = "$dataset.0.set." + startText + ".STARTX";
                arr[1].leftMargin = -1 * setMargin(event.title, end - start + 1);
            }

            return arr;
        }

        // row number - distance from chart top to event in px
        function rowForEvent (grid, start, end) {

            var range = _.range(start, end + 1);
            return _.find(_.keys(grid), function(key) {
                var union = _.union(range, grid[key]);
                if (union.length == (range.length + grid[key].length)) {
                    grid[key] = union;
                    return true;
                }
            });
        }

        function getLightColor() {

            var hexRange = ANNOTATIONS_HEX_RANGE,
                color = '#';

            for (var i=0; i<6; i++) {
                color += hexRange[$window.Math.floor($window.Math.random() * hexRange.length)];
            }

            return color;
        }

        function setMargin(text, barsQty) {
//            var standartScreen = 1600,
//                barWidth = 50,// / (standartScreen / $window.innerWidth),
//                barsSpacing = $window.innerWidth * (1 / ($window.innerWidth / barWidth)) * 0.35,
//                defaultMargin = barWidth / 4,
//                correction = text.length * 3 / 2;
            var barWidth = 50,
                barsSpacing = ($window.innerWidth - (215 + 80) - (barWidth * 12)) / 11;//215 = side bar padding, 80 = chart padding from all side

            return barsQty > 1 ? (barsSpacing / 2) : 0;
//            return barsQty > 1 ? barsQty * (barWidth + barsSpacing) / 2 - correction : defaultMargin - correction;
        }

        function isActualEvents(arr, type, range) {
            var startDate,
                endDate,
                actualEventsArr = [];

            if (type === 'predictive') {
                startDate = moment().subtract(6, 'month').startOf('month');
                endDate = moment().add(5, 'month').endOf('month');
            } else if (range == 1){
                startDate = moment().subtract(13, 'month').startOf('month');
                endDate = moment().subtract(1, 'month').endOf('month');
            } else {
                startDate = moment().subtract(range - 1, 'year').startOf('year');
                endDate = moment().endOf('year');
            }

            _.each(arr, function (obj) {
                var newArr = _.filter(obj.events,function (event) {
                    return (moment(event.start_on, 'YYYY-MM-DD').isAfter(startDate) && moment(event.start_on, 'YYYY-MM-DD').isBefore(endDate)) ||
                           (moment(event.end_on, 'YYYY-MM-DD').isAfter(startDate) && moment(event.end_on, 'YYYY-MM-DD').isBefore(endDate)) ||
                           (moment(startDate, 'YYYY-MM-DD').isAfter(event.start_on) && moment(endDate, 'YYYY-MM-DD').isBefore(event.end_on));
                });
                actualEventsArr = newArr.concat(actualEventsArr);
            });

            return actualEventsArr
        }

        function changeChartTheme(key) {

            var obj = {
                "multiNumber":{ "theme": "tren", "numberPrefix": "", "chartBottomMargin": '40'},
                "multiPercent": MSCOLUMN2D_WITH_PERCENT,
                "soloNumber": { "theme": "tren", "paletteColors": "#0075c2", "numberPrefix": "", "chartBottomMargin": '40'},
                "soloPercent" : COLUMN2D_PERCENT,
                "soloCurrency": COLUMN2D_WITH_$,
                "multiCurrency": MSCOLUMN2D_WITH_CURRENCY
            };

            return obj[key];

        }

    }

})();
(function () {

    'use strict';

    FusionCharts.register('theme', {
        name: 'tren',
        theme: {
            base: {
                chart: {
                    paletteColors: '#33b297, #ee7774, #005075, #33B5E5, #AA66CC, #00002a, #00892a, #7a7730, #ddff2a' +
                    '#ffffc4, #ff6fc4, #516fc4, #b17746, #ffeded, #ffff00, #007e7a, #aa7e7a, #ff0000, #00ff00, #ffa100' +
                    '#00a100, #001200, #0012de, #b012de, #01a7de, #015300, #d95300, #005c69, #bd5c69, #bd0069, #bdff69' +
                    '#FF3399, #CCFF33, #CC33CC, #9999FF, #333300, #FF3300, #FFCCFF, #CC9999, #9966CC, #CCFFFF, #33CC99, #B0B0B0, #663399,' +
                    '#FF33CC, #FF9966, #FF0099, #CCFF00, #993366, #669900, #FFFFCC, #FF00FF, #00ffc0, #3366FF, #333333',
                    baseFontColor: '#36474D',
                    baseFont: 'Open Sans',
                    numberPrefix: "$",
                    showBorder: '0',
                    bgColor: '#ffffff',
                    showShadow: '0',
                    canvasBgColor: '#ffffff',
                    canvasBorderAlpha: '0',
                    useplotgradientcolor: '0',
                    useRoundEdges: '0',
                    showPlotBorder: '0',
                    showAlternateHGridColor: '0',
                    showAlternateVGridColor: '0',
                    toolTipBorderThickness: '0',
                    toolTipBgColor: '#005075',
                    toolTipColor: '#ffffff',
                    toolTipBgAlpha: '90',
                    toolTipBorderRadius: '2',
                    toolTipPadding: '5',
                    legendBgAlpha: '0',
                    legendBorderAlpha: '0',
                    legendShadow: '0',
                    legendItemFontSize: '10',
                    divlineAlpha: '100',
                    divlineColor: '#f3f3f3',
                    divlineThickness: '1',
                    divLineIsDashed: '0',
                    divLineDashLen: '1',
                    divLineGapLen: '1',
                    showHoverEffect: '1',
                    valueFontSize: '11',
                    showXAxisLine: '1',
                    xAxisLineThickness: '1',
                    xAxisLineColor: '#eeeeee',
                    showValues: '0',
                    drawCustomLegendIcon: "1",
                    legendIconBorderThickness: "0",
                    legendIconSides: "0",

                    captionFontSize: '16',
                    subcaptionFontSize: '12',
                    subcaptionFontBold: '0',
                    captionAlignment: 'left',
                    subcaptionAlignment: 'left',
                    captionHorizontalPadding: '-20',
                    canvasTopMargin: '50' // property not working


                },
                trendlines: [{
                    "line": [{
                        "color": "#005075",
                        "valueOnRight": "1",
                        "dashed": "0",
                    }]
                }]
            },

            doughnut2d : {
                chart: {
                        "theme": 'tren',
                        "use3DLighting": "0",
                        "enableSmartLabels": "0",
                        "startingAngle": "180",
                        "showLabels": "0",
                        "showPercentValues": "1",
                        "showLegend": "1",
                        "legendShadow": "0",
                        "legendBorderAlpha": "0",
                        "centerLabelBold": "1",
                        "showTooltip": "1",
                        "decimals": "0",
                }
            },

            //mscolumn2d: {
            //    chart: {
            //        valueFontColor: '#FFFFFF', //overwrite base value
            //            valueBgColor: '#000000',
            //            valueBgAlpha: '30',
            //            placeValuesInside: '1',
            //            rotateValues: '0'
            //    }
            //}
        }
    });

})();
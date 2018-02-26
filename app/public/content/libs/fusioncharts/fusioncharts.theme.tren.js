(function () {

    'use strict';

    FusionCharts.register('theme', {
        name: 'tren',
        theme: {
            base: {
                chart: {
                    paletteColors: '#33b297, #ee7774, #005075, #33B5E5, #AA66CC',
                    baseFontColor: '#36474D',
                    baseFont: 'Open Sans',

                    "numberPrefix": "$",
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
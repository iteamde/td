(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('mockDataService', mockDataService);

    mockDataService.$inject = ['$stateParams'];

    function mockDataService($stateParams) {

        return {
            widgets: widgets,
            getTranslate: getTranslate,
            getConnectorsDetailed: getConnectorsDetailed,
            getSurveysChart: getSurveysChart
        };

        function widgets() {
            return [
                {
                    "id": $stateParams.id,
                    "created_on": "0000-00-00 00:00:00",
                    "status": "1",
                    "default_chart_display_type": "column2d",
                    "position_x": 0,
                    "position_y": 0,
                    "width": 3,
                    "height": 4,
                    "chart_type": "1",
                    "chart_data": {
                        /*"data": [
                            {
                                "label": "GER",
                                "value": "5"
                            },
                            {
                                "label": "UK",
                                "value": "7"
                            },
                            {
                                "label": "USA",
                                "value": "30"
                            }
                        ],*/
                        "chart": {
                            "theme": "tren",
                            "numberPrefix": "",
                            "chartBottomMargin": 30,
                            // "paletteColors": "#0075c2"
                        }
                    },
                    "range": "1 year",
                    "chartView": "Total",
                    "description": "This chart shows the details of Turnover",
                    "groupBy": "Location",
                    "x": 0,
                    "y": 0,
                    "chartWidth": 195,
                    "chartHeight": 500
                }
            ];
        }

        function getTranslate() {
            return [
                {
                    token_name: 'step2_chart_type',
                    token_translation: 'Step 2: Chart Type',
                    type: 'System'
                },
                {
                    token_name: 'create_new_chart',
                    token_translation: 'Create New Chart ',
                    type: 'System'
                },
                {
                    token_name: 'bar_chart',
                    token_translation: 'Bar Chart',
                    type: 'Custom'
                },
                {
                    token_name: 'line_chart',
                    token_translation: 'Line Chart',
                    type: 'System'
                },
                {
                    token_name: 'pie_chart',
                    token_translation: 'Pie Chart',
                    type: 'System'
                },
                {
                    token_name: 'stack_chart',
                    token_translation: 'Stack Chart',
                    type: 'System'
                },
                {
                    token_name: 'step2_chart_type',
                    token_translation: 'Step 2: Chart Type',
                    type: 'System'
                },
                {
                    token_name: 'add_chart',
                    token_translation: 'Add Chart',
                    type: 'System'
                },
                {
                    token_name: 'step2_chart_type',
                    token_translation: 'Step 2: Chart Type',
                    type: 'System'
                },
                {
                    token_name: 'recommended_charts',
                    token_translation: 'Recommended Charts',
                    type: 'Custom'
                },
                {
                    token_name: 'chart_options',
                    token_translation: 'Chart Options',
                    type: 'System'
                },
                {
                    token_name: 'download_chart',
                    token_translation: 'Download Chart',
                    type: 'System'
                },
                {
                    token_name: 'chart_description',
                    token_translation: 'Chart Description',
                    type: 'System'
                },
                {
                    token_name: 'chart_title',
                    token_translation: 'Chart Title',
                    type: 'System'
                },
                {
                    token_name: 'Create Custom Chart',
                    token_translation: 'create_custom_chart',
                    type: 'System'
                }
            ]
        }

        function getConnectorsDetailed(id) {

            var obj = {
                '4': [
                    {
                        file: 'Users',
                        last_update: 'Jan 12, 2017'
                    },
                    /*{
                        file: 'Recruitment',
                        last_update: 'Jan 12, 2017'
                    },
                    {
                        file: 'Performance Management',
                        last_update: 'Jan 12, 2017'
                    },
                    {
                        file: 'Training',
                        last_update: 'Jan 12, 2017'
                    }*/
                ]
            };

            return obj[id];
        }


        function getSurveysChart() {
            return [{
                "id": 100,
                "created_on": "0000-00-00 00:00:00",
                "status": "1",
                "title": "Surveys",
                "default_chart_display_type": "mscombi2d",
                "position_x": 0,
                "position_y": 0,
                "width": 3,
                "height": 4,
                "chart_type": "1",
                "chart_data": {
                    "paletteColors": "#0075c2",
                    "chart": {
                        "theme": "tren",
                        "numberPrefix": ""
                    },
                    "categories": [
                        {
                            category: [
                                {label: "Highly Disengaged"},
                                {label: "Disengaged"},
                                {label: "Engaged"},
                                {label: "Highly Engaged"},
                                {label: "No Response"}]
                        }
                    ],
                    "dataset": [
                        {
                            data: [
                                {value: '8'},
                                {value: '46'},
                                {value: '20'},
                                {value: '46'},
                                {value: '44'}
                            ],
                            seriesname: ''
                        }
                    ],
                    "data": [
                        {label: "Highly Disengaged", value: 8},
                        {label: "Disengaged", value: 46},
                        {label: "Engaged", value: 20},
                        {label: "Highly Engaged", value: 46},
                        {label: "No Response", value: 44}

                    ]
                },
                "range": "1 year",
                "chartView": "Total",
                "description": "This chart shows Surveys",
                "groupBy": "Location",
                "x": 0,
                "y": 0,
                "chartWidth": 229,
                "chartHeight": 370
            }];

        }
    }

})();
/* global toastr:false, moment:false */
(function () {
    'use strict';


    angular
        .module('app.core')

        .constant('moment', moment)

        .constant('TILE_MIN_WIDTH', 3)
        .constant('TILE_MIN_HEIGHT', 4)
        .constant('TILE_MIN_WIDTH_TRENDLINE', 12)
        .constant('TILE_MIN_HEIGHT_TRENDLINE', 6)
        .constant('TILE_MIN_HEIGHT_WITH_FILTERS', 7)

        // translation
        .constant('LOCALES', {
            'locales': {
                'ru_RU': 'Русский',
                'en_US': 'English'
            },
            'preferredLocale': 'en_US'
        })

        // base api url
        //.constant('BASE_URL', window.location.origin + '/api/')
        .constant('BASE_URL', 'https://rawanenlp.dev.trendata.com/api/') //gsvqAMIprcWYNIH

        // tooltip
        .constant('TOOLTIP_MESSAGES', {
            LAYOUT: {
                TOGGLE_MENU: 'Toggle Menu',
                CHART_BUILDER: 'Create Custom Chart',
                ADD_TILES: 'Add Charts',
                EVENT_MANAGEMENT: 'Manage Events'
            },
            USER_MANAGEMENT: {
                ADD_NEW_USER: 'Add New User',
                SUSPEND_USER: 'Suspend User',
                CHANGE_USER: 'Change User Role',
                DELETE_USER: 'Delete User'
            },
            GRIDSTACK: {
                RESIZE_HANDLE: 'Resize chart'
            },
            TILES : {
                DOWNLOAD_CHART : 'Download Chart',
                CHART_OPTIONS: 'Chart Option',
                ADD_TO_DASHBOARD: 'Add to Dashboard'
            },
            BACK_BUTTON: 'Back button',
            PROFILE_UPDATE: 'Profile updated successfully.',
            ERROR_NOTY: 'There is some error'
        })

        .constant('ALLOWED_CHART_TYPES', [
            {type: 'scrollline2d', icon: 'lnr ic-line-chart', tooltip: 'Line Chart'},
            {type: 'scrollcolumn2d', icon: 'lnr ic-bar-chart', tooltip: 'Column Chart'},
            {type: 'scrollarea2d', icon: 'lnr ic-area-chart', tooltip: 'Area Chart'},
            {type: 'mssplinearea', icon: 'lnr ic-spline-area-chart', tooltip: 'Spline Chart'}
        ])

        //chart colors
        .constant('COLORS', {
            'CHART_TRENDLINE': '#008ee4',
            'CHART_PREDICTIVE_DATE': '#FFA500',
            'CHART_PREDICTIVE': '#F3A09E',
            'CHART_PAST': '#0075C2',
            'PREDICTIVE_COLORS': ['#FFA500', '#ffcc99']
        })

        .constant('COST_PER_HIRE', 4219)
        .constant('PREDICTIVE_CHART_CORRECTION', 6 /*predictive months*/ + new Date().getMonth())
        .constant('ANALYTICS_CHART_CORRECTION', new Date().getMonth())

        .constant('TRENDLINE_START_SETTINGS', {
            'renderAs': 'line',
            'showValues': '0',
            'id': 'trendline'
        })

        .constant('DEFAULT_ANNOTATION',  {
            'origw': '450',
            'origh': '300',
            'autoscale': '1',
            'showBelow': '0'
        })

        .constant('MSCOLUMN2D_WITH_PERCENT', {
            'theme': 'tren',
            'numberPrefix': '',
            'numberScaleValue': '1',
            'numberScaleUnit': ' %',
            'chartBottomMargin': '40'
        })

        .constant('MSCOLUMN2D_WITH_CURRENCY', {
            'theme': 'tren',
            'numberPrefix': '',
            'numberScaleValue': '1',
            'numberScaleUnit': ' $',
            'chartBottomMargin': '40'
        })

        .constant('COLUMN2D_WITH_$', {
            'theme': 'tren',
            'numberPrefix': '',
            'numberScaleValue': '1',
            'numberScaleUnit': ' $',
            'paletteColors': '#0075c2',
            'chartBottomMargin': '40'
        })

        .constant('COLUMN2D_PERCENT', {
            'theme': 'tren',
            'numberPrefix': '',
            'numberScaleValue': '1',
            'numberScaleUnit': ' %',
            'paletteColors': '#0075c2',
            'chartBottomMargin': '40'
        })
        
        .constant('ANNOTATIONS_HEX_RANGE', 'BCDEF')

        .constant('ROW_NAMES', {
            avgSalary: 'Avg. Salary',
            remoteEmployees: 'Remote Employees',
            hpInProfDev: 'HP in Prof Dev',
            numberOfEmployees: 'Number of Employees',
            recruiting: 'Recruiting',
            totalRecruitingCost: 'Total Recruiting Cost',
            totalTurnover: 'Total Turnover',
            nonHpTurnover: 'Non-HP Turnover',
            hpTurnover: 'HP Turnover',
            turnoverProductivityLoss: 'Turnover Productivity Loss',
            turnoverProdLossOfRev: 'Turnover Prod Loss % of Rev',
            companyRev: 'Company Rev(Annualized)'
        })

        .constant('GRID_FILTER_MODEL', {
            location: {
                name: 'Location',
                modelKey: 'location',
                label: '',
                values: {}
            },
            gender: {
                name: 'Gender',
                modelKey: 'gender',
                label: '',
                values: {}
            },
            department: {
                name: 'Department',
                modelKey: 'department',
                label: '',
                values: {}
            }
        })

        .constant('CHART_VALUES_TYPES', ['solo', 'soloPercent', 'multi', 'multiPercent', 'soloValue', 'multiValue'])

        .constant('CHART_THEMES', {
            'multiPercent': { 'theme': 'tren', 'numberPrefix': '', 'numberScaleValue': '1', 'numberScaleUnit': ' %', 'chartBottomMargin': '40'},
            'multi':{ 'theme': 'tren', 'numberPrefix': '', 'chartBottomMargin': '40'},
            'soloPercent' : { 'theme': 'tren', 'numberPrefix': '', 'paletteColors': '#0075c2', 'numberScaleValue': '1', 'numberScaleUnit': ' %', 'chartBottomMargin': '40'},
            'solo': { 'theme': 'tren', 'paletteColors': '#0075c2', 'numberPrefix': '', 'chartBottomMargin': '40'}
        })

})();

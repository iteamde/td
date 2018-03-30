/* global toastr:false, moment:false */
(function () {
    'use strict';


    angular
        .module('app.core')

        .constant('toastr', toastr)
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

        // .constant('BASE_URL', window.location.origin + '/api/')
        // .constant('BASE_URL', 'http://localhost:8000/api/') // local
        //.constant('BASE_URL', 'https://demo.trendata.com/api/') // demo
        //.constant('BASE_URL', 'https://stage.dev.trendata.com/api/') // stage
         //.constant('BASE_URL', 'https://customfield.dev.trendata.com/api/')
        // .constant('BASE_URL', 'http://192.168.8.95:8000/api/') // from shashi system
        .constant('BASE_URL', 'https://qa2400.dev.trendata.com/api/')

        // tooltip
        .constant('TOOLTIP_MESSAGES', {
            LAYOUT: {
                TOGGLE_MENU:  'toggle_menu',
                CHART_BUILDER: 'create_custom_chart',
                ADD_TILES: 'add_charts',
                EVENT_MANAGEMENT: 'manage_events'
            },
            USER_MANAGEMENT: {
                ADD_NEW_USER: 'add_new_user',
                SUSPEND_USER: 'suspend_user',
                CHANGE_USER: 'change_user_role',
                DELETE_USER: 'delete_user'
            },
            GRIDSTACK: {
                RESIZE_HANDLE: 'resize_chart'
            },
            TILES : {
                DOWNLOAD_CHART : 'download_chart',
                CHART_OPTIONS: 'chart_option',
                ADD_TO_DASHBOARD: 'add_to_dashboard',
                ADD_TO_DASHBOARD_NOTY: 'chart_successfully_added_to_dashboard'
            },
            BACK_BUTTON: 'back_button',
            PROFILE_UPDATE: 'profile_updated_successfully',
            ERROR_NOTY: 'there_is_some_error'
        })

        .constant('ALLOWED_CHART_TYPES', [
            {type: 'scrollline2d', icon: 'lnr ic-line-chart', tooltip: 'line_chart'},
            {type: 'scrollcolumn2d', icon: 'lnr ic-bar-chart', tooltip: 'column_chart'},
            {type: 'scrollarea2d', icon: 'lnr ic-area-chart', tooltip: 'area_chart'},
            {type: 'mssplinearea', icon: 'lnr ic-spline-area-chart', tooltip: 'spline_chart'}
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

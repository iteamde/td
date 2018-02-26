module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                files: {
                    'public/dist/app.js': [
                        // inject-vendor:js
                        'public/content/bower_components/jquery/dist/jquery.js',
                        'public/content/bower_components/angular/angular.js',
                        'public/content/bower_components/angular-cookies/angular-cookies.js',
                        'public/content/bower_components/angular-animate/angular-animate.js',
                        'public/content/bower_components/angular-sanitize/angular-sanitize.js',
                        'public/content/bower_components/angular-bootstrap/ui-bootstrap.js',
                        'public/content/bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
                        'public/content/bower_components/angular-ui-grid/ui-grid.js',
                        'public/content/bower_components/angular-ui-router/release/angular-ui-router.js',
                        'public/content/bower_components/angular-loading-bar/build/loading-bar.js',

                        // Gridstack with its dependencies
                        'public/content/bower_components/lodash/dist/lodash.min.js',
                        'public/content/bower_components/jquery-ui/jquery-ui.min.js',
                        'public/content/bower_components/gridstack/dist/gridstack.min.js',
                        'public/content/libs/gridstack-angular/dist/gridstack-angular.js',

                        // angular translate
                        'public/content/bower_components/angular-translate/angular-translate.js',
                        'public/content/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
                        'public/content/bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
                        'public/content/bower_components/angular-translate-storage-local/angular-translate-storage-local.js',
                        'public/content/bower_components/angular-translate-handler-log/angular-translate-handler-log.js',
                        'public/content/bower_components/angular-dynamic-locale/src/tmhDynamicLocale.js',
                        'public/content/bower_components/ngstorage/ngStorage.min.js',

                        // ...
                        'public/content/bower_components/toastr/toastr.js',
                        'public/content/bower_components/moment/moment.js',
                        'public/content/bower_components/noty/js/noty/packaged/jquery.noty.packaged.min.js',
                        'public/content/libs/angular-noty/angular-noty.js',
                        'public/content/bower_components/angular-ui-select/dist/select.js',
                        'public/content/bower_components/extras.angular.plus/ngplus-overlay.js',
                        'public/content/bower_components/jquery-validation/dist/jquery.validate.min.js',
                        'public/content/bower_components/jquery-validation/dist/additional-methods.min.js',
                        'public/content/bower_components/jpkleemans-angular-validate/dist/angular-validate.min.js',

                        // Start Chart libs
                        'public/content/fusioncharts-license/js/fusioncharts.js',
                        'public/content/fusioncharts-license/js/fusioncharts.charts.js',
                        'public/content/libs/fusioncharts/fusioncharts.theme.tren.js',
                        'public/content/libs/fusioncharts/angular-fusioncharts.js',

                        // Bootstrapping
                        'public/app/app.module.js',

                        // Reusable Blocks/Modules
                        'public/app/blocks/exception/exception.module.js',
                        'public/app/blocks/exception/exception-handler.provider.js',
                        'public/app/blocks/exception/exception.js',
                        'public/app/blocks/logger/logger.module.js',
                        'public/app/blocks/logger/logger.js',
                        'public/app/blocks/router/router.module.js',
                        'public/app/blocks/router/routerHelperProvider.js',

                        // core module, common directives, services under core module
                        'public/app/core/core.module.js',
                        'public/app/core/core.constants.js',
                        'public/app/core/common.pagination.service.js',
                        'public/app/core/core.config.js',
                        'public/app/core/core.resize.directive.js',
                        'public/app/core/core.scroll.directive.js',
                        'public/app/core/core.debounce.service.js',
                        'public/app/core/common-directives/core.add-chart.directive.js',
                        'public/app/core/common-directives/core.upload-csv.directive.js',
                        'public/app/core/common-directives/core.model-view-format.directive.js',
                        'public/app/core/common-filters/common.chart-type.filter.js',
                        'public/app/core/common-filters/common.object-keys.filter.js',
                        'public/app/core/common-filters/common.display-values.filter.js',
                        'public/app/core/common-filters/common.capitalize.filter.js',
                        'public/app/core/common-components/grid/grid.component.js',
                        'public/app/core/common-components/grid/grid.controller.js',
                        'public/app/core/common-components/grid/manage-columns/grid.modal.manage-columns.controller.js',
                        'public/app/core/common-components/users-grid/users-grid.component.js',
                        'public/app/core/common-components/users-grid/users-grid.controller.js',
                        'public/app/core/common.service.js',
                        'public/app/core/core.page.service.js',
                        'public/app/core/common-chart.service.js',
                        'public/app/core/mock-data.service.js',
                        'public/app/core/core.draggable.directive.js',
                        'public/app/core/core.video.service.js',

                        // Auth
                        'public/app/auth/login/login.module.js',
                        'public/app/auth/login/login.routes.js',
                        'public/app/auth/login/auth.service.js',
                        'public/app/auth/login/login.controller.js',
                        
                        'public/app/auth/reset/reset.module.js',
                        'public/app/auth/reset/reset.routes.js',
                        'public/app/auth/reset/reset.service.js',
                        'public/app/auth/reset/reset.controller.js',

                        // Layout
                        'public/app/layout/layout.module.js',
                        'public/app/layout/layout.routes.js',
                        'public/app/layout/layout.service.js',
                        'public/app/layout/layout-sidebar.controller.js',
                        'public/app/layout/layout-top.controller.js',
                        'public/app/layout/layout.jq-toggle-sidebar.directive.js',

                        // Search Bar
                        'public/app/layout/search_bar/search-bar.component.js',
                        'public/app/layout/search_bar/search-bar.controller.js',
                        'public/app/layout/search_bar/search-bar.service.js',

                        // Dashboard
                        'public/app/dashboard/dashboard.module.js',
                        'public/app/dashboard/dashboard.routes.js',
                        'public/app/dashboard/dashboard.service.js',
                        'public/app/dashboard/dashboard.controller.js',
                        'public/app/dashboard/metric-history/dashboard.metric-history.controller.js',

                        // Metric
                        'public/app/metric/metric.module.js',
                        'public/app/metric/metric.routes.js',
                        'public/app/metric/metric.service.js',
                        'public/app/metric/metric.controller.js',

                        // User
                        'public/app/settings/user/user.module.js',
                        'public/app/settings/user/user.routes.js',
                        'public/app/settings/user/user.controller.js',
                        'public/app/settings/user/user.service.js',
                        'public/app/settings/user/user.modal-add-user.controller.js',
                        'public/app/settings/user/user.modal-edit-user.controller.js',

                        // Financial Data
                        'public/app/settings/financial_data/financial_data.module.js',
                        'public/app/settings/financial_data/financial_data.routes.js',
                        'public/app/settings/financial_data/financial_data.year-dropdown.directive.js',
                        'public/app/settings/financial_data/financial_data.controller.js',

                        // Chart Builder
                        'public/app/chart_builder/chart-builder.module.js',
                        'public/app/chart_builder/chart-builder.routes.js',
                        'public/app/chart_builder/chart-builder.controller.js',
                        'public/app/chart_builder/chart-builder.render-chart.directive.js',

                        // Analytics
                        'public/app/detailed_view/analytics/analytics.module.js',
                        'public/app/detailed_view/analytics/analytics.routes.js',
                        'public/app/detailed_view/analytics/analytics.service.js',
                        'public/app/detailed_view/analytics/analytics.controller.js',

                        // Predictive
                        'public/app/detailed_view/predictive/predictive.module.js',
                        'public/app/detailed_view/predictive/predictive.routes.js',
                        'public/app/detailed_view/predictive/predictive.service.js',
                        'public/app/detailed_view/predictive/predictive.controller.js',
                        'public/app/detailed_view/predictive/summary/summary.component.js',
                        'public/app/detailed_view/predictive/summary/summary.controller.js',
                        'public/app/detailed_view/predictive/summary/summary-grid.factory.js',


                        // Event
                        'public/app/settings/event/event.module.js',
                        'public/app/settings/event/event.routes.js',
                        'public/app/settings/event/event.service.js',
                        'public/app/settings/event/event.controller.js',
                        'public/app/settings/event/event.modal.controller.js',
                        'public/app/settings/event/event.modal.service.js',

                        // Connector
                        'public/app/connector/connector.module.js',
                        'public/app/connector/connector.routes.js',
                        'public/app/connector/configure-connector.modal.controller.js',
                        'public/app/connector/connector.controller.js',
                        'public/app/connector/detailed/connector-detailed.routes.js',
                        'public/app/connector/detailed/connector-detailed.controller.js',
                        'public/app/connector/detailed/connector-detailed.modal-upload.service.js',
                        'public/app/connector/detailed/connector-detailed.modal-upload.controller.js',
                        'public/content/bower_components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.min.js',

                        // Drill Down
                        'public/app/detailed_view/drill_down/drill-down.module.js',
                        'public/app/detailed_view/drill_down/drill-down.routes.js',
                        'public/app/detailed_view/drill_down/drill-down.service.js',
                        'public/app/detailed_view/drill_down/drill-down.controller.js',

                        // Nlp Search
                        'public/app/nlp_search/nlp-search.module.js',
                        'public/app/nlp_search/nlp-search.component.js',
                        'public/app/nlp_search/nlp-search.routes.js',
                        'public/app/nlp_search/nlp-search.service.js',
                        'public/app/nlp_search/nlp-search.controller.js',

                        // Charts Library
                        'public/app/charts_library/charts-library.module.js',
                        'public/app/charts_library/charts-library.component.js',
                        'public/app/charts_library/charts-library.routes.js',
                        'public/app/charts_library/charts-library.service.js',
                        'public/app/charts_library/charts-library.controller.js',

                        // Profile
                        'public/app/settings/profile/profile.module.js',
                        'public/app/settings/profile/profile.component.js',
                        'public/app/settings/profile/profile.routes.js',
                        'public/app/settings/profile/profile.service.js',
                        'public/app/settings/profile/profile.controller.js',

                        // Languages
                        'public/app/settings/languages/languages.module.js',
                        'public/app/settings/languages/languages.routes.js',
                        'public/app/settings/languages/languages.controller.js',
                        'public/app/settings/languages/languages.modal-edit-token.controller.js',

                        // Release Notes
                        'public/app/release_notes/release_notes.module.js',
                        'public/app/release_notes/release_notes.routes.js',

                        // Surveys
                        'public/app/settings/surveys/surveys.module.js',
                        'public/app/settings/surveys/surveys.routes.js',
                        'public/app/settings/surveys/surveys.controller.js',

                        // YouTube Videos
                        'public/app/layout/layout-video.controller.js',
                        'public/content/bower_components/youtube-video-js/dist/youtube-video-min.js',

                        // Alerts
                        'public/app/settings/alerts/alerts.module.js',
                        'public/app/settings/alerts/alerts.routes.js',
                        'public/app/settings/alerts/alerts.controller.js',
                        'public/app/settings/alerts/alerts.service.js',
                        'public/app/settings/alerts/alerts-modal/alerts.modal.controller.js',

                        //Share
                        'public/app/layout/layout-share.controller.js',
                        'public/content/bower_components/jssocials/dist/jssocials.min.js'
                    ]
                }
            }
        },
        jshint: {
            all: [
                'Gruntfile.js'
                // 'public/dist/app.js'
            ]
        },
        uglify: {
            dist: {
                src: ['public/dist/app.js'],
                dest: 'public/dist/app.min.js'
            }
        },
        sprite: {
            scss: {
                src: ['public/content/images/**/*.png'],
                dest: 'public/content/css/sprite.png',
                destCss: 'public/content/css/sprite.scss',
                padding: 3
            }
        }
    });

    // Load the Grunt plugins.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-spritesmith');

    // Register the default tasks.
    grunt.registerTask('default', ['concat', 'jshint', 'uglify'/*, 'sprite'*/]);
};

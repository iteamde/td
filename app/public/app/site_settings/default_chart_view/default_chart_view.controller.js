(function () {

    'use strict';

    angular
        .module('app.default_chart_view')
        .controller('DefaultChartViewController', DefaultChartViewController);

    DefaultChartViewController.$inject = ['$scope', '$rootScope', 'exception', 'noty', 'defaultChartVieweService'];

    function DefaultChartViewController($scope, $rootScope, exception, noty, defaultChartVieweService) {
        var vm = this;
        var initCharts = [];
        vm.charts = [];
        vm.drilldownChartViews = [];
        vm.analyticsChartViews = [];

        defaultChartVieweService.getChartViews().then(function(responce) {
            vm.charts = responce.data;
            _.each(vm.charts, function(chart) {
                if (chart.availableAnalyticsViews.indexOf(chart.analyticsView) < 0)
                    chart.analyticsView = 'total';

                if (chart.availableDrilldownViews.indexOf(chart.drilldownView) < 0)
                    chart.drilldownView = 'gender';
            })
            initCharts = _.cloneDeep(vm.charts);
        });

        vm.saveChartViews = function() {
            var data = _.differenceWith(vm.charts, initCharts, function(now, was) {
                return now.id === was.id && now.drilldownView === was.drilldownView && now.analyticsView === was.analyticsView;
            });

            defaultChartVieweService.updateChartView(data).then(function(responce) {
                initCharts = _.cloneDeep(vm.charts);
                noty.show({
                    text: $scope.getTranslation('chart_views_saved_successfully'),
                    type: 'success'
                });
            });
        };

        vm.cutCustom = function(field) {
            return field.indexOf('custom') === 0 ? field.slice(7) : field;
        };
    }
})();

(function () {

    'use strict';

    angular
        .module('app.nlpSearch')
        .controller('NlpSearchController', NlpSearchController);

    NlpSearchController.$inject = ['$scope', 'nlpSearchService', '$stateParams', '$uibModal'];

    function NlpSearchController($scope, nlpSearchService, $stateParams, $uibModal) {

        var vm = this;

        vm.isChartRendered = false;
        vm.submit = submit;
        vm.addToDashboard = addToDashboard;
        $scope.getTranslation = $scope.$parent.getTranslation;
        vm.getQueries = nlpSearchService.getAutocompleteResults;
        vm.onItemAdded = onItemAdded;
        vm.manageColumns = manageColumns;
        vm.addToDashboard = addToDashboard;
        vm.error = '';
        vm.request = {
            text: '',
            page_number: 1,
            page_size: 25
        };

        if ($stateParams.query) {
            vm.request.text = $stateParams.query;
            vm.submit(vm.request);
        }


        $scope.$on('columnsChanged', function (e, data) {
            e.stopPropagation();
            vm.checkedColumns = data;
        });

        function submit(request) {
            vm.error = '';
            vm.queryResults = [];
            vm.total = 0;
            $scope.widgets = [];

            $stateParams.query = request.text;

            nlpSearchService.getSearchResults(request)
                .success(getSearchResultSuccess)
                .error(getSearchResultError);
        }

        function getSearchResultSuccess(res) {

            vm.token = res.token;
            vm.queryResults = res.result;
            vm.total = res.total_count;
            vm.gridColumns = _.keys(vm.queryResults[0]);
            vm.metricStyles = res.available_mestric_styles;
            vm.checkedColumns = vm.checkedColumns || _.take(vm.gridColumns, 7);

            nlpSearchService.getChartData(res.token)
                .success(getChartDataSuccess);
        }

        function getSearchResultError(res) {
            vm.error = res.err_message;
        }

        function getChartDataSuccess(res) {
            $scope.widgets = [res];
           $scope.widgets[0].default_chart_display_type = "zoomline";

        }

        function addToDashboard() {
            $uibModal.open({
                animation: false,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/nlp_search/add_to_dashboard/nlp.modal.add-to-dashboard.view.html',
                controller: 'NlpModalAddToDashboard',
                controllerAs: 'vm',
                size: 'lg',
                scope: $scope,
                resolve: {
                    token: function () {
                        return vm.token;
                    },
                    metricStyles: function () {
                        return vm.metricStyles;
                    },
                    checkedColumns: function () {
                        return vm.checkedColumns;
                    }
                }
            });
        }

        function manageColumns() {

            $uibModal.open({
                animation: false,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/nlp_search/manage-columns/nlp.modal.manage-columns.view.html',
                controller: 'NlpModalManageColumnsController',
                controllerAs: 'vm',
                scope: $scope,
                resolve: {
                    columns: function () {
                        return getColumnKeys(vm.queryResults[0]);
                    },
                    checkedColumns: function () {
                        return vm.checkedColumns;
                    }
                }
            });
        }

        function onItemAdded() {
            $scope.isGridItemReady = true;
        }

        function getColumnKeys(obj) {
            return _.without(_.keys(obj), '$$hashKey');
        }

        /* get chart ready (render) status
         *********************************/
        function setChartStatus() {
            vm.isChartRendered = true;
        }

        FusionCharts.addEventListener("rendered", setChartStatus);

        // or vm.$onDestroy = function () { }
        $scope.$on("$destroy", function() {
            FusionCharts.removeEventListener("rendered", setChartStatus);
        });

    }
})();



(function () {

    'use strict';

    angular.module('app.nlpSearch')
        .directive('hideChartLegend', hideChartLegend);

    function hideChartLegend($document) {
        return {

            restrict: 'A',

            link: function ( $scope, $element, $attrs) {
                var  chartEl, toggleBtn, chart, svgEl, legendElem,
                    svgElHeight, chartHeight,
                    svgElHeightModify, chartHeightModify, legendElemHeight,
                    isShow = false;

                function setChartStatus() {

                    chartEl = $element.find('svg').find('g');
                    chart = $element.parents()[2];

                    legendElem = chartEl.filter(function(item, index, arr) {

                        if(index.className.baseVal.includes('legend')) {

                            return true;
                        }
                        return false;
                    });

                    $element.append('<button id="toggleLegend">Legend</button>');

                    toggleBtn = $element.find('#toggleLegend');
                    svgEl = $element.find('svg')[0];



                    legendElemHeight = legendElem[0].firstElementChild.attributes[3].nodeValue;
                    svgElHeight = svgEl.getBoundingClientRect().height;
                    chartHeight = chart.getBoundingClientRect().height;


                    svgElHeightModify = svgElHeight - legendElemHeight;
                    chartHeightModify = chartHeight - legendElemHeight;

                    legendElem.css('display', 'none');

                    chart.style.height = chartHeightModify + "px";
                    svgEl.style.height = svgElHeightModify + "px";

                    $element.css('position', 'relative');

                    toggleBtn.css({
                        'top': svgElHeightModify + "px",
                        'position': 'absolute',
                        'left':'50%',
                        'transform': 'translateX(-50%)',
                        'z-index': '9999',
                        'border-radius': '5px',
                        'background': '#005075',
                        'color': '#fff'
                    });

                    toggleBtn.click(function() {
                        isShow = !isShow;

                        if(isShow) {
                            legendElem.fadeIn();
                            chart.style.height = chartHeight + "px";
                            toggleBtn.css('top',  svgElHeight + "px");
                            svgEl.style.height = svgElHeight + "px";

                        }
                        else {
                            legendElem.fadeOut();
                            chart.style.height = chartHeightModify + "px";
                            toggleBtn.css('top',  svgElHeightModify + "px");
                            svgEl.style.height = svgElHeightModify + "px";

                        }
                    });

                }


                FusionCharts.addEventListener("rendered", setChartStatus);

                $scope.$on("$destroy", function() {
                    FusionCharts.removeEventListener("rendered", setChartStatus);
                    toggleBtn.remove();
                });

            }
        };
    }
})();
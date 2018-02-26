(function () {

    'use strict';

    angular
        .module('app.predictive')
        .factory('predictiveService', predictiveService);

    predictiveService.$inject = ['BASE_URL', '$http', 'noty'];

    function predictiveService(BASE_URL, $http, noty) {

        return {
            getCharts: getCharts,
            getCurvePoints: getCurvePoints,
            resetGrid: resetGrid
        };

        function getCharts(id) {
            var apiUrl = BASE_URL + "sub-chart/predictive/" + id;
            return $http.get(apiUrl);
        }

        function getCurvePoints(id, data) {
            var apiUrl = BASE_URL + "sub-chart/predictive/" + id;
            return $http.post(apiUrl, data);
        }

        function resetGrid(vm, $scope) {

            noty.show({
                text: 'Are you sure you want to discard your changes?',
                layout: 'topCenter',
                buttons: [
                    {
                        addClass: 'btn btn-default',
                        text: 'Cancel',
                        onClick: decline
                    },
                    {
                        addClass: 'btn btn-primary',
                        text: 'Yes',
                        onClick: approve
                    }
                ]
            });

            function decline ($noty) {
                $noty.close();
            }

            function approve($noty) {
                $scope.$apply(function() {
                    $scope.summary.default();
                    vm.data = $scope.summary.getData();
                    vm.modelingMode = false;
                });
                $noty.close();
            }
        }

    }
})();
(function () {

    'use strict';

    angular
        .module('app.alerts')
        .controller('AlertsController', AlertsController);

    AlertsController.$inject = ['$scope', 'alertsService', 'noty'];

    function AlertsController($scope, alertsService, noty) {

        var vm = this;

        vm.alerts = [];
        vm.toggleAlert = toggleAlert;
        vm.deleteAlert = deleteAlert;
        vm.showMoreLess = showMoreLess;
        vm.showMoreLessLink = showMoreLessLink;
        vm.maxFiltersCount = 10;

        activate();

        function activate() {
            alertsService.getAlerts()
                .success(getAlertsSuccess);
        }

        function toggleAlert(alert) {
            alertsService.setAlertStatus(alert.id, ! alert.status)
                .then(function(res) {
                    alert.status = res.data.status;
                })
                .catch(serviceError);
        }

        function getAlertsSuccess (res) {
            vm.alerts = _.map(res, function(alert) {
                if (! alert.filters)
                    return alert;

                alert.filters = _.reduce(JSON.parse(alert.filters), function(accum, filter, name) {
                    accum[name] = {
                        expanded: null,
                        values: filter
                    };

                    return accum;
                }, {});

                return alert;
            });
        }

        function deleteAlert(id) {
            noty.closeAll();
            noty.show({
              text: $scope.getTranslation('delete_alert_confirm'),
              buttons: [
                {
                    addClass: 'btn btn-warning',
                    text: 'Cancel',
                    onClick: function($noty) {
                        $noty.close();
                      }
                },
                {
                    addClass: 'btn btn-success',
                    text: 'Ok',
                    onClick: function($noty) {
                        alertsService.deleteAlert(id)
                            .then(deleteAlertSuccess)
                            .catch(serviceError);

                        $noty.close();
                    }
                }
              ]
            });
        }

        function deleteAlertSuccess(res) {
            vm.alerts = _.filter(vm.alerts, function(alert) {
                return alert.id != res.data;
            });
        }

        function serviceError(error) {
            exception.catcher('XHR Failed for login')(error);
        }

        function showMoreLess(filter, expand) {
            filter.expanded = expand;
        }

        function showMoreLessLink(values) {
            return _.keys(_.filter(values)).length > vm.maxFiltersCount;
        }
    }

})();
(function () {

    'use strict';

    angular
        .module('app.connector')
        .controller('ConnectorController', ConnectorController);

    ConnectorController.$inject = [
        '$scope',
        'logger',
        '$uibModal',
        '$timeout',
        'commonService'
    ];

    function ConnectorController($scope, logger, $uibModal, $timeout, commonService) {

        var vm;
        vm = this;
        vm.isLoading = false;

        vm.connectors = [
            {
                id: 4,
                title: "TUFF",
                logo: "TUFF",
                status: 1,
                error: {}
            },
            {
                title: "ADP",
                logo: "ADP",
                status: 1,
                error: {
                    status: false,
                    count: 0
                }
            },
            {
                title: "PeopleSoft",
                logo: "PeopleSoft",
                status: 1,
                error: {
                    status: false,
                    count: 0
                }
            },
            {
                title: "SAP HR",
                logo: "SAP_HR",
                status: 1,
                error: {
                    status: false,
                    count: 0
                }
            },
            {
                title: "Deltek",
                logo: "Deltek",
                status: 1,
                error: {
                    status: false,
                    count: 0
                }
            },
            {
                title: "Workday",
                logo: "Workday",
                status: 1,
                error: {
                    status: false,
                    count: 0
                }
            },
            {
                title: "ExponentHR",
                logo: "ExponentHR",
                status: 1,
                //syncInfo: "Last sync: May 7, 2016 1:26 am",
                error: {
                    status: false,
                    count: 0
                }
            },
            {
                title: "UltiPro",
                logo: "UltiPro",
                status: 1,
                error: {
                    status: false,
                    count: 0
                }
            }

        ];

        vm.configureConnector = configureConnector;
        vm.getClassForConnectorStatus = getClassForConnectorStatus;
        vm.showSpinner = showSpinner;

        function getClassForConnectorStatus(param, connector) {
            return connector.status === param;
        }

        function configureConnector() {
            var modalInstance = $uibModal.open({
                animation: false,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                size: 'sm',
                templateUrl: 'app/connector/configure-connector.modal.view.html',
                controller: 'ConnectorModalController',
                controllerAs: 'vm',
            });
        }

        function showSpinner(e, connector) {

            if (connector.title !== 'TUFF') {

                e.preventDefault();
                vm.isLoading = true;

                $timeout(function () {
                    vm.isLoading = false;
                    commonService.notification("Data has been migrated", "success");
                }, 7000);

            }
        }

    }


})();
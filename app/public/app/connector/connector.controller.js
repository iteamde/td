(function () {

    'use strict';

    angular
        .module('app.connector')
        .controller('ConnectorController', ConnectorController);

    ConnectorController.$inject = [
        '$scope',
        'logger',
        '$uibModal'

    ];

    function ConnectorController($scope, logger, $uibModal) {

        var vm;
        vm = this;

        vm.connectors = [
            {
                id: 4,
                title: $scope.getTranslation('tuff'),
                logo: "TUFF",
                status: 1,
                error: {}
            },

            {
                title: $scope.getTranslation('sap_hr'),
                logo: "SAP_HR",
                status: 0,
                error: {
                    status: false,
                    count: 0
                }
            },

            {
                title: $scope.getTranslation('people_soft'),
                logo: "PeopleSoft",
                status: 0,
                error: {
                    status: false,
                    count: 0
                }
            },

            {
                title: $scope.getTranslation('workday'),
                logo: "Workday",
                status: 0,
                error: {
                    status: false,
                    count: 0
                }
            },
            {
                title: $scope.getTranslation('deltek'),
                logo: "Deltek",
                status: 0,
                error: {
                    status: false,
                    count: 0
                }
            },
            {
                title: $scope.getTranslation('exponent_hr'),
                logo: "ExponentHR",
                status: 0,
                //syncInfo: "Last sync: May 7, 2016 1:26 am",
                error: {
                    status: false,
                    count: 0
                }
            }

        ];
        vm.configureConnector = configureConnector;
        vm.getClassForConnectorStatus = getClassForConnectorStatus;


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
    }


})();
(function () {
    'use strict';

    angular
        .module('app.connector')
        .controller('ConnectorModalController', ConnectorModalController);

    ConnectorModalController.$inject = ['$scope', '$uibModalInstance'];

    function ConnectorModalController($scope, $uibModalInstance) {

        var vm = this;

        vm.isPasswordVisible = false;

        vm.togglePasswordVisibility = togglePasswordVisibility;

        function togglePasswordVisibility() {
            vm.isPasswordVisible = !vm.isPasswordVisible;
        }

        // modal methods
        vm.ok = function () {
            //$uibModalInstance.close(vm.selected.item);
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();

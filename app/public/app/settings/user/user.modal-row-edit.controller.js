(function () {

    'use strict';

    angular
        .module('app.user')
        .controller('ModalRowEditController', ModalRowEditController);

    ModalRowEditController.$inject = ['$uibModalInstance', 'grid', 'row'];
    function ModalRowEditController($uibModalInstance, grid, row) {



        var vm;

        vm = this;
        vm.entity = angular.copy(row.entity);

        vm.designations = [
            {id: 1, value: 'Android Developer'},
            {id: 2, value: 'Java Developer'},
            {id: 3, value: 'PM'}
        ];

        vm.roles = [
            {id: 1, name: 'Manager'},
            {id: 2, name: 'Executive'},
            {id: 3, name: 'Admin'}
        ];

        vm.selectedDesignation = vm.designations[0];
        vm.selectedRole = vm.roles[0];






        vm.ok = function () {
            //$uibModalInstance.close(vm.selected.item);
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }


})();
(function () {

    'use strict';

    angular
        .module('app.languages')
        .controller('ModalEditTokenController', ModalEditTokenController);

    ModalEditTokenController.$inject = ['$uibModalInstance', 'row'];

    function ModalEditTokenController ($uibModalInstance, row) {

        var vm = this;

        vm.entity = angular.copy(row.entity);

        console.log($uibModalInstance);
    }

})();
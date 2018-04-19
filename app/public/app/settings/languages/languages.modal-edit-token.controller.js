(function () {

    'use strict';

    angular
        .module('app.languages')
        .controller('ModalEditTokenController', ModalEditTokenController);

    ModalEditTokenController.$inject = ['$uibModalInstance', 'token'];

    function ModalEditTokenController ($uibModalInstance, token) {

        var vm = this;
        vm.token = token;
    }

})();
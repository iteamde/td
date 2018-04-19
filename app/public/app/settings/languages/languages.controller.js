(function () {

    'use strict';

    angular
        .module('app.languages')
        .controller('LanguagesController', LanguagesController);

    LanguagesController.$inject = ['$scope', '$uibModal', 'noty', 'BASE_URL', 'mockDataService'];

    function LanguagesController($scope, $uibModal, noty, BASE_URL, mockDataService) {

        var vm = this;
        vm.editToken = editToken;
        vm.translates = mockDataService.getTranslate();

        vm.defaultSearch = 'chart';

        vm.pagination = {
            page_size: 10,
            page_number: 1,
            sort_column: '',
            sort_type: ''
        };

        function editToken(token) {

            var modalInstance = $uibModal.open({
                animation: false,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/settings/languages/languages.modal.edit-token.view.html',
                controller: 'ModalEditTokenController',
                controllerAs: 'vm',
                backdrop: 'static',
                scope: $scope,
                resolve: {
                    token: function () {
                        return token;
                    }
                }
            });
        }

    }

})();
(function () {

    'use strict';

    angular
        .module('app.user')
        .controller('ModalAddUserController', ModalAddUserController);

    ModalAddUserController.$inject = ['$uibModalInstance', 'userService','noty', 'userData', '$scope'];
    function ModalAddUserController($uibModalInstance, userService, noty, userData, $scope) {

        var vm;

        vm = this;
        vm.addUser = addUser;

        vm.errorMsg = {
            type: '',
            msg: ''
        };

        vm.addUserFields = {
            firstname: '',
            lastname: '',
            email: ''
        };

        function addUser(form, inputData) {
            if (form.validate()) {
                var inputDataValue = {
                    firstname: inputData.firstname,
                    lastname: inputData.lastname,
                    email: inputData.email
                };

                return userService
                    .addUser(inputDataValue)
                    .success(addUserSuccess)
                    .error(addUserFailure)
                    .catch(addUserError);
            }
        }

        function addUserSuccess(data) {
            noty.show({
                text: $scope.getTranslation('user_added_success'),
                type: 'success'
            });

            userData.data.push(data);
            userData.total++;
            $uibModalInstance.close();
        }

        function addUserFailure(data) {
            vm.errorMsg.type = 'danger';
            vm.errorMsg.msg = data;
        }

        function addUserError(error) {
            noty.show({
                text: 'Unable to process.',
                type: 'error'
            });
        }
    }


})();
(function () {

    'use strict';

    angular
        .module('app.user')
        .controller('ModalEditUserController', ModalEditUserController);

    ModalEditUserController.$inject = ['$scope', '$uibModalInstance', 'user', 'noty', 'userService'];
    function ModalEditUserController($scope, $uibModalInstance, user, noty, userService) {





        var vm = this;
        vm.cancel = cancel;
        vm.editUser = editUser;

        vm.editUserField = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
        };

        vm.errorMsg = {
            type: '',
            msg: ''
        };


        $scope.validationOptions = {
            rules: {
                email: {
                    required: true,
                    email: true
                },
                first_name: {
                    required: true
                },
                last_name: {
                    required: true
                }
            },
            messages: {
                email: {
                    required: $scope.getTranslation('this_field_is_required'),
                    email: $scope.getTranslation("please_enter_a_valid_email_address")
                },
                first_name: {
                    required: $scope.getTranslation('this_field_is_required')
                },
                last_name: {
                    required: $scope.getTranslation('this_field_is_required')
                }
            }
        }

        function editUser(form, inputData){
            if (form.validate()) {
                var inputDataValue = {
                    firstname: inputData.firstname,
                    lastname: inputData.lastname,
                    email: inputData.email,
                    user_id: user.id,
                    status: user.status
                };

                return userService
                    .editUser(inputDataValue)
                    .success(editUserSuccess)
                    .error(editUserFailure)
                    .catch(editUserError);
            }
        }

        function editUserSuccess() {
            noty.show({
                text: $scope.getTranslation('success_user_update'),
                type: 'success'
            });
            $scope.$parent.vm.activate();
            $uibModalInstance.close();
        }

        function editUserFailure(data) {
            vm.errorMsg.type = 'danger';
            vm.errorMsg.msg = data;
        }

        function editUserError(error) {
            noty.show({
                text: 'Unable to process.',
                type: 'error'
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }


})();
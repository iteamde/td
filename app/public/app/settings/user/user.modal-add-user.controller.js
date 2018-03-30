(function () {

    'use strict';

    angular
        .module('app.user')
        .controller('ModalAddUserController', ModalAddUserController);

    ModalAddUserController.$inject = ['$uibModalInstance', 'userService','noty', 'userData', '$scope' ];
    function ModalAddUserController($uibModalInstance, userService, noty, userData, $scope ) {


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
                text: $scope.getTranslation('unable_to_process'),
                type: 'error'
            });
        }
    }


})();
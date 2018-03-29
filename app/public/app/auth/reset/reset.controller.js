(function () {
    'use strict';

    angular
        .module("app.reset")
        .controller("ResetController", ResetController);


    ResetController.$inject = ["$scope", '$stateParams', 'resetService', 'noty', 'exception'];

    function ResetController($scope, $stateParams, resetService, noty, exception) {

        var vm = this;
        $scope.validationOptions = {
            rules: {
                resetpassword: {
                    required: true,
                    minlength: 6
                }
            },
            messages: {
                resetpassword: {
                    minlength:  $scope.getTranslation('password_must_be_of_6_characters')
                }
            }
        };
        vm.togglePasswordVisibility = function() {
            vm.isPasswordVisible = !vm.isPasswordVisible;
        }
        vm.resetPassword = function (form, newPassword) {
            if (form.validate()) {
                var inputData = {
                    "token": $stateParams.token,
                    "password": newPassword
                }
                // Form is valid!
                resetService
                    .resetPassword(inputData)
                    .success(resetPasswordSuccess)
                    .catch(resetPasswordError);
                return true;
            }
        };

        function resetPasswordSuccess(){
            noty.show({
                text: $scope.getTranslation('your_password_has_been_reset'),
                type: 'success'
            });
        }

        function resetPasswordError(err){
            exception.catcher(err.data.message)(err);
        }

    }

})();
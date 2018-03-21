(function () {
    'use strict';

    angular
        .module("app.login")
        .controller("LoginController", LoginController);


    LoginController.$inject = ['$rootScope', '$scope', 'logger', '$state',  'exception', 'authService', '$location', 'noty','$window'];

    function LoginController($rootScope, $scope, logger, $state,  exception, authService, $location, noty,$window) {

        var vm = this;

        vm.isLoginPanelActive = true;
        vm.isPasswordVisible = false;
        vm.showLoginPanel = showLoginPanel;
        vm.showForgotPanel = showForgotPanel;
        vm.togglePasswordVisibility = togglePasswordVisibility;
        vm.getActiveState = getActiveState;

        $scope.validationOptions = {
            rules: {
                loginemail: {
                    required: true,
                    email: true
                },
                loginpassword: {
                    required: true,
                    minlength: 6
                }
            },
            messages: {
                loginpassword: {
                    minlength: "password must be of 6 characters."
                }
            }
        };
        $scope.validationOptionsForFp = {
            rules: {
                loginforgotemail: {
                    required: true,
                    email: true
                }
            }
        };

        vm.credentials = {
            email: "",
            password: ""
        };
        vm.login = login;

        function login(form, credentials) {
            if (form.validate()) {

               return authService
                    .login(credentials)
                    .success(loginSuccess)
                    .catch(loginError);


            }
        }


        function loginSuccess(data) {
            authService.saveToken(data.token);
            authService.isAdmin(data.is_admin);
            $location.url('/dashboard/' + data.dashboardId);
        }

        function loginError(error) {
            exception.catcher($scope.getTranslation('incorrect_username_or_password'))(error);
        }


        $scope.registerFpForm = function (form, inputData) {
            if (form.validate()) {
                authService
                    .forgotPassword(inputData)
                    .success(forgotPasswordSuccess)
                    .catch(forgotPasswordError);
                return true;
            }
        };

        function forgotPasswordSuccess(){
            noty.show({
                text: $scope.getTranslation('success_password_reset'),
                type: 'success',
                killer: true
            });
        }

        function forgotPasswordError(err){
            noty.show({
                text: err.data.message,
                type: 'error',
                killer: true
            });
        }

        function getActiveState() {
            return "login-page";
        }


        function togglePasswordVisibility() {
            vm.isPasswordVisible = !vm.isPasswordVisible;
        }

        function showLoginPanel() {
            vm.isLoginPanelActive = true;
        }

        function showForgotPanel() {
            vm.isLoginPanelActive = false;
        }
    }

})();

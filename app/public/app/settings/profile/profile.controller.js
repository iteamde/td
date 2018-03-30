(function () {

    'use strict';

    angular
        .module('app.profile')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$scope', 'profileService', 'commonService', 'TOOLTIP_MESSAGES', 'authService'];

    function ProfileController($scope, profileService, commonService, TOOLTIP_MESSAGES, authService) {

        var vm = this;

        vm.isReadMode = true;
        vm.isValid = true;
        vm.password = {
            current: '',
            new: '',
            confirm: ''
        };

        $scope.getTranslation = $scope.$parent.getTranslation;

        vm.submit = submit;
        vm.cancel = cancel;
        vm.changePassword = changePassword;
        vm.toggleReadMode = toggleReadMode;
        vm.validatePassword = validatePassword;
        vm.isLowerUpperCase = isLowerUpperCase;
        vm.isMinLength = isMinLength;
        vm.hasNumber = hasNumber;
        vm.isMatch = isMatch;
        vm.showChangePasswordModal = showChangePasswordModal;

        profileService.getUser($scope.$root.user.id)
            .then(function (user) {
                vm.user = user.data;
                vm.sourceUser = angular.copy(vm.user);
            });


        function submit(form, user) {
            if (!form.$valid) {
                commonService.notification($scope.$parent.getTranslation(TOOLTIP_MESSAGES.ERROR_NOTY), 'error');
                return false;
            }

            profileService.updateUser(user)
                .then(function (resp) {
                    if (resp.status !== 200) {
                        commonService.notification($scope.$parent.getTranslation(TOOLTIP_MESSAGES.ERROR_NOTY), 'error');
                        return false;
                    }

                    vm.sourceUser = angular.copy(vm.user);
                    commonService.notification($scope.$parent.getTranslation(TOOLTIP_MESSAGES.PROFILE_UPDATE), 'success');
                    return vm.isReadMode = !vm.isReadMode
                })
                .catch(function (err) {
                    var message = err.data || $scope.$parent.getTranslation(TOOLTIP_MESSAGES.ERROR_NOTY);
                    commonService.notification(err.data, 'error');
                });
        }

        function cancel() {
            vm.user = angular.copy(vm.sourceUser);
            toggleReadMode();
        }

        function toggleReadMode() {
            vm.isReadMode = !vm.isReadMode
        }

        function changePassword(password) {

            var details = {
                id: vm.user.user_id,
                currentPassword: password.current,
                newPassword: password.new,
                confirmNewPassword: password.confirm
            };

            authService
                .changePassword(details)
                .success(changePasswordSuccess)
                .catch(changePasswordError);

            function changePasswordSuccess(res) {
                commonService.notification($scope.getTranslation('success_password_change'), 'success');
                angular.element('#change-password-modal').modal('hide');
                password.current = password.new = password.confirm = '';
            }

            function changePasswordError(err) {
                commonService.notification(err.data, 'error');
            }
        }

        function validatePassword(pwd) {
            pwd = pwd.trim();
            vm.isValid = isMinLength(pwd) && isLowerUpperCase(pwd) && hasNumber(pwd);
        }

        function showChangePasswordModal() {
            vm.isValid = true;
            vm.password.current = vm.password.new = vm.password.confirm = '';
            angular.element('#change-password-modal').modal();
        }

        function isLowerUpperCase(pwd) {
            return pwd != pwd.toLowerCase() && pwd != pwd.toUpperCase();
        }

        function isMinLength(pwd) {
            return pwd.length > 5;
        }

        function hasNumber(pwd) {
            return pwd != pwd.replace(/[0-9]/g, '');
        }

        function isMatch(pwd, newPwd) {
            return pwd == newPwd;
        }
    }
})();

(function () {

    'use strict';

    angular
        .module('app.user')
        .controller('UserController', UserController);

    UserController.$inject = ['$scope', '$uibModal', 'userService', 'exception'];

    function UserController($scope, $uibModal, userService, exception) {
        var vm = this;

        vm.selectOptions = [
            $scope.getTranslation('activate'),
            $scope.getTranslation('deactivate'),
            $scope.getTranslation('reset_password')
        ];
        vm.currentSelect = vm.selectOptions[0];

        vm.addUser = addUser;
        vm.bulkAction = bulkAction;
        vm.showInactive = false;
        $scope.userData = [];

        activate();

        function activate() {
            userService.getUserList()
                .success(getUserListComplete)
                .catch(serviceError);
        }

        function getUserListComplete(data) {
            $scope.userData = data;
            // configGrid(data);
        }

        function serviceError(error) {
            exception.catcher('XHR Failed for login')(error);
        }

        function bulkAction(option) {
            $scope.$broadcast('bulkAction', option);
        }

        function addUser() {
            var modalInstance = $uibModal.open({
                animation: false,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/settings/user/user.modal.edit-user.view.html',
                controller: 'ModalAddUserController',
                controllerAs: 'vm',
                scope: $scope,
                resolve: { userData: function() { return $scope.userData }}
            });
        }

        function resetPassword(grid, row) {
            var email = row.entity.email;

            authService
                .forgotPassword(email)
                .success(function(res) {
                    commonService.notification($scope.getTranslation('success_password_reset'), 'success');
                })
                .catch(function(err) {
                    commonService.notification($scope.getTranslation('fail_password_reset'), 'error');
                });
        }

        function deleteuser(data) {
            userService.deleteUser(data)
                .success(deleteUserComplete)
                .catch(serviceError);
        }

        function suspenduser(data) {
            userService.suspendUser(data)
                .success(suspenduserComplete)
                .catch(serviceError);
        }

        function deleteUserComplete(data) {
            var user_id = data.user_id;
            var user_status = data.user_status;

            user_id.forEach(function(val) {
                var foundItem = _.find($scope.userData.data, {id: val});
                var index = $scope.userData.data.indexOf(foundItem );
                $scope.userData.data.splice(index, 1);
            });

            $scope.userData.total--;

            noty.show({
                text: $scope.getTranslation('user_deleted_successfully'),
                type: 'success'
            });
        }

        function suspenduserComplete(data) {
            var user_id = data.user_id;
            var user_status = data.user_status;
            user_id.forEach(function(val){
                var foundItem = $filter('filter')($scope.userData.data, { id: val  }, true)[0];
                var index = $scope.userData.data.indexOf(foundItem );
                $scope.userData.data[index].status = user_status;
            });

            noty.show({
                text: $scope.getTranslation('user_suspended_successfully'),
                type: 'success'
            });

            $scope.clearAll();
        }

        function activateUser(data) {
            userService.activateUser(data)
                .success(activateUserComplete)
                .catch(serviceError);
        }


        function activateUserComplete(data) {
            var user_id = data.user_id;
            var user_status = data.user_status;
            user_id.forEach(function(val){
                var foundItem = $filter('filter')($scope.userData.data, { id: val  }, true)[0];
                var index = $scope.userData.data.indexOf(foundItem );
                $scope.userData.data[index].status = user_status;
            });

            noty.show({
                text: $scope.getTranslation('user_activated_successfully'),
                type: 'success'
            });

            $scope.clearAll();

            $uibModal.open(modalInstance);
        }

        $scope.checkUsersSettings = function() {
            var settings = $scope.getCommonData('settings');
            console.log("settings", settings);
            return settings.site_type[0] !== 'basic' || $scope.userData.total < settings.max_ondemand_number_of_users[0];
        }
    }
})();

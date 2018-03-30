(function () {

    'use strict';

    angular
        .module('app.core')
        .controller('UsersGridController', UsersGridController);

    UsersGridController.$inject = ['$scope', 'userService', '$uibModal', 'noty'];

    function UsersGridController($scope, userService, $uibModal, noty) {

        var vm = this;
        $scope.contentInitialized = false;

        //$scope.sort = sort;
        $scope.getTranslation = $scope.$parent.getTranslation;
        $scope.editUser = editUser;
        $scope.showConfirm = showConfirm;
        $scope.resetPassword = resetPassword;
        $scope.selectUser = selectUser;
        $scope.selectAll = selectAll;
        $scope.sort = sort;
        $scope.selectedAll = false;

        $scope.sorting = {
            name: null,
            email: null
        };

        $scope.pagination = {
            page_size: 10,
            page_number: 1,
            sort_column: '',
            sort_type: ''
        };

        $scope.$on('bulkAction', function (event, action) {
            var selectedUsers = _.filter(vm.users, {selected: true});
            bulkShowConfirm(selectedUsers, action);
        });

        $scope.$watch('pagination', function () {
            if ($scope.contentInitialized)
                $scope.$emit('paginationChange', $scope.pagination);

            $scope.contentInitialized = true;
        }, true);

        function sort(field) {
            if ($scope.pagination.sort_column != field)
                $scope.sorting[field] = null;

            $scope.pagination.sort_column = field;

            $scope.pagination.sort_type = $scope.sorting[field] == 'ASC' ?
                $scope.sorting[field] = 'DESC' :
                $scope.sorting[field] == 'DESC' ?
                    $scope.sorting[field] = null :
                    $scope.sorting[field] = 'ASC';

        }

        function editUser(user) {

            var modalInstance = {
                animation: false,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/settings/user/user.modal.row-edit.view.html',
                controller: 'ModalEditUserController',
                controllerAs: 'vm',
                scope: $scope.$parent,
                resolve: { user: user }
            };

            $uibModal.open(modalInstance);
        }

        function resetPassword(user) {

            if (user.length) {
                var emails = _.map(user, 'email');
            } else {
                var emails = user.email
            }
            var success = function() {
                noty.show({
                text: $scope.getTranslation('success_password_reset'),
                type: 'success'
            })};
            var error = function() {
                noty.show({
                    text: $scope.getTranslation('fail_password_reset'),
                    type: 'error'
            })};

            userService
                .resetPassword(emails)
                .success(success)
                .catch(error);
        }

        function activateUser(data) {
            userService.activateUser(data)
                .success(activateUserComplete)
                .catch(serviceError);
        }

        function suspendUser(data) {
            userService.suspendUser(data)
                .success(suspendUserComplete)
                .catch(serviceError);
        }

        function deleteUser(data) {
            userService.deleteUser(data)
                .success(deleteUserComplete)
                .catch(serviceError);
        }

        function activateUserComplete(data) {
            setStatus(data.user_id, data.user_status);

            noty.show({
                text: $scope.getTranslation('user_activated_successfully'),
                type: 'success'
            });
        }

        function suspendUserComplete(data) {
            setStatus(data.user_id, data.user_status);

            noty.show({
                text: $scope.getTranslation('user_suspended_successfully'),
                type: 'success'
            });
        }

        function deleteUserComplete(data) {
            vm.users = _.filter(vm.users, function(user) {
                return user.id != data.user_id;
            });

            $scope.$parent.userData.total--;

            noty.show({
                text: $scope.getTranslation('user_deleted_successfully'),
                type: 'success'
            });
        }

        function showConfirm(user, del) {
            var action = del ? 'delete' : user.status == 0 ? 'activate' : 'deactivate';
            var cancelBtn = {addClass: 'btn btn-default', text: $scope.getTranslation('cancel'), onClick: function ($noty) {$noty.close()}};
            var okBtn = {
                addClass: 'btn btn-primary', text: $scope.getTranslation('ok'), onClick: function ($noty) {
                    var user_id = { user_id: user.id };
                    del ? deleteUser(user_id) : user.status == 0 ? activateUser(user_id) : suspendUser(user_id);
                    $noty.close();
                }
            };

            noty.show({
                text: $scope.getTranslation('do_you_want_to') + ' ' +
                $scope.getTranslation(action) + ' ' + $scope.getTranslation('selected_users') + '?',
                buttons: [cancelBtn, okBtn]
            });
        }

        function bulkShowConfirm(users, action) {
            console.log(action);
            var bulkAction = action == $scope.getTranslation('activate') ? 'activate' : action == $scope.getTranslation('deactivate') ? 'deactivate' : 'reset_password';
            var cancelBtn = {addClass: 'btn btn-default', text: $scope.getTranslation('cancel'), onClick: function ($noty) {$noty.close()}};
            var okBtn = {
                addClass: 'btn btn-primary', text: $scope.getTranslation('ok'), onClick: function ($noty) {
                    var user_ids = { user_id: _.map(users, 'id') };
                    action == $scope.getTranslation('activate') ? activateUser(user_ids) : action == $scope.getTranslation('deactivate') ? suspendUser(user_ids) : resetPassword(users);
                    $noty.close();
                }
            };

            noty.show({
                text: $scope.getTranslation('do_you_want_to') + ' ' +
                      $scope.getTranslation(bulkAction)+ ' ' + $scope.getTranslation('selected_users') + '?',
                buttons: [cancelBtn, okBtn]
            });
        }

        function selectUser(user) {
            user.selected = !user.selected;
        }

        function selectAll() {
            $scope.selectedAll = !$scope.selectedAll;

            _.each(vm.users, function (user) {
                if (!vm.inactive && user.status == '0') { return }
                user.selected = $scope.selectedAll;
            })
        }

        function serviceError(error) {
            exception.catcher($scope.getTranslation('xhr_failed_for_login'))(error);
        }

        function setStatus(users, status) {
            if (users.length) {
                _.each(users, function (id) {
                    var user = _.find(vm.users, {id: id});
                    user.status = status;
                })
            } else {
                var user = _.find(vm.users, {id: users});
                user.status = status;
            }
        }

    }
})();
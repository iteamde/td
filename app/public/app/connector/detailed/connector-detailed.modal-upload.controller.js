(function () {

    'use strict';

    angular
        .module('app.connector')
        .controller('ModalUploadController', ModalUploadController);

    ModalUploadController.$inject = ['$scope', 'modalUploadService', 'commonService', 'exception', '$timeout', '$rootScope'];

    function ModalUploadController($scope, modalUploadService, commonService, exception, $timeout, $rootScope) {

        var vm = this;
        vm.save = save;
        vm.isLoading = false;
        vm.progressWidth = 0;
        var progressInterval;
        vm.fileName = '';
        vm.isAdmin = $scope.$root.user.id == 1;
        vm.enableDistance = !vm.isAdmin;

        $scope.$on('fileUploadSuccess', function (e, data) {
            e.stopPropagation();
            angular.extend(vm, data);
        });

        function save() {
            vm.isLoading = true;
            vm.progressWidth = 0;
            var tick = 3000000 / vm.size;
            progressInterval = setInterval(function() {
                if (vm.progressWidth + tick < 98) {
                    vm.progressWidth += tick;
                } else {
                    clearInterval(progressInterval);
                    vm.progressWidth = 99;
                }
            }, 450);

            modalUploadService.uploadFile(vm.fileName, vm.uploadedFile, vm.isAdmin && !vm.enableDistance)
                .success(uploadSuccess)
                .catch(serviceError);
        }

        function uploadSuccess() {
            vm.progressWidth = 100;
            clearInterval(progressInterval);
            $timeout(function() {
                vm.isLoading = false;
                vm.progressWidth = 0;
            });

            commonService.notification($scope.getTranslation('all_rows_were_successfully_inserted'), 'success');
            $scope.$close();
        }

        function serviceError(res) {
            vm.isLoading = false;
            vm.progressWidth = 0;
            clearInterval(progressInterval);

            angular.element('.modal-dialog').addClass('modal-lg');

            vm.uploadErrorsCount = res.data.errors.length;
            vm.uploadErrors = _.reduce(res.data.errors, function(result, error) {
                var indexTmp = error.indexOf(']');
                var line = error.substr(1, indexTmp - 1);
                var message = error.substr(indexTmp + 1);
                result[message] = result[message] || [];
                if (line) {
                    result[message].push(line);
                }

                return result;
            }, {});

            exception.catcher('XHR Failed for Upload CSV')(error);
        }
    }
})();
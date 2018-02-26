(function () {

    'use strict';

    angular
        .module('app.connector')
        .controller('ModalUploadController', ModalUploadController);

    ModalUploadController.$inject = ['$scope', 'modalUploadService', 'commonService', 'exception'];

    function ModalUploadController($scope, modalUploadService, commonService, exception) {

        var vm = this;
        vm.save = save;
        vm.isLoading = false;

        $scope.$on('fileUploadSuccess', function (e, data) {
            e.stopPropagation();
            angular.extend(vm, data);
        });

        function save() {
            vm.isLoading = true;

            modalUploadService.uploadFile(vm.uploadedFile)
                .success(uploadSuccess)
                .catch(serviceError);
        }

        function uploadSuccess() {
            vm.isLoading = false;

            commonService.notification($scope.getTranslation('all_rows_were_successfully_inserted'), 'success');
            $scope.$close();
        }

        function serviceError(res) {
            vm.isLoading = false;

            angular.element('.modal-dialog').addClass('modal-lg');

            vm.uploadErrorsCount = res.data.errors.length;
            vm.uploadErrors = _.reduce(res.data.errors, function(result, error) {
                var indexTmp = error.indexOf(']');
                var line = error.substr(1, indexTmp - 1) || 'Errors';
                result[line] = result[line] || [];
                result[line].push(error.substr(indexTmp + 1));
                return result;
            }, {});

            exception.catcher('XHR Failed for Upload CSV')(error);
        }
    }
})();
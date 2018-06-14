(function () {

    'use strict';

    angular
        .module('app.connector')
        .controller('ModalUploadController', ModalUploadController);

    ModalUploadController.$inject = ['$scope', 'modalUploadService', 'commonService', 'exception', 'dictionary'];

    function ModalUploadController($scope, modalUploadService, commonService, exception, dictionary) {

        var vm = this;
        vm.dictionaryData = [];
        vm.save = save;
        vm.isLoading = false;
        vm.progressWidth = 0;
        var progressInterval;
        vm.fileName = '';
        vm.fileName = '';

        dictionary.forEach(function(item){
            vm.dictionaryData.push(item.name);
        })

        $scope.$on('fileUploadSuccess', function (e, data) {
            e.stopPropagation();
            var pos = data.uploadedFile.indexOf('\r');
            var getCsvData = data.uploadedFile.slice(0, pos);
            vm.csvData = getCsvData.split(',');
            angular.extend(vm, data);

        });

        function save() {
            vm.isLoading = true;
            var tick = 3000000 / vm.size;
            progressInterval = setInterval(function() {
                if (vm.progressWidth + tick < 98) {
                    vm.progressWidth += tick;
                } else {
                    clearInterval(progressInterval)
                    vm.progressWidth = 99;
                }
            }, 450);

            modalUploadService.uploadFile(vm.uploadedFile)
                .success(uploadSuccess)
                .catch(serviceError);
        }

        function uploadSuccess() {
            vm.progressWidth = 100;
            clearInterval(progressInterval);
            setTimeout(function() {
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
                var line = error.substr(1, indexTmp - 1) || 'Errors';
                result[line] = result[line] || [];
                result[line].push(error.substr(indexTmp + 1));
                return result;
            }, {});

            exception.catcher('XHR Failed for Upload CSV')(error);
        }
    }
})();
(function () {
    'use strict'

    angular.module('app.core')
        .directive('uploadCsv', uploadCsv);

    function uploadCsv() {
        return {
            restrict: 'A',
            scope: {},
            link: function ($scope, $el) {

                $el.bind('change', function (uploadEvent) {

                    var file = uploadEvent.target.files[0],
                        reader = new FileReader();

                    reader.readAsText(file);

                    reader.onload = function (e) {

                        $scope.$apply(function() {

                            var data = {
                                uploadedFile: reader.result,
                                fileName: file.name
                            };
                            $scope.$emit('fileUploadSuccess', data);
                        });
                    }
                })
            }
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('LayoutShareController', LayoutShareController);

    LayoutShareController.$inject = ['$scope','$rootScope', 'commonService', '$http', 'BASE_URL'];

    function LayoutShareController($scope, $rootScope, commonService, $http, BASE_URL) {
        var vm;
        vm = this;

        vm.shareEmails = '';
        vm.comment = '';

        vm.sendEmail = function() {
            var chartInfo = commonService.getShareChart();
            var emails = vm.shareEmails.split(',');
            if (_.some(emails, function(email) {
                return ! email.match(/^[^\@]+\@[^\@]+\.[^\@]{2,}$/g);
            })) {
                commonService.notification('Please, enter valid emails', 'warning');
                return;
            }

            $http.post(BASE_URL + 'share/send-email', {
                user: $rootScope.user.firstname + ' ' + $rootScope.user.lastname,
                emails: emails,
                subject: [chartInfo.title, chartInfo.type, 'Chart'].join(' '),
                date: chartInfo.date,
                image: chartInfo.url,
                comment: vm.comment,
                setSize: chartInfo.type === 'Metric'
            }).then(function(responce) {
                if (responce.data === 'success') {
                    angular.element('#share-modal').modal('hide');
                    vm.shareEmails = '';
                    vm.comment = '';
                    commonService.notification($scope.getTranslation('email_sent'), 'success');
                }
            });
        }

        vm.closeModal = function() {
            angular.element('#share-modal').modal('hide');
            vm.shareEmails = '';
            vm.comment = '';
        }
    }
})();
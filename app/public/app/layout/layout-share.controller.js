(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('LayoutShareController', LayoutShareController);

    LayoutShareController.$inject = ['$scope', 'commonService', '$http', 'BASE_URL'];

    function LayoutShareController($scope, commonService, $http, BASE_URL) {
        var vm;
        vm = this;

        vm.shareEmails = '';
        vm.tooMuchMails = false;
        vm.isInvalidEmail = false;

        vm.validateEmails = function(){
            vm.invalidEmail = [];
            var emails = vm.shareEmails.split(',');
            var regExp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
            emails.forEach(function(item){
                item = item.trim();
                if (!regExp.test(item)){
                    vm.invalidEmail.push(item);
                }
                vm.isInvalidEmail = (vm.invalidEmail.length > 0) ? true : false;
            });
        }

        vm.sendEmail = function() {
            var chartInfo = commonService.getShareChart();
            var emails = vm.shareEmails.split(',');
            if (emails.length > 50) {
                vm.tooMuchMails = true;
                return false;
            } else {
                vm.tooMuchMails = false;
                $http.post(BASE_URL + 'share/send-email', {
                    emails: emails,
                    subject: [chartInfo.title, chartInfo.type, 'Chart'].join(' '),
                    image: chartInfo.url
                }).then(function (responce) {
                    if (responce.data === 'success') {
                        vm.shareEmails = '';
                        commonService.notification($scope.getTranslation('email_sent'), 'success');
                    }
                });
            }
        };
    }
})();
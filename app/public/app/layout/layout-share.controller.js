(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('LayoutShareController', LayoutShareController);

    LayoutShareController.$inject = ['commonService', '$http', 'BASE_URL'];

    function LayoutShareController(commonService, $http, BASE_URL) {
        var vm;
        vm = this;

        vm.shareEmails = '';

        vm.sendEmail = function() {
            var chartInfo = commonService.getShareChart();
            var emails = vm.shareEmails.split(',');
            $http.post(BASE_URL + 'share/send-email', {
                emails: emails,
                subject: [chartInfo.title, chartInfo.type, 'Chart'].join(' '),
                image: chartInfo.url
            }).then(function(responce) {
                if (responce.data === 'success') {
                    vm.shareEmails = '';
                    commonService.notification('Emails has been sent.', 'success');
                }
            });
        }
    }
})();
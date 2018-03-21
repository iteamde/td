(function() {
    'use strict';

    angular
        .module('blocks.logger')
        .factory('logger', logger);

    logger.$inject = ['$log', 'toastr', 'noty'];

    function logger($log, toastr, noty) {
        var service = {
            showToasts: true,

            error   : error,
            info    : info,
            success : success,
            warning : warning,

            // straight to console; bypass toastr
            log     : $log.log
        };

        return service;
        /////////////////////

        function error(message, data, title) {
            noty.show({
                text: message,
                layout: 'bottomRight',
                type: 'error',
                killer: true
            });
            $log.error(message, data);
        }

        function info(message, data, title) {
            noty.show({
                text: message,
                layout: 'bottomRight',
                type: 'information',
                killer: true
            });
            $log.info(message, data);

        }

        function success(message, data, title) {
            noty.show({
                text: message,
                layout: 'bottomRight',
                type: 'success',
                killer: true
            });
            $log.info(message, data);
        }

        function warning(message, data, title) {
            noty.show({
                text: message,
                layout: 'bottomRight',
                type: 'warning',
                killer: true
            });
            $log.warn(message, data);
        }
    }
}());

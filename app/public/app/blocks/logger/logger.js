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
                type: 'error'
            });
            $log.error(message, data);
        }

        function info(message, data, title) {
            noty.show({
                text: message,
                layout: 'bottomRight',
                type: 'information'
            });
            $log.info(message, data);

        }

        function success(message, data, title) {
            noty.show({
                text: message,
                layout: 'bottomRight',
                type: 'success'
            });
            $log.info(message, data);
        }

        function warning(message, data, title) {
            noty.show({
                text: message,
                layout: 'bottomRight',
                type: 'warning'
            });
            $log.warn(message, data);
        }
    }
}());

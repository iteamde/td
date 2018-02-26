(function (angular, $) {
    'use strict';
    return angular.module('notyModule', []).provider('noty', function () {
        var provider = {
            settings: {},
            $get: function () {
                var callNoty = function (newSettings) {
                    return noty(angular.extend({}, provider.settings, newSettings));
                };


                var callPlainNoty = function (opts) {
                    return noty(opts);
                };


                return {
                    show: function (opts) {
                        callPlainNoty(angular.extend({}, provider.settings, opts));
                    },
                    showMsg: function (message, type) {
                        callNoty({text: message || provider.settings.text, type: type || provider.settings.type});
                    },

                    showAlert: function (message) {
                        callNoty({text: message || provider.settings.text, type: "warning"});
                    },

                    showSuccess: function (message) {
                        callNoty({text: message || provider.settings.text, type: "success"});
                    },

                    showError: function (message) {
                        callNoty({text: message || provider.settings.text, type: "error"});
                    },

                    closeAll: function () {
                        return $.noty.closeAll()
                    },
                    clearShowQueue: function () {
                        return $.noty.clearQueue();
                    }.bind(this)
                }
            }

        };
        return provider;
    })
}(angular, jQuery));
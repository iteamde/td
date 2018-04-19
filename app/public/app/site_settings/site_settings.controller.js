(function () {

    'use strict';

    angular
        .module('app.user')
        .controller('SiteSettingsController', SiteSettingsController);

    SiteSettingsController.$inject = ['$scope', '$state'];

    function SiteSettingsController($scope, $state) {
        var vm = this;
        vm.activeSetting = $state.current.name;
        
        vm.settingsList = {
            'layout.site_settings': '---' ,
            'layout.site_settings.default_chart_view': 'Default Chart Views'
        };

        vm.changeSetting = function(setting) {
            $state.go(setting);
        }
    }
})();

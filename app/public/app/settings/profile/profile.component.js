(function () {

    'use strict';

    angular
        .module('app.profile')
        .component('profile', {
            templateUrl: 'app/settings/profile/profile.view.html',
            controller: 'ProfileController as vm'
        });

})();
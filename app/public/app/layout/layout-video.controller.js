(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('LayoutVideoController', LayoutVideoController);

    LayoutVideoController.$inject = ['videoService'];

    function LayoutVideoController(videoService) {
        var vm;
        vm = this;
    }
})();
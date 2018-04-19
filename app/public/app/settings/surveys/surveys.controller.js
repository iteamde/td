(function () {

    'use strict';

    angular
        .module('app.surveys')
        .controller('SurveysController', SurveysController);

    SurveysController.$inject = ['$scope'];

    function SurveysController($scope) {

        var vm = this;

        vm.recipient = 'All Employees';
        vm.recipients = ['All Employees', 'Entry', 'Intermediate', 'Senior', 'Lead', 'Manager', 'Director', 'Executive'];

        vm.questions = [
            {name: 'Do you like being Remote Employee?'},
            {name: 'Do you consider yourself underpaid'},
            {name: 'Does your workload make your consider leaving?'},
            {name: 'Are the new hires qualified?'}
        ]

    }

})();
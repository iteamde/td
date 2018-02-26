(function () {

    'use strict';

    angular
        .module('app.nlpSearch')
        .component('nlpSearch', {
            templateUrl: 'app/nlp_search/nlp-search.view.html',
            controller: 'NlpSearchController as vm'
        });

})();
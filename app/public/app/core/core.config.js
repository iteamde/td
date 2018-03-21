(function () {
    'use strict';

    var core = angular.module('app.core');

    var config = {
        appErrorPrefix: '[NG-Modular Error] ', //Configure the exceptionHandler decorator
        mode: "Prod",
        appTitle: 'Angular Modular Demo',
        version: '1.0.0'
    };

    core.value('config', config);
    core.config(configure);
    core.config(translateConfigure);
    core.config(tmhDynamicLocaleConfigure);
    core.config(validationConfigure);
    core.config(notyConfigure);
    core.controller('CommonController', ['$scope', '$rootScope', 'BASE_URL', '$http', function ($scope, $rootScope, BASE_URL, $http) {
        /**
         * @type {Object}
         */
        $scope.translations = {};

        $scope.isSidebarOpen = false;

        $rootScope.$on('sidebar-toggle-menu', function () {
            $scope.isSidebarOpen = !$scope.isSidebarOpen;
        });

        /**
         * @type {Object}
         */
        $scope.commonData = {};

        /**
         * @param token
         * @returns {*}
         */
        $scope.getTranslation = function (token) {
            return undefined === $scope.translations[token] ? '{{' + token + '}}' : $scope.translations[token];
        };

        /**
         * @param property
         */
        $scope.getCommonData = function (property) {
            if (property) {
                return undefined === $scope.commonData[property] ? '' : $scope.commonData[property];
            }
            return $scope.commonData;
        };

        // Load common data
        $http.get(BASE_URL + 'common/load-common-data/1')
            .success(function (data) {
                $scope.commonData = data;
                $scope.translations = data.translations;
            });
    }]);

    core.run(appRun);

    appRun.$inject = ['$rootScope', '$state', '$stateParams', '$window', '$localStorage', '$location', 'authService', 'pageService'];

    // pass $state to rootscope to access them anywhere in app
    // https://github.com/angular-ui/ui-router/wiki/quick-reference#statecurrent
    // put it here on top otherwise it stops working
    function appRun($rootScope, $state, $stateParams, $window, $localStorage, $location, authService, pageService) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.isAdmin = $localStorage.isAdmin;

        $rootScope.goBack = goBack;

        function goBack() {
            $window.history.back();
        }

        $rootScope.$on('$locationChangeSuccess',function(event, toState, fromState) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;

            var data = { from: fromState, to: toState };
            pageService.sendPages(data);
        });

        $rootScope.$on('$locationChangeStart', function (event, next, current, auth) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/', '', '/login']) === -1;

            var user = authService.currentUser();
            $rootScope.user = user;

            if (restrictedPage && !user || !$location.path()) {
                if($location.path().substring(1, 6) == 'reset'){
                } else{
                    $location.path('/login');
                }
            }
        });
    }

    configure.$inject = ['$logProvider', '$locationProvider', 'exceptionHandlerProvider', '$httpProvider', 'BASE_URL'];

    /* @ngInject */
    function configure($logProvider, $locationProvider, /*routehelperConfigProvider,*/ exceptionHandlerProvider, $httpProvider, BASE_URL) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }

        // Configure the common route provider
        //routehelperConfigProvider.config.$routeProvider = $routeProvider;
        //routehelperConfigProvider.config.docTitle = 'NG-Modular: ';
        //var resolveAlways = { /* @ngInject */
        //    ready: function(dataservice) {
        //        return dataservice.ready();
        //    }
        //    // ready: ['dataservice', function (dataservice) {
        //    //    return dataservice.ready();
        //    // }]
        //};
        //routehelperConfigProvider.config.resolveAlways = resolveAlways;

        // Configure the common exception handler
        exceptionHandlerProvider.configure(config.appErrorPrefix);


        //prettyURL: check browser support
        // if(window.history && window.history.pushState){
        //     //$locationProvider.html5Mode(true); will cause an error $location in HTML5 mode requires a  tag to be present! Unless you set baseUrl tag after head tag like so: <head> <base href="/">
        //
        //     // to know more about setting base URL visit: https://docs.angularjs.org/error/$location/nobase
        //
        //     // if you don't wish to set base URL then use this
        //     $locationProvider.html5Mode({
        //         enabled: true,
        //         // requireBase: false
        //     });
        // }


        // token and error handling
        $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};

                    if ($localStorage.trentoken) {
                        config.headers.Authorization = /*'Bearer ' + */$localStorage.trentoken;
                    }
                    return config;
                },
                'responseError': function (response) {
                    if (response.status === 401 || response.status === 403) {
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            };
        }]);
    }

    translateConfigure.$inject = ['$translateProvider', 'LOCALES'];

    // Angular Translate
    function translateConfigure($translateProvider, /*DEBUG_MODE,*/ LOCALES) {
        //if (DEBUG_MODE) {
        //    $translateProvider.useMissingTranslationHandlerLog();// warns about missing translates
        //}

        $translateProvider.useStaticFilesLoader({
            prefix: 'content/lang/locale-',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage(LOCALES.preferredLocale);
        $translateProvider.useLocalStorage();
    }

    tmhDynamicLocaleConfigure.$inject = ['tmhDynamicLocaleProvider'];

    // Angular Dynamic Locale
    function tmhDynamicLocaleConfigure(tmhDynamicLocaleProvider) {
        tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
    }

    validationConfigure.$inject = ['$validatorProvider'];

    // Validation Setups
    function validationConfigure($validatorProvider) {
        // strict email validation
        $validatorProvider.addMethod("email", function (value, element) {
                return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
            }
        );
        /*$.validator.addMethod("CompleteUSPhone", function (value, element) {
         //console.log(2222, $(element).inputmask("isComplete"), ($(element).val() !== ""), ($(element).inputmask("isComplete") && ($(element).val() !== "")));
         if ($(element).val() === "") {
         return true;
         }

         return $(element).inputmask("isComplete");
         }, "Please enter valid phone number");

         $.validator.addMethod("soloSpacesNotAllowed", function (value, element) {
         return $.trim(value) !== "";
         }, "This field is required.");*/

    }

    notyConfigure.$inject = ['notyProvider'];

    // noty configuration
    function notyConfigure(notyProvider) {
        notyProvider.settings = {
            theme: 'relax',
            //text: 'Custom default message',
            layout: 'topRight',
            force: true,
            easing: 'swing',
            timeout: 5000,
//            animation: {
//                open: 'animated  fadeInUp',
//                close: 'animated fadeOutDown',
//                easing: 'swing'
//            }
        };
    }
})();

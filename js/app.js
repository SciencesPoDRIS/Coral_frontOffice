(function() {
    'use strict';

    var app = angular.module('eResources', [
        'ngMaterial',
        'ngRoute',
        'pascalprecht.translate',
        'elasticsearch',
        'elasticui',
        'eResources.filters',
        'eResources.welcome'
    ]);

    // Set to my local cluster address
    app.constant('euiHost', 'http://localhost:9200/coral');

    app.config(function($translateProvider) {
        // Enable localStorage to save on bandwidth and loading costs
        // $translateProvider.useLocalStorage();
        // Add internationalization by downloading static files
        $translateProvider.useStaticFilesLoader({
            prefix: 'languages/',
            suffix: '.json'
        });
        // Default language is french
        $translateProvider.preferredLanguage('fr');
        $translateProvider.useSanitizeValueStrategy('escape');
    });

    // Add new routes
    app.config(['$routeProvider', '$locationProvider', 
        function($routeProvider, $locationProvider) {
            $routeProvider.
            // Welcome Page
            when('/', {
                templateUrl: 'views/welcome.html',
                controller: 'WelcomeController'
            }).
            otherwise({
                redirectTo: '/'
            });;
        }
    ]);

})();
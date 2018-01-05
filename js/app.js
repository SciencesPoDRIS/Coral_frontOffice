'use strict';

var app = angular.module('eResources', [
    'ngMaterial',
    'ngRoute',
    'pascalprecht.translate',
    'elasticsearch',
    'elasticui',
    'angulartics',
    'angulartics.google.analytics',
    'eResources.config',
    'eResources.directives',
    'eResources.filters',
    'eResources.resource',
    'eResources.resources',
    'eResources.services',
    'eResources.subjects',
    'eResources.welcome'
]);

// Localization configuration
app.config(['$translateProvider',
    function($translateProvider) {
        // Enable localStorage to save on bandwidth and loading costs
        // $translateProvider.useLocalStorage();
        // Add internationalization by downloading static files
        $translateProvider.useStaticFilesLoader({
            prefix: 'dist/languages/',
            suffix: '.json'
        });
        // Default language is French
        $translateProvider
            .preferredLanguage('fr')
            .fallbackLanguage('fr')
            .useSanitizeValueStrategy(null);
    }
]);

// Routes configuration
app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.
        // Welcome Page
        when('/', {
            templateUrl: 'views/welcome.html',
            controller: 'WelcomeController'
        }).
        // Subjects page
        when('/subjects', {
            templateUrl: 'views/subjects.html',
            controller: 'SubjectsController'
        }).
        // Resources page
        when('/resources', {
            templateUrl: 'views/resources.html',
            controller: 'ResourcesController'
        }).
        when('/resource/:resourceId', {
            templateUrl: 'views/resource.html',
            controller: 'ResourceController'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

app.config(['$mdThemingProvider',
    function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('grey')
            .accentPalette('red');
    }
]);

app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}]);

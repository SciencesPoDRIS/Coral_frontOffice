(function() {
    'use strict';

    /**
     * Create the module. Set it up to use html5 mode.
     */
    var app = angular.module('eResources', [
            'ngMaterial',
            'pascalprecht.translate',
            'elasticsearch',
            'elasticui'
        ],
        ['$locationProvider', function($locationProvider) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        }]
    );

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

    app.controller('eresourcesCtrl', ['$scope', '$translate', function($scope, $translate) {
        // Language switcher
        $scope.languageLabel = 'LANGUAGE_EN';
        $scope.changeLanguage = function() {
            switch($translate.use()) {
                case 'fr' :
                    $scope.languageLabel = 'LANGUAGE_FR';
                    $translate.use('en');
                    break;
                case 'en' :
                    $scope.languageLabel = 'LANGUAGE_EN';
                    $translate.use('fr');
                    break;
                default:
                    break;
            }
        };
    }]);

})();
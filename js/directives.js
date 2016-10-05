(function() {
    'use strict';

    /* Directives */

    var app = angular.module('eResources.directives', []);

    app.directive('languageSwitcher', ['$translate', function($translate) {
        return {
            restrict: 'E',
            templateUrl: 'partials/languageSwitcher.html',
            scope : {},
            link: function($scope) {
                // Language switcher
                $scope.languageLabel = 'LANGUAGE_EN';
                $scope.changeLanguage = function() {
                    switch ($translate.use()) {
                        case 'fr':
                            $scope.languageLabel = 'LANGUAGE_FR';
                            $translate.use('en');
                            break;
                        case 'en':
                            $scope.languageLabel = 'LANGUAGE_EN';
                            $translate.use('fr');
                            break;
                        default:
                            break;
                    }
                };
            }
        }
    }]);

})();
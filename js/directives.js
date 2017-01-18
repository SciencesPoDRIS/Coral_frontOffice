(function() {
    'use strict';

    /* Directives */

    var app = angular.module('eResources.directives', []);

    app.directive('myLanguageSwitcher', ['$translate', function($translate) {
        return {
            restrict: 'E',
            templateUrl: 'partials/myLanguageSwitcher.html',
            link: function($scope) {
                // Language switcher
                $scope.languageLabel = 'LANGUAGE_EN';
                $scope.currentLanguage = 'fr';
                $scope.dateFormat = 'dd/MM/yyyy';
                $scope.changeLanguage = function() {
                    switch ($translate.use()) {
                        case 'fr':
                            $scope.languageLabel = 'LANGUAGE_FR';
                            $scope.currentLanguage = 'en';
                            $scope.dateFormat = 'MM/dd/yyyy';
                            $translate.use('en');
                            break;
                        case 'en':
                            $scope.languageLabel = 'LANGUAGE_EN';
                            $scope.currentLanguage = 'fr';
                            $scope.dateFormat = 'dd/MM/yyyy';
                            $translate.use('fr');
                            break;
                        default:
                            break;
                    }
                };
            }
        }
    }]);

    app.directive('myResourceCard', ['$translate', function($translate) {
        return {
            restrict: 'E',
            templateUrl: 'partials/myResourceCard.html',
            scope: {
                resource: '='
            },
            link: function($scope) {
                // Add a listener on the current language to translate resource title and description
                $scope.$watch('$parent.currentLanguage', function(lang) {
                    switch (lang) {
                        case 'fr':
                            $scope.resourceTitle = $scope.resource._source.title_fr;
                            $scope.resourceDescription = $scope.resource._source.description_fr;
                            break;
                        case 'en':
                            $scope.resourceTitle = $scope.resource._source.title_en;
                            $scope.resourceDescription = $scope.resource._source.description_en;
                            break;
                        default:
                            break;
                    }
                });
            }
        }
    }]);

    // The tiles sticked on right side
    app.directive('mySideTiles', [function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/mySideTiles.html'
        }
    }]);

    app.directive('mySearchBar', ['addFilterToUrl', function(addFilterToUrl) {
        return {
            restrict: 'E',
            templateUrl: 'partials/mySearchBar.html',
            scope: {},
            link: function($scope) {
                $scope.search = function() {
                    // If the searched term is not empty, add searched term to the url
                    if ($scope.query && ($scope.query != '')) {
                        addFilterToUrl('query', $scope.query);
                    }
                }
            }
        }
    }]);

})();
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
                $scope.changeLanguage = function() {
                    switch ($translate.use()) {
                        case 'fr':
                            $scope.languageLabel = 'LANGUAGE_FR';
                            $scope.currentLanguage = 'en';
                            $translate.use('en');
                            break;
                        case 'en':
                            $scope.languageLabel = 'LANGUAGE_EN';
                            $scope.currentLanguage = 'en';
                            $translate.use('fr');
                            break;
                        default:
                            break;
                    }
                };
            }
        }
    }]);

    app.directive('mySearchBar', [function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/mySearchBar.html',
            scope: {
                query: '='
            },
            link: function($scope) {
                $scope.search = function() {
                    // If the searched term is not empty, add searched term to the url
                    if ($scope.query && ($scope.query != '')) {
                        $scope.$parent.addFilterToUrl('query', $scope.query);
                    }
                }
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
                $scope.$watch(function() {
                    return $translate.use();
                }, function() {
                    switch ($translate.use()) {
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

    app.directive('myResourceHighlighted', [function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/myResourceHighlighted.html'
        }
    }]);

})();
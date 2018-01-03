/* Directives */

'use strict';

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

app.directive('myResourceCard', ['$translate', 'es', '$timeout', function($translate, es, $timeout) {
    return {
        restrict: 'E',
        templateUrl: 'partials/myResourceCard.html',
        scope: {
            resource: '='
        },
        link: function($scope) {
            $timeout(function() {
                es.client.search({
                    index: 'downtime',
                    size: 1000,
                    body: ejs.Request()
                        .query(ejs.MatchAllQuery())
                        .filter(
                            ejs.AndFilter([
                                ejs.TermsFilter('entityid', $scope.resource._id),
                                ejs.RangeFilter('startdate').lte('now'),
                                ejs.RangeFilter('enddate').gte('now')
                            ]))
                }, function(error, response) {
                    if(typeof error === 'undefined') {
                        $scope.count = response.hits.hits.length;
                    } else {
                        $scope.count = 0;
                        console.log(error);
                    }
                });
            }, 0);

            // Add a listener on the current language to translate resource title and description
            // Default language is French
            $scope.$watch('$parent.currentLanguage', function(lang) {
                switch (lang) {
                    case 'en' :
                        $scope.resourceTitle = $scope.resource._source.title_en;
                        $scope.resourceDescription = $scope.resource._source.description_en;
                        break;
                    case 'fr' :
                    default :
                        $scope.resourceTitle = $scope.resource._source.title_fr;
                        $scope.resourceDescription = $scope.resource._source.description_fr;
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

app.directive('mySearchBar', ['addFilterToUrl', 'removeFilterFromUrl', function(addFilterToUrl, removeFilterFromUrl) {
    return {
        restrict: 'E',
        templateUrl: 'partials/mySearchBar.html',
        scope: {},
        link: function($scope) {
            $scope.search = function() {
                // If the searched term is empty, remove searched term from the url
                if ($scope.query == '') {
                    removeFilterFromUrl('query', null);
                // If the searched term is not empty, add searched term to the url
                } else {
                    addFilterToUrl('query', $scope.query);
                }
            }
        }
    }
}]);

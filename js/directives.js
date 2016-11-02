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
                $scope.changeLanguage = function() {
                    switch ($translate.use()) {
                        case 'fr' :
                            $scope.languageLabel = 'LANGUAGE_FR';
                            $translate.use('en');
                            break;
                        case 'en' :
                            $scope.languageLabel = 'LANGUAGE_EN';
                            $translate.use('fr');
                            break;
                        default :
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
                    // Execute the query if the searched term is not empty
                    if($scope.query && ($scope.query != '') ) {
                        // Set "All" tab as active
                        $scope.$parent.selectedTab = 2;
                        $scope.$parent.indexVM.query = ejs.BoolQuery().should(ejs.QueryStringQuery(['title_en', 'title_fr', 'description_en', 'description_fr', 'alias']).query('*' + $scope.query + '*'));
                    }
                }
                $scope.$watch('query', $scope.search());
            }
        }
    }]);

    app.directive('myResourceCard', ['$translate', function($translate) {
        return {
            restrict: 'E',
            templateUrl: 'partials/myResourceCard.html',
            scope : {
                resource : '='
            },
            link: function($scope) {
                switch ($translate.use()) {
                    case 'fr' :
                        $scope.resourceTitle = $scope.resource._source.title_fr;
                        $scope.resourceDescription = $scope.resource._source.description_fr;
                        break;
                    case 'en' :
                        $scope.resourceTitle = $scope.resource._source.title_en;
                        $scope.resourceDescription = $scope.resource._source.description_en;
                        break;
                    default :
                        break;
                }
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
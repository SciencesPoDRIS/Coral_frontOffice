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

    app.directive('mySearchBar', [function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/mySearchBar.html',
            scope : {},
            link: function($scope) {
                $scope.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

                $scope.filterByLetter = function() {
                    if($(this)[0].hasOwnProperty('letter')) {
                        $scope.$parent.$parent.indexVM.query = ejs.MatchQuery('title_fr', $(this)[0].letter).type('phrase_prefix');
                    } else {
                        $scope.$parent.$parent.indexVM.query = ejs.MatchAllQuery();
                    }
                }
            }
        }
    }]);

})();
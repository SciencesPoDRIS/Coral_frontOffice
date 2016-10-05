(function() {
    'use strict';

    var app = angular.module('eResources.welcome', []);

    app.controller('WelcomeController', ['$scope', '$translate',
        function($scope, $translate) {
            $scope.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

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

            $scope.filterByLetter = function() {
                $scope.indexVM.query = ejs.MatchQuery('title_fr', $(this)[0].letter).type('phrase_prefix');
            }
        }
    ]);

})();
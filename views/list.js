(function() {
    'use strict';

    var app = angular.module('eResources.list', []);

    app.controller('ListController', ['$scope',
        function($scope) {
            $scope.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

            $scope.filterByLetter = function() {
                if($(this)[0].hasOwnProperty('letter')) {
                    $scope.indexVM.query = ejs.MatchQuery('title_fr', $(this)[0].letter).type('phrase_prefix');
                } else {
                    $scope.indexVM.query = ejs.MatchAllQuery();
                }
            }
        }
    ]);

})();
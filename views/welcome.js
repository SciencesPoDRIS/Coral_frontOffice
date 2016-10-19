(function() {
    'use strict';

    var app = angular.module('eResources.welcome', []);

    app.controller('WelcomeController', ['$scope', 'es',
        function($scope, es) {
            // Get all highlighted resources order by title
            es.client.search({
                index: 'resource',
                body: ejs.Request()
                    .query(ejs.MatchQuery('highlight', '1'))
                    .sort(ejs.Sort('title_fr').order('asc'))
            }, function(error, response) {
                $scope.highlighted = response.hits.hits;
            });

            // Get all resources 'in trial' order by title
            es.client.search({
                index: 'resource',
                body: ejs.Request()
                    .query(ejs.MatchQuery('status', 'trial'))
                    .sort(ejs.Sort('title_fr').order('asc'))
            }, function(error, response) {
                $scope.trial = response.hits.hits;
            });

            // Get all 'new' resources order by title
            es.client.search({
                index: 'resource',
                body: ejs.Request()
                    .query(ejs.MatchQuery('status', 'new'))
                    .sort(ejs.Sort('title_fr').order('asc'))
            }, function(error, response) {
                $scope.new = response.hits.hits;
            });

            // Get all subjects
            es.client.search({
                    index: 'resource',
                    size: 1000,
                    body: ejs.Request()
                        .agg(ejs.TermsAggregation('subjects')
                            .field('subjects')
                            .size(0))
                },
                function(error, response) {
                    $scope.subjects = response.aggregations.subjects.buckets;
                });

            $scope.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

            $scope.filterByLetter = function() {
                if ($(this)[0].hasOwnProperty('letter')) {
                    $scope.$parent.indexVM.query = ejs.MatchQuery('title_fr', $(this)[0].letter).type('phrase_prefix');
                } else {
                    // Reset query term
                    $scope.query = '';
                    $scope.$parent.indexVM.query = ejs.MatchAllQuery();
                }
            }
        }
    ]);

})();
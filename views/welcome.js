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
            }, function (error, response) {
                $scope.highlighted = response.hits.hits;
            });

            // Get all resources 'in trial' order by title
            es.client.search({
                index: 'resource',
                body: ejs.Request()
                    .query(ejs.MatchQuery('status', 'trial'))
                    .sort(ejs.Sort('title_fr').order('asc'))
            }, function (error, response) {
                $scope.trial = response.hits.hits;
            });

            // Get all 'new' resources order by title
            es.client.search({
                index: 'resource',
                body: ejs.Request()
                    .query(ejs.MatchQuery('status', 'new'))
                    .sort(ejs.Sort('title_fr').order('asc'))
            }, function (error, response) {
                $scope.new = response.hits.hits;
            });
        }
    ]);

})();
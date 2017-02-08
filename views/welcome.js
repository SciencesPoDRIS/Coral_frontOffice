var app = angular.module('eResources.welcome', ['ngSanitize']);

app.controller('WelcomeController', ['$scope', 'es',
    function($scope, es) {
        // Set selected tab
        $scope.$parent.selectedTab = 'welcome';

        // Get all resources 'highlight' order by title
        es.client.search({
            index: 'resource',
            body: ejs.Request()
                .query(ejs.MatchQuery('status', 'highlight'))
                .sort(ejs.Sort('title_fr_notanalyzed').asc())
        }, function(error, response) {
            $scope.highlighted = response.hits.hits;
        });

        // Get all resources 'in trial' order by title
        es.client.search({
            index: 'resource',
            body: ejs.Request()
                .query(ejs.MatchQuery('status', 'trial'))
                .sort(ejs.Sort('title_fr_notanalyzed').asc())
        }, function(error, response) {
            $scope.trial = response.hits.hits;
        });

        // Get all 'new' resources order by title
        es.client.search({
            index: 'resource',
            body: ejs.Request()
                .query(ejs.MatchQuery('status', 'new'))
                .sort(ejs.Sort('title_fr_notanalyzed').asc())
        }, function(error, response) {
            $scope.new = response.hits.hits;
        });

    }
]);
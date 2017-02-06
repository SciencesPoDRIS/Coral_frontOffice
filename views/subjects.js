var app = angular.module('eResources.subjects', []);

app.controller('SubjectsController', ['$scope', 'es',
    function($scope, es) {
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
    }
]);
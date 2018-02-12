'use strict';

var app = angular.module('eResources.resource', []);

app.controller('ResourceController', ['$scope', '$translate', '$routeParams', 'es', 'store',
    function($scope, $translate, $routeParams, es, store) {
        // Set selected tab
        $scope.$parent.selectedTab = 'resource';

        // Get information about this resource
        $scope.indexVM.query = ejs.MatchQuery('resourceid', $routeParams.resourceId);

        // Get previousUrl through store service
        $scope.previousUrl = (typeof store.get('previousUrl') == 'undefined' ? '#/resources' : store.get('previousUrl'));

        $scope.init = function() {
            // Scroll to the top of the page
            $(document).scrollTop(0);
            es.client.search({
                index: 'downtime',
                size: 1000,
                body: ejs.Request()
                    .query(ejs.MatchAllQuery())
                    .filter(ejs.TermsFilter('entityid', $routeParams.resourceId))
            },
            function(error, response) {
                $scope.downtimes = [];
                response.hits.hits.map(function(obj, index) {
                    // Translate startdate attribute into timestamp
                    obj._source.starttimestamp = new Date(obj._source.startdate.split('T')[0]).getTime();
                    // Translate enddate attribute into timestamp
                    obj._source.endtimestamp = new Date(obj._source.enddate.split('T')[0]).getTime();
                    // If the downtime is currently valid, add it to the scope
                    if((obj._source.starttimestamp < Date.now()) && (Date.now() < obj._source.endtimestamp)) {
                        $scope.downtimes.push(obj);
                    }
                });
            });
        };
        $scope.$watch('indexVM.results.hits.hits', function() {
            if($scope.indexVM && $scope.indexVM.results && $scope.indexVM.results.hits && $scope.indexVM.results.hits.hits) {
                $scope.tutos = [];
                $scope.indexVM.results.hits.hits[0]._source.tutosrank.forEach(function(rank, index) {
                    $scope.tutos.push({
                        "rank" : $scope.indexVM.results.hits.hits[0]._source.tutosrank[index],
                        "name" : $scope.indexVM.results.hits.hits[0]._source.tutosname[index],
                        "url" : $scope.indexVM.results.hits.hits[0]._source.tutosurl[index]
                    });
                });
            }
        }, true);
        $scope.init();
    }
]);

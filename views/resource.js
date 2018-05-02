(function() {

// views/resource.js

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

        var getTimestamp = function(date) {
            var year = parseInt(date.split("T")[0].split("-")[0]);
            var month = parseInt(date.split("T")[0].split("-")[1]);
            var day = parseInt(date.split("T")[0].split("-")[2]);
            var hour = parseInt(date.split("T")[1].split(":")[0]);
            var minute = parseInt(date.split("T")[1].split(":")[1]);
            var second = parseInt(date.split("T")[1].split(":")[2].split(".")[0]);
            var millisecond = parseInt(date.split("T")[1].split(":")[2].split(".")[1].replace('Z', ''));
            return new Date(year, month - 1, day, hour, minute, second, millisecond).getTime();
        }

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
                    obj._source.starttimestamp = getTimestamp(obj._source.startdate);
                    // Translate enddate attribute into timestamp
                    obj._source.endtimestamp = getTimestamp(obj._source.enddate);
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

})();

(function() {
    'use strict';

    /**
     * Create the module. Set it up to use html5 mode.
     */
    var app = angular.module('eResources', ['elasticsearch', 'ngMaterial', 'elasticui'], ['$locationProvider', function($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);

    // Set to my local cluster address
    app.constant('euiHost', 'http://localhost:9200/coral');

    /**
     * Create a service to power calls to Elasticsearch. We only need to
     * use the _search endpoint.
     */
    /*
    app.factory('eresourcesService', ['$q', 'esFactory', '$location', function($q, elasticsearch, $location) {
        var client = elasticsearch({
            host: $location.host() + ":9200"
        });

        /**
         * Given a term and an offset, load another round of 10 results.
         *
         * Returns a promise.
         */
        /*
        var search = function(term, offset) {
            var deferred = $q.defer();
            var query = {
                // Get all the resources containing term in any field
                "match": {
                    "_all": term
                }
                // Get all the resources containing "cairn" in "titletext" field
                // "match": {
                //     "titletext": "cairn"
                // }
                // Get all the resources containing "cairn" in "titletext" field AND "collection" in "descriptiontext"
                // "bool" : {
                //     "must" : [
                //         { "match" : { "titletext" : "cairn" }},
                //         { "match" : { "descriptiontext" : "collection" }}
                //     ]
                // }
                // Get all the resources whose "titletext" field starts with "A"
                // "match_phrase_prefix" :{
                //     "titletext" : "A"
                // }
            };

            client.search({
                "index": 'coral',
                "type": 'resource',
                "body": {
                    "size": 10,
                    "from": (offset || 0) * 10,
                    "query": query
                }
            }).then(function(result) {
                var ii = 0,
                    hits_in, hits_out = [];
                hits_in = (result.hits || {}).hits || [];
                for (; ii < hits_in.length; ii++) {
                    hits_out.push(hits_in[ii]._source);
                }
                deferred.resolve(hits_out);
            }, deferred.reject);

            return deferred.promise;
        };

        return {
            "search": search
        };
    }]);

    /**
     * Create a controller to interact with the UI.
     */
    /*
    app.controller('eresourcesCtrl', ['eresourcesService', '$scope', '$location', function(eresourcesService, $scope, $location) {
        // Initialize the scope defaults.
        $scope.results = []; // An array of results to display
        $scope.page = 0; // A counter to keep track of our current page
        $scope.allResults = false; // Whether or not all results have been found.

        // And, a random search term to start if none was present on page load.
        $scope.searchTerm = $location.search().q || '';

        /**
         * A fresh search. Reset the scope variables to their defaults, set
         * the q query parameter, and load more results.
         */
        /*
        $scope.search = function() {
            $scope.page = 0;
            $scope.results = [];
            $scope.allResults = false;
            $location.search({ 'q': $scope.searchTerm });
            $scope.loadMore();
        };

        /**
         * Load the next page of results, incrementing the page counter.
         * When query is finished, push results onto $scope.results and decide
         * whether all results have been returned (i.e. were 10 results returned?)
         */
        /*
        $scope.loadMore = function() {
            eresourcesService.search($scope.searchTerm, $scope.page++).then(function(r) {
                var results = $.map(r, function(result) {
                    return { logo: result.logo, title : result.titletext, description : result.descriptiontext, url : result.resourceurl }
                });

                if (results.length !== 10) {
                    $scope.allResults = true;
                }

                var ii = 0;
                for (; ii < results.length; ii++) {
                    $scope.results.push(results[ii]);
                }
            });
        };

        // Load results on first run
        $scope.loadMore();
    }]);
    */

    app.controller('eresourcesCtrl', ['$scope', function($scope) {
        // console.log('eresourcesCtrl');
        // console.log($scope.indexVM.results.hits.total);
    }]);

})();
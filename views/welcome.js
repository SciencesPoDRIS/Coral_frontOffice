(function() {
    'use strict';

    var app = angular.module('eResources.welcome', ['ngSanitize']);

    app.controller('WelcomeController', ['$scope', 'es', '$routeParams', '$filter', '$timeout',
        function($scope, es, $routeParams, $filter, $timeout) {
            // Config
            var filterSeparator = ':';
            $scope.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

            // Set page size to 1.000 in order to display all the results
            $scope.$parent.indexVM.pageSize = 1000;

            // Init default search with an empty term
            $scope.query = '';

            // Init default facets
            $scope.getAggreagtion = function(facet) {
                $timeout(function() {
                    es.client.search({
                        index: 'resource',
                        body: ejs.Request()
                            .agg(ejs.TermsAggregation(facet).field(facet))
                    }, function(error, response) {
                        $scope[facet].values = response.aggregations[facet].buckets.map(function(obj) {
                            obj.selected = true;
                            return obj;
                        });
                    });
                }, 0)
            }
            $scope.sites = {
                'show': false,
                'size': 5,
                'icon': 'keyboard_arrow_right',
                'label': $filter('translate')('MORE')
            };
            $scope.getAggreagtion('sites');
            $scope.sitesToogle = function() {
                $timeout(function() {
                    $scope.sites.show = !$scope.sites.show;
                    $scope.sites.size = ($scope.sites.show ? 100 : 5);
                    $scope.sites.icon = ($scope.sites.show ? 'keyboard_arrow_up' : 'keyboard_arrow_right');
                    $scope.sites.label = ($scope.sites.show ? $filter('translate')('LESS') : $filter('translate')('MORE'));
                }, 0);
            }
            $scope.subjects = {
                'show': false,
                'size': 5,
                'icon': 'keyboard_arrow_right',
                'label': $filter('translate')('MORE')
            };
            $scope.getAggreagtion('subjects');
            $scope.subjectsToogle = function() {
                $timeout(function() {
                    $scope.subjects.show = !$scope.subjects.show;
                    $scope.subjects.size = ($scope.subjects.show ? 100 : 5);
                    $scope.subjects.icon = ($scope.subjects.show ? 'keyboard_arrow_up' : 'keyboard_arrow_right');
                    $scope.subjects.label = ($scope.subjects.show ? $filter('translate')('LESS') : $filter('translate')('MORE'));
                }, 0);
            }
            $scope.types = {
                'show': false,
                'size': 5,
                'icon': 'keyboard_arrow_right',
                'label': $filter('translate')('MORE')
            };
            $scope.getAggreagtion('types');
            $scope.typesToogle = function() {
                $timeout(function() {
                    $scope.types.show = !$scope.types.show;
                    $scope.types.size = ($scope.types.show ? 100 : 5);
                    $scope.types.icon = ($scope.types.show ? 'keyboard_arrow_up' : 'keyboard_arrow_right');
                    $scope.types.label = ($scope.types.show ? $filter('translate')('LESS') : $filter('translate')('MORE'));
                }, 0);
            }

            // Reset the query's filter
            var tmp_json = {};
            var index, obj, key, val;
            for (index in $scope.$parent.filters.jsonObjects) {
                obj = JSON.parse($scope.$parent.filters.jsonObjects[index]).terms;
                key = Object.keys(obj)[0];
                val = obj[key][0];
                tmp_json[key] = val;
            }
            for (index in tmp_json) {
                $scope.$parent.indexVM.filters.remove(ejs.TermsFilter(index, tmp_json[index]));
            }
            // Reset the query's term
            $scope.$parent.indexVM.query = ejs.MatchAllQuery();

            // Fill the filters object according to the route params
            if ($routeParams.letter || $routeParams.query || $routeParams.sites || $routeParams.subjects || $routeParams.types) {
                // Set the "All" tab as selected
                $scope.selectedTab = 2;
                // Fill the query's filters attribute
                if ($routeParams.letter && $routeParams.letter != '') {
                    // Only one letter is allowed in the request
                    var letter = $routeParams.letter.split(filterSeparator)[0].toUpperCase();
                    if ($.inArray(letter, $scope.alphabet) != -1) {
                        $scope.$parent.indexVM.query = ejs.MatchQuery('title_fr_notanalyzed', letter).type('phrase_prefix');
                    }
                }
                if ($routeParams.sites && $routeParams.sites != '') {
                    $.map($routeParams.sites.split(filterSeparator), function(site) {
                        if (site != '') {
                            $scope.$parent.indexVM.filters.add(ejs.TermsFilter('sites', site));
                        }
                    });
                }
                if ($routeParams.subjects && $routeParams.subjects != '') {
                    $.map($routeParams.subjects.split(filterSeparator), function(subject) {
                        if (subject != '') {
                            $scope.$parent.indexVM.filters.add(ejs.TermsFilter('subjects', subject));
                        }
                    });
                }
                if ($routeParams.types && $routeParams.types != '') {
                    $.map($routeParams.types.split(filterSeparator), function(type) {
                        if (type != '') {
                            $scope.$parent.indexVM.filters.add(ejs.TermsFilter('types', type));
                        }
                    });
                }
                if ($routeParams.query && $routeParams.query != '') {
                    $scope.query = $routeParams.query;
                    $scope.$parent.indexVM.query = ejs.BoolQuery().should(ejs.QueryStringQuery(['title_en', 'title_fr', 'description_en', 'description_fr', 'alias']).query('*' + $scope.query + '*'));
                }
            } else if ($routeParams.tab && ['0', '1', '2'].includes($routeParams.tab)) {
                $scope.selectedTab = $routeParams.tab;
            }

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
                    $scope.subjects.facets = response.aggregations.subjects.buckets;
                });

            $scope.addFilterToUrl = function(facet, value) {
                // Extract the parameters part of the url
                var parameters = window.location.href.split('?').length == 1 ? '' : window.location.href.split('?')[1];
                // Transform this parameters into a JSON Object
                var parametersJSON = parameters ? JSON.parse('{"' + parameters.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function(key, value) {
                    return key === "" ? value : decodeURIComponent(value)
                }) : {};
                // If facet filter already in the url params, replace or complete
                if ($.inArray(facet, Object.keys(parametersJSON)) != -1) {
                    switch (facet) {
                        case 'letter':
                            parametersJSON[facet] = value;
                            break;
                        case 'query':
                            parametersJSON[facet] = value;
                            break;
                        default:
                            console.log('Error : this facet is not taken into consideration : ' + facet);
                            break;
                    }
                    // Else create the facet as a new query filter
                } else {
                    parametersJSON[facet] = value;
                }
                parameters = Object.keys(parametersJSON).map(function(k) {
                    return encodeURIComponent(k) + '=' + encodeURIComponent(parametersJSON[k])
                }).join('&');
                // Redirect to the new url with the added facet
                window.location.href = window.location.href.split('?')[0] + '?' + parameters;
            }

            $scope.removeFilterFromUrl = function(facet) {
                // Extract the parameters part of the url
                var parameters = window.location.href.split('?').length == 1 ? '' : window.location.href.split('?')[1];
                // Transform this parameters into a JSON Object
                var parametersJSON = parameters ? JSON.parse('{"' + parameters.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function(key, value) {
                    return key === "" ? value : decodeURIComponent(value)
                }) : {};
                delete parametersJSON[facet]
                    // Force to rest on the tab 'All'
                parametersJSON['tab'] = 2;
                parameters = Object.keys(parametersJSON).map(function(k) {
                    return encodeURIComponent(k) + '=' + encodeURIComponent(parametersJSON[k])
                }).join('&');
                // Redirect to the new url with the added facet
                window.location.href = window.location.href.split('?')[0] + '?' + parameters;
            }

        }
    ]);

})();
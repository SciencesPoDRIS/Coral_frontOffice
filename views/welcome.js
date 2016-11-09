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
                    $scope.subjects = response.aggregations.subjects.buckets;
                });

            // Tab "All", on click on a letter, filter all the resources whose title begins with this letter
            $scope.filterByLetter = function() {
                if ($(this)[0].hasOwnProperty('letter')) {
                    $scope.$parent.indexVM.query = ejs.MatchQuery('title_fr_notanalyzed', $(this)[0].letter).type('phrase_prefix');
                } else {
                    // Reset query term
                    $scope.query = '';
                    $scope.$parent.indexVM.query = ejs.MatchAllQuery();
                }
            }

            // Init default behaviour
            $scope.sitesShow = $scope.subjectsShow = $scope.typesShow = false;
            $scope.sitesSize = $scope.subjectsSize = $scope.typesSize = 5;
            $scope.sitesIcon = $scope.subjectsIcon = $scope.typesIcon = 'keyboard_arrow_right';
            $scope.sitesLabel = $scope.subjectsLabel = $scope.typesLabel = $filter('translate')('MORE');
            $scope.sitesToogle = function() {
                $timeout(function() {
                    $scope.sitesShow = !$scope.sitesShow;
                    $scope.sitesSize = ($scope.sitesShow ? 100 : 5);
                    $scope.sitesIcon = ($scope.sitesShow ? 'keyboard_arrow_up' : 'keyboard_arrow_right');
                    $scope.sitesLabel = ($scope.sitesShow ? $filter('translate')('LESS') : $filter('translate')('MORE'));
                }, 0);
            }
            $scope.subjectsToogle = function() {
                $timeout(function() {
                    $scope.subjectsShow = !$scope.subjectsShow;
                    $scope.subjectsSize = ($scope.subjectsShow ? 100 : 5);
                    $scope.subjectsIcon = ($scope.subjectsShow ? 'keyboard_arrow_up' : 'keyboard_arrow_right');
                    $scope.subjectsLabel = ($scope.subjectsShow ? $filter('translate')('LESS') : $filter('translate')('MORE'));
                }, 0);
            }
            $scope.typesToogle = function() {
                $timeout(function() {
                    $scope.typesShow = !$scope.typesShow;
                    $scope.typesSize = ($scope.typesShow ? 100 : 5);
                    $scope.typesIcon = ($scope.typesShow ? 'keyboard_arrow_up' : 'keyboard_arrow_right');
                    $scope.typesLabel = ($scope.typesShow ? $filter('translate')('LESS') : $filter('translate')('MORE'));
                }, 0);
            }

            $scope.addFilterToUrl = function(facet, value) {
                // Extract the parameters part of the url
                var parameters = window.location.href.split('?').length == 1 ? '' : window.location.href.split('?')[1];
                // Transform this parameters into a JSON Object
                var parametersJSON = parameters ? JSON.parse('{"' + parameters.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function(key, value) { return key === "" ? value : decodeURIComponent(value) }) : {};
                // If facet filter already in the url params, replace or complete
                if ($.inArray(facet, Object.keys(parametersJSON)) != -1) {
                    switch(facet) {
                        case 'letter' :
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
                parameters = Object.keys(parametersJSON).map(function(k) { return encodeURIComponent(k) + '=' + encodeURIComponent(parametersJSON[k]) }).join('&');
                // Redirect to the new url with the added facet
                window.location.href = window.location.href.split('?')[0] + '?' + parameters;
            }
        }
    ]);

})();
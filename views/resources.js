'use strict';

var app = angular.module('eResources.resources', []);

app.controller('ResourcesController', ['$scope', 'es', '$filter', '$timeout', '$routeParams', 'addFilterToUrl', 'removeFilterFromUrl', 'store',
    function($scope, es, $filter, $timeout, $routeParams, addFilterToUrl, removeFilterFromUrl, store) {
        // Config
        var filterSeparator = ':';
        $scope.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        // Set selected tab
        $scope.$parent.selectedTab = 'resources';

        // Set page size to 1.000 in order to display all the results
        $scope.$parent.indexVM.pageSize = 1000;

        // Set previousUrl into store service
        store.set('previousUrl', window.location.href);

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
            'icon': 'add',
            'label': $filter('translate')('MORE')
        };
        $scope.getAggreagtion('sites');
        $scope.sitesToogle = function() {
            $timeout(function() {
                $scope.sites.show = !$scope.sites.show;
                $scope.sites.size = ($scope.sites.show ? 100 : 5);
                $scope.sites.icon = ($scope.sites.show ? 'remove' : 'add');
                $scope.sites.label = ($scope.sites.show ? $filter('translate')('LESS') : $filter('translate')('MORE'));
            }, 0);
        }
        $scope.subjects = {
            'show': false,
            'size': 5,
            'icon': 'add',
            'label': $filter('translate')('MORE')
        };
        $scope.getAggreagtion('subjects');
        $scope.subjectsToogle = function() {
            $timeout(function() {
                $scope.subjects.show = !$scope.subjects.show;
                $scope.subjects.size = ($scope.subjects.show ? 100 : 5);
                $scope.subjects.icon = ($scope.subjects.show ? 'remove' : 'add');
                $scope.subjects.label = ($scope.subjects.show ? $filter('translate')('LESS') : $filter('translate')('MORE'));
            }, 0);
        }
        $scope.types = {
            'show': false,
            'size': 5,
            'icon': 'add',
            'label': $filter('translate')('MORE')
        };
        $scope.getAggreagtion('types');
        $scope.typesToogle = function() {
            $timeout(function() {
                $scope.types.show = !$scope.types.show;
                $scope.types.size = ($scope.types.show ? 100 : 5);
                $scope.types.icon = ($scope.types.show ? 'remove' : 'add');
                $scope.types.label = ($scope.types.show ? $filter('translate')('LESS') : $filter('translate')('MORE'));
            }, 0);
        }

        $scope.clickOnFacet = function(facet, value, isActivated) {
            if (isActivated) {
                // Disable this filter by removing it from url
                $scope.removeFilterFromUrl(facet, value);
            } else {
                // Enable this filter by adding it to url
                $scope.addFilterToUrl(facet, value);
            }
        }

        $scope.removeFilterFromUrl = function(facet, value) {
            removeFilterFromUrl(facet, value);
        }

        $scope.addFilterToUrl = function(facet, value) {
            addFilterToUrl(facet, value);
        }

        // Reset the query's filter
        var tmp_json = {};
        var index, obj, key, val;
        for (index in $scope.$parent.filters.jsonObjects) {
            // Have to do this, don't know why
            if (index != "_sfl") {
                obj = JSON.parse($scope.$parent.filters.jsonObjects[index]).terms;
                key = Object.keys(obj)[0];
                val = obj[key][0];
                tmp_json[key] = val;
            }
        }
        for (index in tmp_json) {
            $scope.$parent.indexVM.filters.remove(ejs.TermsFilter(index, tmp_json[index]));
        }
        // Reset the query's term
        $scope.$parent.indexVM.query = ejs.MatchAllQuery();
        // Set "All" as default selected letter
        $scope.selectedLetter = '';
        // Add a listener on the current language to adapt the search on resources titles and description
        // Default language is French
        $scope.$watch('$parent.currentLanguage', function(newValue) {
            switch(newValue) {
                case 'en' :
                $scope.$parent.indexVM.sort = ejs.Sort('title_en_notanalyzed').asc();
                if($routeParams.letter && $routeParams.letter != '' && $routeParams.query && $routeParams.query != '') {
                    $scope.selectedLetter = $routeParams.letter.split(filterSeparator)[0].toUpperCase();
                    $scope.query = $routeParams.query;
                    $scope.$parent.indexVM.query = ejs.BoolQuery()
                        .must(ejs.MatchQuery('title_en_notanalyzed', $scope.selectedLetter).type('phrase_prefix'))
                        .must(ejs.BoolQuery()
                            .should(ejs.MatchQuery('title_en', $scope.query))
                            .should(ejs.MatchQuery('description_en', $scope.query))
                            .should(ejs.MatchQuery('alias', $scope.query)));
                } else if ($routeParams.letter && $routeParams.letter != '') {
                    $scope.selectedLetter = $routeParams.letter.split(filterSeparator)[0].toUpperCase();
                    $scope.$parent.indexVM.query = ejs.MatchQuery('title_en_notanalyzed', $scope.selectedLetter).type('phrase_prefix');
                } else if ($routeParams.query && $routeParams.query != '') {
                    $scope.query = $routeParams.query;
                    ejs.BoolQuery()
                        .should(ejs.MatchQuery('title_en', $scope.query))
                        .should(ejs.MatchQuery('description_en', $scope.query))
                        .should(ejs.MatchQuery('alias', $scope.query));
                }
                case 'fr' :
                default :
                    $scope.$parent.indexVM.sort = ejs.Sort('title_fr_notanalyzed').asc();
                    if($routeParams.letter && $routeParams.letter != '' && $routeParams.query && $routeParams.query != '') {
                        $scope.selectedLetter = $routeParams.letter.split(filterSeparator)[0].toUpperCase();
                        $scope.query = $routeParams.query;
                        $scope.$parent.indexVM.query = ejs.BoolQuery()
                            .must(ejs.MatchQuery('title_fr_notanalyzed', $scope.selectedLetter).type('phrase_prefix'))
                            .must(ejs.BoolQuery()
                                .should(ejs.MatchQuery('title_fr', $scope.query))
                                .should(ejs.MatchQuery('description_fr', $scope.query))
                                .should(ejs.MatchQuery('alias', $scope.query)));
                    } else if ($routeParams.letter && $routeParams.letter != '') {
                        $scope.selectedLetter = $routeParams.letter.split(filterSeparator)[0].toUpperCase();
                        $scope.$parent.indexVM.query = ejs.MatchQuery('title_fr_notanalyzed', $scope.selectedLetter).type('phrase_prefix');
                    } else if ($routeParams.query && $routeParams.query != '') {
                        $scope.query = $routeParams.query;
                        ejs.BoolQuery()
                            .should(ejs.MatchQuery('title_fr', $scope.query))
                            .should(ejs.MatchQuery('description_fr', $scope.query))
                            .should(ejs.MatchQuery('alias', $scope.query));
                    }
                    break;
            }
        });
        // Fill the filters object according to the route params
        if ($routeParams.sites || $routeParams.subjects || $routeParams.types) {
            // Fill the query's filters attribute
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
            if ($routeParams.sites && $routeParams.sites != '') {
                $.map($routeParams.sites.split(filterSeparator), function(site) {
                    if (site != '') {
                        $scope.$parent.indexVM.filters.add(ejs.TermsFilter('sites', site));
                    }
                });
            }
        }
        // Scroll to tabs for each search
        $('html, body').animate({
            scrollTop: $(".header-buttons").offset().top
        }, 500);
    }
]);

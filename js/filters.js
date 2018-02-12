/* Filters */

'use strict';

var app = angular.module('eResources.filters', []);

app.filter('getAccessTypeIcon', [function() {
    return function(input, $scope, facet) {
        var tmp = '';
        switch (input) {
            case 'Local and remote access':
                tmp = 'access_remote.png';
                break;
            case 'Free access':
                tmp = 'access_free.png';
                break;
            case 'Local access':
                tmp = 'access_local.png';
                break;
            case 'Restricted access':
                tmp = 'access_restricted.png';
                break;
            default:
                tmp = '';
        }
        return tmp;
    };
}]);

app.filter('rewriteUrl', [function() {
    return function(input) {
        return window.encodeURIComponent(input);
    }
}]);

app.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);

app.filter('truncateOwnFilter', [function () {
    return function(input) {
        if(input) {
            input = input.substring(0, input.lastIndexOf(" ")) + '...';
        }
        return input
    };
}]);
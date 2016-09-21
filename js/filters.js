(function() {
    'use strict';

    /* Filters */

    var app = angular.module('eResources.filters', []);

    app.filter('getImageUrl', [
        function() {
            return function(input, $scope, facet) {
                console.log(input);
                var tmp = '';
                switch(input) {
                    case 'Local and remote access' :
                        tmp = 'access_remote.png';
                        break;
                    case 'Free access' :
                        tmp = 'access_free.png';
                        break;
                    case 'Local access' :
                        tmp = 'access_local.png';
                        break;
                    case 'Restricted access' :
                        tmp = 'access_restricted.png';
                        break;
                    default :
                        tmp = '';
                }
                return tmp;
            };
        }
    ]);

})();
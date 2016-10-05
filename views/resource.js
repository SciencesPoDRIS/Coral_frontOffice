(function() {
    'use strict';

    var app = angular.module('eResources.resource', []);

    app.controller('ResourceController', ['$scope', '$translate', '$routeParams',
        function($scope, $translate, $routeParams) {
            // Get information about this resource
            $scope.indexVM.query = ejs.MatchQuery('resourceid', $routeParams.resourceId);
        }
    ]);

})();
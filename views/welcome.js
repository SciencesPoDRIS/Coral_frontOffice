(function() {
    'use strict';

    var app = angular.module('eResources.welcome', []);

    app.controller('WelcomeController', ['$scope',
        function($scope) {
            // Get the resources 'new' or 'in trial', order by status
            $scope.$parent.indexVM.query = ejs.BoolQuery().should(ejs.MatchQuery('status', 'trial')).should(ejs.MatchQuery('status', 'new'));
            $scope.$parent.indexVM.sort = ejs.Sort('status').order('desc');
        }
    ]);

})();
(function() {

// js/services

'use strict';

var app = angular.module('eResources.services', []);

app.factory('addFilterToUrl', [
    function() {
        return function(facet, value) {
            // Config
            var filterSeparator = ':';
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
                    case 'subjects':
                        parametersJSON[facet] += filterSeparator + value;
                        break;
                    case 'types':
                        parametersJSON[facet] += filterSeparator + value;
                        break;
                    case 'sites':
                        parametersJSON[facet] += filterSeparator + value;
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
            window.location.href = location.protocol + '//' + location.host + location.pathname + '#/resources' + '?' + parameters;
        }
    }
]);

app.factory('removeFilterFromUrl', [
    function() {
        return function(facet, value) {
            // Config
            var filterSeparator = ':';
            var value = value || null;
            // Extract the parameters part of the url
            var parameters = window.location.href.split('?').length == 1 ? '' : window.location.href.split('?')[1];
            // Transform this parameters into a JSON Object
            var parametersJSON = parameters ? JSON.parse('{"' + parameters.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function(key, value) {
                return key === "" ? value : decodeURIComponent(value)
            }) : {};
            if(value === null) {
                delete parametersJSON[facet];
            } else {
                parametersJSON[facet] = parametersJSON[facet].replace(value + filterSeparator, '').replace(filterSeparator + value, '').replace(value, '');
                if(parametersJSON[facet] == '') {
                    delete parametersJSON[facet];
                }
            }
            parameters = Object.keys(parametersJSON).map(function(k) {
                return encodeURIComponent(k) + '=' + encodeURIComponent(parametersJSON[k])
            }).join('&');
            // Redirect to the new url with the added facet
            window.location.href = window.location.href.split('?')[0] + '?' + parameters;
        }
    }
]);

app.factory('store', [function() {
    var savedData = {};

    function set(key, value) {
        savedData[key] = value;
    }

    function get(key) {
        return savedData[key];
    }

    function remove(key) {
        return delete savedData[key];
    }

    return {
        set: set,
        get: get,
        remove: remove
    }
}]);

})();
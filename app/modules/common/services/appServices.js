(function() {
    'use strict';
    angular
        .module('finApp.servies', [])
        .factory('checkPath', checkPath);

        function checkPath() {
            return function(locationPath, pages) {
                return ($.inArray("/" + locationPath.split("/")[1], pages) > -1);
            }
        }
})();
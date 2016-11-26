(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('automobileService', automobileService);

        automobileService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function automobileService($resource,$rootScope,appConfig,$q){
        	
            return{
        		getPlanDetails : getPlanDetails
        	}

	        function getPlanDetails(){               
	        }
        }     
})();
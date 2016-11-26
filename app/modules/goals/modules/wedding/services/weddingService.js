(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('weddingService', weddingService);

        weddingService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function weddingService($resource,$rootScope,appConfig,$q){
        	
            return{
        		getPlanDetails : getPlanDetails
        	}

	        function getPlanDetails(){               
	        }
        }     
})();
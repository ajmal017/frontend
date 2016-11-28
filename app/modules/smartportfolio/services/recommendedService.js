(function() {
    'use strict';
    angular
        .module('finApp.smartPortFolio')
        .factory('recommendedService', recommendedService);

        recommendedService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function recommendedService($resource,$rootScope,appConfig,$q){
        	
            return{
        		getPlanDetails : getPlanDetails
        	}

	        function getPlanDetails(){               
	        }
        }     
})();
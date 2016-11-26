(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('populationService', populationService);

        populationService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function populationService($resource,$rootScope,appConfig,$q){
        	
            return{
        		getPlanDetails : getPlanDetails
        	}

	        function getPlanDetails(){               
	        }
        }     
})();
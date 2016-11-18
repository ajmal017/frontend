(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('goalsService', goalsService);

        goalsService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function goalsService($resource,$rootScope,appConfig,$q){
        	
            return{
        		getPlanDetails : getPlanDetails
        	}

	        function getPlanDetails(){               
	        }
        }     
})();
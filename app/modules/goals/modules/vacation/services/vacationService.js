(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('vacationService', vacationService);

        vacationService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function vacationService($resource,$rootScope,appConfig,$q){
        	
            return{
        		getPlanDetails : getPlanDetails
        	}

	        function getPlanDetails(){               
	        }
        }     
})();
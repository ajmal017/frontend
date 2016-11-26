(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('educationService', educationService);

        educationService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function educationService($resource,$rootScope,appConfig,$q){
        	
            return{
        		getPlanDetails : getPlanDetails
        	}

	        function getPlanDetails(){               
	        }
        }     
})();
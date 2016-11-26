(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('othersService', othersService);

        othersService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function othersService($resource,$rootScope,appConfig,$q){
        	
            return{
        		getPlanDetails : getPlanDetails
        	}

	        function getPlanDetails(){               
	        }
        }     
})();
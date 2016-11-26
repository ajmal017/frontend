(function() {
    'use strict';
    angular
        .module('finApp.planInvest')
        .factory('taxsavingService', taxsavingService);

        taxsavingService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function taxsavingService($resource,$rootScope,appConfig,$q){
        	
            return{
        		getPlanDetails : getPlanDetails
        	}

	        function getPlanDetails(){               
	        }
        }     
})();
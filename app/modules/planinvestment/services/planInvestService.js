(function() {
    'use strict';
    angular
        .module('finApp.planInvest')
        .factory('planInvestService', planInvestService);

        planInvestService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function planInvestService($resource,$rootScope,appConfig,$q){
        	
            return{
        		getPlanDetails : getPlanDetails
        	}

	        function getPlanDetails(){               
	        }
        }     
})();
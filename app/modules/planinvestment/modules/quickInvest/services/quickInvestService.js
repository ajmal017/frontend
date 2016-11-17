(function() {
    'use strict';
    angular
        .module('finApp.planInvest')
        .factory('quickInvestService', quickInvestService);

        quickInvestService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function quickInvestService($resource,$rootScope,appConfig,$q){
        	
            return{
        		getPlanDetails : getPlanDetails
        	}

	        function getPlanDetails(){               
	        }
        }     
})();
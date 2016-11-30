(function() {
    'use strict';
    angular
        .module('finApp.investWithdraw')
        .factory('investWithdrawService', investWithdrawService);

        investWithdrawService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function investWithdrawService($resource,$rootScope,appConfig,$q){
        	
            return{
        		getPlanDetails : getPlanDetails
        	}

	        function getPlanDetails(){               
	        }
        }     
})();
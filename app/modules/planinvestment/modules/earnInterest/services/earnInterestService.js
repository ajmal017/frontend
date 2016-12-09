(function() {
    'use strict';
    angular
        .module('finApp.planInvest')
        .factory('earnInterestService', earnInterestService);

        earnInterestService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function earnInterestService($resource,$rootScope,appConfig,$q){
        	
            return{
        		getPlanDetails : getPlanDetails
        	}

	        function getPlanDetails(){               
	        }
        }     
})();
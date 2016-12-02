(function() {
    'use strict';
    angular
        .module('finApp.trackPerformance')
        .factory('trackPerformanceService', trackPerformanceService);

        trackPerformanceService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function trackPerformanceService($resource,$rootScope,appConfig,$q){
        	
            return{
        		getPlanDetails : getPlanDetails
        	}

	        function getPlanDetails(){               
	        }
        }     
})();
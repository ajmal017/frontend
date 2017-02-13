(function() {
    'use strict';
    angular
        .module('finApp.dashboard')
        .factory('dashboardService', dashboardService);

        dashboardService.$inject = ['$resource','$rootScope','appConfig','$q','riskService'];
        function dashboardService($resource,$rootScope,appConfig,$q,riskService){
        	return{
        		getDashboardDetails : getDashboardDetails
        	}

	        function getDashboardDetails(userFlags,callback){
                var resultObject = {};
                var planConunt = 0;
                for(var key in userFlags['user_answers']){
                    if(userFlags['user_answers'][key] != null && Object.keys(userFlags['user_answers'][key]).length != 0){
                        if(key != 'assess')
                        {
                            planConunt = planConunt + 1;                            
                        }
                    }
                }
                if(planConunt > 0){
                  resultObject['investCount'] = (planConunt < 10) ? 
                    '0'+planConunt : planConunt;  
                } else {
                    resultObject['investCount'] = 0;
                }
                
                resultObject['trackPerform'] = userFlags['user_flags']['track'];
                callback(resultObject);                
	        }

        }     
})();
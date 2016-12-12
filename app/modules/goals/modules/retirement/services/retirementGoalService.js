(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('retirementGoalsService', retirementGoalsService);

        retirementGoalsService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function retirementGoalsService($resource,$rootScope,appConfig,$q){
        	var modelObject = {};
            return{
        		getSavedValues : getSavedValues,
                setSavedValues : setSavedValues,
                getCorpusEstimates : getCorpusEstimates
        	}
	        function getSavedValues(){  
                return modelObject;
	        }
            function setSavedValues(value){  
                modelObject = value;
            }
            
            function getCorpusEstimates(currentAge, retirementAge, monthlyIncome, amountSaved) {
            	var queryData = {"monthly_income":monthlyIncome, "amount_saved":amountSaved, 
            			"current_age":currentAge,"retirement_age":retirementAge};
        		var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/core/goal/retirement/estimate/', 
					{}, {
						Check: {
							method:'GET',
						}
					});
				getAPI.Check({"data" : queryData},function(data){
					if(data.status_code == 200){
						defer.resolve({'success':data.response});
					}else{
						defer.resolve({'Message':data.response['message']});
					}				
				}, function(err){
					defer.reject(err);
				}); 
				return defer.promise;

            }
        }     
})();
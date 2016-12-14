(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('propertyService', propertyService);

    	propertyService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function propertyService($resource,$rootScope,appConfig,$q){
        	
        	var modelObject = {};
        	
            return{
            	getSavedValues : getSavedValues,
            	setSavedValues : setSavedValues,
        		getCorpusEstimates : getCorpusEstimates
        	}

	        function getSavedValues(){
	        	return modelObject;
	        }

	        function setSavedValues(){               
	        }

            function getCorpusEstimates(term, currentPrice, proportionofPurchaseCost, amountSaved) {
            	var queryData = {"term":term, "current_price":currentPrice, "prop_of_purchase_cost":proportionofPurchaseCost, "amount_saved": amountSaved};
        		var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/core/goal/property/estimate/', 
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
(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('weddingService', weddingService);

        weddingService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function weddingService($resource,$rootScope,appConfig,$q){
        	
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

            function getCorpusEstimates(term, expectedPeople, location, sharingPercentage, amountSaved) {
            	var queryData = {"term":term, "expected_people":expectedPeople, "sharing_percentage":sharingPercentage, "location" : location, "amount_saved": amountSaved};
        		var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/core/goal/wedding/estimate/', 
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
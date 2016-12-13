(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('vacationService', vacationService);

        vacationService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function vacationService($resource,$rootScope,appConfig,$q){
        	
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

            function getCorpusEstimates(term, numberOfMembers, numberOfDays, location, amountSaved) {
            	var queryData = {"term":term, "number_of_members":numberOfMembers, "number_of_days":numberOfDays, "location" : location, "amount_saved": amountSaved};
        		var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/core/goal/vacation/estimate/', 
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
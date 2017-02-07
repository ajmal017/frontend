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
	        	var vacationAnswers = {};
                vacationAnswers = $rootScope.userFlags['user_answers']['vacation'];
                console.log('vacationAnswers',vacationAnswers);

                var d = new Date();
                modelObject.A1 = vacationAnswers['goal_name'];
                modelObject.A3 = vacationAnswers['corpus'];
               
                modelObject.A5 = vacationAnswers['number_of_members'] || 2;
                modelObject.A6 = vacationAnswers['number_of_days'] || 6;
                modelObject.A7 = vacationAnswers['location'] || '';
                modelObject.A8 = vacationAnswers['amount_saved'] || 0;
                modelObject.assetAllocation = vacationAnswers['allocation'];
                modelObject.sip = vacationAnswers['sip'];
                modelObject.corpus = vacationAnswers['corpus'];

                if (vacationAnswers['term']) {
                	modelObject.A2 = parseInt(d.getFullYear() + vacationAnswers['term']);
                }
                else {
                	modelObject.A2 = undefined;
                }
	        	return modelObject;
	        }

	        function setSavedValues(model){        
                var modelObject = {};
                var modelObject = model;
                sessionStorage.setItem('goalDetailsTemp', JSON.stringify(modelObject));          
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
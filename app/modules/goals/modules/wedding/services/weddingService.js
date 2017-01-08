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
	        	var weddingAnswers = {};
                weddingAnswers = $rootScope.userFlags['user_answers']['wedding'];
                console.log('weddingAnswers',weddingAnswers);

                var d = new Date();
                modelObject.A1 = weddingAnswers['goal_name'];
                modelObject.A3 = weddingAnswers['corpus'];
               
                modelObject.A5 = weddingAnswers['expected_people'];
                modelObject.A6 = weddingAnswers['location'] || '';
                modelObject.A7 = weddingAnswers['sharing_percentage'];
                modelObject.A8 = weddingAnswers['amount_saved'];
                if (weddingAnswers['term']) {
                	modelObject.A2 = parseInt(d.getFullYear() + weddingAnswers['term']);
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
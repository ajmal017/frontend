(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('educationService', educationService);

        educationService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function educationService($resource,$rootScope,appConfig,$q){
        	var modelObject = {};
        	
            return{
            	getSavedValues : getSavedValues,
            	setSavedValues : setSavedValues,
        		getCorpusEstimates : getCorpusEstimates
        	}

	        function getSavedValues(){
	        	var educationAnswers = {};
                educationAnswers = $rootScope.userFlags['user_answers']['education'];
                console.log('educationAnswers',educationAnswers);
                var d = new Date();
                modelObject.A1 = educationAnswers['goal_name'];
                modelObject.A3 = educationAnswers['corpus'];
                modelObject.A5 = educationAnswers['location'] || '';
                modelObject.A6 = educationAnswers['field'] || '';
                modelObject.A7 = educationAnswers['amount_saved'] || 0;
                if (educationAnswers['term']) {
                	modelObject.A2 = parseInt(d.getFullYear() + educationAnswers['term']);
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

            function getCorpusEstimates(term, location, field, amountSaved) {
            	var queryData = {"term":term, "location":location, "field":field, "amount_saved": amountSaved};
        		var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/core/goal/education/estimate/', 
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
(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('jewelleryService', jewelleryService);

        jewelleryService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function jewelleryService($resource,$rootScope,appConfig,$q){
        	
        	var modelObject = {};
        	
            return{
            	getSavedValues : getSavedValues,
            	setSavedValues : setSavedValues,
        		getCorpusEstimates : getCorpusEstimates
        	}

	        function getSavedValues(){
	        	var jewelleryAnswers = {};
                jewelleryAnswers = $rootScope.userFlags['user_answers']['jewellery'];
                console.log('jewelleryAnswers',jewelleryAnswers);

                var d = new Date();
                modelObject.A1 = jewelleryAnswers['goal_name'];
                modelObject.A3 = jewelleryAnswers['corpus'];
               
                modelObject.A5 = jewelleryAnswers['current_price'];
                modelObject.A7 = jewelleryAnswers['amount_saved'];
                if (jewelleryAnswers['term']) {
                	modelObject.A2 = parseInt(d.getFullYear() + jewelleryAnswers['term']);
                }
                else {
                	modelObject.A2 = undefined;
                }
	        	return modelObject;
	        }

	        function setSavedValues(){               
	        }

            function getCorpusEstimates(term, currentPrice, amountSaved) {
            	var queryData = {"term":term, "current_price":currentPrice, "amount_saved": amountSaved};
        		var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/core/goal/jewellery/estimate/', 
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
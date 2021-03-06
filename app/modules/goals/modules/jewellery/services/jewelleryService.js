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
                modelObject.A4 = jewelleryAnswers['sip']
                modelObject.A5 = jewelleryAnswers['current_price'];
                modelObject.A7 = jewelleryAnswers['amount_saved'] || 0;
                modelObject.assetAllocation = jewelleryAnswers['allocation'];
                modelObject.sip = jewelleryAnswers['sip'];
                modelObject.corpus = jewelleryAnswers['corpus'];
                modelObject.estimate_selection_type = jewelleryAnswers['estimate_selection_type'];
                if (jewelleryAnswers['term']) {
                	modelObject.A2 = parseInt(d.getFullYear() + jewelleryAnswers['term']);
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
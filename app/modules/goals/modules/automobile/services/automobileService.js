(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('automobileService', automobileService);

        automobileService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function automobileService($resource,$rootScope,appConfig,$q){
        	
        	var modelObject = {};
        	
            return{
            	getSavedValues : getSavedValues,
            	setSavedValues : setSavedValues,
        		getCorpusEstimates : getCorpusEstimates
        	}

	        function getSavedValues(){
	        	var automobileAnswers = {};
                automobileAnswers = $rootScope.userFlags['user_answers']['automobile'];
                console.log('automobileAnswers',automobileAnswers);

                var d = new Date();
                modelObject.A1 = automobileAnswers['goal_name'];
                modelObject.A3 = automobileAnswers['corpus'];
               
                modelObject.A5 = automobileAnswers['current_price'];
                modelObject.A6 = automobileAnswers['prop_of_purchase_cost']
                modelObject.A7 = automobileAnswers['amount_saved'];
                if (automobileAnswers['term']) {
                	modelObject.A2 = parseInt(d.getFullYear() + automobileAnswers['term']);
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

            function getCorpusEstimates(term, currentPrice, proportionofPurchaseCost, amountSaved) {
            	var queryData = {"term":term, "current_price":currentPrice, "prop_of_purchase_cost":proportionofPurchaseCost, "amount_saved": amountSaved};
        		var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/core/goal/automobile/estimate/', 
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
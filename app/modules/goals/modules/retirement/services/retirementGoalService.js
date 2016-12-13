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
                addRetirementGoal : addRetirementGoal
        	}
	        function getSavedValues(){  
                return modelObject;
	        }
            function setSavedValues(value){  
                modelObject = value;
            }

            function addRetirementGoal(dataObj){
                var defer = $q.defer();
                var getAPI = $resource( 
                    appConfig.API_BASE_URL+'/core/retirement/new/response/add/', 
                    {}, {
                        Check: {
                            method:'POST',
                        }
                    });
                getAPI.Check(dataObj,function(data){
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
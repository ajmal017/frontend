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
                setSavedValues : setSavedValues
        	}
	        function getSavedValues(){  
                return modelObject;
	        }
            function setSavedValues(value){  
                modelObject = value;
            }
        }     
})();
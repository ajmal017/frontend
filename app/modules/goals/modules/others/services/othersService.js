(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('othersService', othersService);

        othersService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function othersService($resource,$rootScope,appConfig,$q){
        	
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

            function getCorpusEstimates() {
            }
        }     
})();
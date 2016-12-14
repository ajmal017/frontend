(function() {
    'use strict';
    angular
        .module('finApp.planInvest')
        .factory('quickInvestService', quickInvestService);

        quickInvestService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function quickInvestService($resource,$rootScope,appConfig,$q){
        	
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
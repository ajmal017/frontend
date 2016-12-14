(function() {
    'use strict';
    angular
        .module('finApp.planInvest')
        .factory('taxsavingService', taxsavingService);

        taxsavingService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function taxsavingService($resource,$rootScope,appConfig,$q){
        	
        	var modelObject = {};
        	
            return{
            	getSavedValues : getSavedValues,
            	setSavedValues : setSavedValues
        	}

	        function getSavedValues(){
	        	return modelObject;
	        }

	        function setSavedValues(){               
	        }

        }     
})();
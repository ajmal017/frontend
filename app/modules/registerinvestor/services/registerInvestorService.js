(function() {
    'use strict';
    angular
        .module('finApp.registerInvestor')
        .factory('registerInvestorService', registerInvestorService);

        registerInvestorService.$inject = ['$rootScope','$resource','appConfig','$q'];
        function registerInvestorService($rootScope,$resource,appConfig,$q){
        	return{
        		getDetails : getDetails
        	}
        	function getDetails(){
        		
        	}
        }        
})();
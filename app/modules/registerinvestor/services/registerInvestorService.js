(function() {
    'use strict';
    angular
        .module('finApp.registerInvestor')
        .factory('registerInvestorService', registerInvestorService);

        registerInvestorService.$inject = ['$rootScope','$resource','appConfig','$q'];
        function registerInvestorService($rootScope,$resource,appConfig,$q){
        	return{
        		lookupPincode : lookupPincode,
        		getKYCStatus : getKYCStatus,
        		getRegistrationStatus : getRegistrationStatus,
        		saveSignature : saveSignature,
        		saveDeclaration : saveDeclaration 
        	}

        	function saveSignature() {
        	}

        	function saveDeclaration() {
        	}

        	function lookupPincode(pincode) {
            	var pincodeData = {'pincode':pincode};
            	
        		var defer = $q.defer();
				var postAPI = $resource( 
					appConfig.API_BASE_URL+'/user/pincode/autocomplete/', 
					{}, {
						Check: {
							method:'POST',
						}
					});
				postAPI.Check(pincodeData,function(data){
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
        	
        	function getKYCStatus() {
        		if ($rootScope.userFlags && $rootScope.userFlags['user_flags'])
        			return $rootScope.userFlags['user_flags']['kra_verified'];
        		
        		return false;
        	}

        	function getRegistrationStatus() {
            	
        		var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/user/is_complete/get/', 
					{}, {
						Check: {
							method:'GET',
						}
					});
				getAPI.Check({},function(data){
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
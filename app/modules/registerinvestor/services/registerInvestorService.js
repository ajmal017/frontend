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
        		saveVideoFile : saveVideoFile,
        		getVideoFile : getVideoFile,
        		saveDeclaration : saveDeclaration,
        		saveProcessChoice : saveProcessChoice,
        		isVaultLocked : isVaultLocked 
        	}

        	function saveSignature(signatureDataUri) {
            	var requestData = {'signature_data': signatureDataUri};

        		var defer = $q.defer();
				var postAPI = $resource( 
					appConfig.API_BASE_URL+'/user/save/image/', 
					{}, {
						Check: {
							method:'POST',
						}
					});
					postAPI.Check(requestData,function(data){
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

        	function saveSignatureFile(signatureFile) {
            	var fd = new FormData();
        		fd.append('signature', signatureFile);
	    		var defer = $q.defer();
				var postAPI = $resource( 
					appConfig.API_BASE_URL+'/user/save/image/', 
					{}, {
						Check: {
							method:'POST',
							headers:{'Content-type':undefined},
							transformRequest: angular.identity
						}
					});
				postAPI.Check(fd,function(data){
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

        	function saveVideoFile(videoFile, videoThumbnailFile) {
            	var fd = new FormData();
        		fd.append('user_video', videoFile);
        		fd.append('user_video_thumbnail_data', videoThumbnailFile);
        		
	    		var defer = $q.defer();
				var postAPI = $resource( 
					appConfig.API_BASE_URL+'/user/video/upload/', 
					{}, {
						Check: {
							method:'POST',
							headers:{'Content-type':undefined},
							transformRequest: angular.identity
						}
					});
				postAPI.Check(fd,function(data){
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

        	function saveDeclaration(modelObject) {
        		var saveData = {'is_declaration' : modelObject.isDeclaration, 'is_terms' : modelObject.isTerms};
        		
        		var defer = $q.defer();
				var postAPI = $resource( 
					appConfig.API_BASE_URL+'/user/is_complete/update/', 
					{}, {
						Check: {
							method:'POST',
						}
					});
				postAPI.Check(saveData,function(data){
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

        	function saveProcessChoice() {
            	var requestData = {'process_choice':'0'};
            	
        		var defer = $q.defer();
				var postAPI = $resource( 
					appConfig.API_BASE_URL+'/user/process/set/', 
					{}, {
						Check: {
							method:'POST',
						}
					});
				postAPI.Check(requestData,function(data){
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

        	function getVideoFile() {
            	
        		var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/user/video/get/', 
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
        	
        	function isVaultLocked() {
        		if ($rootScope.userFlags && $rootScope.userFlags['user_flags'])
        			return $rootScope.userFlags['user_flags']['vault_locked'];
        		
        		return false;
        	}

}        
})();
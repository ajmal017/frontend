(function() {
    'use strict';
    angular
        .module('finApp.registerInvestor')
        .factory('identityInfoService', identityInfoService);

    identityInfoService.$inject = ['$rootScope','$resource','appConfig','$q'];
        function identityInfoService($rootScope,$resource,appConfig,$q){
        	var modelObject = {},
        	
        		serializeModel = function() {
	        		return {
	        			'marital_status': modelObject.maritalStatus, 
	        			'gender': modelObject.gender, 
	        			'nationality': modelObject.nationality, 
	        			'sip_check': modelObject.sipCheck,
	        			'ifsc_code': modelObject.ifscCode,
	        		};
        		},
        		
        		deserializeModel = function(response) {
        			
        			modelObject = {
        				maritalStatus : response.marital_status, 
        				gender : response.gender, 
        				nationality : response.nationality,
        				imageUrl : response.identity_info_image_thumbnail
	        		};
        			
        		};        		
        	
            return{
        		getSavedValues : getSavedValues,
                setSavedValues : setSavedValues,
                uploadFileToServer : uploadFileToServer 
        	}
            
            function getSavedValues() {
        		var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/user/identity/info/get/', 
					{}, {
						Check: {
							method:'GET',
						}
					});
				getAPI.Check({},function(data){
					if(data.status_code == 200){
						deserializeModel(data.response);
						defer.resolve({'success':modelObject});
					}else{
						defer.resolve({'Message':data.response['message']});
					}				
				}, function(err){
					defer.reject(err);
				}); 
				return defer.promise;
            }

            function setSavedValues(modelVal) {
            	if (typeof(modelVal)==="undefined" || !modelVal) {
            		return;
            	}

            	modelObject = modelVal;

            	var saveData = serializeModel();
            	
        		var defer = $q.defer();
				var postAPI = $resource( 
					appConfig.API_BASE_URL+'/user/identity/info/add/', 
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

            function uploadFileToServer(file) {
            	var fd = new FormData();
            		fd.append('identity_info_image', file);
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
            
        }        
})();
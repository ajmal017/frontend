(function() {
    'use strict';
    angular
        .module('finApp.registerInvestor')
        .factory('nomineeInfoService', nomineeInfoService);

    nomineeInfoService.$inject = ['$rootScope','$resource','appConfig','$q'];
        function nomineeInfoService($rootScope,$resource,appConfig,$q){
        	var modelObject = {},
        	
        		serializeModel = function() {
	        		return {
	        			'nominee_address': modelObject.nomineeAddress, 
	        			'nominee_name': modelObject.nomineeName, 
	        			'nominee_dob': modelObject.nomineeDob, 
	        			'guardian_name': modelObject.guardianName,
	        			'relationship_with_investor': modelObject.relationshipWithInvestor,
	        			'nominee_absent': modelObject.nomineeAbsent,
	        			'address_are_equal': modelObject.addressAreEqual,
	        		};
        		},
        		
        		deserializeModel = function(response) {
        			
        			modelObject = {
        				nomineeName : response.nominee_address, 
        				nomineeName : response.nominee_name, 
	        			nomineeDob : response.nominee_dob, 
	        			guardianName : response.guardian_name,
	        			relationshipWithInvestor : response.relationship_with_investor,
	        			nomineeAbsent : response.nominee_absent,
	        			addressAreEqual : response.address_are_equal
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
					appConfig.API_BASE_URL+'/user/nominee/info/get/', 
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
					appConfig.API_BASE_URL+'/user/nominee/info/add/', 
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
            		fd.append('signature', file);
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
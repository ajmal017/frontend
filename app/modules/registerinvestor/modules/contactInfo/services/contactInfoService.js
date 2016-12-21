(function() {
    'use strict';
    angular
        .module('finApp.registerInvestor')
        .factory('contactInfoService', contactInfoService);

    contactInfoService.$inject = ['$rootScope','$resource','appConfig','$q'];
        function contactInfoService($rootScope,$resource,appConfig,$q){
        	var modelObject,
        	
        		serializeModel = function() {
        			var returnObject = {
        					'communication_address' : {
        						'pincode' : modelObject.communicationAddress.pincode,
        						'city' : modelObject.communicationAddress.city,
        						'state' : modelObject.communicationAddress.state,
        						'address_line_1' : modelObject.communicationAddress.addressLine1,
        						'address_line_2' : modelObject.communicationAddress.addressLine2
        					},
        					'address_are_equal' : modelObject.addressAreEqual,
        					'address_proof_type' : modelObject.addressProofType,
        					'communication_address_type' : modelObject.communicationAddressType,
        					'email' : modelObject.email,
        					'phoneNumber' : modelObject.phoneNumber
        				};
        			
	        			if (!modelObject.addressAreEqual && modelObject.permanentAddress) {
	    					angular.extend(returnObject, {
	    						'permanent_address_proof_type' : modelObject.permanentAddressProofType,
	    						'permanent_address' : {
	        						'pincode' : permanentAddress.communicationAddress.pincode,
	        						'city' : permanentAddress.communicationAddress.city,
	        						'state' : permanentAddress.communicationAddress.state,
	        						'address_line_1' : permanentAddress.communicationAddress.addressLine1,
	        						'address_line_2' : permanentAddress.communicationAddress.addressLine2
	    						}
	    					});
	        				
	        			}

	        		return returnObject;
        		},
        		
        		deserializeModel = function(response) {
        			response.communication_address = response.communication_address || {};
        			response.permanent_address = response.permanent_address || {};
        			modelObject = {
        					permanentAddress : {
        						pincode : response.permanent_address.pincode,
        						city : response.permanent_address.city,
        						state : response.permanent_address.state,
        						addressLine1 : response.permanent_address.address_line_1,
        						addressLine2 : response.permanent_address.address_line_2
        					},
        					communicationAddress : {
        						pincode : response.communication_address.pincode,
        						city : response.communication_address.city,
        						state : response.communication_address.state,
        						addressLine1 : response.communication_address.address_line_1,
        						addressLine2 : response.communication_address.address_line_2
        					},
        					addressAreEqual : response.address_are_equal,
        					addressProofType : response.address_proof_type,
        					permanentAddressProofType : response.permanent_address_proof_type,
        					communicationAddressType : response.communication_address_type,
        					email : response.email,
        					phoneNumber : response.phoneNumber,
        					frontImageUrl : response.front_image_thumbnail,
        					backImageUrl : response.back_image_thumbnail,
        					permanentFrontImageUrl : response.permanent_front_image_thumbnail,
        					permanentBackImageUrl : response.permanant_back_image_thumbnail,
        					
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
					appConfig.API_BASE_URL+'/user/contact/info/get/', 
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
					appConfig.API_BASE_URL+'/user/contact/info/add/', 
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

            function uploadFileToServer(fileType, file) {
            	var fd = new FormData();
            		fd.append(fileType, file);
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
(function() {
    'use strict';
    angular
        .module('finApp.registerInvestor')
        .factory('bankInfoService', bankInfoService);

    bankInfoService.$inject = ['$rootScope','$resource','appConfig','$q'];
        function bankInfoService($rootScope,$resource,appConfig,$q){
        	var modelObject = {},
        	
        		serializeModel = function() {
	        		return {
	        			'account_number': modelObject.accountNumber, 
	        			'account_holder_name': modelObject.accountHolderName, 
	        			'account_type': modelObject.accountType, 
	        			'sip_check': modelObject.sipCheck,
	        			'ifsc_code': modelObject.ifscCode,
	        		};
        		},
        		
        		deserializeModel = function(response) {
        			
        			modelObject = {
        				accountNumber : response.account_number, 
	        			accountHolderName : response.account_holder_name, 
	        			accountType : response.account_type, 
	        			sipCheck : response.sip_check,
	        			ifscCode : response.ifsc_code.ifsc_code,
	        			bankName : response.ifsc_code.name,
	        			bankBranch : response.ifsc_code.bank_branch,
	        			bankAddress: response.ifsc_code.address,
	        			bankCity : response.ifsc_code.city,
	        			imageUrl : response.bank_cheque_image_thumbnail
	        		};
        			
        		},
        		
        		deserializeBankInfo = function(response) {
        			modelObject.bankName = response.name,
        			modelObject.bankBranch = response.bank_branch,
        			modelObject.bankAddress = response.address,
        			modelObject.bankCity = response.city,
        			modelObject.bank_supported = response.is_bank_supported
        		};
        	
        	
            return{
        		getSavedValues : getSavedValues,
                setSavedValues : setSavedValues,
                lookupIFSCCode : lookupIFSCCode,
                uploadFileToServer : uploadFileToServer 
        	}
            
            function getSavedValues() {
        		var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/user/investor/account/info/get/', 
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
					appConfig.API_BASE_URL+'/user/investor/account/info/post/', 
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
            		fd.append('bank_cheque_image', file);
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
            
            function lookupIFSCCode(ifscCode) {
            	var ifscData = {'ifsc_code':ifscCode};
            	
        		var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/open/bank/info/get/', 
					{}, {
						Check: {
							method:'GET',
						}
					});
				getAPI.Check(ifscData,function(data){
					if(data.status_code == 200){
						deserializeBankInfo(data.response);
						defer.resolve({'success':modelObject});
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
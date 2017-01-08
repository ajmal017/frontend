(function() {
    'use strict';
    angular
        .module('finApp.registerInvestor')
        .factory('investorInfoService', investorInfoService);

    investorInfoService.$inject = ['$rootScope','$resource','appConfig','$q'];
        function investorInfoService($rootScope,$resource,appConfig,$q){
        	var modelObject,
        	
        		serializeModel = function() {
	        		return {
	        			'country_of_birth': modelObject.countryOfBirth, 
	        			'political_exposure': modelObject.politicalExposure, 
	        			'income': modelObject.income, 
	        			'occupation_specific': modelObject.specificOccupation || '',
	        			'applicant_name': modelObject.applicantName, 
	        			'pan_number': modelObject.panNumber, 
	        			'place_of_birth': modelObject.placeOfBirth, 
	        			'father_name': modelObject.fatherName, 
	        			'investor_status': modelObject.investorStatus, 
	        			'occupation_type': modelObject.occupationType, 
	        			'other_tax_payer': modelObject.otherTaxPayer,
	        			'dob': modelObject.dob	
	        		};
        		},
        		
        		deserializeModel = function(response) {
        			
        			modelObject = {
        				countryOfBirth : response.country_of_birth || 'India',
        				politicalExposure : response.political_exposure, 
        				income : response.income || '1', 
	        			specificOccupation : response.occupation_specific,
	        			applicantName : response.applicant_name, 
	        			panNumber : response.pan_number, 
	        			placeOfBirth : response.place_of_birth, 
	        			fatherName : response.father_name, 
	        			investorStatus : response.investor_status || 'Resident Individual', 
	        			occupationType : response.occupation_type || 'PRI', 
	        			otherTaxPayer : response.other_tax_payer,
	        			dob : response.dob,
	        			imageUrl : response.pan_image_thumbnail,
	        			kycStatus : $rootScope.userFlags['user_flags']['kra_verified']
	        		};
        			
        		};
        	
        	
            return{
        		getSavedValues : getSavedValues,
                setSavedValues : setSavedValues,
                getKYCStatus : getKYCStatus,
                uploadFileToServer : uploadFileToServer,
                initializeModel : initializeModel
        	}
            
    		function initializeModel() {
    			return {
    				occupationType : '', 
    				income : '',
    				countryOfBirth : 'India',
    				investorStatus : 'Resident Individual', 
	        		};
    		}

            function getSavedValues() {
        		var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/user/investor/info/get/', 
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
					appConfig.API_BASE_URL+'/user/investor/info/add/', 
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
            		fd.append('pan_image', file);
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
            
            function getKYCStatus(panNumber) {
            	var panData = {'pan_number':panNumber};
            	
        		var defer = $q.defer();
				var postAPI = $resource( 
					appConfig.API_BASE_URL+'/open/verifiable/kyc/', 
					{}, {
						Check: {
							method:'POST',
						}
					});
				postAPI.Check(panData,function(data){
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
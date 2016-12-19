(function() {
    'use strict';
    angular
        .module('finApp.registerInvestor')
        .factory('investorInfoService', investorInfoService);

    investorInfoService.$inject = ['$rootScope','$resource','appConfig','$q'];
        function registerInvestorService($rootScope,$resource,appConfig,$q){
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
        				countryOfBirth : response.country_of_birth,
        				politicalExposure : response.political_exposure, 
        				income : response.income, 
	        			specificOccupation : response.occupation_specific,
	        			applicantName : response.applicant_name, 
	        			panNumber : response.pan_number, 
	        			placeOfBirth : response.place_of_birth, 
	        			fatherName : response.father_name, 
	        			investorStatus : response.investor_status, 
	        			occupationType : response.occupation_type, 
	        			otherTaxPayer : response.other_tax_payer,
	        			dob : response.dob	
	        		};
        			
        		};
        	
        	
            return{
        		getSavedValues : getSavedValues,
                setSavedValues : setSavedValues,
                getKYCStatus : getKYCStatus,
                uploadFileToServer : uploadFileToServer 
        	}
            
            function getSavedValues() {
            	if (!modelObject) {
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
                else {
                	defer.resolve({'success':modelObject});
                }
            }

            function setSavedValues() {
            	if (!modelObject) {
            		return;
            	}

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
            	var saveData = {'pan_image': file};
            	
        		var defer = $q.defer();
				var postAPI = $resource( 
					appConfig.API_BASE_URL+'/user/save/image/', 
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
        }        
})();
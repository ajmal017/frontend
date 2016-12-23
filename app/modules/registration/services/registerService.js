(function() {
    'use strict';
    angular
        .module('finApp.registration')
        .factory('registerService', registerService);

        registerService.$inject = ['$resource','appConfig','$q'];
        function registerService($resource,appConfig,$q){
        	return{
        		registerUser : registerUser,
        		confirmOtp : confirmOtp,
        		resendOtp : resendOtp
        	}

	        function registerUser(params){
				var defer = $q.defer();
				var postAPI = $resource( 
					appConfig.API_BASE_URL+'/user/register/', 
					{}, {
						Check: {
							method:'POST',
						}
					});
				postAPI.Check(params,function(data){
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

	        function confirmOtp(params,tokens){
	        	var defer = $q.defer();
				var postAPI = $resource( 
					appConfig.API_BASE_URL+'/user/verify/phone/', 
					{}, {
						Check: {
							method:'POST',
							headers: { 
								'Authorization': 'Bearer '+tokens['access_token']
							}
						}
					});
				postAPI.Check(params,function(data){
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

	        function resendOtp(params){
	        	var defer = $q.defer();
				var postAPI = $resource( 
					appConfig.API_BASE_URL+'/user/resend/verify/phone/', 
					{}, {
						Check: {
							method:'POST',
							headers: { 
								'Authorization': params['token_type']+' '+params['access_token']
							}
						}
					});
				postAPI.Check({},function(data){
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
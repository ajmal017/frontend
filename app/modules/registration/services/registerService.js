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
        		resendOtp : resendOtp,
        		verifyEmail : verifyEmail,
        		resendEmailVerify : resendEmailVerify,
        		sendOtp : sendOtp,
        		verifyOTP : verifyOTP,
        		changeEmail : changeEmail,
        		changePassword : changePassword
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
						defer.resolve({'Message':data.response['message'], 'Error':data.error});
					}				
				}, function(err){
					defer.reject(err);
				}); 
				return defer.promise;
	        }

	        function confirmOtp(params,tokens){
	        	var requestData = {'sms_code' : parseInt(params.sms_code)};
	        	var defer = $q.defer();
				var postAPI = $resource( 
					appConfig.API_BASE_URL+'/user/verify/phone/', 
					{}, {
						Check: {
							method:'POST',
							headers: { 
								'Authorization': tokens['token_type']+' '+tokens['access_token']
							}
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

	        function sendOtp(){
	        	var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/user/resend/verify/phone/', 
					{}, {
						Check: {
							method:'POST',
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

	        function verifyOTP(otp){
	        	var defer = $q.defer();
	        	var parsedOtp = parseInt(otp);
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/user/verify/phone/', 
					{}, {
						Check: {
							method:'POST',
						}
					});
				getAPI.Check({'sms_code': parsedOtp},function(data){
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

	        function verifyEmail(email){
	        	var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/user/email/status/', 
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

	        function resendEmailVerify(){
	        	var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/user/resend/verify/email/', 
					{}, {
						Check: {
							method:'POST',
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

	        function changeEmail(email){
	        	var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/user/change/email/', 
					{}, {
						Check: {
							method:'POST',
						}
					});
				getAPI.Check({"email":email},function(data){
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

	        function changePassword(oldPassword, newPassword){
	        	var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/user/change/password/', 
					{}, {
						Check: {
							method:'POST',
						}
					});
				getAPI.Check({"old_password":oldPassword, "new_password":newPassword},function(data){
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
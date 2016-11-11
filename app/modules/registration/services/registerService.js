(function() {
    'use strict';
    angular
        .module('finApp.registration')
        .factory('registerService', registerService);

        registerService.$inject = ['$resource','appConfig','$q'];
        function registerService($resource,appConfig,$q){
        	return{
        		registerUser : registerUser,
        		confirmOtp : confirmOtp
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

	        function confirmOtp(params){
	        	var defer = $q.defer();
				var postAPI = $resource( 
					appConfig.API_BASE_URL+'/user/verify/phone', 
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
        }        
})();
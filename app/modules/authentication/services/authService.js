(function() {
    'use strict';
    angular
        .module('finApp.auth')
        .factory('authService', authService);

        authService.$inject = ['$resource','appConfig','$q'];
        function authService($resource,appConfig,$q){
        	return{
        		verifyLogin : verifyLogin,
        	}

	        function verifyLogin(params){
				var defer = $q.defer();
				var postAPI = $resource( 
					appConfig.API_BASE_URL+'/user/login/', 
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
(function(){
	'use strict';
	angular
		.module('finApp.auth')
		.controller('authController',authController);

		authController.$inject = ['$scope','$rootScope','$location','userDetailsService','authService','riskService']
		function authController($scope,$rootScope,$location,userDetailsService,authService,riskService){
			$scope.verifyLogin = function(user){
				authService.verifyLogin(user).then(function(data){
					if('success' in data){
						authService.submitSuccess(data).then(function(data){
							userDetailsService().then(function(userData){
								$rootScope.$broadcast('refreshCredentials',userData['success'])
								$location.path('/dashboard');
							});
						});		
					}else{
						$scope.errorMessage = data['Message'];
					}
				});
			}
		}
})();
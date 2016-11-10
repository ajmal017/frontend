(function(){
	'use strict';
	angular
		.module('finApp.auth')
		.controller('authController',authController);

		authController.$inject = ['$scope','$location','authService']
		function authController($scope,$location,authService){
			$scope.verifyLogin = function(user){
				authService.verifyLogin(user).then(function(data){
					if('success' in data){
						$location.path('/riskAssesment');
					}
				});
			}
		}
})();
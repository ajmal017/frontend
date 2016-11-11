(function(){
	'use strict';
	angular
		.module('finApp.registration')
		.controller('registerController',registerController);

		registerController.$inject = ['$scope','$location','registerService']
		function registerController($scope,$location,registerService){
			$scope.userRegister = function(user){
				registerService.registerUser(user).then(function(data){
					if('success' in data){
						$('#otpModal').modal('show');
					}
				});
			}
			$scope.confirmOtp = function(otp){
				registerService.confirmOtp(otp).then(function(data){
					if('success' in data){
						$('#otpModal').modal('hide');
						setTimeout(function(){
							$location.path('/');
						},3000);						
					}
				})
			}
		}
})();
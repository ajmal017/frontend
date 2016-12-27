(function(){
	'use strict';
	angular
		.module('finApp.registration')
		.controller('registerController',registerController);

		registerController.$inject = ['$scope','$rootScope','$location','userDetailsService','registerService','authService']
		function registerController($scope,$rootScope,$location,userDetailsService,registerService,authService){
			$scope.userRegister = function(user){
				registerService.registerUser(user).then(function(data){
					if('success' in data){
						$scope.succesData = data['success'];
						$('#otpModal').modal('show');
					}
					else {
						$scope.signupError = data.Message + ' ' + data.Error;
					}
				});
			}
			
			$scope.resendOtp = function(){
				registerService.resendOtp($scope.succesData['tokens']).then(function(data){
					alert(JSON.stringify(data));
				})
			}

			$scope.confirmOtp = function(otp){
				registerService.confirmOtp(otp,$scope.succesData['tokens']).then(function(data){
					if('success' in data){
						$('#otpModal').modal('hide');
						setTimeout(function(){
							authService.submitSuccess({'success':$scope.succesData}).then(function(data){
								userDetailsService().then(function(userData){
									$rootScope.$broadcast('refreshCredentials',userData['success'])
									$location.path('/dashboard');
									if(!$scope.$$phase)	$scope.$apply(); 
								});
							})
						},1000);						
					}else{
						$scope.errorOtp = data['Message'];
					}
				})
			}
			$scope.gotoLogin = function(){
				$('#otpModal').modal('hide');
				setTimeout(function(){
					$location.path('/');
					if(!$scope.$$phase)	$scope.$apply(); 
				},1000);
			}
		}
})();
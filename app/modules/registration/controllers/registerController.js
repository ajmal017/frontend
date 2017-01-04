(function(){
	'use strict';
	angular
		.module('finApp.registration')
		.controller('registerController',registerController);

		registerController.$inject = ['$scope','$rootScope','$location','userDetailsService','registerService','authService','GoogleSignin','ngDialog']
		function registerController($scope,$rootScope,$location,userDetailsService,registerService,authService, GoogleSignin, ngDialog){
			this.scope = $scope;

			this.rootScope = $rootScope;
			this.location = $location;
			this.userDetailsService = userDetailsService;
			this.authService = authService;
			this.registerService = registerService;
			this.GoogleSignin = GoogleSignin;
			this.ngDialog = ngDialog;			
			
			var self = this;

			this.scope.completeLogin = angular.bind( this, this.completeLogin );
			
			this.scope.completeGoogleLogin = angular.bind( this, this.completeGoogleLogin );

			this.scope.registerPhone = angular.bind( this, this.registerPhone );

			this.scope.processGoogleRegister = angular.bind( this, this.processGoogleRegister );

			this.scope.mergeAccounts = angular.bind( this, this.mergeAccounts );

			this.scope.cancelGoogleAccountMerge = angular.bind( this, this.cancelGoogleAccountMerge );

			this.scope.confirmGoogleAccountMerge = angular.bind( this, this.confirmGoogleAccountMerge );

			this.scope.processGoogleAccountMerge = angular.bind( this, this.processGoogleAccountMerge );

			this.scope.googleSignIn = angular.bind( this, this.googleSignIn );

			this.scope.googleRegisterResendOtp = angular.bind( this, this.googleRegisterResendOtp );

			this.scope.googleRegisterConfirmOtp = angular.bind( this, this.googleRegisterConfirmOtp );

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
		
		registerController.prototype = finApp.authControllerPrototype;
})();
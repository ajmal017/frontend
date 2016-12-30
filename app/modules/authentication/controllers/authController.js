(function(){
	'use strict';
	angular
		.module('finApp.auth')
		.controller('authController',authController);

		authController.$inject = ['$scope','$rootScope','$location','userDetailsService','authService','riskService','GoogleSignin','ngDialog']
		function authController($scope,$rootScope,$location,userDetailsService,authService,riskService,GoogleSignin,ngDialog){
			
			$scope.completeLogin = function(data) {
				if('success' in data){
					authService.submitSuccess(data).then(function(data){
						userDetailsService().then(function(userData){
							$rootScope.$broadcast('refreshCredentials',userData['success']);
							$location.path('/dashboard');
						});
					});		
				}else{
					$scope.errorMessage = data['Message'];
				}
			}
			
			$scope.verifyLogin = function(user){
				authService.verifyLogin(user).then(function(data){
					$scope.completeLogin(data);
				});
			}

			$scope.completeGoogleLogin = function() {
				$('#otpModal').modal('hide');
				$scope.completeLogin($scope.registerSuccessData);
			}
			
			$scope.registerPhone = function(mobileNumber) {
				if (mobileNumber) {
					$scope.googleAuthParams['phone_number'] = mobileNumber;
					authService.googleRegister($scope.googleAuthParams).then(function(data) {
						if ('success' in data) {
							ngDialog.closeAll();
							$scope.registerSuccessData = data;
							$('#otpModal').modal('show');
						}
						else {
							$scope.errorPhone = data["Message"];
						}
					});
				}
			}

			$scope.processGoogleRegister = function() {
				$scope.ngDialog = ngDialog;
				ngDialog.open({ 
		        	template: 'modules/authentication/views/google_registration.html', 
		        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
		        	overlay: false,
		        	showClose : false,

		        	scope: $scope
	        	});
			}
			
			$scope.mergeAccounts = function(user) {
				$scope.googleAuthParams['password'] = user.password;
				authService.googleRegisterExistingUser($scope.googleAuthParams).then(function(data) {
					if ('success' in data) {
						ngDialog.closeAll();
						$scope.completeLogin(data);
					}
					else {
						$scope.errorMessage = data['Message'];
					}

				});
			}
			
			$scope.confirmAccountMerge = function() {
				ngDialog.closeAll();
				
		        ngDialog.open({ 
		        	template: 'modules/authentication/views/confirmMergeLogin.html', 
		        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
		        	overlay: false,
		        	showClose : true,

		        	scope: $scope
		        });
			}
			$scope.processGoogleAccountMerge = function() {
				$scope.modalErrorMessage = 'You have an existing FinAskus account with the same Google email. Your Google account will be merged with the FinAskus account. \n Please proceed to validate your existing FinAskus account.';
		        ngDialog.open({ 
		        	template: 'modules/authentication/views/confirmMerge.html', 
		        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
		        	overlay: false,
		        	showClose : true,

		        	scope: $scope
		        });

			}
			
			$scope.googleSignIn = function(){
//				GoogleSignin.signIn().then(function (user) {
				GoogleSignin.signIn().then(function (user) {
					var authResponse = user.getAuthResponse(),
					profile = user.getBasicProfile();
					GoogleSignin.grantOfflineAccess({'authuser':authResponse.session_state.extraQueryParams.authuser, 
						'scope': 'profile email','redirect_uri': 'postmessage'}).then(function(authResult) {
						var accessToken = authResult.code;
					
						$scope.googleAuthParams = {'auth_code':accessToken, 'email': profile.getEmail()};
						authService.googleLogin($scope.googleAuthParams).then(function(data) {
							if('success' in data){
								var userStatus = data['success']['user_status'];
								
								if (userStatus == 2) {
									$scope.completeLogin(data);
								}
								else if (userStatus == 3) {
									$scope.processGoogleRegister();
								}
								else if (userStatus == 4) {
									$scope.processGoogleAccountMerge();
								}
							}
						});
						
						console.log(JSON.stringify(user));

					});
		        }, function (err) {
		            alert(JSON.stringify(err));
		        });
			}
			
			$scope.resendOtp = function(){
				registerService.resendOtp($scope.registerSuccessData['tokens']).then(function(data){
					alert(JSON.stringify(data));
				})
			}

			$scope.confirmOtp = function(otp){
				registerService.confirmOtp(otp,$scope.registerSuccessData['tokens']).then(function(data){
					if('success' in data){
						$('#otpModal').modal('hide');
						setTimeout(function(){
							$scope.completeLogin($scope.registerSuccessData);
						},1000);						
					}else{
						$scope.errorOtp = data['Message'];
					}
				})
			}

		}
})();
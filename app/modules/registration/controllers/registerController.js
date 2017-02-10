(function(){
	'use strict';
	angular
		.module('finApp.registration')
		.controller('registerController',registerController);

		registerController.$inject = ['$scope','$rootScope','$location','userDetailsService','registerService','authService','GoogleSignin','ngDialog', 'busyIndicator']
		function registerController($scope,$rootScope,$location,userDetailsService,registerService,authService, GoogleSignin, ngDialog, busyIndicator){
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
				if (user) {
					user.is_web = true;
				}

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

			if($location.$$path == "/settings"){
				userDetailsService().then(function(userData){
					$rootScope.userDetails = JSON.parse(sessionStorage.getItem('userDetails'))||{};
					$scope.settingsDetails = $rootScope.userDetails.user;
					$scope.settingsDetails.email_verified = userData.success.user_flags.email_verified;
					$scope.settingsDetails.phone_number_verified = userData.success.user_flags.phone_number_verified;
					$rootScope.userDetails.user.phone_number_verified = $scope.settingsDetails.phone_number_verified;
					$rootScope.userDetails.user.email_verified = $scope.settingsDetails.email_verified;
					sessionStorage.setItem('userDetails',JSON.stringify($rootScope.userDetails)); 
				});
			}
			$scope.verify = function(type) {
				// $scope.processGoogleRegister = function() {
				// 	$scope.ngDialog = ngDialog;
				// 	ngDialog.open({ 
			 //        	template: 'modules/authentication/views/google_registration.html', 
			 //        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
			 //        	overlay: false,
			 //        	showClose : false,

			 //        	scope: $scope
		  //       	});
				// }
				if(type == 'mobile'){
					var mobile = $rootScope.userDetails.user.phone_number;

					registerService.sendOtp().then(function(data){
						if('success' in data){
							ngDialog.open({ 
					        	template: 'modules/registration/views/enter_otp.html', 
					        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
					        	overlay: false,
					        	showClose : false,

					        	scope: $scope
				        	});
							
						} else {

						}
					});
				}
				if(type == 'email'){
					var email = $rootScope.userDetails.user.email;
					busyIndicator.show();
					registerService.verifyEmail(email).then(function(data) {
						if('success' in data){
							if(data.success['email_verified'] == false){
								registerService.resendEmailVerify().then(function(data){
									if('success' in data){
										busyIndicator.hide();
										$scope.errorPopupMessage = data.success['message'];
										$scope.ngDialog = ngDialog;
										ngDialog.open({ 
								        	template: 'modules/common/views/partials/error_popup.html', 
								        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
								        	overlay: false,
								        	showClose : false,

								        	scope: $scope
							        	});
									} else {

									}
								})
							}
						} else {

						}
					})
				}
			}

			$scope.validateOtp = function(otp){
				registerService.verifyOTP(otp).then(function(data){
					if('success' in data){
						$rootScope.userDetails.user.phone_number_verified = true;
						$scope.settingsDetails = $rootScope.userDetails.user;
						sessionStorage.setItem('userDetails',JSON.stringify($rootScope.userDetails)); 
						ngDialog.closeAll();
					} else {
						$scope.errorOtpSettings = data.Message;
					}
				})
			}

			$scope.enterNewEmail = function(){


				ngDialog.open({ 
		        	template: 'modules/registration/views/change_email.html', 
		        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
		        	overlay: false,
		        	showClose : false,

		        	scope: $scope
	        	});
			}

			$scope.changeEmail = function(email){
				busyIndicator.show();
				registerService.changeEmail(email).then(function(data){
					busyIndicator.hide();
					ngDialog.closeAll();
					if('success' in data){
						$rootScope.userDetails.user.email = data.success.email;
						$scope.settingsDetails = $rootScope.userDetails.user;
						sessionStorage.setItem('userDetails',JSON.stringify($rootScope.userDetails)); 
					}else{

					}
				})
			}

			$scope.enterNewPassword = function(){
				ngDialog.open({ 
		        	template: 'modules/registration/views/change_password.html', 
		        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
		        	overlay: false,
		        	showClose : false,

		        	scope: $scope
	        	});
			}

			$scope.changePassword = function(oldPassword, newPassword){
				registerService.changePassword(oldPassword, newPassword).then(function(data){
					if('success' in data){
						ngDialog.closeAll();
					}else{
						$scope.errorPasswordSettings = data.Message;
					}
				})
			}
		}
		
		registerController.prototype = finApp.authControllerPrototype;
})();
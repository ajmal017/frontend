var finApp = finApp || {};
(function(){
	'use strict';
	
	finApp.authControllerPrototype = {
			completeLogin : function(data) {
				var self = this;
				if('success' in data){
					this.authService.submitSuccess(data).then(function(data){
						self.userDetailsService().then(function(userData){
							self.rootScope.$broadcast('refreshCredentials',userData['success']);
							self.location.path('/dashboard');
						});
					});		
				}else{
					this.scope.errorMessage = data['Message'] + " " + data['Error'];
				}
			},
			
			completeGoogleLogin : function() {
				this.ngDialog.closeAll();
				this.scope.completeLogin(this.scope.registerSuccessData);
			},
			
			registerPhone : function(mobileNumber) {
				var self = this;
				if (mobileNumber) {
					this.scope.googleAuthParams['phone_number'] = mobileNumber;
					this.authService.googleRegister(this.scope.googleAuthParams).then(function(data) {
						if ('success' in data) {
							self.ngDialog.closeAll();
							self.scope.registerSuccessData = data;
							self.ngDialog.open({ 
					        	template: 'modules/authentication/views/googleOtp.html', 
					        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
					        	overlay: false,
					        	showClose : false,

					        	scope: self.scope
				        	});
						}
						else {
							self.scope.errorPhone = data['Message'] + " " + data['Error'];
						}
					});
				}
			},

			processGoogleRegister : function() {
				this.scope.ngDialog = this.ngDialog;
				this.ngDialog.open({ 
		        	template: 'modules/authentication/views/googleRegistration.html', 
		        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
		        	overlay: false,
		        	showClose : false,

		        	scope: this.scope
	        	});
			},
			
			mergeAccounts : function(user) {
				var self = this;
				this.scope.googleAuthParams['password'] = user.password;
				this.authService.googleRegisterExistingUser(this.scope.googleAuthParams).then(function(data) {
					if ('success' in data) {
						self.ngDialog.closeAll();
						self.scope.completeLogin(data);
					}
					else {
						self.scope.errorMessage = data['Message'] + " " + data['Error'];
					}

				});
			},
			
			cancelGoogleAccountMerge : function() {
				this.ngDialog.closeAll();
			},
			
			confirmGoogleAccountMerge : function() {
				this.ngDialog.closeAll();
				
		        this.ngDialog.open({ 
		        	template: 'modules/authentication/views/confirmMergeLogin.html', 
		        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
		        	overlay: false,
		        	showClose : false,

		        	scope: this.scope
		        });
			},
			
			processGoogleAccountMerge : function() {
				this.scope.modalMessage = 'You have an existing FinAskus account with the same Google email.\r Your Google account will be merged with the FinAskus account. \r\n Please proceed to validate your existing FinAskus account.';
		        this.ngDialog.open({ 
		        	template: 'modules/authentication/views/confirmMerge.html', 
		        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
		        	overlay: false,
		        	showClose : false,

		        	scope: this.scope
		        });

			},
			
			googleSignIn : function(){
				var self = this,
					accessToken, profile;
				
				var doLogin = function() {
					self.scope.googleAuthParams = {'auth_code':accessToken, 'email': profile.getEmail(), 'is_web': true,
							'image':profile.getImageUrl()};
					self.authService.googleLogin(self.scope.googleAuthParams).then(function(data) {
						if('success' in data){
							var userStatus = data['success']['user_status'];
							
							if (userStatus == 2) {
								self.scope.completeLogin({'success':data['success']['res']});
							}
							else if (userStatus == 3) {
								self.scope.processGoogleRegister();
							}
							else if (userStatus == 4) {
								self.scope.processGoogleAccountMerge();
							}
						}
						else {
							self.scope.errorMessage = data['Message'] + " " + data['Error'];
						}
					});
				};
				
				var isSafari = (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1 && navigator.userAgent.indexOf('Android') == -1);
				
				if (isSafari) {
					self.GoogleSignin.grantOfflineAccess({'scope' : 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile', 
						'scopes' : 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile', 'redirect_uri': 'postmessage',
						'approval_prompt' : 'force'}).then(function(authResult) {
							accessToken = authResult.code;
							var user = self.GoogleSignin.getUser();
							profile = user.getBasicProfile();
							
							if (profile) {
								doLogin();
							}	
						}, function (err) {
							console.log(err);
						});
				}
				else {
					self.GoogleSignin.signIn().then(function (user) {
						var authResponse = user.getAuthResponse();
						
						profile = user.getBasicProfile();
						self.GoogleSignin.grantOfflineAccess({'authuser':authResponse.session_state.extraQueryParams.authuser, 
							'scopes' : 'https://www.googleapis.com/auth/userinfo.email', 'redirect_uri': 'postmessage'}).then(function(authResult) {
							accessToken = authResult.code;
							
							doLogin();
						}, function (err) {
							console.log(err);
						});
			        }, function (err) {
			            console.log(JSON.stringify(err));
			        });
				}
			},

			googleRegisterResendOtp : function(){
				this.registerService.resendOtp(this.scope.registerSuccessData['success']['tokens']).then(function(data){
					alert(JSON.stringify(data));
				})
			},

			googleRegisterConfirmOtp : function(otp){
				var self = this;
				this.registerService.confirmOtp(otp,this.scope.registerSuccessData['success']['tokens']).then(function(data){
					if('success' in data){
						self.ngDialog.closeAll();
						setTimeout(function(){
							self.scope.completeLogin(self.scope.registerSuccessData);
						},1000);						
					}else{
						self.scope.errorOtp = data['Message'];
					}
				});
			},

		
	};
			

})();
(function(){
	'use strict';
	angular
		.module('finApp.auth')
		.controller('authController',authController);

		authController.$inject = ['$scope','$rootScope','$location','userDetailsService','authService','registerService','GoogleSignin','ngDialog']
		function authController($scope,$rootScope,$location,userDetailsService,authService,registerService,GoogleSignin,ngDialog){
			
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

			$scope.verifyLogin = function(user){
				if (user) {
					user.is_web = true;
				}
				
				authService.verifyLogin(user).then(function(data){
					$scope.completeLogin(data);
				});
			}
		}
		authController.prototype = finApp.authControllerPrototype;
})();
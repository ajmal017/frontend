(function(){
	'use strict';
	angular
		.module('finApp.auth')
		.controller('authController',authController);

		authController.$inject = ['$scope','$rootScope','$location','userDetailsService','authService','riskService','GoogleSignin']
		function authController($scope,$rootScope,$location,userDetailsService,authService,riskService,GoogleSignin){
			$scope.verifyLogin = function(user){
				authService.verifyLogin(user).then(function(data){
					if('success' in data){
						authService.submitSuccess(data).then(function(data){
							userDetailsService().then(function(userData){
								$rootScope.$broadcast('refreshCredentials',userData['success']);
								if(userData.success.user_answers.risk_score) {
									$rootScope.userRiskFactor = userData.success.user_answers.risk_score;
								} else {
									$rootScope.userRiskFactor = '7.0';
								}
								$location.path('/dashboard');
							});
						});		
					}else{
						$scope.errorMessage = data['Message'];
					}
				});
			}
			$scope.googleSignIn = function(){
				GoogleSignin.signIn().then(function (user) {
		            console.log(JSON.stringify(user));
		        }, function (err) {
		            alert(JSON.stringify(err));
		        });
			}
		}
})();
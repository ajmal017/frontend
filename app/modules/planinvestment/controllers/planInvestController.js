(function(){
	'use strict';
	angular
		.module('finApp.planInvest')
		.controller('planInvestController',planInvestController);

		planInvestController.$inject = ['$scope','$rootScope','$location','planInvestService', 'userDetailsService', 'appConfig']
		function planInvestController($scope,$rootScope,$location,planInvestService,userDetailsService, appConfig){
			$scope.startGoalAdd = function(currentGoal) {
				$rootScope.currentGoal = currentGoal;
				var goalRedirect = '';
				if(currentGoal == 'invest') {
					goalRedirect = 'quickInvestStart';
				} else if(currentGoal == 'tax') {
					goalRedirect = 'taxsavingStarted';
				}
 				
				$location.path('/'+goalRedirect);
			}

			$scope.callCompleteness = function() {
				userDetailsService().then(function(userData){
					sessionStorage.setItem('userFlags', JSON.stringify(userData.success));
					$rootScope.userFlags = JSON.parse(sessionStorage.getItem('userFlags'))||{};
					console.log('$rootScope.userFlags',$rootScope.userFlags);
					if(userData.success.user_answers.risk_score) {
						$rootScope.userRiskFactor = userData.success.user_answers.risk_score;
					} else {
						$rootScope.userRiskFactor = '7.0';
					}
				});
			}

			$scope.callCompleteness();

			$scope.goalAnswered = function() {
				var user_flags = $rootScope.userFlags.user_flags;
				$rootScope.goalAnswered = {};
				appConfig.otherGoals.forEach(function(data) {
					console.log('user flags',user_flags[data]);
					$rootScope.goalAnswered[data] = user_flags[data];
				});
				console.log('goalAnswered',$rootScope.goalAnswered);
			}

			$scope.goalAnswered();

			$scope.financialGoalAnswered = function() {
				var user_flags = $rootScope.userFlags.user_flags;
				$scope.finGoalAnswered = '';
				appConfig.financialGoals.forEach(function(data) {
					
				});
			}
		}
})();
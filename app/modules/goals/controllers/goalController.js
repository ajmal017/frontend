(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('goalsController',goalsController);

		goalsController.$inject = ['$scope','$rootScope','$location','goalsService', 'appConfig', 'userDetailsService']
		function goalsController($scope,$rootScope,$location,goalsService, appConfig, userDetailsService){
			$scope.callCompleteness = function() {
				userDetailsService().then(function(userData){
					sessionStorage.setItem('userFlags', JSON.stringify(userData.success));
					if(userData.success.user_answers.risk_score) {
						$rootScope.userRiskFactor = userData.success.user_answers.risk_score;
					} else {
						$rootScope.userRiskFactor = '7.0';
					}
					$rootScope.userFlags = JSON.parse(sessionStorage.getItem('userFlags'))||{};
					console.log('$rootScope.userFlags',$rootScope.userFlags);
				});
			}

			$scope.callCompleteness();

			$scope.startGoalAdd = function(currentGoal) {
				$rootScope.currentGoal = currentGoal;
				var goalRedirect = '';
				if(currentGoal == 'retirement'){
					goalRedirect = currentGoal + 'GoalsStarted';
				} else if(currentGoal == 'event'){
					goalRedirect = 'othersStarted';
				}
				else {
					goalRedirect = currentGoal + 'Started';
				}
				$location.path('/'+goalRedirect);
			}

			$scope.goalAnswered = function() {
				var user_flags = $rootScope.userFlags.user_flags;
				$rootScope.goalAnswered = {};
				appConfig.currentGoals.forEach(function(data) {
					console.log('user flags',user_flags[data]);
					$rootScope.goalAnswered[data] = user_flags[data];
				});
				console.log('goalAnswered',$rootScope.goalAnswered);
			}

			$scope.goalAnswered();
		}
})();
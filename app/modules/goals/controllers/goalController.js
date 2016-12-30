(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('goalsController',goalsController);

		goalsController.$inject = ['$scope','$rootScope','$location','goalsService', 'appConfig', 'userDetailsService', 'busyIndicator', 'ngDialog']
		function goalsController($scope,$rootScope,$location,goalsService, appConfig, userDetailsService, busyIndicator, ngDialog){
			$scope.callCompleteness = function() {
				userDetailsService().then(function(userData){
					$scope.goalAnswered(); 
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
				appConfig.financialGoals.forEach(function(data) {
					console.log('user flags',user_flags[data]);
					$rootScope.goalAnswered[data] = user_flags[data];
				});
				console.log('goalAnswered',$rootScope.goalAnswered);
			}

			

			$scope.deleteGoal = function (currentGoal) {
					$scope.modalErrorMessage = 'Are you sure you want to delete this goal?';
					$scope.currentGoal = currentGoal;
					$scope.ngDialog = ngDialog;
			        ngDialog.openConfirm({ 
			        	template: '/modules/common/views/partials/confirmText.html', 
			        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
			        	overlay: false,
			        	showClose : false,

			        	scope: $scope
			        }).then(function(confirm){
			        	$scope.confirmDeleteGoal(currentGoal);
			        }, function(reject){

			        });
			    };

			$scope.confirmDeleteGoal = function(currentGoal){
				ngDialog.closeAll();
				busyIndicator.show();
				
				goalsService.deleteParticularGoal(currentGoal).then(function(data){
					busyIndicator.hide();
						if('success' in data){
							console.log('Goal deleted successfully');
							$scope.callCompleteness();
							
							
						} else {

						}
				})
			}
		}
})();
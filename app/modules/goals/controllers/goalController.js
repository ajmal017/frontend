(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('goalsController',goalsController);

		goalsController.$inject = ['$scope','$rootScope','$location','$filter','goalsService', 'appConfig', 'userDetailsService', 'busyIndicator', 'ngDialog', 'investWithdrawService']
		function goalsController($scope,$rootScope,$location,$filter,goalsService, appConfig, userDetailsService, busyIndicator, ngDialog, investWithdrawService){
			$scope.callCompleteness = function() {
				userDetailsService().then(function(userData){
					$scope.goalAnswered(); 
				});
			}

			$scope.callCompleteness();
			sessionStorage.removeItem('goalDetailsTemp');
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
			        	template: 'modules/common/views/partials/confirmText.html', 
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
				});
			};
			
			$scope.goToInvest = function() {
				$rootScope.legends = [];
				var canInvest = true;

				if($rootScope.userFlags['user_flags']['portfolio'] == false) {
					canInvest = false;
					$scope.errorPopupMessage = 'You have to add goals before you can invest.';
					//$scope.redirectPath = '/goals';	

				} else if($rootScope.userFlags['user_flags']['kra_verified'] == false) {
					canInvest = false;
					$scope.errorPopupMessage = 'You are not KRA verified. Kindly contact FinAskus team.';
					//$scope.redirectPath = '/dashboard';	
				} else if($rootScope.userFlags['user_flags']['vault'] == false){
					canInvest = false;
					$scope.errorPopupMessage = 'You have to complete investor registration before you can invest';
					//$scope.redirectPath = '/registerInvestorStart';
				} 

				if(canInvest == false){
					$scope.ngDialog = ngDialog;
					ngDialog.open({ 
			        	template: 'modules/common/views/partials/error_popup.html', 
			        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
			        	overlay: false,
			        	showClose : false,

			        	scope: $scope,
			        	preCloseCallback:function(){
			        	//	$location.path($scope.redirectPath);
			        	}
		        	});
				}

				if(canInvest == true) {	
					investWithdrawService.getInvestDetails().then(function(data){
						if('success' in data) {
							$rootScope.sipTotal = 0;
							$rootScope.lumpSumTotal = 0;
							$rootScope.overall_total_sum = data.success['overall_total_sum'];
							$rootScope.recommended_schemes = data.success['goals_recommended_schemes'];
							$rootScope.recommended_schemes.forEach(function(data) {
								$rootScope.sipTotal+= data.goal_summary.sip;
								$rootScope.lumpSumTotal+= data.goal_summary.lumpsum;
							});	
							$scope.overall_allocation = data.success['overall_allocation'];
							$rootScope.resultPercentage = [
								['Equity',   $scope.overall_allocation.equity.percentage],
								['Debt',     $scope.overall_allocation.debt.percentage],
								['ELSS',     $scope.overall_allocation.elss.percentage],
								['LIQUID',     $scope.overall_allocation.liquid.percentage]
							];
							var colors = ['#0580c3', '#0c4f74', '#f26928', '#87350f'];
							var price = [$scope.overall_allocation.equity.amount, $scope.overall_allocation.debt.amount, $scope.overall_allocation.elss.amount, $scope.overall_allocation.liquid.amount];
							for(var i=0;i<$rootScope.resultPercentage.length;i++){
								var legendObject = {};
								legendObject['name'] = $rootScope.resultPercentage[i][0];
								legendObject['value'] = $rootScope.resultPercentage[i][1];
								legendObject['price'] = price.splice(0,1).toString();
								legendObject['color'] = colors.splice(0,1).toString();
								legendObject['borderColor'] = '10px solid '+legendObject['color'];
								$rootScope.legends.push(legendObject);
							}
							$rootScope.pieTitle = "<span class='currency'>&#8377;</span><span class='content'><span>" + $filter('amountSeffix')($rootScope.overall_total_sum) + " </span>";
							$location.path('/investStep1');
							
						} else {
							
						}
					});
				}
			}

		}
})();
(function(){
	'use strict';
	angular
		.module('finApp.planInvest')
		.controller('planInvestController',planInvestController);

		planInvestController.$inject = ['$scope','$rootScope','$location','planInvestService', 'userDetailsService', 'appConfig', 'goalsService', 'ngDialog', 'busyIndicator', 'investWithdrawService', '$filter']
		function planInvestController($scope,$rootScope,$location,planInvestService,userDetailsService, appConfig, goalsService, ngDialog, busyIndicator, investWithdrawService, $filter){
			
			sessionStorage.removeItem('goalDetailsTemp');
			$scope.getSumValues = function(){
				if(!jQuery.isEmptyObject($rootScope.userFlags)){
					$rootScope.is_bank_supported = $rootScope.userFlags.user_flags.is_bank_supported;
					$scope.quickInvestAmt = $rootScope.userFlags.user_answers.invest.lumpsum + ($rootScope.userFlags.user_answers.invest.sip * 12)
					$scope.taxAmtInvested = $rootScope.userFlags.user_answers.tax.amount_invested;
					$scope.liqAmtInvested = $rootScope.userFlags.user_answers.liquid.amount_invested;
				}
			}
			

			
			$scope.startGoalAdd = function(currentGoal) {
				$rootScope.currentGoal = currentGoal;
				var goalRedirect = '';
				$rootScope.currentGoal = currentGoal;
				sessionStorage.setItem('currentGoal', $rootScope.currentGoal);
				if(currentGoal == 'invest') {
					goalRedirect = 'quickInvestStart';
				} else if(currentGoal == 'tax') {
					goalRedirect = 'taxsavingStarted';
				} else if(currentGoal == 'liquid') {
					goalRedirect = 'earnInterestStart';
				}
 				
				$location.path('/'+goalRedirect);
			}

			$scope.callCompleteness = function() {
				userDetailsService().then(function(userData){
					$scope.goalAnswered();
					$scope.financialGoalAnswered();
					$scope.getSumValues();
				});
			}

			$scope.callCompleteness();

			$scope.goalAnswered = function() {
				var user_flags = $rootScope.userFlags.user_flags;
				$rootScope.goalExists = false;
				$rootScope.goalAnswered = {};
				appConfig.otherGoals.forEach(function(data) {
					console.log('user flags',user_flags[data]);
					$rootScope.goalAnswered[data] = user_flags[data];
					if($rootScope.goalAnswered[data] == true){
						$rootScope.goalExists = true;
					}
				});
				console.log('goalAnswered',$rootScope.goalAnswered);
			}

			

			$scope.financialGoalAnswered = function() {
				var user_flags = $rootScope.userFlags.user_flags;
				$rootScope.finGoalAnswered = '';
				appConfig.financialGoals.forEach(function(data) {
					if(user_flags[data] == true){
						$rootScope.finGoalAnswered = true;
					}
				});
			}

			$scope.getFinancialGoalSum = function() {
				var sum = 0;
				appConfig.financialGoals.forEach(function(data) {
					if($rootScope.userFlags.user_answers[data]){
						var lumpsum = parseFloat($rootScope.userFlags.user_answers[data].lumpsum || 0);
						var sip = parseFloat($rootScope.userFlags.user_answers[data].sip * 12 || 0);
						sum+= lumpsum + sip;
						console.log('lumpsum',lumpsum,'sip',sip)
						console.log('sum',sum);
					}
				});
				return sum;
			}
			$scope.finGoalsAmt = $scope.getFinancialGoalSum();

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
							$scope.quickInvestAmt = $rootScope.userFlags.user_answers.invest.lumpsum + ($rootScope.userFlags.user_answers.invest.sip * 12)
							
						} else {

						}
				})
			}

			$scope.showGoal = function() {
				$rootScope.trackPerTab = 'FINANCE';
				$location.path('/trackPerformanceStart');
			}

			$scope.goToInvest = function() {
				$rootScope.legends = [];
				var canInvest = true;

				if($rootScope.userFlags['user_flags']['portfolio'] == false) {
					canInvest = false;
					$scope.errorPopupMessage = 'You have to add goals before you can invest.';
					$scope.redirectPath = '/goals';	

				} else if($rootScope.userFlags['user_flags']['kra_verified'] == false) {
					canInvest = false;
					$scope.errorPopupMessage = 'You are not KRA verified. Kindly contact FinAskus team.';
					$scope.redirectPath = '/dashboard';	
				} else if($rootScope.userFlags['user_flags']['vault'] == false){
					canInvest = false;
					$scope.errorPopupMessage = 'You have to complete investor registration before you can invest';
					$scope.redirectPath = '/registerInvestorStart';
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
			        		$location.path($scope.redirectPath);
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
						$scope.colors = ['#247abc', '#05AB41', '#7f7f7f', '#db5d30'];
						var colors = ['#247abc', '#05AB41', '#7f7f7f', '#db5d30'];
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
						$rootScope.colors = ['#247abc', '#05AB41', '#7f7f7f', '#db5d30'];
						$rootScope.pieTitle = "<span class='currency'>&#8377;</span><span class='content'><span>" + $filter('amountSeffix')($rootScope.overall_total_sum) + " </span>";
						$location.path('/investStep1');
						
					} else {
						
					}
				});
			}
			}
		}
})();
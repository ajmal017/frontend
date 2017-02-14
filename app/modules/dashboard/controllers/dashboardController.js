(function(){
	'use strict';
	angular
		.module('finApp.dashboard')
		.controller('dashboardController',dashboardController);

		dashboardController.$inject = ['$scope','$rootScope','$location','dashboardService','ngDialog', 'userDetailsService', 'investWithdrawService', 'busyIndicator']
		function dashboardController($scope,$rootScope,$location,dashboardService,ngDialog, userDetailsService, investWithdrawService, busyIndicator){
			dashboardService.getDashboardDetails($rootScope.userFlags,function(data){
				$scope.dashCounts = data;
			})
			$scope.callCompleteness = function() {
				userDetailsService().then(function(userData){
					$scope.userFlags = JSON.parse(sessionStorage.getItem('userFlags'))
				});
			}

			$scope.callCompleteness();


			var userFlags = $scope.userFlags;
			if(userFlags.user_answers.risk_score) {
				$rootScope.userRiskFactor = userFlags.user_answers.risk_score;
			} 
			$rootScope.is_bank_supported = userFlags.user_flags.is_bank_supported;
			$scope.risk_score = $rootScope.userRiskFactor;
			
			if($scope.risk_score > 0 && $scope.risk_score < 4) {
	            	
            	$scope.riskType = 'Low Risk';
            } else if($scope.risk_score >= 4.1 && $scope.risk_score <= 6.0) {
            	
            	$scope.riskType = 'Below Average Risk';      	
            } else if($scope.risk_score >= 6.1 && $scope.risk_score <= 7.5) {
            	
            	$scope.riskType = 'Average Risk';      	
            	
            } else if($scope.risk_score >= 7.6 && $scope.risk_score <= 9.0) {
            	
            	$scope.riskType = 'Above Average Risk';      	
            	
            } else if($scope.risk_score >= 9.1 && $scope.risk_score <= 10.0) {
            	
            	$scope.riskType = 'High Risk';
            }

            $scope.user_flags = userFlags.user_flags;
            $scope.portfolio_flag = userFlags.user_flags.portfolio;
            $rootScope.showRedeem = userFlags.user_flags.show_redeem;

            $rootScope.disabledTrackPerformance = false;
            if(userFlags.user_flags.is_virtual){
            	if(parseInt($scope.dashCounts['investCount']) > 0){
            		
            		$rootScope.disabledTrackPerformance = false;
            	}
            	else {
            		$rootScope.disabledTrackPerformance = true;
            	}
            } else {
            	$rootScope.disabledTrackPerformance = false;
            }

			console.log('risk_score',userFlags.user_answers.risk_score);
				$scope.showTrackPerformance = function() {
					// if($scope.user_flags.track == false){
					// 	$scope.errorPopupMessage = 'Track performance cannot be displayed';
					// 	$scope.ngDialog = ngDialog;
					// 	ngDialog.open({ 
				 //        	template: '/modules/common/views/partials/error_popup.html', 
				 //        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
				 //        	overlay: false,
				 //        	showClose : false,
				 //        	scope: $scope
			  //       	});
					// } else {
							$location.path('/trackPerformanceStart');
					// }
				}

				$rootScope.goToWithdraw = function() {
				$scope.noWithdraw = false;
				if($rootScope.userFlags['user_flags']['show_redeem'] == false) {
						$scope.errorPopupMessage = 'You cannot withdraw.';
						$scope.ngDialog = ngDialog;
						ngDialog.open({ 
				        	template: 'modules/common/views/partials/withdraw_error.html', 
				        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
				        	overlay: false,
				        	showClose : false,

				        	scope: $scope
			        	});
				} else {
						busyIndicator.show();
						investWithdrawService.getWithdrawDetails().then(function(data){
							busyIndicator.hide();
						if('success' in data) { 
							if(!data.success.length)
							{
								$rootScope.noWithdraw = true;
							}
							console.log('redeem', data);
							$rootScope.redeemData = data.success;
							$location.path('/withdrawStart');
						}
						else {
							
						}
				});
				}
			}
		}
})();
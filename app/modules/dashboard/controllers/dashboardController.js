(function(){
	'use strict';
	angular
		.module('finApp.dashboard')
		.controller('dashboardController',dashboardController);

		dashboardController.$inject = ['$scope','$rootScope','$location','dashboardService','ngDialog']
		function dashboardController($scope,$rootScope,$location,dashboardService,ngDialog){
			// dashboardService.getDashboardDetails($rootScope.userFlags,function(data){
			// 	$scope.dashCounts = data;
			// })

			var userFlags = JSON.parse(sessionStorage.getItem('userFlags'));
			if(userFlags.user_answers.risk_score) {
				$rootScope.userRiskFactor = userFlags.user_answers.risk_score;
			} else {
				$rootScope.userRiskFactor = '7.0';
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

            $scope.disabledTrackPerformance = false;
            if(userFlags.user_flags.is_virtual == true){
            	if(userFlags.user_flags.portfolio == true && userFlags.user_flags.rebuild_portfolio == false){
            		$scope.disabledTrackPerformance = false;
            	}
            	else {
            		$scope.disabledTrackPerformance = true;
            	}
            } else {
            	$scope.disabledTrackPerformance = false;
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
		}
})();
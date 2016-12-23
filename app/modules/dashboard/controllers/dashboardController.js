(function(){
	'use strict';
	angular
		.module('finApp.dashboard')
		.controller('dashboardController',dashboardController);

		dashboardController.$inject = ['$scope','$rootScope','$location','dashboardService']
		function dashboardController($scope,$rootScope,$location,dashboardService){
			// dashboardService.getDashboardDetails($rootScope.userFlags,function(data){
			// 	$scope.dashCounts = data;
			// })

			var userFlags = JSON.parse(sessionStorage.getItem('userFlags'));
			$scope.risk_score = userFlags.user_answers.risk_score;
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
			$rootScope.userRiskFactor = userFlags.user_answers.risk_score;
			console.log('risk_score',userFlags.user_answers.risk_score);

		}
})();
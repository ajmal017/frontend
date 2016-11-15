(function(){
	'use strict';
	angular
		.module('finApp.dashboard')
		.controller('dashboardController',dashboardController);

		dashboardController.$inject = ['$scope','$rootScope','$location','dashboardService']
		function dashboardController($scope,$rootScope,$location,dashboardService){
			dashboardService.getDashboardDetails($rootScope.userFlags,function(data){
				$scope.dashCounts = data;
			})
		}
})();
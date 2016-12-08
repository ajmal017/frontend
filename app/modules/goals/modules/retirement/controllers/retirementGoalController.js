(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('retirementGoalsController',retirementGoalsController);

		retirementGoalsController.$inject = ['$scope','$rootScope','$route','$location','goalsService','retirementGoalsService']
		function retirementGoalsController($scope,$rootScope,$route,$location,goalsService,retirementGoalsService){
			$scope.retirement = {};
			$scope.modelVal = retirementGoalsService.getSavedValues();
			$scope.showEquityModal = function(){
				$('#equiDeptModal').modal('show');
			}
			$scope.reloadRoute = function(param) {
				$rootScope.selectedCriteria = param;
				if(!$rootScope.$$phase) $rootScope.$apply();
				$rootScope.slideTobeChanged = 2;
			    $route.reload();
			}
			$scope.sendValues = function(value){
				retirementGoalsService.setSavedValues(value);
			}
			$scope.calculateYear = function(from,to){
				var currentYear = new Date();				
				$scope.retirement['calculateYear'] = currentYear.getFullYear() + (to - from);
			}
			$scope.graphObject = goalsService.getGoalGraphDetails();
		}
})();
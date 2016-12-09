(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('automobileController',automobileController);

		automobileController.$inject = ['$scope','$rootScope','$location','$timeout','retirementGoalsService']
		function automobileController($scope,$rootScope,$location,$timeout,retirementGoalsService){
			$rootScope.showPortfolioFactoring = true;
			
			$scope.portfolioFactoring = function() {

				$rootScope.showPortfolioFactoring = false;

				$timeout(function() {
					$location.path('/dashboard');

					$scope.$apply();
				},5000)
			}
		}
})();
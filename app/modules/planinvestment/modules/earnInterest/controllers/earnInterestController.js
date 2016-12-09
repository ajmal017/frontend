(function(){
	'use strict';
	angular
		.module('finApp.planInvest')
		.controller('earnInterestController',earnInterestController);

		earnInterestController.$inject = ['$scope','$rootScope','$location','planInvestService']
		function earnInterestController($scope,$rootScope,$location,planInvestService){
			$rootScope.showPortfolioFactoring = true;
			$scope.portfolioFactoring = function() {
				
				$rootScope.showPortfolioFactoring = false;

				setTimeout(function() {
					$location.path('/dashboard');

					$scope.$apply();
				},5000)
			}
		}
})();
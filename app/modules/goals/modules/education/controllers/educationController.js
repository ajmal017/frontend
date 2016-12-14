(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('educationController',educationController);

		educationController.$inject = ['$scope','$rootScope','$route','$location', '$timeout',
	                                     'goalsService','educationService', 'assetAllocationService', 'goalFormulaeService', 'appConfig'];
		                               
		function educationController($scope,$rootScope, $route, $location, $timeout,
				goalsService, educationService, assetAllocationService, goalFormulaeService, appConfig) {
			
			this.scope = $scope;

			this.scope.education = {};
			this.goalModelObject = this.scope.education;
			
			this.scope.modelVal = educationService.getSavedValues();
			
			this.rootScope = $rootScope;
			this.route = $route;
			this.location = $location,
			this.timeout = $timeout,
			this.goalsService = goalsService;
			this.assetAllocationService = assetAllocationService;
			this.goalFormulaeService = goalFormulaeService;
			this.appConfig = appConfig;
			this.goalTypeService = educationService;
			
			this.scope.showEquityModal = angular.bind( this, this.showEquityModal );
			this.scope.reloadRoute = angular.bind( this, this.reloadRoute );
			this.scope.appendValues = angular.bind( this, this.appendValues );
			this.scope.getAssetAllocationCategory = angular.bind( this, this.getAssetAllocationCategory );
			this.scope.calculateRecommendedSIP = angular.bind( this, this.calculateRecommendedSIP );
			this.scope.calculateCorpus = angular.bind( this, this.calculateCorpus);
			this.scope.estimateSelectionChanged = angular.bind( this, this.estimateSelectionChanged);
			this.scope.portfolioFactoring = angular.bind( this, this.portfolioFactoring);
			this.scope.handleGoalEstimatesResponse = angular.bind( this, this.handleGoalEstimatesResponse);
			
			this.rootScope.showPortfolioFactoring = true;

			this.scope.calculateEstimates = function() {
				var self = this;
				educationService.getCorpusEstimates($scope.education['tenure'], $scope.modelVal.A5, $scope.modelVal.A6, $scope.modelVal.A7).
				then(self.handleGoalEstimatesResponse);			}
			
			$scope.graphObject = goalsService.getGoalGraphDetails();

		}
		
		educationController.prototype = finApp.goalControllerPrototype;
})();
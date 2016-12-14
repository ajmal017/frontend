(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('weddingController',weddingController);

		weddingController.$inject = ['$scope','$rootScope','$route','$location', '$timeout', 'weddingService',
		                              'goalsService', 'assetAllocationService', 'goalFormulaeService', 'appConfig'];
		function weddingController($scope,$rootScope,$route,$location,$timeout,weddingService,
				goalsService, assetAllocationService, goalFormulaeService, appConfig) {
			
			this.scope = $scope;

			this.scope.wedding = {};
			this.goalModelObject = this.scope.wedding;
			
			this.scope.modelVal = weddingService.getSavedValues();
			
			this.rootScope = $rootScope;
			this.route = $route;
			this.location = $location,
			this.timeout = $timeout,
			
			this.goalsService = goalsService;
			this.assetAllocationService = assetAllocationService;
			this.goalFormulaeService = goalFormulaeService;
			this.appConfig = appConfig;
			this.goalTypeService = weddingService;
			
			this.scope.showEquityModal = angular.bind( this, this.showEquityModal );
			this.scope.reloadRoute = angular.bind( this, this.reloadRoute );
			this.scope.appendValues = angular.bind( this, this.appendValues );
			this.scope.getAssetAllocationCategory = angular.bind( this, this.getAssetAllocationCategory );
			this.scope.calculateRecommendedSIP = angular.bind( this, this.calculateRecommendedSIP );
			this.scope.calculateCorpus = angular.bind( this, this.calculateCorpus);
			this.scope.estimateSelectionChanged = angular.bind( this, this.estimateSelectionChanged);
			this.scope.handleGoalEstimatesResponse = angular.bind( this, this.handleGoalEstimatesResponse);
			
			this.rootScope.showPortfolioFactoring = true;

			this.scope.calculateEstimates = function() {
				var self = this;
				weddingService.getCorpusEstimates($scope.wedding['tenure'], $scope.modelVal.A5, $scope.modelVal.A6, $scope.modelVal.A7, $scope.modelVal.A8)
				.then(self.handleGoalEstimatesResponse);
			}
			
			$scope.graphObject = goalsService.getGoalGraphDetails();

		}
		                               
		weddingController.prototype = finApp.goalControllerPrototype;

})();
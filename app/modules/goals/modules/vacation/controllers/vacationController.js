(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('vacationController',vacationController);

		vacationController.$inject = ['$scope','$rootScope','$route','$location', '$timeout', 'vacationService',
		                              'goalsService', 'assetAllocationService', 'goalFormulaeService', 'appConfig'];
		function vacationController($scope,$rootScope,$route,$location,$timeout,vacationService,
				goalsService, assetAllocationService, goalFormulaeService, appConfig) {
			
			this.scope = $scope;

			this.scope.vacation = {};
			this.goalModelObject = this.scope.vacation;
			
			this.scope.modelVal = vacationService.getSavedValues();
			
			this.rootScope = $rootScope;
			this.route = $route;
			this.location = $location,
			this.timeout = $timeout,
			
			this.goalsService = goalsService;
			this.assetAllocationService = assetAllocationService;
			this.goalFormulaeService = goalFormulaeService;
			this.appConfig = appConfig;
			this.goalTypeService = vacationService;
			
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
				vacationService.getCorpusEstimates($scope.vacation['tenure'], $scope.modelVal.A5, $scope.modelVal.A6, $scope.modelVal.A7, $scope.modelVal.A8)
				.then(self.handleGoalEstimatesResponse);
			}
			
			$scope.graphObject = goalsService.getGoalGraphDetails();

		}
		                               
		vacationController.prototype = finApp.goalControllerPrototype;

})();
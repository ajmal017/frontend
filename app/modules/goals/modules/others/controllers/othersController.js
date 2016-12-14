(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('othersController',othersController);

		othersController.$inject = ['$scope','$rootScope','$route','$location', '$timeout', 'othersService',
		                              'goalsService', 'assetAllocationService', 'goalFormulaeService', 'appConfig'];
		function othersController($scope,$rootScope,$route,$location,$timeout,othersService,
				goalsService, assetAllocationService, goalFormulaeService, appConfig) {
			
			this.scope = $scope;

			this.scope.others = {};
			this.goalModelObject = this.scope.others;
			
			this.scope.modelVal = othersService.getSavedValues();
			
			this.rootScope = $rootScope;
			this.route = $route;
			this.location = $location,
			this.timeout = $timeout,
			
			this.goalsService = goalsService;
			this.assetAllocationService = assetAllocationService;
			this.goalFormulaeService = goalFormulaeService;
			this.appConfig = appConfig;
			this.goalTypeService = othersService;
			
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
			}
			
			$scope.graphObject = goalsService.getGoalGraphDetails();

		}
		                               
		othersController.prototype = finApp.goalControllerPrototype;

})();
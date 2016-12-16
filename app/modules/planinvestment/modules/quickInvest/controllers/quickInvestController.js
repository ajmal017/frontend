(function(){
	'use strict';
	angular
		.module('finApp.planInvest')
		.controller('quickInvestController',quickInvestController);

		quickInvestController.$inject = ['$scope','$rootScope','$route','$location', '$timeout', 'quickInvestService',
			                              'goalsService', 'assetAllocationService', 'goalFormulaeService', 'appConfig', 'riskProfileService'];
		function quickInvestController($scope,$rootScope,$route,$location,$timeout,quickInvestService,
				goalsService, assetAllocationService, goalFormulaeService, appConfig, riskProfileService) {
			
			this.scope = $scope;

			this.scope.quickinvest = {};
			this.goalModelObject = this.scope.quickinvest;
			
			this.scope.modelVal = quickInvestService.getSavedValues();
			
			this.rootScope = $rootScope;
			this.route = $route;
			this.location = $location;
			this.timeout = $timeout;
			
			this.goalsService = goalsService;
			this.assetAllocationService = assetAllocationService;
			this.goalFormulaeService = goalFormulaeService;
			this.appConfig = appConfig;
			this.goalTypeService = quickInvestService;
			
			this.scope.showEquityModal = angular.bind( this, this.showEquityModal );
			this.scope.reloadRoute = angular.bind( this, this.reloadRoute );
			this.scope.appendValues = angular.bind( this, this.appendValues );

			this.scope.calculateRecommendedSIP = angular.bind( this, this.calculateRecommendedSIP );
			this.scope.calculateCorpus = angular.bind( this, this.calculateCorpus);
			this.scope.estimateSelectionChanged = angular.bind( this, this.estimateSelectionChanged);
			this.scope.handleGoalEstimatesResponse = angular.bind( this, this.handleGoalEstimatesResponse);
			
			this.scope.getGraphObject = angular.bind(this, this.getGraphObject ); 
            this.scope.graphObject = this.scope.getGraphObject();

			this.rootScope.showPortfolioFactoring = true;

			this.scope.calculateEstimates = function() {
			}
			
			var self = this;
			
			this.getGoalGraphDetails = function() {
				var tenure = appConfig.QUICKINVEST_LUMPSUM_TERM;
				if ($rootScope.selectedCriteria == 'op1') {
					tenure = $scope.quickinvest['tenure'];
				}
				this.goalsService.getGoalGraphDetails(this.scope.graphObject, $scope.quickinvest['assetAllocation'], this.scope.modelVal.A2 || 0, this.scope.modelVal.A4 || 0, tenure);

				console.log('$scope.graphObject',this.scope.graphObject);
			}

			this.scope.getGoalGraphDetails = angular.bind(this, this.getGoalGraphDetails ); 

			this.scope.getAssetAllocationCategory = function() {
				var tenure = $scope.modelVal.A3;
			
				if (tenure && $rootScope.selectedCriteria == 'op1') {
					$scope.quickinvest['tenure'] = tenure;

					assetAllocationService.computeAssetAllocationCategory(tenure).then(function(data){
						if('success' in data){
							console.log("Success asset category: " + data.success['asset_allocation_category']);
							$scope.quickinvest['assetAllocationCategory'] = data.success['asset_allocation_category'];
						}
						else {
							$scope.quickinvest['assetAllocationCategory'] = "A"; //TODO define constants, default category
						}
						var assetAllocationData = assetAllocationService.computeAssetAllocation($scope.quickinvest['assetAllocationCategory'], $scope.modelVal.A2, $scope.modelVal.A4 || 0);

						$scope.quickinvest['assetAllocation'] = assetAllocationData.assetAllocation;
						self.getGoalGraphDetails();
						
						$scope.$broadcast('assetAllocationCategoryChanged');
					});
				}
				else {
					var riskProfile = riskProfileService();
					$scope.quickinvest['assetAllocationCategory'] = appConfig.riskProfileToAssetAllocationCategory[riskProfile];

					var assetAllocationData = assetAllocationService.computeAssetAllocation($scope.quickinvest['assetAllocationCategory'], $scope.modelVal.A2 || 0, $scope.modelVal.A4 || 0);
					$scope.quickinvest['assetAllocation'] = assetAllocationData.assetAllocation;
					self.getGoalGraphDetails();
				}
			}

			
		}
		                               
		quickInvestController.prototype = finApp.goalControllerPrototype;

})();
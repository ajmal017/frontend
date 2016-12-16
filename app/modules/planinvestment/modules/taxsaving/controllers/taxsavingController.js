(function(){
	'use strict';
	angular
		.module('finApp.planInvest')
		.controller('taxsavingController',taxsavingController);

		taxsavingController.$inject = ['$scope','$rootScope','$route','$location', '$timeout', 'taxsavingService',
		                              'goalsService', 'assetAllocationService', 'goalFormulaeService', 'appConfig'];
		function taxsavingController($scope,$rootScope,$route,$location,$timeout,taxsavingService,
				goalsService, assetAllocationService, goalFormulaeService, appConfig) {
			
			this.scope = $scope;

			this.scope.taxsaving = {};
			this.goalModelObject = this.scope.taxsaving;
			
			this.scope.modelVal = taxsavingService.getSavedValues();
			
			this.rootScope = $rootScope;
			this.route = $route;
			this.location = $location;
			this.timeout = $timeout;
			
			this.goalsService = goalsService;
			this.assetAllocationService = assetAllocationService;
			this.goalFormulaeService = goalFormulaeService;
			this.appConfig = appConfig;
			this.goalTypeService = taxsavingService;
			
			this.scope.showEquityModal = angular.bind( this, this.showEquityModal );
			this.scope.reloadRoute = angular.bind( this, this.reloadRoute );
			this.scope.appendValues = angular.bind( this, this.appendValues );
			this.scope.getAssetAllocationCategory = angular.bind( this, this.getAssetAllocationCategory );
			this.scope.calculateRecommendedSIP = angular.bind( this, this.calculateRecommendedSIP );
			this.scope.calculateCorpus = angular.bind( this, this.calculateCorpus);
			this.scope.estimateSelectionChanged = angular.bind( this, this.estimateSelectionChanged);
			this.scope.handleGoalEstimatesResponse = angular.bind( this, this.handleGoalEstimatesResponse);
			
			this.rootScope.showPortfolioFactoring = true;

			this.scope.taxsaving['assetAllocation'] = appConfig.TAX_DEFAULT_ALLOCATION;
			this.scope.getGraphObject = angular.bind(this, this.getGraphObject ); 
            this.scope.graphObject = this.scope.getGraphObject();

			var self = this;
			
			this.getGoalGraphDetails = function() {
				var tenure = appConfig.TAX_TERM;
				//Use Equity percentage when calculating corpus for tax.
				this.goalsService.getGoalGraphDetails(this.scope.graphObject, {'equity' :100, 'debt' : 0}, 0, this.scope.modelVal.A2 || 0, tenure);

				console.log('$scope.graphObject',this.scope.graphObject);
			}

			this.scope.getGoalGraphDetails = angular.bind(this, this.getGoalGraphDetails ); 

			this.scope.initOptions = function() {
				this.rootScope.selectedCriteria = 'op1';
			}
			
			this.scope.calculateEstimates = function() {
			}
			
			this.scope.computeFutureEligibility = function() {
				var ppf = parseFloat($scope.modelVal.A3 || 0),
					insurance = parseFloat($scope.modelVal.A4 || 0),
					loan = parseFloat($scope.modelVal.A5 || 0),
					elss = parseFloat($scope.modelVal.A6 || 0);
				
				var eligibility = (150000 - (ppf + insurance + loan + elss));
				eligibility = Math.max(eligibility, 0);
				
				$scope.taxsaving['eligibility'] = $scope.modelVal.A2 = eligibility;

				$scope.computeTaxBenefit();
			}

			this.scope.computeTaxBenefit = function() {
				var eligibility = $scope.modelVal.A2 || 0;
				var taxBenefit = Math.round(eligibility * 30.9/100);
				
				$scope.taxsaving['taxBenefit'] = taxBenefit;
				
				self.getGoalGraphDetails();
			}

		}
		                               
		taxsavingController.prototype = finApp.goalControllerPrototype;

})();
(function(){
	'use strict';
	angular
		.module('finApp.planInvest')
		.controller('earnInterestController',earnInterestController);

		earnInterestController.$inject = ['$scope','$rootScope','$route','$location', '$timeout', 'earnInterestService',
			                              'goalsService', 'assetAllocationService', 'goalFormulaeService', 'appConfig', 'riskProfileService', 'goalConfig', 'busyIndicator']
		function earnInterestController($scope,$rootScope,$route,$location,$timeout,earnInterestService,
				goalsService, assetAllocationService, goalFormulaeService, appConfig, riskProfileService, goalConfig, busyIndicator){
			// $rootScope.showPortfolioFactoring = true;
			// $scope.portfolioFactoring = function() {
				
			// 	$rootScope.showPortfolioFactoring = false;

			// 	setTimeout(function() {
			// 		$location.path('/dashboard');

			// 		$scope.$apply();
			// 	},5000)
			// }

			
			this.scope = $scope;

			this.scope.earninterest = {};
			this.goalModelObject = this.scope.earninterest;
			
			this.scope.modelVal = earnInterestService.getSavedValues();
			
			this.rootScope = $rootScope;
			this.route = $route;
			this.location = $location;
			this.timeout = $timeout;
			
			this.goalsService = goalsService;
			this.assetAllocationService = assetAllocationService;
			this.goalFormulaeService = goalFormulaeService;
			this.appConfig = appConfig;
			this.goalTypeService = earnInterestService;
			
			this.scope.showEquityModal = angular.bind( this, this.showEquityModal );
			this.scope.callModel = angular.bind( this, this.callModel );
			this.scope.reloadRoute = angular.bind( this, this.reloadRoute );
			this.scope.appendValues = angular.bind( this, this.appendValues );

			this.scope.calculateRecommendedSIP = angular.bind( this, this.calculateRecommendedSIP );
			this.scope.calculateCorpus = angular.bind( this, this.calculateCorpus);
			this.scope.estimateSelectionChanged = angular.bind( this, this.estimateSelectionChanged);
			this.scope.handleGoalEstimatesResponse = angular.bind( this, this.handleGoalEstimatesResponse);
			
			this.scope.getGraphObject = angular.bind(this, this.getGraphObject ); 
            this.scope.graphObject = this.scope.getGraphObject();

			this.rootScope.showPortfolioFactoring = true;
			this.scope.getFundData = angular.bind(this, this.getFundData );

			this.scope.calculateEstimates = function() {
			}
			
			var self = this;
			
			this.getGoalGraphDetails = function() {
				var tenure = appConfig.QUICKINVEST_LUMPSUM_TERM;
				if ($rootScope.selectedCriteria == 'op1') {
					tenure = $scope.earninterest['tenure'];
				}
				this.goalsService.getGoalGraphDetails(this.scope.graphObject, $scope.earninterest['assetAllocation'], this.scope.modelVal.A2 || 0, this.scope.modelVal.A4 || 0, tenure);

				console.log('$scope.graphObject',this.scope.graphObject);
			}

			this.scope.getGoalGraphDetails = angular.bind(this, this.getGoalGraphDetails ); 

			$scope.loadDefaultValues = function() {
				if($rootScope.userFlags['user_answers']['interest']['lumpsum'])
                {
                    $rootScope.selectedCriteria = 'op2';
                }
				else
                { 
                    $rootScope.selectedCriteria = 'op1';
                } 
			}

			if($location.$$path == '/quickInvestStart'){
				$scope.loadDefaultValues();
			}

			// this.setModelValLumpsum = function(assetAllocationObj) {
			// 	$scope.modelVal.assetAllocation.equityInitial = assetAllocationObj.assetAllocation.equity;
			// 	var debtAmount = (assetAllocationObj.assetAllocation.debt/100) * assetAllocationObj.minSIP;
			// 	var equityAmount = (assetAllocationObj.assetAllocation.equity/100) * assetAllocationObj.minSIP;
			// 	var debtAmountLumpsum = (assetAllocationObj.assetAllocation.debt/100) * assetAllocationObj.minLumpsum;
			// 	var equityAmountLumpsum = (assetAllocationObj.assetAllocation.equity/100) * assetAllocationObj.minLumpsum;
			// 	$scope.modelVal.debtAmount = debtAmount;
			// 	$scope.modelVal.equityAmount = equityAmount;
			// 	$scope.modelVal.debtAmountLumpsum = debtAmountLumpsum;
			// 	$scope.modelVal.equityAmountLumpsum = equityAmountLumpsum;
			// }

			// this.scope.setModelValLumpsum = angular.bind(this, this.setModelValLumpsum ); 


			this.scope.getAssetAllocationCategory = function() {
				var tenure = $scope.modelVal.A3;
			
				if (tenure && $rootScope.selectedCriteria == 'op1') {
					$scope.earninterest['tenure'] = tenure;

					assetAllocationService.computeAssetAllocationCategory(tenure).then(function(data){
						if('success' in data){
							console.log("Success asset category: " + data.success['asset_allocation_category']);
							$scope.earninterest['assetAllocationCategory'] = data.success['asset_allocation_category'];
						}
						else {
							$scope.earninterest['assetAllocationCategory'] = "A"; //TODO define constants, default category
						}
						var assetAllocationData = assetAllocationService.computeAssetAllocation($scope.earninterest['assetAllocationCategory'], $scope.modelVal.A2, $scope.modelVal.A4 || 0);

						$scope.earninterest['assetAllocation'] = assetAllocationData.assetAllocation;
						$scope.modelVal['assetAllocation'] = assetAllocationData.assetAllocation;

					    self.setModelVal(assetAllocationData.assetAllocation, $scope.modelVal.A2);
						self.getGoalGraphDetails();
						
						$scope.$broadcast('assetAllocationCategoryChanged');
					});
				}
				else {
					var riskProfile = riskProfileService();
					$scope.earninterest['assetAllocationCategory'] = appConfig.riskProfileToAssetAllocationCategory[riskProfile];

					var assetAllocationData = assetAllocationService.computeAssetAllocation($scope.earninterest['assetAllocationCategory'], $scope.modelVal.A2 || 0, $scope.modelVal.A4 || 0);
					$scope.earninterest['assetAllocation'] = assetAllocationData.assetAllocation;
					$scope.modelVal['assetAllocation'] = assetAllocationData.assetAllocation;
					// self.setModelValLumpsum(assetAllocationData);
				    self.setModelVal(assetAllocationData.assetAllocation, $scope.modelVal.A4);
					self.getGoalGraphDetails();
				}
			}

			this.scope.fundSelectionEarnInterest = function(modelVal) {
				console.log('modelVal', modelVal);
				var fundSelectionObj = {};

				fundSelectionObj.term = 0;
				fundSelectionObj.sip = 0;
				fundSelectionObj.lumpsum = 0;
				fundSelectionObj.allocation = {
					"debt" : modelVal.assetAllocation.debt,
					"equity" : modelVal.assetAllocation.equity,
					"elss" : "0",
					"liquid" : "0"
				}

				console.log('fundSelectionObj', fundSelectionObj);
				busyIndicator.show();
				goalsService.addParticularGoal(fundSelectionObj, 'interest').then(function(data){
					if('success' in data) {
						console.log('Goal added successfully');
						self.getFundData('interest', busyIndicator);
						
					}
					else {
						console.log('Error in service');
					}
				});
			}
			
		}		                               
		earnInterestController.prototype = finApp.goalControllerPrototype;
		
})();
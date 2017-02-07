(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('jewelleryController',jewelleryController);

		jewelleryController.$inject = ['$scope','$rootScope','$route','$location', '$timeout', 'jewelleryService',
         'goalsService', 'assetAllocationService', 'goalFormulaeService', 'appConfig', 'busyIndicator'];
		function jewelleryController($scope,$rootScope,$route,$location,$timeout,jewelleryService,
				goalsService, assetAllocationService, goalFormulaeService, appConfig, busyIndicator){
			console.log('in controller');
			this.scope = $scope;

			this.scope.jewellery = {};
			this.goalModelObject = this.scope.jewellery;
			
			this.scope.modelVal = jewelleryService.getSavedValues();
			if ((this.scope.modelVal.A1 == "" || this.scope.modelVal.A1 == undefined)  && sessionStorage.getItem('goalDetailsTemp')){
				this.scope.modelVal = JSON.parse(sessionStorage.getItem('goalDetailsTemp')) || {};
			} else {
				sessionStorage.removeItem('goalDetailsTemp');
			}

			this.rootScope = $rootScope;
			this.route = $route;
			this.location = $location,
			this.timeout = $timeout,
			
			this.goalsService = goalsService;
			this.assetAllocationService = assetAllocationService;
			this.goalFormulaeService = goalFormulaeService;
			this.appConfig = appConfig;
			this.goalTypeService = jewelleryService;
			
			this.scope.showEquityModal = angular.bind( this, this.showEquityModal );
			this.scope.callModel = angular.bind( this, this.callModel );
			this.scope.reloadRoute = angular.bind( this, this.reloadRoute );
			this.scope.appendValues = angular.bind( this, this.appendValues );
			this.scope.getAssetAllocationCategory = angular.bind( this, this.getAssetAllocationCategory );
			this.scope.calculateRecommendedSIP = angular.bind( this, this.calculateRecommendedSIP );
			this.scope.calculateCorpus = angular.bind( this, this.calculateCorpus);
			this.scope.estimateSelectionChanged = angular.bind( this, this.estimateSelectionChanged);
			this.scope.handleGoalEstimatesResponse = angular.bind( this, this.handleGoalEstimatesResponse);
			this.scope.portfolioFactoring = angular.bind( this, this.portfolioFactoring);
			this.rootScope.showPortfolioFactoring = true;
			this.scope.noEstimateSelection = angular.bind( this, this.noEstimateSelection);
			
			this.scope.changeDebtModal = angular.bind(this, this.changeDebtModal );
			this.scope.changeEquityModal = angular.bind(this, this.changeEquityModal );
			this.scope.saveEquityDebtMix = angular.bind(this, this.saveEquityDebtMix );
			this.scope.getFundData = angular.bind(this, this.getFundData );
			
			this.scope.getGoalGraphDetails = angular.bind(this, this.getGoalGraphDetails ); 
			this.scope.getGraphObject = angular.bind(this, this.getGraphObject ); 
            this.scope.graphObject = this.scope.getGraphObject();
            this.scope.resetAllocation = angular.bind(this, this.resetAllocation);
            
            this.scope.budgetInfoText = [{'tip' : '<h5>A Budget Jewellery goal would mean:</h5><p>Purchasing the jewellery of your choice in future with approximate cost of about 80% of your selection.</p><h5>How the estimated value is calculated:</h5><ul><li>The current jewellery cost is projected to grow at 10% based on historic gold inflation to arrive at the actual cost in future.</li><li>Any existing savings for this goal is projected to grow at 8% annually, and reduced from the target amount.</li><li>The monthly savings required is calculated based on projected investment growth.</li></ul>'}];
            this.scope.comfInfoText = [{'tip' : '<h5>A Comfortable Jewellery goal would mean:</h5><p>Purchasing the jewellery of your choice in future with approximate cost the same as your selection.</p><h5>How the estimated value is calculated:</h5><ul><li>The current jewellery cost is projected to grow at 10% based on historic gold inflation to arrive at the actual cost in future.</li><li>Any existing savings for this goal is projected to grow at 8% annually, and reduced from the target amount.</li><li>The monthly savings required is calculated based on projected investment growth.</li></ul>'}];
            this.scope.luxuInfoText = [{'tip' : '<h5>A Luxury Jewellery goal would mean:</h5><p>Purchasing the jewellery of your choice in future with approximate cost about 1.2 times your selection</p><h5>How the estimated value is calculated:</h5><ul><li>The current jewellery cost is projected to grow at 10% based on historic gold inflation to arrive at the actual cost in future.</li><li>Any existing savings for this goal is projected to grow at 8% annually, and reduced from the target amount.</li><li>The monthly savings required is calculated based on projected investment growth.</li></ul>'}];

			this.scope.calculateEstimates = function() {
				var self = this;
				jewelleryService.getCorpusEstimates($scope.jewellery['tenure'], $scope.modelVal.A5, $scope.modelVal.A7)
				.then(self.handleGoalEstimatesResponse);
			}
			
			$scope.loadDefaultValues = function() {
				if($rootScope.userFlags['user_answers']['jewellery']['goal_plan_type'] == 'op2')
                {
                    $rootScope.selectedCriteria = 'op2';
                }
				if($rootScope.userFlags['user_answers']['jewellery']['goal_plan_type'] == 'op1')
                { 
                    $rootScope.selectedCriteria = 'op1';
                } 
			}

			if($location.$$path == '/jewelleryStarted'){
				$scope.loadDefaultValues();
			}

			this.scope.fundSelectionJewellery = function(modelVal) {
				var self = this;
				console.log("In fund selection", modelVal);

				var d = new Date();
				var fundSelectionObj = {};
				if($rootScope.selectedCriteria == 'op1') {
					fundSelectionObj.corpus = modelVal.A3;
					fundSelectionObj.term = modelVal.A2 - d.getFullYear();
					fundSelectionObj.sip = modelVal.A4;
					fundSelectionObj.lumpsum = 0;
					fundSelectionObj.allocation = {
						"debt" : modelVal.assetAllocation.debt,
						"equity" : modelVal.assetAllocation.equity,
						"elss" : "0",
						"liquid" : "0"
					},
					fundSelectionObj.goal_plan_type = $rootScope.selectedCriteria;
					fundSelectionObj.goal_name = modelVal.A1;
					console.log('fundSelectionObj',fundSelectionObj);
				}

				if($rootScope.selectedCriteria == 'op2') {
					fundSelectionObj.corpus = modelVal.A3;
					fundSelectionObj.term = modelVal.A2 - d.getFullYear();
					fundSelectionObj.sip = modelVal.A4;
					fundSelectionObj.lumpsum = 0;
					fundSelectionObj.allocation = {
						"debt" : modelVal.assetAllocation.debt,
						"equity" : modelVal.assetAllocation.equity,
						"elss" : "0",
						"liquid" : "0"
					},
					fundSelectionObj.current_price = modelVal.A5;
					fundSelectionObj.amount_saved = modelVal.A7;
					fundSelectionObj.estimate_selection_type = modelVal.estimate_selection_type;
					fundSelectionObj.goal_plan_type = $rootScope.selectedCriteria;
					fundSelectionObj.goal_name = modelVal.A1;
					console.log('fundSelectionObj2', fundSelectionObj);
				}

				busyIndicator.show();
				goalsService.addParticularGoal(fundSelectionObj, 'jewellery').then(function(data){
					if('success' in data) {
						jewelleryService.setSavedValues(modelVal);
						console.log('Goal added successfully');
						self.getFundData('jewellery', busyIndicator);
						
					}
					else {
						console.log('Error in service');
					}
				});
			}

			//$scope.graphObject = goalsService.getGoalGraphDetails();

		}
		
		jewelleryController.prototype = finApp.goalControllerPrototype;
})();
(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('propertyController',propertyController);

		propertyController.$inject = ['$scope','$rootScope','$route','$location', '$timeout', 'propertyService',
		                              'goalsService', 'assetAllocationService', 'goalFormulaeService', 'appConfig', 'busyIndicator'];
		function propertyController($scope,$rootScope,$route,$location,$timeout,propertyService,
				goalsService, assetAllocationService, goalFormulaeService, appConfig, busyIndicator) {
			
			this.scope = $scope;

			this.scope.property = {};
			this.goalModelObject = this.scope.property;
			
			this.scope.modelVal = propertyService.getSavedValues();
			if ((this.scope.modelVal.A1 == "" || this.scope.modelVal.A1 == undefined)  && sessionStorage.getItem('goalDetailsTemp')) {
				this.scope.modelVal = JSON.parse(sessionStorage.getItem('goalDetailsTemp')) || {};
			} else {
				sessionStorage.removeItem('goalDetailsTemp');
			}
			console.log('modelVal',this.scope.modelVal);

			this.rootScope = $rootScope;
			this.route = $route;
			this.location = $location;
			this.timeout = $timeout;
			
			this.goalsService = goalsService;
			this.assetAllocationService = assetAllocationService;
			this.goalFormulaeService = goalFormulaeService;
			this.appConfig = appConfig;
			this.goalTypeService = propertyService;
			
			this.scope.showEquityModal = angular.bind( this, this.showEquityModal );
			this.scope.callModel = angular.bind( this, this.callModel );
			this.scope.reloadRoute = angular.bind( this, this.reloadRoute );
			this.scope.appendValues = angular.bind( this, this.appendValues );
			this.scope.getAssetAllocationCategory = angular.bind( this, this.getAssetAllocationCategory );
			this.scope.calculateRecommendedSIP = angular.bind( this, this.calculateRecommendedSIP );
			this.scope.calculateCorpus = angular.bind( this, this.calculateCorpus);
			this.scope.estimateSelectionChanged = angular.bind( this, this.estimateSelectionChanged);
			this.scope.handleGoalEstimatesResponse = angular.bind( this, this.handleGoalEstimatesResponse);
			
			this.rootScope.showPortfolioFactoring = true;

			this.scope.changeDebtModal = angular.bind(this, this.changeDebtModal );
			this.scope.changeEquityModal = angular.bind(this, this.changeEquityModal );
			this.scope.saveEquityDebtMix = angular.bind(this, this.saveEquityDebtMix );
			this.scope.getFundData = angular.bind(this, this.getFundData );

			this.scope.getGoalGraphDetails = angular.bind(this, this.getGoalGraphDetails ); 
			this.scope.getGraphObject = angular.bind(this, this.getGraphObject ); 
            this.scope.graphObject = this.scope.getGraphObject();
            this.scope.resetAllocation = angular.bind(this, this.resetAllocation);
            
            this.scope.budgetInfoText = [{'tip' : '<h5>A Budget Property goal would mean:</h5><p>Purchasing the property of your choice in future with your selected level of bank loan and additional 5% of property value towards furnishing cost.</p><h5>How the estimated value is calculated:</h5><ul><li>The current property cost is projected to grow at 6% rate of inflation to arrive at the actual cost in future.</li><li>Your choice of proportion of bank loan is deducted to estimate how much you will need to fund yourself.</li><li>Additionally 5% of the future property value is budgeted as your furnishing expenses.</li><li>Any existing savings for this goal is projected to grow at 8% annually, and reduced from the target amount.</li><li>The monthly savings required is calculated based on projected investment growth.</li></ul>'}];
            this.scope.comfInfoText = [{'tip' : '<h5>A Comfortable Property goal would mean:</h5><p>Purchasing the property of your choice in future with your selected level of bank loan and additional 10% of property value towards furnishing cost.</p><h5>How the estimated value is calculated:</h5><ul><li>The current property cost is projected to grow at 6% rate of inflation to arrive at the actual cost in future.</li><li>Your choice of proportion of bank loan is deducted to estimate how much you will need to fund yourself.</li><li>Additionally 10% of the future property value is budgeted as your furnishing expenses.</li><li>Any existing savings for this goal is projected to grow at 8% annually, and reduced from the target amount.</li><li>The monthly savings required is calculated based on projected investment growth.</li></ul>'}];
            this.scope.luxuInfoText = [{'tip' : '<h5>A Luxury Property goal would mean:</h5><p>Purchasing the property of your choice in future with your selected level of bank loan and additional 15% of property value towards furnishing cost.</p><h5>How the estimated value is calculated:</h5><ul><li>The current property cost is projected to grow at 6% rate of inflation to arrive at the actual cost in future.</li><li>Your choice of proportion of bank loan is deducted to estimate how much you will need to fund yourself.</li><li>Additionally 15% of the future property value is budgeted as your furnishing expenses.</li><li>Any existing savings for this goal is projected to grow at 8% annually, and reduced from the target amount.</li><li>The monthly savings required is calculated based on projected investment growth.</li></ul>'}];
			this.scope.calculateEstimates = function() {
				var self = this;
				if (!$scope.property['tenure']) {
					self.getAssetAllocationCategory();
				}
				propertyService.getCorpusEstimates($scope.property['tenure'], $scope.modelVal.A5, $scope.modelVal.A6, $scope.modelVal.A7)
				.then(self.handleGoalEstimatesResponse);
			}

			$scope.loadDefaultValues = function() {
				if($rootScope.userFlags['user_answers']['property']['goal_plan_type'] == 'op2')
                {
                    $rootScope.selectedCriteria = 'op2';
                }
				if($rootScope.userFlags['user_answers']['property']['goal_plan_type'] == 'op1')
                { 
                    $rootScope.selectedCriteria = 'op1';
                } 
			}

			if($location.$$path == '/propertyStarted'){
				$scope.loadDefaultValues();
			}

			this.scope.fundSelectionProperty = function(modelVal) {
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
					fundSelectionObj.prop_of_purchase_cost = modelVal.A6;
					fundSelectionObj.amount_saved = modelVal.A7;
					fundSelectionObj.estimate_selection_type = modelVal.estimate_selection_type;
					fundSelectionObj.goal_plan_type = $rootScope.selectedCriteria;
					fundSelectionObj.goal_name = modelVal.A1;
					console.log('fundSelectionObj2', fundSelectionObj);
				}

				busyIndicator.show();
				goalsService.addParticularGoal(fundSelectionObj, 'property').then(function(data){
					if('success' in data) {
						console.log('Goal added successfully');
						propertyService.setSavedValues(modelVal);
						self.getFundData('property', busyIndicator);
						busyIndicator.hide();

					}
					else {
						console.log('Error in service');
					}
				});
			}
			
		}
		                               
		propertyController.prototype = finApp.goalControllerPrototype;

})();
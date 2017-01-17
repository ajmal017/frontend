(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('weddingController',weddingController);

		weddingController.$inject = ['$scope','$rootScope','$route','$location', '$timeout', 'weddingService',
		                              'goalsService', 'assetAllocationService', 'goalFormulaeService', 'appConfig', 'busyIndicator'];
		function weddingController($scope,$rootScope,$route,$location,$timeout,weddingService,
				goalsService, assetAllocationService, goalFormulaeService, appConfig, busyIndicator) {
			
			this.scope = $scope;

			this.scope.wedding = {};
			this.goalModelObject = this.scope.wedding;
			
			this.scope.modelVal = weddingService.getSavedValues();
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
			this.goalTypeService = weddingService;
			
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

            this.scope.budgetInfoText = [{'tip' : '<h5>A Budget Wedding goal would mean:</h5><p>Planning the wedding of your choice in future with budget catering, venue and decorations, along with low clothing and gifting cost, and budget travel for family if outstation venue.</p><h5>How the estimated value is calculated:</h5><ul><li>Based on thorough research of the prevailing wedding cost heads, we estimate the current cost of your chosen wedding plan.</li><li>The current cost is projected to grow at 6% rate of inflation to arrive at the actual cost in future.</li><li>Your choice of proportion of wedding expenses is taken into account for cost you will need to bear.</li><li>Any existing savings for this goal is projected to grow at 8% annually, and reduced from the target amount.</li><li>The monthly savings required is calculated based on projected investment growth.</li></ul>'}];
            this.scope.comfInfoText = [{'tip' : '<h5>A Comfortable Wedding goal would mean:</h5><p>Planning the wedding of your choice in future with 4-star catering, venue and decorations, along with medium clothing and gifting cost and economy class air travel for family if outstation venue.</p><h5>How the estimated value is calculated:</h5><ul><li>Based on thorough research of the prevailing wedding cost heads, we estimate the current cost of your chosen wedding plan.</li><li>The current cost is projected to grow at 6% rate of inflation to arrive at the actual cost in future.</li><li>Your choice of proportion of wedding expenses is taken into account for cost you will need to bear.</li><li>Any existing savings for this goal is projected to grow at 8% annually, and reduced from the target amount.</li><li>The monthly savings required is calculated based on projected investment growth.</li></ul>'}];
            this.scope.luxuInfoText = [{'tip' : '<h5>A Luxury Wedding goal would mean:</h5><p>Planning the wedding of your choice in future with 5-star catering, venue and decorations, along with luxury clothing and gifting cost and business class air travel for family if outstation venue.</p><h5>How the estimated value is calculated:</h5><ul><li>Based on thorough research of the prevailing wedding cost heads, we estimate the current cost of your chosen wedding plan.</li><li>The current cost is projected to grow at 6% rate of inflation to arrive at the actual cost in future.</li><li>Your choice of proportion of wedding expenses is taken into account for cost you will need to bear.</li><li>Any existing savings for this goal is projected to grow at 8% annually, and reduced from the target amount.</li><li>The monthly savings required is calculated based on projected investment growth.</li></ul>'}];

			this.scope.calculateEstimates = function() {
				var self = this;
				if (!$scope.wedding['tenure']) {
					self.getAssetAllocationCategory();
				}
				weddingService.getCorpusEstimates($scope.wedding['tenure'], $scope.modelVal.A5, $scope.modelVal.A6, $scope.modelVal.A7, $scope.modelVal.A8)
				.then(self.handleGoalEstimatesResponse);
			}

			$scope.loadDefaultValues = function() {
				if($rootScope.userFlags['user_answers']['wedding']['goal_plan_type'] == 'op2')
                {
                    $rootScope.selectedCriteria = 'op2';
                }
				if($rootScope.userFlags['user_answers']['wedding']['goal_plan_type'] == 'op1')
                { 
                    $rootScope.selectedCriteria = 'op1';
                } 
			}

			if($location.$$path == '/weddingStarted'){
				$scope.loadDefaultValues();
			}
			
			this.scope.fundSelectionWedding = function(modelVal) {
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
					fundSelectionObj.expected_people = modelVal.A5;
					fundSelectionObj.location = modelVal.A6;
					fundSelectionObj.sharing_percentage = modelVal.A7;
					
					fundSelectionObj.amount_saved = modelVal.A8;
					fundSelectionObj.estimate_selection_type = modelVal.estimate_selection_type;
					fundSelectionObj.goal_plan_type = $rootScope.selectedCriteria;
					fundSelectionObj.goal_name = modelVal.A1;
					console.log('fundSelectionObj2', fundSelectionObj);
				}

				busyIndicator.show();
				goalsService.addParticularGoal(fundSelectionObj, 'wedding').then(function(data){
					if('success' in data) {
						weddingService.setSavedValues(modelVal);
						console.log('Goal added successfully');
						self.getFundData('wedding', busyIndicator);
						
					}
					else {
						console.log('Error in service');
					}
				});
			}
		}
		                               
		weddingController.prototype = finApp.goalControllerPrototype;

})();
(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('vacationController',vacationController);

		vacationController.$inject = ['$scope','$rootScope','$route','$location', '$timeout', 'vacationService',
		                              'goalsService', 'assetAllocationService', 'goalFormulaeService', 'appConfig', 'busyIndicator'];
		function vacationController($scope,$rootScope,$route,$location,$timeout,vacationService,
				goalsService, assetAllocationService, goalFormulaeService, appConfig, busyIndicator) {
			
			this.scope = $scope;

			this.scope.vacation = {};
			this.goalModelObject = this.scope.vacation;
			
			this.scope.modelVal = vacationService.getSavedValues();
			if( (this.scope.modelVal.A1 == "" || this.scope.modelVal.A1 == undefined) && sessionStorage.getItem('goalDetailsTemp')) {
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
			this.goalTypeService = vacationService;
			
			this.scope.showEquityModal = angular.bind( this, this.showEquityModal );
			this.scope.callModel = angular.bind( this, this.callModel );
			this.scope.reloadRoute = angular.bind( this, this.reloadRoute );
			this.scope.appendValues = angular.bind( this, this.appendValues );
			this.scope.getAssetAllocationCategory = angular.bind( this, this.getAssetAllocationCategory );
			this.scope.calculateRecommendedSIP = angular.bind( this, this.calculateRecommendedSIP );
			this.scope.calculateCorpus = angular.bind( this, this.calculateCorpus);
			this.scope.estimateSelectionChanged = angular.bind( this, this.estimateSelectionChanged);
			this.scope.handleGoalEstimatesResponse = angular.bind( this, this.handleGoalEstimatesResponse);
			this.scope.noEstimateSelection = angular.bind( this, this.noEstimateSelection);
			
			this.rootScope.showPortfolioFactoring = true;

			this.scope.changeDebtModal = angular.bind(this, this.changeDebtModal );
			this.scope.changeEquityModal = angular.bind(this, this.changeEquityModal );
			this.scope.saveEquityDebtMix = angular.bind(this, this.saveEquityDebtMix );
			this.scope.getFundData = angular.bind(this, this.getFundData );

			this.scope.getGoalGraphDetails = angular.bind(this, this.getGoalGraphDetails ); 
			this.scope.getGraphObject = angular.bind(this, this.getGraphObject ); 
            this.scope.graphObject = this.scope.getGraphObject();
            this.scope.resetAllocation = angular.bind(this, this.resetAllocation);

            this.scope.budgetInfoText = [{'tip' : '<h5>A Budget Vacation goal would mean:</h5><p>Planning the vacation of your choice in future with budget travel and a standard 3-star hotel stay.</p><h5>How the estimated value is calculated:</h5><ul><li>Based on thorough research of existing travel and stay options in India and abroad, we estimate the current cost of your chosen vacation.</li><li>The current cost is projected to grow at the rate of inflation (6% for domestic and 2% for international) to arrive at the actual cost you will need to bear in future. </li><li>Any existing savings for this goal is projected to grow at 8% annually, and reduced from the target amount.</li><li>The monthly savings required is calculated based on projected investment growth.</li></ul>'}];
            this.scope.comfInfoText = [{'tip' : '<h5>A Comfortable Vacation goal would mean:</h5><p>Planning the vacation of your choice in future with economy class air travel and a standard 4-star hotel stay.</p><h5>How the estimated value is calculated:</h5><ul><li>Based on thorough research of existing travel and stay options in India and abroad, we estimate the current cost of your chosen vacation.</li><li>The current cost is projected to grow at the rate of inflation (6% for domestic and 2% for international) to arrive at the actual cost you will need to bear in future. </li><li>Any existing savings for this goal is projected to grow at 8% annually, and reduced from the target amount.</li><li>The monthly savings required is calculated based on projected investment growth.</li></ul>'}];
            this.scope.luxuInfoText = [{'tip' : '<h5>A Luxury Vacation goal would mean:</h5><p>Planning the vacation of your choice in future with business class travel and a standard 5-star hotel stay.</p><h5>How the estimated value is calculated:</h5><ul><li>Based on thorough research of existing travel and stay options in India and abroad, we estimate the current cost of your chosen vacation.</li><li>The current cost is projected to grow at the rate of inflation (6% for domestic and 2% for international) to arrive at the actual cost you will need to bear in future. </li><li>Any existing savings for this goal is projected to grow at 8% annually, and reduced from the target amount.</li><li>The monthly savings required is calculated based on projected investment growth.</li></ul>'}];

			this.scope.calculateEstimates = function() {
				var self = this;
				if (!$scope.vacation['tenure']) {
					self.getAssetAllocationCategory();
				}
				vacationService.getCorpusEstimates($scope.vacation['tenure'], $scope.modelVal.A5, $scope.modelVal.A6, $scope.modelVal.A7, $scope.modelVal.A8)
				.then(self.handleGoalEstimatesResponse);
			}

			$scope.loadDefaultValues = function() {
				if($rootScope.userFlags['user_answers']['vacation']['goal_plan_type'] == 'op2')
                {
                    $rootScope.selectedCriteria = 'op2';
                }
				if($rootScope.userFlags['user_answers']['vacation']['goal_plan_type'] == 'op1')
                { 
                    $rootScope.selectedCriteria = 'op1';
                } 
			}

			if($location.$$path == '/vacationStarted'){
				$scope.loadDefaultValues();
			}

			this.scope.fundSelectionVacation = function(modelVal) {
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
					fundSelectionObj.number_of_members = modelVal.A5;
					fundSelectionObj.number_of_days = modelVal.A6;
					fundSelectionObj.location = modelVal.A7;
					fundSelectionObj.amount_saved = modelVal.A8;
					fundSelectionObj.estimate_selection_type = modelVal.estimate_selection_type;
					fundSelectionObj.goal_plan_type = $rootScope.selectedCriteria;
					fundSelectionObj.goal_name = modelVal.A1;
					console.log('fundSelectionObj2', fundSelectionObj);
				}

				busyIndicator.show();
				goalsService.addParticularGoal(fundSelectionObj, 'vacation').then(function(data){
					if('success' in data) {
						vacationService.setSavedValues(modelVal);
						console.log('Goal added successfully');
						self.getFundData('vacation', busyIndicator);
						
					}
					else {
						console.log('Error in service');
					}
				});
			}
			
		}
		                               
		vacationController.prototype = finApp.goalControllerPrototype;

})();
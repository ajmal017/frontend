(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('othersController',othersController);

		othersController.$inject = ['$scope','$rootScope','$route','$location', '$timeout', 'othersService',
		                              'goalsService', 'assetAllocationService', 'goalFormulaeService', 'appConfig', 'busyIndicator'];
		function othersController($scope,$rootScope,$route,$location,$timeout,othersService,
				goalsService, assetAllocationService, goalFormulaeService, appConfig, busyIndicator) {
			
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

			this.scope.calculateEstimates = function() {
			}

			this.scope.fundSelectionEvents = function(modelVal, date) {
				var self = this;
				console.log("In fund selection", modelVal);

				var d = new Date();
				var fundSelectionObj = {};
				
				fundSelectionObj.corpus = modelVal.A3;
				fundSelectionObj.term = date - d.getFullYear();
				fundSelectionObj.sip = modelVal.A4;
				fundSelectionObj.lumpsum = 0;
				fundSelectionObj.allocation = {
					"debt" : modelVal.assetAllocation.debt,
					"equity" : modelVal.assetAllocation.equity,
					"elss" : "0",
					"liquid" : "0"
				},
				
				fundSelectionObj.goal_name = modelVal.A1;
				console.log('fundSelectionObj',fundSelectionObj);

				busyIndicator.show();
				goalsService.addParticularGoal(fundSelectionObj, 'event').then(function(data){
					if('success' in data) {
						console.log('Goal added successfully');
						self.getFundData('event', busyIndicator);
						busyIndicator.hide();
					}
					else {
						console.log('Error in service');
					}
				});
			}

		}
		                               
		othersController.prototype = finApp.goalControllerPrototype;

})();
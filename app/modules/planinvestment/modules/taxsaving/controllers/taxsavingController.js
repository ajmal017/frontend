(function(){
	'use strict';
	angular
		.module('finApp.planInvest')
		.controller('taxsavingController',taxsavingController);

		taxsavingController.$inject = ['$scope','$rootScope','$route','$location', '$timeout', 'taxsavingService',
		                              'goalsService', 'assetAllocationService', 'goalFormulaeService', 'appConfig', 'busyIndicator', '$filter'];
		function taxsavingController($scope,$rootScope,$route,$location,$timeout,taxsavingService,
				goalsService, assetAllocationService, goalFormulaeService, appConfig, busyIndicator, $filter) {
			
			this.scope = $scope;

			this.scope.taxsaving = {};
			this.goalModelObject = this.scope.taxsaving;
			
			this.scope.modelVal = JSON.parse(sessionStorage.getItem('goalDetailsTemp')) || {};
			if(this.scope.modelVal.A1 == "" || this.scope.modelVal.A1 == undefined) {
				this.scope.modelVal = taxsavingService.getSavedValues();
			} else {
				
			}
			// this.scope.modelVal = taxsavingService.getSavedValues();
			// if(this.scope.modelVal.A1 == "" || this.scope.modelVal.A1 == undefined) {
			// 	this.scope.modelVal = JSON.parse(sessionStorage.getItem('goalDetailsTemp')) || {};
			// } else {
			// 	sessionStorage.removeItem('goalDetailsTemp');
			// }	

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
            this.scope.getFundData = angular.bind(this, this.getFundData );
            this.scope.infoProjTaxSaving = [{'tip' : '<strong>Equity Linked Saving Schemes (ELSS): </strong>are those mutual fund schemes that invest in equities / stock markets with a 3-year lock-in period, and are eligible for tax deduction from your income under Section 80C of the Income Tax Act 1961.<ul><li>You can invest up to <span class=currency>&#8377</span> 1.5 lakhs u/s 80C, and save up to <span class=currency>&#8377</span> 46,350 on your taxes (subject to individual tax slab).</li><li>ELSS returns are typically higher than other tax saving options over the long term (projected at 15% annualized, ideally for investment duration > 5 years), but they carry the risk of equity markets and can fluctuate in the short term.</li><li>ELSS offers one of the lowest lock-in period of 3 years compared to other tax saving instruments.</li></ul>'}];
            this.scope.infoProjInvGrowth = [{'tip' : '<strong>Explanation of Growth estimates:</strong><ul><li>All future projections are based on historic returns and cannot be guaranteed.</li><li>ELSS fund returns projected at 15.0% annualized.</li><li>All projections are annual, compounded monthly.</li></ul><strong>Disclaimer:</strong><ul><li>Mutual fund investments are subject to market risks. Please read the offer documents carefully before investing.</li></ul>'}];
            this.rootScope.tipData = [{'tip' : ''}]

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
			
			$scope.getDefaultGoalName = function() {
				var currentYear = new Date(),
					currentYear = $filter('date')(currentYear, 'yy');
				var nextYear = +currentYear + 1;	
				return "My Tax Plan FY" + currentYear + "-" + nextYear;
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

			if(this.rootScope.selectedCriteria == 'op2') {
				$scope.computeFutureEligibility();
			}

			this.scope.fundSelectionSaveTax = function(modelVal) {
				console.log('modelVal', modelVal);
				var fundSelectionObj = {};

				fundSelectionObj.estimate_needed = modelVal.A3?'op2':'op1';
				fundSelectionObj.pff = modelVal.A3 || 0
				fundSelectionObj.insurance = modelVal.A4 || 0
				fundSelectionObj.loan = modelVal.A5 || 0
				fundSelectionObj.elss = modelVal.A6 || 0
				fundSelectionObj.amount_allowed = '150000';
				fundSelectionObj.amount_invested = modelVal.A2;

				console.log('fundSelectionObj', fundSelectionObj);
				busyIndicator.show();
				goalsService.addParticularGoal(fundSelectionObj, 'tax').then(function(data){
					if('success' in data) {
						console.log('Goal added successfully');
						taxsavingService.setSavedValues(modelVal);
						self.getFundData('tax', busyIndicator);
						
					}
					else {
						console.log('Error in service');
					}
				});
			}


		}
		                               
		taxsavingController.prototype = finApp.goalControllerPrototype;

})();